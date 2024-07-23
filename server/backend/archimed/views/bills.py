from rest_framework import status
import datetime
from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from ..models import Investor, Bill, Company
from ..serializers import  BillSerializer
from rest_framework.response import Response

class GenerateBillsView(APIView):
    def post(self, request):
        current_date = datetime.date.today()
        company = get_object_or_404(Company)
        fee_percentage = Decimal(company.fee_percentage) / 100

        # Retrieving all investors
        investors = Investor.objects.all()

        for investor in investors:
            self.generate_bills_for_investor(investor, current_date, fee_percentage)

        return Response({'message': 'Bills generated successfully'}, status=status.HTTP_201_CREATED)

    def generate_bills_for_investor(self, investor, current_date, fee_percentage):
        investment_date = investor.investment_date
        amount_invested = investor.amount_invested
        last_name = investor.last_name
        investor_id = investor.id

        if amount_invested < 50000:
            self.create_membership_bills(investor, investment_date, current_date, last_name, investor_id)
        
        if investor.payment_type == 'upfront':
            self.create_upfront_bill(investor, investment_date, fee_percentage, amount_invested, last_name, investor_id)
        else:
            self.create_yearly_bills(investor, investment_date, current_date, fee_percentage, amount_invested, last_name, investor_id)

    def create_membership_bills(self, investor, investment_date, current_date, last_name, investor_id):
        start_year = investment_date.year
        end_year = current_date.year

        # Generating a membership bill for the first year on the investment date
        self.create_bill_if_not_exists(
            investor, 'membership', 3000, investment_date, last_name, investor_id
        )

        # Generating membership bills for each subsequent year on January 1st
        for year in range(start_year + 1, end_year + 1):
            self.create_bill_if_not_exists(
                investor, 'membership', 3000, datetime.date(year, 1, 1), last_name, investor_id
            )

    def create_upfront_bill(self, investor, investment_date, fee_percentage, amount_invested, last_name, investor_id):
        upfront_fee = fee_percentage * amount_invested * 5
        self.create_bill_if_not_exists(
            investor, 'upfront', upfront_fee, investment_date, last_name, investor_id
        )

    def create_yearly_bills(self, investor, investment_date, current_date, fee_percentage, amount_invested, last_name, investor_id):
        cutoff_date = datetime.date(2019, 4, 1)
        start_date = investment_date

        for year in range(start_date.year, current_date.year + 1):
            if investment_date < cutoff_date:
                fee = self.calculate_yearly_fee(start_date, year, fee_percentage, amount_invested)
            else:
                fee = self.calculate_adjusted_yearly_fee(start_date, year, fee_percentage, amount_invested)

            issue_date = self.get_issue_date(start_date, year)
            bill_code = self.get_bill_code(start_date, year, 'yearly', last_name, investor_id)

            self.create_bill_if_not_exists(
                investor, 'yearly', fee, issue_date, last_name, investor_id
            )

    def calculate_yearly_fee(self, start_date, year, fee_percentage, amount_invested):
        if year == start_date.year:
            end_date = datetime.date(year, 12, 31)
            days_in_year = (end_date - start_date).days + 1
            total_days = 366 if start_date.year % 4 == 0 else 365
            return (Decimal(days_in_year) / Decimal(total_days)) * fee_percentage * amount_invested
        else:
            return fee_percentage * amount_invested

    def calculate_adjusted_yearly_fee(self, start_date, year, fee_percentage, amount_invested):
        adjustments = {
            1: Decimal('0.002'),
            2: Decimal('0.005'),
            3: Decimal('0.01')
        }
        adjustment = adjustments.get(year - start_date.year, Decimal('0.01'))
        return (fee_percentage - adjustment) * amount_invested

    def get_issue_date(self, start_date, year):
        if year == start_date.year:
            return start_date
        else:
            return datetime.date(year, 1, 1)

    def get_bill_code(self, start_date, year, bill_type, last_name, investor_id):
        return f"{start_date.strftime('%b')}_{year}_{bill_type}_{last_name}{investor_id}"

    def create_bill_if_not_exists(self, investor, bill_type, amount, issue_date, last_name, investor_id):
        bill_code = self.get_bill_code(issue_date, issue_date.year, bill_type, last_name, investor_id)
        if not Bill.objects.filter(bill_code=bill_code).exists():
            Bill.objects.create(
                investor=investor,
                type=bill_type,
                amount=amount,
                bill_code=bill_code,
                issue_date=issue_date,
                validated=False
            )

class BillsListView(APIView):
    def get(self, request):
        bills = Bill.objects.all().order_by('validated')
        serializer = BillSerializer(bills, many=True)
        return Response(serializer.data)
    
class ValidateBillView(APIView):
    def post(self, request, bill_id):
        bill = get_object_or_404(Bill, id=bill_id)
        bill.validated = True
        bill.save()
        return Response({'message': 'Bill validated successfully'}, status=status.HTTP_200_OK)
