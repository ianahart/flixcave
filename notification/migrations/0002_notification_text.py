# Generated by Django 4.0.4 on 2022-08-26 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='text',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
