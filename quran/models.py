from django.db import models


class QuranText(models.Model):
    ayah_id = models.AutoField(primary_key=True)  # is unique for every ayah
    surah_id = models.IntegerField()
    ayah = models.IntegerField()
    text = models.TextField()
