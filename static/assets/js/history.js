export class History {
    constructor() {
        this.storage = window.localStorage;
        this.history = {};
        // this.check();
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
        this.storage.setItem("history", JSON.stringify(this.history));
    }
    get_item(item) {
        return this.storage.getItem(item);
    }
    save_position(aya) {
        // authenticated ? renderApp() : renderLogin();
        let sura_is = aya.parentElement.parentElement.classList[1];
        let page_number = aya.parentElement.parentElement.parentElement.classList[1];
        this.set_item("page", page_number);
        this.set_item("sura", sura_is);
    }
}
//# sourceMappingURL=history.js.map
