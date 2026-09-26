"use strict";

/* ==========================================
   TUAN4422 MARKET
   FRONTEND DEMO
========================================== */

const STORAGE = {
  products: "tuan4422_products",
  cart: "tuan4422_cart",
  users: "tuan4422_users",
  currentUser: "tuan4422_current_user",
  balance: "tuan4422_balance",
  orders: "tuan4422_orders",
  favorites: "tuan4422_favorites",
  chat: "tuan4422_chat",
  forum: "tuan4422_forum",
  admin: "tuan4422_admin"
};


/* ==========================================
   DEFAULT PRODUCTS
========================================== */

const DEFAULT_PRODUCTS = [
  {
    id: "script-ui",
    name: "Script UI Demo",
    type: "Script",
    icon: "UI",
    price: 49000,
    description:
      "Bộ giao diện script mẫu, phù hợp cho mục đích học tập và phát triển."
  },

  {
    id: "script-tool",
    name: "Script Utility",
    type: "Script",
    icon: "JS",
    price: 69000,
    description:
      "Bộ công cụ script demo với giao diện đơn giản, dễ tùy chỉnh."
  },

  {
    id: "account-demo",
    name: "Tài khoản Demo",
    type: "Account",
    icon: "ACC",
    price: 39000,
    description:
      "Tài khoản mẫu dùng để kiểm thử hệ thống."
  },

  {
    id: "minecraft-pack",
    name: "Minecraft Setup Pack",
    type: "Minecraft",
    icon: "MC",
    price: 79000,
    description:
      "Bộ thiết lập mẫu dành cho server Minecraft cá nhân."
  },

  {
    id: "web-template",
    name: "Website Template",
    type: "Script",
    icon: "WEB",
    price: 59000,
    description:
      "Mẫu website hiện đại dành cho dự án cá nhân."
  },

  {
    id: "config-pack",
    name: "Config Pack",
    type: "Minecraft",
    icon: "CFG",
    price: 29000,
    description:
      "Bộ cấu hình mẫu giúp bắt đầu dự án Minecraft."
  }
];


/* ==========================================
   HELPERS
========================================== */

function getJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);

  } catch {
    return fallback;
  }
}


function setJSON(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}


function money(value) {
  return Number(value || 0)
    .toLocaleString("vi-VN") + "$";
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

  let element =
    document.getElementById("toast");

  if (!element) {

    element =
      document.createElement("div");

    element.id = "toast";

    document.body.appendChild(element);
  }

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer =
    setTimeout(() => {

      element.classList.remove("show");

    }, 2200);
}


function getProducts() {

  let products =
    getJSON(
      STORAGE.products,
      null
    );

  if (!products) {

    products =
      DEFAULT_PRODUCTS;

    setJSON(
      STORAGE.products,
      products
    );
  }

  return products;
}


function currentUser() {

  return localStorage.getItem(
    STORAGE.currentUser
  ) || "";
}


/* ==========================================
   NAVIGATION
========================================== */

function initNavigation() {

  const menu =
    document.getElementById("mainNav");

  const button =
    document.getElementById("menuBtn");

  if (!menu || !button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {

      menu.classList.toggle(
        "open"
      );

    }
  );

  document.addEventListener(
    "click",
    event => {

      if (
        menu.classList.contains("open") &&
        !menu.contains(event.target) &&
        !button.contains(event.target)
      ) {

        menu.classList.remove(
          "open"
        );

      }

    }
  );

  const page =
    document.body.dataset.page;

  document
    .querySelectorAll(
      ".main-nav a[data-page]"
    )
    .forEach(link => {

      if (
        link.dataset.page === page
      ) {

        link.classList.add(
          "active"
        );

      }

    });
}


/* ==========================================
   CART
========================================== */

function getCart() {

  return getJSON(
    STORAGE.cart,
    []
  );
}


function saveCart(cart) {

  setJSON(
    STORAGE.cart,
    cart
  );

  updateCartCount();
}


