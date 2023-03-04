import {Content} from "./content.js";
import {Tab} from "./tab.js";

export class History {
    static instance;

    constructor() {
        this.storage = window.localStorage;
        this.history = {};
    }

    static get_instance() {
        if (!History.instance) {
            History.instance = new History();
            if (window.localStorage.getItem("history")) {
                History.instance.history = JSON.parse(History.instance.storage.getItem("history"));
            } else {
                window.localStorage.setItem("history", JSON.stringify(History.instance.history));
            }
        }
        return History.instance;
    }

    check() {
        if (!this.get_item("history")) {
            let history = {};
            let history_str = JSON.stringify(history);
            this.set_item("history", history_str);
        }
    }

    set_item(item, value) {
        this.history[item] = value;
    }

    get_item(item) {
        let history = JSON.parse(this.storage.getItem("history"));
        return history[item];
    }

    save() {
        this.storage.setItem("history", JSON.stringify(this.history));
    }

    save_position(aya) {
        // authenticated ? renderApp() : renderLogin();
        let page_number = aya.parentElement.parentElement.parentElement.classList[1];
        let sura_is = aya.parentElement.parentElement.classList[1];
        let aya_id = aya.firstElementChild.id;
        this.set_item("page", page_number);
        this.set_item("sura", sura_is);
        this.set_item("aya", aya_id);
        this.save();
    }

    goto_position() {
        if (this.history) {
            let page = Number(this.history["page"]);
            let sura_id = Number(this.history["sura"]);

            if (!page || !sura_id)
                return;

            let pack_number = Math.ceil(page / 10);
            // let aya_id: number = Number(this.history["aya"]);

            $.ajax({
                method: "GET",
                url: page_details_url.replace("0", page),
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

        // Content.go_to_page(page, sura_id, undefined);
    }
}
