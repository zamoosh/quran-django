import {toArabicNumber} from "./utils.js";

export class Content {
    static carousel = $(".owl-carousel");

    static update_content(content, page_number, sura_id) {
        page_number = String(page_number--);
        let bes = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
        let ayahs = "";
        let current_page = 0;
        let pages = [];
        let page = "";
        let prev_sura_id = "";
        for (const row of content["pack"]) {
            // prepare the aya
            let text = "";
            if (row.sura === 1)
                text = row.text;
            else
                text = row.text.replace(bes, "");
            if (row.sura === 73 && row.aya === 19) {
                console.log("ali");
            }
            ayahs += `<span class="aya">
                          <span class="text" id="${row.index}">
                              ${text}
                              <span class="number">${toArabicNumber(row.aya)}</span>
                          </span>
                          <!-- <span class="number">﴿${toArabicNumber(row.aya)}﴾</span> -->
                          <!-- <span class="number">${toArabicNumber(row.aya)}</span> -->
                      </span>`;
            // end prepare the aya

            // updating existing page
            if (current_page === row.page) {

                // prev_sura_id = Content.add_sura_title(page, row, prev_sura_id, ayahs);
                if (prev_sura_id !== row.sura && row.aya === 1) {
                    // adding a title to the sura
                    let sura = document.createElement("div");
                    sura.classList.add("sura");
                    sura.classList.add(row.sura);

                    let title = document.createElement("div");
                    title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
                    title.classList.add("title");

                    sura.appendChild(title);

                    if (row.sura !== 1 && row.aya === 1) {
                        let besm_allah = document.createElement("div");
                        besm_allah.classList.add("besm-allah");
                        besm_allah.innerHTML = bes;
                        sura.appendChild(besm_allah);
                    }

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

                // prev_sura_id = Content.add_sura_title(page, row, prev_sura_id, ayahs);

                if (prev_sura_id !== row.sura && row.aya === 1) {
                    // adding a title to the sura
                    let title = document.createElement("div");
                    title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
                    title.classList.add("title");

                    sura.appendChild(title);

                    if (row.sura !== 1 && row.aya === 1) {
                        let besm_allah = document.createElement("div");
                        besm_allah.classList.add("besm-allah");
                        besm_allah.innerHTML = bes;
                        sura.appendChild(besm_allah);
                    }

                    // add content(sura text is here)


                    prev_sura_id = row.sura;
                }

                let content = document.createElement("div");
                content.classList.add("content");
                content.innerHTML = ayahs;

                sura.appendChild(content);

                page.appendChild(sura);

                pages.push(page);
            }
            ayahs = "";
        }

        Content.update_carousel(Content.carousel, pages);

        Content.go_to_page(Content.carousel, page_number, sura_id);

    }

    static add_sura_title(page, row, prev_sura_id, ayahs) {
        let bes = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
        if (prev_sura_id !== row.sura && row.aya === 1) {
            // adding a title to the sura
            let sura = document.createElement("div");
            sura.classList.add("sura");
            sura.classList.add(row.sura);

            let title = document.createElement("div");
            title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
            title.classList.add("title");

            sura.appendChild(title);

            if (row.sura !== 1 && row.aya === 1) {
                let besm_allah = document.createElement("div");
                besm_allah.classList.add("besm-allah");
                besm_allah.innerHTML = bes;
                sura.appendChild(besm_allah);
            }

            // add content(sura text is here)
            let content = document.createElement("div");
            content.classList.add("content");
            content.innerHTML = ayahs;

            sura.appendChild(content);

            page.appendChild(sura);

            prev_sura_id = row.sura;
        }
        return prev_sura_id;
    }

    static update_carousel(carousel, pages) {
        for (const page of pages) {
            carousel.trigger("add.owl.carousel", page).trigger("refresh.owl.carousel");
        }
    }

    static go_to_page(carousel, page_number, sura_id) {
        let index_list = {};
        let page_list = carousel.find(".owl-item > *");
        for (let i = 0; i < page_list.length; i++) {
            let item_number = page_list[i].classList[1];
            index_list[item_number] = i;
        }

        if (index_list[page_number]) {
            let item_number = Number(index_list[page_number]);
            carousel.trigger("to.owl.carousel", item_number);

            // scroll into the sura element
            carousel.on("translated.owl.carousel", function () {
                let sura_content = document.getElementsByClassName(`sura ${sura_id}`)[0];
                sura_content.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                carousel.unbind("translated.owl.carousel");
            });
        }
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


}
