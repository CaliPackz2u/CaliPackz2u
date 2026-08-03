// ===========================
// GLOBAL VARIABLES
// ===========================

let products = [];
let cart = [];

// ===========================
// LOAD PRODUCTS
// ===========================

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    products = await response.json();
    
    displayProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// ===========================
// DISPLAY PRODUCTS
// ===========================

function displayProducts() {
  
  const container = document.getElementById("products");
  
  container.innerHTML = "";
  
  products.forEach(product => {
    
    container.innerHTML += `
            <div class="product-card">
            <div class="badge ${product.badge.toLowerCase().replace(/\s+/g,'-')}"> ${product.badge}</div>
                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p class="price">£${product.price.toFixed(2)} each</p>

                    <p class="stock">
                        Stock: ${product.stock}
                    </p>

                    <button onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;
    
  });
  
}

// ===========================
// ADD TO CART
// ===========================

function addToCart(id) {
  
  const item = cart.find(product => product.id === id);
  
  if (item) {
    
    item.quantity++;
    
  } else {
    
    const product = products.find(product => product.id === id);
    
    cart.push({
      ...product,
      quantity: 1
    });
    
  }
  
  updateCart();
  
}

// ===========================
// INCREASE QUANTITY
// ===========================

function increaseQuantity(id) {
  
  const item = cart.find(product => product.id === id);
  
  if (item) {
    
    item.quantity++;
    
  }
  
  updateCart();
  
}

// ===========================
// DECREASE QUANTITY
// ===========================

function decreaseQuantity(id) {
  
  const item = cart.find(product => product.id === id);
  
  if (!item) return;
  
  item.quantity--;
  
  if (item.quantity <= 0) {
    
    cart = cart.filter(product => product.id !== id);
    
  }
  
  updateCart();
  
}

// ===========================
// PRICING RULE
// Every 100 = £25.00
// ===========================

function calculatePrice(quantity) {
  
  const hundreds = Math.floor(quantity / 100);
  
  const remainder = quantity % 100;
  
  return (hundreds * 25) + (remainder * 0.30);
  
}

// ===========================
// UPDATE CART
// ===========================

function updateCart() {
  
  const cartItems = document.getElementById("cart-items");
  
  const totalElement = document.getElementById("cart-total");
  
  const cartCount = document.getElementById("cart-count");
  
  cartItems.innerHTML = "";
  
  let total = 0;
  
  let itemCount = 0;
  
  if (cart.length === 0) {
    
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    
  }
  
  cart.forEach(item => {
    
    const price = calculatePrice(item.quantity);
    
    total += price;
    
    itemCount += item.quantity;
    
    cartItems.innerHTML += `

            <div class="cart-item">

                <div class="cart-details">

                    <div class="cart-name">
                        ${item.name}
                    </div>

                    <div class="cart-price">
                        £${price.toFixed(2)}
                    </div>

                </div>

                <div class="quantity-controls">

                    <button onclick="decreaseQuantity(${item.id})">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity(${item.id})">
                        +
                    </button>

                </div>

            </div>

        `;
    
  });
  
  totalElement.textContent = total.toFixed(2);
  
  cartCount.textContent = itemCount;
  
}

// ===========================
// START APP
// ===========================

loadProducts();