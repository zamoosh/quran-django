import {Content} from "./content.js";

export class Player {
    player;
    static play_logo;
    static pause_logo;
    static audio = document.querySelector("audio");
    playing = false;
    static progress_bar = document.querySelector("progress");
    speed_toolbar;
    speed_selected;
    footer_settings;
    footer_settings_logo;
    static font_change;
    static cached_audio = {};

    constructor(selector) {
        this.player = document.getElementById(selector);
        let logos = this.player.querySelectorAll("img.logo");
        Player.play_logo = logos[0];
        Player.pause_logo = logos[1];
        this.speed_toolbar = this.player.querySelector(".footer__speed-toolbar");
        this.speed_selected = this.speed_toolbar.querySelector(".footer__speed-selected");
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
        this.playing = !Player.audio.paused;
        if (this.playing) {
            Player.audio.pause();
            this.playing = false;
            Player.toggle_shape();
        } else {
            Player.audio.play();
            this.playing = true;
            Player.toggle_shape();
        }
    }

    static toggle_shape() {
        Player.play_logo.classList.toggle("active");
        Player.pause_logo.classList.toggle("active");
    }

    static update_src(src) {
        // src is an url for an aya
        if (typeof src === "string") {
            console.log(Player.cached_audio);
            if (Player.get_cache_audio(src)) {
                // audio is cached before
                Player.audio.firstElementChild.src = src;
            } else {
                // we need to get the audio
                Player.cache_audio(src, new Audio(src));
                Player.audio.firstElementChild.src = src;
            }
            Player.audio.load();
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

        Player.audio.addEventListener("ended", Player.restart_progressbar);
    }

    speedControl() {
        this.speed_toolbar.addEventListener("click", this.toggleSpeeds.bind(this));
    }

    toggleSpeeds() {
        let btn_d = 36;
        let d = 45;
        let buttons = this.speed_toolbar.querySelectorAll("button");
        this.speed_toolbar.classList.toggle("open");
        if (this.speed_toolbar.classList.contains("open")) {
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
            btn.addEventListener("click", this.speedSet.bind(this));
        });
    }

    speedSet(e) {
        let buttons = this.speed_toolbar.querySelectorAll("button");
        buttons.forEach(btn => {
            btn.classList.remove("active");
        });
        e.target.classList.add("active");
        this.speed_selected.innerHTML = e.target.innerHTML;
        Player.audio.playbackRate = e.target.value;
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
}
