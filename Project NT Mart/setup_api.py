import os

models_code = """
from django.db import models

class Product(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50)
    import_price = models.IntegerField()
    price = models.IntegerField()
    stock = models.IntegerField(default=0)
    expiry_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
"""

views_code = """
from django.http import JsonResponse
from .models import Product, Customer

def api_products(request):
    products = list(Product.objects.values())
    return JsonResponse({'data': products})

def api_customers(request):
    customers = list(Customer.objects.values())
    return JsonResponse({'data': customers})
"""

urls_code = """
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/products/', views.api_products, name='api_products'),
    path('api/customers/', views.api_customers, name='api_customers'),
]
"""

with open('core/models.py', 'w', encoding='utf-8') as f:
    f.write(models_code.strip())

with open('core/views.py', 'a', encoding='utf-8') as f:
    f.write('\n' + views_code.strip())

with open('core/urls.py', 'w', encoding='utf-8') as f:
    f.write(urls_code.strip())
