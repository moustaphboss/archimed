from rest_framework import generics
from ..models import CapitalCall
from ..serializers import CapitalCallSerializer

class CapitalCallListCreateView(generics.ListCreateAPIView):
    queryset = CapitalCall.objects.all()
    serializer_class = CapitalCallSerializer