import {toArabicNumber} from "./utils.js";
import {Content} from "./content.js";

export class Tab {
    static main_content;
    static side_menu;
    static rows = [];


    constructor(side_menu) {
        Tab.main_content = document.querySelector(".main__content");
        Tab.side_menu = side_menu;
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
                    e.innerHTML = toArabicNumber(String(s.sura)) + ". " + s.sura_name;
                    e.addEventListener("click", obj.get_sura.bind(e.id));
                    sura_tab.appendChild(e);
                }
                for (const j of context["sura_details.py"]) {
                    let item = `<a href="javascript:void(0)" id="${j}">الجزء ${toArabicNumber(j)}</a>`;
                    juz_tab.innerHTML += item;
                }
                for (const p of context["page_list"]) {
                    let item = `<a href="javascript:void(0)" id="${p}">الصفحة ${toArabicNumber(p)}</a>`;
                    page_tab.innerHTML += item;
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    get_sura(e) {
        let rows = document.querySelector("div#sura").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });

        // row: id of sura in side menu, sura list
        let row = e.target;
        row.classList.toggle("selected");
        if (Tab.rows.includes(Number(row.id))) {
            Tab.side_menu.closeMenu();
            Content.go_to_page(null, row.id);
            return;
        }
        $.ajax({
            method: "GET",
            url: sura_details_url.replace("0", row.id),
            data: {
                "sura_id": row.id
            },
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                let pack = context["pack"];
                let sura_ids = pack.map(function (item) {
                    return item["sura"];
                });
                sura_ids = [...new Set(sura_ids)];
                Tab.rows = Tab.rows.concat(sura_ids);
                console.log(Tab.rows);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                Content.update_content(context, page_number, row.id);
            },
            error: function () {
                console.log("error");
            }
        });
    }
}