function updateCartCount() {

  const cart =
    getCart();

  const count =
    cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  document
    .querySelectorAll("#cartCount")
    .forEach(element => {

      element.textContent =
        count;

    });
}


function cartTotal() {

  const cart =
    getCart();

  const products =
    getProducts();

  return cart.reduce(
    (total, item) => {

      const product =
        products.find(
          p => p.id === item.id
        );

      if (!product) {
        return total;
      }

      return total +
        product.price *
        item.quantity;

    },
    0
  );
}


function addToCart(id) {

  const product =
    getProducts().find(
      item => item.id === id
    );

  if (!product) {
    return;
  }

  const cart =
    getCart();

  const existing =
    cart.find(
      item => item.id === id
    );

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      id,
      quantity: 1
    });

  }

  saveCart(cart);

  toast(
    "Đã thêm vào giỏ hàng"
  );
}


function removeFromCart(id) {

  const cart =
    getCart()
      .filter(
        item => item.id !== id
      );

  saveCart(cart);

  renderCart();
}


function changeQuantity(
  id,
  amount
) {

  const cart =
    getCart();

  const item =
    cart.find(
      item => item.id === id
    );

  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {

    const index =
      cart.indexOf(item);

    cart.splice(
      index,
      1
    );

  }

  saveCart(cart);

  renderCart();
}


function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.classList.add(
    "show"
  );

  document.body.classList.add(
    "modal-open"
  );
}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "show"
  );

  if (
    !document.querySelector(
      ".modal.show"
    )
  ) {

    document.body.classList.remove(
      "modal-open"
    );

  }
}


