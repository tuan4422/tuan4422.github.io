/* =========================================================
   TUAN4422 MARKET
   script.js
   ========================================================= */


/* =========================================================
   HELPERS
========================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function getJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);

  } catch (error) {
    console.warn("Không thể đọc dữ liệu:", key);
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}


/* =========================================================
   THEME
========================================================= */

const themeBtn = $("#themeBtn");

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


if (themeBtn) {

  themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
      document.body.classList.contains("light");

    localStorage.setItem(
      "theme",
      isLight ? "light" : "dark"
    );

    themeBtn.textContent =
      isLight ? "☀" : "☾";

  });

}

loadTheme();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = $("#menuBtn");
const nav = $("#nav");

if (menuBtn && nav) {

  menuBtn.addEventListener("click", () => {

    nav.classList.toggle("open");

  });


  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

    });

  });

}


/* =========================================================
   PRODUCTS
========================================================= */

/*
   Đây là dữ liệu demo.

   Sau này khi làm shop.html,
   có thể thay danh sách này bằng dữ liệu
   sản phẩm thật.
*/

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
   CART DATA
========================================================= */

let cart = getJSON(
  "tuan4422_cart",
  []
);


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

  const cartCount = $("#cartCount");

  if (!cartCount) {
    return;
  }

  const totalItems = cart.reduce(
    (total, item) => {
      return total + item.quantity;
    },
    0
  );

  cartCount.textContent = totalItems;

}


updateCartCount();


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId, quantity = 1) {

  const product =
    PRODUCTS.find(
      item => item.id === productId
    );

  if (!product) {
    showToast("Không tìm thấy sản phẩm.");
    return;
  }


  const existing =
    cart.find(
      item => item.id === productId
    );


  if (existing) {

    existing.quantity += quantity;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      price: product.price,

      icon: product.icon,

      quantity: quantity

    });

  }


  setJSON(
    "tuan4422_cart",
    cart
  );


  updateCartCount();

  renderCart();

  showToast(
    `${product.name} đã được thêm vào giỏ hàng.`
  );

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

  cart =
    cart.filter(
      item => item.id !== productId
    );


  setJSON(
    "tuan4422_cart",
    cart
  );


  updateCartCount();

  renderCart();

  showToast(
    "Đã xóa sản phẩm khỏi giỏ hàng."
  );

}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(
  productId,
  amount
) {

  const item =
    cart.find(
      product => product.id === productId
    );

  if (!item) {
    return;
  }


  item.quantity += amount;


  if (item.quantity <= 0) {

    removeFromCart(productId);

    return;

  }


  if (item.quantity > 99) {

    item.quantity = 99;

  }


  setJSON(
    "tuan4422_cart",
    cart
  );


  updateCartCount();

  renderCart();

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

  return cart.reduce(
    (total, item) => {

      return total +
        item.price * item.quantity;

    },
    0
  );

}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(number) {

  return Number(number)
    .toLocaleString("vi-VN") + "đ";

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  const cartItems = $("#cartItems");
  const cartTotal = $("#cartTotal");

  if (!cartItems) {
    return;
  }


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;

  } else {

    cartItems.innerHTML =
      cart.map(item => `

        <div class="cart-item">

          <div class="cart-item-icon">
            ${item.icon}
          </div>

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(item.name)}
            </strong>

            <span>
              ${formatMoney(item.price)}
            </span>

            <div class="cart-quantity">

              <button
                class="small-btn"
                onclick="changeCartQuantity(
                  '${item.id}',
                  -1
                )"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="small-btn"
                onclick="changeCartQuantity(
                  '${item.id}',
                  1
                )"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="remove-cart"
            onclick="removeFromCart(
              '${item.id}'
            )"
            aria-label="Xóa sản phẩm"
          >
            ×
          </button>

        </div>

      `).join("");

  }


  if (cartTotal) {

    cartTotal.textContent =
      formatMoney(getCartTotal());

  }

}


/* =========================================================
   CART MODAL
========================================================= */

const cartBtn = $("#cartBtn");
const cartModal = $("#cartModal");
const closeCart = $("#closeCart");


function openCart() {

  if (!cartModal) {
    return;
  }

  renderCart();

  cartModal.classList.add("show");

}


function closeCartModal() {

  if (!cartModal) {
    return;
  }

  cartModal.classList.remove("show");

}


if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    openCart
  );

}


if (closeCart) {

  closeCart.addEventListener(
    "click",
    closeCartModal
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

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeCartModal();

      if (nav) {
        nav.classList.remove("open");
      }

    }

  }
);


/* =========================================================
   CHECKOUT DEMO
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


      /*
        Đây chỉ là thanh toán DEMO.

        GitHub Pages không thể tự xử lý
        thanh toán thật hoặc trừ tiền thật.
      */

      const orders =
        getJSON(
          "tuan4422_orders",
          []
        );


      const order = {

        id:
          "TT" +
          Date.now(),

        items:
          [...cart],

        total:
          getCartTotal(),

        date:
          new Date().toLocaleString(
            "vi-VN"
          ),

        status:
          "Đang xử lý"

      };


      orders.unshift(order);


      setJSON(
        "tuan4422_orders",
        orders
      );


      cart = [];


      setJSON(
        "tuan4422_cart",
        cart
      );


      updateCartCount();

      renderCart();


      showToast(
        "Đặt hàng demo thành công!"
      );

    }
  );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

  const toast = $("#toast");

  if (!toast) {
    return;
  }


  toast.textContent = message;

  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer = setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2500
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   PRODUCT STAT
========================================================= */

const productStat =
  $("#productStat");

if (productStat) {

  productStat.textContent =
    PRODUCTS.length + "+";

}


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

window.showToast =
  showToast;


/* =========================================================
   PAGE READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();

    renderCart();

  }
);
