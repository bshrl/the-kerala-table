/* =====================================================
   TASTE OF KERALA - DARK MODE
   ===================================================== */

(function () {

    const toggle = document.getElementById("themeToggle");

    /* Get theme from URL first */
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get("theme");

    let theme = urlTheme === "dark" ? "dark" : "light";


    /* If URL has no theme, check saved theme */
    if (!urlTheme) {

        try {

            const saved =
                localStorage.getItem("keralaTheme");

            if (saved === "dark") {
                theme = "dark";
            }

        } catch (error) {
            theme = "light";
        }

    }


    /* Apply theme */
    function applyTheme(value) {

        theme = value;

        document.body.classList.toggle(
            "dark-mode",
            value === "dark"
        );


        if (toggle) {

            toggle.textContent =
                value === "dark"
                    ? "☀️"
                    : "🌙";

            toggle.setAttribute(
                "aria-label",
                value === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

        }


        try {

            localStorage.setItem(
                "keralaTheme",
                value
            );

        } catch (error) {
            /* Ignore storage errors */
        }

    }


    /* Apply saved theme immediately */
    applyTheme(theme);


    /* Theme button */
    if (toggle) {

        toggle.addEventListener(
            "click",
            function () {

                const newTheme =
                    document.body.classList.contains(
                        "dark-mode"
                    )
                        ? "light"
                        : "dark";


                applyTheme(newTheme);

            }
        );

    }


    /* Keep theme when navigating */
    document
        .querySelectorAll(".navbar a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const href =
                        link.getAttribute("href");

                    if (!href) {
                        return;
                    }

                    if (
                        href.startsWith("#") ||
                        href.startsWith("http") ||
                        href.startsWith("mailto:")
                    ) {
                        return;
                    }


                    event.preventDefault();


                    let separator =
                        href.includes("?")
                            ? "&"
                            : "?";


                    window.location.href =
                        href +
                        separator +
                        "theme=" +
                        theme;

                }
            );

        });

})();
