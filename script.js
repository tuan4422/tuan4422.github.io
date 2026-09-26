"use strict";

/* =========================
   BASIC
========================= */

const money = value =>
    Number(value || 0).toLocaleString("vi-VN") + "$";

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* =========================
   THEME
========================= */

function setupTheme() {
    const button = document.getElementById("themeBtn");

    const theme = localStorage.getItem("tuan4422_theme");

    if (theme === "light") {
        document.body.classList.add("light");
    }

    if (!button) return;

    button.onclick = () => {
        document.body.classList.toggle("light");

        localStorage.setItem(
            "tuan4422_theme",
            document.body.classList.contains("light")
                ? "light"
                : "dark"
        );
    };
}

/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {
    const button = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("mainNav");

    if (!button || !nav) return;

    button.onclick = () => {
        nav.classList.toggle("open");
    };

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });
}

/* =========================
   ADMIN MENU
========================= */

function updateAdminMenu() {
    const admin = localStorage.getItem(STORAGE.admin) === "true";

    document.querySelectorAll(".admin-only").forEach(element => {
        element.classList.toggle("is-visible", admin);
    });
}

/* =========================
   PRODUCT IMAGE
========================= */

function createProductImage(product, className = "") {

    const wrapper = document.createElement("div");

    wrapper.className =
        "product-image " + className;

    if (product.image) {

        const img = document.createElement("img");

        img.src = product.image;
        img.alt = product.name;

        img.onerror = () => {

            img.remove();

            const fallback = document.createElement("div");

            fallback.className = "image-name";

            fallback.textContent = product.name;

            wrapper.appendChild(fallback);
        };

        wrapper.appendChild(img);

    } else {

        const fallback = document.createElement("div");

        fallback.className = "image-name";

        fallback.textContent = product.name;

        wrapper.appendChild(fallback);
    }

    return wrapper;
}

/* =========================
   PRODUCT CARD
========================= */

function createProductCard(product) {

    const card = document.createElement("article");

    card.className = "product-card";

    const image = createProductImage(product);

    card.appendChild(image);

    const content = document.createElement("div");

    content.className = "product-content";

    content.innerHTML = `
        <div class="product-category">
            ${escapeHTML(product.category)}
        </div>

        <h3>${escapeHTML(product.name)}</h3>

        <p>
            ${escapeHTML(product.description || "")}
        </p>

        <div class="product-bottom">

            <strong class="product-price">
                ${money(product.price)}
            </strong>

            <button class="btn btn-primary product-view">
                Xem
            </button>

        </div>
    `;

    card.appendChild(content);

    card.querySelector(".product-view").onclick = () => {
        openProduct(product.id);
    };

    return card;
}

