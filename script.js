// =======================================
// CALIPACKZ2U - MAIN SCRIPT
// =======================================

let products = [];
let cart = [];


// =======================================
// LOAD PRODUCTS FROM JSON
// =======================================

async function loadProducts() {
    
    try {
        
        const response =
            await fetch("products.json");
        
        
        if (!response.ok) {
            
            throw new Error(
                "Could not load products.json"
            );
            
        }
        
        
        products =
            await response.json();
        
        
        // Make sure JSON is an array
        
        if (!Array.isArray(products)) {
            
            throw new Error(
                "products.json must contain an array"
            );
            
        }
        
        
        loadSavedLikes();
        
        displayProducts();
        
        
    } catch (error) {
        
        console.error(
            "Failed to load products:",
            error
        );
        
    }
}
// =======================================
// PRODUCT CATEGORY FILTER
// =======================================

function filterProducts(category, button) {
    
    // Update active button
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    if (button) {
        button.classList.add("active");
    }
    
    
    // Show all products
    if (category === "all") {
        
        displayProducts(products);
        
        return;
    }
    
    
    // Filter products by JSON category
    const filteredProducts = products.filter(product => {
        
        const productCategory =
            String(product.category || "")
            .toLowerCase()
            .trim();
        
        return productCategory === category;
    });
    
    
    // Display filtered products
    displayProducts(filteredProducts);
}
// =======================================
// PROMO CAROUSEL
// =======================================

let currentPromoSlide = 0;

function showPromoSlide(index) {
    
    const slides =
        document.querySelectorAll(".promo-slide");
    
    const dots =
        document.querySelectorAll(".promo-dot");
    
    if (!slides.length) return;
    
    
    // Loop around
    if (index >= slides.length) {
        currentPromoSlide = 0;
        
    } else if (index < 0) {
        currentPromoSlide = slides.length - 1;
        
    } else {
        currentPromoSlide = index;
    }
    
    
    slides.forEach(slide => {
        slide.classList.remove("active");
    });
    
    dots.forEach(dot => {
        dot.classList.remove("active");
    });
    
    
    slides[currentPromoSlide]
        .classList.add("active");
    
    if (dots[currentPromoSlide]) {
        dots[currentPromoSlide]
            .classList.add("active");
    }
}


function changePromoSlide(direction) {
    
    showPromoSlide(
        currentPromoSlide + direction
    );
}


// Automatically change slide every 5 seconds

setInterval(function() {
    
    changePromoSlide(1);
    
}, 5000);


// =======================================
// SCROLL TO PRODUCTS
// =======================================

function scrollToProducts() {
    
    const products =
        document.getElementById("products");
    
    if (!products) return;
    
    products.scrollIntoView({
        behavior: "smooth"
    });
}
// =======================================
// DISPLAY PRODUCTS
// =======================================

