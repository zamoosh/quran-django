import {toArabicNumber} from "./utils.js";
import {Content} from "./content.js";

export class Tab {
    static main_content;
    static side_menu;
    static rows = [];
    static pages = [];
    static juzs = [];


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
        let row = tabPanel.getElementsByClassName("selected")[0];
        if (row)
            row.scrollIntoView({
                behavior: "auto",
                block: "center"
            });
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
                for (const sura of context["sura_list"]) {
                    let item = document.createElement("a");
                    item.id = sura.sura;
                    item.href = "javascript:void(0)";
                    item.innerHTML = toArabicNumber(String(sura.sura)) + ". " + sura.sura_name;
                    item.addEventListener("click", obj.get_sura.bind(item.id));
                    sura_tab.appendChild(item);
                }
                for (const juz_id of context["juz_list"]) {
                    let item = document.createElement("a");
                    item.id = juz_id;
                    item.href = "javascript:void(0)";
                    item.innerHTML = toArabicNumber(String(juz_id)) + ". " + "الجزء";
                    item.addEventListener("click", obj.get_juz.bind(item.id));
                    juz_tab.appendChild(item);
                }
                for (const page_id of context["page_list"]) {
                    let item = document.createElement("a");
                    item.id = page_id;
                    item.href = "javascript:void(0)";
                    item.innerHTML = toArabicNumber(String(page_id)) + ". " + "الصفحة";
                    item.addEventListener("click", obj.get_page.bind(item.id));
                    juz_tab.appendChild(item);
                    // let item = `<a href="javascript:void(0)" id="${page_id}">الصفحة ${toArabicNumber(page_id)}</a>`;
                    page_tab.appendChild(item);
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    get_sura(event) {
        let rows = document.querySelector("div#sura").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });

        // row: id of sura in side menu, sura list
        let row = event.target;
        row.classList.toggle("selected");
        if (Tab.rows.includes(Number(row.id))) {
            Tab.side_menu.closeMenu();
            let sura = document.getElementsByClassName(`sura ${row.id}`)[0];
            let sura_name = sura.dataset.sura;
            Content.go_to_page(undefined, row.id, sura_name);
            return;
        }
        $.ajax({
            method: "GET",
            url: sura_details_url.replace("0", row.id),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                let pack = context["pack"];
                let sura_ids = pack.map(function (item) {
                    return item["sura"];
                });
                sura_ids = [...new Set(sura_ids)];
                Tab.rows = Tab.rows.concat(sura_ids);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                // row.id, is sura.id
                Content.update_content(context, page_number, row.id);
                Content.update_page_number(page_number);

                // check if next page is empty of not
                let next_page = document.getElementsByClassName(`item ${page_number + 1}`)[0];
                if (next_page && next_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number + 1) / 10);
                    if (pack_number <= 61)
                        Content.ajax_next_page(pack_number);
                    else if (pack_number > 61)
                        Content.ajax_next_page(61);
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    get_page(event) {
        let rows = document.querySelector("div#page").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });

        // row: id of juz in side menu, juz list
        let row = event.target;
        row.classList.toggle("selected");
        if (Tab.pages.includes(Number(row.id))) {
            Tab.side_menu.closeMenu();
            let sura = document.getElementsByClassName(`sura ${row.id}`)[0];
            let sura_name = sura.dataset.sura;
            Content.go_to_page(undefined, row.id, sura_name);
            return;
        }
        $.ajax({
            method: "GET",
            url: page_details_url.replace("0", row.id),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                let pack = context["pack"];
                let page_ids = pack.map(function (item) {
                    return item["page"];
                });
                page_ids = [...new Set(page_ids)];
                Tab.pages = Tab.rows.concat(page_ids);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                Content.update_content(context, page_number, undefined);
                Content.update_page_number(page_number);

                // check if next page is empty of not
                let next_page = page_number + 1;
                if (next_page && next_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number + 1) / 10);
                    if (pack_number <= 61)
                        Content.ajax_next_page(pack_number);
                    else if (pack_number > 61)
                        Content.ajax_next_page(61);
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    get_juz(event) {
        let rows = document.querySelector("div#juz").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });

        // row: id of juz in side menu, juz list
        let row = event.target;
        row.classList.toggle("selected");
        if (Tab.juzs.includes(Number(row.id))) {
            Tab.side_menu.closeMenu();
            let sura = document.getElementsByClassName(`sura ${row.id}`)[0];
            let sura_name = sura.dataset.sura;
            Content.go_to_page(undefined, row.id, sura_name);
            return;
        }
        $.ajax({
            method: "GET",
            url: juz_details_url.replace("0", row.id),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                let pack = context["pack"];
                let juz_ids = pack.map(function (item) {
                    return item["juz"];
                });
                juz_ids = [...new Set(juz_ids)];
                Tab.juzs = Tab.rows.concat(juz_ids);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                Content.update_content(context, page_number, row.id);
                Content.update_page_number(page_number);

                // check if next page is empty of not
                let next_page = document.getElementsByClassName(`item ${page_number + 1}`)[0];
                if (next_page && next_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number + 1) / 10);
                    if (pack_number <= 61)
                        Content.ajax_next_page(pack_number);
                    else if (pack_number > 61)
                        Content.ajax_next_page(61);
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    static update_sura_list(page_number) {
        if (page_number === undefined)
            return;
        let rows = document.querySelector("div#sura").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });
        let page = document.getElementsByClassName(`item ${page_number}`)[0];
        let sura_id_index = page.firstElementChild.classList[1];
        let row = rows[sura_id_index - 1];
        row.classList.add("selected");
        row.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    static update_page_list(page_number) {
        if (page_number === undefined)
            return;
        let rows = document.querySelector("div#page").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });
        let page_index = document.getElementsByClassName(`item ${page_number}`)[0].classList[1];
        let row = rows[page_index - 1];
        row.classList.add("selected");
        row.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    static update_juz_list(page_number) {
        if (page_number === undefined)
            return;
        let rows = document.querySelector("div#juz").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });
        let page = document.getElementsByClassName(`item ${page_number}`)[0];
        let juz_number = page.firstElementChild.dataset.juz;
        let row = rows[juz_number - 1];
        row.classList.add("selected");
        row.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}
