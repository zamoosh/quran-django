# Generated by Django 4.1.6 on 2023-02-17 06:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quran', '0004_text_juz'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='page',
            field=models.DecimalField(decimal_places=0, default=0, max_digits=3),
        ),
    ]
