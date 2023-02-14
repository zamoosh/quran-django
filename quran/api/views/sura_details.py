from .imports import *


def sura_details(request, sura_id):
    print(sura_id)
    # page: dict = Text.get_page()
    context = {
        'sura': list(Text.objects.filter(sura=sura_id).values()),
    }
    return JsonResponse(context)
