# Generated by Django 4.1.6 on 2023-02-17 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quran', '0003_text_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='text',
            name='juz',
            field=models.DecimalField(decimal_places=0, default=0, max_digits=2),
        ),
    ]
