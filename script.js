/* =========================================
   TUAN4422 MARKET
   Front-end demo
========================================= */


/* ---------- DATA ---------- */

const products = [

  {
    id:1,
    name:"Script Starter",
    icon:"💻",
    price:25000,
    badge:"HOT",
    description:"Bộ script mẫu dành cho các dự án cá nhân."
  },

  {
    id:2,
    name:"Script Utility",
    icon:"⚙️",
    price:35000,
    badge:"NEW",
    description:"Bộ công cụ script tiện ích cho người dùng."
  },

  {
    id:3,
    name:"Script Premium",
    icon:"🚀",
    price:75000,
    badge:"PREMIUM",
    description:"Phiên bản nâng cao dành cho dự án lớn."
  },

  {
    id:4,
    name:"Tài khoản hợp lệ",
    icon:"👤",
    price:50000,
    badge:"SALE",
    description:"Tài khoản demo hợp lệ do shop cung cấp."
  },

  {
    id:5,
    name:"Minecraft Utility",
    icon:"⛏️",
    price:45000,
    badge:"HOT",
    description:"Công cụ tiện ích Minecraft."
  },

  {
    id:6,
    name:"Web Template",
    icon:"🌐",
    price:60000,
    badge:"NEW",
    description:"Mẫu website hiện đại có thể chỉnh sửa."
  },

  {
    id:7,
    name:"Discord Bot",
    icon:"🤖",
    price:55000,
    badge:"BOT",
    description:"Bot mẫu dành cho server cộng đồng."
  },

  {
    id:8,
    name:"UI Pack",
    icon:"🎨",
    price:30000,
    badge:"DESIGN",
    description:"Bộ giao diện mẫu cho dự án cá nhân."
  }

];


/* ---------- STATE ---------- */

let cart =
  JSON.parse(
    localStorage.getItem("tuan4422_cart") || "[]"
  );

let orders =
  JSON.parse(
    localStorage.getItem("tuan4422_orders") || "[]"
  );

let balance =
  Number(
    localStorage.getItem("tuan4422_balance")
  ) || 100000;


/* ---------- ELEMENTS ---------- */

const productsContainer =
  document.getElementById("products");

const searchInput =
  document.getElementById("searchInput");

const cartModal =
  document.getElementById("cartModal");

const productModal =
  document.getElementById("productModal");

const cartCount =
  document.getElementById("cartCount");

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const walletBalance =
  document.getElementById("walletBalance");

const accountBalance =
  document.getElementById("accountBalance");

const heroBalance =
  document.getElementById("heroBalance");

const orderCount =
  document.getElementById("orderCount");

const ordersContainer =
  document.getElementById("orders");

const transactionsList =
  document.getElementById("transactionsList");

const toast =
  document.getElementById("toast");


/* ---------- FORMAT MONEY ---------- */

function money(value){

  return new Intl.NumberFormat(
    "vi-VN"
  ).format(value) + "đ";

}


/* ---------- SAVE ---------- */

function save(){

  localStorage.setItem(
    "tuan4422_cart",
    JSON.stringify(cart)
  );

  localStorage.setItem(
    "tuan4422_orders",
    JSON.stringify(orders)
  );

  localStorage.setItem(
    "tuan4422_balance",
    balance
  );

}


/* ---------- PRODUCTS ---------- */

function renderProducts(list = products){

  productsContainer.innerHTML = "";

  if(!list.length){

    productsContainer.innerHTML = `
      <div class="empty">
        Không tìm thấy sản phẩm.
      </div>
    `;

    return;
  }


  list.forEach(product => {

    productsContainer.innerHTML += `

      <article class="product">

        <span class="product-badge">
          ${product.badge}
        </span>

        <div class="product-icon">
          ${product.icon}
        </div>

        <h3>${product.name}</h3>

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
              onclick="viewProduct(${product.id})">
              Xem
            </button>

            <button
              class="small-btn buy-btn"
              onclick="addToCart(${product.id})">
              Mua
            </button>

          </div>

        </div>

      </article>

    `;

  });

}


/* ---------- SEARCH ---------- */

searchInput.addEventListener(
  "input",
  function(){

    const keyword =
      this.value
        .trim()
        .toLowerCase();

    const result =
      products.filter(product =>
        product.name
          .toLowerCase()
          .includes(keyword)
      );

    renderProducts(result);

  }
);


/* ---------- PRODUCT DETAIL ---------- */