function renderCart() {

  const box =
    document.getElementById(
      "cartItems"
    );

  const total =
    document.getElementById(
      "cartTotal"
    );

  if (!box || !total) {
    return;
  }

  const cart =
    getCart();

  const products =
    getProducts();

  if (!cart.length) {

    box.innerHTML = `
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;

    total.textContent =
      money(0);

    return;
  }

  box.innerHTML =
    cart.map(item => {

      const product =
        products.find(
          p => p.id === item.id
        );

      if (!product) {
        return "";
      }

      return `
        <div class="cart-item">

          <div class="cart-item-icon">
            ${escapeHTML(product.icon)}
          </div>

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(product.name)}
            </strong>

            <small>
              ${money(product.price)}
            </small>

            <div
              style="
                display:flex;
                gap:6px;
                align-items:center;
                margin-top:7px;
              "
            >

              <button
                class="btn btn-secondary btn-small"
                data-cart-minus="${product.id}">
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="btn btn-secondary btn-small"
                data-cart-plus="${product.id}">
                +
              </button>

            </div>

          </div>

          <button
            class="remove-item"
            data-cart-remove="${product.id}">
            Xóa
          </button>

        </div>
      `;

    }).join("");

  total.textContent =
    money(cartTotal());
}


function initCart() {

  const cartButton =
    document.getElementById(
      "cartBtn"
    );

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      () => {

        renderCart();

        openModal(
          "cartModal"
        );

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      const close =
        event.target.closest(
          "[data-close-modal]"
        );

      if (close) {

        closeModal(
          close.dataset.closeModal
        );

      }


      const remove =
        event.target.closest(
          "[data-cart-remove]"
        );

      if (remove) {

        removeFromCart(
          remove.dataset.cartRemove
        );

      }


      const minus =
        event.target.closest(
          "[data-cart-minus]"
        );

      if (minus) {

        changeQuantity(
          minus.dataset.cartMinus,
          -1
        );

      }


      const plus =
        event.target.closest(
          "[data-cart-plus]"
        );

      if (plus) {

        changeQuantity(
          plus.dataset.cartPlus,
          1
        );

      }

    }
  );


  document
    .querySelectorAll(".modal")
    .forEach(modal => {

      modal.addEventListener(
        "click",
        event => {

          if (
            event.target === modal
          ) {

            closeModal(
              modal.id
            );

          }

        }
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        document
          .querySelectorAll(
            ".modal.show"
          )
          .forEach(modal => {

            closeModal(
              modal.id
            );

          });

      }

    }
  );


  const checkout =
    document.getElementById(
      "checkoutBtn"
    );

  if (checkout) {

    checkout.addEventListener(
      "click",
      checkoutCart
    );

  }


  updateCartCount();
}


function checkoutCart() {

  const user =
    currentUser();

  if (!user) {

    toast(
      "Bạn cần đăng nhập"
    );

    setTimeout(
      () => {
        location.href =
          "account.html";
      },
      500
    );

    return;
  }

  const cart =
    getCart();

  if (!cart.length) {

    toast(
      "Giỏ hàng đang trống"
    );

    return;
  }

  const total =
    cartTotal();

  const balance =
    Number(
      localStorage.getItem(
        STORAGE.balance
      ) || 0
    );

  if (balance < total) {

    toast(
      "Số dư không đủ"
    );

    return;
  }

  localStorage.setItem(
    STORAGE.balance,
    String(balance - total)
  );


  const orders =
    getJSON(
      STORAGE.orders,
      []
    );


  orders.unshift({

    id:
      "DH" +
      Date.now(),

    user,

    total,

    date:
      new Date()
        .toLocaleString(
          "vi-VN"
        ),

    status:
      "Đã thanh toán"

  });


  setJSON(
    STORAGE.orders,
    orders
  );


  saveCart([]);

  closeModal(
    "cartModal"
  );

  toast(
    "Đặt hàng thành công"
  );
}


/* ==========================================
   SHOP
========================================== */

function renderProducts(
  products = getProducts()
) {

  const grid =
    document.getElementById(
      "productGrid"
    );

  if (!grid) {
    return;
  }


  if (!products.length) {

    grid.innerHTML = `
      <div class="empty">
        Không có sản phẩm.
      </div>
    `;

    return;
  }


  const favorites =
    getJSON(
      STORAGE.favorites,
      []
    );


  grid.innerHTML =
    products.map(product => {

      const liked =
        favorites.includes(
          product.id
        );

      return `
        <article
          class="product-card">

          <div class="product-top">

            <div class="product-icon">
              ${escapeHTML(
                product.icon
              )}
            </div>

            <div class="product-type">
              ${escapeHTML(
                product.type
              )}
            </div>

            <h3>
              ${escapeHTML(
                product.name
              )}
            </h3>

          </div>

          <div class="product-description">

            ${escapeHTML(
              product.description
            )}

          </div>

          <div class="product-bottom">

            <div class="price">
              ${money(
                product.price
              )}
            </div>

            <div
              style="
                display:flex;
                gap:5px;
              "
            >

              <button
                class="btn btn-secondary btn-small"
                data-favorite="${product.id}">
                ${liked ? "♥" : "♡"}
              </button>

              <button
                class="btn btn-secondary btn-small"
                data-product-detail="${product.id}">
                Xem
              </button>

              <button
                class="btn btn-primary btn-small"
                data-add-cart="${product.id}">
                Thêm
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");
}


function toggleFavorite(id) {

  let favorites =
    getJSON(
      STORAGE.favorites,
      []
    );

  if (
    favorites.includes(id)
  ) {

    favorites =
      favorites.filter(
        item => item !== id
      );

    toast(
      "Đã bỏ yêu thích"
    );

  } else {

    favorites.push(id);

    toast(
      "Đã thêm yêu thích"
    );

  }

  setJSON(
    STORAGE.favorites,
    favorites
  );

  renderProducts();
}


