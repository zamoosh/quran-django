from .imports import *


def juz_list(request):
    juz: dict = Text.get_juz()
    context = {
        'juz': juz.keys(),
    }
    return JsonResponse(context)
