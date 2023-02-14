from django.urls import path
from .views import *

app_name = 'api'

urlpatterns = [
    path('sura_juz_page_list/', sura_juz_page_list, name='sura_juz_page_list'),
    path('sura_details/<int:sura_id>/', sura_details, name='sura_details'),
    path('juz_details/<int:juz_id>/', juz_details, name='juz_details'),
    path('page_details/<int:page_id>/', page_details, name='page_details'),
]
