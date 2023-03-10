import {Content} from "./content.js";
import {Tab} from "./tab.js";
import {Path} from "./path.js";

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
        let sura_id = aya.parentElement.parentElement.classList[1];
        let aya_id = aya.firstElementChild.id;
        let juz_number = aya.parentElement.parentElement.dataset.juz;
        this.set_item("page", page_number);
        this.set_item("sura", sura_id);
        this.set_item("aya", aya_id);
        this.set_item("juz", aya_id);
        this.save();

        Path.get_instance().save_url();
    }

    goto_position() {
        let obj = this;
        if (this.history) {
            let page = this.history["page"];
            let sura_id = this.history["sura"];
            let aya_id = this.history["aya"];

            // if nighter page, sura_id and sura_aya_url is not available, we show nothing!
            if ((!page || !sura_id) && sura_aya_url === "")
                return;

            // if ONLY sura_aya_url is available, we go to the sura using URL
            if (sura_aya_url !== "") {
                let sura_id = sura_aya_url.split(":")[0];
                let aya_id = sura_aya_url.split(":")[1];
                $.ajax({
                    method: "GET",
                    url: sura_details_url.replace("0", sura_id),
                    cache: true,
                    success: function (context) {
                        let page_number = context["page_number"];
                        if (!Tab.packs.includes(context["pack_id"]))
                            Tab.packs.push(context["pack_id"]);

                        Tab.side_menu.closeMenu();

                        Content.update_content(context, page_number, sura_id);

                        // we can go to specific aya of sura, on condition that the aya, is in current pack!
                        let suras = document.getElementsByClassName(`sura ${sura_id}`);
                        let sura_selected, first_aya;
                        for (const sura of suras) {
                            first_aya = sura.getElementsByClassName(`text ${aya_id}`)[0];
                            if (first_aya) {
                                sura_selected = sura;
                                page_number = sura_selected.parentElement.classList[1];
                                break;
                            }
                        }

                        if (!first_aya) {
                            Content.ajax_sura_aya(sura_id, aya_id)
                                .then(function (result) {
                                    if (result) {
                                        let sura_selected, first_aya;
                                        for (const sura of suras) {
                                            first_aya = sura.getElementsByClassName(`text ${aya_id}`)[0];
                                            if (first_aya) {
                                                sura_selected = sura;
                                                page_number = sura_selected.parentElement.classList[1];
                                                break;
                                            }
                                        }
                                        Content.go_to_page2(page_number);
                                        Content.got_to_aya(sura_id, aya_id);
                                    }
                                })
                                .catch(function (error) {

                                });
                        } else {
                            // no need to
                            Content.go_to_page2(page_number);
                            Content.got_to_aya(sura_selected.classList[1], first_aya.id);
                        }

                        // check if next page is empty of not
                        page = Number(page);
                        let next_page = document.getElementsByClassName(`item ${page + 1}`)[0];
                        let prev_page = document.getElementsByClassName(`item ${page - 1}`)[0];
                        if (next_page && next_page.innerHTML === "") {
                            // if true, then we're in the last page of current pack
                            let pack_number = Math.ceil((page + 1) / 10);
                            if (!Tab.packs.includes(pack_number)) {
                                if (pack_number <= 61) {
                                    Tab.packs.push(pack_number);
                                    Content.ajax_next_page(pack_number);
                                } else if (pack_number > 61) {
                                    Tab.packs.push(61);
                                    Content.ajax_next_page(61);
                                }
                                Tab.packs = [...new Set(Tab.packs)];
                            }
                        }
                        if (prev_page && prev_page.innerHTML === "") {
                            // if true, then we're in the last page of current pack
                            let pack_number = Math.ceil((page - 1) / 10);
                            if (!Tab.packs.includes(pack_number)) {
                                if (pack_number <= 61) {
                                    Tab.packs.push(pack_number);
                                    Content.ajax_next_page(pack_number);
                                } else if (pack_number > 61) {
                                    Tab.packs.push(61);
                                    Content.ajax_next_page(61);
                                }
                                Tab.packs = [...new Set(Tab.packs)];
                            }
                        }
                    },
                    error: function () {
                        console.log("error");
                    }
                });
                return;
            }

            // if ONLY sura_aya_url is not available, we can use the local storage to go to the sura
            /*$.ajax({
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

                    // check if next page is empty of not
                    page_number = Number(page_number);
                    let next_page = document.getElementsByClassName(`item ${page_number + 1}`)[0];
                    let prev_page = document.getElementsByClassName(`item ${page_number - 1}`)[0];
                    if (next_page && next_page.innerHTML === "") {
                        // if true, then we're in the last page of current pack
                        let pack_number = Math.ceil((page_number + 1) / 10);
                        if (!Tab.packs.includes(pack_number)) {
                            if (pack_number <= 61)
                                Content.ajax_next_page(pack_number);
                            else if (pack_number > 61)
                                Content.ajax_next_page(61);
                        }
                    }
                    if (prev_page && prev_page.innerHTML === "") {
                        // if true, then we're in the last page of current pack
                        let pack_number = Math.ceil((page_number - 1) / 10);
                        if (!Tab.packs.includes(pack_number)) {
                            if (pack_number <= 61)
                                Content.ajax_next_page(pack_number);
                            else if (pack_number > 61)
                                Content.ajax_next_page(61);
                        }
                    }
                },
                error: function () {
                    console.log("error");
                }
            });*/
            Content.ajax_sura_aya(sura_id, aya_id)
                .then(function (result) {
                    if (result) {
                        Content.go_to_page2(page);
                        Content.got_to_aya(sura_id, aya_id);
                    }
                })
                .catch(function (error) {

                });
        }
    }
}
