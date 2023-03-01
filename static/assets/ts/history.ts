export class History {
    private storage = window.localStorage;
    private static instance: History;
    private history: any = {};
    
    private constructor() {
        // this.check();
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
            let history_str = JSON.stringify(history);
            this.set_item("history", history_str);
        }
    }
    
    private set_item(item: string, value: string) {
        this.history[item] = value;
        this.storage.setItem(item, JSON.stringify(this.history));
    }
    
    public get_item(item: string) {
        return this.storage.getItem(item);
    }
    
    public save_position(aya: HTMLSpanElement): void {
        // authenticated ? renderApp() : renderLogin();
        let sura_is = aya!.parentElement!.parentElement!.classList[1];
        let page_number: string = aya!.parentElement!.parentElement!.parentElement!.classList[1];
        this.set_item("page", page_number);
        this.set_item("sura", sura_is);
    }
    
}