function displayProducts(productList = products) {

    const container =
        document.getElementById("products");

    if (!container) {

        console.error(
            "Products container not found."
        );

        return;
    }

    container.innerHTML = "";


    if (!productList || productList.length === 0) {

        container.innerHTML = `
            <p class="no-products">
                No products found.
            </p>
        `;

        return;
    }


    productList.forEach(product => {

        // ===================================
        // PRODUCT BADGE
        // ===================================

        let badgeHTML = "";

        if (product.badge) {

            const badgeClass =
                product.badge
                    .toLowerCase()
                    .replace(/\s+/g, "-");

            badgeHTML = `
                <div class="badge ${badgeClass}">
                    ${product.badge}
                </div>
            `;
        }


        // ===================================
        // STOCK STATUS
        // ===================================

        const stock =
            Number(product.stock) || 0;

        let stockStatus = "";
        let stockClass = "";


        if (stock === 0) {

            stockStatus = "Out of Stock";
            stockClass = "out-stock";

        } else if (stock <= 25) {

            stockStatus = "Running Low";
            stockClass = "running-low";

        } else if (stock <= 50) {

            stockStatus = "Limited Stock";
            stockClass = "limited-stock";

        } else if (stock <= 100) {
    
            stockStatus = "In Stock";
           stockClass = "in-stock";
        } else {

            stockStatus = "In Stock";
            stockClass = "in-stock";
        }


        // ===================================
        // PRODUCT CARD
        // ===================================

   

       container.innerHTML += `

    <div class="product-card">

        ${badgeHTML}

        <!-- PRODUCT IMAGE -->

        <div class="product-image-wrapper">

            <img
    src="${product.image || ""}"
    alt="${product.name || "Product"}"
    class="product-image"
    onclick="openImagePopup(
        '${product.image || ""}',
        '${product.name || "Product"}'
    )"
>

        </div>


        <!-- PRODUCT INFO -->

        <div class="product-info">


            <!-- NAME + RATING -->

            <div class="product-title-row">

                <h3>
                    ${product.name || "Unnamed Product"}
                </h3>

                <span class="rating">
                    ⭐ ${product.rating || 0}
                </span>

            </div>


            <!-- CATEGORY + STATUS -->

            <div class="product-meta">

                <span class="category">
                   <!-- ${product.category || "Uncategorised"} -->
                </span>
                <span class="stock-status ${stockClass}">
                    ${stockStatus}
                </span>

            </div>


            <!-- PRICE + STOCK + LIKES -->

            <div class="product-stats">

                <div class="stat">

                    <span class="stat-label">
                        Price
                    </span>

                    <strong class="price">
                        £${Number(product.price || 0).toFixed(2)}
                    </strong>

                </div>


                <div class="stat">

                    <span class="stat-label">
                        Stock
                    </span>

                    <strong>
                        ${stock}
                    </strong>

                </div>


                <div class="stat">

                    <span class="stat-label">
                        Likes
                    </span>

                    <strong>
                        ❤️
                        <span id="likes-${product.id}">
                            ${product.likes || 0}
                        </span>
                    </strong>

                </div>

            </div>


            <!-- LIKE BUTTON -->

            <button
                class="like-button"
                onclick="likeProduct(${product.id})">

                ❤️ Like

            </button>


            <!-- QUANTITY + CART -->

            <div class="buy-section">

                <div class="quantity-box">

                    <input
                        type="number"
                        id="qty-${product.id}"
                        min="1"
                        max="${stock}"
                        value="1"
                        ${stock === 0 ? "disabled" : ""}
                    >

                </div>


                <button
                    class="add-cart-button"
                    onclick="addToCart(${product.id})"
                    ${stock === 0 ? "disabled" : ""}>

                    ${stock === 0
                        ? "Out of Stock"
                        : "Add To Cart"}

                </button>

            </div>

        </div>

    </div>

`;
    });
}


// =======================================
// LIKE PRODUCT
// =======================================

// =======================================
// LIKE PRODUCT
// =======================================

function likeProduct(id) {
    
    const product =
        products.find(item => item.id === id);
    
    if (!product) return;
    
    
    // Increase likes
    
    product.likes =
        Number(product.likes || 0) + 1;
    
    
    // Save likes
    
    const savedLikes =
        JSON.parse(
            localStorage.getItem(
                "calipackz2u-likes"
            )
        ) || {};
    
    
    savedLikes[id] = product.likes;
    
    
    localStorage.setItem(
        "calipackz2u-likes",
        JSON.stringify(savedLikes)
    );
    
    
    // Update screen
    
    const likesElement =
        document.getElementById(
            `likes-${id}`
        );
    
    if (likesElement) {
        
        likesElement.textContent =
            product.likes;
    }
}
// =======================================
// LOAD SAVED LIKES
// =======================================

function loadSavedLikes() {
    
    const savedLikes =
        JSON.parse(
            localStorage.getItem(
                "calipackz2u-likes"
            )
        ) || {};
    
    
    products.forEach(product => {
        
        if (
            savedLikes[product.id] !== undefined
        ) {
            
            product.likes =
                savedLikes[product.id];
            
        }
        
    });
}
// =======================================
// ADD TO CART
// =======================================

