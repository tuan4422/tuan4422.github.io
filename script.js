"use strict";

/* =========================================================
   TUAN4422 MARKET
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = (selector) => {
  return document.querySelector(selector);
};

const $$ = (selector) => {
  return document.querySelectorAll(selector);
};


function showToast(message){

  const toast = $("#toast");

  if(!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* =========================================================
   YEAR
   ========================================================= */

const year = $("#year");

if(year){
  year.textContent = new Date().getFullYear();
}


/* =========================================================
   THEME
   ========================================================= */

const themeBtn = $("#themeBtn");

function updateThemeButton(){

  if(!themeBtn) return;

  const light =
    document.body.classList.contains("light");

  themeBtn.textContent =
    light ? "☀" : "☾";
}


if(localStorage.getItem("theme") === "light"){

  document.body.classList.add("light");

}

updateThemeButton();


if(themeBtn){

  themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const light =
      document.body.classList.contains("light");

    localStorage.setItem(
      "theme",
      light ? "light" : "dark"
    );

    updateThemeButton();

  });

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn = $("#menuBtn");
const nav = $("#nav");


if(menuBtn && nav){

  menuBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    nav.classList.toggle("open");

  });


  $$("#nav a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

    });

  });


  document.addEventListener("click", (event) => {

    if(
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuBtn.contains(event.target)
    ){

      nav.classList.remove("open");

    }

  });

}


/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [

  {
    id: "script-basic",
    name: "Script Basic",
    description:
      "Script demo dành cho người dùng mới.",
    price: 25000,
    icon: "💻",
    badge: "SCRIPT"
  },

  {
    id: "script-pro",
    name: "Script Pro",
    description:
      "Gói script nâng cao dành cho người dùng.",
    price: 50000,
    icon: "⚡",
    badge: "HOT"
  },

  {
    id: "minecraft-pack",
    name: "Minecraft Pack",
    description:
      "Gói tài nguyên và tiện ích Minecraft demo.",
    price: 35000,
    icon: "⛏️",
    badge: "MINECRAFT"
  },

  {
    id: "minecraft-tool",
    name: "Minecraft Tool",
    description:
      "Công cụ hỗ trợ Minecraft.",
    price: 45000,
    icon: "🧰",
    badge: "MINECRAFT"
  },

  {
    id: "website-template",
    name: "Website Template",
    description:
      "Mẫu website hiện đại dành cho dự án cá nhân.",
    price: 70000,
    icon: "🌐",
    badge: "WEB"
  },

  {
    id: "premium-pack",
    name: "Premium Pack",
    description:
      "Gói sản phẩm số demo cao cấp.",
    price: 100000,
    icon: "⭐",
    badge: "PREMIUM"
  }

];


/* =========================================================
   FORMAT MONEY
   ========================================================= */

function money(value){

  return Number(value).toLocaleString("vi-VN") + "$";

}


/* =========================================================
   SHOP RENDER
   ========================================================= */

const productGrid = $("#productGrid");


function renderProducts(list = PRODUCTS){

  if(!productGrid) return;

  productGrid.innerHTML = "";

  if(list.length === 0){

    productGrid.innerHTML = `
      <div class="empty">
        Không tìm thấy sản phẩm.
      </div>
    `;

    return;

  }


  list.forEach(product => {

    const element =
      document.createElement("article");

    element.className = "product";


    element.innerHTML = `

      <span class="product-badge">
        ${product.badge}
      </span>

      <div class="product-icon">
        ${product.icon}
      </div>

      <h3>
        ${product.name}
      </h3>

      <p class="product-description">
        ${product.description}
      </p>

      <div class="product-bottom">

        <strong class="price">
          ${money(product.price)}
        </strong>

        <div class="product-buttons">

          <button
            class="small-btn"
            data-detail="${product.id}">
            Xem
          </button>

          <button
            class="small-btn buy-btn"
            data-buy="${product.id}">
            Thêm
          </button>

        </div>

      </div>

    `;


    productGrid.appendChild(element);

  });


  $$("[data-detail]").forEach(button => {

    button.addEventListener("click", () => {

      openProduct(
        button.dataset.detail
      );

    });

  });


  $$("[data-buy]").forEach(button => {

    button.addEventListener("click", () => {

      addToCart(
        button.dataset.buy
      );

    });

  });

}


renderProducts();


/* =========================================================
   SEARCH
   ========================================================= */

