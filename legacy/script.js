
const STORAGE_KEY = "streetwear-shopping-cart";

const cart = new Map();

const cartToggle = document.getElementById("cart-toggle");
const closeCartButton = document.getElementById("close-cart");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const panelCount = document.getElementById("panel-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const checkoutMessage = document.getElementById("checkout-message");

const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

// Load saved cart data safely when the page starts.
function loadCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);

        if (!savedCart) return;

        const products = JSON.parse(savedCart);

        if (!Array.isArray(products)) return;

        products.forEach((product) => {
            if (
                typeof product.id === "string" &&
                typeof product.name === "string" &&
                Number.isSafeInteger(product.price) &&
                product.price > 0 &&
                Number.isSafeInteger(product.quantity) &&
                product.quantity > 0 &&
                product.quantity <= 100
            ) {
                cart.set(product.id, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity
                });
            }
        });
    } catch (error) {
        console.error("Could not load the saved cart:", error);
    }
}

// Save current cart data in the browser.
function saveCart() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...cart.values()])
        );
    } catch (error) {
        console.error("Could not save the cart:", error);
        checkoutMessage.textContent =
            "Your browser could not save the cart.";
    }
}

function openCart() {
    cartPanel.classList.add("is-open");
    cartOverlay.classList.add("is-open");

    cartPanel.removeAttribute("inert");
    cartPanel.setAttribute("aria-hidden", "false");
    cartOverlay.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");

    document.body.classList.add("cart-open");
    closeCartButton.focus();
}

function closeCart() {
    cartPanel.classList.remove("is-open");
    cartOverlay.classList.remove("is-open");

    cartPanel.setAttribute("inert", "");
    cartPanel.setAttribute("aria-hidden", "true");
    cartOverlay.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");

    document.body.classList.remove("cart-open");
    cartToggle.focus();
}

function addToCart(product) {
    const existingProduct = cart.get(product.id);

    if (existingProduct) {
        if (existingProduct.quantity >= 100) {
            checkoutMessage.textContent =
                "Maximum quantity reached for this product.";
            return;
        }

        existingProduct.quantity += 1;
    } else {
        cart.set(product.id, {
            ...product,
            quantity: 1
        });
    }

    checkoutMessage.textContent = "";

    saveCart();
    renderCart();
    openCart();
}

function changeQuantity(productId, change) {
    const product = cart.get(productId);

    if (!product) return;

    const newQuantity = product.quantity + change;

    if (newQuantity > 100) {
        checkoutMessage.textContent =
            "Maximum quantity is 100 per product.";
        return;
    }

    if (newQuantity <= 0) {
        cart.delete(productId);
    } else {
        product.quantity = newQuantity;
    }

    checkoutMessage.textContent = "";

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    cart.delete(productId);

    checkoutMessage.textContent = "";

    saveCart();
    renderCart();
}

function renderCart() {
    const products = [...cart.values()];

    const totalQuantity = products.reduce(
        (total, product) => total + product.quantity,
        0
    );

    const subtotal = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    panelCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(subtotal);

    cartItemsContainer.replaceChildren();

    if (products.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Your bag is empty.";

        cartItemsContainer.appendChild(emptyMessage);
        return;
    }

    products.forEach((product) => {
        const item = document.createElement("article");
        item.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const unitPrice = document.createElement("p");
        unitPrice.textContent = `${formatPrice(product.price)} each`;

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const decreaseButton = document.createElement("button");
        decreaseButton.className = "quantity-button";
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute(
            "aria-label",
            `Decrease quantity of ${product.name}`
        );

        decreaseButton.addEventListener("click", () => {
            changeQuantity(product.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = product.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.className = "quantity-button";
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute(
            "aria-label",
            `Increase quantity of ${product.name}`
        );

        increaseButton.addEventListener("click", () => {
            changeQuantity(product.id, 1);
        });

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removeFromCart(product.id);
        });

        actions.append(
            decreaseButton,
            quantity,
            increaseButton,
            removeButton
        );

        details.append(name, unitPrice, actions);

        const itemPrice = document.createElement("strong");
        itemPrice.className = "cart-item-price";
        itemPrice.textContent = formatPrice(
            product.price * product.quantity
        );

        item.append(details, itemPrice);
        cartItemsContainer.appendChild(item);
    });
}

// Connect all Add to Bag buttons.
document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: Number(button.dataset.price)
        };

        if (
            !product.id ||
            !product.name ||
            !Number.isSafeInteger(product.price) ||
            product.price <= 0
        ) {
            return;
        }

        addToCart(product);
    });
});

// Open and close the cart panel.
cartToggle.addEventListener("click", () => {
    if (cartPanel.classList.contains("is-open")) {
        closeCart();
    } else {
        openCart();
    }
});

closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        cartPanel.classList.contains("is-open")
    ) {
        closeCart();
    }
});

// Demo checkout only. No payment is processed.
checkoutButton.addEventListener("click", () => {
    if (cart.size === 0) {
        checkoutMessage.textContent =
            "Add a product to your bag first.";
        return;
    }

    checkoutMessage.textContent =
        "Your cart is ready. Payment checkout will be connected later.";
});

// Restore the saved cart and update the display.
loadCart();
renderCart();
