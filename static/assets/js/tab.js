class Tab {
    static main_content;


    constructor() {
        Tab.main_content = document.querySelector(".main__content");
        this.tabButtons = document.querySelectorAll(".side-menu__btn-group button");
        this.tabPanels = {};
        this.tabButtons.forEach(btn => {
            this.tabPanels[btn.dataset.bsTarget] = document.querySelector(btn.dataset.bsTarget);
            btn.addEventListener("click", this.toggleTab.bind(this, btn));
        });

        this.sura_juz_page_list();
    }

    toggleTab(btn) {
        this.tabButtons.forEach(b => {
            b.classList.remove("active");
            let tab = this.tabPanels[b.dataset.bsTarget];
            tab.classList.remove("show");
            tab.classList.remove("active");
        });

        btn.classList.toggle("active");
        let tabPanel = this.tabPanels[btn.dataset.bsTarget];
        tabPanel.classList.toggle("show");
        tabPanel.classList.toggle("active");
    }

    sura_juz_page_list() {
        // const xhttp = new XMLHttpRequest();
        // xhttp.open("GET", sura_list_url, true);
        // xhttp.send();
        // xhttp.addEventListener("readystatechange", () => {
        //     if (xhttp.readyState === 4 && xhttp.status === 200) {
        //         let suraList = JSON.parse(xhttp.responseText);
        //         for (const suraListElement of suraList['sura_juz_page_list']) {
        //             console.log(suraListElement);
        //         }
        //     }
        // });
        let obj = this;
        let sura_tab = this.tabPanels["#sura"];
        let juz_tab = this.tabPanels["#juz"];
        let page_tab = this.tabPanels["#page"];

        $.ajax({
            method: "GET",
            url: sura_juz_page_list_url,
            data: {},
            cache: true,
            success: function (context) {
                for (const s of context["sura_list"]) {
                    let e = document.createElement("a");
                    e.id = s.sura;
                    e.href = "javascript:void(0)";
                    e.innerHTML = Tab.toArabicNumber(String(s.sura)) + ". " + s.sura_name;
                    e.addEventListener("click", obj.get_sura.bind(e.id));
                    sura_tab.appendChild(e);
                }
                for (const j of context["sura_details.py"]) {
                    let item = `<a href="javascript:void(0)" id="${j}">الجزء ${Tab.toArabicNumber(j)}</a>`;
                    juz_tab.innerHTML += item;
                }
                for (const p of context["page_list"]) {
                    let item = `<a href="javascript:void(0)" id="${p}">الصفحة ${Tab.toArabicNumber(p)}</a>`;
                    page_tab.innerHTML += item;
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    static toArabicNumber(strNum) {
        let ar = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
        let cache = String(strNum);
        for (let i = 0; i < 10; i++)
            cache = cache.replace(cache[i], ar[Number(cache[i])]);
        return cache;
    }

    get_sura(e) {
        let rows = document.querySelector("div#sura").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });
        let row = e.target;
        row.classList.toggle("selected");
        $.ajax({
            method: "GET",
            url: sura_details_url.replace("0", row.id),
            data: {
                "sura_id": row.id
            },
            cache: true,
            success: function (context) {
                Tab.update_content(context);
            },
            error: function () {
                console.log("error");
            }
        });
    }

    static update_content(content) {
        let bes = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
        let ayahs = "";
        let current_page = 0;
        let pages = [];
        let page;
        let prev_sura_name = "";
        for (const row of content["pack"]) {
            let text = "";
            if (row.sura === 1)
                text = row.text;
            else
                text = row.text.replace(bes, "");
            ayahs += `<span class="aya">
                          <span class="text" id="${row.index}">${text}</span>
                          <!-- <span class="number">﴿${Tab.toArabicNumber(row.aya)}﴾</span> -->
                          <span class="number">${Tab.toArabicNumber(row.aya)}</span>
                      </span>`;

            if (current_page === row.page) {
                if (prev_sura_name !== row.sura_name) {
                    let sura = document.createElement("div");
                    sura.classList.add("sura");
                    sura.classList.add(row.sura_name);

                    let title = document.createElement("div");
                    title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
                    title.classList.add("title");

                    sura.appendChild(title);

                    if (row.sura !== 1) {
                        let besm_allah = document.createElement("div");
                        besm_allah.classList.add("besm-allah");
                        besm_allah.innerHTML = bes;
                        sura.appendChild(besm_allah);
                    }

                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);

                    prev_sura_name = row.sura_name;
                }

                if (row.index === 12)
                    console.log("13");

                if (page.getElementsByClassName(prev_sura_name)) {
                    let content = page.getElementsByClassName(prev_sura_name)[0].querySelector(".content");
                    content.innerHTML += ayahs;
                } else {
                    let content = page.getElementsByClassName("content")[0].querySelector(".content");
                    content.innerHTML += ayahs;
                }
            } else {
                current_page = row.page;
                page = Tab.add_page(row);

                let sura = document.createElement("div");
                sura.classList.add("sura");
                sura.classList.add(row.sura_name);

                // adding title to the sura in new page
                if (prev_sura_name !== row.sura_name) {
                    let title = document.createElement("div");
                    title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
                    title.classList.add("title");

                    sura.appendChild(title);

                    if (row.sura !== 1) {
                        let besm_allah = document.createElement("div");
                        besm_allah.classList.add("besm-allah");
                        besm_allah.innerHTML = bes;
                        sura.appendChild(besm_allah);
                    }

                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);

                    prev_sura_name = row.sura_name;
                } else {
                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);
                }

                pages.push(page);
            }
            ayahs = "";
        }
        let carousel = $(".owl-carousel");
        for (const page of pages) {
            carousel.trigger("add.owl.carousel", page).trigger("refresh.owl.carousel");
        }
    }

    static add_page(row) {
        let page;
        page = document.createElement("div");
        page.classList.add("item");
        page.classList.add(String(row.page));
        if (row.page % 10 === 0)
            page.classList.add("ajax");
        return page;
    }
}
