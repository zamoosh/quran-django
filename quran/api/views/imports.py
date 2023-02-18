from django.http import JsonResponse
from django.db.models import Max, Value, F

from quran.models import Text, Pack

import json
