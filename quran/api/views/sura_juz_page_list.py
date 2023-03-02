from .imports import *


def sura_juz_page_list(request):
    juz: dict = Text.get_juz()
    page: dict = Text.get_page()
    context = {
        'sura_list': list(Text.objects.filter().values('sura', 'sura_name').distinct().order_by('sura')),
        'juz_list': list(juz.keys()),
        'page_list': list(page.keys()),
    }
    return JsonResponse(context, status=200)
