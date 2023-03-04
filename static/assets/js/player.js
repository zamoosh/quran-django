import {Content} from "./content.js";
import {History} from "./history.js";

export class Player {
    player;
    static play_logo;
    static pause_logo;
    static audio = document.querySelector("audio");
    static playing = false;
    static progress_bar = document.querySelector("progress");
    static speed_toolbar;
    static speed_selected;
    footer_settings;
    footer_settings_logo;
    static font_change;
    static cached_audio = {};

    constructor(selector) {
        this.player = document.getElementById(selector);
        let logos = this.player.querySelectorAll("img.logo");
        Player.play_logo = logos[0];
        Player.pause_logo = logos[1];
        Player.speed_toolbar = this.player.querySelector(".footer__speed-toolbar");
        Player.speed_selected = Player.speed_toolbar.querySelector(".footer__speed-selected");
        this.footer_settings = document.querySelector(".footer__settings");
        this.footer_settings_logo = this.footer_settings.querySelector(".footer__settings");

        this.makePlayable();
        this.updateProgressBar();
        this.speedControl();
        this.fontControl();
        this.themeChange();
    }

    makePlayable() {
        let play_pause_btn = this.player.querySelector(".footer__player");
        play_pause_btn.addEventListener("click", this.togglePlay.bind(this));
    }

    togglePlay() {
        Player.playing = !Player.audio.paused;
        if (Player.playing) {
            Player.pause_audio();
        } else {
            Player.play_audio();
        }
    }

    static toggle_shape() {
        Player.play_logo.classList.toggle("active");
        Player.pause_logo.classList.toggle("active");
    }

    static update_src(src) {
        // src is an url for an aya
        if (typeof src === "string") {
            if (Player.get_cache_audio(src)) {
                // audio is cached before
                Player.audio.firstElementChild.src = src;
            } else {
                // we need to get the audio
                Player.cache_audio(src, new Audio(src));
                Player.audio.firstElementChild.src = src;
            }
            // Player.audio.load();
        } else {
            // src itself is the first aya (span.text) of the current page
            let sura = src.parentElement.parentElement.parentElement;
            let sura_id = String(sura.classList[1]);
            sura_id = sura_id.padStart(3, "0");

            let text_id = String(src.id);
            text_id = text_id.padStart(3, "0");

            let url = Content.url.concat(sura_id + text_id, ".mp3");
            this.update_src(url);
        }
    }

    static cache_audio(url, audio) {
        Player.cached_audio[url] = audio;
    }

    static get_cache_audio(url) {
        return Player.cached_audio[url];
    }

    updateProgressBar() {
        let current_time;
        Player.audio.addEventListener("timeupdate", updateProgressBar);

        function updateProgressBar(event) {
            current_time = Math.ceil(Player.audio.currentTime);
            if (Player.audio.duration)
                Player.progress_bar.value = (current_time / Player.audio.duration) * 100;
        }

        Player.audio.addEventListener("play", function () {
            let current_aya = document.querySelector("span.aya.selected");
            let next_aya = current_aya.nextElementSibling;
            let owl_item = document.querySelector(".owl-item.active");
            let last_aya_of_page = owl_item.querySelector(".sura:last-child span.aya:last-child");
            if (next_aya) {
                // next sibling, exists in current page
                let next_aya_text = current_aya.nextElementSibling.firstElementChild;
                Player.get_nex_audio(next_aya_text);
            } else if (last_aya_of_page === current_aya) {
                // we're in the last aya of the current page. we should go to next page
                let next_owl_item = owl_item.nextElementSibling;
                if (next_owl_item) {
                    let next_aya_text = next_owl_item.querySelector("span.aya").firstElementChild;
                    Player.get_nex_audio(next_aya_text);
                }
            } else if (next_aya === null) {
                // there is something we must cache in current page!

                let current_sura = owl_item.querySelector("span.aya.selected").parentElement.parentElement;
                let next_sura = current_sura.nextSibling;
                if (next_sura) {
                    let next_aya_text = next_sura.querySelector("span.aya > span.text");
                    Player.get_nex_audio(next_aya_text);
                }
            }
        });

        Player.audio.addEventListener("ended", function () {
            Player.restart_progressbar();
            Player.go_to_next_aya();
        });
    }

    speedControl() {
        Player.speed_toolbar.addEventListener("click", this.toggleSpeeds.bind(this));
    }

    toggleSpeeds() {
        let btn_d = 36;
        let d = 45;
        let buttons = Player.speed_toolbar.querySelectorAll("button");
        Player.speed_toolbar.classList.toggle("open");
        if (Player.speed_toolbar.classList.contains("open")) {
            buttons.forEach((btn, index) => {
                btn.classList.add("open");
                btn.style.transform = `translate(18px, -${(index * btn_d) + d}px)`;
                // btn.style.transitionDelay = (index * 100) / 2 + 'ms';
            });
        } else {
            buttons.forEach(btn => {
                btn.classList.remove("open");
            });
        }
        buttons.forEach(btn => {
            btn.addEventListener("click", Player.speedSet);
        });
    }

    static speedSet(e) {
        if (e) {
            let buttons = Player.speed_toolbar.querySelectorAll("button");
            buttons.forEach(btn => {
                btn.classList.remove("active");
            });
            e.target.classList.add("active");
            Player.speed_selected.innerHTML = e.target.innerHTML;
            Player.audio.playbackRate = e.target.value;
        } else {
            let active_speed = Player.speed_toolbar.querySelector("button.active").value;
            Player.audio.playbackRate = Number(active_speed);
        }
    }


