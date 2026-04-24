from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Customer, Import, Product, Sale, Supplier
from .serializers import (
    CustomerSerializer,
    ImportSerializer,
    ProductSerializer,
    SaleSerializer,
    SupplierSerializer,
)
from .utils import apply_stock_delta


def render_app(request, initial_view="login"):
    return render(request, "core/index.html", {"initial_view": initial_view})


def index(request):
    return render_app(request, "login")


def login_view(request):
    return render_app(request, "login")


def forgot_password_view(request):
    return render_app(request, "forgotPass")


def dashboard_view(request):
    return render_app(request, "home")


@api_view(["GET"])
def api_data(request):
    return Response(
        {
            "products": ProductSerializer(Product.objects.all(), many=True).data,
            "customers": CustomerSerializer(Customer.objects.all(), many=True).data,
            "suppliers": SupplierSerializer(Supplier.objects.all(), many=True).data,
            "sales": SaleSerializer(
                Sale.objects.all().select_related("customer").prefetch_related("line_items__product"),
                many=True,
            ).data,
            "imports": ImportSerializer(
                Import.objects.all().select_related("supplier").prefetch_related("line_items__product"),
                many=True,
            ).data,
        }
    )


class CodeLookupViewSet(viewsets.ModelViewSet):
    lookup_field = "code"

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({"success": True}, status=status.HTTP_200_OK)


class ProductViewSet(CodeLookupViewSet):
    queryset = Product.objects.all().order_by("code")
    serializer_class = ProductSerializer


class CustomerViewSet(CodeLookupViewSet):
    queryset = Customer.objects.all().order_by("code")
    serializer_class = CustomerSerializer


class SupplierViewSet(CodeLookupViewSet):
    queryset = Supplier.objects.all().order_by("code")
    serializer_class = SupplierSerializer


class SaleViewSet(CodeLookupViewSet):
    queryset = Sale.objects.all().select_related("customer").prefetch_related("line_items__product").order_by("-id")
    serializer_class = SaleSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        old_items = list(instance.line_items.all())
        apply_stock_delta(Product, old_items, [], direction=-1)
        return super().destroy(request, *args, **kwargs)


class ImportViewSet(CodeLookupViewSet):
    queryset = Import.objects.all().select_related("supplier").prefetch_related("line_items__product").order_by("-id")
    serializer_class = ImportSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        old_items = list(instance.line_items.all())
        apply_stock_delta(Product, old_items, [], direction=1)
        return super().destroy(request, *args, **kwargs)
