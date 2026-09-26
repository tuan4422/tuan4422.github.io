/* =====================================
   TUAN4422 MARKET - MULTI PAGE
===================================== */


/* ---------- PRODUCTS ---------- */

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
    description:"Bộ công cụ script tiện ích."
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
    description:"Mẫu website hiện đại."
  },

  {
    id:7,
    name:"Discord Bot",
    icon:"🤖",
    price:55000,
    badge:"BOT",
    description:"Bot mẫu cho server cộng đồng."
  },

  {
    id:8,
    name:"UI Pack",
    icon:"🎨",
    price:30000,
    badge:"DESIGN",
    description:"Bộ giao diện mẫu."
  }

];


/* ---------- DATA ---------- */

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


/* ---------- FORMAT ---------- */

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


/* ---------- THEME ---------- */

const themeBtn =
  document.getElementById("themeBtn");

if(
  localStorage.getItem(
    "tuan4422_theme"
  ) === "light"
){

  document.body.classList.add("light");

  if(themeBtn){
    themeBtn.textContent="☀";
  }

}

if(themeBtn){

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

}


/* ---------- MOBILE MENU ---------- */

const menuBtn =
  document.getElementById("menuBtn");

const nav =
  document.getElementById("nav");

if(menuBtn && nav){

  menuBtn.addEventListener(
    "click",
    () => {

      nav.classList.toggle("open");

    }
  );

}


/* ---------- CART COUNT ---------- */

function updateCartCount(){

  const element =
    document.getElementById("cartCount");

  if(!element) return;

  element.textContent =
    cart.reduce(
      (sum,item) =>
        sum + item.quantity,
      0
    );

}

updateCartCount();


/* ---------- SHOP ---------- */

const productsContainer =
  document.getElementById("products");

function renderProducts(list=products){

  if(!productsContainer) return;

  productsContainer.innerHTML="";


  if(!list.length){

    productsContainer.innerHTML=`
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


renderProducts();


/* ---------- SEARCH ---------- */

const searchInput =
  document.getElementById("searchInput");

if(searchInput){

  searchInput.addEventListener(
    "input",
    function(){

      const keyword =
        this.value
          .toLowerCase()
          .trim();

      renderProducts(
        products.filter(product =>
          product.name
            .toLowerCase()
            .includes(keyword)
        )
      );

    }
  );

}


/* ---------- PRODUCT ---------- */

function viewProduct(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product) return;


  const detail =
    document.getElementById(
      "productDetail"
    );

  const modal =
    document.getElementById(
      "productModal"
    );


  if(!detail || !modal) return;


  detail.innerHTML=`

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
      onclick="
        addToCart(${product.id});
        closeProduct();
      ">
      Thêm vào giỏ
    </button>

  `;


  modal.classList.add("show");

}


function closeProduct(){

  const modal =
    document.getElementById(
      "productModal"
    );

  if(modal){
    modal.classList.remove("show");
  }

}


/* ---------- ADD CART ---------- */

function addToCart(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product) return;


  const existing =
    cart.find(
      item => item.id === id
    );


  if(existing){

    existing.quantity++;

  }else{

    cart.push({
      id:id,
      quantity:1
    });

  }


  save();

  updateCartCount();

  showToast(
    "Đã thêm vào giỏ hàng."
  );

}


/* ---------- OPEN CART ---------- */

const cartBtn =
  document.getElementById("cartBtn");

if(cartBtn){

  cartBtn.addEventListener(
    "click",
    openCart
  );

}


function openCart(){

  renderCart();

  const modal =
    document.getElementById(
      "cartModal"
    );

  if(modal){
    modal.classList.add("show");
  }

}


function closeCart(){

  const modal =
    document.getElementById(
      "cartModal"
    );

  if(modal){
    modal.classList.remove("show");
  }

}


/* ---------- CART ---------- */

function renderCart(){

  const container =
    document.getElementById(
      "cartItems"
    );

  const totalElement =
    document.getElementById(
      "cartTotal"
    );


  if(!container) return;


  if(!cart.length){

    container.innerHTML=`
      <div class="empty">
        Giỏ hàng đang trống.
      </div>
    `;

    if(totalElement){
      totalElement.textContent=
        money(0);
    }

    return;

  }


  let total=0;

  container.innerHTML="";


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


    container.innerHTML += `

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


  if(totalElement){
    totalElement.textContent=
      money(total);
  }

}


function removeFromCart(id){

  cart =
    cart.filter(
      item => item.id !== id
    );

  save();

  updateCartCount();

  renderCart();

}


/* ---------- CHECKOUT ---------- */

function checkout(){

  if(!cart.length){

    showToast(
      "Giỏ hàng đang trống."
    );

    return;

  }


  let total=0;


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
      "Số dư không đủ."
    );

    return;

  }


  balance -= total;


  orders.unshift({

    id:
      "TT" +
      Date.now(),

    date:
      new Date()
        .toLocaleString("vi-VN"),

    total:total

  });


  cart=[];


  save();

  updateCartCount();

  closeCart();


  showToast(
    "Thanh toán thành công!"
  );

}


