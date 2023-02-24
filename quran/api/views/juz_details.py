from .imports import *


def juz_details(request, juz_id):
    pack_id = int(Text.objects.filter(juz=juz_id).first().pack_id)
    pack = Text.objects.filter(pack_id=pack_id)
    page_number = Text.objects.filter(juz=juz_id).values('page').distinct().first().get('page')
    context = {
        'pack': list(pack.values()),
        'pack_id': pack_id,
        'page_number': page_number
    }
    return JsonResponse(context)