function escapeHTML(text) {

    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================
   HOME PRODUCTS
========================= */

function renderFeaturedProducts() {

    const container =
        document.getElementById("featuredProducts");

    if (!container) return;

    const products = loadProducts();

    const featured =
        products.filter(product => product.featured);

    const list =
        featured.length
            ? featured.slice(0, 4)
            : products.slice(0, 4);

    container.innerHTML = "";

    list.forEach(product => {
        container.appendChild(
            createProductCard(product)
        );
    });

    const count =
        document.getElementById("homeProductCount");

    if (count) {
        count.textContent = products.length;
    }
}

/* =========================
   SHOP
========================= */

let currentCategory = "all";
let currentSearch = "";

function renderShop() {

    const container =
        document.getElementById("productGrid");

    if (!container) return;

    const products = loadProducts();

    let result = products.filter(product => {

        const categoryOK =
            currentCategory === "all" ||
            product.category === currentCategory;

        const searchOK =
            product.name
                .toLowerCase()
                .includes(currentSearch.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(currentSearch.toLowerCase());

        return categoryOK && searchOK;
    });

    container.innerHTML = "";

    if (!result.length) {

        container.innerHTML = `
            <div class="empty-state">
                Không tìm thấy sản phẩm.
            </div>
        `;

        return;
    }

    result.forEach(product => {
        container.appendChild(
            createProductCard(product)
        );
    });
}

function setupShop() {

    if (!document.getElementById("productGrid")) {
        return;
    }

    renderShop();

    const search =
        document.getElementById("searchInput");

    if (search) {

        search.addEventListener("input", () => {

            currentSearch = search.value;

            renderShop();
        });
    }

    document.querySelectorAll(".category").forEach(button => {

        button.onclick = () => {

            document.querySelectorAll(".category")
                .forEach(item =>
                    item.classList.remove("active")
                );

            button.classList.add("active");

            currentCategory =
                button.dataset.category;

            renderShop();
        };
    });

    const cartButton =
        document.getElementById("cartBtn");

    if (cartButton) {
        cartButton.onclick = openCart;
    }

    updateCartCount();
}

/* =========================
   PRODUCT MODAL
========================= */

function openProduct(productId) {

    const product =
        loadProducts().find(
            item => item.id === productId
        );

    if (!product) return;

    const modal =
        document.getElementById("productModal");

    const title =
        document.getElementById("detailTitle");

    const content =
        document.getElementById("detailContent");

    if (!modal || !title || !content) return;

    title.textContent = product.name;

    content.innerHTML = "";

    const image =
        createProductImage(
            product,
            "detail-image"
        );

    content.appendChild(image);

    const info =
        document.createElement("div");

    info.className = "detail-info";

    info.innerHTML = `
        <div class="product-category">
            ${escapeHTML(product.category)}
        </div>

        <p class="detail-description">
            ${escapeHTML(product.description || "")}
        </p>

        <strong class="detail-price">
            ${money(product.price)}
        </strong>

        <div class="detail-actions">

            <button
                class="btn btn-primary"
                id="detailBuy"
            >
                Thêm vào giỏ
            </button>

            <button
                class="btn btn-secondary"
                id="detailFavorite"
            >
                ♡ Yêu thích
            </button>

        </div>
    `;

    content.appendChild(info);

    document.getElementById("detailBuy").onclick = () => {

        addToCart(product.id);

        closeModal(modal);
    };

    document.getElementById("detailFavorite").onclick = () => {

        toggleFavorite(product.id);
    };

    openModal(modal);
}

/* =========================
   MODAL
========================= */

function openModal(modal) {

    if (!modal) return;

    modal.classList.add("open");

    document.body.style.overflow = "hidden";
}

function closeModal(modal) {

    if (!modal) return;

    modal.classList.remove("open");

    document.body.style.overflow = "";
}

function closeAllModals() {

    document.querySelectorAll(".modal")
        .forEach(modal => {
            modal.classList.remove("open");
        });

    document.body.style.overflow = "";
}

function setupModals() {

    document.querySelectorAll(
        ".modal-close, [data-close-modal]"
    ).forEach(button => {

        button.onclick = event => {

            event.preventDefault();

            const modal =
                button.closest(".modal");

            closeModal(modal);
        };
    });

    document.querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener("click", event => {

                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeAllModals();
        }
    });
}

/* =========================
   CART
========================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE.cart)
        ) || [];

    } catch {

        return [];
    }
}

function saveCart(cart) {

    localStorage.setItem(
        STORAGE.cart,
        JSON.stringify(cart)
    );
}

function addToCart(productId) {

    const cart = getCart();

    const existing =
        cart.find(item =>
            item.productId === productId
        );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            productId,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();

    showToast("Đã thêm vào giỏ hàng.");
}

function removeFromCart(productId) {

    const cart =
        getCart().filter(
            item => item.productId !== productId
        );

    saveCart(cart);

    renderCart();

    updateCartCount();
}

function changeCartQuantity(productId, amount) {

    const cart = getCart();

    const item =
        cart.find(
            product => product.productId === productId
        );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }

    if (item.quantity > 64) {
        item.quantity = 64;
    }

    saveCart(cart);

    renderCart();

    updateCartCount();
}

function updateCartCount() {

    const count =
        document.getElementById("cartCount");

    if (!count) return;

    const total =
        getCart().reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    count.textContent = total;
}

function renderCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");

    if (!container) return;

    const cart = getCart();

    const products = loadProducts();

    container.innerHTML = "";

    if (!cart.length) {

        container.innerHTML = `
            <div class="empty-state">
                Giỏ hàng đang trống.
            </div>
        `;

        if (totalElement) {
            totalElement.textContent = "0$";
        }

        return;
    }

    let total = 0;

    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.productId
            );

        if (!product) return;

        total +=
            product.price *
            item.quantity;

        const row =
            document.createElement("div");

        row.className = "cart-row";

        row.innerHTML = `
            <div class="cart-product">
                <strong>
                    ${escapeHTML(product.name)}
                </strong>

                <span>
                    ${money(product.price)}
                </span>
            </div>

            <div class="cart-actions">

                <button
                    class="quantity-btn"
                    data-minus
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    class="quantity-btn"
                    data-plus
                >
                    +
                </button>

                <button
                    class="remove-btn"
                    data-remove
                >
                    Xóa
                </button>

            </div>
        `;

        row.querySelector("[data-minus]")
            .onclick = () =>
                changeCartQuantity(
                    product.id,
                    -1
                );

        row.querySelector("[data-plus]")
            .onclick = () =>
                changeCartQuantity(
                    product.id,
                    1
                );

        row.querySelector("[data-remove]")
            .onclick = () =>
                removeFromCart(product.id);

        container.appendChild(row);
    });

    if (totalElement) {
        totalElement.textContent = money(total);
    }
}

function openCart() {

    const modal =
        document.getElementById("cartModal");

    if (!modal) return;

    renderCart();

    openModal(modal);
}

/* =========================
   CHECKOUT
========================= */

function setupCheckout() {

    const button =
        document.getElementById("checkoutBtn");

    if (!button) return;

    button.onclick = () => {

        const user =
            localStorage.getItem(
                STORAGE.currentUser
            );

        if (!user) {

            showToast(
                "Vui lòng đăng nhập trước."
            );

            return;
        }

        const cart = getCart();

        if (!cart.length) {

            showToast(
                "Giỏ hàng đang trống."
            );

            return;
        }

        let balance =
            Number(
                localStorage.getItem(
                    STORAGE.balance
                ) || 100000
            );

        const products =
            loadProducts();

        let total = 0;

        cart.forEach(item => {

            const product =
                products.find(
                    p =>
                        p.id === item.productId
                );

            if (product) {
                total +=
                    product.price *
                    item.quantity;
            }
        });

        if (balance < total) {

            showToast(
                "Số dư không đủ."
            );

            return;
        }

        balance -= total;

        localStorage.setItem(
            STORAGE.balance,
            String(balance)
        );

        const orders =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.orders
                )
            ) || [];

        orders.push({

            id:
                "ORD-" +
                Date.now(),

            username: user,

            items: cart,

            total,

            date:
                new Date().toLocaleString(
                    "vi-VN"
                )
        });

        localStorage.setItem(
            STORAGE.orders,
            JSON.stringify(orders)
        );

        saveCart([]);

        updateCartCount();

        renderCart();

        showToast(
            "Thanh toán thành công."
        );
    };
}

