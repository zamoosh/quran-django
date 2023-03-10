import {Content} from "./content.js";
import {History} from "./history.js";

export class Player {
    player;
    static play_logo;
    static pause_logo;
    static audio = document.querySelector("audio");
    static playing = false;
    static is_play_besm = false;
    static progress_bar = document.querySelector("progress");
    static speed_toolbar;
    singer;
    static speed_selected;
    footer_settings;
    footer_settings_logo;
    static font_change;
    static cached_audio = {};
    static loaded_src = false;
    static current_src = "";
    static first_aya_played = false;
    static base_url = "https://tanzil.net/res/audio/afasy/";

    constructor(selector) {
        this.player = document.getElementById(selector);
        let logos = this.player.querySelectorAll("img.logo");
        Player.play_logo = logos[0];
        Player.pause_logo = logos[1];
        Player.speed_toolbar = this.player.querySelector(".footer__speed-toolbar");
        this.singer = this.player.querySelector(".footer__singer");
        Player.speed_selected = Player.speed_toolbar.querySelector(".footer__speed-selected");
        this.footer_settings = document.querySelector(".footer__settings");
        this.footer_settings_logo = this.footer_settings.querySelector(".footer__settings");

        this.makePlayable();
        this.updateProgressBar();
        this.speedControl();
        this.fontControl();
        this.themeChange();
        this.changeSinger();
    }

    makePlayable() {
        let play_pause_btn = this.player.querySelector(".footer__player");
        play_pause_btn.addEventListener("click", this.togglePlay.bind(this));
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

    togglePlay() {
        Player.playing = !Player.audio.paused;
        if (Player.playing) {
            Player.pause_audio();
            Player.playing = false;
        } else {
            Player.play_audio();
        }
    }

    static toggle_shape() {
        Player.play_logo.classList.toggle("active");
        Player.pause_logo.classList.toggle("active");
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

            if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
                console.log("using chromium");
                const current_aya_jq = $(current_aya);
                $([document.documentElement, document.body]).animate({
                    scrollTop: current_aya_jq.offset().top - 2 * current_aya_jq.outerHeight()
                }, 300);
            } else {
                console.log("MDB");
                current_aya.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            // current_aya.scrollIntoView({
            //     behavior: "smooth",
            //     block: "center"
            // });

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
            if (Player.is_play_besm) {
                Player.is_play_besm = false;
                Player.first_aya_played = false;
                Player.play_besm();
            } else
                Player.go_to_next_aya();
        });
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
        Player.pause_audio();
        Player.audio.currentTime = 0;
        Player.progress_bar.value = 0;
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

            // means was playing before. so we must play the aya number 1
            if (current_aya.firstElementChild.id === "1" && !Player.first_aya_played) {
                let current_aya_text = current_aya.firstElementChild;
                Player.update_src(current_aya_text);
                Player.is_play_besm = false;

                if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
                    console.log("using chromium");
                    const current_aya_text_jq = $(current_aya_text);
                    $([document.documentElement, document.body]).animate({
                        scrollTop: current_aya_text_jq.offset().top - 2 * current_aya_text_jq.outerHeight()
                    }, 300);
                } else {
                    console.log("MDB");
                    current_aya.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                // current_aya_text.scrollIntoView({
                //     block: "center",
                //     behavior: "smooth"
                // });
                Player.play_audio();
                Player.first_aya_played = true;

                history.save_position(current_aya);
            } else if (Player.first_aya_played) {
                // next aya is exists in current page (owl-item)
                let next_aya_text = current_aya.nextElementSibling.firstElementChild;
                document.querySelectorAll("span.text").forEach(function (item) {
                    item.parentElement.classList.remove("selected");
                });
                // add selected class to the aya element
                next_aya_text.parentElement.classList.add("selected");

                Player.update_src(next_aya_text);

                // we should scroll into the next aya

                if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
                    console.log("using chromium");
                    const next_aya_text_jq = $(next_aya_text);
                    $([document.documentElement, document.body]).animate({
                        scrollTop: next_aya_text_jq.offset().top - 2 * next_aya_text_jq.outerHeight()
                    }, 300);
                } else {
                    console.log("MDB");
                    next_aya_text.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                // next_aya_text.scrollIntoView({
                //     block: "center",
                //     behavior: "smooth"
                // });
                Player.play_audio();
                history.save_position(next_aya);
            }
            Player.playing = true;

            // // next aya is exists in current page (owl-item)
            // let next_aya_text = current_aya.nextElementSibling.firstElementChild;
            // document.querySelectorAll("span.text").forEach(function (item) {
            //     item.parentElement.classList.remove("selected");
            // });
            // // add selected class to the aya element
            // next_aya_text.parentElement.classList.add("selected");
            //
            // Player.update_src(next_aya_text);
            //
            // // we should scroll into the next aya
            // next_aya_text.scrollIntoView({
            //     block: "center",
            //     behavior: "smooth"
            // });

            // Player.play_audio();

