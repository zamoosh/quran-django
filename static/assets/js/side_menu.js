class SideMenu {
    static object = null;
    menu;
    menu_btn;
    menu_btn__burger;
    is_closed = true;
    is_dragging = false;
    initial_x = null;


    constructor(selector) {
        this.menu = document.querySelector(selector);
        this.menu_btn = document.querySelector(".header__menu-btn");
        this.menu_btn__burger = document.querySelector(".header__menu-btn__burger");
        SideMenu.object = this;

        this.clickableMenuBtn();
        this.mouse_drag_handling();
        this.touch_drag_handling();
    }

    clickableMenuBtn() {
        let object = this;
        let main = document.querySelector(".main");

        this.menu_btn.addEventListener("click", function () {
            object.toggleMenu();
        });

        main.addEventListener("click", (e) => {
            if (object.menu.classList.contains("open"))
                if (!e.target.closest(".side-menu"))
                    object.toggleMenu();
        });
    }

    toggleMenu() {
        this.menu_btn__burger.classList.toggle("open");
        this.menu.style.transform = null;
        if (this.menu_btn__burger.classList.contains("open")) {
            this.menu.classList.add("open");
            this.is_dragging = false;
            this.is_closed = false;
            document.body.classList.add("disabled");
            document.body.querySelector(".main").classList.add("disabled");
        } else {
            this.menu.classList.remove("open");
            this.is_closed = true;
            document.body.classList.remove("disabled");
            document.body.querySelector(".main").classList.remove("disabled");
        }
    }

    closeMenu() {
        this.menu_btn__burger.classList.remove("open");
        this.menu.classList.remove("open");
        this.is_dragging = true;
        this.is_closed = true;
        document.body.classList.remove("disabled");
        document.body.querySelector(".main").classList.remove("disabled");
        this.menu.style.transform = "translateX(100%)";
        this.menu.style.transform = null;
    }

    // mouse dragging
    mouse_drag_handling() {
        let obj = this;
        this.menu.addEventListener("mousedown", handleMouseDown);
        this.menu.addEventListener("mouseup", handleMouseUp);

        function handleMouseDown(e) {
            obj.initial_x = e.clientX;
            obj.is_dragging = true;
            document.addEventListener("mousemove", handleMouseMove);
        }

        function handleMouseUp() {
            obj.is_dragging = false;
            document.removeEventListener("mousemove", handleMouseMove);
            // side_menu.menu.style.transform = "translateX(0)";
        }

        function handleMouseMove(e) {
            if (!obj.is_dragging) {
                return;
            }

            let currentX = e.clientX;
            let diffX = currentX - obj.initial_x;
            if (diffX < 0) {
                return;
            }
            let speed = diffX * 1.5;  // Increase or decrease this value to control the speed
            obj.menu.style.transform = "translateX(" + speed + "px)";

            if (speed >= 250) {
                obj.closeMenu();
            } else {
                setTimeout(() => {
                    if (!obj.is_closed)
                        obj.menu.style.transform = "translateX(0)";
                }, 500);
                // obj.menu.style.transform = "translateX(0)";
            }
        }

    }

    // touch dragging
    touch_drag_handling() {
        let obj = this;
        this.menu.addEventListener("touchstart", handleTouchStart);
        this.menu.addEventListener("touchend", handleTouchEnd);

        function handleTouchStart(e) {
            obj.initial_x = e.touches[0].clientX;
            obj.is_dragging = true;
            document.addEventListener("touchmove", handleTouchMove);
        }

        function handleTouchEnd() {
            obj.is_dragging = false;
            document.removeEventListener("touchmove", handleTouchMove);
        }

        function handleTouchMove(e) {
            if (!obj.is_dragging) {
                return;
            }

            let currentX = e.touches[0].clientX;
            let diffX = currentX - obj.initial_x;
            if (diffX < 0) {
                return;
            }
            let speed = diffX * 1.2;  // Increase or decrease this value to control the speed
            obj.menu.style.transform = "translateX(" + speed + "px)";
            if (speed >= 250) {
                obj.closeMenu();
            } else {
                setTimeout(() => {
                    if (!obj.is_closed)
                        obj.menu.style.transform = "translateX(0)";
                }, 500);
            }
        }
    }
}
