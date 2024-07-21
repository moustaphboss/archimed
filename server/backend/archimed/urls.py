# server/backend/archimed/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvestorViewSet, GenerateBillsView, BillsListView

router = DefaultRouter()
router.register(r'investors', InvestorViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate-bills/', GenerateBillsView.as_view(), name='generate-bills'),
    path('bills/', BillsListView.as_view(), name='bill-list'),
]
