"use strict";

/* =========================
   TUAN4422 MARKET
   Demo front-end
========================= */

const STORAGE = {
  cart: "tuan4422_cart",
  users: "tuan4422_users",
  currentUser: "tuan4422_current_user",
  balance: "tuan4422_balance",
  orders: "tuan4422_orders",
  favorites: "tuan4422_favorites",
  chat: "tuan4422_chat",
  forum: "tuan4422_forum"
};

const PRODUCTS = [
  {
    id: "script-ui",
    name: "Script UI Demo",
    type: "Script",
    icon: "UI",
    price: 49000,
    description: "Bộ giao diện script mẫu, phù hợp cho mục đích học tập và phát triển."
  },
  {
    id: "script-tool",
    name: "Script Utility",
    type: "Script",
    icon: "JS",
    price: 69000,
    description: "Bộ công cụ script demo với giao diện đơn giản, dễ tùy chỉnh."
  },
  {
    id: "account-demo",
    name: "Tài khoản Demo",
    type: "Account",
    icon: "ACC",
    price: 39000,
    description: "Tài khoản mẫu dùng để kiểm thử hệ thống. Không phải tài khoản người khác."
  },
  {
    id: "minecraft-pack",
    name: "Minecraft Setup Pack",
    type: "Minecraft",
    icon: "MC",
    price: 79000,
    description: "Bộ thiết lập mẫu dành cho server Minecraft cá nhân."
  },
  {
    id: "web-template",
    name: "Website Template",
    type: "Script",
    icon: "WEB",
    price: 59000,
    description: "Mẫu website hiện đại có thể dùng làm nền tảng cho dự án cá nhân."
  },
  {
    id: "config-pack",
    name: "Config Pack",
    type: "Minecraft",
    icon: "CFG",
    price: 29000,
    description: "Bộ cấu hình mẫu giúp bạn bắt đầu dự án Minecraft nhanh hơn."
  }
];

/* =========================
   HELPERS
========================= */

function getJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return Number(value || 0).toLocaleString("vi-VN") + "$";
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  let element = document.getElementById("toast");

  if (!element) {
    element = document.createElement("div");
    element.id = "toast";
    document.body.appendChild(element);
  }

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2200);
}

function currentUser() {
  return localStorage.getItem(STORAGE.currentUser) || "";
}

/* =========================
   THEME / MENU
========================= */

function initNavigation() {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("mainNav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    document.addEventListener("click", event => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        nav.classList.remove("open");
      }
    });
  }

  const page = document.body.dataset.page;

  document.querySelectorAll(".main-nav a[data-page]").forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
}

/* =========================
   CART
========================= */

function getCart() {
  return getJSON(STORAGE.cart, []);
}

function saveCart(cart) {
  setJSON(STORAGE.cart, cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();

  const count = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = count;
  });
}

function addToCart(productId) {
  const product = PRODUCTS.find(item => item.id === productId);

  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveCart(cart);
  toast("Đã thêm vào giỏ hàng");
}

