# Generated by Django 4.1.6 on 2023-02-15 21:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quran', '0002_text_sura_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='text',
            name='page',
            field=models.IntegerField(null=True),
        ),
    ]