function addToCart(id) {

    const product =
        products.find(item => item.id === id);


    if (!product) {

        console.error(
            "Product not found:",
            id
        );

        return;
    }


    const stock =
        Number(product.stock) || 0;


    if (stock <= 0) {

        alert("This product is out of stock.");

        return;
    }


    const qtyInput =
        document.getElementById(`qty-${id}`);


    if (!qtyInput) {

        console.error(
            "Quantity input not found:",
            `qty-${id}`
        );

        return;
    }


    let quantity =
        parseInt(qtyInput.value, 10);


    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }


    quantity =
        Math.min(quantity, stock);


    const existingItem =
        cart.find(item => item.id === id);


    if (existingItem) {

        existingItem.quantity += quantity;

        existingItem.quantity =
            Math.min(
                existingItem.quantity,
                existingItem.stock
            );

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            image: product.image,
            price: Number(product.price) || 0,
            stock: stock,
            category: product.category || "",
            quantity: quantity

        });
    }


    qtyInput.value = 1;

    updateCart();

    console.log("Cart:", cart);
}


// =======================================
// INCREASE QUANTITY
// =======================================

function increaseQuantity(id) {

    const item =
        cart.find(item => item.id === id);

    if (!item) return;


    if (item.quantity < item.stock) {

        item.quantity++;

    }


    updateCart();
}


// =======================================
// DECREASE QUANTITY
// =======================================

function decreaseQuantity(id) {

    const item =
        cart.find(item => item.id === id);

    if (!item) return;


    item.quantity--;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);
    }


    updateCart();
}
/* calculate price for bundle */
function calculatePrice(quantity) {
    
    quantity =
        Number(quantity) || 0;
    
    const bundles =
        Math.floor(quantity / 100);
    
    const remaining =
        quantity % 100;
    
    return (
        bundles * 25
    ) + (
        remaining * 0.30
    );
    
}
// =======================================
// CALCULATE TOTAL CART PRICE
// Every 100 items across the WHOLE cart
// = £25.00
// Remaining items = £0.30 each
// =======================================

function calculateCartTotal() {
    
    let totalItems = 0;
    
    // Count every product in the cart
    cart.forEach(item => {
        
        totalItems += Number(item.quantity) || 0;
        
    });
    
    
    const bundles =
        Math.floor(totalItems / 100);
    
    const remaining =
        totalItems % 100;
    
    
    return (
        bundles * 25
    ) + (
        remaining * 0.30
    );
    
}

// =======================================
// SAVE CART
// =======================================

function saveCart() {
    
    localStorage.setItem(
        "calipackz2u-cart",
        JSON.stringify(cart)
    );
    
}
// =======================================
// LOAD SAVED CART
// =======================================

function loadSavedCart() {
    
    const savedCart =
        localStorage.getItem(
            "calipackz2u-cart"
        );
    
    if (!savedCart) {
        cart = [];
        return;
    }
    
    try {
        
        cart = JSON.parse(savedCart);
        
        if (!Array.isArray(cart)) {
            cart = [];
        }
        
    } catch (error) {
        
        console.error(
            "Failed to load saved cart:",
            error
        );
        
        cart = [];
        
    }
    
}

// =======================================
// UPDATE CART
// =======================================
// =======================================
// UPDATE CART
// =======================================

