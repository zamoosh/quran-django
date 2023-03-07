from .imports import *


def path_handler(request, sura_aya):
    request.session["sura_aya"] = sura_aya
    return redirect(reverse("quran:index"))
