import {toArabicNumber} from "./utils.js";
import {Tab} from "./tab.js";

export class Content {
    static carousel = $(".owl-carousel");
    static pages = {};
    static pages_added = [];
    static page_number = document.querySelector("span#page_number");
    static page_sura = document.querySelector(".header__surah > span");

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
                console.log(' ali ali ali ');

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
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);

                    prev_sura_id = row.sura;
                }

                if (row.aya !== 1) {
                    // this peace of code, update the content for the operating sura
                    // if you look at the code, you will understand that we're updating content using '+='
                    if (page.getElementsByClassName(row.sura)) {
                        let content = page.getElementsByClassName(row.sura)[0].querySelector(".content");
                        content.innerHTML += ayahs;
                    } else {
                        let content = page.getElementsByClassName("content")[0].querySelector(".content");
                        content.innerHTML += ayahs;
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
                content.innerHTML = ayahs;

                sura.appendChild(content);

                page.appendChild(sura);

                Content.pages_added.push(row.page);
                current_page_number++;
                Content.pages[current_page] = page;
            }
            ayahs = "";
        }

        // Content.update_pages(new_pages);

        Content.update_carousel();

        Content.go_to_page(page_number, sura_id, undefined);

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
            let sura = document.getElementsByClassName(`sura ${sura_id}`)[0];

            // get sura using juz id
            if (sura === undefined) {
                sura = document.querySelector(`[data-juz='${sura_id}']`);
            }
            let sura_name = sura.dataset.sura;
            page_number = sura.parentElement.classList[1];

            if (page_number === Content.page_number.dataset.number) {
                // in the same page
                sura.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });
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
        let text = "";
        if (row.sura === 1)
            text = row.text;
        else
            text = row.text.replace(bes, "");

        return `<span class="aya">
                    <span class="text" id="${row.index}">
                        ${text}
                        <span class="number">${toArabicNumber(row.aya)}</span>
                    </span>
                    <!-- <span class="number">﴿${toArabicNumber(row.aya)}﴾</span> -->
                    <!-- <span class="number">${toArabicNumber(row.aya)}</span> -->
                </span>`;
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

    // static update_pages(new_pages) {
    //     if (Content.pages.length === 0) {
    //         Content.pages = [...new_pages];
    //     }
    //     // first and last page number in 'Content.pages'
    //     let first_page_number = Content.pages[0].classList[1];
    //     let last_page_number = Content.pages[Content.pages.length - 1].classList[1];
    //
    //     // first and last page number in 'new_pages'
    //     let first_number = new_pages[0].classList[1];
    //     let last_number = new_pages[new_pages.length - 1].classList[1];
    //
    //     console.log(first_page_number, last_page_number);
    //     console.log(first_number, last_number);
    //
    //     if (last_page_number < first_number) {
    //         // new pages, should be added to the end of Content.pages
    //         console.log("add the end of pages");
    //         Content.pages = Content.pages.concat(new_pages);
    //
    //     } else if (first_page_number > last_number) {
    //         // new pages, should be added to the beginning of Content.pages
    //         console.log("add the beginning of pages");
    //         Content.pages = new_pages.concat(Content.pages);
    //     } else {
    //         // new pages, should be added to the middle of the Content.pages
    //         console.log("add to the middle of pages!");
    //
    //         // for now, I'm doing this
    //         Content.pages.concat(new_pages);
    //     }
    //
    // }

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
