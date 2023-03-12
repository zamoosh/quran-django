import {toArabicNumber} from "./utils.js";

export class Home {
    static instance;

    constructor() {
        this.sura_list = [];
        this.juz_list = [];
        this.sura_list_carousel = document.querySelector(".sura_list_carousel__content");
        this.sura_list_content = document.querySelector(".sura_list__content");
        this.juz_list_container = document.querySelector(".juz_list__content");
        this.juz_list_body = document.querySelector(".juz_list__content__body");
        this.juz_list_body_collapse = this.juz_list_container.querySelector(".show");
        this.sura_list_collapse = this.sura_list_content.querySelector(".show");
        this.expand_button_juz = document.getElementById("expand-juz");
        this.expand_button_sura = document.getElementById("expand-sura");

        this.expand_juz_list();
        this.expand_sura_list();
    }

    static get_instance() {
        if (!Home.instance)
            Home.instance = new Home();
        return Home.instance;
    }

    prepare_sura_list_carousel() {
        for (const sura of this.sura_list) {
            let sura_name_element = document.createElement("a");
            sura_name_element.href = `/sura/${sura.sura}:1`;
            sura_name_element.classList.add("sura-name");
            sura_name_element.innerHTML = sura.sura_name;

            // owl_item.appendChild(sura_name_element);
            this.sura_list_carousel.appendChild(sura_name_element);
        }
        let carousel = $(".owl-carousel");
        carousel.owlCarousel({
            items: 2.5,
            autoplay: true,
            autoplayHoverPause: true,
            autoplayTimeout: 2000,
            autoplaySpeed: 400,
            loop: true,
            rtl: true,
            margin: 20,
            dotsData: false,
            dots: false,
            paginationSpeed: 300,
            smartSpeed: 100,
            responsive: {
                0: {
                    items: 2.7,
                },
                480: {
                    items: 3.8,
                },
                768: {
                    items: 5.5,
                },
                992: {
                    items: 7.5,
                }
            }
        });
    }

    prepare_sura_list() {
        for (let i = 8; i < this.sura_list.length; i++) {
            console.log(this.sura_list[i]);
            let sura_name_element = document.createElement("a");
            sura_name_element.classList.add("sura-name");
            sura_name_element.href = `/sura/${this.sura_list[i].sura}:1`;

            let sura_number = document.createElement("span");
            sura_number.classList.add("sura-name__number");
            sura_number.innerHTML = toArabicNumber(this.sura_list[i].sura);

            let sura_name = document.createElement("span");
            sura_name.classList.add("sura-name__name");
            sura_name.innerHTML = this.sura_list[i].sura_name;

            sura_name_element.appendChild(sura_number);
            sura_name_element.appendChild(sura_name);

            this.sura_list_collapse.firstElementChild.appendChild(sura_name_element);
        }
    }

    expand_juz_list() {
        let h = this.juz_list_body.getBoundingClientRect().height;
        this.expand_button_juz.addEventListener("click", function () {
            this.juz_list_body_collapse.classList.toggle("expanded");
            if (this.juz_list_body_collapse.classList.contains("expanded")) {
                this.expand_button_juz.innerHTML = "الكم";
                this.juz_list_body_collapse.style.height = `${h}px`;
            } else {
                this.expand_button_juz.innerHTML = "المزيد";
                this.juz_list_body_collapse.style.height = "0px";
            }
        }.bind(this));
    }

    expand_sura_list() {
        this.expand_button_sura.addEventListener("click", function () {
            let h = this.sura_list_collapse.firstElementChild.getBoundingClientRect().height;
            this.sura_list_collapse.classList.toggle("expanded");
            if (this.sura_list_collapse.classList.contains("expanded")) {
                this.expand_button_sura.innerHTML = "الكم";
                this.sura_list_collapse.style.height = `${h}px`;
            } else {
                this.expand_button_sura.innerHTML = "المزيد";
                this.sura_list_collapse.style.height = "0px";
            }
        }.bind(this));
    }
}
