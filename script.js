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

        console.log("Loading products.json...");

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error(
                `Could not load products.json (${response.status})`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "products.json must contain an array of products."
            );
        }

        products = data;

        console.log(
            `Successfully loaded ${products.length} products.`
        );

        displayProducts();

    } catch (error) {

        console.error("Failed to load products:", error);

        const container =
            document.getElementById("products");

        if (container) {

            container.innerHTML = `
                <p class="no-products">
                    Unable to load products.
                </p>
            `;
        }
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

                <img
                    src="${product.image || ""}"
                    alt="${product.name || "Product"}"
                >
<br/>
                <div class="product-info">
                 <p class="stock-status ${stockClass}">
                        ${stockStatus}
                    </p>
                    <div class="rating-grid">
  <div class="ratingrid-item">
                    <h3>
                        ${product.name || "Unnamed Product"}
                    </h3></div><div class="ratingrid-item">
                    <p class="rating">
${product.rating || 0}/5⭐ 
                    </p>
                    </div>
                    </div>

                
<div class="rating-grid">
  <div class="ratingrid-item">
       <p class="category">
                        ${product.category || "Uncategorised"}
                    </p>             
</div>
       <div class="ratingrid-item">
         
       </div>
<div class="ratingrid-item">
                    <p class="stock">
                        Stock: ${stock}
                    </p>
</div>
                    <div class="ratingrid-item">

                    <p class="price">
                        £${Number(product.price || 0).toFixed(2)}
                        each
                    </p>
                    </div>
                


                    <!-- LIKE BUTTON -->
 <div class="ratingrid-item">
                    <button
                        class="like-button"
                        onclick="likeProduct(${product.id})">

                        ❤️ Like

                    </button>
                    </div>
                   


                    <!-- QUANTITY + CART -->
                    <div class="buy-section">

                        <input
                            type="number"
                            id="qty-${product.id}"
                            min="1"
                            max="${stock}"
                            value="1"
                            ${stock === 0 ? "disabled" : ""}
                        >

                        <button
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

function likeProduct(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;

    product.likes =
        Number(product.likes || 0) + 1;


    const likesElement =
        document.getElementById(`likes-${id}`);


    if (likesElement) {

        likesElement.textContent =
            product.likes;
    }
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


// =======================================
// BULK PRICING
// Every 100 = £25
// =======================================

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
        console.error("Cart items element not found.");
        return;
    }
    
    cartItems.innerHTML = "";
    
    let totalItems = 0;
    
    // =======================================
    // CALCULATE TOTAL QUANTITY
    // =======================================
    
    cart.forEach(item => {
        totalItems += Number(item.quantity) || 0;
    });
    
    
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
        
        return;
    }
    
    
    // =======================================
    // DISPLAY CART ITEMS
    // =======================================
    
    cart.forEach(item => {
        
        const quantity =
            Number(item.quantity) || 0;
        
        cartItems.innerHTML += `

            <div class="cart-item">
            <div class="basket-grid">
            <div class="basket-item">

                <img
                    class="cart-product-image"
                    src="${item.image}"
                    alt="${item.name}"
                >
</div>
<div class="basket-item">
                <div class="cart-details">

                    <div class="cart-name">
                        ${item.name}
                    </div>
</div>
<div class="basket-item">
                    <div class="cart-quantity">
                        Quantity: ${quantity}
                    </div>
</div>
                </div>
<div class="basket-item">
                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${item.id})">
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${item.id})">
                        +
                    </button>

                </div>
</div>
</div>
            </div>

        `;
    });
    
    
    // =======================================
    // COMBINED BULK PRICE
    // =======================================
    
    const totalPrice =
        calculatePrice(totalItems);
    
    
    // =======================================
    // UPDATE CART
    // =======================================
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    if (cartTotal) {
        cartTotal.textContent =
            totalPrice.toFixed(2);
    }
}
// =======================================
// CLEAR CART
// =======================================

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
// START APPLICATION
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupSearch();

        setupCheckout();
        
        setupCartPopup();

        updateCart();

        loadProducts();

    }
);