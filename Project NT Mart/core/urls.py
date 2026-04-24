from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("products", views.ProductViewSet, basename="product")
router.register("customers", views.CustomerViewSet, basename="customer")
router.register("suppliers", views.SupplierViewSet, basename="supplier")
router.register("sales", views.SaleViewSet, basename="sale")
router.register("imports", views.ImportViewSet, basename="import")

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("forgot-password/", views.forgot_password_view, name="forgot_password"),
    path("dashboard/", views.dashboard_view, name="dashboard"),
    path("api/data/", views.api_data, name="api_data"),
    path("api/", include(router.urls)),
]
