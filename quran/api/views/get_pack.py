from .imports import *


def get_pack(request, pack_number):
    pack = list(Text.objects.filter(pack=pack_number).values())
    page_number = Text.objects.filter(pack=pack_number).values('page').distinct().first().get('page')
    context = {
        'pack': pack,
        'pack_id': pack_number,
        'page_number': page_number
    }
    return JsonResponse(context, status=200)