function viewProduct(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product) return;

  document.getElementById(
    "productDetail"
  ).innerHTML = `

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
      class="btn primary full"
      onclick="addToCart(${product.id}); closeProduct();">
      Thêm vào giỏ
    </button>

  `;

  productModal.classList.add("show");

}


function closeProduct(){

  productModal.classList.remove("show");

}


/* ---------- CART ---------- */

function addToCart(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product) return;


  const exists =
    cart.find(
      item => item.id === id
    );


  if(exists){

    exists.quantity++;

  }else{

    cart.push({
      id:id,
      quantity:1
    });

  }


  save();

  updateCart();

  showToast(
    "Đã thêm sản phẩm vào giỏ."
  );

}


function removeFromCart(id){

  cart =
    cart.filter(
      item => item.id !== id
    );

  save();

  updateCart();

}


function updateCart(){

  cartCount.textContent =
    cart.reduce(
      (total,item) =>
        total + item.quantity,
      0
    );


  if(!cart.length){

    cartItems.innerHTML = `
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;

    cartTotal.textContent =
      money(0);

    return;

  }


  let total = 0;


  cartItems.innerHTML = "";


  cart.forEach(item => {

    const product =
      products.find(
        p => p.id === item.id
      );

    if(!product) return;


    const itemTotal =
      product.price *
      item.quantity;


    total += itemTotal;


    cartItems.innerHTML += `

      <div class="cart-item">

        <div class="cart-item-icon">
          ${product.icon}
        </div>

        <div class="cart-item-info">

          <strong>
            ${product.name}
          </strong>

          <span>
            ${money(product.price)}
            × ${item.quantity}
          </span>

        </div>

        <button
          class="remove-cart"
          onclick="removeFromCart(${product.id})">
          Xóa
        </button>

      </div>

    `;

  });


  cartTotal.textContent =
    money(total);

}


function openCart(){

  updateCart();

  cartModal.classList.add("show");

}


function closeCart(){

  cartModal.classList.remove("show");

}


/* ---------- CHECKOUT ---------- */

function checkout(){

  if(!cart.length){

    showToast(
      "Giỏ hàng đang trống."
    );

    return;

  }


  let total = 0;


  cart.forEach(item => {

    const product =
      products.find(
        p => p.id === item.id
      );

    if(product){

      total +=
        product.price *
        item.quantity;

    }

  });


  if(balance < total){

    showToast(
      "Số dư demo không đủ."
    );

    return;

  }


  balance -= total;


  const order = {

    id:
      "TT" +
      Date.now(),

    date:
      new Date()
        .toLocaleString("vi-VN"),

    total:total,

    items:
      [...cart]

  };


  orders.unshift(order);

  cart = [];


  save();

  updateAll();

  closeCart();


  showToast(
    "Thanh toán thành công!"
  );


  document
    .getElementById("account")
    .scrollIntoView({
      behavior:"smooth"
    });

}


/* ---------- BALANCE ---------- */

function addDemoMoney(){

  balance += 100000;

  save();

  updateAll();

  showToast(
    "Đã cộng 100.000đ demo."
  );

}


/* ---------- ORDERS ---------- */

function renderOrders(){

  orderCount.textContent =
    `${orders.length} đơn`;


  if(!orders.length){

    ordersContainer.innerHTML = `
      <div class="empty">
        Chưa có đơn hàng.
      </div>
    `;

    return;

  }


  ordersContainer.innerHTML = "";


  orders.forEach(order => {

    ordersContainer.innerHTML += `

      <div class="cart-item">

        <div class="cart-item-icon">
          📦
        </div>

        <div class="cart-item-info">

          <strong>
            ${order.id}
          </strong>

          <span>
            ${money(order.total)}
          </span>

          <small>
            ${order.date}
          </small>

        </div>

      </div>

    `;

  });

}


/* ---------- TRANSACTIONS ---------- */

function renderTransactions(){

  if(!orders.length){

    transactionsList.innerHTML = `
      <div class="empty">
        Chưa có giao dịch.
      </div>
    `;

    return;

  }


  transactionsList.innerHTML = "";


  orders.forEach(order => {

    transactionsList.innerHTML += `

      <div class="cart-item">

        <div class="cart-item-icon">
          🛒
        </div>

        <div class="cart-item-info">

          <strong>
            Thanh toán đơn ${order.id}
          </strong>

          <span>
            -${money(order.total)}
          </span>

        </div>

      </div>

    `;

  });

}


/* ---------- UPDATE ---------- */

function updateBalance(){

  walletBalance.textContent =
    money(balance);

  accountBalance.textContent =
    money(balance);

  heroBalance.textContent =
    money(balance);

}


function updateAll(){

  updateBalance();

  updateCart();

  renderOrders();

  renderTransactions();

  document.getElementById(
    "productCount"
  ).textContent =
    products.length;

}


/* ---------- CHAT ---------- */

document
  .getElementById("chatForm")
  .addEventListener(
    "submit",
    function(event){

      event.preventDefault();


      const input =
        document.getElementById(
          "chatInput"
        );


      const text =
        input.value.trim();


      if(!text) return;


      const messages =
        document.getElementById(
          "chatMessages"
        );


      messages.innerHTML += `

        <div class="message">

          <div class="avatar">
            U
          </div>

          <div>

            <strong>
              tuan4422
            </strong>

            <p>
              ${escapeHTML(text)}
            </p>

          </div>

        </div>

      `;


      input.value = "";


      messages.scrollTop =
        messages.scrollHeight;

    }
  );


/* ---------- FORUM ---------- */

function createPost(){

  const title =
    prompt(
      "Nhập tiêu đề bài viết:"
    );


  if(!title) return;


  const forum =
    document.getElementById(
      "forumPosts"
    );


  forum.insertAdjacentHTML(
    "afterbegin",
    `

    <article class="forum-post">

      <div class="forum-icon">
        📝
      </div>

      <div>

        <h3>
          ${escapeHTML(title)}
        </h3>

        <p>
          Bài viết mới của thành viên.
        </p>

        <div class="post-meta">
          tuan4422 · Vừa xong · 0 bình luận
        </div>

      </div>

    </article>

    `
  );


  showToast(
    "Đã tạo bài viết demo."
  );

}


/* ---------- SERVER ---------- */

function copyServerIP(){

  const ip =
    document.getElementById(
      "serverIp"
    ).textContent;


  navigator.clipboard
    .writeText(ip)
    .then(() => {

      showToast(
        "Đã sao chép IP server."
      );

    })
    .catch(() => {

      showToast(
        "Không thể sao chép tự động."
      );

    });

}


/* ---------- TOAST ---------- */

let toastTimer;


function showToast(message){

  toast.textContent =
    message;

  toast.classList.add("show");


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    },2500);

}


/* ---------- ESCAPE ---------- */

function escapeHTML(text){

  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


/* ---------- THEME ---------- */

const themeBtn =
  document.getElementById(
    "themeBtn"
  );


if(
  localStorage.getItem(
    "tuan4422_theme"
  ) === "light"
){

  document.body.classList.add(
    "light"
  );

  themeBtn.textContent = "☀";

}


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


    themeBtn.textContent =
      light ? "☀" : "☾";


    localStorage.setItem(
      "tuan4422_theme",
      light ? "light" : "dark"
    );

  }
);


/* ---------- MOBILE MENU ---------- */

const menuBtn =
  document.getElementById(
    "menuBtn"
  );

const nav =
  document.getElementById(
    "nav"
  );


menuBtn.addEventListener(
  "click",
  () => {

    nav.classList.toggle(
      "open"
    );

  }
);


document
  .querySelectorAll("nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        nav.classList.remove(
          "open"
        );

      }
    );

  });


/* ---------- CART BUTTON ---------- */

document
  .getElementById("cartBtn")
  .addEventListener(
    "click",
    openCart
  );


/* ---------- MODAL BACKGROUND ---------- */

cartModal.addEventListener(
  "click",
  event => {

    if(
      event.target ===
      cartModal
    ){

      closeCart();

    }

  }
);


productModal.addEventListener(
  "click",
  event => {

    if(
      event.target ===
      productModal
    ){

      closeProduct();

    }

  }
);


/* ---------- TOP BUTTON ---------- */

const topBtn =
  document.getElementById(
    "topBtn"
  );


window.addEventListener(
  "scroll",
  () => {

    topBtn.style.display =
      window.scrollY > 500
        ? "block"
        : "none";

  }
);


topBtn.addEventListener(
  "click",
  () => {

    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  }
);


/* ---------- YEAR ---------- */

document.getElementById(
  "year"
).textContent =
  new Date().getFullYear();


/* ---------- START ---------- */

renderProducts();

updateAll();
