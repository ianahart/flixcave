# Generated by Django 4.0.4 on 2022-08-14 15:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0002_listitem_type_alter_listitem_list'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listitem',
            name='type',
        ),
    ]