            // save position
            // history.save_position(next_aya_text.parentElement);
        } else if (current_aya === last_aya_of_page) {
            // aya is in current sura or not, but in different page
            // we must go to next page
            let next_page = owl_item.nextElementSibling;
            if (next_page) {
                next_page = next_page.firstElementChild;
                let next_item_number = next_page.classList[1];
                // document.querySelectorAll("span.text").forEach(function (item) {
                //     item.parentElement.classList.remove("selected");
                // });
                let selected_aya = next_page.querySelector("span.text");
                let sura = selected_aya.parentElement.parentElement.parentElement;
                // Content.go_to_page(next_item_number, undefined, undefined, selected_aya.id);
                Content.go_to_page2(next_item_number);
                Content.got_to_aya(sura.classList[1], selected_aya.id);

                // save position
                history.save_position(selected_aya.parentElement);
            }
        } else if (next_aya === null) {
            console.log("there is something we must read in current page!");

            Player.is_play_besm = true;

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
                // history.save_position(next_aya_text.parentElement);

                Player.update_src(next_aya_text);

                // we should scroll into the next aya

                if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1) {
                    console.log("using chromium");
                    const next_aya_text_jq = $(next_aya_text);
                    $([document.documentElement, document.body]).animate({
                        scrollTop: next_aya_text_jq.offset().top - 2 * next_aya_text_jq.outerHeight()
                    }, 300);
                } else {
                    console.log("MDB");
                    next_aya_text.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                // next_aya_text.scrollIntoView({
                //     block: "center",
                //     behavior: "smooth"
                // });

                Player.play_audio();

                // save position
                history.save_position(next_aya_text.parentElement);
            }
        }
    }

    static get_nex_audio(next_aya_text) {
        let sura = next_aya_text.parentElement.parentElement.parentElement;

        let sura_id = String(sura.classList[1]);
        sura_id = sura_id.padStart(3, "0");

        let text_id = String(next_aya_text.id);
        text_id = text_id.padStart(3, "0");

        let url = Player.base_url.concat(sura_id + text_id, ".mp3");
        Player.cache_audio(url, new Audio(url));
    }

    static play_audio() {
        // check if the sura is "TUBAH" or note (sura with id 9)
        let sura = document.querySelector("div.owl-item.active .sura");
        if (sura.classList[1] === "9") {
            Player.is_play_besm = false;
            Player.first_aya_played = true;
        }

        if (Player.is_play_besm) {
            // we must play the besm-allah
            Player.is_play_besm = false;
            Player.first_aya_played = false;
            Player.play_besm();
        } else {
            // we must NOT play the besm-allah
            let src = Player.audio.firstElementChild.src;
            let url = String(src);
            let audio_id = src.slice(src.length - 10).split(".mp3")[0];
            if (audio_id.slice(-3) === "000") {
                let url_array = url.split("");
                url_array[url.length - 5] = "1";
                url = url_array.join("");
                Player.download_src(url);
            } else {
                Player.is_play_besm = false;
                Player.first_aya_played = true;
            }
            Player.play_aya();
        }
    }

    static update_src(src) {
        // src is aya_text
        let sura = src.parentElement.parentElement.parentElement;
        let sura_id = String(sura.classList[1]);
        sura_id = sura_id.padStart(3, "0");

        let text_id = String(src.id);
        text_id = text_id.padStart(3, "0");

        let url = Player.base_url.concat(sura_id + text_id, ".mp3");
        Player.download_src(url);

        if (text_id === "001") {
            Player.is_play_besm = true;
            let besm_url = Player.base_url.concat(sura_id + "000", ".mp3");
            Player.download_src(besm_url);
        }

        Player.loaded_src = false;
    }

    static download_src(url) {
        if (Player.get_cache_audio(url)) {
            // audio is cached before
            Player.audio.firstElementChild.src = url;
        } else {
            // we need to get the audio
            Player.cache_audio(url, new Audio(url));
            Player.audio.firstElementChild.src = url;
        }
        Player.current_src = url;
    }

    static play_besm() {
        Player.audio.load();
        Player.play_logo.classList.remove("active");
        Player.pause_logo.classList.add("active");
        Player.playing = true;
        // Player.audio.firstElementChild.src = Player.cached_audio["besm"];
        Player.speedSet(null);
        Player.audio.play();
    }

    static play_aya() {
        Player.play_logo.classList.remove("active");
        Player.pause_logo.classList.add("active");
        Player.playing = true;
        if (!Player.loaded_src) {
            Player.loaded_src = true;
            Player.audio.load();
        }
        Player.speedSet(null);
        Player.audio.play();
    }

    static pause_audio() {
        Player.play_logo.classList.add("active");
        Player.pause_logo.classList.remove("active");
        // Player.playing = false;
        Player.audio.pause();
    }

    static change_base_singer_url(singer) {
        let url_arr = Player.base_url.split("/");
        url_arr[url_arr.length - 2] = singer;
        Player.base_url = url_arr.join("/");

        // we must change the current aya src and restart the progressbar
        let selected_aya_text = document.querySelector("span.aya.selected > span.text");
        Player.update_src(selected_aya_text);
        Player.restart_progressbar();
    }

    changeSinger() {
        const obj = this;
        const singer_selected = obj.player.querySelector(".footer__singer-selected");
        const buttons = obj.singer.querySelectorAll("button");

        obj.singer.addEventListener("click", function () {
            let btn_d = 36;
            let d = 50;
            obj.singer.classList.toggle("open");
            if (obj.singer.classList.contains("open")) {
                buttons.forEach((btn, index) => {
                    btn.classList.add("open");
                    btn.style.transform = `translate(0px, -${(index * btn_d) + d}px)`;
                    // btn.style.transitionDelay = (index * 100) / 2 + 'ms';
                });
            } else {
                buttons.forEach(btn => {
                    btn.classList.remove("open");
                });
            }
        });
        buttons.forEach(btn => {
            btn.addEventListener("click", function (event) {
                buttons.forEach(function (btn) {
                    btn.classList.remove("selected");
                    btn.classList.remove("active");
                });
                event.target.classList.add("selected");
                event.target.classList.add("active");

                singer_selected.innerHTML = event.target.innerHTML;
                Player.change_base_singer_url(event.target.value);
            });
        });
    }
}
