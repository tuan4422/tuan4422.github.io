"use strict";

/* =========================================================
   TUAN4422 MARKET
   Account + Cart + Wallet + Orders + Favorites
   ========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


/* =========================================================
   STORAGE
   ========================================================= */

const KEYS = {
  cart: "tuan4422_cart",
  users: "tuan4422_users",
  currentUser: "tuan4422_current_user",
  balance: "tuan4422_balance",
  orders: "tuan4422_orders",
  favorites: "tuan4422_favorites",
  theme: "tuan4422_theme",
  chat: "tuan4422_chat",
  forum: "tuan4422_forum"
};


function readStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return fallback;
    }

    return JSON.parse(data);

  } catch {
    return fallback;
  }
}


function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [

  {
    id: "script-ui",
    name: "Script UI Demo",
    type: "script",
    price: 49000,
    icon: "</>",
    badge: "HOT",
    description:
      "Script giao diện demo dành cho các dự án hợp pháp."
  },

  {
    id: "script-tool",
    name: "Script Utility",
    type: "script",
    price: 69000,
    icon: "⚙",
    badge: "NEW",
    description:
      "Bộ tiện ích script demo có giao diện dễ sử dụng."
  },

  {
    id: "account-demo",
    name: "Tài khoản Demo",
    type: "account",
    price: 39000,
    icon: "👤",
    badge: "DEMO",
    description:
      "Tài khoản demo phục vụ kiểm thử hệ thống."
  },

  {
    id: "minecraft-pack",
    name: "Minecraft Setup Pack",
    type: "script",
    price: 79000,
    icon: "MC",
    badge: "HOT",
    description:
      "Bộ file cấu hình mẫu cho dự án Minecraft."
  }

];


function findProduct(id) {
  return PRODUCTS.find(product => product.id === id);
}


function formatMoney(number) {
  return Number(number || 0).toLocaleString("vi-VN") + "$";
}


function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function toast(message) {

  const element = $("#toast");

  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2400);
}


/* =========================================================
   THEME
   ========================================================= */

function updateTheme() {

  const button = $("#themeBtn");

  const light =
    localStorage.getItem(KEYS.theme) === "light";

  document.body.classList.toggle("light", light);

  if (button) {
    button.textContent = light ? "☀" : "☾";
  }
}


function initTheme() {

  updateTheme();

  const button = $("#themeBtn");

  if (!button) return;

  button.addEventListener("click", () => {

    const light =
      !document.body.classList.contains("light");

    document.body.classList.toggle("light", light);

    localStorage.setItem(
      KEYS.theme,
      light ? "light" : "dark"
    );

    updateTheme();
  });
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initMenu() {

  const nav = $("#nav");
  const menu = $("#menuBtn");

  if (!nav || !menu) return;

  menu.addEventListener("click", event => {

    event.stopPropagation();

    nav.classList.toggle("open");

  });


  $$("nav a").forEach(link => {

    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });

  });


  document.addEventListener("click", event => {

    if (!nav.classList.contains("open")) {
      return;
    }

    if (
      !nav.contains(event.target) &&
      event.target !== menu
    ) {
      nav.classList.remove("open");
    }

  });

}


/* =========================================================
   CART
   ========================================================= */

let lastFocusedElement = null;


function getCart() {
  return readStorage(KEYS.cart, []);
}


function saveCart(cart) {
  writeStorage(KEYS.cart, cart);
}


function getCartCount() {

  return getCart().reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

}


function updateCartCount() {

  const count = $("#cartCount");

  if (!count) return;

  count.textContent = getCartCount();

}


function addToCart(productId, quantity = 1) {

  const product = findProduct(productId);

  if (!product) return;

  const cart = getCart();

  const existing = cart.find(
    item => item.id === productId
  );


  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({
      id: productId,
      quantity
    });

  }


  saveCart(cart);

  updateCartCount();

  toast("Đã thêm vào giỏ hàng");

}


