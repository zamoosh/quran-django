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
                    e.addEventListener("click", obj.sura.bind(e.id));
                    sura_tab.appendChild(e);
                }
                for (const j of context['sura_details.py']) {
                    let item = `<a href="javascript:void(0)" id="${j}">الجزء ${Tab.toArabicNumber(j)}</a>`;
                    juz_tab.innerHTML += item;
                }
                for (const p of context['page_list']) {
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
    
    sura(e) {
        let rows = document.querySelector("div#sura").querySelectorAll('a');
        rows.forEach(row => {
            row.classList.remove('selected');
        });
        let row = e.target;
        row.classList.toggle('selected');
        $.ajax({
            method: "GET",
            url: sura_details_url.replace('0', row.id),
            data: {
                'sura_id': row.id
            },
            cache: true,
            success: function (context) {
                Tab.update_content(context['sura'])
            },
            error: function () {
                console.log('error');
            }
        });
    }
    
    static update_content(content) {
        // ﴿﴾
        let bes = 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ';
        let ayahs = '';
        for (const row of content) {
            ayahs += `<span class="aya">
                <span class="text" id="${row.index}">${row.text}</span>
                <span class="number">﴿${Tab.toArabicNumber(row.aya)}﴾</span>
            </span>`;
            // ayahs += `<span id="${row.index}">${row.text}</span>`;
            // ayahs +=`<span class="number">﴿${Tab.toArabicNumber(row.aya)}﴾</span>`;
        }
        Tab.main_content.innerHTML = ayahs;
    }
}
