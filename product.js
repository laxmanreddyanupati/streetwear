
const mainImage = document.getElementById("main-product-image");
const thumbnails = document.querySelectorAll(".thumbnail");

const colorOptions = document.querySelectorAll(".color-option");
const selectedColorLabel = document.getElementById("selected-color-label");

const sizeOptions = document.querySelectorAll(".size-option");
const selectionMessage = document.getElementById("selection-message");

const quantityDisplay = document.getElementById("product-quantity");
const minusButton = document.getElementById("quantity-minus");
const plusButton = document.getElementById("quantity-plus");

const addButton = document.getElementById("detail-add-button");
const cartMessage = document.getElementById("detail-cart-message");
const displayedPrice = document.getElementById("display-price");

const product = {
    id: "tee",
    name: "Essential Boxy Tee",
    price: 999
};

let selectedColor = "White";
let selectedSize = "M";
let quantity = 1;

function updateSelectionMessage() {
    selectionMessage.textContent =
        `Selected: ${selectedColor} / ${selectedSize}`;
}

function updateQuantityDisplay() {
    quantityDisplay.textContent = quantity;

    addButton.textContent =
        `ADD TO BAG · ${formatPrice(product.price * quantity)}`;
}

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}

// Switch the large image when a thumbnail is clicked.
thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
        mainImage.src = thumbnail.dataset.image;

        thumbnails.forEach((item) => {
            item.classList.remove("active");
        });

        thumbnail.classList.add("active");
    });
});

// Select a color.
colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
        selectedColor = option.dataset.color;

        colorOptions.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });

        option.classList.add("active");
        option.setAttribute("aria-pressed", "true");

        updateSelectionMessage();
        cartMessage.textContent = "";
    });
});

// Select a size.
sizeOptions.forEach((option) => {
    option.addEventListener("click", () => {
        selectedSize = option.dataset.size;

        sizeOptions.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });

        option.classList.add("active");
        option.setAttribute("aria-pressed", "true");

        updateSelectionMessage();
        cartMessage.textContent = "";
    });
});

// Increase quantity up to 10.
plusButton.addEventListener("click", () => {
    if (quantity >= 10) {
        cartMessage.textContent = "Maximum quantity per selection is 10.";
        return;
    }

    quantity += 1;
    cartMessage.textContent = "";
    updateQuantityDisplay();
});

// Decrease quantity without going below 1.
minusButton.addEventListener("click", () => {
    if (quantity <= 1) return;

    quantity -= 1;
    cartMessage.textContent = "";
    updateQuantityDisplay();
});

// Add the chosen variant to the shared shopping cart.
addButton.addEventListener("click", () => {
    const variantId =
        `${product.id}-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`;

    const variantName =
        `${product.name} (${selectedColor}, ${selectedSize})`;

    // Reuse the cart panel and storage functionality in script.js.
    const existingProduct = cart.get(variantId);

    if (existingProduct) {
        if (existingProduct.quantity + quantity > 100) {
            cartMessage.textContent = "Maximum cart quantity reached.";
            return;
        }

        existingProduct.quantity += quantity;
    } else {
        cart.set(variantId, {
            id: variantId,
            name: variantName,
            price: product.price,
            quantity
        });
    }

    saveCart();
    renderCart();
    openCart();

    cartMessage.textContent =
        `${quantity} × ${variantName} added to your bag.`;
});

// Initialize the displayed price and selection.
displayedPrice.textContent = formatPrice(product.price);
updateSelectionMessage();
updateQuantityDisplay();
