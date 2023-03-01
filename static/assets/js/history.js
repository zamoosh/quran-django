import {Content} from "./content.js";

export class History {
    constructor() {
        this.storage = window.localStorage;
        this.history = {};
    }

    static get_instance() {
        if (!History.instance) {
            History.instance = new History();
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
        return this.storage.getItem(item);
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
        let page = Number(this.history["page"]);
        let sura_id = Number(this.history["sura"]);
        // let aya_id: number = Number(this.history["aya"]);
        Content.go_to_page(page, sura_id, undefined);
    }
}

//# sourceMappingURL=history.js.map
