from rest_framework import serializers

from .models import Customer, Import, ImportItem, Product, Sale, SaleItem, Supplier
from .utils import (
    apply_stock_delta,
    format_transaction_date,
    parse_transaction_date,
    resolve_related_by_name,
)


def safe_int(value, default=0):
    try:
        if value in (None, ""):
            return default
        if isinstance(value, str):
            value = value.replace(".", "").replace(",", "").strip()
        return int(value)
    except (TypeError, ValueError):
        return default


def format_currency(amount):
    try:
        return f"{int(amount):,}".replace(",", ".") + " <u>&#273;</u>"
    except (TypeError, ValueError):
        return f"{amount} <u>&#273;</u>"


class CodeLookupModelSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    code = serializers.CharField(required=False)

    class Meta:
        fields = ["id", "code"]

    def get_id(self, obj):
        return obj.code


class ProductSerializer(CodeLookupModelSerializer):
    priceRaw = serializers.IntegerField(source="price", read_only=True)
    importPrice = serializers.IntegerField(source="import_price", read_only=True)
    expiryDate = serializers.CharField(source="expiry_date", read_only=True)
    price = serializers.SerializerMethodField()

    class Meta(CodeLookupModelSerializer.Meta):
        model = Product
        fields = [
            "id",
            "code",
            "name",
            "unit",
            "price",
            "priceRaw",
            "importPrice",
            "stock",
            "status",
            "expiryDate",
        ]

    def get_price(self, obj):
        return format_currency(obj.price)

    def create(self, validated_data):
        payload = self.initial_data
        return Product.objects.create(
            code=payload.get("id", payload.get("code")),
            name=payload.get("name", ""),
            unit=payload.get("unit", ""),
            price=safe_int(payload.get("priceRaw", payload.get("price", 0))),
            import_price=safe_int(payload.get("importPrice", payload.get("import_price", 0))),
            stock=safe_int(payload.get("stock", 0)),
            status=payload.get("status", ""),
            expiry_date=payload.get("expiryDate", payload.get("expiry_date", "")),
        )

    def update(self, instance, validated_data):
        payload = self.initial_data
        instance.name = payload.get("name", instance.name)
        instance.unit = payload.get("unit", instance.unit)
        instance.price = safe_int(payload.get("priceRaw", instance.price), instance.price)
        instance.import_price = safe_int(
            payload.get("importPrice", instance.import_price),
            instance.import_price,
        )
        instance.stock = safe_int(payload.get("stock", instance.stock), instance.stock)
        instance.status = payload.get("status", instance.status)
        instance.expiry_date = payload.get("expiryDate", instance.expiry_date)
        instance.save()
        return instance


class CustomerSerializer(CodeLookupModelSerializer):
    class Meta(CodeLookupModelSerializer.Meta):
        model = Customer
        fields = ["id", "code", "name", "phone", "address", "orders", "total", "note"]

    def create(self, validated_data):
        payload = self.initial_data
        return Customer.objects.create(
            code=payload.get("code", payload.get("id")),
            name=payload.get("name", ""),
            phone=payload.get("phone", ""),
            address=payload.get("address", ""),
            orders=safe_int(payload.get("orders", 0)),
            total=payload.get("total", ""),
            note=payload.get("note", ""),
        )

    def update(self, instance, validated_data):
        payload = self.initial_data
        instance.name = payload.get("name", instance.name)
        instance.phone = payload.get("phone", instance.phone)
        instance.address = payload.get("address", instance.address)
        instance.orders = safe_int(payload.get("orders", instance.orders), instance.orders)
        instance.total = payload.get("total", instance.total)
        instance.note = payload.get("note", instance.note)
        instance.save()
        return instance


