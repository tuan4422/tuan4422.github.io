/* =========================================================
   TUAN4422 MARKET
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

function $(selector) {
  return document.querySelector(selector);
}


function getJSON(key, fallback) {

  try {

    const value =
      localStorage.getItem(key);

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


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function formatMoney(number) {

  return Number(number)
    .toLocaleString("vi-VN") + "đ";

}


/* =========================================================
   THEME
========================================================= */

const themeBtn =
  $("#themeBtn");


function loadTheme() {

  const theme =
    localStorage.getItem("theme") || "dark";

  if (theme === "light") {

    document.body.classList.add("light");

    if (themeBtn) {
      themeBtn.textContent = "☀";
    }

  } else {

    document.body.classList.remove("light");

    if (themeBtn) {
      themeBtn.textContent = "☾";
    }

  }

}


loadTheme();


if (themeBtn) {

  themeBtn.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light"
      );

      const light =
        document.body.classList.contains(
          "light"
        );

      localStorage.setItem(
        "theme",
        light ? "light" : "dark"
      );

      themeBtn.textContent =
        light ? "☀" : "☾";

    }
  );

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn =
  $("#menuBtn");

const nav =
  $("#nav");


if (menuBtn && nav) {

  menuBtn.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      nav.classList.toggle("open");

    }
  );


  nav.querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          nav.classList.remove("open");

        }
      );

    });


  document.addEventListener(
    "click",
    event => {

      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        event.target !== menuBtn
      ) {

        nav.classList.remove("open");

      }

    }
  );

}


/* =========================================================
   PRODUCTS
========================================================= */

const PRODUCTS = [

  {
    id: "script-001",

    name: "Script Premium",

    description:
      "Script kỹ thuật số dùng cho mục đích hợp lệ.",

    price: 50000,

    icon: "📜",

    badge: "MỚI"

  },

  {
    id: "script-002",

    name: "Script Pro",

    description:
      "Phiên bản nâng cao với nhiều tính năng.",

    price: 100000,

    icon: "⚡",

    badge: "HOT"

  },

  {
    id: "account-001",

    name: "Tài khoản Demo",

    description:
      "Tài khoản demo hợp lệ để thử nghiệm.",

    price: 30000,

    icon: "👤",

    badge: "DEMO"

  },

  {
    id: "minecraft-001",

    name: "Minecraft Pack",

    description:
      "Gói nội dung Minecraft dành cho server.",

    price: 75000,

    icon: "⛏️",

    badge: "NEW"

  }

];


/* =========================================================
   CART
========================================================= */

let cart =
  getJSON(
    "tuan4422_cart",
    []
  );


function saveCart() {

  setJSON(
    "tuan4422_cart",
    cart
  );

  updateCartCount();

}


function updateCartCount() {

  const element =
    $("#cartCount");

  if (!element) {
    return;
  }

  const count =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  element.textContent =
    count;

}


function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total +
      item.price *
      item.quantity,
    0
  );

}


/* =========================================================
   ADD CART
========================================================= */

function addToCart(
  productId,
  quantity = 1
) {

  const product =
    PRODUCTS.find(
      item =>
        item.id === productId
    );


  if (!product) {

    showToast(
      "Không tìm thấy sản phẩm."
    );

    return;

  }


  const existing =
    cart.find(
      item =>
        item.id === productId
    );


  if (existing) {

    existing.quantity +=
      Number(quantity);

  } else {

    cart.push({

      id:
        product.id,

      name:
        product.name,

      price:
        product.price,

      icon:
        product.icon,

      quantity:
        Number(quantity)

    });

  }


  saveCart();

  renderCart();

  showToast(
    "Đã thêm sản phẩm vào giỏ."
  );

}


/* =========================================================
   REMOVE CART
========================================================= */