function removeFromCart(productId) {

  const cart = getCart().filter(
    item => item.id !== productId
  );

  saveCart(cart);

  renderCart();

  updateCartCount();

}


function changeCartQuantity(productId, amount) {

  const cart = getCart();

  const item = cart.find(
    item => item.id === productId
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {

    const newCart = cart.filter(
      item => item.id !== productId
    );

    saveCart(newCart);

  } else {

    saveCart(cart);

  }

  renderCart();

  updateCartCount();

}


function getCartTotal() {

  return getCart().reduce((total, item) => {

    const product = findProduct(item.id);

    if (!product) return total;

    return total + product.price * item.quantity;

  }, 0);

}


function renderCart() {

  const container = $("#cartItems");
  const totalElement = $("#cartTotal");
  const checkout = $("#checkoutBtn");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {

    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🛒</div>
        <h3>Giỏ hàng trống</h3>
        <p>Hãy thêm sản phẩm từ Shop.</p>
        <a href="shop.html" class="btn primary">
          Đi đến Shop
        </a>
      </div>
    `;

  } else {

    container.innerHTML = cart.map(item => {

      const product = findProduct(item.id);

      if (!product) return "";

      return `
        <div class="cart-item">

          <div class="cart-item-icon">
            ${escapeHTML(product.icon)}
          </div>

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(product.name)}
            </strong>

            <span>
              ${formatMoney(product.price)}
            </span>

            <div class="quantity-control">

              <button
                class="quantity-btn"
                data-cart-minus="${product.id}"
              >
                −
              </button>

              <span>${item.quantity}</span>

              <button
                class="quantity-btn"
                data-cart-plus="${product.id}"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="remove-cart"
            data-cart-remove="${product.id}"
            aria-label="Xóa"
          >
            ×
          </button>

        </div>
      `;

    }).join("");

  }


  if (totalElement) {
    totalElement.textContent =
      formatMoney(getCartTotal());
  }


  if (checkout) {
    checkout.disabled = cart.length === 0;
  }

}


function openCart() {

  const modal = $("#cartModal");

  if (!modal) return;

  lastFocusedElement = document.activeElement;

  renderCart();

  modal.classList.add("show");

  modal.setAttribute("aria-hidden", "false");

  document.documentElement.classList.add("modal-open");

  document.body.classList.add("modal-open");

}


function closeCart() {

  const modal = $("#cartModal");

  if (!modal) return;

  modal.classList.remove("show");

  modal.setAttribute("aria-hidden", "true");

  document.documentElement.classList.remove("modal-open");

  document.body.classList.remove("modal-open");


  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus === "function"
  ) {

    try {
      lastFocusedElement.focus();
    } catch {}

  }

}


function initCart() {

  const cartButton = $("#cartBtn");
  const modal = $("#cartModal");

  if (cartButton) {

    cartButton.addEventListener("click", event => {

      event.preventDefault();

      openCart();

    });

  }


  if (modal) {

    modal.addEventListener("click", event => {

      if (event.target === modal) {
        closeCart();
      }

    });


    modal.addEventListener("click", event => {

      const closeButton =
        event.target.closest("[data-close-cart]");

      if (closeButton) {
        closeCart();
      }

    });


    modal.addEventListener("click", event => {

      const plus =
        event.target.closest("[data-cart-plus]");

      const minus =
        event.target.closest("[data-cart-minus]");

      const remove =
        event.target.closest("[data-cart-remove]");


      if (plus) {

        changeCartQuantity(
          plus.dataset.cartPlus,
          1
        );

      }


      if (minus) {

        changeCartQuantity(
          minus.dataset.cartMinus,
          -1
        );

      }


      if (remove) {

        removeFromCart(
          remove.dataset.cartRemove
        );

      }

    });

  }


  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("show")
    ) {

      closeCart();

    }

  });


  updateCartCount();

  renderCart();

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

  const cart = getCart();

  if (!cart.length) {

    toast("Giỏ hàng đang trống");

    return;

  }


  const total = getCartTotal();

  const balance =
    Number(localStorage.getItem(KEYS.balance) || 100000);


  if (balance < total) {

    toast("Số dư không đủ. Hãy vào Ví để nạp demo.");

    setTimeout(() => {
      window.location.href = "wallet.html";
    }, 800);

    return;

  }


  const currentUser =
    localStorage.getItem(KEYS.currentUser);


  if (!currentUser) {

    toast("Hãy đăng nhập trước khi thanh toán");

    setTimeout(() => {
      closeCart();
      window.location.href = "account.html";
    }, 800);

    return;

  }


  const orders =
    readStorage(KEYS.orders, []);


  const orderItems = cart.map(item => {

    const product = findProduct(item.id);

    return {
      id: item.id,
      name: product ? product.name : "Sản phẩm",
      price: product ? product.price : 0,
      quantity: item.quantity
    };

  });


  const order = {

    id:
      "TUAN-" +
      Date.now().toString().slice(-8),

    username: currentUser,

    items: orderItems,

    total,

    status: "Đã đặt",

    createdAt:
      new Date().toLocaleString("vi-VN")

  };


  orders.unshift(order);

  writeStorage(KEYS.orders, orders);


  localStorage.setItem(
    KEYS.balance,
    String(balance - total)
  );


  saveCart([]);

  updateCartCount();

  renderCart();

  closeCart();

  toast(
    `Đặt hàng thành công: ${order.id}`
  );

}


function initCheckout() {

  const button = $("#checkoutBtn");

  if (!button) return;

  button.addEventListener(
    "click",
    checkout
  );

}


/* =========================================================
   SHOP
   ========================================================= */

function renderProducts() {

  const grid = $("#productGrid");

  if (!grid) return;


  grid.innerHTML = PRODUCTS.map(product => {

    return `
      <article class="product">

        <div class="product-top">

          <span class="product-badge">
            ${escapeHTML(product.badge)}
          </span>

          <button
            class="favorite-btn"
            data-favorite="${product.id}"
            aria-label="Yêu thích"
          >
            ${isFavorite(product.id) ? "♥" : "♡"}
          </button>

        </div>

        <button
          class="product-icon"
          data-product-detail="${product.id}"
        >
          ${escapeHTML(product.icon)}
        </button>

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-bottom">

          <strong class="price">
            ${formatMoney(product.price)}
          </strong>

          <div class="product-buttons">

            <button
              class="small-btn"
              data-product-detail="${product.id}"
            >
              Xem
            </button>

            <button
              class="small-btn buy-btn"
              data-add-cart="${product.id}"
            >
              Thêm
            </button>

          </div>

        </div>

      </article>
    `;

  }).join("");


  $$("#productGrid [data-add-cart]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {
          addToCart(button.dataset.addCart);
        }
      );

    });


  $$("#productGrid [data-product-detail]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {
          openProduct(button.dataset.productDetail);
        }
      );

    });


  $$("#productGrid [data-favorite]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          toggleFavorite(
            button.dataset.favorite
          );

          renderProducts();

        }
      );

    });

}


function openProduct(id) {

  const product = findProduct(id);

  const modal = $("#productModal");

  const detail = $("#productDetail");

  if (!product || !modal || !detail) {
    return;
  }


  detail.innerHTML = `

    <div class="detail-icon">
      ${escapeHTML(product.icon)}
    </div>

    <span class="badge">
      ${escapeHTML(product.badge)}
    </span>

    <h2 class="detail-title">
      ${escapeHTML(product.name)}
    </h2>

    <p class="detail-description">
      ${escapeHTML(product.description)}
    </p>

    <strong class="detail-price">
      ${formatMoney(product.price)}
    </strong>

    <div class="detail-actions">

      <button
        class="btn primary"
        data-detail-add="${product.id}"
      >
        🛒 Thêm vào giỏ
      </button>

      <button
        class="btn secondary"
        data-detail-close
      >
        Đóng
      </button>

    </div>

  `;


  modal.classList.add("show");

  modal.setAttribute("aria-hidden", "false");


  const addButton =
    detail.querySelector("[data-detail-add]");

  addButton?.addEventListener(
    "click",
    () => {

      addToCart(product.id);

      closeProduct();

    }
  );


  detail
    .querySelector("[data-detail-close]")
    ?.addEventListener(
      "click",
      closeProduct
    );

}


function closeProduct() {

  const modal = $("#productModal");

  if (!modal) return;

  modal.classList.remove("show");

  modal.setAttribute("aria-hidden", "true");

}


function initProductModal() {

  const modal = $("#productModal");

  if (!modal) return;

  modal.addEventListener("click", event => {

    if (event.target === modal) {
      closeProduct();
    }

  });


  modal
    .querySelector("[data-close-product]")
    ?.addEventListener(
      "click",
      closeProduct
    );


  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      modal.classList.contains("show")
    ) {

      closeProduct();

    }

  });

}


function initShopSearch() {

  const input = $("#searchInput");

  const grid = $("#productGrid");

  if (!input || !grid) return;


  input.addEventListener("input", () => {

    const query =
      input.value.trim().toLowerCase();


    const products =
      PRODUCTS.filter(product => {

        return (
          product.name.toLowerCase().includes(query) ||
          product.description
            .toLowerCase()
            .includes(query)
        );

      });


    grid.innerHTML =
      products.map(product => {

        return `
          <article class="product">

            <div class="product-top">

              <span class="product-badge">
                ${escapeHTML(product.badge)}
              </span>

            </div>

            <button
              class="product-icon"
              data-product-detail="${product.id}"
            >
              ${escapeHTML(product.icon)}
            </button>

            <h3>${escapeHTML(product.name)}</h3>

            <p class="product-description">
              ${escapeHTML(product.description)}
            </p>

            <div class="product-bottom">

              <strong class="price">
                ${formatMoney(product.price)}
              </strong>

              <button
                class="small-btn buy-btn"
                data-add-cart="${product.id}"
              >
                Thêm
              </button>

            </div>

          </article>
        `;

      }).join("");


    $$("#productGrid [data-add-cart]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => addToCart(button.dataset.addCart)
        );

      });


    $$("#productGrid [data-product-detail]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => openProduct(button.dataset.productDetail)
        );

      });

  });

}


/* =========================================================
   FAVORITES
   ========================================================= */

function getFavorites() {
  return readStorage(KEYS.favorites, []);
}


function saveFavorites(items) {
  writeStorage(KEYS.favorites, items);
}


function isFavorite(id) {
  return getFavorites().includes(id);
}


function toggleFavorite(id) {

  const favorites = getFavorites();

  const index = favorites.indexOf(id);


  if (index >= 0) {

    favorites.splice(index, 1);

    toast("Đã bỏ khỏi yêu thích");

  } else {

    favorites.push(id);

    toast("Đã thêm vào yêu thích");

  }


  saveFavorites(favorites);

}


function renderFavorites() {

  const container = $("#favoriteList");

  if (!container) return;


  const favorites = getFavorites();

  const products =
    favorites
      .map(findProduct)
      .filter(Boolean);


  if (!products.length) {

    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">♡</div>
        <h3>Chưa có sản phẩm yêu thích</h3>
        <p>Hãy vào Shop và thêm sản phẩm.</p>
        <a href="shop.html" class="btn primary">
          Mở Shop
        </a>
      </div>
    `;

    return;

  }


  container.innerHTML =
    products.map(product => {

      return `
        <div class="favorite-item">

          <div class="favorite-icon">
            ${escapeHTML(product.icon)}
          </div>

          <div>
            <strong>
              ${escapeHTML(product.name)}
            </strong>

            <p>
              ${formatMoney(product.price)}
            </p>
          </div>

          <button
            class="small-btn buy-btn"
            data-favorite-add="${product.id}"
          >
            Thêm giỏ
          </button>

        </div>
      `;

    }).join("");


  $$("[data-favorite-add]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => addToCart(button.dataset.favoriteAdd)
      );

    });

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function getUsers() {
  return readStorage(KEYS.users, []);
}


