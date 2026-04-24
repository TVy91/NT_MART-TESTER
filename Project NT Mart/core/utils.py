from datetime import datetime

from django.db import models


DATE_INPUT_FORMATS = [
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%Y-%m-%d",
]


def parse_transaction_date(value):
    if not value:
        return None
    if hasattr(value, "year") and hasattr(value, "month") and hasattr(value, "day"):
        return value

    raw_value = str(value).strip()
    for fmt in DATE_INPUT_FORMATS:
        try:
            return datetime.strptime(raw_value, fmt).date()
        except ValueError:
            continue
    return None


def format_transaction_date(value):
    if not value:
        return ""
    return value.strftime("%d-%m-%Y")


def resolve_related_by_name(model_class, name):
    if not name:
        return None
    return model_class.objects.filter(name__iexact=str(name).strip()).first()


def compute_quantity_map(items):
    quantity_map = {}
    for item in items:
        product_id = getattr(item, "product_id", None)
        if not product_id:
            continue
        quantity_map[product_id] = quantity_map.get(product_id, 0) + int(getattr(item, "quantity", 0) or 0)
    return quantity_map


def apply_stock_delta(product_model, old_items, new_items, direction):
    old_map = compute_quantity_map(old_items)
    new_map = compute_quantity_map(new_items)
    product_ids = set(old_map) | set(new_map)

    for product_id in product_ids:
        delta = direction * (new_map.get(product_id, 0) - old_map.get(product_id, 0))
        if delta:
            product_model.objects.filter(id=product_id).update(stock=models.F("stock") + delta)
