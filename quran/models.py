from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Value
from django.conf import settings
import os
import json


class Text(models.Model):
    index = models.AutoField(primary_key=True)
    sura = models.IntegerField()
    sura_name = models.CharField(max_length=100, null=True)
    aya = models.IntegerField()
    text = models.TextField()
    page = models.PositiveSmallIntegerField(default=0)
    juz = models.PositiveSmallIntegerField(default=0)

    @staticmethod
    def get_juz():
        with open(os.path.join(settings.STATICFILES_DIRS[0], 'juz.json5')) as f:
            data = json.loads(f.read())
            f.close()
        return data

    @staticmethod
    def get_page():
        with open(os.path.join(settings.STATICFILES_DIRS[0], 'page.json5')) as f:
            data = json.loads(f.read())
            f.close()
        return data

    @staticmethod
    def add_sura_name():
        sura = [
            [0, 7, 5, 1, "الفاتحة", "Al-Fatiha", "The Opening", "Meccan"],
            [7, 286, 87, 40, "البقرة", "Al-Baqara", "The Heifer", "Medinan"],
            [
                293,
                200,
                89,
                20,
                "آل عمران",
                "Aal-i-Imran",
                "The Family of Imran",
                "Medinan",
            ],
            [493, 176, 92, 24, "النساء", "An-Nisa", "The Women", "Medinan"],
            [669, 120, 112, 16, "المائدة", "Al-Ma'ida", "The Table", "Medinan"],
            [789, 165, 55, 20, "الأنعام", "Al-An'am", "The Cattle", "Meccan"],
            [954, 206, 39, 24, "الأعراف", "Al-A'raf", "The Heights", "Meccan"],
            [1160, 75, 88, 10, "الأنفال", "Al-Anfal", "The Spoils of War", "Medinan"],
            [1235, 129, 113, 16, "التوبة", "At-Tawba", "The Repentance", "Medinan"],
            [1364, 109, 51, 11, "يونس", "Yunus", "Jonah", "Meccan"],
            [1473, 123, 52, 10, "هود", "Hud", "Hud", "Meccan"],
            [1596, 111, 53, 12, "يوسف", "Yusuf", "Joseph", "Meccan"],
            [1707, 43, 96, 6, "الرعد", "Ar-Ra'd", "The Thunder", "Medinan"],
            [1750, 52, 72, 7, "ابراهيم", "Ibrahim", "Abraham", "Meccan"],
            [1802, 99, 54, 6, "الحجر", "Al-Hijr", "The Stoneland", "Meccan"],
            [1901, 128, 70, 16, "النحل", "An-Nahl", "The Honey Bees", "Meccan"],
            [2029, 111, 50, 12, "الإسراء", "Al-Isra", "The Night Journey", "Meccan"],
            [2140, 110, 69, 12, "الكهف", "Al-Kahf", "The Cave", "Meccan"],
            [2250, 98, 44, 6, "مريم", "Maryam", "Mary", "Meccan"],
            [2348, 135, 45, 8, "طه", "Ta-Ha", "Ta-Ha", "Meccan"],
            [2483, 112, 73, 7, "الأنبياء", "Al-Anbiya", "The Prophets", "Meccan"],
            [2595, 78, 103, 10, "الحج", "Al-Hajj", "The Pilgrimage", "Medinan"],
            [2673, 118, 74, 6, "المؤمنون", "Al-Mu'minun", "The Believers", "Meccan"],
            [2791, 64, 102, 9, "النور", "An-Nur", "The Light", "Medinan"],
            [2855, 77, 42, 6, "الفرقان", "Al-Furqan", "The Criterion", "Meccan"],
            [2932, 227, 47, 11, "الشعراء", "Ash-Shu'ara", "The Poets", "Meccan"],
            [3159, 93, 48, 7, "النمل", "An-Naml", "The Ant", "Meccan"],
            [3252, 88, 49, 9, "القصص", "Al-Qasas", "The Stories", "Meccan"],
            [3340, 69, 85, 7, "العنكبوت", "Al-Ankabut", "The Spider", "Meccan"],
            [3409, 60, 84, 6, "الروم", "Ar-Rum", "The Romans", "Meccan"],
            [3469, 34, 57, 4, "لقمان", "Luqman", "Luqman", "Meccan"],
            [3503, 30, 75, 3, "السجدة", "As-Sajda", "The Prostration", "Meccan"],
            [3533, 73, 90, 9, "الأحزاب", "Al-Ahzab", "The Clans", "Medinan"],
            [3606, 54, 58, 6, "سبإ", "Saba", "Sheba", "Meccan"],
            [3660, 45, 43, 5, "فاطر", "Fatir", "The Originator", "Meccan"],
            [3705, 83, 41, 5, "يس", "Ya-Sin", "Yaseen", "Meccan"],
            [3788, 182, 56, 5, "الصافات", "As-Saffat", "Drawn up in Ranks", "Meccan"],
            [3970, 88, 38, 5, "ص", "Sad", "The Letter Sad", "Meccan"],
            [4058, 75, 59, 8, "الزمر", "Az-Zumar", "The Troops", "Meccan"],
            [4133, 85, 60, 9, "غافر", "Ghafir", "The Forgiver", "Meccan"],
            [4218, 54, 61, 6, "فصلت", "Fussilat", "Explained in Detail", "Meccan"],
            [4272, 53, 62, 5, "الشورى", "Ash-Shura", "The Consultation", "Meccan"],
            [
                4325,
                89,
                63,
                7,
                "الزخرف",
                "Az-Zukhruf",
                "The Ornaments of Gold",
                "Meccan",
            ],
            [4414, 59, 64, 3, "الدخان", "Ad-Dukhan", "The Smoke", "Meccan"],
            [4473, 37, 65, 4, "الجاثية", "Al-Jathiya", "Crouching", "Meccan"],
            [4510, 35, 66, 4, "الأحقاف", "Al-Ahqaf", "The Dunes", "Meccan"],
            [4545, 38, 95, 4, "محمد", "Muhammad", "Muhammad", "Medinan"],
            [4583, 29, 111, 4, "الفتح", "Al-Fath", "The Victory", "Medinan"],
            [
                4612,
                18,
                106,
                2,
                "الحجرات",
                "Al-Hujurat",
                "The Inner Apartments",
                "Medinan",
            ],
            [4630, 45, 34, 3, "ق", "Qaf", "The Letter Qaf", "Meccan"],
            [
                4675,
                60,
                67,
                3,
                "الذاريات",
                "Adh-Dhariyat",
                "The Winnowing Winds",
                "Meccan",
            ],
            [4735, 49, 76, 2, "الطور", "At-Tur", "The Mount", "Meccan"],
            [4784, 62, 23, 3, "النجم", "An-Najm", "The Star", "Meccan"],
            [4846, 55, 37, 3, "القمر", "Al-Qamar", "The Moon", "Meccan"],
            [4901, 78, 97, 3, "الرحمن", "Ar-Rahman", "The Beneficent", "Medinan"],
            [4979, 96, 46, 3, "الواقعة", "Al-Waqi'a", "The Inevitable", "Meccan"],
            [5075, 29, 94, 4, "الحديد", "Al-Hadid", "The Iron", "Medinan"],
            [5104, 22, 105, 3, "المجادلة", "Al-Mujadila", "The Pleading", "Medinan"],
            [5126, 24, 101, 3, "الحشر", "Al-Hashr", "The Exile", "Medinan"],
            [5150, 13, 91, 2, "الممتحنة", "Al-Mumtahina", "Examining Her", "Medinan"],
            [5163, 14, 109, 2, "الصف", "As-Saff", "The Ranks", "Medinan"],
            [5177, 11, 110, 2, "الجمعة", "Al-Jumu'a", "Friday", "Medinan"],
            [
                5188,
                11,
                104,
                2,
                "المنافقون",
                "Al-Munafiqun",
                "The Hypocrites",
                "Medinan",
            ],
            [
                5199,
                18,
                108,
                2,
                "التغابن",
                "At-Taghabun",
                "Mutual Disillusion",
                "Medinan",
            ],
            [5217, 12, 99, 2, "الطلاق", "At-Talaq", "Divorce", "Medinan"],
            [5229, 12, 107, 2, "التحريم", "At-Tahrim", "The Prohibition", "Medinan"],
            [5241, 30, 77, 2, "الملك", "Al-Mulk", "The Sovereignty", "Meccan"],
            [5271, 52, 2, 2, "القلم", "Al-Qalam", "The Pen", "Meccan"],
            [5323, 52, 78, 2, "الحاقة", "Al-Haqqa", "The Reality", "Meccan"],
            [
                5375,
                44,
                79,
                2,
                "المعارج",
                "Al-Ma'arij",
                "The Ascending Stairways",
                "Meccan",
            ],
            [5419, 28, 71, 2, "نوح", "Nuh", "Noah", "Meccan"],
            [5447, 28, 40, 2, "الجن", "Al-Jinn", "The Jinn", "Meccan"],
            [
                5475,
                20,
                3,
                2,
                "المزمل",
                "Al-Muzzammil",
                "The Enshrouded One",
                "Meccan",
            ],
            [5495, 56, 4, 2, "المدثر", "Al-Muddathir", "The Cloaked One", "Meccan"],
            [5551, 40, 31, 2, "القيامة", "Al-Qiyama", "The Resurrection", "Meccan"],
            [5591, 31, 98, 2, "الانسان", "Al-Insan", "Human", "Medinan"],
            [5622, 50, 33, 2, "المرسلات", "Al-Mursalat", "The Emissaries", "Meccan"],
            [5672, 40, 80, 2, "النبإ", "An-Naba'", "The Announcement", "Meccan"],
            [
                5712,
                46,
                81,
                2,
                "النازعات",
                "An-Nazi'at",
                "Those Who Drag Forth",
                "Meccan",
            ],
            [5758, 42, 24, 1, "عبس", "Abasa", "He Frowned", "Meccan"],
            [5800, 29, 7, 1, "التكوير", "At-Takwir", "The Folding Up", "Meccan"],
            [5829, 19, 82, 1, "الإنفطار", "Al-Infitar", "The Cleaving", "Meccan"],
            [5848, 36, 86, 1, "المطففين", "Al-Mutaffifin", "Defrauding", "Meccan"],
            [
                5884,
                25,
                83,
                1,
                "الإنشقاق",
                "Al-Inshiqaq",
                "The Splitting Open",
                "Meccan",
            ],
            [5909, 22, 27, 1, "البروج", "Al-Buruj", "The Constellations", "Meccan"],
            [5931, 17, 36, 1, "الطارق", "At-Tariq", "The Morning Star", "Meccan"],
            [5948, 19, 8, 1, "الأعلى", "Al-A'la", "The Most High", "Meccan"],
            [5967, 26, 68, 1, "الغاشية", "Al-Ghashiya", "The Overwhelming", "Meccan"],
            [5993, 30, 10, 1, "الفجر", "Al-Fajr", "The Dawn", "Meccan"],
            [6023, 20, 35, 1, "البلد", "Al-Balad", "The City", "Meccan"],
            [6043, 15, 26, 1, "الشمس", "Ash-Shams", "The Sun", "Meccan"],
            [6058, 21, 9, 1, "الليل", "Al-Lail", "The Night", "Meccan"],
            [6079, 11, 11, 1, "الضحى", "Ad-Dhuha", "The Morning Hours", "Meccan"],
            [6090, 8, 12, 1, "الشرح", "Ash-Sharh", "The Consolation", "Meccan"],
            [6098, 8, 28, 1, "التين", "At-Tin", "The Fig", "Meccan"],
            [6106, 19, 1, 1, "العلق", "Al-Alaq", "The Clot", "Meccan"],
            [6125, 5, 25, 1, "القدر", "Al-Qadr", "The Power, Fate", "Meccan"],
            [6130, 8, 100, 1, "البينة", "Al-Bayyina", "The Evidence", "Medinan"],
            [6138, 8, 93, 1, "الزلزلة", "Az-Zalzala", "The Earthquake", "Medinan"],
            [6146, 11, 14, 1, "العاديات", "Al-Adiyat", "The Chargers", "Meccan"],
            [6157, 11, 30, 1, "القارعة", "Al-Qari'a", "The Calamity", "Meccan"],
            [6168, 8, 16, 1, "التكاثر", "At-Takathur", "Competition", "Meccan"],
            [6176, 3, 13, 1, "العصر", "Al-Asr", "The Time", "Meccan"],
            [6179, 9, 32, 1, "الهمزة", "Al-Humaza", "The Traducer", "Meccan"],
            [6188, 5, 19, 1, "الفيل", "Al-Fil", "The Elephant", "Meccan"],
            [6193, 4, 29, 1, "قريش", "Quraysh", "Quraysh", "Meccan"],
            [6197, 7, 17, 1, "الماعون", "Al-Ma'un", "Almsgiving", "Meccan"],
            [6204, 3, 15, 1, "الكوثر", "Al-Kawthar", "Abundance", "Meccan"],
            [6207, 6, 18, 1, "الكافرون", "Al-Kafirun", "The Disbelievers", "Meccan"],
            [6213, 3, 114, 1, "النصر", "An-Nasr", "Divine Support", "Medinan"],
            [6216, 5, 6, 1, "المسد", "Al-Masad", "The Palm Fibre", "Meccan"],
            [6221, 4, 22, 1, "الإخلاص", "Al-Ikhlas", "Purity of Faith", "Meccan"],
            [6225, 5, 20, 1, "الفلق", "Al-Falaq", "The Dawn", "Meccan"],
            [6230, 6, 21, 1, "الناس", "An-Nas", "Mankind", "Meccan"],
        ]
        for item in sura:
            Text.objects.filter(sura=(sura.index(item) + 1)).update(sura_name=item[4])
        print('all names added!')

    @staticmethod
    def add_page():
        """
        item[0] -> sura
        item[1] -> aya
        """
        page_data = Text.get_page()
        for key in page_data:
            current_key = key
            next_key = str(int(key) + 1)
            if page_data.get(next_key):
                # next page is exists
                current_s_a: list = json.loads(page_data[current_key])
                next_s_a: list = json.loads(page_data[next_key])
                if int(key) == 562:
                    print('ali')
                if current_s_a[0] == next_s_a[0]:
                    # sura is more than one page
                    prev_page = str(int(key) - 1)
                    prev_s_a: list = json.loads(page_data[prev_page])
                    if current_s_a[0] - prev_s_a[0] == 1 and current_s_a[1] != 1:
                        # sura is not start of it's first, in this page
                        sura_id = int(current_s_a[0])
                        current_aya = int(current_s_a[1]) - 1
                        Text.objects.filter(sura=sura_id, aya__lte=current_aya).update(page=Value(int(key) - 1))
                        print("sura is not start of it's first")
                    else:
                        # sura is start of it's first, in this page
                        sura_id = int(current_s_a[0])
                        first_aya = int(current_s_a[1])
                        last_aya = int(next_s_a[1]) - 1
                        Text.objects.filter(
                            sura=sura_id,
                            aya__gte=first_aya,
                            aya__lte=last_aya
                        ).update(page=Value(int(key)))
                else:
                    # sura is small and all of this in this page (key),
                    # or sura starts in middle of the page,
                    # or we're at the last page of sura
                    current_sura = int(current_s_a[0])
                    next_sura = int(next_s_a[0])

                    # we have to check ...

                    if next_sura - current_sura == 1:
                        # we don't jump a sura
                        sura_id = int(current_s_a[0])
                        current_aya = int(current_s_a[1])
                        last_aya = Text.objects.filter(sura=sura_id).last().aya
                        Text.objects.filter(
                            sura=sura_id,
                            aya__gte=current_aya,
                            aya__lte=last_aya
                        ).update(page=Value(int(key)))

                        if next_s_a[1] != 1:
                            # next sura has started from middle of the page
                            sura_id = next_sura
                            last_aya = int(next_s_a[1]) - 1
                            Text.objects.filter(sura=sura_id, aya__lte=last_aya).update(page=Value(int(key)))

                    else:
                        # we jump over some sura
                        jumped_suras = []
                        for item in range(current_sura, next_sura):
                            jumped_suras.append(item)
                        for sura_id in jumped_suras:
                            if jumped_suras.index(sura_id) + 1 == len(jumped_suras):
                                if sura_id == next_s_a[0]:
                                    last_aya = int(next_s_a[1]) - 1
                                    Text.objects.filter(
                                        sura=sura_id,
                                        aya__lte=last_aya
                                    ).update(page=Value(int(key)))
                                else:
                                    Text.objects.filter(
                                        sura=sura_id,
                                    ).update(page=Value(int(key)))
                            elif jumped_suras.index(sura_id) == 0:
                                first_aya = int(current_s_a[1])
                                Text.objects.filter(sura=sura_id, aya__gte=first_aya).update(page=Value(int(key)))
                            else:
                                Text.objects.filter(sura=sura_id).update(page=Value(int(key)))

                        if next_s_a[1] != 1:
                            # next sura has started from middle of the page
                            sura_id = next_sura
                            last_aya = int(next_s_a[1]) - 1
                            Text.objects.filter(sura=sura_id, aya__lte=last_aya).update(page=Value(int(key)))
            else:
                # next page is not exists
                current_s_a: list = json.loads(page_data[current_key])
                sura_id = int(current_s_a[0])
                last_sura_id = 114
                while sura_id <= last_sura_id:
                    Text.objects.filter(sura=sura_id).update(page=Value(int(key)))
                    sura_id += 1
        print('all pages set!')

    @staticmethod
    def add_juz():
        """
        item[0] -> page
        item[1] -> sura
        item[2] -> aya
        """
        page_data = Text.get_juz()
        for key in page_data:
            current_key = key
            next_key = str(int(key) + 1)
            if page_data.get(next_key):
                # next juz is exists
                current_page = int(json.loads(page_data[current_key])[0])
                next_page = int(json.loads(page_data[next_key])[0]) - 1
                Text.objects.filter(page__gte=current_page, page__lte=next_page).update(juz=Value(int(key)))
            else:
                # next juz is not exists
                current_page = int(json.loads(page_data[current_key])[0])
                Text.objects.filter(page__gte=current_page).update(juz=Value(int(key)))
        print('all juz were added!')
