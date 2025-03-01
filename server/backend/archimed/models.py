from django.db import models

class Investor(models.Model):
    INVESTMENT_CHOICES = [
        ('upfront', 'Upfront'),
        ('yearly', 'Yearly'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    amount_invested = models.DecimalField(max_digits=10, decimal_places=2)
    investment_date = models.DateField()
    payment_type = models.CharField(max_length=10, choices=INVESTMENT_CHOICES, default='yearly')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Bill(models.Model):
    BILL_TYPE_CHOICES = [
        ('membership', 'Membership'),
        ('upfront', 'Upfront'),
        ('yearly', 'Yearly'),
    ]

    investor = models.ForeignKey(Investor, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=BILL_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    validated = models.BooleanField(default=False)
    issue_date = models.DateField()
    bill_code = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"Bill for {self.investor} - Type: {self.type} - Amount: {self.amount} - Validated: {self.validated}"

class Company(models.Model):
    name = models.CharField(max_length=255)
    fee_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    iban = models.CharField(max_length=34)

    def __str__(self):
        return self.name
    
class CapitalCall(models.Model):
    STATUS_CHOICES = [
        ('validated', 'Validated'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]

    company_name = models.CharField(max_length=255)
    company_iban = models.CharField(max_length=34)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sent')

    def __str__(self):
        return f"{self.company_name} - {self.first_name} {self.last_name} - {self.date}"