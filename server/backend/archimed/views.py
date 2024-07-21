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
        current_date = datetime.date.today()
        fee_percentage = decimal.Decimal('0.02')

        for investor in investors:
            investment_date = investor.investment_date
            amount_invested = investor.amount_invested

            # --- Membership fee calculation ---
            if amount_invested < 50000:
                membership_fee = decimal.Decimal('3000.00')
                bill_code = f"{investment_date.strftime('%b_%Y')}_membership_{investor.last_name}{investor.id}"
                Bill.objects.get_or_create(
                    investor=investor,
                    type='membership',
                    amount=membership_fee,
                    bill_code=bill_code,
                    issue_date=current_date,
                    validated=False
                )

            if investor.payment_type == 'upfront':
                # --- Upfront fee calculation ---
                upfront_fee = fee_percentage * amount_invested * 5
                bill_code = f"{investment_date.strftime('%b_%Y')}_upfront_{investor.last_name}{investor.id}"
                Bill.objects.get_or_create(
                    investor=investor,
                    type='upfront',
                    amount=upfront_fee,
                    bill_code=bill_code,
                    issue_date=current_date,
                    validated=False
                )
            else:
                # --- Yearly fee calculation ---
                start_date = investment_date
                fee_percentage_decimal = decimal.Decimal(fee_percentage)

                # Check if the investment was made before or after April 2019
                cutoff_date = datetime.date(2019, 4, 1)

                if investment_date < cutoff_date:
                    for year in range(start_date.year, current_date.year + 1):
                        if year == start_date.year:
                            end_date = datetime.date(year, 12, 31)
                            days_in_year = (end_date - start_date).days + 1
                            total_days = 366 if start_date.year % 4 == 0 else 365
                            fee = (days_in_year / total_days) * fee_percentage_decimal * amount_invested
                        else:
                            fee = fee_percentage_decimal * amount_invested
                        bill_code = f"{investment_date.strftime('%b')}_{year}_yearly_{investor.last_name}{investor.id}"
                        Bill.objects.get_or_create(
                            investor=investor,
                            type='yearly',
                            amount=fee,
                            bill_code=bill_code,
                            issue_date=current_date,
                            validated=False
                        )
                else:
                    for year in range(start_date.year, current_date.year + 1):
                        if year == start_date.year:
                            end_date = datetime.date(year, 12, 31)
                            days_in_year = (end_date - start_date).days + 1
                            total_days = 366 if start_date.year % 4 == 0 else 365
                            fee = (days_in_year / total_days) * fee_percentage_decimal * amount_invested
                        elif year == start_date.year + 1:
                            fee = fee_percentage_decimal * amount_invested
                        elif year == start_date.year + 2:
                            fee = (fee_percentage_decimal - decimal.Decimal('0.002')) * amount_invested
                        elif year == start_date.year + 3:
                            fee = (fee_percentage_decimal - decimal.Decimal('0.005')) * amount_invested
                        else:
                            fee = (fee_percentage_decimal - decimal.Decimal('0.01')) * amount_invested
                        bill_code = f"{investment_date.strftime('%b')}_{year}_yearly_{investor.last_name}{investor.id}"
                        Bill.objects.get_or_create(
                            investor=investor,
                            type='yearly',
                            amount=fee,
                            bill_code=bill_code,
                            issue_date=current_date,
                            validated=False
                        )

        return Response({'message': 'Bills generated successfully'}, status=status.HTTP_201_CREATED)
    def post(self, request):
        investors = Investor.objects.all()
        current_year = datetime.date.today().year
        fee_percentage = decimal.Decimal('0.02') 

        for investor in investors:
            investment_date = investor.investment_date
            amount_invested = investor.amount_invested
            last_name = investor.last_name
            investor_id = investor.id

            # Membership fee calculation
            if amount_invested < 50000:
                membership_fee = decimal.Decimal('3000.00')
                bill_code = f"{investment_date.strftime('%b_%Y')}_membership_{last_name}{investor_id}"
                Bill.objects.create(
                    investor=investor,
                    type='membership',
                    amount=membership_fee,
                    validated=False,
                    bill_code=bill_code,
                    issue_date=investment_date
                )

            if investor.payment_type == 'upfront':
                # Upfront fee calculation
                upfront_fee = fee_percentage * amount_invested * 5
                bill_code = f"{investment_date.strftime('%b_%Y')}_upfront_{last_name}{investor_id}"
                Bill.objects.create(
                    investor=investor,
                    type='upfront',
                    amount=upfront_fee,
                    validated=False,
                    bill_code=bill_code,
                    issue_date=investment_date
                )
            else:
                # Yearly fee calculation
                start_year = investment_date.year
                end_year = current_year # Replace with your actual fee percentage

                for year in range(start_year, end_year + 1):
                    start_date = datetime.date(year, 1, 1) if year > start_year else investment_date
                    end_date = datetime.date(year, 12, 31)
                    days_in_year = (end_date - start_date).days + 1
                    total_days = 366 if start_date.year % 4 == 0 else 365
                    fee = (decimal.Decimal(days_in_year) / decimal.Decimal(total_days)) * fee_percentage * amount_invested
                    bill_code = f"{start_date.strftime('%b_%Y')}_yearly_{last_name}{investor_id}"
                    Bill.objects.create(
                        investor=investor,
                        type='yearly',
                        amount=fee,
                        validated=False,
                        bill_code=bill_code,
                        issue_date=start_date
                    )

        return Response({'message': 'Bills generated successfully'}, status=status.HTTP_201_CREATED)
class BillsListView(APIView):
    def get(self, request):
        bills = Bill.objects.all()
        serializer = BillSerializer(bills, many=True)
        return Response(serializer.data)