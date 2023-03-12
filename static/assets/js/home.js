import {toArabicNumber} from "./utils.js";

export class Home {
    static instance;

    constructor() {
        this.sura_list = [];
        this.juz_list = [];
        this.sura_list_carousel = document.querySelector(".sura_list__content");
        this.juz_list_container = document.querySelector(".juz_list__content");
        this.expand_button = document.getElementById("expand");

        this.expand_juz_list();
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

    prepare_juz_list() {
        for (const juz of this.juz_list) {
            let juz_name_element = document.createElement("a");
            juz_name_element.href = `/juz/${juz}`;
            juz_name_element.classList.add("juz-name");
            juz_name_element.innerHTML = toArabicNumber(juz);

            this.juz_list_container.appendChild(juz_name_element);
        }
    }

    expand_juz_list() {
        console.log("expanding the juz list");
        // this.expand_button.addEventListener("click", expand_collapse.bind(this));
        this.expand_button.addEventListener("click", function () {
            if (this.juz_list_container.classList.contains("expanded")) {
                this.juz_list_container.classList.remove("expanded");
                this.expand_button.innerHTML = "الكم";
            } else {
                this.juz_list_container.classList.add("expanded");
                this.expand_button.innerHTML = "المزيد";
            }
        }.bind(this));
    }
}