function updateCart() {
    
    const cartItems =
        document.getElementById("cart-items");
    
    const cartCount =
        document.getElementById("cart-count");
    
    const cartTotal =
        document.getElementById("cart-total");
    
    
    if (!cartItems) {
        
        console.error(
            "Cart items element not found."
        );
        
        return;
        
    }
    
    
    cartItems.innerHTML = "";
    
    
    // =======================================
    // EMPTY CART
    // =======================================
    
    if (cart.length === 0) {
        
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;
        
        
        if (cartCount) {
            cartCount.textContent = "0";
        }
        
        
        if (cartTotal) {
            cartTotal.textContent = "0.00";
        }
        
        
        saveCart();
        
        return;
        
    }
    
    
    // =======================================
    // TOTAL QUANTITY
    // =======================================
    
    let totalItems = 0;
    
    
    cart.forEach(item => {
        
        item.quantity =
            Number(item.quantity) || 1;
        
        totalItems += item.quantity;
        
    });
    
    
    // =======================================
    // DISPLAY CART ITEMS
    // =======================================
    
    cart.forEach(item => {
        
        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    class="cart-item-image"
                    src="${item.image || ""}"
                    alt="${item.name || "Product"}"
                >


                <div class="cart-details">

                    <div class="cart-name">
                        ${item.name}
                    </div>


                    <div class="cart-price">

                        ${item.quantity} items

                    </div>


                    <div class="cart-quantity">

                        <button
                            onclick="decreaseQuantity(${item.id})">

                            −

                        </button>


                        <input
                            type="number"
                            min="1"
                            max="${item.stock}"
                            value="${item.quantity}"
                            onchange="
                                changeCartQuantity(
                                    ${item.id},
                                    this.value
                                )
                            "
                        >


                        <button
                            onclick="increaseQuantity(${item.id})">

                            +

                        </button>

                    </div>


                    <button
                        class="remove-cart-item"
                        onclick="removeFromCart(${item.id})">

                        🗑 Remove

                    </button>

                </div>

            </div>

        `;
        
    });
    
    
    // =======================================
    // CALCULATE WHOLE CART PRICE
    // =======================================
    
    const totalPrice =
        calculateCartTotal();
    
    
    // =======================================
    // UPDATE CART COUNT
    // =======================================
    
    if (cartCount) {
        
        cartCount.textContent =
            totalItems;
        
    }
    
    
    // =======================================
    // UPDATE CART TOTAL
    // =======================================
    
    if (cartTotal) {
        
        cartTotal.textContent =
            totalPrice.toFixed(2);
        
    }
    
    
    // =======================================
    // SAVE CART
    // =======================================
    
    saveCart();
    
}


/*Change cart quantity*/

function changeCartQuantity(id, value) {
    
    const item =
        cart.find(item => item.id === id);
    
    if (!item) return;
    
    let quantity =
        parseInt(value, 10);
    
    // Invalid number
    if (isNaN(quantity)) {
        quantity = 1;
    }
    
    // Minimum
    if (quantity < 1) {
        quantity = 1;
    }
    
    // Maximum stock
    if (quantity > item.stock) {
        quantity = item.stock;
    }
    
    item.quantity = quantity;
    
    updateCart();
}
// =======================================
// CLEAR CART
// =======================================

function removeFromCart(id) {
    
    const item =
        cart.find(item => item.id === id);
    
    if (!item) return;
    
    cart = cart.filter(
        item => item.id !== id
    );
    
    updateCart();
    
}

function clearCart() {

    if (cart.length === 0) {
        return;
    }


    if (confirm("Clear your shopping cart?")) {

        cart = [];

        updateCart();
    }
}


// =======================================
// SEARCH
// =======================================

function setupSearch() {

    const searchInput =
        document.getElementById("search");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            const filteredProducts =
                products.filter(product => {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.category || ""
                        ).toLowerCase();


                    return (
                        name.includes(searchValue) ||
                        category.includes(searchValue)
                    );
                });


            displayProducts(
                filteredProducts
            );
        }
    );
}


// =======================================
// LARGE / COMPACT VIEW
// =======================================

function setProductView(view) {

    const container =
        document.getElementById("products");


    const largeButton =
        document.getElementById("large-view");


    const compactButton =
        document.getElementById("compact-view");


    if (!container) return;


    if (view === "compact") {

        container.classList.add(
            "compact-view"
        );


        if (compactButton) {

            compactButton.classList.add(
                "active"
            );
        }


        if (largeButton) {

            largeButton.classList.remove(
                "active"
            );
        }

    } else {

        container.classList.remove(
            "compact-view"
        );


        if (largeButton) {

            largeButton.classList.add(
                "active"
            );
        }


        if (compactButton) {

            compactButton.classList.remove(
                "active"
            );
        }
    }
}

// =======================================
// CART POPUP
// =======================================

function setupCartPopup() {
    
    const cartButton =
        document.getElementById("cart-button");
    
    const cartPanel =
        document.getElementById("cart-panel");
    
    const cartOverlay =
        document.getElementById("cart-overlay");
    
    const closeCart =
        document.getElementById("close-cart");
    
    
    if (!cartButton || !cartPanel) {
        return;
    }
    
    
    function openCart() {
        
        cartPanel.classList.add("active");
        
        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }
        
        document.body.classList.add("cart-open");
    }
    
    
    function closeCartPanel() {
        
        cartPanel.classList.remove("active");
        
        if (cartOverlay) {
            cartOverlay.classList.remove("active");
        }
        
        document.body.classList.remove("cart-open");
    }
    
    
    cartButton.addEventListener(
        "click",
        openCart
    );
    
    
    if (closeCart) {
        
        closeCart.addEventListener(
            "click",
            closeCartPanel
        );
    }
    
    
    if (cartOverlay) {
        
        cartOverlay.addEventListener(
            "click",
            closeCartPanel
        );
    }
}

// =======================================
// CHECKOUT
// =======================================

function setupCheckout() {

    const checkoutButton =
        document.getElementById(
            "checkout-btn"
        );


    if (!checkoutButton) {
        return;
    }


    checkoutButton.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const total =
                document.getElementById(
                    "cart-total"
                )?.textContent || "0.00";


            alert(
                "Thank you for your order!\n\n" +
                "Total: £" + total
            );


            cart = [];

            updateCart();
        }
    );
}

// =======================================
// BULK DEAL PROGRESS
// =======================================

function getBulkDealMessage(totalItems) {
    
    totalItems = Number(totalItems) || 0;
    
    const remainder = totalItems % 100;
    
    if (totalItems === 0) {
        
        return `
            <div class="bulk-message">
                🔥 Buy 100 items for £25.00
            </div>
        `;
    }
    
    
    if (remainder === 0) {
        
        return `
            <div class="bulk-message success">
                🎉 You've unlocked the  100 for £25 deal!
            </div>
        `;
    }
    
    
    const remaining = 100 - remainder;
    
    const progress = remainder;
    
    return `
        <div class="bulk-message">

            🔥 Add ${remaining} more
            for the 100 for £25 deal

            <div class="bulk-progress">

                <div
                    class="bulk-progress-bar"
                    style="width: ${progress}%">
                </div>

            </div>

            <small>
                ${totalItems} / 100 items
            </small>

        </div>
    `;
}

// =======================================
// SORT PRODUCTS
// =======================================

function setupSorting() {
    
    const sortSelect =
        document.getElementById("sort-products");
    
    if (!sortSelect) return;
    
    sortSelect.addEventListener("change", function() {
        
        const sortType = this.value;
        
        let sortedProducts = [...products];
        
        switch (sortType) {
            
            case "price-low":
                
                sortedProducts.sort(
                    (a, b) =>
                    Number(a.price) -
                    Number(b.price)
                );
                
                break;
                
                
            case "price-high":
                
                sortedProducts.sort(
                    (a, b) =>
                    Number(b.price) -
                    Number(a.price)
                );
                
                break;
                
                
            case "likes":
                
                sortedProducts.sort(
                    (a, b) =>
                    Number(b.likes || 0) -
                    Number(a.likes || 0)
                );
                
                break;
                
                
            case "name":
                
                sortedProducts.sort(
                    (a, b) =>
                    String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
                );
                
                break;
                
                
            case "featured":
                
            default:
                
                sortedProducts.sort(
                    (a, b) =>
                    Number(b.featured || false) -
                    Number(a.featured || false)
                );
                
                break;
        }
        
        displayProducts(sortedProducts);
        
    });
}
// =======================================
// PRODUCT IMAGE POPUP
// =======================================

function openImagePopup(image, name) {
    
    const popup =
        document.getElementById("image-popup");
    
    const popupImage =
        document.getElementById("popup-image");
    
    const popupName =
        document.getElementById("popup-name");
    
    
    if (!popup || !popupImage) {
        return;
    }
    
    
    popupImage.src = image;
    
    popupImage.alt = name;
    
    
    if (popupName) {
        popupName.textContent = name;
    }
    
    
    popup.classList.add("show");
    
    
    // Prevent background scrolling
    document.body.classList.add(
        "popup-open"
    );
}


// =======================================
// CLOSE IMAGE POPUP
// =======================================

function closeImagePopup() {
    
    const popup =
        document.getElementById("image-popup");
    
    if (!popup) {
        return;
    }
    
    
    popup.classList.remove("show");
    
    
    document.body.classList.remove(
        "popup-open"
    );
    
}
// =======================================
// START APPLICATION
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupSearch();
        setupCheckout();
        setupSorting();
        setupCartPopup();
        updateCart();
        loadProducts();

    }
);