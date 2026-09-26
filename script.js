/* =========================================================
   TUAN4422 MARKET
   script.js
   ========================================================= */


/* =========================================================
   STORAGE
   ========================================================= */

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


/* =========================================================
   DEFAULT PRODUCTS
   ========================================================= */

const DEFAULT_PRODUCTS = [

  {
    id: "script-ui",
    name: "Script UI Demo",
    category: "Script",
    price: 49000,
    icon: "UI",
    description: "Bộ giao diện Script demo dành cho người dùng.",
    featured: true
  },

  {
    id: "script-tool",
    name: "Script Utility",
    category: "Script",
    price: 69000,
    icon: "JS",
    description: "Bộ công cụ Script demo.",
    featured: true
  },

  {
    id: "account-demo",
    name: "Tài khoản Demo",
    category: "Account",
    price: 39000,
    icon: "ACC",
    description: "Tài khoản demo hợp pháp để kiểm thử.",
    featured: false
  },

  {
    id: "minecraft-pack",
    name: "Minecraft Setup Pack",
    category: "Minecraft",
    price: 79000,
    icon: "MC",
    description: "Gói cấu hình Minecraft demo.",
    featured: true
  },

  {
    id: "web-template",
    name: "Website Template",
    category: "Script",
    price: 59000,
    icon: "WEB",
    description: "Mẫu website hiện đại dành cho dự án cá nhân.",
    featured: false
  },

  {
    id: "config-pack",
    name: "Config Pack",
    category: "Minecraft",
    price: 29000,
    icon: "CFG",
    description: "Gói cấu hình Minecraft mẫu.",
    featured: false
  }

];


/* =========================================================
   BASIC FUNCTIONS
   ========================================================= */

function getJSON(key, fallback) {

  try {

    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);

  } catch (error) {

    console.error("Storage error:", error);

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

  return new Intl.NumberFormat(
    "vi-VN"
  ).format(Number(value) || 0) + "₫";

}


function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function getProducts() {

  let products = getJSON(
    STORAGE.products,
    null
  );

  if (!Array.isArray(products)) {

    products = DEFAULT_PRODUCTS;

    setJSON(
      STORAGE.products,
      products
    );

  }

  return products;

}


function getCurrentUser() {

  return localStorage.getItem(
    STORAGE.currentUser
  );

}


function getUsers() {

  return getJSON(
    STORAGE.users,
    []
  );

}


function getOrders() {

  return getJSON(
    STORAGE.orders,
    []
  );

}


function getFavorites() {

  return getJSON(
    STORAGE.favorites,
    []
  );

}


function toast(message) {

  const element =
    document.getElementById("toast");

  if (!element) {

    alert(message);

    return;

  }

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(
    toast.timer
  );

  toast.timer = setTimeout(() => {

    element.classList.remove("show");

  }, 2500);

}


/* =========================================================
   ADMIN MENU
   ========================================================= */

function updateAdminMenu() {

  const adminMenu =
    document.getElementById("adminMenu");

  if (!adminMenu) {
    return;
  }

  const isAdmin =
    localStorage.getItem(
      STORAGE.admin
    ) === "true";

  adminMenu.classList.toggle(
    "is-visible",
    isAdmin
  );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

  const menuButton =
    document.getElementById("menuBtn");

  const mainNav =
    document.getElementById("mainNav");

  if (
    menuButton &&
    mainNav
  ) {

    menuButton.addEventListener(
      "click",
      () => {

        mainNav.classList.toggle(
          "open"
        );

      }
    );

  }


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


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.classList.add("open");

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

  modal.classList.remove("open");

  if (
    !document.querySelector(
      ".modal.open"
    )
  ) {

    document.body.classList.remove(
      "modal-open"
    );

  }

}


function setupModals() {

  document
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          closeModal(
            button.dataset.closeModal
          );

        }
      );

    });


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
            ".modal.open"
          )
          .forEach(modal => {

            closeModal(
              modal.id
            );

          });

      }

    }
  );

}


/* =========================================================
   CART
   ========================================================= */

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

  const element =
    document.getElementById(
      "cartCount"
    );

  if (element) {

    element.textContent =
      count;

  }

}


