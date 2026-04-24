import json

from django.db import migrations


def safe_int(value, default=0):
    try:
        if value in (None, ''):
            return default
        if isinstance(value, str):
            value = value.replace('.', '').replace(',', '').strip()
        return int(value)
    except (TypeError, ValueError):
        return default


def migrate_sale_and_import_items(apps, schema_editor):
    Product = apps.get_model('core', 'Product')
    Sale = apps.get_model('core', 'Sale')
    Import = apps.get_model('core', 'Import')
    SaleItem = apps.get_model('core', 'SaleItem')
    ImportItem = apps.get_model('core', 'ImportItem')

    product_map = {product.code: product.id for product in Product.objects.all()}

    for sale in Sale.objects.all():
        try:
            items = json.loads(sale.items_detail or '[]')
        except (TypeError, ValueError, json.JSONDecodeError):
            items = []
        for item in items:
            product_code = item.get('productId') or ''
            SaleItem.objects.create(
                sale_id=sale.id,
                product_id=product_map.get(product_code),
                product_code=product_code,
                product_name=item.get('name', ''),
                unit=item.get('unit', ''),
                quantity=safe_int(item.get('qty', 0)),
                unit_price=safe_int(item.get('price', 0)),
                import_price=safe_int(item.get('importPrice', 0)),
            )

    for import_record in Import.objects.all():
        try:
            items = json.loads(import_record.items_detail or '[]')
        except (TypeError, ValueError, json.JSONDecodeError):
            items = []
        for item in items:
            product_code = item.get('productId') or ''
            ImportItem.objects.create(
                import_record_id=import_record.id,
                product_id=product_map.get(product_code),
                product_code=product_code,
                product_name=item.get('name', ''),
                unit=item.get('unit', ''),
                quantity=safe_int(item.get('qty', 0)),
                unit_price=safe_int(item.get('price', 0)),
                import_price=safe_int(item.get('importPrice', item.get('price', 0))),
            )


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_saleitem_importitem'),
    ]

    operations = [
        migrations.RunPython(migrate_sale_and_import_items, migrations.RunPython.noop),
    ]