function showProductDetail(id) {

  const product =
    getProducts().find(
      item => item.id === id
    );

  if (!product) {
    return;
  }

  const title =
    document.getElementById(
      "detailTitle"
    );

  const content =
    document.getElementById(
      "detailContent"
    );

  if (!title || !content) {
    return;
  }

  title.textContent =
    product.name;

  content.innerHTML = `

    <div
      style="
        display:flex;
        gap:15px;
        align-items:center;
        margin-bottom:20px;
      "
    >

      <div class="product-icon">
        ${escapeHTML(product.icon)}
      </div>

      <div>

        <div
          class="product-type"
          style="margin:0"
        >
          ${escapeHTML(product.type)}
        </div>

        <h2>
          ${escapeHTML(product.name)}
        </h2>

      </div>

    </div>

    <p
      style="
        color:var(--muted);
        margin-bottom:20px;
      "
    >
      ${escapeHTML(
        product.description
      )}
    </p>

    <div
      style="
        font-size:25px;
        font-weight:bold;
        margin-bottom:20px;
      "
    >
      ${money(product.price)}
    </div>

    <button
      class="btn btn-primary"
      data-detail-add="${product.id}">
      Thêm vào giỏ
    </button>

  `;

  openModal(
    "productModal"
  );
}


function initShop() {

  const grid =
    document.getElementById(
      "productGrid"
    );

  if (!grid) {
    return;
  }

  renderProducts();


  const search =
    document.getElementById(
      "productSearch"
    );

  if (search) {

    search.addEventListener(
      "input",
      () => {

        const keyword =
          search.value
            .toLowerCase()
            .trim();

        const products =
          getProducts();

        const result =
          products.filter(
            product =>
              product.name
                .toLowerCase()
                .includes(keyword) ||

              product.type
                .toLowerCase()
                .includes(keyword) ||

              product.description
                .toLowerCase()
                .includes(keyword)
          );

        renderProducts(
          result
        );

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      const add =
        event.target.closest(
          "[data-add-cart]"
        );

      if (add) {

        addToCart(
          add.dataset.addCart
        );

      }


      const favorite =
        event.target.closest(
          "[data-favorite]"
        );

      if (favorite) {

        toggleFavorite(
          favorite.dataset.favorite
        );

      }


      const detail =
        event.target.closest(
          "[data-product-detail]"
        );

      if (detail) {

        showProductDetail(
          detail.dataset.productDetail
        );

      }


      const detailAdd =
        event.target.closest(
          "[data-detail-add]"
        );

      if (detailAdd) {

        addToCart(
          detailAdd.dataset.detailAdd
        );

        closeModal(
          "productModal"
        );

      }

    }
  );
}


/* ==========================================
   ACCOUNT
========================================== */

function initAccount() {

  const login =
    document.getElementById(
      "loginForm"
    );

  const register =
    document.getElementById(
      "registerForm"
    );

  const user =
    currentUser();

  const auth =
    document.getElementById(
      "authAccount"
    );

  const logged =
    document.getElementById(
      "loggedAccount"
    );


  if (
    user &&
    auth &&
    logged
  ) {

    auth.style.display =
      "none";

    logged.style.display =
      "block";


    const name =
      document.getElementById(
        "accountName"
      );

    if (name) {
      name.textContent =
        user;
    }


    const balance =
      document.getElementById(
        "accountBalance"
      );

    if (balance) {

      balance.textContent =
        money(
          Number(
            localStorage.getItem(
              STORAGE.balance
            ) || 100000
          )
        );

    }


    renderOrders();
    renderFavorites();
  }


  if (login) {

    login.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const username =
          document
            .getElementById(
              "loginUsername"
            )
            .value
            .trim();

        const password =
          document
            .getElementById(
              "loginPassword"
            )
            .value;


        const users =
          getJSON(
            STORAGE.users,
            []
          );


        const found =
          users.find(
            user =>
              user.username ===
                username &&
              user.password ===
                password
          );


        if (!found) {

          toast(
            "Sai tài khoản hoặc mật khẩu"
          );

          return;
        }


        localStorage.setItem(
          STORAGE.currentUser,
          username
        );


        if (
          localStorage.getItem(
            STORAGE.balance
          ) === null
        ) {

          localStorage.setItem(
            STORAGE.balance,
            "100000"
          );

        }


        toast(
          "Đăng nhập thành công"
        );


        setTimeout(
          () => location.reload(),
          500
        );

      }
    );

  }


  if (register) {

    register.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const username =
          document
            .getElementById(
              "registerUsername"
            )
            .value
            .trim();

        const password =
          document
            .getElementById(
              "registerPassword"
            )
            .value;


        if (
          username.length < 3 ||
          password.length < 4
        ) {

          toast(
            "Tên tối thiểu 3 ký tự, mật khẩu 4 ký tự"
          );

          return;
        }


        const users =
          getJSON(
            STORAGE.users,
            []
          );


        if (
          users.some(
            user =>
              user.username ===
              username
          )
        ) {

          toast(
            "Tên tài khoản đã tồn tại"
          );

          return;
        }


        users.push({
          username,
          password
        });


        setJSON(
          STORAGE.users,
          users
        );


        localStorage.setItem(
          STORAGE.currentUser,
          username
        );

        localStorage.setItem(
          STORAGE.balance,
          "100000"
        );


        toast(
          "Tạo tài khoản thành công"
        );


        setTimeout(
          () => location.reload(),
          500
        );

      }
    );

  }


  const logout =
    document.getElementById(
      "logoutBtn"
    );

  if (logout) {

    logout.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          STORAGE.currentUser
        );

        location.reload();

      }
    );

  }
}