function saveUsers(users) {
  writeStorage(KEYS.users, users);
}


function getCurrentUser() {
  return localStorage.getItem(KEYS.currentUser);
}


function initAuthTabs() {

  const loginTab = $("#loginTab");
  const registerTab = $("#registerTab");

  const loginForm = $("#loginForm");
  const registerForm = $("#registerForm");

  if (
    !loginTab ||
    !registerTab ||
    !loginForm ||
    !registerForm
  ) {
    return;
  }


  loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

  });


  registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

  });

}


function initRegister() {

  const form = $("#registerForm");

  if (!form) return;


  form.addEventListener("submit", event => {

    event.preventDefault();


    const username =
      $("#registerUsername").value.trim();

    const password =
      $("#registerPassword").value;

    const password2 =
      $("#registerPassword2").value;


    if (username.length < 3) {

      toast("Tên tài khoản phải có ít nhất 3 ký tự");

      return;

    }


    if (password.length < 4) {

      toast("Mật khẩu phải có ít nhất 4 ký tự");

      return;

    }


    if (password !== password2) {

      toast("Mật khẩu nhập lại không khớp");

      return;

    }


    const users = getUsers();


    const exists = users.some(
      user =>
        user.username.toLowerCase() ===
        username.toLowerCase()
    );


    if (exists) {

      toast("Tên tài khoản đã tồn tại");

      return;

    }


    users.push({

      username,
      password,
      displayName: username,
      createdAt:
        new Date().toLocaleString("vi-VN")

    });


    saveUsers(users);


    localStorage.setItem(
      KEYS.currentUser,
      username
    );


    localStorage.setItem(
      KEYS.balance,
      "100000"
    );


    toast("Tạo tài khoản thành công");

    setTimeout(() => {
      renderAccount();
    }, 500);

  });

}


