/* =========================================================
   TUAN4422 MARKET
   script.js
   ========================================================= */


/* =========================================================
   HELPER
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

const themeBtn =
  document.getElementById("themeBtn");

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

  themeBtn.addEventListener(
    "click",
    () => {

      document.body.classList.toggle("light");

      const light =
        document.body.classList.contains("light");

      localStorage.setItem(
        "theme",
        light ? "light" : "dark"
      );

      themeBtn.textContent =
        light ? "☀" : "☾";

    }
  );

}

loadTheme();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn =
  document.getElementById("menuBtn");

const nav =
  document.getElementById("nav");


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


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(number) {

  return Number(number)
    .toLocaleString("vi-VN") + "đ";

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
   CART COUNT
========================================================= */

function updateCartCount() {

  const cartCount =
    document.getElementById("cartCount");

  if (!cartCount) {
    return;
  }


  const total =
    cart.reduce(
      (sum, item) => {

        return sum + item.quantity;

      },
      0
    );


  cartCount.textContent =
    total;

}


updateCartCount();


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
  productId,
  quantity = 1
) {

  const product =
    PRODUCTS.find(
      item => item.id === productId
    );


  if (!product) {

    showToast(
      "Không tìm thấy sản phẩm."
    );

    return;

  }


  quantity =
    Math.max(
      1,
      Math.floor(Number(quantity) || 1)
    );


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


  saveCart();

  renderCart();

  showToast(
    "Đã thêm vào giỏ hàng."
  );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

  setJSON(
    "tuan4422_cart",
    cart
  );

  updateCartCount();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

  cart =
    cart.filter(
      item => item.id !== productId
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


  saveCart();

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
   RENDER CART
========================================================= */

function renderCart() {

  const cartItems =
    document.getElementById("cartItems");

  const cartTotal =
    document.getElementById("cartTotal");


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
      cart.map(item => {

        return `

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
                  align-items:center;
                  gap:8px;
                  margin-top:8px;
                "
              >

                <button
                  type="button"
                  class="small-btn"
                  data-cart-minus="${escapeHTML(item.id)}"
                >
                  −
                </button>


                <span>
                  ${item.quantity}
                </span>


                <button
                  type="button"
                  class="small-btn"
                  data-cart-plus="${escapeHTML(item.id)}"
                >
                  +
                </button>

              </div>

            </div>


            <button
              type="button"
              class="remove-cart"
              data-cart-remove="${escapeHTML(item.id)}"
              aria-label="Xóa sản phẩm"
            >
              ×
            </button>

          </div>

        `;

      }).join("");

  }


  if (cartTotal) {

    cartTotal.textContent =
      formatMoney(
        getCartTotal()
      );

  }


  /* Nút giảm */

  cartItems
    .querySelectorAll(
      "[data-cart-minus]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          changeCartQuantity(
            button.dataset.cartMinus,
            -1
          );

        }
      );

    });


  /* Nút tăng */

  cartItems
    .querySelectorAll(
      "[data-cart-plus]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          changeCartQuantity(
            button.dataset.cartPlus,
            1
          );

        }
      );

    });


  /* Nút xóa */

  cartItems
    .querySelectorAll(
      "[data-cart-remove]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          removeFromCart(
            button.dataset.cartRemove
          );

        }
      );

    });

}


/* =========================================================
   CART MODAL
========================================================= */

const cartBtn =
  document.getElementById("cartBtn");

const cartModal =
  document.getElementById("cartModal");

const closeCart =
  document.getElementById("closeCart");


/* MỞ */

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


/* ĐÓNG */

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


/* MỞ / ĐÓNG */

function toggleCart() {

  if (!cartModal) {
    return;
  }


  if (
    cartModal.classList.contains("show")
  ) {

    closeCartModal();

  } else {

    openCart();

  }

}


/* NÚT GIỎ HÀNG */

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


/* NÚT X */

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


/* CLICK NỀN ĐEN */

if (cartModal) {

  cartModal.addEventListener(
    "click",
    event => {

      /*
        Chỉ đóng khi click đúng vào
        phần nền modal.
      */

      if (
        event.target === cartModal
      ) {

        closeCartModal();

      }

    }
  );


  /* Không cho click trong hộp
     truyền ra nền */

  const modalBox =
    cartModal.querySelector(
      ".modal-box"
    );


  if (modalBox) {

    modalBox.addEventListener(
      "click",
      event => {

        event.stopPropagation();

      }
    );

  }

}


/* =========================================================
   ESC - ĐÓNG GIỎ HÀNG
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" ||
      event.key === "Esc"
    ) {

      closeCartModal();

    }

  }
);


/* =========================================================
   CHECKOUT
========================================================= */

const checkoutBtn =
  document.getElementById(
    "checkoutBtn"
  );


if (checkoutBtn) {

  checkoutBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();


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


      const order = {

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

      };


      orders.unshift(
        order
      );


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
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );


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
   PRODUCT STAT
========================================================= */

const productStat =
  document.getElementById(
    "productStat"
  );


if (productStat) {

  productStat.textContent =
    PRODUCTS.length + "+";

}


/* =========================================================
   YEAR
========================================================= */

const year =
  document.getElementById(
    "year"
  );


if (year) {

  year.textContent =
    new Date().getFullYear();

}


/* =========================================================
   CLOSE MENU WHEN ESC
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      nav
    ) {

      nav.classList.remove(
        "open"
      );

    }

  }
);


/* =========================================================
   GLOBAL
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

renderCart();

updateCartCount();