function renderOrders() {

  const box =
    document.getElementById(
      "orderList"
    );

  if (!box) {
    return;
  }


  const orders =
    getJSON(
      STORAGE.orders,
      []
    ).filter(
      order =>
        order.user ===
        currentUser()
    );


  if (!orders.length) {

    box.innerHTML = `
      <div class="empty">
        Chưa có đơn hàng.
      </div>
    `;

    return;
  }


  box.innerHTML =
    orders.map(
      order => `

        <div class="transaction">

          <div>

            <strong>
              ${escapeHTML(order.id)}
            </strong>

            <small>
              ${escapeHTML(order.date)}
            </small>

          </div>

          <div>

            <strong>
              ${money(order.total)}
            </strong>

            <small class="plus">
              ${escapeHTML(order.status)}
            </small>

          </div>

        </div>

      `
    ).join("");
}


function renderFavorites() {

  const box =
    document.getElementById(
      "favoriteList"
    );

  if (!box) {
    return;
  }


  const favorites =
    getJSON(
      STORAGE.favorites,
      []
    );

  const products =
    getProducts().filter(
      product =>
        favorites.includes(
          product.id
        )
    );


  if (!products.length) {

    box.innerHTML = `
      <div class="empty">
        Chưa có sản phẩm yêu thích.
      </div>
    `;

    return;
  }


  box.innerHTML =
    products.map(
      product => `

        <div class="transaction">

          <div>
            <strong>
              ${escapeHTML(
                product.name
              )}
            </strong>

            <small>
              ${escapeHTML(
                product.type
              )}
            </small>
          </div>

          <strong>
            ${money(product.price)}
          </strong>

        </div>

      `
    ).join("");
}


/* ==========================================
   WALLET
========================================== */

function initWallet() {

  const balance =
    document.getElementById(
      "walletBalance"
    );

  if (balance) {

    balance.textContent =
      money(
        Number(
          localStorage.getItem(
            STORAGE.balance
          ) || 100000
        )
      );

  }


  const button =
    document.getElementById(
      "addDemoMoney"
    );

  if (button) {

    button.addEventListener(
      "click",
      () => {

        if (!currentUser()) {

          toast(
            "Hãy đăng nhập trước"
          );

          return;
        }


        const old =
          Number(
            localStorage.getItem(
              STORAGE.balance
            ) || 0
          );


        localStorage.setItem(
          STORAGE.balance,
          String(
            old + 100000
          )
        );


        toast(
          "Đã cộng 100.000$ demo"
        );


        setTimeout(
          () => location.reload(),
          400
        );

      }
    );

  }
}


/* ==========================================
   CHAT
========================================== */