function addToCart(productId, quantity = 1) {

  const products =
    getProducts();

  const product =
    products.find(
      item => item.id === productId
    );

  if (!product) {

    toast(
      "Không tìm thấy sản phẩm."
    );

    return;

  }


  const cart =
    getCart();

  const existing =
    cart.find(
      item => item.id === productId
    );


  if (existing) {

    existing.quantity +=
      quantity;

  } else {

    cart.push({

      id: product.id,

      quantity: quantity

    });

  }


  saveCart(cart);

  toast(
    "Đã thêm vào giỏ hàng."
  );

}


function removeFromCart(productId) {

  const cart =
    getCart().filter(
      item => item.id !== productId
    );

  saveCart(cart);

  renderCart();

}


function changeCartQuantity(
  productId,
  quantity
) {

  const cart =
    getCart();

  const item =
    cart.find(
      product =>
        product.id === productId
    );

  if (!item) {
    return;
  }

  item.quantity =
    Math.max(
      1,
      Number(quantity) || 1
    );

  saveCart(cart);

  renderCart();

}


function calculateCartTotal() {

  const products =
    getProducts();

  const cart =
    getCart();

  return cart.reduce(
    (total, cartItem) => {

      const product =
        products.find(
          item =>
            item.id === cartItem.id
        );

      if (!product) {
        return total;
      }

      return total +
        product.price *
        cartItem.quantity;

    },
    0
  );

}


