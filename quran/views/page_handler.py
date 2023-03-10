from .imports import *


def page_handler(request, page):
    page = Text.objects.filter(page=page).first()
    sura_aya = f"{page.sura}:{page.aya}"
    return redirect(reverse("quran:path_handler", kwargs={"sura_aya": sura_aya}))
