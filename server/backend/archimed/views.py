from rest_framework import viewsets, generics
from .models import Investor, Bill, Company, CapitalCall
from .serializers import InvestorSerializer, BillSerializer, CompanySerializer, CapitalCallSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import datetime
from decimal import Decimal

class InvestorViewSet(viewsets.ModelViewSet):
    queryset = Investor.objects.all()
    serializer_class = InvestorSerializer

class GenerateBillsView(APIView):
    def post(self, request):
        investors = Investor.objects.all()
        current_date = datetime.date.today()

        try:
            company = Company.objects.first()
            if company is None:
                return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
            fee_percentage = Decimal(company.fee_percentage) / 100

        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        for investor in investors:
            investment_date = investor.investment_date
            amount_invested = investor.amount_invested
            last_name = investor.last_name
            investor_id = investor.id

            # --- Membership fee calculation ---
            if amount_invested < 50000:
                start_year = investment_date.year
                end_year = current_date.year

                # Generatingg a membership bill for the first year on the investment date
                bill_code = f"{investment_date.strftime('%b_%Y')}_membership_{last_name}{investor_id}"
                if not Bill.objects.filter(bill_code=bill_code).exists():
                    Bill.objects.create(
                        investor=investor,
                        type='membership',
                        amount=3000,
                        bill_code=bill_code,
                        issue_date=investment_date,
                        validated=False
                    )

                # Generating a membership bill for each subsequent year on January 1st
                for year in range(start_year + 1, end_year + 1):
                    bill_code = f"Jan_{year}_membership_{last_name}{investor_id}"
                    if not Bill.objects.filter(bill_code=bill_code).exists():
                        Bill.objects.create(
                            investor=investor,
                            type='membership',
                            amount=3000,
                            bill_code=bill_code,
                            issue_date=datetime.date(year, 1, 1),
                            validated=False
                        )

            if investor.payment_type == 'upfront':
                # --- Upfront fee calculation ---
                upfront_fee = fee_percentage * amount_invested * 5
                bill_code = f"{investment_date.strftime('%b_%Y')}_upfront_{last_name}{investor_id}"
                if not Bill.objects.filter(bill_code=bill_code).exists():
                    Bill.objects.create(
                        investor=investor,
                        type='upfront',
                        amount=upfront_fee,
                        bill_code=bill_code,
                        issue_date=investment_date,
                        validated=False
                    )
            else:
                # --- Yearly fee calculation ---
                start_date = investment_date
                cutoff_date = datetime.date(2019, 4, 1)

                if investment_date < cutoff_date:
                    for year in range(start_date.year, current_date.year + 1):
                        bill_code = f"{start_date.strftime('%b')}_{year}_yearly_{last_name}{investor_id}"
                        if year == start_date.year:
                            end_date = datetime.date(year, 12, 31)
                            days_in_year = (end_date - start_date).days + 1
                            total_days = 366 if start_date.year % 4 == 0 else 365
                            fee = (Decimal(days_in_year) / Decimal(total_days)) * fee_percentage * amount_invested
                            issue_date = start_date
                        else:
                            fee = fee_percentage * amount_invested
                            issue_date = datetime.date(year, 1, 1)
                        if not Bill.objects.filter(bill_code=bill_code).exists():
                            Bill.objects.create(
                                investor=investor,
                                type='yearly',
                                amount=fee,
                                bill_code=bill_code,
                                issue_date=issue_date,
                                validated=False
                            )
                else:
                    for year in range(start_date.year, current_date.year + 1):
                        bill_code = f"{start_date.strftime('%b')}_{year}_yearly_{last_name}{investor_id}"
                        if year == start_date.year:
                            end_date = datetime.date(year, 12, 31)
                            days_in_year = (end_date - start_date).days + 1
                            total_days = 366 if start_date.year % 4 == 0 else 365
                            fee = (Decimal(days_in_year) / Decimal(total_days)) * fee_percentage * amount_invested
                            issue_date = start_date
                        elif year == start_date.year + 1:
                            fee = fee_percentage * amount_invested
                            issue_date = datetime.date(year, 1, 1)
                        elif year == start_date.year + 2:
                            fee = (fee_percentage - Decimal('0.002')) * amount_invested
                            issue_date = datetime.date(year, 1, 1)
                        elif year == start_date.year + 3:
                            fee = (fee_percentage - Decimal('0.005')) * amount_invested
                            issue_date = datetime.date(year, 1, 1)
                        else:
                            fee = (fee_percentage - Decimal('0.01')) * amount_invested
                            issue_date = datetime.date(year, 1, 1)
                        if not Bill.objects.filter(bill_code=bill_code).exists():
                            Bill.objects.create(
                                investor=investor,
                                type='yearly',
                                amount=fee,
                                bill_code=bill_code,
                                issue_date=issue_date,
                                validated=False
                            )

        return Response({'message': 'Bills generated successfully'}, status=status.HTTP_201_CREATED)
class BillsListView(APIView):
    def get(self, request):
        bills = Bill.objects.all().order_by('validated')
        serializer = BillSerializer(bills, many=True)
        return Response(serializer.data)
    
class ValidateBillView(APIView):
    def post(self, request, bill_id):
        try:
            bill = Bill.objects.get(id=bill_id)
            bill.validated = True
            bill.save()
            return Response({'message': 'Bill validated successfully'}, status=status.HTTP_200_OK)
        except Bill.DoesNotExist:
            return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

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

class CapitalCallListCreateView(generics.ListCreateAPIView):
    queryset = CapitalCall.objects.all()
    serializer_class = CapitalCallSerializer