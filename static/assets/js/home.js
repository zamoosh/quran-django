export class Home {
    static instance;

    constructor() {
        this.sura_list = [];
        this.juz_list = [];
        this.sura_list_carousel = document.querySelector(".sura_list__content");

    }

    static get_instance() {
        if (!Home.instance)
            Home.instance = new Home();
        return Home.instance;
    }

    prepare_sura_list_carousel() {
        // for (const sura of this.sura_list) {
        //     let owl_item = document.createElement("div");
        //     owl_item.classList.add("owl-item");
        //
        //     let sura_name_element = document.createElement("div");
        //     sura_name_element.classList.add("sura-name");
        //     sura_name_element.innerHTML = sura.sura_name;
        //
        //     owl_item.appendChild(sura_name_element);
        //     this.sura_list_carousel.appendChild(owl_item);
        // }
        for (const sura of this.sura_list) {
            // let owl_item = document.createElement("div");
            // owl_item.classList.add("owl-item");

            let sura_name_element = document.createElement("div");
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
        });
    }
}
