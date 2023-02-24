from .imports import *


def page_details(request, page_id):
    pack_id = int(Text.objects.filter(page=page_id).first().pack_id)
    pack = Text.objects.filter(pack_id=pack_id)
    page_number = Text.objects.filter(page=page_id).values('page').distinct().first().get('page')
    context = {
        'pack': list(pack.values()),
        'pack_id': pack_id,
        'page_number': page_number
    }
    return JsonResponse(context)
