class Player {
    player;
    play_logo;
    pause_logo;
    audio;
    playing = false;
    progress_bar;
    speed_toolbar;
    speed_selected;
    footer_settings;
    footer_settings_logo;

    constructor(selector) {
        this.player = document.getElementById(selector);
        let logos = this.player.querySelectorAll("img.logo");
        this.play_logo = logos[0];
        this.pause_logo = logos[1];
        this.audio = document.querySelector("audio");
        this.progress_bar = document.querySelector("progress");
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
        let obj = this;
        let play_pause_btn = this.player.querySelector(".footer__player");
        play_pause_btn.addEventListener("click", function () {
            obj.togglePlay();
        });
    }

    togglePlay() {
        if (this.playing) {
            this.audio.pause();
            this.playing = false;
            toggleShape(this);
        } else {
            this.audio.play();
            this.playing = true;
            toggleShape(this);
        }

        function toggleShape(obj) {
            obj.play_logo.classList.toggle("active");
            obj.pause_logo.classList.toggle("active");
        }
    }

    updateProgressBar() {
        let obj = this;
        let current_time;
        obj.audio.addEventListener("timeupdate", updateProgressBar);

        function updateProgressBar() {
            current_time = Math.ceil(obj.audio.currentTime);
            obj.progress_bar.value = (current_time / obj.audio.duration) * 100;
        }
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
        this.audio.playbackRate = e.target.value;
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
        if (e.target.tagName === "DIV" || e.target.tagName === "IMG")
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
        let elements = document.querySelectorAll(".main p");
        if (btn.value === "plus") {
            elements.forEach(element => {
                let size = parseInt(window.getComputedStyle(element).fontSize);
                element.style.fontSize = size + 2 + "px";
            });
        } else {
            elements.forEach(element => {
                let size = parseInt(window.getComputedStyle(element).fontSize);
                element.style.fontSize = size - 2 + "px";
            });
        }
    }

    themeChange() {
        let btn = this.footer_settings.querySelector("button.theme");
        let sepia = this.footer_settings.querySelector("button.sepia");
        btn.addEventListener("click", function () {
            document.body.classList.toggle("dark");
            document.body.classList.remove("sepia");
            btn.classList.add('active');
            sepia.classList.remove('active');
        });

        sepia.addEventListener("click", function () {
            document.body.classList.toggle("sepia");
            document.body.classList.remove("dark");
            btn.classList.remove('active');
            sepia.classList.add('active');
        });
    }
}
