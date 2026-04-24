from django.db import models


class Product(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50)
    price = models.IntegerField()
    import_price = models.IntegerField()
    stock = models.IntegerField(default=0)
    status = models.CharField(max_length=50)
    expiry_date = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Customer(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    orders = models.IntegerField(default=0)
    total = models.CharField(max_length=50)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Supplier(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return f"{self.code} - {self.name}"

class Sale(models.Model):
    code = models.CharField(max_length=20, unique=True)
    transaction_date = models.DateField(null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    customer_name = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=20)
    address = models.TextField()
    items = models.IntegerField(default=0)
    items_str = models.TextField()
    total = models.CharField(max_length=50)
    total_raw = models.IntegerField()

    def __str__(self):
        return self.code

class Import(models.Model):
    code = models.CharField(max_length=20, unique=True)
    transaction_date = models.DateField(null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='imports')
    supplier_name = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=20)
    address = models.TextField()
    items = models.IntegerField(default=0)
    total = models.CharField(max_length=50)
    total_raw = models.IntegerField()

    def __str__(self):
        return self.code


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='line_items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='sale_items')
    product_code = models.CharField(max_length=20, blank=True, default='')
    product_name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50, blank=True, default='')
    quantity = models.IntegerField(default=0)
    unit_price = models.IntegerField(default=0)
    import_price = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.sale.code} - {self.product_name}"


class ImportItem(models.Model):
    import_record = models.ForeignKey(Import, on_delete=models.CASCADE, related_name='line_items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='import_items')
    product_code = models.CharField(max_length=20, blank=True, default='')
    product_name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50, blank=True, default='')
    quantity = models.IntegerField(default=0)
    unit_price = models.IntegerField(default=0)
    import_price = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.import_record.code} - {self.product_name}"
