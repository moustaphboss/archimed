from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.bills import BillsListView, GenerateBillsView , ValidateBillView
from .views.investors import InvestorViewSet
from .views.company import CompanyViewSet
from .views.capitalcalls import CapitalCallListCreateView

router = DefaultRouter()
router.register(r'investors', InvestorViewSet)
router.register(r'company', CompanyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate-bills/', GenerateBillsView.as_view(), name='generate-bills'),
    path('bills/', BillsListView.as_view(), name='bill-list'),
    path('bills/validate/<int:bill_id>/', ValidateBillView.as_view(), name='validate-bill'),
    path('capitalcalls/', CapitalCallListCreateView.as_view(), name='capitalcall-list-create'),
]
