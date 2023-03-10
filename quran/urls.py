from django.urls import path, include
from .views import *

app_name = 'quran'

urlpatterns = [
    path('', index, name='index'),
    path("home/", home, name="home"),

    path('sura/<str:sura_aya>/', path_handler, name='path_handler'),
    path('page/<str:page>/', page_handler, name='page_handler'),
    path('juz/<str:juz>/', juz_handler, name='juz_handler'),

    path('api/', include('quran.api.urls')),
]