function initLogin() {

  const form = $("#loginForm");

  if (!form) return;


  form.addEventListener("submit", event => {

    event.preventDefault();


    const username =
      $("#loginUsername").value.trim();

    const password =
      $("#loginPassword").value;


    const users = getUsers();


    const user = users.find(
      item =>
        item.username.toLowerCase() ===
        username.toLowerCase() &&
        item.password === password
    );


    if (!user) {

      toast("Sai tài khoản hoặc mật khẩu");

      return;

    }


    localStorage.setItem(
      KEYS.currentUser,
      user.username
    );


    if (
      localStorage.getItem(KEYS.balance) === null
    ) {

      localStorage.setItem(
        KEYS.balance,
        "100000"
      );

    }


    toast("Đăng nhập thành công");

    setTimeout(() => {
      renderAccount();
    }, 500);

  });

}


function logout() {

  localStorage.removeItem(
    KEYS.currentUser
  );

  toast("Đã đăng xuất");

  setTimeout(() => {
    renderAccount();
  }, 500);

}


function getUserData() {

  const username = getCurrentUser();

  if (!username) return null;


  const users = getUsers();


  return users.find(
    user => user.username === username
  ) || null;

}


function renderAccount() {

  const authSection = $("#authSection");
  const profileSection = $("#profileSection");

  if (!authSection || !profileSection) {
    return;
  }


  const user = getUserData();


  if (!user) {

    authSection.classList.remove("hidden");
    profileSection.classList.add("hidden");

    return;

  }


  authSection.classList.add("hidden");
  profileSection.classList.remove("hidden");


  const username =
    $("#profileUsername");

  const avatar =
    $("#profileAvatar");

  const balance =
    $("#accountBalance");

  const displayName =
    $("#displayName");


  if (username) {
    username.textContent =
      user.displayName || user.username;
  }


  if (avatar) {

    avatar.textContent =
      (
        user.displayName ||
        user.username ||
        "T"
      )
      .charAt(0)
      .toUpperCase();

  }


  if (displayName) {
    displayName.value =
      user.displayName || user.username;
  }


  if (balance) {

    balance.textContent =
      formatMoney(
        Number(
          localStorage.getItem(
            KEYS.balance
          ) || 100000
        )
      );

  }


  renderOrders();
  renderFavorites();


  $("#logoutBtn")?.addEventListener(
    "click",
    logout
  );

}


