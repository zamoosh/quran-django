from django.urls import path
from .views import *

app_name = 'api'

urlpatterns = [
    path('sura_juz_page_list/', sura_juz_page_list, name='sura_juz_page_list'),
    path('juz_list/', juz_list, name='juz_list'),
]