class SupplierSerializer(CodeLookupModelSerializer):
    class Meta(CodeLookupModelSerializer.Meta):
        model = Supplier
        fields = ["id", "code", "name", "contact", "phone", "address"]

    def create(self, validated_data):
        payload = self.initial_data
        return Supplier.objects.create(
            code=payload.get("code", payload.get("id")),
            name=payload.get("name", ""),
            contact=payload.get("contact", ""),
            phone=payload.get("phone", ""),
            address=payload.get("address", ""),
        )

    def update(self, instance, validated_data):
        payload = self.initial_data
        instance.name = payload.get("name", instance.name)
        instance.contact = payload.get("contact", instance.contact)
        instance.phone = payload.get("phone", instance.phone)
        instance.address = payload.get("address", instance.address)
        instance.save()
        return instance


class TransactionItemInputSerializer(serializers.Serializer):
    productId = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, allow_blank=True)
    unit = serializers.CharField(required=False, allow_blank=True)
    qty = serializers.IntegerField(required=False, default=0)
    price = serializers.IntegerField(required=False, default=0)
    importPrice = serializers.IntegerField(required=False, default=0)


class SaleSerializer(CodeLookupModelSerializer):
    itemsDetail = TransactionItemInputSerializer(many=True, required=False)
    itemsStr = serializers.CharField(source="items_str", read_only=True)
    totalRaw = serializers.IntegerField(source="total_raw", read_only=True)
    date = serializers.SerializerMethodField()
    customer = serializers.SerializerMethodField()

    class Meta(CodeLookupModelSerializer.Meta):
        model = Sale
        fields = [
            "id",
            "code",
            "date",
            "customer",
            "phone",
            "address",
            "items",
            "itemsDetail",
            "itemsStr",
            "total",
            "totalRaw",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["date"] = self.get_date(instance)
        data["customer"] = self.get_customer(instance)
        data["itemsDetail"] = [
            {
                "productId": item.product.code if item.product else item.product_code,
                "name": item.product_name,
                "unit": item.unit,
                "qty": item.quantity,
                "price": item.unit_price,
                "importPrice": item.import_price,
            }
            for item in instance.line_items.select_related("product").all()
        ]
        return data

    def get_date(self, instance):
        return format_transaction_date(instance.transaction_date)

    def get_customer(self, instance):
        return instance.customer.name if instance.customer else instance.customer_name

    def _replace_items(self, sale, items_detail):
        old_items = list(sale.line_items.all())
        sale.line_items.all().delete()
        created_items = []
        for item in items_detail:
            product_code = item.get("productId", "")
            product = Product.objects.filter(code=product_code).first() if product_code else None
            created_items.append(SaleItem.objects.create(
                sale=sale,
                product=product,
                product_code=product.code if product else product_code,
                product_name=item.get("name", ""),
                unit=item.get("unit", ""),
                quantity=safe_int(item.get("qty", 0)),
                unit_price=safe_int(item.get("price", 0)),
                import_price=safe_int(item.get("importPrice", 0)),
            ))
        apply_stock_delta(Product, old_items, created_items, direction=-1)

    def _apply_header_fields(self, sale, payload):
        customer_name = payload.get("customer", sale.customer_name)
        sale.transaction_date = parse_transaction_date(payload.get("date", sale.transaction_date))
        sale.customer = resolve_related_by_name(Customer, customer_name)
        sale.customer_name = customer_name or ""
        sale.phone = payload.get("phone", sale.phone)
        sale.address = payload.get("address", sale.address)
        sale.items = safe_int(payload.get("items", sale.items), sale.items)
        sale.items_str = payload.get("itemsStr", sale.items_str)
        sale.total = payload.get("total", sale.total)
        sale.total_raw = safe_int(payload.get("totalRaw", sale.total_raw), sale.total_raw)

    def create(self, validated_data):
        payload = self.initial_data
        sale = Sale.objects.create(
            code=payload.get("id", payload.get("code")),
            phone=payload.get("phone", ""),
            address=payload.get("address", ""),
            items=safe_int(payload.get("items", 0)),
            items_str=payload.get("itemsStr", ""),
            total=payload.get("total", ""),
            total_raw=safe_int(payload.get("totalRaw", 0)),
        )
        self._apply_header_fields(sale, payload)
        sale.save()
        self._replace_items(sale, payload.get("itemsDetail", []))
        return sale

    def update(self, instance, validated_data):
        payload = self.initial_data
        self._apply_header_fields(instance, payload)
        instance.save()
        if "itemsDetail" in payload:
            self._replace_items(instance, payload.get("itemsDetail", []))
        return instance


class ImportSerializer(CodeLookupModelSerializer):
    itemsDetail = TransactionItemInputSerializer(many=True, required=False)
    totalRaw = serializers.IntegerField(source="total_raw", read_only=True)
    date = serializers.SerializerMethodField()
    supplier = serializers.SerializerMethodField()

    class Meta(CodeLookupModelSerializer.Meta):
        model = Import
        fields = [
            "id",
            "code",
            "date",
            "supplier",
            "phone",
            "address",
            "items",
            "itemsDetail",
            "total",
            "totalRaw",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["date"] = self.get_date(instance)
        data["supplier"] = self.get_supplier(instance)
        data["itemsDetail"] = [
            {
                "productId": item.product.code if item.product else item.product_code,
                "name": item.product_name,
                "unit": item.unit,
                "qty": item.quantity,
                "price": item.unit_price,
                "importPrice": item.import_price,
            }
            for item in instance.line_items.select_related("product").all()
        ]
        return data

    def get_date(self, instance):
        return format_transaction_date(instance.transaction_date)

    def get_supplier(self, instance):
        return instance.supplier.name if instance.supplier else instance.supplier_name

    def _replace_items(self, import_record, items_detail):
        old_items = list(import_record.line_items.all())
        import_record.line_items.all().delete()
        created_items = []
        for item in items_detail:
            product_code = item.get("productId", "")
            product = Product.objects.filter(code=product_code).first() if product_code else None
            created_items.append(ImportItem.objects.create(
                import_record=import_record,
                product=product,
                product_code=product.code if product else product_code,
                product_name=item.get("name", ""),
                unit=item.get("unit", ""),
                quantity=safe_int(item.get("qty", 0)),
                unit_price=safe_int(item.get("price", 0)),
                import_price=safe_int(item.get("importPrice", item.get("price", 0))),
            ))
        apply_stock_delta(Product, old_items, created_items, direction=1)

    def _apply_header_fields(self, import_record, payload):
        supplier_name = payload.get("supplier", import_record.supplier_name)
        import_record.transaction_date = parse_transaction_date(payload.get("date", import_record.transaction_date))
        import_record.supplier = resolve_related_by_name(Supplier, supplier_name)
        import_record.supplier_name = supplier_name or ""
        import_record.phone = payload.get("phone", import_record.phone)
        import_record.address = payload.get("address", import_record.address)
        import_record.items = safe_int(payload.get("items", import_record.items), import_record.items)
        import_record.total = payload.get("total", import_record.total)
        import_record.total_raw = safe_int(payload.get("totalRaw", import_record.total_raw), import_record.total_raw)

    def create(self, validated_data):
        payload = self.initial_data
        import_record = Import.objects.create(
            code=payload.get("id", payload.get("code")),
            phone=payload.get("phone", ""),
            address=payload.get("address", ""),
            items=safe_int(payload.get("items", 0)),
            total=payload.get("total", ""),
            total_raw=safe_int(payload.get("totalRaw", 0)),
        )
        self._apply_header_fields(import_record, payload)
        import_record.save()
        self._replace_items(import_record, payload.get("itemsDetail", []))
        return import_record

    def update(self, instance, validated_data):
        payload = self.initial_data
        self._apply_header_fields(instance, payload)
        instance.save()
        if "itemsDetail" in payload:
            self._replace_items(instance, payload.get("itemsDetail", []))
        return instance