function initProfileForm() {

  const form = $("#profileForm");

  if (!form) return;


  form.addEventListener("submit", event => {

    event.preventDefault();


    const user = getUserData();

    if (!user) return;


    const name =
      $("#displayName").value.trim();


    if (name.length < 2) {

      toast("Tên hiển thị quá ngắn");

      return;

    }


    const users = getUsers();


    const target =
      users.find(
        item =>
          item.username === user.username
      );


    if (target) {
      target.displayName = name;
    }


    saveUsers(users);

    renderAccount();

    toast("Đã lưu thông tin");

  });

}


/* =========================================================
   ORDERS
   ========================================================= */

function renderOrders() {

  const container = $("#accountOrders");

  if (!container) return;


  const username = getCurrentUser();


  if (!username) return;


  const orders =
    readStorage(KEYS.orders, [])
      .filter(
        order => order.username === username
      );


  if (!orders.length) {

    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📦</div>
        <h3>Chưa có đơn hàng</h3>
        <p>Các đơn hàng của bạn sẽ xuất hiện ở đây.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    orders.map(order => {

      const items =
        order.items
          .map(
            item =>
              `${escapeHTML(item.name)} × ${item.quantity}`
          )
          .join(", ");


      return `
        <div class="order-box">

          <div class="order-header">

            <div>
              <strong>${escapeHTML(order.id)}</strong>
              <span>${escapeHTML(order.createdAt)}</span>
            </div>

            <span class="order-status">
              ${escapeHTML(order.status)}
            </span>

          </div>

          <p>
            ${items}
          </p>

          <strong>
            Tổng: ${formatMoney(order.total)}
          </strong>

        </div>
      `;

    }).join("");

}


/* =========================================================
   WALLET
   ========================================================= */

function getBalance() {

  return Number(
    localStorage.getItem(
      KEYS.balance
    ) || 100000
  );

}


function setBalance(value) {

  localStorage.setItem(
    KEYS.balance,
    String(Math.max(0, value))
  );

}


function demoTopup(amount) {

  if (!getCurrentUser()) {

    toast("Hãy đăng nhập trước");

    setTimeout(() => {
      window.location.href =
        "account.html";
    }, 700);

    return;

  }


  setBalance(
    getBalance() + amount
  );


  const transactions =
    readStorage(
      "tuan4422_transactions",
      []
    );


  transactions.unshift({

    type: "Nạp demo",

    amount,

    createdAt:
      new Date().toLocaleString("vi-VN")

  });


  writeStorage(
    "tuan4422_transactions",
    transactions
  );


  renderWallet();

  toast(
    `Đã cộng ${formatMoney(amount)} vào ví demo`
  );

}


function renderWallet() {

  const balance =
    $("#walletBalance");

  if (!balance) return;


  balance.textContent =
    formatMoney(getBalance());


  const transactions =
    readStorage(
      "tuan4422_transactions",
      []
    );


  const container =
    $("#transactions");


  if (!container) return;


  if (!transactions.length) {

    container.innerHTML = `
      <div class="empty">
        Chưa có giao dịch.
      </div>
    `;

    return;

  }


  container.innerHTML =
    transactions
      .slice(0, 20)
      .map(transaction => {

        return `
          <div class="transaction">

            <div>
              <strong>
                ${escapeHTML(transaction.type)}
              </strong>

              <span>
                ${escapeHTML(transaction.createdAt)}
              </span>
            </div>

            <strong class="green">
              +${formatMoney(transaction.amount)}
            </strong>

          </div>
        `;

      })
      .join("");

}


function initWallet() {

  $$("[data-topup]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          demoTopup(
            Number(button.dataset.topup)
          );

        }
      );

    });


  renderWallet();

}