    fontControl() {
        this.footer_settings.addEventListener("click", this.toggleSettings.bind(this));
        let buttons = this.footer_settings.querySelectorAll("button.font");
        buttons.forEach(btn => {
            btn.addEventListener("click", this.changeFontSize);
        });
    }

    toggleSettings(e) {
        let btn_d = 36;
        let d = 52;
        let buttons = this.footer_settings.querySelectorAll("button");
        let target = e.target;
        if (target.tagName === "IMG") {
            target = target.parentElement;
        }
        if (target.tagName === "DIV")
            this.footer_settings.classList.toggle("open");
        if (this.footer_settings.classList.contains("open")) {
            buttons.forEach((btn, index) => {
                btn.classList.add("open");
                btn.style.transform = `translate(-2px, -${(index * btn_d) + d}px)`;
            });
        } else {
            buttons.forEach(btn => {
                btn.classList.remove("open");
            });
        }
    }

    changeFontSize(e) {
        let btn = e.target;
        if (btn.tagName === "IMG") {
            btn = btn.parentElement;
        }
        let elements = document.querySelectorAll(".main span.aya .text, .main span.aya .number");
        if (btn.value === "plus") {
            elements.forEach(element => {
                let size = parseInt(window.getComputedStyle(element).fontSize);
                element.style.fontSize = size + 2 + "px";
                Player.font_change++;
                // let change = 0;
                // change = Player.font_change / 2;
                // if (change !== 0)
                //     obj.changeLineHeight(change)
            });
        } else {
            elements.forEach(element => {
                let size = parseInt(window.getComputedStyle(element).fontSize);
                element.style.fontSize = size - 2 + "px";
                Player.font_change--;
                // let change = 0;
                // change = Player.font_change / 2;
                // if (change !== 0)
                //     obj.changeLineHeight(change)
            });
        }
    }

    themeChange() {
        let btn = this.footer_settings.querySelector("button.theme");
        let sepia = this.footer_settings.querySelector("button.sepia");
        btn.addEventListener("click", function () {
            document.body.classList.toggle("dark");
            document.body.classList.remove("sepia");
            btn.classList.add("active");
            sepia.classList.remove("active");
        });

        sepia.addEventListener("click", function () {
            document.body.classList.toggle("sepia");
            document.body.classList.remove("dark");
            btn.classList.remove("active");
            sepia.classList.add("active");
        });
    }

    static restart_progressbar() {
        Player.audio.currentTime = 0;
        Player.progress_bar.value = 0;
        Player.audio.pause();
        Player.pause_shape();
    }

    static pause_shape() {
        Player.play_logo.classList.add("active");
        Player.pause_logo.classList.remove("active");
    }

    static go_to_next_aya() {
        let history = History.get_instance();

        let current_aya = document.querySelector("span.aya.selected");

        let next_aya = current_aya.nextElementSibling;
        let owl_item = document.querySelector(".owl-item.active");
        let last_aya_of_page = owl_item.querySelector(".sura:last-child span.aya:last-child");

        if (next_aya) {
            // aya is in current page, in current sura
            Player.playing = false;

            // next aya is exists in current page (owl-item)
            let next_aya_text = current_aya.nextElementSibling.firstElementChild;
            document.querySelectorAll("span.text").forEach(function (item) {
                item.parentElement.classList.remove("selected");
            });
            // add selected class to the aya element
            next_aya_text.parentElement.classList.add("selected");

            // save position
            history.save_position(next_aya_text.parentElement);

            Player.update_src(next_aya_text);

            // we should scroll into the next aya
            next_aya_text.scrollIntoView({
                block: "center",
                behavior: "smooth"
            });

            Player.play_audio();
        } else if (current_aya === last_aya_of_page) {
            // aya is in current sura, but in different page
            // we must go to next page
            let next_page = owl_item.nextElementSibling;
            if (next_page) {
                next_page = next_page.firstElementChild;
                let next_item_number = next_page.classList[1];
                document.querySelectorAll("span.text").forEach(function (item) {
                    item.parentElement.classList.remove("selected");
                });
                Content.go_to_page(next_item_number, undefined, undefined);
            }
        } else if (next_aya === null) {
            console.log("there is something we must read in current page!");

            let current_sura = owl_item.querySelector("span.aya.selected").parentElement.parentElement;
            let next_sura = current_sura.nextSibling;
            if (next_sura) {
                let next_aya_text = next_sura.querySelector("span.aya > span.text");

                document.querySelectorAll("span.text").forEach(function (item) {
                    item.parentElement.classList.remove("selected");
                });
                // add selected class to the aya element
                Player.get_nex_audio(next_aya_text);
                next_aya_text.parentElement.classList.add("selected");

                // save position
                history.save_position(next_aya_text.parentElement);

                Player.update_src(next_aya_text);

                // we should scroll into the next aya
                next_aya_text.scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });

                Player.play_audio();
            }
        }
    }

    static get_nex_audio(next_aya_text) {
        let sura = next_aya_text.parentElement.parentElement.parentElement;

        let sura_id = String(sura.classList[1]);
        sura_id = sura_id.padStart(3, "0");

        let text_id = String(next_aya_text.id);
        text_id = text_id.padStart(3, "0");

        let url = Content.url.concat(sura_id + text_id, ".mp3");
        Player.cache_audio(url, new Audio(url));
    }

    static play_audio() {
        Player.play_logo.classList.remove("active");
        Player.pause_logo.classList.add("active");
        Player.playing = true;
        Player.audio.load();
        Player.speedSet(null);
        Player.audio.play();
    }

    static pause_audio() {
        Player.play_logo.classList.add("active");
        Player.pause_logo.classList.remove("active");
        Player.playing = false;
        Player.audio.pause();
    }
}
