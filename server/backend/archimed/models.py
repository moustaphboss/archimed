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