function initChat() {

  const form =
    document.getElementById(
      "chatForm"
    );

  const input =
    document.getElementById(
      "chatInput"
    );

  const messages =
    document.getElementById(
      "chatMessages"
    );


  if (
    !form ||
    !input ||
    !messages
  ) {
    return;
  }


  function render() {

    const data =
      getJSON(
        STORAGE.chat,
        [
          {
            user:
              "TUAN4422",

            text:
              "Chào mừng đến với TUAN4422 MARKET.",

            me:
              false
          }
        ]
      );


    messages.innerHTML =
      data.map(
        message => `

          <div
            class="message
            ${message.me ? "me" : ""}"
          >

            <div class="message-bubble">
              ${escapeHTML(
                message.text
              )}
            </div>

            <small>
              ${escapeHTML(
                message.user
              )}
            </small>

          </div>

        `
      ).join("");


    messages.scrollTop =
      messages.scrollHeight;
  }


  render();


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const text =
        input.value.trim();

      if (!text) {
        return;
      }


      const data =
        getJSON(
          STORAGE.chat,
          []
        );


      data.push({

        user:
          currentUser() ||
          "Khách",

        text,

        me:
          true

      });


      setJSON(
        STORAGE.chat,
        data
      );


      input.value = "";

      render();

    }
  );
}


/* ==========================================
   FORUM
========================================== */

function initForum() {

  const form =
    document.getElementById(
      "forumForm"
    );

  const list =
    document.getElementById(
      "forumList"
    );


  if (!form || !list) {
    return;
  }


  const title =
    document.getElementById(
      "forumTitle"
    );

  const content =
    document.getElementById(
      "forumContent"
    );


  function render() {

    const posts =
      getJSON(
        STORAGE.forum,
        [
          {
            title:
              "Chào mừng đến diễn đàn",

            content:
              "Khu vực trao đổi của TUAN4422 MARKET.",

            user:
              "TUAN4422"
          }
        ]
      );


    list.innerHTML =
      posts.map(
        post => `

          <article class="forum-post">

            <div class="forum-icon">
              FOR
            </div>

            <div
              class="forum-post-content">

              <h3>
                ${escapeHTML(
                  post.title
                )}
              </h3>

              <p>
                ${escapeHTML(
                  post.content
                )}
              </p>

              <span class="post-meta">
                Bởi
                ${escapeHTML(
                  post.user
                )}
              </span>

            </div>

          </article>

        `
      ).join("");
  }


  render();


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (
        !title.value.trim() ||
        !content.value.trim()
      ) {

        toast(
          "Vui lòng nhập đầy đủ"
        );

        return;
      }


      const posts =
        getJSON(
          STORAGE.forum,
          []
        );


      posts.unshift({

        title:
          title.value.trim(),

        content:
          content.value.trim(),

        user:
          currentUser() ||
          "Khách"

      });


      setJSON(
        STORAGE.forum,
        posts
      );


      title.value = "";
      content.value = "";


      render();

      toast(
        "Đã đăng bài"
      );

    }
  );
}


/* ==========================================
   ADMIN
========================================== */

function isAdmin() {

  return (
    localStorage.getItem(
      STORAGE.admin
    ) === "true"
  );
}


