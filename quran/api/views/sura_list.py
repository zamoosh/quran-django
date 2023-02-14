from .imports import *


def sura_list(request):
    context = {
        'sura_list': list(Text.objects.filter().values('sura', 'sura_name').distinct().order_by('sura'))
    }
    return JsonResponse(context)
