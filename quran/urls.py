from django.urls import path, include
from .views import *

app_name = 'quran'

urlpatterns = [
    path('', index, name='index'),
    path('<path:anything>/', index, name='index'),
    path('api/', include('quran.api.urls')),
]
