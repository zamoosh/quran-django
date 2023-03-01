export class History {
    constructor() {
        this.storage = window.localStorage;
        this.check();
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
        return this.storage.setItem(item, value);
    }
    get_item(item) {
        return this.storage.getItem(item);
    }
}
//# sourceMappingURL=history.js.map