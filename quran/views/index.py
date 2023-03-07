from .imports import *


def index(request):
    context = {}
    if request.session.get('sura_aya'):
        context["sura_aya"] = request.session.get('sura_aya')
        del request.session["sura_aya"]

    return render(request, f'{__name__.replace(".", "/")}.html', context)
