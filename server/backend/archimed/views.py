from rest_framework import viewsets
from .models import Investor
from .serializers import InvestorSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Investor, Bill
from .serializers import BillSerializer
import datetime
import decimal

class InvestorViewSet(viewsets.ModelViewSet):
    queryset = Investor.objects.all()
    serializer_class = InvestorSerializer

class GenerateBillsView(APIView):
    def post(self, request):
        investors = Investor.objects.all()
        current_year = datetime.date.today().year
        fee_percentage = decimal.Decimal('0.02')


        for investor in investors:
            investment_date = investor.investment_date
            amount_invested = investor.amount_invested

            # Membership fee calculation
            if amount_invested < 50000:
                membership_fee = decimal.Decimal('3000.00')
                Bill.objects.create(
                    investor=investor,
                    type='membership',
                    amount=membership_fee,
                    validated=False
                )

            if investor.payment_type == 'upfront':
                # Upfront fee calculation
                upfront_fee = decimal.Decimal('0.02') * amount_invested * 5  # Replace with your actual upfront fee calculation
                Bill.objects.create(
                    investor=investor,
                    type='upfront',
                    amount=upfront_fee,
                    validated=False
                )
            else:
                # Yearly fee calculation
                start_date = investment_date
                end_date = datetime.date(current_year, 12, 31)
                days_in_year = (end_date - start_date).days + 1
                total_days = 366 if start_date.year % 4 == 0 else 365
                  # Replace with your actual fee percentage
                fee = (decimal.Decimal(days_in_year) / decimal.Decimal(total_days)) * fee_percentage * amount_invested
                Bill.objects.create(
                    investor=investor,
                    type='yearly',
                    amount=fee,
                    validated=False
                )

        return Response({'message': 'Bills generated successfully'}, status=status.HTTP_201_CREATED)

class BillsListView(APIView):
    def get(self, request):
        bills = Bill.objects.all()
        serializer = BillSerializer(bills, many=True)
        return Response(serializer.data)