function initAdmin() {

  const login =
    document.getElementById(
      "adminLoginForm"
    );

  const dashboard =
    document.getElementById(
      "adminDashboard"
    );

  const loginBox =
    document.getElementById(
      "adminLogin"
    );


  if (!dashboard || !loginBox) {
    return;
  }


  if (isAdmin()) {

    loginBox.style.display =
      "none";

    dashboard.style.display =
      "block";

    renderAdmin();

  }


  if (login) {

    login.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const username =
          document.getElementById(
            "adminUsername"
          ).value.trim();


        const password =
          document.getElementById(
            "adminPassword"
          ).value;


        if (
          username === "admin" &&
          password === "tuan4422"
        ) {

          localStorage.setItem(
            STORAGE.admin,
            "true"
          );


          toast(
            "Đăng nhập Admin thành công"
          );


          setTimeout(
            () => location.reload(),
            400
          );

        } else {

          toast(
            "Sai tài khoản Admin"
          );

        }

      }
    );

  }


  const productForm =
    document.getElementById(
      "productForm"
    );

  if (productForm) {

    productForm.addEventListener(
      "submit",
      saveProduct
    );

  }


  const cancel =
    document.getElementById(
      "cancelEditBtn"
    );

  if (cancel) {

    cancel.addEventListener(
      "click",
      cancelProductEdit
    );

  }


  const logout =
    document.getElementById(
      "adminLogout"
    );

  if (logout) {

    logout.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          STORAGE.admin
        );

        location.reload();

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      const edit =
        event.target.closest(
          "[data-admin-edit]"
        );

      if (edit) {

        editProduct(
          edit.dataset.adminEdit
        );

      }


      const remove =
        event.target.closest(
          "[data-admin-delete]"
        );

      if (remove) {

        deleteProduct(
          remove.dataset.adminDelete
        );

      }

    }
  );
}


function renderAdmin() {

  const products =
    getProducts();

  const users =
    getJSON(
      STORAGE.users,
      []
    );

  const orders =
    getJSON(
      STORAGE.orders,
      []
    );


  const productCount =
    document.getElementById(
      "adminProductCount"
    );

  const userCount =
    document.getElementById(
      "adminUserCount"
    );

  const orderCount =
    document.getElementById(
      "adminOrderCount"
    );


  if (productCount) {
    productCount.textContent =
      products.length;
  }

  if (userCount) {
    userCount.textContent =
      users.length;
  }

  if (orderCount) {
    orderCount.textContent =
      orders.length;
  }


  renderAdminProducts();
  renderAdminOrders();
}


function renderAdminProducts() {

  const box =
    document.getElementById(
      "adminProductList"
    );

  if (!box) {
    return;
  }


  const products =
    getProducts();


  if (!products.length) {

    box.innerHTML = `
      <div class="empty">
        Chưa có sản phẩm.
      </div>
    `;

    return;
  }


  box.innerHTML =
    products.map(
      product => `

        <div
          class="admin-product-row">

          <div class="admin-product-icon">
            ${escapeHTML(
              product.icon
            )}
          </div>

          <div
            class="admin-product-info">

            <strong>
              ${escapeHTML(
                product.name
              )}
            </strong>

            <small>
              ${escapeHTML(
                product.type
              )}
              ·
              ${money(
                product.price
              )}
            </small>

          </div>

          <div
            class="admin-product-actions">

            <button
              class="btn btn-secondary btn-small"
              data-admin-edit="${product.id}">
              Sửa
            </button>

            <button
              class="btn btn-danger btn-small"
              data-admin-delete="${product.id}">
              Xóa
            </button>

          </div>

        </div>

      `
    ).join("");
}


function renderAdminOrders() {

  const box =
    document.getElementById(
      "adminOrderList"
    );

  if (!box) {
    return;
  }


  const orders =
    getJSON(
      STORAGE.orders,
      []
    );


  if (!orders.length) {

    box.innerHTML = `
      <div class="empty">
        Chưa có đơn hàng.
      </div>
    `;

    return;
  }


  box.innerHTML =
    orders.map(
      order => `

        <div class="transaction">

          <div>

            <strong>
              ${escapeHTML(
                order.id
              )}
            </strong>

            <small>
              ${escapeHTML(
                order.user
              )}
              ·
              ${escapeHTML(
                order.date
              )}
            </small>

          </div>

          <div>

            <strong>
              ${money(
                order.total
              )}
            </strong>

            <small class="plus">
              ${escapeHTML(
                order.status
              )}
            </small>

          </div>

        </div>

      `
    ).join("");
}