const productSearch = $("#productSearch");


if(productSearch){

  productSearch.addEventListener(
    "input",
    () => {

      const keyword =
        productSearch.value
          .trim()
          .toLowerCase();


      const result =
        PRODUCTS.filter(product => {

          return (
            product.name
              .toLowerCase()
              .includes(keyword)
            ||
            product.description
              .toLowerCase()
              .includes(keyword)
            ||
            product.badge
              .toLowerCase()
              .includes(keyword)
          );

        });


      renderProducts(result);

    }
  );

}


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

const productModal = $("#productModal");
const productDetail = $("#productDetail");
const productClose = $("#productClose");


function openProduct(id){

  const product =
    PRODUCTS.find(
      item => item.id === id
    );


  if(!product || !productModal){
    return;
  }


  if(productDetail){

    productDetail.innerHTML = `

      <div class="detail-icon">
        ${product.icon}
      </div>

      <h2 class="detail-title">
        ${product.name}
      </h2>

      <p class="detail-description">
        ${product.description}
      </p>

      <div class="detail-price">
        ${money(product.price)}
      </div>

      <button
        id="detailBuy"
        class="btn primary full">
        Thêm vào giỏ hàng
      </button>

    `;


    const detailBuy =
      $("#detailBuy");


    if(detailBuy){

      detailBuy.addEventListener(
        "click",
        () => {

          addToCart(product.id);

          closeModal(productModal);

        }
      );

    }

  }


  openModal(productModal);

}


if(productClose){

  productClose.addEventListener(
    "click",
    () => {
      closeModal(productModal);
    }
  );

}


/* =========================================================
   CART STORAGE
   ========================================================= */

function getCart(){

  try{

    const saved =
      localStorage.getItem("tuan4422_cart");

    if(!saved) return [];

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];

  }catch(error){

    console.warn(
      "Cart read error:",
      error
    );

    return [];

  }

}


function saveCart(cart){

  localStorage.setItem(
    "tuan4422_cart",
    JSON.stringify(cart)
  );

  updateCart();

}


/* =========================================================
   ADD CART
   ========================================================= */

function addToCart(id){

  const product =
    PRODUCTS.find(
      item => item.id === id
    );


  if(!product){

    showToast(
      "Không tìm thấy sản phẩm."
    );

    return;

  }


  const cart = getCart();

  const existing =
    cart.find(item => item.id === id);


  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({

      id:product.id,

      quantity:1

    });

  }


  saveCart(cart);

  showToast(
    "Đã thêm vào giỏ hàng."
  );

}


/* =========================================================
   REMOVE CART
   ========================================================= */

