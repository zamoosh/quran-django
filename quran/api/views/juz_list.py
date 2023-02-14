from .imports import *


def juz_list(request):
    context = {
        'surah': Text.objects.filter(index=1),
    }
    return JsonResponse(context)
