import {History} from "./history.js";

export class Path {
    static instance;

    constructor() {
        this.url = window.location;
        this.history = window.history;
    }

    static get_instance() {
        if (!Path.instance)
            Path.instance = new Path();
        return Path.instance;
    }

    push_state() {
        this.history.pushState("", "");
    }

    update_url() {
        console.log("updating the url");
    }

    save_url() {
        let history = History.get_instance().history;
        let sura = history["sura"];
        let aya = history["aya"];

        console.log(sura_aya_url);

        if (this.url.pathname === "/") {
            window.history.pushState(history, `sura/${sura}:${aya}`, `sura/${sura}:${aya}`);
        } else {
            this.history.pushState(history, `sura/${sura}:${aya}`, `${sura}:${aya}`);
        }
    }
}