/* =========================
   FAVORITES
========================= */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                STORAGE.favorites
            )
        ) || [];

    } catch {

        return [];
    }
}

function saveFavorites(list) {

    localStorage.setItem(
        STORAGE.favorites,
        JSON.stringify(list)
    );
}

function toggleFavorite(productId) {

    const favorites =
        getFavorites();

    const index =
        favorites.indexOf(productId);

    if (index >= 0) {

        favorites.splice(index, 1);

        showToast(
            "Đã bỏ khỏi yêu thích."
        );

    } else {

        favorites.push(productId);

        showToast(
            "Đã thêm vào yêu thích."
        );
    }

    saveFavorites(favorites);

    renderAccount();
}

/* =========================
   ACCOUNT
========================= */

function setupAccount() {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    if (loginForm) {

        loginForm.onsubmit = event => {

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
                JSON.parse(
                    localStorage.getItem(
                        STORAGE.users
                    )
                ) || [];

            const user =
                users.find(
                    item =>
                        item.username === username &&
                        item.password === password
                );

            if (!user) {

                showToast(
                    "Sai tài khoản hoặc mật khẩu."
                );

                return;
            }

            localStorage.setItem(
                STORAGE.currentUser,
                username
            );

            showToast(
                "Đăng nhập thành công."
            );

            renderAccount();
        };
    }

    if (registerForm) {

        registerForm.onsubmit = event => {

            event.preventDefault();

            const username =
                document.getElementById(
                    "registerUsername"
                ).value.trim();

            const password =
                document.getElementById(
                    "registerPassword"
                ).value;

            if (username.length < 3) {

                showToast(
                    "Tên tài khoản quá ngắn."
                );

                return;
            }

            const users =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE.users
                    )
                ) || [];

            if (
                users.some(
                    user =>
                        user.username === username
                )
            ) {

                showToast(
                    "Tài khoản đã tồn tại."
                );

                return;
            }

            users.push({
                username,
                password
            });

            localStorage.setItem(
                STORAGE.users,
                JSON.stringify(users)
            );

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

            showToast(
                "Tạo tài khoản thành công."
            );

            renderAccount();
        };
    }

    const logout =
        document.getElementById("logoutBtn");

    if (logout) {

        logout.onclick = () => {

            localStorage.removeItem(
                STORAGE.currentUser
            );

            renderAccount();

            showToast(
                "Đã đăng xuất."
            );
        };
    }

    renderAccount();
}

