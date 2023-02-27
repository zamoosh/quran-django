import {toArabicNumber} from "./utils.js";
import {Tab} from "./tab.js";
import {Player} from "./player.js";

export class Content {
    static carousel = $(".owl-carousel");
    static pages = {};
    static pages_added = [];
    static page_number = document.querySelector("span#page_number");
    static page_sura = document.querySelector(".header__surah > span");
    static url = "https://tanzil.net/res/audio/afasy/";

    static update_content(content, page_number, sura_id) {
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
                        let content = page.getElementsByClassName(row.sura)[0].querySelector(".content");
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

        Content.go_to_page(page_number, sura_id, undefined);

        // add event listener for every span.text in pages
        let pages = document.querySelectorAll(".owl-carousel .owl-item");
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

                    let sura = text.parentElement.parentElement.parentElement;

                    let sura_id = String(sura.classList[1]);
                    sura_id = sura_id.padStart(3, "0");

                    let text_id = String(text.id);
                    text_id = text_id.padStart(3, "0");

                    let url = Content.url.concat(sura_id + text_id, ".mp3");
                    Player.restart_progressbar();
                    Player.update_src(url);
                }
            });
            page.setAttribute("clickable", true);
        }

        // Content.update_page_sura();
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

    static go_to_page(page_number, sura_id, sura_name) {
        // if sura_id is null, then it won't scroll in to the sura
        if (sura_id !== null) {
            // when we have sura_id (get sura api)
            let sura = document.getElementsByClassName(`sura ${sura_id}`)[0];

            // get sura using juz id (get juz api)
            if (sura === undefined) {
                sura = document.querySelector(`[data-juz='${sura_id}']`);
            }

            // get sura using only page number (get page api)
            if (sura === undefined || sura === null) {
                sura = document.getElementsByClassName(`item ${page_number}`)[0].firstElementChild;
            }

            document.querySelectorAll("span.text").forEach(function (item) {
                item.parentElement.classList.remove("selected");
            });
            let first_aya = sura.querySelector("span.aya > span.text");
            first_aya.parentElement.classList.add("selected");
            Player.restart_progressbar();
            Player.update_src(first_aya);

            let sura_name = sura.dataset.sura;
            page_number = sura.parentElement.classList[1];

            if (page_number === Content.page_number.dataset.number) {
                // in the same page
                sura.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });

                console.log(first_aya);
            } else {
                // not in the same page
                Content.carousel.trigger("to.owl.carousel", page_number - 1);
                let promise = new Promise(function (resolve, reject) {
                    Content.carousel.on("translated.owl.carousel", function (event) {
                        resolve(true);
                    });
                });
                Content.update_page_sura(sura_name);
                promise.then(function (result) {
                    if (result) {
                        sura.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "center"
                        });

                        console.log(first_aya);
                    }
                });
            }
        }

        if (sura_name !== undefined) {
            // if sura_name is passed, then we're going to replace it.
            Content.update_page_sura(sura_name);
        }
        // else if (page_number !== undefined) {
        //     // getting the page
        //     let page = document.getElementsByClassName(`item ${page_number}`)[0];
        //     if (sura_id) {
        //         // if sura_id is exists, then the sura_name, should be the sura_id's name.
        //         sura_name = page.getElementsByClassName(`sura ${sura_id}`)[0].dataset.sura;
        //     } else {
        //         // else, we're going to calculate the sura name. (first sura of page)
        //         sura_name = page.firstElementChild.dataset.sura;
        //     }
        //     Content.update_page_sura(sura_name);
        // }
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
                let pack = context["pack"];
                let sura_ids = pack.map(function (item) {
                    return item["sura"];
                });
                sura_ids = [...new Set(sura_ids)];
                Tab.rows = Tab.rows.concat(sura_ids);

                // is the third parameter (sura_id) is null, then it won't scroll in to the sura
                Content.update_content(context, page_number, null);
            },
            error: function () {
                console.log("error");
            }
        });
    }
}
