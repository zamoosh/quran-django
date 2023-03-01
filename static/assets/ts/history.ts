export class History {
    private storage = window.localStorage;
    private static instance: History;

    private constructor() {
        this.check()
    }

    static get_instance() {
        if (!History.instance) {
            History.instance = new History();
        }
        return History.instance;
    }

    private check() {
        if (!this.get_item("history")) {
            let history: object = {};
            let history_str = JSON.stringify(history)
            this.set_item("history", history_str);
        }
    }

    private set_item(item: string, value: string) {
        return this.storage.setItem(item, value);
    }

    public get_item(item: string) {
        return this.storage.getItem(item);
    }

}

