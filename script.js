// =======================================
// CALIPACKZ2U
// PART 1 - LOAD & DISPLAY PRODUCTS
// =======================================

// Store all products
let products = [];

// Shopping cart (used later)
let cart = [];

// =======================================
// LOAD PRODUCTS FROM JSON
// =======================================

async function loadProducts() {
  
  try {
    
    const response = await fetch("products.json");
    
    products = await response.json();
    
    displayProducts();
    
  } catch (error) {
    
    console.error("Failed to load products:", error);
    
  }
  
}

// =======================================
// DISPLAY PRODUCTS
// =======================================

function displayProducts() {
  
  const container = document.getElementById("products");
  
  container.innerHTML = "";
  
  products.forEach(product => {
    
    // Badge HTML
    let badgeHTML = "";
    
    if (product.badge && product.badge !== "") {
      
      const badgeClass = product.badge
        .toLowerCase()
        .replace(/\s+/g, "-");
      
      badgeHTML =
        `<div class="badge ${badgeClass}">
                    ${product.badge}
                </div>`;
    }
    
    container.innerHTML += `

        <div class="product-card">

            ${badgeHTML}

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="rating">

                    ⭐ ${product.rating}/5

                </p>

                <p class="likes">

                    ❤️
                    <span id="likes-${product.id}">
                        ${product.likes}
                    </span>
                    Likes

                </p>

                <p class="price">

                    £${product.price.toFixed(2)} each

                </p>

                <p class="stock">

                    Stock:
                    ${product.stock}

                </p>

                <div class="buy-section">

                    <input
                        type="number"
                        id="qty-${product.id}"
                        min="1"
                        max="${product.stock}"
                        value="1"
                    >

                    <button
                        onclick="addToCart(${product.id})">

                        Add To Cart

                    </button>

                </div>
                <br/>
               
                <button
                    class="like-button"
                    onclick="likeProduct(${product.id})">

                    ❤️ Like

                </button>

            </div>

        </div>

        `;
    
  });
  
}

// =======================================
// LIKE A PRODUCT
// =======================================

function likeProduct(id) {
  
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  product.likes++;
  
  document.getElementById(`likes-${id}`).textContent =
    product.likes;
  
}
// =======================================
// PART 2 - SHOPPING CART
// =======================================

// Add a product to the cart
function addToCart(id) {
  
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  const qtyInput = document.getElementById(`qty-${id}`);
  
  let quantity = parseInt(qtyInput.value);
  
  if (isNaN(quantity) || quantity < 1) {
    
    quantity = 1;
    
  }
  
  if (quantity > product.stock) {
    
    quantity = product.stock;
    
  }
  
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    
    existing.quantity += quantity;
    
  } else {
    
    cart.push({
      
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      quantity: quantity
      
    });
    
  }
  
  qtyInput.value = 1;
  
  updateCart();
  
}

// =======================================
// Increase Quantity
// =======================================

function increaseQuantity(id) {
  
  const item = cart.find(p => p.id === id);
  
  if (!item) return;
  
  if (item.quantity < item.stock) {
    
    item.quantity++;
    
  }
  
  updateCart();
  
}

// =======================================
// Decrease Quantity
// =======================================

function decreaseQuantity(id) {
  
  const item = cart.find(p => p.id === id);
  
  if (!item) return;
  
  item.quantity--;
  
  if (item.quantity <= 0) {
    
    cart = cart.filter(p => p.id !== id);
    
  }
  
  updateCart();
  
}

// =======================================
// Update Shopping Cart
// =======================================

function updateCart() {
  
  const cartItems = document.getElementById("cart-items");
  
  const cartCount = document.getElementById("cart-count");
  
  cartItems.innerHTML = "";
  
  let totalItems = 0;
  
  if (cart.length === 0) {
    
    cartItems.innerHTML = `

            <p class="empty-cart">

                Your cart is empty.

            </p>

        `;
    
  }
  
  cart.forEach(item => {
    
    totalItems += item.quantity;
    
    cartItems.innerHTML += `

        <div class="cart-item">

            <div class="cart-details">

                <div class="cart-name">

                    ${item.name}

                </div>

                <div class="cart-price">

                    £${calculatePrice(item.quantity).toFixed(2)}

                </div>

            </div>

            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${item.id})">

                    -

                </button>

                <span>

                    ${item.quantity}

                </span>

                <button
                    onclick="increaseQuantity(${item.id})">

                    +

                </button>

            </div>

        </div>

        `;
    
  });
  
  cartCount.textContent = totalItems;
  
  updateTotal();
  
}
// =======================================
// PART 3 - TOTALS & PRICING
// =======================================

// ---------------------------------------
// Pricing Rule
// Every full 100 items = £25.00
// Remaining items = £0.30 each
// ---------------------------------------

function calculatePrice(quantity) {
  
  const hundreds = Math.floor(quantity / 100);
  
  const remainder = quantity % 100;
  
  const total = (hundreds * 25) + (remainder * 0.30);
  
  return total;
  
}

// =======================================
// UPDATE TOTAL
// =======================================

function updateTotal() {
  
  const totalElement = document.getElementById("cart-total");
  
  let total = 0;
  
  cart.forEach(item => {
    
    total += calculatePrice(item.quantity);
    
  });
  
  totalElement.textContent = total.toFixed(2);
  
}

// =======================================
// CLEAR CART
// =======================================

function clearCart() {
  
  if (cart.length === 0) {
    
    alert("Your cart is already empty.");
    
    return;
    
  }
  
  if (confirm("Clear your shopping cart?")) {
    
    cart = [];
    
    updateCart();
    
  }
  
}

// =======================================
// CHECKOUT BUTTON
// =======================================

const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {
  
  checkoutButton.addEventListener("click", () => {
    
    if (cart.length === 0) {
      
      alert("Your cart is empty.");
      
      return;
      
    }
    
    alert(
      "Thank you for your order!\n\n" +
      "Total: £" +
      document.getElementById("cart-total").textContent
    );
    
    cart = [];
    
    updateCart();
    
  });
  
}

// =======================================
// START APPLICATION
// =======================================

loadProducts();