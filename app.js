const products = [
  { id: "headphones", name: "Everyday wireless headphones", category: "Electronics", price: 49.99, oldPrice: 69.99, rating: 4.8, reviews: 2841, badge: "Best seller", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", description: "Comfortable over-ear headphones with rich sound, a foldable design, and a long-lasting battery for commutes and quiet afternoons." },
  { id: "vase", name: "Hand-finished ceramic vase", category: "Home", price: 28.5, rating: 4.6, reviews: 624, badge: "Thoughtful pick", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80", description: "A sculptural stoneware vase with a softly textured finish. Lovely on its own or styled with your favorite stems." },
  { id: "lamp", name: "Soft glow bedside lamp", category: "Home", price: 36.0, oldPrice: 44.0, rating: 4.7, reviews: 982, badge: "Deal", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", description: "Bring a warm, gentle glow to your nightstand or reading nook with this simple, timeless table lamp." },
  { id: "tote", name: "Canvas day-out tote", category: "Style", price: 24.0, rating: 4.5, reviews: 371, badge: "Everyday essential", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", description: "A roomy, durable canvas carryall with comfortable straps and an easy-to-style everyday shape." },
  { id: "speaker", name: "Portable bluetooth speaker", category: "Electronics", price: 39.99, oldPrice: 54.99, rating: 4.7, reviews: 1530, badge: "Deal", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80", description: "Take your favorite playlists anywhere with a compact speaker made for easy listening at home or outside." },
  { id: "cookbook", name: "The simple seasonal cookbook", category: "Books", price: 21.95, rating: 4.9, reviews: 416, badge: "Reader favorite", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80", description: "A welcoming collection of approachable recipes inspired by fresh ingredients and relaxed weeknight cooking." },
  { id: "planter", name: "Indoor ceramic planter", category: "Home", price: 19.99, rating: 4.4, reviews: 293, badge: "Small-space pick", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80", description: "Give a favorite plant a fresh home with this clean-lined ceramic planter, sized for shelves and sunny sills." },
  { id: "bottle", name: "Insulated stainless water bottle", category: "Outdoors", price: 26.0, oldPrice: 32.0, rating: 4.8, reviews: 2042, badge: "Deal", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80", description: "A reusable, double-wall insulated bottle that keeps your drink close at work, on the trail, or on the go." },
  { id: "sunglasses", name: "Classic everyday sunglasses", category: "Style", price: 32.0, rating: 4.3, reviews: 188, badge: "Just right", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", description: "A versatile, lightweight frame with a classic silhouette for bright days and easy weekend plans." },
  { id: "throw", name: "Woven cotton throw blanket", category: "Home", price: 42.0, rating: 4.7, reviews: 749, badge: "Cozy pick", image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=800&q=80", description: "Add an extra layer of texture to your sofa or bed with a soft woven throw in a relaxed neutral tone." },
  { id: "backpack", name: "Lightweight trail backpack", category: "Outdoors", price: 58.0, oldPrice: 72.0, rating: 4.6, reviews: 511, badge: "Deal", image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=800&q=80", description: "A lightweight pack with practical storage for day hikes, travel, and everyday adventures." },
  { id: "journal", name: "Linen-bound daily journal", category: "Books", price: 16.5, rating: 4.8, reviews: 334, badge: "Lovely little gift", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80", description: "A calm place for notes, plans, sketches, and all the small thoughts you want to keep." }
];

const STORAGE_KEYS = { cart: "everyday-finds-cart", wishlist: "everyday-finds-wishlist" };
const readStoredValue = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (error) {
    console.error(`Could not read saved ${key} data.`, error);
    return fallback;
  }
};

let cart = readStoredValue(STORAGE_KEYS.cart, {});
let wishlist = readStoredValue(STORAGE_KEYS.wishlist, []);
if (!cart || Array.isArray(cart) || typeof cart !== "object") cart = {};
if (!Array.isArray(wishlist)) wishlist = [];

const state = { category: "All", dealsOnly: false, wishlistOnly: false, query: "", sort: "featured" };
const grid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const cartDrawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const toast = document.querySelector("#toast");
const productDialog = document.querySelector("#product-dialog");
const messageDialog = document.querySelector("#message-dialog");
let toastTimer;

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
const money = (value) => `$${value.toFixed(2)}`;
const getProduct = (id) => products.find((product) => product.id === id);

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} data.`, error);
    showToast("Your browser could not save this change.");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function filteredProducts() {
  const department = document.querySelector("#search-department").value;
  const query = state.query.trim().toLowerCase();
  let visible = products.filter((product) => {
    const categoryMatches = state.category === "All" || product.category === state.category;
    const departmentMatches = department === "All" || product.category === department;
    const dealMatches = !state.dealsOnly || product.oldPrice;
    const wishlistMatches = !state.wishlistOnly || wishlist.includes(product.id);
    const queryMatches = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return categoryMatches && departmentMatches && dealMatches && wishlistMatches && queryMatches;
  });

  if (state.sort === "price-low") visible = visible.sort((a, b) => a.price - b.price);
  if (state.sort === "price-high") visible = visible.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") visible = visible.sort((a, b) => b.rating - a.rating);
  return visible;
}

function renderProducts() {
  const visible = filteredProducts();
  const heading = document.querySelector("#product-heading");
  const activeCategory = state.wishlistOnly ? "Saved finds" : state.dealsOnly ? "Today's deals" : state.category === "All" ? "Popular picks" : `${state.category} finds`;
  heading.textContent = activeCategory;
  document.querySelector("#result-count").textContent = `${visible.length} ${visible.length === 1 ? "find" : "finds"} to explore`;
  document.querySelectorAll(".filter-chip").forEach((button) => {
    const isActive = button.dataset.category
      ? !state.dealsOnly && !state.wishlistOnly && button.dataset.category === state.category
      : button.dataset.deals
        ? state.dealsOnly && !state.wishlistOnly
        : button.id === "wishlist-filter" && state.wishlistOnly;
    button.classList.toggle("active", Boolean(isActive));
  });
  grid.innerHTML = visible.map((product) => {
    const saved = wishlist.includes(product.id);
    return `
      <article class="product-card">
        <button class="product-image-wrap" type="button" data-open-details="${product.id}" aria-label="View ${escapeHTML(product.name)} details">
          <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
          <span class="product-badge ${product.oldPrice ? "sale" : ""}">${escapeHTML(product.badge)}</span>
        </button>
        <button class="heart-button ${saved ? "saved" : ""}" type="button" data-wishlist="${product.id}" aria-label="${saved ? "Remove from" : "Add to"} saved finds" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
        <div class="product-info">
          <span class="product-category">${escapeHTML(product.category)}</span>
          <h3 class="product-name">${escapeHTML(product.name)}</h3>
          <div class="product-rating" aria-label="${product.rating} out of 5 stars">★★★★★ <span>${product.rating} (${product.reviews.toLocaleString()})</span></div>
          <div class="price-line"><span class="product-price">${money(product.price)}</span>${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}</div>
          <button class="add-button" type="button" data-add="${product.id}">Add to cart</button>
        </div>
      </article>`;
  }).join("");
  emptyState.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
  document.querySelector("#wishlist-count").textContent = wishlist.length;
}

function renderCart() {
  const items = Object.entries(cart)
    .map(([id, quantity]) => ({ product: getProduct(id), quantity }))
    .filter((item) => item.product && Number.isInteger(item.quantity) && item.quantity > 0);
  const quantityTotal = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  document.querySelector("#cart-count").textContent = quantityTotal;
  document.querySelector("#drawer-item-count").textContent = `(${quantityTotal})`;
  document.querySelector("#cart-subtotal").textContent = money(subtotal);
  document.querySelector("#shipping-note").textContent = subtotal === 0
    ? ""
    : subtotal >= 35 ? "Your demo order qualifies for free delivery." : `Add ${money(35 - subtotal)} more for free delivery.`;
  document.querySelector("#cart-items").innerHTML = items.map(({ product, quantity }) => `
    <article class="cart-row">
      <img src="${escapeHTML(product.image)}" alt="">
      <div>
        <h3 class="cart-product-title">${escapeHTML(product.name)}</h3>
        <span class="cart-row-price">${money(product.price)}</span>
        <div class="quantity-control" aria-label="Quantity for ${escapeHTML(product.name)}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${product.id}">Remove</button>
    </article>`).join("");
  document.querySelector("#cart-empty").hidden = items.length > 0;
  document.querySelector("#cart-summary").hidden = items.length === 0;
}

function setCategory(category) {
  state.category = category;
  state.dealsOnly = false;
  state.wishlistOnly = false;
  document.querySelector("#search-department").value = "All";
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openCart() {
  renderCart();
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.classList.add("drawer-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.classList.remove("drawer-open");
}

function openMessage(content) {
  document.querySelector("#message-content").innerHTML = `<button class="icon-button dialog-close" type="button" aria-label="Close message">×</button>${content}`;
  if (!messageDialog.open) messageDialog.showModal();
}

function addToCart(id) {
  if (!getProduct(id)) return;
  cart[id] = (cart[id] || 0) + 1;
  saveStorage(STORAGE_KEYS.cart, cart);
  renderCart();
  showToast(`${getProduct(id).name} added to cart`);
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = document.querySelector("#search").value;
  state.category = "All";
  state.dealsOnly = false;
  state.wishlistOnly = false;
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#search").addEventListener("input", (event) => {
  state.query = event.target.value;
  state.category = "All";
  state.dealsOnly = false;
  state.wishlistOnly = false;
  renderProducts();
});
document.querySelector("#search-department").addEventListener("change", () => {
  state.category = "All";
  state.dealsOnly = false;
  state.wishlistOnly = false;
  renderProducts();
});
document.querySelector("#sort-products").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});
document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    state.query = "";
    document.querySelector("#search").value = "";
    setCategory(button.dataset.category);
  });
});
document.querySelectorAll("[data-deals]").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = "All";
    state.dealsOnly = true;
    state.wishlistOnly = false;
    state.query = "";
    document.querySelector("#search").value = "";
    renderProducts();
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
document.querySelector("#wishlist-filter").addEventListener("click", () => {
  state.wishlistOnly = !state.wishlistOnly;
  state.dealsOnly = false;
  state.category = "All";
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector("#product-grid").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const wishlistButton = event.target.closest("[data-wishlist]");
  const detailTarget = event.target.closest("[data-open-details]");
  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }
  if (wishlistButton) {
    const id = wishlistButton.dataset.wishlist;
    wishlist = wishlist.includes(id) ? wishlist.filter((savedId) => savedId !== id) : [...wishlist, id];
    saveStorage(STORAGE_KEYS.wishlist, wishlist);
    renderProducts();
    showToast(wishlist.includes(id) ? "Saved to your finds" : "Removed from saved finds");
    return;
  }
  if (detailTarget) {
    const product = getProduct(detailTarget.dataset.openDetails);
    if (!product) return;
    document.querySelector("#product-detail").innerHTML = `
      <div class="product-detail-layout">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">
        <div class="product-detail-copy">
          <span class="eyebrow">${escapeHTML(product.category)}</span>
          <h2>${escapeHTML(product.name)}</h2>
          <div class="product-rating">★★★★★ <span>${product.rating} (${product.reviews.toLocaleString()} reviews)</span></div>
          <span class="product-price">${money(product.price)} ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}</span>
          <p>${escapeHTML(product.description)}</p>
          <button class="button button-dark" type="button" data-detail-add="${product.id}">Add to cart</button>
        </div>
      </div>`;
    productDialog.showModal();
  }
});
document.querySelector("#product-detail").addEventListener("click", (event) => {
  const button = event.target.closest("[data-detail-add]");
  if (!button) return;
  addToCart(button.dataset.detailAdd);
  productDialog.close();
});
document.querySelector("#cart-button").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
document.querySelector("#continue-shopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.querySelector("#cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    cart[id] = (cart[id] || 0) + Number(quantityButton.dataset.change);
    if (cart[id] <= 0) delete cart[id];
    saveStorage(STORAGE_KEYS.cart, cart);
    renderCart();
  }
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveStorage(STORAGE_KEYS.cart, cart);
    renderCart();
  }
});
document.querySelector("#checkout-button").addEventListener("click", () => {
  closeCart();
  openMessage(`<div class="message-content"><span aria-hidden="true">✓</span><h2>Ready for a demo checkout?</h2><p>This storefront is a front-end demonstration. No payment or order will be processed.</p><button class="button button-dark" id="place-demo-order" type="button">Place demo order</button></div>`);
});
document.querySelector("#message-content").addEventListener("click", (event) => {
  if (event.target.closest(".dialog-close")) messageDialog.close();
  if (event.target.closest("#place-demo-order")) {
    cart = {};
    saveStorage(STORAGE_KEYS.cart, cart);
    renderCart();
    messageDialog.close();
    openMessage(`<div class="message-content"><span aria-hidden="true">✓</span><h2>Demo order complete</h2><p>Thanks for trying the storefront. No real order was placed and no payment was taken.</p><button class="button button-dark" id="finish-demo" type="button">Continue browsing</button></div>`);
  }
  if (event.target.closest("#finish-demo")) messageDialog.close();
});
document.querySelectorAll(".dialog-close").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
messageDialog.addEventListener("click", (event) => {
  if (event.target === messageDialog) messageDialog.close();
});
document.querySelector("#clear-filters").addEventListener("click", () => {
  state.category = "All";
  state.dealsOnly = false;
  state.wishlistOnly = false;
  state.query = "";
  document.querySelector("#search").value = "";
  document.querySelector("#search-department").value = "All";
  renderProducts();
});
document.querySelector("#explore-button").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#promo-button").addEventListener("click", () => {
  state.category = "Home";
  state.dealsOnly = false;
  state.wishlistOnly = false;
  document.querySelector("#search-department").value = "All";
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.querySelector("#delivery-button").addEventListener("click", () => {
  openMessage(`<div class="message-content"><span aria-hidden="true">⌖</span><h2>Set your delivery location</h2><p>Enter a ZIP or postal code to personalize this demo storefront.</p><form id="location-form"><label class="visually-hidden" for="postal-code">ZIP or postal code</label><input id="postal-code" name="postalCode" autocomplete="postal-code" placeholder="ZIP or postal code" required maxlength="12"><button class="button button-dark" type="submit">Update location</button></form></div>`);
});
document.querySelector("#message-content").addEventListener("submit", (event) => {
  if (event.target.id !== "location-form") return;
  event.preventDefault();
  const value = String(new FormData(event.target).get("postalCode") || "").trim();
  if (!value) return;
  document.querySelector("#delivery-location").textContent = value;
  messageDialog.close();
  showToast(`Delivery location updated to ${value}`);
});
document.querySelector("#account-button").addEventListener("click", () => {
  openMessage(`<div class="message-content"><span aria-hidden="true">☺</span><h2>Welcome to Everyday Finds</h2><p>Account sign-in isn't connected in this demo, but your cart and saved finds stay in this browser.</p><button class="button button-dark" id="account-done" type="button">Got it</button></div>`);
});
document.querySelector("#message-content").addEventListener("click", (event) => {
  if (event.target.closest("#account-done")) messageDialog.close();
});
document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  document.querySelector("#newsletter-message").textContent = `Thanks — ${email.value} is on the list (demo).`;
  event.target.reset();
});

renderProducts();
renderCart();
