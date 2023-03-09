from .imports import *


def home(request):
    return render(request, f'{__name__.replace(".", "/")}.html')