/* =========================================================
   CHAT DEMO
   ========================================================= */

function initChat() {

  const messages =
    $("#chatMessages");

  const input =
    $("#chatInput");

  const send =
    $("#sendChatBtn");


  if (!messages || !input || !send) {
    return;
  }


  let chat =
    readStorage(KEYS.chat, []);


  function render() {

    if (!chat.length) {

      messages.innerHTML = `
        <div class="empty">
          Chưa có tin nhắn.
        </div>
      `;

      return;

    }


    messages.innerHTML =
      chat.map(message => {

        return `
          <div class="message">

            <div class="avatar">
              ${escapeHTML(
                message.name.charAt(0)
              )}
            </div>

            <div>

              <strong>
                ${escapeHTML(message.name)}
              </strong>

              <p>
                ${escapeHTML(message.text)}
              </p>

              <small>
                ${escapeHTML(message.time)}
              </small>

            </div>

          </div>
        `;

      }).join("");


    messages.scrollTop =
      messages.scrollHeight;

  }


  function sendMessage() {

    const text =
      input.value.trim();


    if (!text) return;


    const username =
      getCurrentUser() || "Khách";


    chat.push({

      name: username,

      text,

      time:
        new Date().toLocaleTimeString(
          "vi-VN",
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        )

    });


    chat =
      chat.slice(-100);


    writeStorage(
      KEYS.chat,
      chat
    );


    input.value = "";

    render();

  }


  send.addEventListener(
    "click",
    sendMessage
  );


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );


  render();

}


