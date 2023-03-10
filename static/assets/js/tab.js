import {toArabicNumber} from "./utils.js";
import {Content} from "./content.js";
import {Home} from "./home.js";

export class Tab {
    static main_content;
    static side_menu;
    static packs = [];


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
        if (row) {
            if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
                console.log("using chromium");
                row.scrollIntoView({
                    block: "center"
                });
            } else {
                console.log("MDB");
                row.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
            // row.scrollIntoView({
            //     behavior: "auto",
            //     block: "center"
            // });
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
                if (document.title.includes("Home")) {
                    let home = Home.get_instance();
                    home.promise = new Promise(function (resolve) {
                        home.sura_list = context["sura_list"];
                        home.juz_list = context["juz_list"];
                        resolve(true);
                    })
                        .then(function (result) {
                            if (result) {
                                home.prepare_sura_list_carousel();
                                home.prepare_sura_list();
                            }
                        });
                }
                for (const sura of context["sura_list"]) {
                    let item = document.createElement("a");
                    item.id = sura.sura;
                    document.title.includes("Home") ? item.href = `/sura/${sura.sura}:1` : item.href = "javascript:void(0)";
                    item.innerHTML = toArabicNumber(String(sura.sura)) + ". " + sura.sura_name;
                    item.addEventListener("click", obj.get_sura.bind(item.id));
                    sura_tab.appendChild(item);
                }
                for (const juz_id of context["juz_list"]) {
                    let item = document.createElement("a");
                    item.id = juz_id;
                    document.title.includes("Home") ? item.href = `/juz/${juz_id}` : item.href = "javascript:void(0)";
                    item.innerHTML = toArabicNumber(String(juz_id)) + ". " + "??????????";
                    item.addEventListener("click", obj.get_juz.bind(item.id));
                    juz_tab.appendChild(item);
                }
                for (const page_id of context["page_list"]) {
                    let item = document.createElement("a");
                    item.id = page_id;
                    document.title.includes("Home") ? item.href = `/page/${page_id}` : item.href = "javascript:void(0)";
                    item.innerHTML = toArabicNumber(String(page_id)) + ". " + "????????????";
                    item.addEventListener("click", obj.get_page.bind(item.id));
                    juz_tab.appendChild(item);
                    // let item = `<a href="javascript:void(0)" id="${page_id}">???????????? ${toArabicNumber(page_id)}</a>`;
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

        // if (Tab.rows.includes(Number(row.id))) {
        let sura, page_number, pack_id;
        sura = document.getElementsByClassName(`sura ${row.id}`)[0];
        if (sura)
            page_number = sura.parentElement.classList[1];
        if (page_number)
            pack_id = Math.ceil(Number(page_number) / 10);
        if (Tab.packs.includes(pack_id)) {
            Tab.side_menu.closeMenu();
            let first_aya = sura.querySelector("span.text");
            Content.go_to_page2(page_number);
            Content.got_to_aya(sura.classList[1], first_aya.id);
            return;
        }
        $.ajax({
            method: "GET",
            url: sura_details_url.replace("0", row.id),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                if (!Tab.packs.includes(context["pack_id"]))
                    Tab.packs.push(context["pack_id"]);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                // row.id, is sura.id
                Content.update_content(context, page_number, row.id);

                let page = document.getElementsByClassName(`item ${page_number}`)[0];
                let sura = page.getElementsByClassName(`sura ${row.id}`)[0];
                let first_aya = sura.querySelector("span.text");

                Content.go_to_page2(page_number);
                Content.got_to_aya(sura.classList[1], first_aya.id);

                // check if next page is empty of not
                let next_page = document.getElementsByClassName(`item ${page_number + 1}`)[0];
                let prev_page = document.getElementsByClassName(`item ${page_number - 1}`)[0];
                if (next_page && next_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number + 1) / 10);
                    if (pack_number <= 61)
                        Content.ajax_next_page(pack_number);
                    else if (pack_number > 61)
                        Content.ajax_next_page(61);
                }
                if (prev_page && prev_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number - 1) / 10);
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
        // row is page (row.id == page.id)
        let rows = document.querySelector("div#page").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });

        // row: id of juz in side menu, juz list
        let row = event.target;
        row.classList.toggle("selected");

        let sura, page, page_number, pack_id;
        page = document.getElementsByClassName(`item ${row.id}`)[0];
        if (page) {
            page_number = page.classList[1];
            sura = page.querySelector(".sura");
        }
        if (page_number)
            pack_id = Math.ceil(Number(page_number) / 10);
        if (Tab.packs.includes(pack_id)) {
            Tab.side_menu.closeMenu();
            let first_aya = sura.querySelector("span.text");
            Content.go_to_page2(page_number);
            Content.got_to_aya(sura.classList[1], first_aya.id);
            return;
        }
        $.ajax({
            method: "GET",
            url: page_details_url.replace("0", row.id),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                if (!Tab.packs.includes(context["pack_id"]))
                    Tab.packs.push(context["pack_id"]);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                Content.update_content(context, page_number, undefined);

                // let page = document.getElementsByClassName(`item ${page_number}`)[0];
                // let sura = page.getElementsByClassName("sura")[0];
                // let first_aya = sura.querySelector("span.text");

                Content.go_to_page2(page_number);

                page = document.getElementsByClassName(`item ${row.id}`)[0];
                sura = page.querySelector(".sura");
                let first_aya = sura.querySelector("span.text");
                Content.got_to_aya(sura.classList[1], first_aya.id);

                // check if next page is empty of not
                let next_page = document.getElementsByClassName(`item ${page_number + 1}`)[0];
                let prev_page = document.getElementsByClassName(`item ${page_number - 1}`)[0];
                if (next_page && next_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number + 1) / 10);
                    if (pack_number <= 61)
                        Content.ajax_next_page(pack_number);
                    else if (pack_number > 61)
                        Content.ajax_next_page(61);
                }
                if (prev_page && prev_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number - 1) / 10);
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


        let sura, page_number, pack_id;
        sura = document.querySelector(`[data-juz="${row.id}"]`);
        if (sura)
            page_number = sura.parentElement.classList[1];
        if (page_number)
            pack_id = Math.ceil(Number(page_number) / 10);
        if (Tab.packs.includes(pack_id)) {
            Tab.side_menu.closeMenu();
            let first_aya = sura.querySelector("span.text");
            Content.go_to_page2(page_number);
            Content.got_to_aya(sura.classList[1], first_aya.id);
            return;
        }
        $.ajax({
            method: "GET",
            url: juz_details_url.replace("0", row.id),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                if (!Tab.packs.includes(context["pack_id"]))
                    Tab.packs.push(context["pack_id"]);

                Tab.side_menu.closeMenu();

                // page_number is the page sura starts
                Content.update_content(context, page_number, row.id);
                Content.update_juz_number(page_number);

                Content.go_to_page2(page_number);
                sura = document.querySelector(`[data-juz="${row.id}"]`);
                let first_aya = sura.querySelector("span.text");
                Content.got_to_aya(sura.classList[1], first_aya.id);

                // check if next page is empty of not
                let next_page = document.getElementsByClassName(`item ${page_number + 1}`)[0];
                let prev_page = document.getElementsByClassName(`item ${page_number - 1}`)[0];
                if (next_page && next_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number + 1) / 10);
                    if (pack_number <= 61)
                        Content.ajax_next_page(pack_number);
                    else if (pack_number > 61)
                        Content.ajax_next_page(61);
                }
                if (prev_page && prev_page.innerHTML === "") {
                    // if true, then we're in the last page of current pack
                    let pack_number = Math.ceil((page_number - 1) / 10);
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
        let owl_item = document.querySelector(".owl-item.active");
        let first_aya = owl_item.querySelector("span.aya.selected");
        let sura_id = first_aya.parentElement.parentElement.classList[1];

        let rows = document.querySelector("div#sura").querySelectorAll("a");
        rows.forEach(row => {
            row.classList.remove("selected");
        });

        let row = rows[sura_id - 1];
        row.classList.add("selected");

        if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
            console.log("using chromium");
            row.scrollIntoView({
                block: "center"
            });
        } else {
            console.log("MDB");
            row.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        // row.scrollIntoView({
        //     behavior: "smooth",
        //     block: "center"
        // });
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

        if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
            console.log("using chromium");
            row.scrollIntoView({
                block: "center"
            });
        } else {
            console.log("MDB");
            row.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        // row.scrollIntoView({
        //     behavior: "smooth",
        //     block: "center"
        // });
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

        if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
            console.log("using chromium");
            const row_jq = $(row);
            row.scrollIntoView({
                block: "center"
            });
        } else {
            console.log("MDB");
            row.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        // row.scrollIntoView({
        //     behavior: "smooth",
        //     block: "center"
        // });
    }
}