function removeFromCart(id) {

  cart =
    cart.filter(
      item =>
        item.id !== id
    );

  saveCart();

  renderCart();

  showToast(
    "Đã xóa sản phẩm."
  );

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeCartQuantity(
  id,
  amount
) {

  const item =
    cart.find(
      product =>
        product.id === id
    );


  if (!item) {
    return;
  }


  item.quantity += amount;


  if (item.quantity <= 0) {

    removeFromCart(id);

    return;

  }


  if (item.quantity > 99) {

    item.quantity = 99;

  }


  saveCart();

  renderCart();

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  const container =
    $("#cartItems");

  const total =
    $("#cartTotal");


  if (!container) {
    return;
  }


  if (cart.length === 0) {

    container.innerHTML = `
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;

  } else {

    container.innerHTML =
      cart.map(item => `

        <div class="cart-item">

          <div class="cart-item-icon">
            ${escapeHTML(item.icon)}
          </div>

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(item.name)}
            </strong>

            <span>
              ${formatMoney(item.price)}
            </span>

            <div
              style="
                display:flex;
                gap:8px;
                align-items:center;
                margin-top:8px;
              "
            >

              <button
                class="small-btn"
                data-minus="${item.id}"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="small-btn"
                data-plus="${item.id}"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="remove-cart"
            data-remove="${item.id}"
          >
            ×
          </button>

        </div>

      `).join("");


    container
      .querySelectorAll("[data-minus]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            changeCartQuantity(
              button.dataset.minus,
              -1
            );

          }
        );

      });


    container
      .querySelectorAll("[data-plus]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            changeCartQuantity(
              button.dataset.plus,
              1
            );

          }
        );

      });


    container
      .querySelectorAll("[data-remove]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            removeFromCart(
              button.dataset.remove
            );

          }
        );

      });

  }


  if (total) {

    total.textContent =
      formatMoney(
        getCartTotal()
      );

  }

}


/* =========================================================
   CART MODAL
========================================================= */

const cartBtn =
  $("#cartBtn");

const cartModal =
  $("#cartModal");

const closeCart =
  $("#closeCart");


function openCart() {

  if (!cartModal) {
    return;
  }

  renderCart();

  cartModal.classList.add(
    "show"
  );

  document.body.classList.add(
    "cart-open"
  );

}


function closeCartModal() {

  if (!cartModal) {
    return;
  }

  cartModal.classList.remove(
    "show"
  );

  document.body.classList.remove(
    "cart-open"
  );

}


function toggleCart() {

  if (
    cartModal &&
    cartModal.classList.contains(
      "show"
    )
  ) {

    closeCartModal();

  } else {

    openCart();

  }

}


if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      toggleCart();

    }
  );

}


if (closeCart) {

  closeCart.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      closeCartModal();

    }
  );

}


if (cartModal) {

  cartModal.addEventListener(
    "click",
    event => {

      if (
        event.target === cartModal
      ) {

        closeCartModal();

      }

    }
  );


  const box =
    cartModal.querySelector(
      ".modal-box"
    );


  if (box) {

    box.addEventListener(
      "click",
      event => {

        event.stopPropagation();

      }
    );

  }

}


/* =========================================================
   PRODUCT SHOP
========================================================= */

const productGrid =
  $("#productGrid");

const searchInput =
  $("#shopSearch");


function renderProducts(
  products
) {

  if (!productGrid) {
    return;
  }


  const noProducts =
    $("#noProducts");


  if (products.length === 0) {

    productGrid.innerHTML = "";

    if (noProducts) {
      noProducts.style.display =
        "block";
    }

    return;

  }


  if (noProducts) {
    noProducts.style.display =
      "none";
  }


  productGrid.innerHTML =
    products.map(product => `

      <article class="product">

        <div class="product-badge">
          ${escapeHTML(product.badge)}
        </div>

        <div class="product-icon">
          ${escapeHTML(product.icon)}
        </div>

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-bottom">

          <div class="price">
            ${formatMoney(product.price)}
          </div>

        </div>

        <div class="product-buttons">

          <button
            class="small-btn"
            data-detail="${product.id}"
          >
            Chi tiết
          </button>

          <button
            class="small-btn buy-btn"
            data-buy="${product.id}"
          >
            Mua
          </button>

        </div>

      </article>

    `).join("");


  productGrid
    .querySelectorAll("[data-buy]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          addToCart(
            button.dataset.buy
          );

        }
      );

    });


  productGrid
    .querySelectorAll("[data-detail]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openProductDetail(
            button.dataset.detail
          );

        }
      );

    });

}


if (productGrid) {

  renderProducts(
    PRODUCTS
  );

}


if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      const keyword =
        searchInput.value
          .trim()
          .toLowerCase();


      const result =
        PRODUCTS.filter(
          product =>

            product.name
              .toLowerCase()
              .includes(keyword)

            ||

            product.description
              .toLowerCase()
              .includes(keyword)

        );


      renderProducts(result);

    }
  );

}


/* =========================================================
   PRODUCT DETAIL
========================================================= */

const productModal =
  $("#productModal");

const closeProduct =
  $("#closeProduct");

const detailIcon =
  $("#detailIcon");

const detailTitle =
  $("#detailTitle");

const detailDescription =
  $("#detailDescription");

const detailPrice =
  $("#detailPrice");

const detailAdd =
  $("#detailAdd");


let selectedProduct =
  null;


function openProductDetail(id) {

  const product =
    PRODUCTS.find(
      item =>
        item.id === id
    );


  if (!product || !productModal) {
    return;
  }


  selectedProduct =
    product;


  if (detailIcon)
    detailIcon.textContent =
      product.icon;


  if (detailTitle)
    detailTitle.textContent =
      product.name;


  if (detailDescription)
    detailDescription.textContent =
      product.description;


  if (detailPrice)
    detailPrice.textContent =
      formatMoney(product.price);


  productModal.classList.add(
    "show"
  );

  document.body.classList.add(
    "cart-open"
  );

}


function closeProductModal() {

  if (!productModal) {
    return;
  }

  productModal.classList.remove(
    "show"
  );

  document.body.classList.remove(
    "cart-open"
  );

}


if (closeProduct) {

  closeProduct.addEventListener(
    "click",
    closeProductModal
  );

}


if (productModal) {

  productModal.addEventListener(
    "click",
    event => {

      if (
        event.target === productModal
      ) {

        closeProductModal();

      }

    }
  );

}


if (detailAdd) {

  detailAdd.addEventListener(
    "click",
    () => {

      if (!selectedProduct) {
        return;
      }

      addToCart(
        selectedProduct.id
      );

      closeProductModal();

    }
  );

}


/* =========================================================
   CHECKOUT
========================================================= */

const checkoutBtn =
  $("#checkoutBtn");


if (checkoutBtn) {

  checkoutBtn.addEventListener(
    "click",
    () => {

      if (cart.length === 0) {

        showToast(
          "Giỏ hàng đang trống."
        );

        return;

      }


      const orders =
        getJSON(
          "tuan4422_orders",
          []
        );


      orders.unshift({

        id:
          "TT" + Date.now(),

        items:
          [...cart],

        total:
          getCartTotal(),

        date:
          new Date()
            .toLocaleString(
              "vi-VN"
            ),

        status:
          "Đang xử lý"

      });


      setJSON(
        "tuan4422_orders",
        orders
      );


      cart = [];

      saveCart();

      renderCart();

      showToast(
        "Đặt hàng demo thành công!"
      );

    }
  );

}


/* =========================================================
   SERVER
========================================================= */

const copyIP =
  $("#copyIP");


if (copyIP) {

  copyIP.addEventListener(
    "click",
    async () => {

      const ip =
        $("#serverIP")
          ?.textContent
          .trim();


      if (!ip) {
        return;
      }


      try {

        await navigator.clipboard.writeText(
          ip
        );

        showToast(
          "Đã sao chép IP server."
        );

      } catch {

        showToast(
          "Không thể sao chép tự động."
        );

      }

    }
  );

}


/* =========================================================
   CHAT
========================================================= */

const chatForm =
  $("#chatForm");


if (chatForm) {

  chatForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const input =
        $("#chatInput");

      const messages =
        $("#chatMessages");


      if (!input || !messages) {
        return;
      }


      const text =
        input.value.trim();


      if (!text) {
        return;
      }


      const message =
        document.createElement(
          "div"
        );


      message.className =
        "message";


      message.innerHTML = `

        <div class="avatar">
          B
        </div>

        <div>

          <strong>
            Bạn
          </strong>

          <p>
            ${escapeHTML(text)}
          </p>

        </div>

      `;


      messages.appendChild(
        message
      );


      input.value = "";


      messages.scrollTop =
        messages.scrollHeight;


      showToast(
        "Đã gửi tin nhắn demo."
      );

    }
  );

}


/* =========================================================
   FORUM
========================================================= */

const forumList =
  $("#forumList");


const DEFAULT_POSTS = [

  {
    title:
      "Chào mừng đến TUAN4422 MARKET",

    content:
      "Đây là khu vực forum của cộng đồng.",

    author:
      "TUAN4422",

    time:
      "Hôm nay",

    icon:
      "📢"

  },

  {
    title:
      "Khu vực Minecraft",

    content:
      "Chia sẻ kinh nghiệm và thảo luận về server.",

    author:
      "Admin",

    time:
      "Hôm nay",

    icon:
      "⛏️"

  },

  {
    title:
      "Góp ý cho website",

    content:
      "Bạn có thể gửi ý tưởng để website phát triển.",

    author:
      "Community",

    time:
      "Hôm nay",

    icon:
      "💡"

  }

];


function renderForum() {

  if (!forumList) {
    return;
  }


  const posts =
    getJSON(
      "tuan4422_posts",
      DEFAULT_POSTS
    );


  forumList.innerHTML =
    posts.map(post => `

      <article class="forum-post">

        <div class="forum-icon">
          ${escapeHTML(post.icon)}
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

    `).join("");

}


renderForum();


const newPostBtn =
  $("#newPostBtn");

const postModal =
  $("#postModal");

const closePost =
  $("#closePost");

const postForm =
  $("#postForm");


if (newPostBtn && postModal) {

  newPostBtn.addEventListener(
    "click",
    () => {

      postModal.classList.add(
        "show"
      );

    }
  );

}


if (closePost && postModal) {

  closePost.addEventListener(
    "click",
    () => {

      postModal.classList.remove(
        "show"
      );

    }
  );

}


if (postForm) {

  postForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const title =
        $("#postTitle").value.trim();

      const content =
        $("#postContent").value.trim();


      if (!title || !content) {
        return;
      }


      const posts =
        getJSON(
          "tuan4422_posts",
          DEFAULT_POSTS
        );


      posts.unshift({

        title:
          title,

        content:
          content,

        author:
          "Bạn",

        time:
          "Vừa xong",

        icon:
          "💬"

      });


      setJSON(
        "tuan4422_posts",
        posts
      );


      postForm.reset();


      if (postModal) {

        postModal.classList.remove(
          "show"
        );

      }


      renderForum();


      showToast(
        "Đã đăng bài demo."
      );

    }
  );

}


/* =========================================================
   ACCOUNT
========================================================= */

const profileName =
  $("#profileName");


const editName =
  $("#editName");


function getUsername() {

  return localStorage.getItem(
    "tuan4422_username"
  ) || "TUAN4422";

}


function renderAccount() {

  if (!profileName) {
    return;
  }


  const name =
    getUsername();


  profileName.textContent =
    name;


  const avatar =
    $("#profileAvatar");


  if (avatar) {

    avatar.textContent =
      name
        .charAt(0)
        .toUpperCase();

  }


  const balance =
    $("#accountBalance");


  if (balance) {

    const money =
      Number(
        localStorage.getItem(
          "tuan4422_balance"
        ) || 100000
      );

    balance.textContent =
      formatMoney(money);

  }

}


renderAccount();


if (editName) {

  editName.addEventListener(
    "click",
    () => {

      const oldName =
        getUsername();


      const newName =
        prompt(
          "Nhập tên mới:",
          oldName
        );


      if (!newName) {
        return;
      }


      const clean =
        newName.trim();


      if (!clean) {
        return;
      }


      localStorage.setItem(
        "tuan4422_username",
        clean.substring(0, 25)
      );


      renderAccount();


      showToast(
        "Đã cập nhật tên."
      );

    }
  );

}


/* =========================================================
   ORDERS
========================================================= */

const orderList =
  $("#orderList");


if (orderList) {

  const orders =
    getJSON(
      "tuan4422_orders",
      []
    );


  if (orders.length === 0) {

    orderList.innerHTML = `
      <div class="empty">
        Chưa có đơn hàng.
      </div>
    `;

  } else {

    orderList.innerHTML =
      orders.map(order => `

        <div class="order-box">

          <div class="order-header">

            <strong>
              ${escapeHTML(order.id)}
            </strong>

            <span>
              ${escapeHTML(order.status)}
            </span>

          </div>

          <p>
            ${escapeHTML(order.date)}
          </p>

          <strong>
            ${formatMoney(order.total)}
          </strong>

        </div>

      `).join("");

  }

}


/* =========================================================
   WALLET
========================================================= */

const walletBalance =
  $("#walletBalance");

const addMoneyBtn =
  $("#addMoneyBtn");


function getBalance() {

  return Number(
    localStorage.getItem(
      "tuan4422_balance"
    ) || 100000
  );

}


function setBalance(value) {

  localStorage.setItem(
    "tuan4422_balance",
    value
  );

}


function renderWallet() {

  if (walletBalance) {

    walletBalance.textContent =
      formatMoney(
        getBalance()
      );

  }


  const transactions =
    $("#transactions");


  if (!transactions) {
    return;
  }


  const history =
    getJSON(
      "tuan4422_transactions",
      []
    );


  if (history.length === 0) {

    transactions.innerHTML = `
      <div class="empty">
        Chưa có giao dịch.
      </div>
    `;

    return;

  }


  transactions.innerHTML =
    history.map(item => `

      <div class="transaction">

        <div>

          <strong>
            ${escapeHTML(item.title)}
          </strong>

          <br>

          <span>
            ${escapeHTML(item.date)}
          </span>

        </div>

        <strong>
          +${formatMoney(item.amount)}
        </strong>

      </div>

    `).join("");

}


renderWallet();


if (addMoneyBtn) {

  addMoneyBtn.addEventListener(
    "click",
    () => {

      const amount =
        100000;


      const newBalance =
        getBalance() +
        amount;


      setBalance(
        newBalance
      );


      const history =
        getJSON(
          "tuan4422_transactions",
          []
        );


      history.unshift({

        title:
          "Nạp tiền demo",

        amount:
          amount,

        date:
          new Date()
            .toLocaleString(
              "vi-VN"
            )

      });


      setJSON(
        "tuan4422_transactions",
        history
      );


      renderWallet();

      renderAccount();


      showToast(
        "Đã nạp 100.000đ demo."
      );

    }
  );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

  const toast =
    $("#toast");


  if (!toast) {
    return;
  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2500
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeCartModal();

      closeProductModal();


      if (postModal) {

        postModal.classList.remove(
          "show"
        );

      }


      if (nav) {

        nav.classList.remove(
          "open"
        );

      }

    }

  }
);


/* =========================================================
   YEAR
========================================================= */

const year =
  $("#year");


if (year) {

  year.textContent =
    new Date().getFullYear();

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.addToCart =
  addToCart;

window.removeFromCart =
  removeFromCart;

window.changeCartQuantity =
  changeCartQuantity;

window.openCart =
  openCart;

window.closeCart =
  closeCartModal;

window.showToast =
  showToast;


/* =========================================================
   START
========================================================= */

updateCartCount();

renderCart();
