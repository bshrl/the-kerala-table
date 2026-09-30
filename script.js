
(() => {

    /* =====================================================
       THEME
       ===================================================== */

    const themeToggle = document.getElementById("themeToggle");

    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get("theme");

    let currentTheme = "light";

    if (urlTheme === "dark" || urlTheme === "light") {
        currentTheme = urlTheme;
    } else {
        try {
            const savedTheme = localStorage.getItem("keralaTheme");

            if (savedTheme === "dark" || savedTheme === "light") {
                currentTheme = savedTheme;
            }
        } catch (error) {
            currentTheme = "light";
        }
    }


    function applyTheme(theme) {

        currentTheme = theme;

        document.body.classList.toggle(
            "dark-mode",
            theme === "dark"
        );

        if (themeToggle) {

            themeToggle.textContent =
                theme === "dark" ? "☀️" : "🌙";

            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                theme === "dark"
                    ? "Light mode"
                    : "Dark mode"
            );
        }

        try {
            localStorage.setItem(
                "keralaTheme",
                theme
            );
        } catch (error) {
            /* URL fallback handles persistence */
        }
    }


    applyTheme(currentTheme);


    /* =====================================================
       THEME BUTTON
       ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const newTheme =
                document.body.classList.contains("dark-mode")
                    ? "light"
                    : "dark";

            applyTheme(newTheme);

        });

    }


    /* =====================================================
       KEEP THEME WHEN MOVING TO ANY PAGE
       ===================================================== */

    document.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            /* Ignore anchors, external links and javascript links */

            if (
                href.startsWith("#") ||
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("mailto:") ||
                href.startsWith("javascript:")
            ) {
                return;
            }


            /* Ignore download links */

            if (link.hasAttribute("download")) {
                return;
            }


            event.preventDefault();


            /*
             * Separate filename from #hash
             */

            const hashIndex = href.indexOf("#");

            let pagePart = href;
            let hashPart = "";

            if (hashIndex !== -1) {
                pagePart = href.substring(
                    0,
                    hashIndex
                );

                hashPart = href.substring(
                    hashIndex
                );
            }


            /*
             * Remove an old theme parameter
             */

            const questionIndex =
                pagePart.indexOf("?");

            if (questionIndex !== -1) {

                const base =
                    pagePart.substring(
                        0,
                        questionIndex
                    );

                const query =
                    pagePart.substring(
                        questionIndex + 1
                    );

                const newParams =
                    new URLSearchParams(query);

                newParams.set(
                    "theme",
                    currentTheme
                );

                pagePart =
                    `${base}?${newParams.toString()}`;

            } else {

                pagePart =
                    `${pagePart}?theme=${currentTheme}`;

            }


            window.location.href =
                `${pagePart}${hashPart}`;

        });

    }



    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    if (menuToggle && mainNav) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    menuToggle.classList.toggle(
                        "open"
                    );

                mainNav.classList.toggle(
                    "open",
                    isOpen
                );

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

            }
        );

    }



    /* =====================================================
       FOOD SEARCH + FILTER
       ===================================================== */

    const cards =
        [...document.querySelectorAll(".food-card")];

    const searchInput =
        document.getElementById("dishSearch");

    const filterButtons =
        [...document.querySelectorAll(".filter-btn")];

    const dishCount =
        document.getElementById("dishCount");

    const resultsMessage =
        document.getElementById("resultsMessage");

    const emptyState =
        document.getElementById("emptyState");

    const resetSearch =
        document.getElementById("resetSearch");

    let currentFilter = "all";


    function updateCards() {

        if (!cards.length) {
            return;
        }


        const query =
            (searchInput?.value || "")
                .trim()
                .toLowerCase();


        let visible = 0;


        cards.forEach(card => {

            const category =
                card.dataset.category || "";

            const name =
                card.dataset.name || "";


            const matchesFilter =
                currentFilter === "all" ||
                category === currentFilter;


            const matchesSearch =
                !query ||
                name.includes(query);


            const show =
                matchesFilter &&
                matchesSearch;


            card.classList.toggle(
                "is-hidden",
                !show
            );


            if (show) {
                visible++;
            }

        });


        if (dishCount) {

            dishCount.textContent =
                `${visible} ${
                    visible === 1
                        ? "DISH"
                        : "DISHES"
                }`;

        }


        if (resultsMessage) {

            if (query) {

                resultsMessage.textContent =
                    `Showing ${visible} ${
                        visible === 1
                            ? "dish"
                            : "dishes"
                    } matching "${searchInput.value.trim()}"`;

            } else if (
                currentFilter === "all"
            ) {

                resultsMessage.textContent =
                    `Showing all ${visible} dishes`;

            } else {

                const readable =
                    currentFilter === "main"
                        ? "Main Course"
                        : currentFilter;

                resultsMessage.textContent =
                    `Showing ${visible} ${
                        visible === 1
                            ? "dish"
                            : "dishes"
                    } in ${readable}`;

            }

        }


        if (emptyState) {

            emptyState.hidden =
                visible !== 0;

        }

    }


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter ||
                    "all";


                filterButtons.forEach(item => {

                    item.classList.toggle(
                        "active",
                        item === button
                    );

                });


                updateCards();

            }
        );

    });


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            updateCards
        );

    }


    if (resetSearch) {

        resetSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {
                    searchInput.value = "";
                }


                currentFilter = "all";


                filterButtons.forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.filter === "all"
                    );

                });


                updateCards();


                searchInput?.focus();

            }
        );

    }



    /* =====================================================
       PREMIUM DISH MODAL
       ===================================================== */

    const modal =
        document.getElementById("dishModal");


    if (modal) {

        const modalTitle =
            document.getElementById("modalTitle");

        const modalDescription =
            document.getElementById("modalDescription");

        const modalTag =
            document.getElementById("modalTag");

        const modalImage =
            document.getElementById("modalImage");

        const modalTime =
            document.getElementById("modalTime");

        const modalServe =
            document.getElementById("modalServe");

        const modalIngredients =
            document.getElementById("modalIngredients");

        const favoriteButton =
            document.getElementById("favoriteDish");

        const closeButton =
            modal.querySelector(".modal-close");

        const dishLinks =
            document.querySelectorAll(".dish-link");


        let currentDishKey = null;

        let lastTrigger = null;


        const dishData = {

            sadya: {
                tag: "TRADITIONAL FEAST",
                title: "Kerala Sadya",
                description:
                    "A grand vegetarian feast served traditionally on a banana leaf, bringing together rice, curries, vegetables, pickles and comforting side dishes.",
                image: "Kerala-Sadya.jpg",
                time: "Traditional feast",
                serve: "Banana leaf",
                ingredients: [
                    "Rice",
                    "Avial",
                    "Sambar",
                    "Thoran",
                    "Pickles",
                    "Payasam"
                ]
            },

            appam: {
                tag: "BREAKFAST",
                title: "Appam",
                description:
                    "Soft and fluffy rice pancakes with beautifully crisp edges, commonly enjoyed with rich Kerala curries and coconut-based gravies.",
                image: "Appam.jpg",
                time: "Breakfast",
                serve: "With curry",
                ingredients: [
                    "Rice",
                    "Coconut milk",
                    "Yeast",
                    "Sugar",
                    "Salt"
                ]
            },

            "fish-curry": {
                tag: "SEAFOOD",
                title: "Kerala Fish Curry",
                description:
                    "A bold and spicy fish curry prepared with traditional Kerala spices and tangy flavours for a deeply aromatic meal.",
                image: "fish curry.jpeg",
                time: "Main course",
                serve: "With rice",
                ingredients: [
                    "Fish",
                    "Coconut",
                    "Chilli",
                    "Turmeric",
                    "Curry leaves",
                    "Tamarind"
                ]
            },

            payasam: {
                tag: "DESSERT",
                title: "Payasam",
                description:
                    "A traditional sweet dessert made with ingredients such as rice, milk, jaggery and coconut.",
                image: "payasam.jpg",
                time: "Dessert",
                serve: "Warm or chilled",
                ingredients: [
                    "Rice",
                    "Milk",
                    "Jaggery",
                    "Coconut",
                    "Cardamom"
                ]
            },

            puttu: {
                tag: "BREAKFAST",
                title: "Puttu & Kadala Curry",
                description:
                    "Steamed rice cakes served with a deliciously spiced black chickpea curry, making a classic Kerala breakfast.",
                image: "Puttu.jpg",
                time: "Breakfast",
                serve: "With kadala curry",
                ingredients: [
                    "Rice flour",
                    "Coconut",
                    "Black chickpeas",
                    "Onion",
                    "Spices"
                ]
            },

            biriyani: {
                tag: "MAIN COURSE",
                title: "Kerala Biriyani",
                description:
                    "Fragrant rice layered with aromatic spices and a richly flavoured meat preparation.",
                image: "biriyani.jpeg",
                time: "Main course",
                serve: "Hot",
                ingredients: [
                    "Rice",
                    "Meat",
                    "Onion",
                    "Ginger",
                    "Garlic",
                    "Spices"
                ]
            },

            "banana-chips": {
                tag: "SNACK",
                title: "Banana Chips",
                description:
                    "Thin slices of Kerala banana fried until golden and crisp, making a popular snack and tea-time favourite.",
                image: "banana chips.jpg",
                time: "Snack",
                serve: "Tea-time",
                ingredients: [
                    "Raw banana",
                    "Coconut oil",
                    "Salt"
                ]
            },

            "chicken-curry": {
                tag: "CURRY",
                title: "Kerala Chicken Curry",
                description:
                    "Tender chicken cooked with coconut, spices and traditional Kerala flavours for a rich and comforting curry.",
                image: "chicken curry.jpeg",
                time: "Main course",
                serve: "With rice or parotta",
                ingredients: [
                    "Chicken",
                    "Coconut",
                    "Onion",
                    "Ginger",
                    "Garlic",
                    "Spices"
                ]
            },

            "beef-fry": {
                tag: "SPECIAL",
                title: "Kerala Beef Fry",
                description:
                    "Tender beef cooked with aromatic spices, curry leaves and traditional seasonings until richly flavoured.",
                image: "beef fry.jpeg",
                time: "Main course",
                serve: "With parotta",
                ingredients: [
                    "Beef",
                    "Onion",
                    "Coconut",
                    "Pepper",
                    "Curry leaves",
                    "Spices"
                ]
            },

            parotta: {
                tag: "FAVOURITE",
                title: "Kerala Parotta",
                description:
                    "Soft, layered and flaky flatbread that pairs beautifully with rich Kerala curries and gravies.",
                image: "parotta.jpeg",
                time: "Main course",
                serve: "With curry",
                ingredients: [
                    "Flour",
                    "Water",
                    "Oil",
                    "Salt"
                ]
            },

            dosa: {
                tag: "BREAKFAST",
                title: "Dosa",
                description:
                    "A thin and crispy fermented rice pancake commonly enjoyed with curry, chutney or other accompaniments.",
                image: "dosa.jpg",
                time: "Breakfast",
                serve: "With chutney or curry",
                ingredients: [
                    "Rice",
                    "Urad dal",
                    "Salt",
                    "Water"
                ]
            },

            pathiri: {
                tag: "TRADITIONAL",
                title: "Pathiri",
                description:
                    "A soft rice flatbread that pairs beautifully with spicy Kerala meat and vegetable curries.",
                image: "pathiri.jpeg",
                time: "Main course",
                serve: "With curry",
                ingredients: [
                    "Rice flour",
                    "Water",
                    "Salt"
                ]
            }

        };


        /* =================================================
           FAVOURITES
           ================================================= */

        let favorites = [];

        try {

            favorites =
                JSON.parse(
                    localStorage.getItem(
                        "keralaFavorites"
                    )
                ) || [];

        } catch (error) {

            favorites = [];

        }


        function saveFavorites() {

            try {

                localStorage.setItem(
                    "keralaFavorites",
                    JSON.stringify(
                        favorites
                    )
                );

            } catch (error) {
                /* Continue without storage */
            }

        }


        function isFavorite(key) {

            return favorites.includes(key);

        }


        function updateFavoriteButton() {

            if (!favoriteButton) {
                return;
            }


            const active =
                currentDishKey &&
                isFavorite(currentDishKey);


            favoriteButton.classList.toggle(
                "active",
                active
            );


            favoriteButton.setAttribute(
                "aria-pressed",
                String(active)
            );


            favoriteButton.innerHTML =
                active
                    ? "♥ Saved to Favourites"
                    : "♡ Add to Favourites";

        }


        function openDish(
            key,
            trigger = null
        ) {

            const dish =
                dishData[key];


            if (!dish) {
                return;
            }


            currentDishKey =
                key;


            lastTrigger =
                trigger;


            if (modalTitle) {
                modalTitle.textContent =
                    dish.title;
            }


            if (modalDescription) {
                modalDescription.textContent =
                    dish.description;
            }


            if (modalTag) {
                modalTag.textContent =
                    dish.tag;
            }


            if (modalImage) {

                modalImage.src =
                    dish.image;

                modalImage.alt =
                    dish.title;

            }


            if (modalTime) {
                modalTime.textContent =
                    dish.time;
            }


            if (modalServe) {
                modalServe.textContent =
                    dish.serve;
            }


            if (modalIngredients) {

                modalIngredients.innerHTML =
                    "";

                dish.ingredients.forEach(
                    ingredient => {

                        const chip =
                            document.createElement(
                                "span"
                            );

                        chip.className =
                            "ingredient-chip";

                        chip.textContent =
                            ingredient;

                        modalIngredients.appendChild(
                            chip
                        );

                    }
                );

            }


            updateFavoriteButton();


            modal.hidden = false;

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );


            closeButton?.focus();

        }


        function closeDish() {

            modal.hidden =
                true;

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "modal-open"
            );

            lastTrigger?.focus();

        }


        dishLinks.forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const card =
                        link.closest(
                            ".food-card"
                        );

                    const key =
                        card?.dataset.dish;

                    if (key) {

                        openDish(
                            key,
                            link
                        );

                    }

                }
            );

        });


        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                () => {

                    if (!currentDishKey) {
                        return;
                    }


                    if (
                        isFavorite(
                            currentDishKey
                        )
                    ) {

                        favorites =
                            favorites.filter(
                                item =>
                                    item !==
                                    currentDishKey
                            );

                    } else {

                        favorites.push(
                            currentDishKey
                        );

                    }


                    saveFavorites();
                    updateFavoriteButton();

                }
            );

        }


        closeButton?.addEventListener(
            "click",
            closeDish
        );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeDish();

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    !modal.hidden
                ) {

                    closeDish();

                }

            }
        );


        const hash =
            window.location.hash.replace(
                "#",
                ""
            );


        if (
            hash &&
            dishData[hash]
        ) {

            const target =
                document.getElementById(
                    hash
                );


            setTimeout(
                () => {

                    openDish(
                        hash,
                        target?.querySelector(
                            ".dish-link"
                        )
                    );

                },
                200
            );

        }

    }



    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backTop =
        document.getElementById("backTop");


    if (backTop) {

        const updateBackTop =
            () => {

                backTop.classList.toggle(
                    "show",
                    window.scrollY > 500
                );

            };


        window.addEventListener(
            "scroll",
            updateBackTop,
            {
                passive: true
            }
        );


        backTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        updateBackTop();

    }



    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealItems =
        [
            ...document.querySelectorAll(
                "main > section"
            )
        ];


    revealItems.forEach(item => {

        item.classList.add(
            "reveal-on-scroll"
        );

    });


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "reveal-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealItems.forEach(item => {

            observer.observe(item);

        });

    } else {

        revealItems.forEach(item => {

            item.classList.add(
                "reveal-visible"
            );

        });

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateCards();

})();
