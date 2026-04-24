from datetime import datetime

from django.db import migrations


def parse_date(value):
    if not value:
        return None
    for fmt in ("%d-%m-%Y", "%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(str(value).strip(), fmt).date()
        except ValueError:
            continue
    return None


def backfill_partner_fk_and_dates(apps, schema_editor):
    Customer = apps.get_model('core', 'Customer')
    Supplier = apps.get_model('core', 'Supplier')
    Sale = apps.get_model('core', 'Sale')
    Import = apps.get_model('core', 'Import')

    customer_map = {customer.name.lower(): customer.id for customer in Customer.objects.all()}
    supplier_map = {supplier.name.lower(): supplier.id for supplier in Supplier.objects.all()}

    for sale in Sale.objects.all():
        customer_name = (sale.customer_name or '').strip()
        sale.transaction_date = parse_date(sale.date_text)
        sale.customer_id = customer_map.get(customer_name.lower())
        sale.save(update_fields=['transaction_date', 'customer'])

    for import_record in Import.objects.all():
        supplier_name = (import_record.supplier_name or '').strip()
        import_record.transaction_date = parse_date(import_record.date_text)
        import_record.supplier_id = supplier_map.get(supplier_name.lower())
        import_record.save(update_fields=['transaction_date', 'supplier'])


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_partner_fk_and_dates'),
    ]

    operations = [
        migrations.RunPython(backfill_partner_fk_and_dates, migrations.RunPython.noop),
    ]