function cartTotal() {
  return getCart().reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function changeQuantity(productId, amount) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");

  if (!container || !total) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;

    total.textContent = money(0);
    return;
  }

  container.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-item">
        <div class="cart-item-icon">${escapeHTML(product.icon)}</div>

        <div class="cart-item-info">
          <strong>${escapeHTML(product.name)}</strong>
          <small>${money(product.price)} × ${item.quantity}</small>
        </div>

        <button
          class="remove-item"
          data-cart-remove="${escapeHTML(product.id)}"
          aria-label="Xóa">
          Xóa
        </button>
      </div>
    `;
  }).join("");

  total.textContent = money(cartTotal());
}

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("show");

  if (!document.querySelector(".modal.show")) {
    document.body.classList.remove("modal-open");
  }
}

function initCart() {
  const cartBtn = document.getElementById("cartBtn");

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      renderCart();
      openModal("cartModal");
    });
  }

  document.addEventListener("click", event => {
    const close = event.target.closest("[data-close-modal]");

    if (close) {
      closeModal(close.dataset.closeModal);
    }

    const remove = event.target.closest("[data-cart-remove]");

    if (remove) {
      removeFromCart(remove.dataset.cartRemove);
    }

    const minus = event.target.closest("[data-cart-minus]");

    if (minus) {
      changeQuantity(minus.dataset.cartMinus, -1);
    }

    const plus = event.target.closest("[data-cart-plus]");

    if (plus) {
      changeQuantity(plus.dataset.cartPlus, 1);
    }
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.show").forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  const checkout = document.getElementById("checkoutBtn");

  if (checkout) {
    checkout.addEventListener("click", checkoutCart);
  }

  updateCartCount();
}

function checkoutCart() {
  const user = currentUser();

  if (!user) {
    closeModal("cartModal");
    toast("Bạn cần đăng nhập trước");
    setTimeout(() => {
      window.location.href = "account.html";
    }, 500);
    return;
  }

  const cart = getCart();

  if (!cart.length) {
    toast("Giỏ hàng đang trống");
    return;
  }

  const total = cartTotal();
  const balance = Number(localStorage.getItem(STORAGE.balance) || 0);

  if (balance < total) {
    toast("Số dư demo không đủ");
    return;
  }

  localStorage.setItem(
    STORAGE.balance,
    String(balance - total)
  );

  const orders = getJSON(STORAGE.orders, []);

  orders.unshift({
    id: "DH" + Date.now(),
    user,
    total,
    date: new Date().toLocaleString("vi-VN"),
    status: "Đã thanh toán"
  });

  setJSON(STORAGE.orders, orders);
  saveCart([]);

  closeModal("cartModal");
  toast("Đặt hàng thành công");

  setTimeout(() => {
    if (document.body.dataset.page === "account") {
      location.reload();
    }
  }, 700);
}

/* =========================
   SHOP
========================= */

function renderProducts(list = PRODUCTS) {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty">
        Không tìm thấy sản phẩm.
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card">

      <div class="product-top">
        <div class="product-icon">
          ${escapeHTML(product.icon)}
        </div>

        <div class="product-type">
          ${escapeHTML(product.type)}
        </div>

        <h3>${escapeHTML(product.name)}</h3>
      </div>

      <div class="product-description">
        ${escapeHTML(product.description)}
      </div>

      <div class="product-bottom">
        <div class="price">
          ${money(product.price)}
        </div>

        <button
          class="btn btn-primary btn-small"
          data-add-cart="${escapeHTML(product.id)}">
          Thêm
        </button>
      </div>

    </article>
  `).join("");
}

function initShop() {
  if (!document.getElementById("productGrid")) return;

  renderProducts();

  const search = document.getElementById("productSearch");

  if (search) {
    search.addEventListener("input", () => {
      const keyword = search.value.toLowerCase().trim();

      const result = PRODUCTS.filter(product => {
        return (
          product.name.toLowerCase().includes(keyword) ||
          product.type.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword)
        );
      });

      renderProducts(result);
    });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-add-cart]");

    if (!button) return;

    addToCart(button.dataset.addCart);
  });
}

/* =========================
   ACCOUNT
========================= */

function initAccount() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const user = currentUser();

  const logged = document.getElementById("loggedAccount");
  const auth = document.getElementById("authAccount");

  if (user && logged && auth) {
    logged.style.display = "block";
    auth.style.display = "none";

    const name = document.getElementById("accountName");

    if (name) {
      name.textContent = user;
    }

    const balance = document.getElementById("accountBalance");

    if (balance) {
      balance.textContent = money(
        Number(localStorage.getItem(STORAGE.balance) || 0)
      );
    }

    renderOrders();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      const username =
        document.getElementById("loginUsername").value.trim();

      const password =
        document.getElementById("loginPassword").value;

      if (!username || !password) {
        toast("Vui lòng nhập đầy đủ");
        return;
      }

      const users = getJSON(STORAGE.users, []);

      const found = users.find(user =>
        user.username === username &&
        user.password === password
      );

      if (!found) {
        toast("Sai tài khoản hoặc mật khẩu demo");
        return;
      }

      localStorage.setItem(STORAGE.currentUser, username);

      if (localStorage.getItem(STORAGE.balance) === null) {
        localStorage.setItem(STORAGE.balance, "100000");
      }

      toast("Đăng nhập thành công");

      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", event => {
      event.preventDefault();

      const username =
        document.getElementById("registerUsername").value.trim();

      const password =
        document.getElementById("registerPassword").value;

      if (username.length < 3 || password.length < 4) {
        toast("Tên tối thiểu 3 ký tự, mật khẩu 4 ký tự");
        return;
      }

      const users = getJSON(STORAGE.users, []);

      if (users.some(user => user.username === username)) {
        toast("Tên tài khoản đã tồn tại");
        return;
      }

      users.push({
        username,
        password
      });

      setJSON(STORAGE.users, users);
      localStorage.setItem(STORAGE.currentUser, username);
      localStorage.setItem(STORAGE.balance, "100000");

      toast("Tạo tài khoản thành công");

      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

  const logout = document.getElementById("logoutBtn");

  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem(STORAGE.currentUser);
      location.reload();
    });
  }
}

