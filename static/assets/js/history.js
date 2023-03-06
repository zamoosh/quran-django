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
        let obj = this;
        if (this.history) {
            let page = Number(this.history["page"]);
            let sura_id = Number(this.history["sura"]);

            if (!page || !sura_id)
                return;

            $.ajax({
                method: "GET",
                url: page_details_url.replace("0", page),
                cache: true,
                success: function (context) {
                    let page_number = context["page_number"];
                    if (!Tab.packs.includes(context["pack_id"]))
                        Tab.packs.push(context["pack_id"]);

                    Tab.side_menu.closeMenu();

                    // page_number is the page sura starts
                    Content.update_content(context, page_number, undefined);
                    Content.go_to_page2(page_number);
                    Content.got_to_aya(obj.get_item("sura"), obj.get_item("aya"));

                    // setTimeout(function () {
                    //     if (Content.page_updated) {
                    //         // update tab menu
                    //         page_number = Number(page_number);
                    //         if (page_number <= 604) {
                    //             Tab.update_sura_list();
                    //             Tab.update_page_list(page_number);
                    //             Tab.update_juz_list(page_number);
                    //         } else if (page_number > 604) {
                    //             Tab.update_sura_list();
                    //             Tab.update_page_list(page_number);
                    //             Tab.update_juz_list(page_number);
                    //         } else {
                    //             Tab.update_sura_list();
                    //             Tab.update_page_list(page_number);
                    //             Tab.update_juz_list(page_number);
                    //         }
                    //         clearTimeout(this);
                    //     }
                    // }, 200);

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
    }
}
