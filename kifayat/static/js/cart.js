// ── Kifayat Auto Parts · cart.js ──────────────────────────────────────────

const STORAGE_KEY = 'kifayat_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + (i.qty || 0), 0);
  document.querySelectorAll('#cartCount, .cart-count').forEach(el => el.textContent = count);
}

function addToCart(name, price, icon, cat) {
  const cart = getCart();
  const idx = cart.findIndex(c => c.name === name);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ name, price: Number(price), icon, cat, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  renderCartDrawer();
  openCart();
  showToast(`${name} added to cart!`);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCartDrawer();
  const container = document.getElementById('cartPageContainer');
  if (container) renderCartInPage(container);
}

function changeQty(index, delta) {
  const cart = getCart();
  cart[index].qty = Math.max(1, (cart[index].qty || 1) + delta);
  saveCart(cart);
  updateCartCount();
  renderCartDrawer();
  const container = document.getElementById('cartPageContainer');
  if (container) renderCartInPage(container);
}

// ── Cart Drawer ────────────────────────────────────────────────────────────
function renderCartDrawer() {
  const cart = getCart();
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<p class="empty-state" style="padding:24px;text-align:center;">Your cart is empty.</p>';
    footer.innerHTML = '';
    return;
  }

  let total = 0;
  body.innerHTML = cart.map((item, i) => {
    const sub = item.price * item.qty;
    total += sub;
    return `
      <div class="cart-item">
        <div class="cart-item-left">
          <div class="cart-item-img">${item.icon || '🔩'}</div>
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-cat" style="color:var(--muted);font-size:0.85rem;">${item.cat || ''}</div>
          </div>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-qty">
            <button onclick="changeQty(${i}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${i}, +1)">+</button>
          </div>
          <div class="cart-item-price">PKR ${sub.toLocaleString()}</div>
          <button class="btn-remove" onclick="removeFromCart(${i})">✕</button>
        </div>
      </div>`;
  }).join('');

  footer.innerHTML = `
    <div class="cart-total">Total: <strong>PKR ${total.toLocaleString()}</strong></div>
    <button class="btn-primary" style="width:100%;margin-top:12px;" onclick="openCheckout()">Checkout</button>`;
}

// ── Cart Page (orders.html) ────────────────────────────────────────────────
function renderCartInPage(container) {
  const cart = getCart();
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-state">Your cart is empty. <a href="/products">Browse products</a></p>';
    return;
  }

  let total = 0;
  const items = cart.map((item, i) => {
    const sub = item.price * item.qty;
    total += sub;
    return `
      <div class="cart-item">
        <div class="cart-item-left">
          <div class="cart-item-img">${item.icon || '🔩'}</div>
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-cat" style="color:var(--muted);font-size:0.85rem;">${item.cat || ''}</div>
          </div>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-qty">
            <button onclick="changeQty(${i}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${i}, +1)">+</button>
          </div>
          <div class="cart-item-price">PKR ${sub.toLocaleString()}</div>
          <button class="btn-remove" onclick="removeFromCart(${i})">✕</button>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="cart-list">${items}</div>
    <div class="cart-footer">
      <div class="cart-total">Total: <strong>PKR ${total.toLocaleString()}</strong></div>
      <button class="btn-primary btn-checkout" onclick="openCheckout()">Checkout</button>
    </div>`;
}

// ── Toggle Drawer ──────────────────────────────────────────────────────────
function openCart() {
  renderCartDrawer();
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
}
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer?.classList.contains('open')) {
    drawer.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
  } else {
    openCart();
  }
}

// ── Checkout Modal ─────────────────────────────────────────────────────────
function openCheckout() {
  document.getElementById('checkoutOverlay').style.display = 'flex';
}
function closeCheckout() {
  document.getElementById('checkoutOverlay').style.display = 'none';
}

async function submitCheckout() {
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const cart = getCart();

  if (!name) { alert('Please enter your name.'); return; }
  if (cart.length === 0) { alert('Your cart is empty.'); return; }

  const res = await fetch('/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, customer_name: name, customer_phone: phone })
  });
  const data = await res.json();

  if (data.success) {
    saveCart([]);
    updateCartCount();
    renderCartDrawer();
    closeCheckout();
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
    alert(`✅ Order placed! Your Order ID is:\n\n${data.order_code}\n\nUse this to track your order.`);
  } else {
    alert('❌ ' + (data.message || 'Something went wrong.'));
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('kap-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'kap-toast';
    t.style.cssText = `
      position:fixed;bottom:24px;right:24px;
      background:var(--accent);color:#111;
      padding:12px 20px;border-radius:999px;
      font-weight:600;font-size:0.9rem;
      opacity:0;transition:opacity 0.3s;z-index:9999;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2500);
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  renderCartDrawer();
});
