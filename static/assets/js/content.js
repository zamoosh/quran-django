import {toArabicNumber} from "./utils.js";
import {Tab} from "./tab.js";
import {Player} from "./player.js";
import {History} from "./history.js";

export class Content {
    static carousel = $(".owl-carousel");
    static pages = {};
    static pages_added = [];
    static page_number = document.querySelector("span#page_number");
    static page_sura = document.querySelector(".header__surah > span");
    static page_updated = false;
    static url = "https://tanzil.net/res/audio/afasy/";
    static content_added = false;

    static update_content(content, page_number, sura_id, dont_update) {
        Content.content_added = false;
        page_number = String(page_number--);
        let current_page = 0;
        let current_page_number = 1;
        let page = "";
        let prev_sura_id = "";
        for (const row of content["pack"]) {
            // prepare the aya
            let ayahs = Content.prepare_aya(row);

            if (row.page === 502)
                console.log(" ali ali ali ");

            if (row.index === 4736) {
                console.log(row.index);
            }

            // updating existing page
            if (current_page === row.page) {

                // prev_sura_id = Content.add_sura_title(page, row, prev_sura_id, ayahs);
                if (prev_sura_id !== row.sura && row.aya === 1) {

                    let sura = document.createElement("div");
                    sura.classList.add("sura");
                    sura.classList.add(row.sura);
                    sura.dataset.sura = row.sura_name;
                    sura.dataset.juz = row.juz;

                    // creates and return title for sura
                    let title = Content.add_sura_title(row);
                    sura.appendChild(title);

                    // replace besm allah if sura == 1
                    Content.replace_besm_allah(row, sura);


                    // add content(sura text is here)
                    let content = document.createElement("div");
                    content.classList.add("content");
                    // content.innerHTML = ayahs;
                    content.appendChild(ayahs);

                    sura.appendChild(content);

                    page.appendChild(sura);

                    prev_sura_id = row.sura;
                }

                if (row.aya !== 1) {
                    // this peace of code, update the content for the operating sura
                    // if you look at the code, you will understand that we're updating content using '+='
                    if (page.getElementsByClassName(row.sura)) {
                        let content = page.getElementsByClassName(`sura ${row.sura}`)[0].querySelector(".content");
                        // content.innerHTML += ayahs;
                        content.appendChild(ayahs);
                    } else {
                        let content = page.getElementsByClassName("content")[0].querySelector(".content");
                        // content.innerHTML += ayahs;
                        content.appendChild(ayahs);
                    }
                }
            } else {
                // creating new page
                current_page = row.page;
                page = Content.add_page(row);

                let sura = document.createElement("div");
                sura.classList.add("sura");
                sura.classList.add(row.sura);
                sura.dataset.sura = row.sura_name;
                sura.dataset.juz = row.juz;

                // prev_sura_id = Content.add_sura_title(page, row, prev_sura_id, ayahs);
                if (prev_sura_id !== row.sura && row.aya === 1) {

                    // creates and return title for sura
                    let title = Content.add_sura_title(row);
                    sura.appendChild(title);

                    // replace besm allah if sura == 1
                    Content.replace_besm_allah(row, sura);

                    prev_sura_id = row.sura;
                }

                // add content(sura text is here)
                let content = document.createElement("div");
                content.classList.add("content");
                // content.innerHTML = ayahs;
                content.appendChild(ayahs);

                sura.appendChild(content);

                page.appendChild(sura);

                Content.pages_added.push(row.page);
                current_page_number++;
                Content.pages[current_page] = page;
            }
            ayahs = "";
        }

        Content.update_carousel();

        // add event listener for every span.text in pages to play audio
        let pages = document.querySelectorAll(".owl-carousel .owl-item");
        let history = History.get_instance();
        for (const page of pages) {
            if (page.getAttribute("clickable"))
                continue;
            page.addEventListener("click", function (event) {
                if (event.target.classList.contains("text")) {
                    // remove selected class of aya element
                    document.querySelectorAll("span.text").forEach(function (item) {
                        item.parentElement.classList.remove("selected");
                    });
                    // add selected class to the aya element
                    let text = event.target;
                    text.parentElement.classList.add("selected");

                    // save position
                    history.save_position(text.parentElement);

                    let sura = text.parentElement.parentElement.parentElement;
                    Content.update_page_sura(sura.dataset.sura);

                    text.parentElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });

                    // let url = Content.url.concat(sura_id + text_id, ".mp3");
                    Player.restart_progressbar();
                    Player.update_src(text);
                    if (Player.playing) {
                        Player.play_audio();
                    }
                }
            });
            page.setAttribute("clickable", true);
        }

        Content.content_added = true;
    }

    static listener_for_text() {

    }

    static update_page_number(page_number) {
        if (!isNaN(page_number)) {
            Content.page_number.innerHTML = toArabicNumber(page_number);
            Content.page_number.dataset.number = Number(page_number);
        }
    }

    static update_page_sura(sura_name) {
        if (sura_name !== undefined)
            Content.page_sura.innerHTML = sura_name;
    }

    static add_sura_title(row) {
        let title = document.createElement("div");
        title.innerHTML = `<span>
                                <!-- <span>﴿</span> -->
                                <span class="sura_name">${row.sura_name}</span>
                                <!-- <span>﴾</span> -->
                           </span>`;
        title.classList.add("title");
        return title;
    }

    static update_carousel() {
        // update each page of carousel. It changes the innerHTML
        for (const page of Content.pages_added) {
            let item = document.getElementsByClassName(`item ${page}`)[0];
            item.innerHTML = Content.pages[page].innerHTML;
        }
        Content.pages_added = [];
    }

    static go_to_page2(page_number) {
        Content.carousel.trigger("to.owl.carousel", [page_number - 1, 0]);
        Content.update_page_number(page_number);

        Tab.update_page_list(page_number);
    }

    static got_to_aya(sura_id, aya_id) {
        let page = document.getElementsByClassName(`owl-item active`)[0].firstElementChild;
        let sura = page.getElementsByClassName(`sura ${sura_id}`)[0];
        let text = sura.getElementsByClassName(`text ${aya_id}`)[0];

        document.querySelectorAll("span.text").forEach(function (item) {
            item.parentElement.classList.remove("selected");
        });
        text.parentElement.classList.add("selected");
        text.parentElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        Content.update_page_sura(sura.dataset.sura);
        Tab.update_sura_list();
        Tab.update_juz_list(page.classList[1]);

        History.get_instance().save_position(text.parentElement);
    }

    static add_page(row) {
        let page;
        page = document.createElement("div");
        page.classList.add("item");
        page.classList.add(String(row.page));
        if (row.page % 10 === 0)
            page.classList.add("ajax");
        return page;
    }


    static prepare_aya(row) {
        let bes = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
        let aya_text = "";
        if (row.sura === 1)
            aya_text = row.text;
        else
            aya_text = row.text.replace(bes, "");
        let aya = document.createElement("span");
        aya.classList.add("aya");

        let text = document.createElement("span");
        text.id = row.aya;
        text.classList.add("text");
        text.classList.add(row.aya);
        text.innerText += aya_text;

        let number = document.createElement("span");
        number.classList.add("number");
        number.innerText += toArabicNumber(row.aya);

        text.append(number);

        aya.appendChild(text);
        return aya;
    }

    static replace_besm_allah(row, sura) {
        let bes = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
        if (row.sura !== 1 && row.aya === 1) {
            let besm_allah = document.createElement("div");
            besm_allah.classList.add("besm-allah");
            besm_allah.innerHTML = bes;
            sura.appendChild(besm_allah);
        }
    }

    static ajax_next_page(pack_number) {
        $.ajax({
            method: "GET",
            url: get_pack_url.replace(0, pack_number),
            cache: true,
            success: function (context) {
                let page_number = context["page_number"];
                if (!Tab.packs.includes(context["pack_id"]))
                    Tab.packs.push(context["pack_id"]);

                // is the third parameter (sura_id) is null, then it won't scroll in to the sura
                Content.update_content(context, page_number, null, false);
            },
            error: function () {
                console.log("error");
            }
        });
    }
}
