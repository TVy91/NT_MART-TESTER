import json

from django.test import Client, TestCase

from .models import Customer, Import, Product, Sale, Supplier


class ApiSaveTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_save_sale_persists_items_detail_and_totals(self):
        payload = {
            "action": "add",
            "entity": "sales",
            "payload": {
                "id": "BH00000001",
                "date": "23/04/2026",
                "customer": "Khach A",
                "phone": "0900000001",
                "address": "Da Nang",
                "items": 2,
                "itemsStr": "1x SP A, 2x SP B",
                "itemsDetail": [
                    {"productId": "HH00000001", "name": "SP A", "unit": "Chai", "qty": 1, "price": 10000, "importPrice": 8000},
                    {"productId": "HH00000002", "name": "SP B", "unit": "Hop", "qty": 2, "price": 15000, "importPrice": 10000},
                ],
                "total": "40.000 đ",
                "totalRaw": 40000,
            },
        }

        response = self.client.post(
            "/api/save/",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        sale = Sale.objects.get(code="BH00000001")
        self.assertEqual(sale.items, 2)
        self.assertEqual(sale.total_raw, 40000)
        self.assertEqual(json.loads(sale.items_detail)[0]["name"], "SP A")

    def test_update_import_persists_items_detail_and_total(self):
        record = Import.objects.create(
            code="NH00000001",
            date="22/04/2026",
            supplier="NCC A",
            phone="0900000002",
            address="Hue",
            items=1,
            items_detail="[]",
            total="10.000 đ",
            total_raw=10000,
        )

        payload = {
            "action": "update",
            "entity": "imports",
            "payload": {
                "id": record.code,
                "supplier": "NCC B",
                "items": 3,
                "itemsDetail": [
                    {"productId": "HH00000003", "name": "SP C", "unit": "Goi", "qty": 3, "price": 5000, "importPrice": 3000}
                ],
                "total": "15.000 đ",
                "totalRaw": 15000,
            },
        }

        response = self.client.post(
            "/api/save/",
            data=json.dumps(payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        record.refresh_from_db()
        self.assertEqual(record.supplier, "NCC B")
        self.assertEqual(record.items, 3)
        self.assertEqual(record.total_raw, 15000)
        self.assertEqual(json.loads(record.items_detail)[0]["qty"], 3)


class ApiDataTests(TestCase):
    def setUp(self):
        Product.objects.create(
            code="HH00000001",
            name="SP A",
            unit="Chai",
            price=10000,
            import_price=7000,
            stock=5,
            status="Sap het",
            expiry_date="25/12/2026",
        )
        Customer.objects.create(
            code="KH00000001",
            name="Khach A",
            phone="0900000001",
            address="Da Nang",
            orders=1,
            total="10.000 đ",
            note="",
        )
        Supplier.objects.create(
            code="NCC0000001",
            name="NCC A",
            contact="Lien he A",
            phone="0900000002",
            address="Hue",
        )
        Sale.objects.create(
            code="BH00000001",
            date="23/04/2026",
            customer="Khach A",
            phone="0900000001",
            address="Da Nang",
            items=1,
            items_detail='[{"name":"SP A","qty":1,"price":10000}]',
            items_str="1x SP A",
            total="10.000 đ",
            total_raw=10000,
        )
        Import.objects.create(
            code="NH00000001",
            date="23/04/2026",
            supplier="NCC A",
            phone="0900000002",
            address="Hue",
            items=1,
            items_detail='[{"name":"SP A","qty":1,"price":7000}]',
            total="7.000 đ",
            total_raw=7000,
        )
        self.client = Client()

    def test_api_data_returns_parsed_items_detail(self):
        response = self.client.get("/api/data/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["products"][0]["id"], "HH00000001")
        self.assertEqual(data["sales"][0]["itemsDetail"][0]["name"], "SP A")
        self.assertEqual(data["imports"][0]["itemsDetail"][0]["price"], 7000)
