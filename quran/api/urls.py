from django.urls import path
from .views import *

app_name = 'api'

urlpatterns = [
    # to fill sura, page and juz list
    path('sura_juz_page_list/', sura_juz_page_list, name='sura_juz_page_list'),

    # 3 following urls, for getting data
    path('sura_details/<int:sura_id>/', sura_details, name='sura_details'),
    path('juz_details/<int:juz_id>/', juz_details, name='juz_details'),
    path('page_details/<int:page_id>/', page_details, name='page_details'),
    path('get_pack/<int:pack_number>/', get_pack, name='get_pack'),
    path('sura_aya/<int:sura_id>/<int:aya_id>/', sura_aya, name='sura_aya'),
]
