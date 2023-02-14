import json
from django.db.models import Value
from .imports import *


def sura_details(request, sura_id):
    page_data = Text.get_page()
    p = str(page_data)
    start_page = int(p[int(p.find(f'[{sura_id}') - 5)])
    end_page = start_page + 10 + 1

    querysets_to_union = []
    for page in range(start_page, end_page):
        sura_aya = json.loads(page_data[f"{page}"])
        sura_aya_next = json.loads(page_data[f"{page + 1}"])
        if sura_aya[0] == sura_aya_next[0]:
            qs = Text.objects.filter(sura=sura_aya[0], aya__gte=sura_aya[1], aya__lte=sura_aya_next[1])
            qs = qs.annotate(page=Value(page))
            querysets_to_union.append(qs)
        else:
            qs = Text.objects.filter(sura=sura_aya[0], aya__gte=sura_aya[1])
            qs = qs.annotate(page=Value(page))
            querysets_to_union.append(qs)
    final_qs = querysets_to_union[0]
    for qs in querysets_to_union[1:]:
        final_qs = final_qs.union(qs)

    context = {
        'pack': list(final_qs.values()),
    }
    return JsonResponse(context)
