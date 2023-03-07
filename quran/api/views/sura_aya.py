from .imports import *


def sura_aya(request, sura_id, aya_id):
    print(sura_id, aya_id)
    pack_id = Text.objects.filter(sura=sura_id, aya=aya_id).first().pack_id
    pack = Text.objects.filter(pack_id=pack_id)
    page_number = Text.objects.filter(sura=sura_id).values('page').distinct().first().get('page')
    context = {
        'pack': list(pack.values()),
        'pack_id': pack_id,
        'page_number': page_number
    }
    return JsonResponse(context, status=200)
