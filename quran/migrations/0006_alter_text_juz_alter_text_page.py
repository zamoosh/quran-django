# Generated by Django 4.1.6 on 2023-02-17 07:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quran', '0005_alter_text_page'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='juz',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='text',
            name='page',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]