function renderAccount() {

    const auth =
        document.getElementById(
            "authSection"
        );

    const dashboard =
        document.getElementById(
            "accountDashboard"
        );

    if (!auth || !dashboard) return;

    const username =
        localStorage.getItem(
            STORAGE.currentUser
        );

    if (!username) {

        auth.classList.remove("hidden");

        dashboard.classList.add("hidden");

        return;
    }

    auth.classList.add("hidden");

    dashboard.classList.remove("hidden");

    const name =
        document.getElementById(
            "accountName"
        );

    const avatar =
        document.getElementById(
            "accountAvatar"
        );

    const balance =
        document.getElementById(
            "accountBalance"
        );

    if (name) name.textContent = username;

    if (avatar) {
        avatar.textContent =
            username.charAt(0).toUpperCase();
    }

    const moneyValue =
        Number(
            localStorage.getItem(
                STORAGE.balance
            ) || 100000
        );

    if (balance) {
        balance.textContent =
            money(moneyValue);
    }

    renderFavorites();
    renderOrders();
}

function renderFavorites() {

    const container =
        document.getElementById(
            "favoriteList"
        );

    if (!container) return;

    const favorites =
        getFavorites();

    const products =
        loadProducts();

    container.innerHTML = "";

    const list =
        products.filter(
            product =>
                favorites.includes(product.id)
        );

    const count =
        document.getElementById(
            "accountFavorites"
        );

    if (count) {
        count.textContent =
            list.length;
    }

    if (!list.length) {

        container.innerHTML = `
            <div class="empty-state">
                Chưa có sản phẩm yêu thích.
            </div>
        `;

        return;
    }

    list.forEach(product => {

        container.appendChild(
            createProductCard(product)
        );
    });
}