/* =========================================================
   FORUM
   ========================================================= */

function initForum() {

  const form =
    $("#forumForm");

  const list =
    $("#forumList");


  if (!form || !list) {
    return;
  }


  let posts =
    readStorage(KEYS.forum, []);


  function render() {

    if (!posts.length) {

      list.innerHTML = `
        <div class="empty">
          Chưa có bài viết.
        </div>
      `;

      return;

    }


    list.innerHTML =
      posts.map(post => {

        return `
          <article class="forum-post">

            <div class="forum-icon">
              💬
            </div>

            <div>

              <h3>
                ${escapeHTML(post.title)}
              </h3>

              <p>
                ${escapeHTML(post.content)}
              </p>

              <div class="post-meta">
                ${escapeHTML(post.author)}
                ·
                ${escapeHTML(post.time)}
              </div>

            </div>

          </article>
        `;

      }).join("");

  }


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const title =
        $("#forumTitle").value.trim();

      const content =
        $("#forumContent").value.trim();


      if (!title || !content) {

        toast("Hãy nhập đầy đủ nội dung");

        return;

      }


      posts.unshift({

        title,

        content,

        author:
          getCurrentUser() || "Khách",

        time:
          new Date().toLocaleString("vi-VN")

      });


      posts =
        posts.slice(0, 100);


      writeStorage(
        KEYS.forum,
        posts
      );


      form.reset();

      render();

      toast("Đã đăng bài");

    }
  );


  render();

}


/* =========================================================
   SERVER COPY
   ========================================================= */

function initServer() {

  $$("[data-copy-server]")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          const ip =
            button.dataset.copyServer;


          if (!ip || ip === "CHƯA CẬP NHẬT") {

            toast("Bạn chưa cập nhật IP server");

            return;

          }


          try {

            await navigator.clipboard.writeText(ip);

            toast("Đã sao chép IP");

          } catch {

            toast("Không thể sao chép");

          }

        }
      );

    });

}


/* =========================================================
   YEAR
   ========================================================= */

function initYear() {

  const year = $("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initTheme();

    initMenu();

    initCart();

    initCheckout();

    initProductModal();

    renderProducts();

    initShopSearch();

    initAuthTabs();

    initRegister();

    initLogin();

    initProfileForm();

    renderAccount();

    initWallet();

    initChat();

    initForum();

    initServer();

    initYear();

    updateCartCount();

  }
);