function renderCart() {

  const container =
    document.getElementById(
      "cartItems"
    );

  const totalElement =
    document.getElementById(
      "cartTotal"
    );

  if (
    !container ||
    !totalElement
  ) {
    return;
  }


  const products =
    getProducts();

  const cart =
    getCart();


  if (cart.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <strong>Giỏ hàng đang trống</strong>
        <p>Hãy thêm sản phẩm từ Shop.</p>
      </div>
    `;

    totalElement.textContent =
      money(0);

    return;

  }


  container.innerHTML =
    cart.map(cartItem => {

      const product =
        products.find(
          item =>
            item.id === cartItem.id
        );

      if (!product) {
        return "";
      }


      const subtotal =
        product.price *
        cartItem.quantity;


      return `

        <div class="cart-item">

          <div class="product-icon">
            ${escapeHTML(product.icon)}
          </div>

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(product.name)}
            </strong>

            <small>
              ${money(product.price)}
            </small>

          </div>


          <div class="cart-quantity">

            <button
              type="button"
              data-cart-minus="${escapeHTML(product.id)}">
              −
            </button>

            <span>
              ${cartItem.quantity}
            </span>

            <button
              type="button"
              data-cart-plus="${escapeHTML(product.id)}">
              +
            </button>

          </div>


          <strong>
            ${money(subtotal)}
          </strong>


          <button
            type="button"
            class="cart-remove"
            data-cart-remove="${escapeHTML(product.id)}">

            ×

          </button>

        </div>

      `;

    }).join("");


  totalElement.textContent =
    money(
      calculateCartTotal()
    );

}


function setupCart() {

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

      const remove =
        event.target.closest(
          "[data-cart-remove]"
        );

      if (remove) {

        removeFromCart(
          remove.dataset.cartRemove
        );

        return;

      }


      const plus =
        event.target.closest(
          "[data-cart-plus]"
        );

      if (plus) {

        const cart =
          getCart();

        const item =
          cart.find(
            x =>
              x.id ===
              plus.dataset.cartPlus
          );

        if (item) {

          changeCartQuantity(
            item.id,
            item.quantity + 1
          );

        }

        return;

      }


      const minus =
        event.target.closest(
          "[data-cart-minus]"
        );

      if (minus) {

        const cart =
          getCart();

        const item =
          cart.find(
            x =>
              x.id ===
              minus.dataset.cartMinus
          );

        if (item) {

          if (
            item.quantity <= 1
          ) {

            removeFromCart(
              item.id
            );

          } else {

            changeCartQuantity(
              item.id,
              item.quantity - 1
            );

          }

        }

      }

    }
  );


  const checkoutButton =
    document.getElementById(
      "checkoutBtn"
    );

  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      checkout
    );

  }

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

  const username =
    getCurrentUser();

  if (!username) {

    toast(
      "Bạn cần đăng nhập trước khi thanh toán."
    );

    setTimeout(() => {

      window.location.href =
        "account.html";

    }, 800);

    return;

  }


  const cart =
    getCart();

  if (!cart.length) {

    toast(
      "Giỏ hàng đang trống."
    );

    return;

  }


  const total =
    calculateCartTotal();


  let balance =
    Number(
      localStorage.getItem(
        STORAGE.balance
      )
    );


  if (
    !Number.isFinite(balance)
  ) {

    balance = 0;

  }


  if (balance < total) {

    toast(
      "Số dư không đủ."
    );

    return;

  }


  balance -= total;


  localStorage.setItem(
    STORAGE.balance,
    String(balance)
  );


  const products =
    getProducts();


  const orderItems =
    cart.map(item => {

      const product =
        products.find(
          p =>
            p.id === item.id
        );

      if (!product) {
        return null;
      }

      return {

        id: product.id,

        name: product.name,

        price: product.price,

        quantity: item.quantity

      };

    }).filter(Boolean);


  const orders =
    getOrders();


  orders.unshift({

    id:
      "ORD-" +
      Date.now(),

    username,

    items: orderItems,

    total,

    date:
      new Date().toISOString(),

    status:
      "Đã thanh toán"

  });


  setJSON(
    STORAGE.orders,
    orders
  );


  saveCart([]);


  renderCart();


  closeModal(
    "cartModal"
  );


  toast(
    "Thanh toán thành công!"
  );


  renderAccount();

  renderAdmin();


}


/* =========================================================
   SHOP
   ========================================================= */

function renderShop(
  searchText = ""
) {

  const container =
    document.getElementById(
      "productGrid"
    );

  if (!container) {
    return;
  }


  const products =
    getProducts();


  const search =
    String(searchText)
      .trim()
      .toLowerCase();


  const filtered =
    products.filter(
      product => {

        if (!search) {
          return true;
        }

        return (
          product.name
            .toLowerCase()
            .includes(search)
          ||
          product.category
            .toLowerCase()
            .includes(search)
          ||
          product.description
            .toLowerCase()
            .includes(search)
        );

      }
    );


  if (!filtered.length) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          Không tìm thấy sản phẩm
        </strong>

        <p>
          Hãy thử từ khóa khác.
        </p>

      </div>

    `;

    return;

  }


  const favorites =
    getFavorites();


  container.innerHTML =
    filtered.map(product => {

      const liked =
        favorites.includes(
          product.id
        );


      return `

        <article
          class="product-card"
          data-product-id="${escapeHTML(product.id)}">


          <div class="product-card-top">

            <div class="product-icon">

              ${escapeHTML(product.icon)}

            </div>


            <button
              type="button"
              class="favorite-button ${liked ? "liked" : ""}"
              data-favorite="${escapeHTML(product.id)}">

              ${liked ? "♥" : "♡"}

            </button>

          </div>


          <span class="product-category">

            ${escapeHTML(product.category)}

          </span>


          <h3>

            ${escapeHTML(product.name)}

          </h3>


          <p>

            ${escapeHTML(product.description)}

          </p>


          <div class="product-card-bottom">


            <strong>

              ${money(product.price)}

            </strong>


            <button
              type="button"
              class="btn btn-primary"
              data-add-cart="${escapeHTML(product.id)}">

              Thêm vào giỏ

            </button>


          </div>


        </article>

      `;

    }).join("");

}


