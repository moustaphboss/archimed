# Generated by Django 5.0.7 on 2024-07-22 15:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('archimed', '0005_company'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='company',
            name='fee_percentage',
        ),
    ]
