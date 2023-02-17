from .imports import *


def sura_details(request, sura_id):
    current_page = int(Text.objects.filter(sura=sura_id).first().page)
    next_page = current_page + 10
    q = Text.objects.filter(page__gte=current_page, page__lte=next_page)
    context = {
        'pack': list(q.values())
    }
    return JsonResponse(context)