function openProductDetail(
  productId
) {

  const product =
    getProducts().find(
      item =>
        item.id === productId
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


  if (
    !title ||
    !content
  ) {
    return;
  }


  title.textContent =
    product.name;


  content.innerHTML = `

    <div class="product-detail">

      <div class="product-detail-icon">

        ${escapeHTML(product.icon)}

      </div>


      <span class="product-category">

        ${escapeHTML(product.category)}

      </span>


      <h2>

        ${escapeHTML(product.name)}

      </h2>


      <p>

        ${escapeHTML(product.description)}

      </p>


      <strong class="product-detail-price">

        ${money(product.price)}

      </strong>


      <button
        type="button"
        class="btn btn-primary"
        data-detail-add="${escapeHTML(product.id)}">

        Thêm vào giỏ

      </button>

    </div>

  `;


  openModal(
    "productModal"
  );

}


function toggleFavorite(
  productId
) {

  const username =
    getCurrentUser();

  if (!username) {

    toast(
      "Hãy đăng nhập để lưu yêu thích."
    );

    return;

  }


  let favorites =
    getFavorites();


  if (
    favorites.includes(
      productId
    )
  ) {

    favorites =
      favorites.filter(
        id =>
          id !== productId
      );

    toast(
      "Đã bỏ khỏi yêu thích."
    );

  } else {

    favorites.push(
      productId
    );

    toast(
      "Đã thêm vào yêu thích."
    );

  }


  setJSON(
    STORAGE.favorites,
    favorites
  );


  renderShop(
    document.getElementById(
      "shopSearch"
    )?.value || ""
  );


  renderAccount();

}


function setupShop() {

  const search =
    document.getElementById(
      "shopSearch"
    );

  if (search) {

    search.addEventListener(
      "input",
      () => {

        renderShop(
          search.value
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

        return;

      }


      const favorite =
        event.target.closest(
          "[data-favorite]"
        );

      if (favorite) {

        toggleFavorite(
          favorite.dataset.favorite
        );

        return;

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

        return;

      }


      const card =
        event.target.closest(
          ".product-card"
        );

      if (
        card &&
        !event.target.closest(
          "button"
        )
      ) {

        openProductDetail(
          card.dataset.productId
        );

      }

    }
  );


  renderShop();

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function renderAccount() {

  const auth =
    document.getElementById(
      "accountAuth"
    );

  const dashboard =
    document.getElementById(
      "accountDashboard"
    );


  if (
    !auth ||
    !dashboard
  ) {
    return;
  }


  const username =
    getCurrentUser();


  if (!username) {

    auth.hidden = false;

    dashboard.hidden = true;

    return;

  }


  auth.hidden = true;

  dashboard.hidden = false;


  const usernameElement =
    document.getElementById(
      "accountUsername"
    );

  if (usernameElement) {

    usernameElement.textContent =
      username;

  }


  let balance =
    Number(
      localStorage.getItem(
        STORAGE.balance
      )
    );


  if (
    !Number.isFinite(balance)
  ) {

    balance = 0;

  }


  const balanceElement =
    document.getElementById(
      "accountBalance"
    );

  if (balanceElement) {

    balanceElement.textContent =
      money(balance);

  }


  const orders =
    getOrders().filter(
      order =>
        order.username === username
    );


  const orderCount =
    document.getElementById(
      "accountOrderCount"
    );

  if (orderCount) {

    orderCount.textContent =
      orders.length;

  }


  const favorites =
    getFavorites();


  const favoriteCount =
    document.getElementById(
      "accountFavoriteCount"
    );

  if (favoriteCount) {

    favoriteCount.textContent =
      favorites.length;

  }


  renderOrders(
    orders
  );


  renderFavorites(
    favorites
  );

}


function renderOrders(
  orders
) {

  const container =
    document.getElementById(
      "orderList"
    );

  if (!container) {
    return;
  }


  if (!orders.length) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          Chưa có đơn hàng
        </strong>

        <p>
          Các đơn hàng của bạn sẽ xuất hiện tại đây.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    orders.map(order => `

      <div class="order-card">

        <div class="order-header">

          <strong>
            ${escapeHTML(order.id)}
          </strong>

          <span>
            ${escapeHTML(order.status)}
          </span>

        </div>


        <div class="order-date">

          ${new Date(order.date)
            .toLocaleString("vi-VN")}

        </div>


        <div class="order-items">

          ${order.items.map(item => `

            <div class="order-item">

              <span>

                ${escapeHTML(item.name)}
                × ${item.quantity}

              </span>

              <strong>

                ${money(
                  item.price *
                  item.quantity
                )}

              </strong>

            </div>

          `).join("")}

        </div>


        <div class="order-total">

          Tổng:
          <strong>
            ${money(order.total)}
          </strong>

        </div>

      </div>

    `).join("");

}


function renderFavorites(
  favoriteIds
) {

  const container =
    document.getElementById(
      "favoriteList"
    );

  if (!container) {
    return;
  }


  const products =
    getProducts();


  const favorites =
    products.filter(
      product =>
        favoriteIds.includes(
          product.id
        )
    );


  if (!favorites.length) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          Chưa có sản phẩm yêu thích
        </strong>

        <p>
          Bạn có thể nhấn ♡ trong Shop để lưu sản phẩm.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="favorite-grid">

      ${favorites.map(product => `

        <div class="favorite-item">

          <div class="product-icon">

            ${escapeHTML(product.icon)}

          </div>


          <div>

            <strong>

              ${escapeHTML(product.name)}

            </strong>

            <p>

              ${money(product.price)}

            </p>

          </div>


          <button
            type="button"
            class="btn btn-primary"
            data-favorite-cart="${escapeHTML(product.id)}">

            Thêm giỏ

          </button>

        </div>

      `).join("")}

    </div>

  `;

}


function setupAccount() {

  const loginForm =
    document.getElementById(
      "loginForm"
    );


  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const username =
          document.getElementById(
            "loginUsername"
          ).value.trim();


        const password =
          document.getElementById(
            "loginPassword"
          ).value;


        const users =
          getUsers();


        const user =
          users.find(
            item =>
              item.username === username &&
              item.password === password
          );


        if (!user) {

          toast(
            "Sai tài khoản hoặc mật khẩu."
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
          "Đăng nhập thành công!"
        );


        loginForm.reset();

        renderAccount();

      }
    );

  }


  const registerForm =
    document.getElementById(
      "registerForm"
    );


  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const username =
          document.getElementById(
            "registerUsername"
          ).value.trim();


        const password =
          document.getElementById(
            "registerPassword"
          ).value;


        if (
          username.length < 3
        ) {

          toast(
            "Tên tài khoản phải có ít nhất 3 ký tự."
          );

          return;

        }


        if (
          password.length < 4
        ) {

          toast(
            "Mật khẩu phải có ít nhất 4 ký tự."
          );

          return;

        }


        const users =
          getUsers();


        if (
          users.some(
            user =>
              user.username.toLowerCase() ===
              username.toLowerCase()
          )
        ) {

          toast(
            "Tên tài khoản đã tồn tại."
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
          "Tạo tài khoản thành công!"
        );


        registerForm.reset();

        renderAccount();

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

        toast(
          "Đã đăng xuất."
        );

        renderAccount();

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      const addFavoriteCart =
        event.target.closest(
          "[data-favorite-cart]"
        );

      if (
        addFavoriteCart
      ) {

        addToCart(
          addFavoriteCart.dataset.favoriteCart
        );

      }

    }
  );


  renderAccount();

}


/* =========================================================
   WALLET
   ========================================================= */

function renderWallet() {

  const balanceElement =
    document.getElementById(
      "walletBalance"
    );

  if (!balanceElement) {
    return;
  }


  let balance =
    Number(
      localStorage.getItem(
        STORAGE.balance
      )
    );


  if (
    !Number.isFinite(balance)
  ) {

    balance = 0;

  }


  balanceElement.textContent =
    money(balance);

}


function setupWallet() {

  renderWallet();


  const addMoney =
    document.getElementById(
      "demoAddMoney"
    );


  if (addMoney) {

    addMoney.addEventListener(
      "click",
      () => {

        const username =
          getCurrentUser();


        if (!username) {

          toast(
            "Bạn cần đăng nhập trước."
          );

          return;

        }


        let balance =
          Number(
            localStorage.getItem(
              STORAGE.balance
            )
          );


        if (
          !Number.isFinite(balance)
        ) {

          balance = 0;

        }


        balance +=
          100000;


        localStorage.setItem(
          STORAGE.balance,
          String(balance)
        );


        renderWallet();

        renderAccount();

        toast(
          "Đã cộng 100.000₫ demo."
        );

      }
    );

  }

}


/* =========================================================
   CHAT
   ========================================================= */

function renderChat() {

  const container =
    document.getElementById(
      "chatMessages"
    );

  if (!container) {
    return;
  }


  let messages =
    getJSON(
      STORAGE.chat,
      []
    );


  if (!messages.length) {

    messages = [

      {
        username: "TUAN4422",
        message: "Chào mừng bạn đến với chat!",
        date: new Date().toISOString()
      }

    ];

    setJSON(
      STORAGE.chat,
      messages
    );

  }


  container.innerHTML =
    messages.map(message => `

      <div class="chat-message">

        <strong>
          ${escapeHTML(message.username)}
        </strong>

        <span>
          ${escapeHTML(message.message)}
        </span>

      </div>

    `).join("");


  container.scrollTop =
    container.scrollHeight;

}


function setupChat() {

  const form =
    document.getElementById(
      "chatForm"
    );


  if (!form) {
    return;
  }


  renderChat();


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const username =
        getCurrentUser();


      if (!username) {

        toast(
          "Bạn cần đăng nhập để chat."
        );

        return;

      }


      const input =
        document.getElementById(
          "chatInput"
        );


      const message =
        input.value.trim();


      if (!message) {
        return;
      }


      const messages =
        getJSON(
          STORAGE.chat,
          []
        );


      messages.push({

        username,

        message,

        date:
          new Date().toISOString()

      });


      setJSON(
        STORAGE.chat,
        messages
      );


      input.value = "";

      renderChat();

    }
  );

}


/* =========================================================
   FORUM
   ========================================================= */

function renderForum() {

  const container =
    document.getElementById(
      "forumList"
    );

  if (!container) {
    return;
  }


  const posts =
    getJSON(
      STORAGE.forum,
      []
    );


  if (!posts.length) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          Chưa có bài viết
        </strong>

        <p>
          Hãy tạo bài viết đầu tiên.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    posts.map(post => `

      <article class="forum-post">

        <div class="forum-post-header">

          <strong>
            ${escapeHTML(post.title)}
          </strong>

          <span>
            ${escapeHTML(post.username)}
          </span>

        </div>


        <p>

          ${escapeHTML(post.content)}

        </p>


        <small>

          ${new Date(post.date)
            .toLocaleString("vi-VN")}

        </small>

      </article>

    `).join("");

}


function setupForum() {

  const form =
    document.getElementById(
      "forumForm"
    );


  if (!form) {
    return;
  }


  renderForum();


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const username =
        getCurrentUser();


      if (!username) {

        toast(
          "Bạn cần đăng nhập để đăng bài."
        );

        return;

      }


      const title =
        document.getElementById(
          "forumTitle"
        ).value.trim();


      const content =
        document.getElementById(
          "forumContent"
        ).value.trim();


      if (
        !title ||
        !content
      ) {

        return;

      }


      const posts =
        getJSON(
          STORAGE.forum,
          []
        );


      posts.unshift({

        id:
          Date.now(),

        username,

        title,

        content,

        date:
          new Date().toISOString()

      });


      setJSON(
        STORAGE.forum,
        posts
      );


      form.reset();

      renderForum();

      toast(
        "Đã đăng bài."
      );

    }
  );

}


/* =========================================================
   ADMIN
   ========================================================= */

function isAdmin() {

  return (
    localStorage.getItem(
      STORAGE.admin
    ) === "true"
  );

}


function setupAdminLogin() {

  const form =
    document.getElementById(
      "adminLoginForm"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
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
          "Đăng nhập Admin thành công!"
        );


        updateAdminMenu();

        renderAdmin();

        form.reset();

      } else {

        toast(
          "Sai tài khoản hoặc mật khẩu Admin."
        );

      }

    }
  );

}


function renderAdmin() {

  const login =
    document.getElementById(
      "adminLogin"
    );

  const dashboard =
    document.getElementById(
      "adminDashboard"
    );


  if (
    !login ||
    !dashboard
  ) {
    return;
  }


  if (!isAdmin()) {

    login.hidden = false;

    dashboard.hidden = true;

    return;

  }


  login.hidden = true;

  dashboard.hidden = false;


  renderAdminStats();

  renderAdminProducts();

  renderAdminOrders();

}


function renderAdminStats() {

  const products =
    getProducts();

  const orders =
    getOrders();

  const users =
    getUsers();


  const productCount =
    document.getElementById(
      "adminProductCount"
    );

  const orderCount =
    document.getElementById(
      "adminOrderCount"
    );

  const userCount =
    document.getElementById(
      "adminUserCount"
    );


  if (productCount) {

    productCount.textContent =
      products.length;

  }


  if (orderCount) {

    orderCount.textContent =
      orders.length;

  }


  if (userCount) {

    userCount.textContent =
      users.length;

  }

}


/* =========================================================
   ADMIN PRODUCTS
   ========================================================= */

function renderAdminProducts() {

  const container =
    document.getElementById(
      "adminProductList"
    );

  if (!container) {
    return;
  }


  const products =
    getProducts();


  if (!products.length) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          Chưa có sản phẩm
        </strong>

      </div>

    `;

    return;

  }


  container.innerHTML =
    products.map(product => `

      <div
        class="admin-product-item">


        <div class="admin-product-icon">

          ${escapeHTML(product.icon)}

        </div>


        <div class="admin-product-info">

          <strong>

            ${escapeHTML(product.name)}

          </strong>

          <span>

            ${escapeHTML(product.category)}

          </span>

          <small>

            ${money(product.price)}

          </small>

        </div>


        <div class="admin-product-actions">


          <button
            type="button"
            class="btn btn-secondary"
            data-edit-product="${escapeHTML(product.id)}">

            Sửa

          </button>


          <button
            type="button"
            class="btn btn-danger"
            data-delete-product="${escapeHTML(product.id)}">

            Xóa

          </button>


        </div>


      </div>

    `).join("");

}


function resetProductForm() {

  const form =
    document.getElementById(
      "productForm"
    );

  if (form) {
    form.reset();
  }


  const id =
    document.getElementById(
      "productId"
    );

  if (id) {
    id.value = "";
  }


  const title =
    document.getElementById(
      "productFormTitle"
    );

  if (title) {

    title.textContent =
      "Thêm sản phẩm";

  }


  const button =
    document.getElementById(
      "saveProductBtn"
    );

  if (button) {

    button.textContent =
      "Thêm sản phẩm";

  }


  const cancel =
    document.getElementById(
      "cancelEditBtn"
    );

  if (cancel) {

    cancel.hidden = true;

  }

}


function editProduct(
  productId
) {

  const product =
    getProducts().find(
      item =>
        item.id === productId
    );


  if (!product) {
    return;
  }


  document.getElementById(
    "productId"
  ).value =
    product.id;


  document.getElementById(
    "productName"
  ).value =
    product.name;


  document.getElementById(
    "productCategory"
  ).value =
    product.category;


  document.getElementById(
    "productPrice"
  ).value =
    product.price;


  document.getElementById(
    "productIcon"
  ).value =
    product.icon;


  document.getElementById(
    "productDescription"
  ).value =
    product.description;


  document.getElementById(
    "productFeatured"
  ).checked =
    Boolean(product.featured);


  const title =
    document.getElementById(
      "productFormTitle"
    );

  if (title) {

    title.textContent =
      "Chỉnh sửa sản phẩm";

  }


  const button =
    document.getElementById(
      "saveProductBtn"
    );

  if (button) {

    button.textContent =
      "Lưu thay đổi";

  }


  const cancel =
    document.getElementById(
      "cancelEditBtn"
    );

  if (cancel) {

    cancel.hidden = false;

  }


  document
    .getElementById(
      "productForm"
    )
    ?.scrollIntoView({
      behavior: "smooth"
    });

}


function deleteProduct(
  productId
) {

  const product =
    getProducts().find(
      item =>
        item.id === productId
    );


  if (!product) {
    return;
  }


  const confirmed =
    confirm(
      `Bạn có chắc muốn xóa "${product.name}" không?`
    );


  if (!confirmed) {
    return;
  }


  const products =
    getProducts().filter(
      item =>
        item.id !== productId
    );


  setJSON(
    STORAGE.products,
    products
  );


  const cart =
    getCart().filter(
      item =>
        item.id !== productId
    );


  saveCart(cart);


  const favorites =
    getFavorites().filter(
      id =>
        id !== productId
    );


  setJSON(
    STORAGE.favorites,
    favorites
  );


  renderAdmin();

  renderShop();


  toast(
    "Đã xóa sản phẩm."
  );

}


function setupAdminProducts() {

  const form =
    document.getElementById(
      "productForm"
    );


  if (form) {

    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        if (!isAdmin()) {

          toast(
            "Bạn không có quyền Admin."
          );

          return;

        }


        const id =
          document.getElementById(
            "productId"
          ).value.trim();


        const name =
          document.getElementById(
            "productName"
          ).value.trim();


        const category =
          document.getElementById(
            "productCategory"
          ).value;


        const price =
          Number(
            document.getElementById(
              "productPrice"
            ).value
          );


        const icon =
          document.getElementById(
            "productIcon"
          ).value.trim()
          || "ITEM";


        const description =
          document.getElementById(
            "productDescription"
          ).value.trim()
          || "Sản phẩm TUAN4422 MARKET.";


        const featured =
          document.getElementById(
            "productFeatured"
          ).checked;


        if (!name) {

          toast(
            "Hãy nhập tên sản phẩm."
          );

          return;

        }


        if (
          !Number.isFinite(price) ||
          price < 0
        ) {

          toast(
            "Giá sản phẩm không hợp lệ."
          );

          return;

        }


        const products =
          getProducts();


        if (id) {

          const product =
            products.find(
              item =>
                item.id === id
            );


          if (!product) {

            toast(
              "Không tìm thấy sản phẩm."
            );

            return;

          }


          product.name =
            name;

          product.category =
            category;

          product.price =
            price;

          product.icon =
            icon;

          product.description =
            description;

          product.featured =
            featured;


          toast(
            "Đã cập nhật sản phẩm."
          );

        } else {


          let newId =
            "product-" +
            Date.now();


          while (
            products.some(
              product =>
                product.id === newId
            )
          ) {

            newId +=
              "-1";

          }


          products.push({

            id: newId,

            name,

            category,

            price,

            icon,

            description,

            featured

          });


          toast(
            "Đã thêm sản phẩm."
          );

        }


        setJSON(
          STORAGE.products,
          products
        );


        resetProductForm();

        renderAdmin();

        renderShop();

      }
    );

  }


  const cancel =
    document.getElementById(
      "cancelEditBtn"
    );


  if (cancel) {

    cancel.addEventListener(
      "click",
      resetProductForm
    );

  }


  const refresh =
    document.getElementById(
      "refreshProductsBtn"
    );


  if (refresh) {

    refresh.addEventListener(
      "click",
      renderAdmin
    );

  }


  document.addEventListener(
    "click",
    event => {

      const edit =
        event.target.closest(
          "[data-edit-product]"
        );


      if (edit) {

        editProduct(
          edit.dataset.editProduct
        );

        return;

      }


      const remove =
        event.target.closest(
          "[data-delete-product]"
        );


      if (remove) {

        deleteProduct(
          remove.dataset.deleteProduct
        );

      }

    }
  );

}


