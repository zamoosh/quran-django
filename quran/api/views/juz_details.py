from .imports import *


def juz_details(request, juz_id):
    print(juz_id)
    context = {
        # 'juz': juz.keys(),
    }
    return JsonResponse(context)