function removeFromCart(id){

  let cart = getCart();

  cart =
    cart.filter(
      item => item.id !== id
    );

  saveCart(cart);

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(id, amount){

  const cart = getCart();

  const item =
    cart.find(
      item => item.id === id
    );


  if(!item) return;


  item.quantity += amount;


  if(item.quantity <= 0){

    const newCart =
      cart.filter(
        cartItem => cartItem.id !== id
      );

    saveCart(newCart);

    return;

  }


  saveCart(cart);

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart(){

  const cart = getCart();

  const count =
    cart.reduce(
      (total,item) =>
        total + item.quantity,
      0
    );


  const cartCount =
    $("#cartCount");


  if(cartCount){

    cartCount.textContent =
      count;

  }


  renderCart();

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart(){

  const cartItems =
    $("#cartItems");

  const cartTotal =
    $("#cartTotal");


  if(!cartItems) return;


  const cart = getCart();


  if(cart.length === 0){

    cartItems.innerHTML = `
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;


    if(cartTotal){

      cartTotal.textContent =
        "0$";

    }

    return;

  }


  let total = 0;


  cartItems.innerHTML = "";


  cart.forEach(cartItem => {

    const product =
      PRODUCTS.find(
        item => item.id === cartItem.id
      );


    if(!product) return;


    const subtotal =
      product.price *
      cartItem.quantity;


    total += subtotal;


    const element =
      document.createElement("div");


    element.className =
      "cart-item";


    element.innerHTML = `

      <div class="cart-item-icon">
        ${product.icon}
      </div>

      <div class="cart-item-info">

        <strong>
          ${product.name}
        </strong>

        <span>
          ${money(product.price)}
        </span>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-top:7px;
        ">

          <button
            class="small-btn"
            data-minus="${product.id}">
            −
          </button>

          <strong>
            ${cartItem.quantity}
          </strong>

          <button
            class="small-btn"
            data-plus="${product.id}">
            +
          </button>

        </div>

      </div>

      <button
        class="remove-cart"
        data-remove="${product.id}"
        aria-label="Xóa sản phẩm">
        ×
      </button>

    `;


    cartItems.appendChild(element);

  });


  if(cartTotal){

    cartTotal.textContent =
      money(total);

  }


  $$("[data-remove]").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        removeFromCart(
          button.dataset.remove
        );

      }
    );

  });


  $$("[data-minus]").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        changeQuantity(
          button.dataset.minus,
          -1
        );

      }
    );

  });


  $$("[data-plus]").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        changeQuantity(
          button.dataset.plus,
          1
        );

      }
    );

  });

}


/* =========================================================
   MODAL SYSTEM
   ========================================================= */

function openModal(modal){

  if(!modal) return;

  modal.classList.add("show");

  document.body.style.overflow = "hidden";

}


function closeModal(modal){

  if(!modal) return;

  modal.classList.remove("show");

  /*
    Quan trọng:
    Không dùng display:none trực tiếp.
    Chỉ dùng class .show.
  */

  document.body.style.overflow = "";

}


function closeAllModals(){

  $$(".modal").forEach(modal => {

    modal.classList.remove("show");

  });

  document.body.style.overflow = "";

}


/* =========================================================
   CART MODAL
   ========================================================= */

const cartModal = $("#cartModal");
const cartBtn = $("#cartBtn");
const cartClose = $("#cartClose");


if(cartBtn){

  cartBtn.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      renderCart();

      openModal(cartModal);

    }
  );

}


if(cartClose){

  cartClose.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      closeModal(cartModal);

    }
  );

}


/*
  Click vào phần nền tối để đóng.
  Nhưng click bên trong modal-box sẽ KHÔNG đóng.
*/

if(cartModal){

  cartModal.addEventListener(
    "click",
    (event) => {

      if(event.target === cartModal){

        closeModal(cartModal);

      }

    }
  );

}


/* =========================================================
   ALL MODALS BACKDROP
   ========================================================= */

$$(".modal").forEach(modal => {

  modal.addEventListener(
    "click",
    event => {

      if(event.target === modal){

        closeModal(modal);

      }

    }
  );

});


/* =========================================================
   ESC TO CLOSE
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if(event.key === "Escape"){

      closeAllModals();

    }

  }
);


/* =========================================================
   CHECKOUT
   ========================================================= */

const checkoutBtn =
  $("#checkoutBtn");


if(checkoutBtn){

  checkoutBtn.addEventListener(
    "click",
    () => {

      const cart = getCart();


      if(cart.length === 0){

        showToast(
          "Giỏ hàng đang trống."
        );

        return;

      }


      let total = 0;


      cart.forEach(item => {

        const product =
          PRODUCTS.find(
            product =>
              product.id === item.id
          );


        if(product){

          total +=
            product.price *
            item.quantity;

        }

      });


      let balance =
        Number(
          localStorage.getItem(
            "tuan4422_balance"
          )
        );


      if(!Number.isFinite(balance)){

        balance = 100000;

      }


      if(balance < total){

        showToast(
          "Số dư không đủ. Đây là thanh toán demo."
        );

        return;

      }


      balance -= total;


      localStorage.setItem(
        "tuan4422_balance",
        String(balance)
      );


      const orders =
        JSON.parse(
          localStorage.getItem(
            "tuan4422_orders"
          ) || "[]"
        );


      orders.unshift({

        id:
          "ORD-" +
          Date.now(),

        total,

        date:
          new Date().toLocaleString(
            "vi-VN"
          ),

        items:cart

      });


      localStorage.setItem(
        "tuan4422_orders",
        JSON.stringify(orders)
      );


      localStorage.setItem(
        "tuan4422_cart",
        "[]"
      );


      updateCart();

      closeModal(cartModal);

      updateBalanceUI();

      renderOrders();

      showToast(
        "Thanh toán demo thành công!"
      );

    }
  );

}


/* =========================================================
   BALANCE
   ========================================================= */

function getBalance(){

  let balance =
    Number(
      localStorage.getItem(
        "tuan4422_balance"
      )
    );


  if(!Number.isFinite(balance)){

    balance = 100000;

    localStorage.setItem(
      "tuan4422_balance",
      String(balance)
    );

  }


  return balance;

}


function updateBalanceUI(){

  const balance =
    getBalance();


  const walletBalance =
    $("#walletBalance");

  const accountBalance =
    $("#accountBalance");


  if(walletBalance){

    walletBalance.textContent =
      money(balance);

  }


  if(accountBalance){

    accountBalance.textContent =
      money(balance);

  }

}


updateBalanceUI();


/* =========================================================
   ORDERS
   ========================================================= */

function renderOrders(){

  const container =
    $("#accountOrders");


  if(!container) return;


  let orders;


  try{

    orders =
      JSON.parse(
        localStorage.getItem(
          "tuan4422_orders"
        ) || "[]"
      );

  }catch{

    orders = [];

  }


  if(!orders.length){

    container.innerHTML = `
      <div class="empty">
        Chưa có đơn hàng.
      </div>
    `;

    return;

  }


  container.innerHTML =
    orders.slice(0,5).map(order => {

      return `

        <div style="
          padding:15px 0;
          border-bottom:1px solid var(--border);
        ">

          <strong>
            ${order.id}
          </strong>

          <div style="
            color:var(--muted);
            font-size:13px;
            margin-top:4px;
          ">
            ${order.date}
          </div>

          <div style="
            color:var(--yellow);
            font-weight:900;
            margin-top:5px;
          ">
            ${money(order.total)}
          </div>

        </div>

      `;

    }).join("");

}


renderOrders();


/* =========================================================
   WALLET DEMO
   ========================================================= */

const addMoneyBtn =
  $("#addMoneyBtn");


if(addMoneyBtn){

  addMoneyBtn.addEventListener(
    "click",
    () => {

      const current =
        getBalance();


      const newBalance =
        current + 100000;


      localStorage.setItem(
        "tuan4422_balance",
        String(newBalance)
      );


      updateBalanceUI();


      showToast(
        "Đã nạp 100.000$ demo."
      );

    }
  );

}


/* =========================================================
   TRANSACTIONS
   ========================================================= */

function renderTransactions(){

  const list =
    $("#transactionsList");


  if(!list) return;


  const orders =
    JSON.parse(
      localStorage.getItem(
        "tuan4422_orders"
      ) || "[]"
    );


  if(!orders.length){

    list.innerHTML = `
      <div class="empty">
        Chưa có giao dịch.
      </div>
    `;

    return;

  }


  list.innerHTML =
    orders.map(order => {

      return `

        <div style="
          display:flex;
          justify-content:space-between;
          gap:15px;
          padding:14px 0;
          border-bottom:1px solid var(--border);
        ">

          <div>

            <strong>
              ${order.id}
            </strong>

            <div style="
              color:var(--muted);
              font-size:12px;
            ">
              ${order.date}
            </div>

          </div>

          <strong style="
            color:var(--red);
          ">
            -${money(order.total)}
          </strong>

        </div>

      `;

    }).join("");

}


renderTransactions();


/* =========================================================
   CHAT DEMO
   ========================================================= */

const chatForm =
  $("#chatForm");

const chatInput =
  $("#chatInput");

const chatMessages =
  $("#chatMessages");


if(chatForm && chatInput && chatMessages){

  chatForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const text =
        chatInput.value.trim();


      if(!text) return;


      const message =
        document.createElement("div");


      message.className =
        "message";


      message.innerHTML = `

        <div class="avatar">
          T
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


      chatMessages.appendChild(message);


      chatInput.value = "";


      chatMessages.scrollTop =
        chatMessages.scrollHeight;

    }
  );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value){

  const div =
    document.createElement("div");

  div.textContent =
    value;

  return div.innerHTML;

}


/* =========================================================
   SERVER COPY IP
   ========================================================= */

const copyIP =
  $("#copyIP");


if(copyIP){

  copyIP.addEventListener(
    "click",
    async () => {

      const ipElement =
        $("#serverIP");


      if(!ipElement) return;


      const ip =
        ipElement.textContent.trim();


      try{

        await navigator.clipboard.writeText(
          ip
        );

        showToast(
          "Đã sao chép IP server."
        );

      }catch{

        showToast(
          "Không thể tự động sao chép."
        );

      }

    }
  );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

updateCart();

updateBalanceUI();

renderOrders();

renderTransactions();
