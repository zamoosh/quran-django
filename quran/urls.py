from django.urls import path, include
from .views import *

app_name = 'quran'

urlpatterns = [
    path('', index, name='index'),
    path('sura/<str:sura_aya>/', path_handler, name='path_handler'),

    path('api/', include('quran.api.urls')),
]
