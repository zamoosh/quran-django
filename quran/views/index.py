from .imports import *


def index(request, anything=None):
    context = {
        'surah': Text.objects.filter(index=1),
    }
    return render(request, f'{__name__.replace(".", "/")}.html', context)
