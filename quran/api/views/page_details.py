from .imports import *


def page_details(request, page_id):
    print(page_id)
    context = {
        'juz': juz.keys(),
    }
    return JsonResponse(context)