function renderOrders() {

    const container =
        document.getElementById(
            "orderList"
        );

    if (!container) return;

    const username =
        localStorage.getItem(
            STORAGE.currentUser
        );

    const orders =
        JSON.parse(
            localStorage.getItem(
                STORAGE.orders
            )
        ) || [];

    const userOrders =
        orders.filter(
            order =>
                order.username === username
        );

    const count =
        document.getElementById(
            "accountOrders"
        );

    if (count) {
        count.textContent =
            userOrders.length;
    }

    container.innerHTML = "";

    if (!userOrders.length) {

        container.innerHTML = `
            <div class="empty-state">
                Chưa có đơn hàng.
            </div>
        `;

        return;
    }

    userOrders
        .slice()
        .reverse()
        .forEach(order => {

            const row =
                document.createElement("div");

            row.className = "order-row";

            row.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(order.id)}
                    </strong>

                    <span>
                        ${escapeHTML(order.date)}
                    </span>
                </div>

                <strong>
                    ${money(order.total)}
                </strong>
            `;

            container.appendChild(row);
        });
}

/* =========================
   WALLET
========================= */

function setupWallet() {

    const balance =
        document.getElementById(
            "walletBalance"
        );

    if (!balance) return;

    function update() {

        const value =
            Number(
                localStorage.getItem(
                    STORAGE.balance
                ) || 100000
            );

        balance.textContent =
            money(value);
    }

    update();

    document.querySelectorAll(
        ".add-money"
    ).forEach(button => {

        button.onclick = () => {

            const amount =
                Number(
                    button.dataset.money
                );

            let value =
                Number(
                    localStorage.getItem(
                        STORAGE.balance
                    ) || 100000
                );

            value += amount;

            localStorage.setItem(
                STORAGE.balance,
                String(value)
            );

            update();

            showToast(
                `Đã cộng ${money(amount)}`
            );
        };
    });
}

/* =========================
   CHAT
========================= */

function setupChat() {

    const form =
        document.getElementById(
            "chatForm"
        );

    const container =
        document.getElementById(
            "chatMessages"
        );

    if (!form || !container) return;

    function render() {

        const messages =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.chat
                )
            ) || [];

        container.innerHTML = "";

        messages.forEach(message => {

            const item =
                document.createElement("div");

            item.className = "chat-message";

            item.innerHTML = `
                <strong>
                    ${escapeHTML(message.user)}
                </strong>

                <p>
                    ${escapeHTML(message.text)}
                </p>

                <small>
                    ${escapeHTML(message.time)}
                </small>
            `;

            container.appendChild(item);
        });

        container.scrollTop =
            container.scrollHeight;
    }

    form.onsubmit = event => {

        event.preventDefault();

        const input =
            document.getElementById(
                "chatInput"
            );

        const text =
            input.value.trim();

        if (!text) return;

        const user =
            localStorage.getItem(
                STORAGE.currentUser
            ) || "Khách";

        const messages =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.chat
                )
            ) || [];

        messages.push({

            user,

            text,

            time:
                new Date().toLocaleTimeString(
                    "vi-VN"
                )
        });

        localStorage.setItem(
            STORAGE.chat,
            JSON.stringify(messages)
        );

        input.value = "";

        render();
    };

    render();
}

/* =========================
   FORUM
========================= */

function setupForum() {

    const form =
        document.getElementById(
            "forumForm"
        );

    const list =
        document.getElementById(
            "forumList"
        );

    if (!form || !list) return;

    function render() {

        const posts =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.forum
                )
            ) || [];

        list.innerHTML = "";

        posts
            .slice()
            .reverse()
            .forEach(post => {

                const item =
                    document.createElement("article");

                item.className = "forum-post";

                item.innerHTML = `
                    <div class="forum-post-head">

                        <div>
                            <h3>
                                ${escapeHTML(post.title)}
                            </h3>

                            <span>
                                ${escapeHTML(post.user)}
                                ·
                                ${escapeHTML(post.date)}
                            </span>
                        </div>

                    </div>

                    <p>
                        ${escapeHTML(post.content)}
                    </p>
                `;

                list.appendChild(item);
            });

        if (!posts.length) {

            list.innerHTML = `
                <div class="empty-state">
                    Chưa có bài viết.
                </div>
            `;
        }
    }

    form.onsubmit = event => {

        event.preventDefault();

        const title =
            document.getElementById(
                "forumTitle"
            ).value.trim();

        const content =
            document.getElementById(
                "forumContent"
            ).value.trim();

        if (!title || !content) return;

        const posts =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.forum
                )
            ) || [];

        posts.push({

            title,

            content,

            user:
                localStorage.getItem(
                    STORAGE.currentUser
                ) || "Khách",

            date:
                new Date().toLocaleString(
                    "vi-VN"
                )
        });

        localStorage.setItem(
            STORAGE.forum,
            JSON.stringify(posts)
        );

        form.reset();

        render();

        showToast(
            "Đã đăng bài."
        );
    };

    render();
}

/* =========================
   SERVER
========================= */

function setupServer() {

    const button =
        document.getElementById(
            "copyIp"
        );

    if (!button) return;

    button.onclick = async () => {

        const ip =
            document.querySelector(
                ".server-ip strong"
            )?.textContent;

        if (!ip) return;

        try {

            await navigator.clipboard.writeText(ip);

            showToast(
                "Đã sao chép IP."
            );

        } catch {

            showToast(
                "Không thể sao chép."
            );
        }
    };
}

/* =========================
   ADMIN
========================= */

function setupAdmin() {

    const loginForm =
        document.getElementById(
            "adminLoginForm"
        );

    const loginSection =
        document.getElementById(
            "adminLoginSection"
        );

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );

    if (!loginSection || !dashboard) return;

    function renderAdmin() {

        const logged =
            localStorage.getItem(
                STORAGE.admin
            ) === "true";

        if (logged) {

            loginSection.classList.add(
                "hidden"
            );

            dashboard.classList.remove(
                "hidden"
            );

            renderAdminProducts();
            renderAdminOrders();
            updateAdminStats();

        } else {

            loginSection.classList.remove(
                "hidden"
            );

            dashboard.classList.add(
                "hidden"
            );
        }

        updateAdminMenu();
    }

    if (loginForm) {

        loginForm.onsubmit = event => {

            event.preventDefault();

            const username =
                document.getElementById(
                    "adminUsername"
                ).value;

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

                showToast(
                    "Đăng nhập Admin thành công."
                );

                renderAdmin();

            } else {

                showToast(
                    "Sai thông tin Admin."
                );
            }
        };
    }

    const logout =
        document.getElementById(
            "adminLogoutBtn"
        );

    if (logout) {

        logout.onclick = () => {

            localStorage.removeItem(
                STORAGE.admin
            );

            renderAdmin();

            showToast(
                "Đã đăng xuất Admin."
            );
        };
    }

    setupProductForm();

    const refresh =
        document.getElementById(
            "refreshProductsBtn"
        );

    if (refresh) {
        refresh.onclick =
            renderAdminProducts;
    }

    const refreshOrders =
        document.getElementById(
            "refreshOrdersBtn"
        );

    if (refreshOrders) {
        refreshOrders.onclick =
            renderAdminOrders;
    }

    renderAdmin();
}

function updateAdminStats() {

    const products =
        loadProducts();

    const orders =
        JSON.parse(
            localStorage.getItem(
                STORAGE.orders
            )
        ) || [];

    const users =
        JSON.parse(
            localStorage.getItem(
                STORAGE.users
            )
        ) || [];

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

function setupProductForm() {

    const form =
        document.getElementById(
            "productForm"
        );

    if (!form) return;

    form.onsubmit = event => {

        event.preventDefault();

        let products =
            loadProducts();

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

        const image =
            document.getElementById(
                "productImage"
            ).value.trim();

        const description =
            document.getElementById(
                "productDescription"
            ).value.trim();

        const featured =
            document.getElementById(
                "productFeatured"
            ).checked;

        if (!name || !price) {

            showToast(
                "Vui lòng nhập đầy đủ."
            );

            return;
        }

        if (id) {

            const index =
                products.findIndex(
                    product =>
                        product.id === id
                );

            if (index >= 0) {

                products[index] = {

                    ...products[index],

                    name,
                    category,
                    price,
                    image:
                        image ||
                        "images/products/default.png",
                    description,
                    featured
                };
            }

        } else {

            const newId =
                "product-" +
                Date.now();

            products.push({

                id: newId,

                name,

                category,

                price,

                image:
                    image ||
                    "images/products/default.png",

                description,

                featured
            });
        }

        saveProducts(products);

        form.reset();

        document.getElementById(
            "productId"
        ).value = "";

        document.getElementById(
            "cancelEditBtn"
        )?.classList.add("hidden");

        renderAdminProducts();

        updateAdminStats();

        showToast(
            "Đã lưu sản phẩm."
        );
    };

    const cancel =
        document.getElementById(
            "cancelEditBtn"
        );

    if (cancel) {

        cancel.onclick = () => {

            form.reset();

            document.getElementById(
                "productId"
            ).value = "";

            cancel.classList.add(
                "hidden"
            );
        };
    }
}

function renderAdminProducts() {

    const container =
        document.getElementById(
            "adminProductList"
        );

    if (!container) return;

    const products =
        loadProducts();

    container.innerHTML = "";

    products.forEach(product => {

        const row =
            document.createElement("div");

        row.className =
            "admin-product-row";

        const image =
            createProductImage(
                product,
                "admin-product-image"
            );

        row.appendChild(image);

        const info =
            document.createElement("div");

        info.className =
            "admin-product-info";

        info.innerHTML = `
            <strong>
                ${escapeHTML(product.name)}
            </strong>

            <span>
                ${escapeHTML(product.category)}
                ·
                ${money(product.price)}
            </span>
        `;

        row.appendChild(info);

        const actions =
            document.createElement("div");

        actions.className =
            "admin-actions";

        const edit =
            document.createElement("button");

        edit.className =
            "btn btn-secondary";

        edit.textContent =
            "Sửa";

        edit.onclick = () =>
            editProduct(product.id);

        const remove =
            document.createElement("button");

        remove.className =
            "btn btn-danger";

        remove.textContent =
            "Xóa";

        remove.onclick = () =>
            deleteProduct(product.id);

        actions.appendChild(edit);
        actions.appendChild(remove);

        row.appendChild(actions);

        container.appendChild(row);
    });
}

function editProduct(productId) {

    const product =
        loadProducts().find(
            item =>
                item.id === productId
        );

    if (!product) return;

    document.getElementById(
        "productId"
    ).value = product.id;

    document.getElementById(
        "productName"
    ).value = product.name;

    document.getElementById(
        "productCategory"
    ).value = product.category;

    document.getElementById(
        "productPrice"
    ).value = product.price;

    document.getElementById(
        "productImage"
    ).value = product.image || "";

    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";

    document.getElementById(
        "productFeatured"
    ).checked =
        !!product.featured;

    document.getElementById(
        "cancelEditBtn"
    )?.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteProduct(productId) {

    if (
        !confirm(
            "Bạn có chắc muốn xóa sản phẩm này?"
        )
    ) {
        return;
    }

    const products =
        loadProducts().filter(
            product =>
                product.id !== productId
        );

    saveProducts(products);

    renderAdminProducts();

    updateAdminStats();

    showToast(
        "Đã xóa sản phẩm."
    );
}

function renderAdminOrders() {

    const container =
        document.getElementById(
            "adminOrderList"
        );

    if (!container) return;

    const orders =
        JSON.parse(
            localStorage.getItem(
                STORAGE.orders
            )
        ) || [];

    container.innerHTML = "";

    if (!orders.length) {

        container.innerHTML = `
            <div class="empty-state">
                Chưa có đơn hàng.
            </div>
        `;

        return;
    }

    orders
        .slice()
        .reverse()
        .forEach(order => {

            const row =
                document.createElement("div");

            row.className =
                "order-row";

            row.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(order.id)}
                    </strong>

                    <span>
                        ${escapeHTML(order.username)}
                        ·
                        ${escapeHTML(order.date)}
                    </span>
                </div>

                <strong>
                    ${money(order.total)}
                </strong>
            `;

            container.appendChild(row);
        });
}

/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

        setupTheme();
        setupMobileMenu();
        updateAdminMenu();

        setupModals();

        renderFeaturedProducts();

        setupShop();

        setupCheckout();

        setupAccount();

        setupWallet();

        setupChat();

        setupForum();

        setupServer();

        setupAdmin();
    }
);
