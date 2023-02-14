class Tab {
    constructor() {
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
        let sura = this.tabPanels["#sura"];
        let juz = this.tabPanels["#juz"];
        let page = this.tabPanels["#page"];
        
        $.ajax({
            method: "GET",
            url: sura_juz_page_list_url,
            data: {},
            cache: true,
            success: function (context) {
                for (const s of context["sura_list"]) {
                    let item = `<a href="javascript:void(0)" id="${s.sura}">${Tab.toEnglishNumber(String(s.sura))}. ${s.sura_name}</a>`;
                    sura.innerHTML += item;
                }
                for (const j of context['juz_list']) {
                    let item = `<a href="javascript:void(0)" id="${j}">الجزء ${Tab.toEnglishNumber(j)}</a>`;
                    juz.innerHTML += item;
                }
                for (const p of context['page_list']) {
                    let item = `<a href="javascript:void(0)" id="${p}">الصفحة ${Tab.toEnglishNumber(p)}</a>`;
                    page.innerHTML += item;
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }
    
    static toEnglishNumber(strNum) {
        let ar = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
        let cache = strNum;
        for (let i = 0; i < 10; i++)
            cache = cache.replace(cache[i], ar[Number(cache[i])]);
        return cache;
    }
}