function renderOrders() {
  const box = document.getElementById("orderList");

  if (!box) return;

  const user = currentUser();

  const orders = getJSON(STORAGE.orders, [])
    .filter(order => order.user === user);

  if (!orders.length) {
    box.innerHTML = `<div class="empty">Chưa có đơn hàng.</div>`;
    return;
  }

  box.innerHTML = orders.map(order => `
    <div class="transaction">
      <div>
        <strong>${escapeHTML(order.id)}</strong>
        <small>${escapeHTML(order.date)}</small>
      </div>

      <div>
        <strong>${money(order.total)}</strong>
        <small class="plus">${escapeHTML(order.status)}</small>
      </div>
    </div>
  `).join("");
}

/* =========================
   WALLET
========================= */

function initWallet() {
  const balanceElement = document.getElementById("walletBalance");

  if (balanceElement) {
    balanceElement.textContent = money(
      Number(localStorage.getItem(STORAGE.balance) || 100000)
    );
  }

  const addMoney = document.getElementById("addDemoMoney");

  if (addMoney) {
    addMoney.addEventListener("click", () => {
      if (!currentUser()) {
        toast("Hãy đăng nhập trước");
        return;
      }

      const oldBalance =
        Number(localStorage.getItem(STORAGE.balance) || 0);

      const newBalance = oldBalance + 100000;

      localStorage.setItem(
        STORAGE.balance,
        String(newBalance)
      );

      toast("Đã cộng 100.000$ demo");

      setTimeout(() => location.reload(), 400);
    });
  }
}

/* =========================
   CHAT
========================= */

function initChat() {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");

  if (!form || !input || !messages) return;

  function render() {
    const data = getJSON(STORAGE.chat, [
      {
        user: "TUAN4422",
        text: "Chào mừng đến với TUAN4422 MARKET.",
        me: false
      }
    ]);

    messages.innerHTML = data.map(message => `
      <div class="message ${message.me ? "me" : ""}">
        <div class="message-bubble">
          ${escapeHTML(message.text)}
        </div>
        <small>${escapeHTML(message.user)}</small>
      </div>
    `).join("");

    messages.scrollTop = messages.scrollHeight;
  }

  render();

  form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    const data = getJSON(STORAGE.chat, []);

    data.push({
      user: currentUser() || "Khách",
      text,
      me: true
    });

    setJSON(STORAGE.chat, data);

    input.value = "";
    render();
  });
}

/* =========================
   FORUM
========================= */

function initForum() {
  const form = document.getElementById("forumForm");
  const titleInput = document.getElementById("forumTitle");
  const contentInput = document.getElementById("forumContent");
  const list = document.getElementById("forumList");

  if (!form || !list) return;

  function render() {
    const posts = getJSON(STORAGE.forum, [
      {
        title: "Chào mừng đến diễn đàn",
        content: "Khu vực trao đổi của TUAN4422 MARKET.",
        user: "TUAN4422"
      }
    ]);

    list.innerHTML = posts.map(post => `
      <article class="forum-post">
        <div class="forum-icon">FOR</div>

        <div class="forum-post-content">
          <h3>${escapeHTML(post.title)}</h3>
          <p>${escapeHTML(post.content)}</p>
          <span class="post-meta">
            Bởi ${escapeHTML(post.user)}
          </span>
        </div>
      </article>
    `).join("");
  }

  render();

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!titleInput.value.trim() || !contentInput.value.trim()) {
      toast("Vui lòng nhập đầy đủ");
      return;
    }

    const posts = getJSON(STORAGE.forum, []);

    posts.unshift({
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      user: currentUser() || "Khách"
    });

    setJSON(STORAGE.forum, posts);

    titleInput.value = "";
    contentInput.value = "";

    render();
    toast("Đã đăng bài");
  });
}

/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCart();
  initShop();
  initAccount();
  initWallet();
  initChat();
  initForum();
});
