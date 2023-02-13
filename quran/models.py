from django.db import models


class Text(models.Model):
    index = models.AutoField(primary_key=True)
    sura = models.IntegerField()
    aya = models.IntegerField()
    text = models.TextField()
    page_start = models.IntegerField(null=True)
