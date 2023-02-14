class Tab {
    constructor() {
        this.tabButtons = document.querySelectorAll(".side-menu__btn-group button");
        this.tabPanels = {};
        this.tabButtons.forEach(btn => {
            this.tabPanels[btn.dataset.bsTarget] = document.querySelector(btn.dataset.bsTarget);
            btn.addEventListener("click", this.toggleTab.bind(this, btn));
        });
        
        this.sura_list();
    }
    
    toggleTab(btn) {
        this.tabButtons.forEach(b => {
            b.classList.remove("active");
            let tab = this.tabPanels[b.dataset.bsTarget];
            tab.classList.remove("show");
            tab.classList.remove("active");
        });
        
        btn.classList.toggle("active");
        let tabPanel = this.tabPanels[btn.dataset.bsTarget];
        tabPanel.classList.toggle("show");
        tabPanel.classList.toggle("active");
    }
    
    sura_list() {
        let obj = this;
        // const xhttp = new XMLHttpRequest();
        // xhttp.open("GET", sura_list_url, true);
        // xhttp.send();
        // xhttp.addEventListener("readystatechange", () => {
        //     if (xhttp.readyState === 4 && xhttp.status === 200) {
        //         let suraList = JSON.parse(xhttp.responseText);
        //         for (const suraListElement of suraList['sura_list']) {
        //             console.log(suraListElement);
        //         }
        //     }
        // });
        let sura = this.tabPanels['#sura'];
        
        $.ajax({
            method: 'GET',
            url: sura_list_url,
            data: {},
            cache: true,
            success: function (context) {
                for (const s of context['sura_list']) {
                    let item = `<a href="#" class="" aria-current="true">${s.sura_name}</a><br />`;
                    sura.innerHTML += item;
                }
            },
            error: function () {
                console.log("error");
            }
        });
    }
}