/* =========================================================
   ADMIN ORDERS
   ========================================================= */

function renderAdminOrders() {

  const container =
    document.getElementById(
      "adminOrderList"
    );

  if (!container) {
    return;
  }


  const orders =
    getOrders();


  if (!orders.length) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          Chưa có đơn hàng
        </strong>

        <p>
          Khi có người mua hàng, đơn hàng sẽ xuất hiện ở đây.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    orders.map(order => `

      <div class="order-card">


        <div class="order-header">

          <strong>
            ${escapeHTML(order.id)}
          </strong>

          <span>
            ${escapeHTML(order.status)}
          </span>

        </div>


        <div>

          Người mua:
          <strong>
            ${escapeHTML(order.username)}
          </strong>

        </div>


        <div class="order-date">

          ${new Date(order.date)
            .toLocaleString("vi-VN")}

        </div>


        <div class="order-items">

          ${order.items.map(item => `

            <div class="order-item">

              <span>

                ${escapeHTML(item.name)}
                × ${item.quantity}

              </span>

              <strong>

                ${money(
                  item.price *
                  item.quantity
                )}

              </strong>

            </div>

          `).join("")}

        </div>


        <div class="order-total">

          Tổng:
          <strong>
            ${money(order.total)}
          </strong>

        </div>


      </div>

    `).join("");

}


function setupAdminOrders() {

  const refresh =
    document.getElementById(
      "refreshOrdersBtn"
    );


  if (refresh) {

    refresh.addEventListener(
      "click",
      renderAdmin
    );

  }

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Navigation
    */

    setupNavigation();


    /*
      Modal
    */

    setupModals();


    /*
      Cart
    */

    setupCart();

    updateCartCount();


    /*
      Admin menu
    */

    updateAdminMenu();


    /*
      Shop
    */

    setupShop();


    /*
      Account
    */

    setupAccount();


    /*
      Wallet
    */

    setupWallet();


    /*
      Chat
    */

    setupChat();


    /*
      Forum
    */

    setupForum();


    /*
      Admin
    */

    setupAdminLogin();

    setupAdminProducts();

    setupAdminOrders();

    renderAdmin();


  }
);
