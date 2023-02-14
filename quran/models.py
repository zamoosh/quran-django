from django.db import models
from django.conf import settings
import os
import json


class Text(models.Model):
    index = models.AutoField(primary_key=True)
    sura = models.IntegerField()
    sura_name = models.CharField(max_length=100)
    aya = models.IntegerField()
    text = models.TextField()

    @staticmethod
    def get_juz():
        with open(os.path.join(settings.STATICFILES_DIRS[0], 'juz.json5')) as f:
            data = json.loads(f.read())
            f.close()
        return data

    @staticmethod
    def get_page():
        with open(os.path.join(settings.STATICFILES_DIRS[0], 'page.json5')) as f:
            data = json.loads(f.read())
            f.close()
        return data
