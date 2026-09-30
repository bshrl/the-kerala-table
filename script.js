(() => {
    "use strict";

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.classList.toggle("open");

            mainNav.classList.toggle("open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("open");
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            });
        });
    }


    /* =====================================================
       FOOD SEARCH + FILTER
       ===================================================== */

    const cards = [...document.querySelectorAll(".food-card")];
    const searchInput = document.getElementById("dishSearch");
    const filterButtons = [...document.querySelectorAll(".filter-btn")];
    const dishCount = document.getElementById("dishCount");
    const resultsMessage = document.getElementById("resultsMessage");
    const emptyState = document.getElementById("emptyState");
    const resetSearch = document.getElementById("resetSearch");

    let currentFilter = "all";

    function updateCards() {
        if (!cards.length) return;

        const query = (searchInput?.value || "").trim().toLowerCase();
        let visible = 0;

        cards.forEach((card) => {
            const category = card.dataset.category || "";
            const name = card.dataset.name || "";

            const matchesFilter =
                currentFilter === "all" ||
                category === currentFilter;

            const matchesSearch =
                !query ||
                name.includes(query);

            const show = matchesFilter && matchesSearch;

            card.classList.toggle("is-hidden", !show);

            if (show) visible++;
        });

        if (dishCount) {
            dishCount.textContent =
                `${visible} ${visible === 1 ? "DISH" : "DISHES"}`;
        }

        if (resultsMessage) {
            if (query) {
                resultsMessage.textContent =
                    `Showing ${visible} ${visible === 1 ? "dish" : "dishes"} matching "${searchInput.value.trim()}"`;
            } else if (currentFilter === "all") {
                resultsMessage.textContent =
                    `Showing all ${visible} dishes`;
            } else {
                const readable =
                    currentFilter === "main"
                        ? "Main Course"
                        : currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);

                resultsMessage.textContent =
                    `Showing ${visible} ${visible === 1 ? "dish" : "dishes"} in ${readable}`;
            }
        }

        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.filter || "all";

            filterButtons.forEach((item) => {
                item.classList.toggle(
                    "active",
                    item === button
                );
            });

            updateCards();
        });
    });

    searchInput?.addEventListener("input", updateCards);

    resetSearch?.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        currentFilter = "all";

        filterButtons.forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.filter === "all"
            );
        });

        updateCards();
        searchInput?.focus();
    });


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backTop = document.getElementById("backTop");

    if (backTop) {
        const updateBackTop = () => {
            backTop.classList.toggle(
                "show",
                window.scrollY > 500
            );
        };

        window.addEventListener(
            "scroll",
            updateBackTop,
            { passive: true }
        );

        backTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        updateBackTop();
    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealItems = [
        ...document.querySelectorAll("main > section")
    ];

    revealItems.forEach((item) => {
        item.classList.add("reveal-on-scroll");
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "reveal-visible"
                        );
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealItems.forEach((item) => {
            observer.observe(item);
        });
    } else {
        revealItems.forEach((item) => {
            item.classList.add("reveal-visible");
        });
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateCards();

})();
