(() => {
    "use strict";

    const modal = document.getElementById("dishModal");
    const grid = document.getElementById("foodGrid");

    if (!modal || !grid) return;

    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalTag = document.getElementById("modalTag");
    const modalTime = document.getElementById("modalTime");
    const modalServe = document.getElementById("modalServe");
    const modalIngredients = document.getElementById("modalIngredients");
    const favoriteButton = document.getElementById("favoriteDish");
    const closeButton = modal.querySelector(".modal-close");

    const dishes = {
        sadya: {
            tag: "TRADITIONAL FEAST",
            title: "Kerala Sadya",
            description: "A grand vegetarian feast served traditionally on a banana leaf, bringing together rice, curries, vegetables, pickles and comforting side dishes.",
            image: "Kerala-Sadya.jpg",
            time: "Traditional feast",
            serve: "Banana leaf",
            ingredients: ["Rice", "Avial", "Sambar", "Thoran", "Pickles", "Payasam"]
        },
        appam: {
            tag: "BREAKFAST",
            title: "Appam",
            description: "Soft and fluffy rice pancakes with beautifully crisp edges, commonly enjoyed with rich Kerala curries and coconut-based gravies.",
            image: "Appam.jpg",
            time: "Breakfast",
            serve: "With curry",
            ingredients: ["Rice", "Coconut milk", "Yeast", "Sugar", "Salt"]
        },
        "fish-curry": {
            tag: "SEAFOOD",
            title: "Kerala Fish Curry",
            description: "A bold and spicy fish curry prepared with traditional Kerala spices and tangy flavours for a deeply aromatic meal.",
            image: "fish curry.jpeg",
            time: "Main course",
            serve: "With rice",
            ingredients: ["Fish", "Coconut", "Chilli", "Turmeric", "Curry leaves", "Tamarind"]
        },
        payasam: {
            tag: "DESSERT",
            title: "Payasam",
            description: "A traditional sweet dessert made with ingredients such as rice, milk, jaggery and coconut.",
            image: "payasam.jpg",
            time: "Dessert",
            serve: "Warm or chilled",
            ingredients: ["Rice", "Milk", "Jaggery", "Coconut", "Cardamom"]
        },
        puttu: {
            tag: "BREAKFAST",
            title: "Puttu & Kadala Curry",
            description: "Steamed rice cakes served with a deliciously spiced black chickpea curry, making a classic Kerala breakfast.",
            image: "Puttu.jpg",
            time: "Breakfast",
            serve: "With kadala curry",
            ingredients: ["Rice flour", "Coconut", "Black chickpeas", "Onion", "Spices"]
        },
        biriyani: {
            tag: "MAIN COURSE",
            title: "Kerala Biriyani",
            description: "Fragrant rice layered with aromatic spices and a richly flavoured meat preparation.",
            image: "biriyani.jpeg",
            time: "Main course",
            serve: "Hot",
            ingredients: ["Rice", "Meat", "Onion", "Ginger", "Garlic", "Spices"]
        },
        "banana-chips": {
            tag: "SNACK",
            title: "Banana Chips",
            description: "Thin slices of Kerala banana fried until golden and crisp, making a popular snack and tea-time favourite.",
            image: "banana chips.jpg",
            time: "Snack",
            serve: "Tea-time",
            ingredients: ["Raw banana", "Coconut oil", "Salt"]
        },
        "chicken-curry": {
            tag: "CURRY",
            title: "Kerala Chicken Curry",
            description: "Tender chicken cooked with coconut, spices and traditional Kerala flavours for a rich and comforting curry.",
            image: "chicken curry.jpeg",
            time: "Main course",
            serve: "With rice or parotta",
            ingredients: ["Chicken", "Coconut", "Onion", "Ginger", "Garlic", "Spices"]
        },
        "beef-fry": {
            tag: "SPECIAL",
            title: "Kerala Beef Fry",
            description: "Tender beef cooked with aromatic spices, curry leaves and traditional seasonings until richly flavoured.",
            image: "beef fry.jpeg",
            time: "Main course",
            serve: "With parotta",
            ingredients: ["Beef", "Onion", "Coconut", "Pepper", "Curry leaves", "Spices"]
        },
        parotta: {
            tag: "FAVOURITE",
            title: "Kerala Parotta",
            description: "Soft, layered and flaky flatbread that pairs beautifully with rich Kerala curries and gravies.",
            image: "parotta.jpeg",
            time: "Main course",
            serve: "With curry",
            ingredients: ["Flour", "Water", "Oil", "Salt"]
        },
        dosa: {
            tag: "BREAKFAST",
            title: "Dosa",
            description: "A thin and crispy fermented rice pancake commonly enjoyed with curry, chutney or other accompaniments.",
            image: "dosa.jpg",
            time: "Breakfast",
            serve: "With chutney or curry",
            ingredients: ["Rice", "Urad dal", "Salt", "Water"]
        },
        pathiri: {
            tag: "TRADITIONAL",
            title: "Pathiri",
            description: "A soft rice flatbread that pairs beautifully with spicy Kerala meat and vegetable curries.",
            image: "pathiri.jpeg",
            time: "Main course",
            serve: "With curry",
            ingredients: ["Rice flour", "Water", "Salt"]
        }
    };

    let currentKey = null;
    let lastTrigger = null;

    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem("keralaFavorites") || "[]");
        } catch {
            return [];
        }
    }

    function saveFavorites(list) {
        try {
            localStorage.setItem("keralaFavorites", JSON.stringify(list));
        } catch {}
    }

    function updateFavorite() {
        if (!favoriteButton || !currentKey) return;
        const active = getFavorites().includes(currentKey);
        favoriteButton.classList.toggle("active", active);
        favoriteButton.setAttribute("aria-pressed", String(active));
        favoriteButton.textContent = active ? "♥ Saved to Favourites" : "♡ Add to Favourites";
    }

    function openDish(key, trigger) {
        const dish = dishes[key];
        if (!dish) return;

        currentKey = key;
        lastTrigger = trigger || null;

        modalImage.src = dish.image;
        modalImage.alt = dish.title;
        modalTitle.textContent = dish.title;
        modalDescription.textContent = dish.description;
        modalTag.textContent = dish.tag;
        modalTime.textContent = dish.time;
        modalServe.textContent = dish.serve;

        modalIngredients.innerHTML = "";
        dish.ingredients.forEach(item => {
            const chip = document.createElement("span");
            chip.className = "ingredient-chip";
            chip.textContent = item;
            modalIngredients.appendChild(chip);
        });

        updateFavorite();

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        closeButton?.focus();
    }

    function closeDish() {
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        lastTrigger?.focus();
    }

    grid.addEventListener("click", (event) => {
        const button = event.target.closest(".dish-link");
        if (!button || !grid.contains(button)) return;

        event.preventDefault();

        const card = button.closest(".food-card");
        const key = card?.dataset.dish;

        if (key) openDish(key, button);
    });

    closeButton?.addEventListener("click", closeDish);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeDish();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) closeDish();
    });

    favoriteButton?.addEventListener("click", () => {
        if (!currentKey) return;

        const favorites = getFavorites();
        const index = favorites.indexOf(currentKey);

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(currentKey);
        }

        saveFavorites(favorites);
        updateFavorite();
    });

    // Home-page "Discover dish" links intentionally open the Food page
    // without jumping or opening a dish automatically.
})();