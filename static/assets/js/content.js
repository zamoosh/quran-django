import {toArabicNumber} from "./utils.js";

export class Content {

    static update_content(content) {
        let bes = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
        let ayahs = "";
        let current_page = 0;
        let pages = [];
        let page;
        let prev_sura_name = "";
        for (const row of content["pack"]) {
            let text = "";
            if (row.sura === 1)
                text = row.text;
            else
                text = row.text.replace(bes, "");
            ayahs += `<span class="aya">
                          <span class="text" id="${row.index}">
                              ${text}
                              <span class="number">${toArabicNumber(row.aya)}</span>
                          </span>
                          <!-- <span class="number">﴿${toArabicNumber(row.aya)}﴾</span> -->
                          <!-- <span class="number">${toArabicNumber(row.aya)}</span> -->
                      </span>`;

            if (current_page === row.page) {
                if (prev_sura_name !== row.sura_name) {
                    let sura = document.createElement("div");
                    sura.classList.add("sura");
                    sura.classList.add(row.sura_name);

                    let title = document.createElement("div");
                    title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
                    title.classList.add("title");

                    sura.appendChild(title);

                    if (row.sura !== 1) {
                        let besm_allah = document.createElement("div");
                        besm_allah.classList.add("besm-allah");
                        besm_allah.innerHTML = bes;
                        sura.appendChild(besm_allah);
                    }

                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);

                    prev_sura_name = row.sura_name;
                }

                if (row.index === 12)
                    console.log("13");

                if (page.getElementsByClassName(prev_sura_name)) {
                    let content = page.getElementsByClassName(prev_sura_name)[0].querySelector(".content");
                    content.innerHTML += ayahs;
                } else {
                    let content = page.getElementsByClassName("content")[0].querySelector(".content");
                    content.innerHTML += ayahs;
                }
            } else {
                current_page = row.page;
                page = Content.add_page(row);

                let sura = document.createElement("div");
                sura.classList.add("sura");
                sura.classList.add(row.sura_name);

                // adding title to the sura in new page
                if (prev_sura_name !== row.sura_name) {
                    let title = document.createElement("div");
                    title.innerHTML = `<span>
                                            <!-- <span>﴿</span> -->
                                            <span class="sura_name">${row.sura_name}</span>
                                            <!-- <span>﴾</span> -->
                                       </span>`;
                    title.classList.add("title");

                    sura.appendChild(title);

                    if (row.sura !== 1) {
                        let besm_allah = document.createElement("div");
                        besm_allah.classList.add("besm-allah");
                        besm_allah.innerHTML = bes;
                        sura.appendChild(besm_allah);
                    }

                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);

                    prev_sura_name = row.sura_name;
                } else {
                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = ayahs;

                    sura.appendChild(content);

                    page.appendChild(sura);
                }

                pages.push(page);
            }
            ayahs = "";
        }
        let carousel = $(".owl-carousel");
        for (const page of pages) {
            carousel.trigger("add.owl.carousel", page).trigger("refresh.owl.carousel");
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
