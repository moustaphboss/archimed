from rest_framework import viewsets
from ..models import Company
from ..serializers import CompanySerializer
from rest_framework.response import Response

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def create(self, request, *args, **kwargs):
        existing_company = Company.objects.first()
        if existing_company:
            serializer = self.get_serializer(existing_company, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return super().create(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save()
