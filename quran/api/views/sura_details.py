from .imports import *


def sura_details(request, sura_id):
    pack_id = int(Text.objects.filter(sura=sura_id).first().pack_id)
    pack = Text.objects.filter(pack_id=pack_id)
    context = {
        'pack': list(pack.values()),
        'pack_id': pack_id
    }
    return JsonResponse(context)
