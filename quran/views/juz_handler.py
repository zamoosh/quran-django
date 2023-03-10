from .imports import *


def juz_handler(request, juz):
    juz = Text.objects.filter(juz=juz).first()
    sura_aya = f"{juz.sura}:{juz.aya}"
    return redirect(reverse("quran:path_handler", kwargs={"sura_aya": sura_aya}))