function saveProduct(event) {

  event.preventDefault();


  const id =
    document.getElementById(
      "editProductId"
    ).value;


  const product = {

    id:
      id ||
      "product-" +
      Date.now(),

    name:
      document.getElementById(
        "productName"
      ).value.trim(),

    type:
      document.getElementById(
        "productType"
      ).value,

    icon:
      document.getElementById(
        "productIcon"
      ).value
        .trim()
        .toUpperCase(),

    price:
      Number(
        document.getElementById(
          "productPrice"
        ).value
      ),

    description:
      document.getElementById(
        "productDescription"
      ).value.trim()

  };


  if (
    !product.name ||
    !product.icon ||
    product.price < 0 ||
    !product.description
  ) {

    toast(
      "Vui lòng nhập đầy đủ thông tin"
    );

    return;
  }


  const products =
    getProducts();


  if (id) {

    const index =
      products.findIndex(
        item => item.id === id
      );

    if (index !== -1) {

      products[index] =
        product;

    }

    toast(
      "Đã cập nhật sản phẩm"
    );

  } else {

    products.push(
      product
    );

    toast(
      "Đã thêm sản phẩm"
    );

  }


  setJSON(
    STORAGE.products,
    products
  );


  resetProductForm();

  renderAdmin();

}


function editProduct(id) {

  const product =
    getProducts().find(
      item => item.id === id
    );

  if (!product) {
    return;
  }


  document.getElementById(
    "editProductId"
  ).value =
    product.id;


  document.getElementById(
    "productName"
  ).value =
    product.name;


  document.getElementById(
    "productType"
  ).value =
    product.type;


  document.getElementById(
    "productIcon"
  ).value =
    product.icon;


  document.getElementById(
    "productPrice"
  ).value =
    product.price;


  document.getElementById(
    "productDescription"
  ).value =
    product.description;


  document.getElementById(
    "productFormTitle"
  ).textContent =
    "Sửa sản phẩm";


  document.getElementById(
    "saveProductBtn"
  ).textContent =
    "Lưu thay đổi";


  document.getElementById(
    "cancelEditBtn"
  ).style.display =
    "inline-flex";


  document
    .getElementById(
      "productForm"
    )
    .scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

}


function deleteProduct(id) {

  const products =
    getProducts();


  const product =
    products.find(
      item => item.id === id
    );


  if (!product) {
    return;
  }


  if (
    !confirm(
      `Xóa sản phẩm "${product.name}"?`
    )
  ) {
    return;
  }


  const result =
    products.filter(
      item => item.id !== id
    );


  setJSON(
    STORAGE.products,
    result
  );


  const cart =
    getCart().filter(
      item => item.id !== id
    );


  saveCart(cart);


  renderAdmin();

  toast(
    "Đã xóa sản phẩm"
  );
}


function cancelProductEdit() {
  resetProductForm();
}


function resetProductForm() {

  const form =
    document.getElementById(
      "productForm"
    );

  if (!form) {
    return;
  }


  form.reset();


  document.getElementById(
    "editProductId"
  ).value =
    "";


  document.getElementById(
    "productFormTitle"
  ).textContent =
    "Thêm sản phẩm";


  document.getElementById(
    "saveProductBtn"
  ).textContent =
    "Thêm sản phẩm";


  document.getElementById(
    "cancelEditBtn"
  ).style.display =
    "none";
}


/* ==========================================
   INIT
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Khởi tạo database sản phẩm
      nếu người dùng chưa có.
    */

    getProducts();

    initNavigation();
    initCart();
    initShop();
    initAccount();
    initWallet();
    initChat();
    initForum();
    initAdmin();

  }
);
/* ==============================
   ADMIN MENU
   ============================== */

function updateAdminMenu() {
  const adminMenu = document.getElementById("adminMenu");

  if (!adminMenu) {
    return;
  }

  const isAdmin =
    localStorage.getItem("tuan4422_admin") === "true";

  if (isAdmin) {
    adminMenu.classList.add("is-visible");
  } else {
    adminMenu.classList.remove("is-visible");
  }
}
