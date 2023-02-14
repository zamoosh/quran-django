from django.urls import path
from .views import *

urlpatterns = [
    path('sura_list/', sura_list, name='sura_list'),
    path('juz_list/', juz_list, name='juz_list'),
]
