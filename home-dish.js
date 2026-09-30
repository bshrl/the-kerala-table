(() => {
    "use strict";

    document.querySelectorAll(".home-dish-link").forEach((link) => {
        link.addEventListener("click", () => {
            const dish = link.dataset.dish;

            if (dish) {
                try {
                    sessionStorage.setItem("keralaSelectedDish", dish);
                } catch (error) {
                    // Normal navigation still works if storage is unavailable.
                }
            }
        });
    });
})();