/* ---------- BALANCE ---------- */

function updateBalance(){

  const elements = [

    document.getElementById(
      "walletBalance"
    ),

    document.getElementById(
      "accountBalance"
    ),

    document.getElementById(
      "heroBalance"
    )

  ];


  elements.forEach(element => {

    if(element){
      element.textContent=
        money(balance);
    }

  });

}


updateBalance();


function addDemoMoney(){

  balance += 100000;

  save();

  updateBalance();

  showToast(
    "Đã nạp 100.000đ demo."
  );

}


/* ---------- ORDERS ---------- */

function renderOrders(){

  const container =
    document.getElementById(
      "orders"
    );

  const count =
    document.getElementById(
      "orderCount"
    );


  if(!container) return;


  if(count){

    count.textContent =
      `${orders.length} đơn`;

  }


  if(!orders.length){

    container.innerHTML=`
      <div class="empty">
        Chưa có đơn hàng.
      </div>
    `;

    return;

  }


  container.innerHTML="";


  orders.forEach(order => {

    container.innerHTML += `

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

renderOrders();


/* ---------- TRANSACTIONS ---------- */

function renderTransactions(){

  const container =
    document.getElementById(
      "transactionsList"
    );


  if(!container) return;


  if(!orders.length){

    container.innerHTML=`
      <div class="empty">
        Chưa có giao dịch.
      </div>
    `;

    return;

  }


  container.innerHTML="";


  orders.forEach(order => {

    container.innerHTML += `

      <div class="cart-item">

        <div class="cart-item-icon">
          🛒
        </div>

        <div class="cart-item-info">

          <strong>
            Thanh toán ${order.id}
          </strong>

          <span>
            -${money(order.total)}
          </span>

        </div>

      </div>

    `;

  });

}

renderTransactions();


/* ---------- CHAT ---------- */

const chatForm =
  document.getElementById(
    "chatForm"
  );


if(chatForm){

  chatForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const input =
        document.getElementById(
          "chatInput"
        );


      const messages =
        document.getElementById(
          "chatMessages"
        );


      const text =
        input.value.trim();


      if(!text) return;


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


      input.value="";

    }
  );

}


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


  if(!forum) return;


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

  const element =
    document.getElementById(
      "serverIp"
    );


  if(!element) return;


  const ip =
    element.textContent.trim();


  navigator.clipboard
    .writeText(ip)
    .then(() => {

      showToast(
        "Đã sao chép IP."
      );

    })
    .catch(() => {

      showToast(
        "Không thể sao chép."
      );

    });

}


/* ---------- TOAST ---------- */

let toastTimer;


function showToast(message){

  const element =
    document.getElementById(
      "toast"
    );


  if(!element) return;


  element.textContent =
    message;

  element.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(() => {

      element.classList.remove(
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


/* ---------- YEAR ---------- */

const year =
  document.getElementById(
    "year"
  );

if(year){

  year.textContent =
    new Date().getFullYear();

}
