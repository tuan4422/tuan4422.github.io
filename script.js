<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta
    name="description"
    content="TUAN4422 MARKET - Cửa hàng sản phẩm số"
  >

  <title>Shop - TUAN4422 MARKET</title>

  <link rel="stylesheet" href="style.css">
</head>

<body>

  <!-- ================= HEADER ================= -->

  <header class="header">

    <a href="index.html" class="logo">
      TUAN<span>4422</span>
    </a>

    <nav id="nav">

      <a href="index.html">
        Trang chủ
      </a>

      <a href="shop.html" class="active">
        Shop
      </a>

      <a href="server.html">
        Server
      </a>

      <a href="chat.html">
        Chat
      </a>

      <a href="forum.html">
        Forum
      </a>

      <a href="account.html">
        Tài khoản
      </a>

      <a href="wallet.html">
        Ví
      </a>

    </nav>

    <div class="header-actions">

      <button
        id="themeBtn"
        class="icon-btn"
        aria-label="Đổi giao diện"
      >
        ☾
      </button>

      <button
        id="cartBtn"
        class="cart-btn"
        aria-label="Giỏ hàng"
      >
        🛒
        <span id="cartCount">0</span>
      </button>

      <button
        id="menuBtn"
        class="menu-btn"
        aria-label="Mở menu"
      >
        ☰
      </button>

    </div>

  </header>


  <!-- ================= MAIN ================= -->

  <main class="page">

    <!-- TIÊU ĐỀ -->

    <div class="page-heading">

      <div>

        <div class="small-title">
          TUAN4422 MARKET
        </div>

        <h1>
          Cửa hàng
        </h1>

        <p>
          Chọn sản phẩm bạn muốn mua.
        </p>

      </div>

    </div>


    <!-- ================= SEARCH ================= -->

    <div class="search-box">

      <span>
        🔎
      </span>

      <input
        type="search"
        id="shopSearch"
        placeholder="Tìm kiếm sản phẩm..."
        autocomplete="off"
      >

    </div>


    <!-- ================= SHOP ================= -->

    <section>

      <div class="section-title">

        <div class="small-title">
          SẢN PHẨM
        </div>

        <h2>
          Tất cả sản phẩm
        </h2>

      </div>


      <div
        id="productGrid"
        class="product-grid"
      ></div>


      <!-- Không tìm thấy -->

      <div
        id="noProducts"
        class="empty"
        style="display:none;"
      >
        Không tìm thấy sản phẩm.
      </div>

    </section>

  </main>


  <!-- ================= PRODUCT MODAL ================= -->

  <div
    id="productModal"
    class="modal"
  >

    <div class="modal-box product-modal">

      <div class="modal-header">

        <h2>
          Chi tiết sản phẩm
        </h2>

        <button
          id="closeProduct"
          type="button"
          aria-label="Đóng"
        >
          ×
        </button>

      </div>


      <div class="detail-icon" id="detailIcon">
        📦
      </div>


      <h2
        class="detail-title"
        id="detailTitle"
      >
        Sản phẩm
      </h2>


      <p
        class="detail-description"
        id="detailDescription"
      >
        Mô tả sản phẩm.
      </p>


      <div
        class="detail-price"
        id="detailPrice"
      >
        0đ
      </div>


      <button
        id="detailAdd"
        class="btn primary full"
        type="button"
      >
        🛒 Thêm vào giỏ hàng
      </button>

    </div>

  </div>


  <!-- ================= CART ================= -->

  <div
    id="cartModal"
    class="modal"
  >

    <div class="modal-box">

      <div class="modal-header">

        <h2>
          🛒 Giỏ hàng
        </h2>

        <button
          id="closeCart"
          type="button"
          aria-label="Đóng"
        >
          ×
        </button>

      </div>


      <div id="cartItems">

        <div class="empty">
          Giỏ hàng đang trống.
        </div>

      </div>


      <div class="cart-total">

        <span>
          Tổng cộng
        </span>

        <strong id="cartTotal">
          0đ
        </strong>

      </div>


      <button
        id="checkoutBtn"
        class="btn primary full"
        type="button"
      >
        Thanh toán
      </button>

    </div>

  </div>


  <!-- ================= TOAST ================= -->

  <div id="toast"></div>


  <!-- ================= FOOTER ================= -->

  <footer>

    <div class="footer-logo">
      TUAN<span>4422</span>
    </div>

    <p>
      TUAN4422 MARKET
    </p>

    <small>
      © <span id="year"></span>
      TUAN4422. All rights reserved.
    </small>

  </footer>


  <script src="script.js"></script>


  <!-- ================= SHOP SCRIPT ================= -->

  <script>

    const productGrid =
      document.getElementById("productGrid");

    const searchInput =
      document.getElementById("shopSearch");

    const noProducts =
      document.getElementById("noProducts");


    let currentProducts =
      [...PRODUCTS];


    /* ==========================================
       HIỂN THỊ SẢN PHẨM
    ========================================== */

    function renderProducts(list) {

      if (!productGrid) {
        return;
      }


      if (list.length === 0) {

        productGrid.innerHTML = "";

        noProducts.style.display = "block";

        return;

      }


      noProducts.style.display = "none";


      productGrid.innerHTML =
        list.map(product => `

          <article
            class="product"
            data-product="${product.id}"
          >

            ${
              product.badge
                ? `
                  <div class="product-badge">
                    ${product.badge}
                  </div>
                `
                : ""
            }


            <div class="product-icon">
              ${product.icon}
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
                type="button"
                class="small-btn"
                data-detail="${product.id}"
              >
                Xem chi tiết
              </button>

              <button
                type="button"
                class="small-btn buy-btn"
                data-buy="${product.id}"
              >
                Mua
              </button>

            </div>

          </article>

        `).join("");


      /* Nút xem chi tiết */

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


      /* Nút mua */

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

    }


    /* ==========================================
       TÌM KIẾM
    ========================================== */

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        () => {

          const keyword =
            searchInput.value
              .trim()
              .toLowerCase();


          if (!keyword) {

            currentProducts =
              [...PRODUCTS];

          } else {

            currentProducts =
              PRODUCTS.filter(
                product => {

                  return (

                    product.name
                      .toLowerCase()
                      .includes(keyword)

                    ||

                    product.description
                      .toLowerCase()
                      .includes(keyword)

                  );

                }
              );

          }


          renderProducts(
            currentProducts
          );

        }
      );

    }


    /* ==========================================
       PRODUCT DETAIL
    ========================================== */

    const productModal =
      document.getElementById(
        "productModal"
      );

    const closeProduct =
      document.getElementById(
        "closeProduct"
      );

    const detailIcon =
      document.getElementById(
        "detailIcon"
      );

    const detailTitle =
      document.getElementById(
        "detailTitle"
      );

    const detailDescription =
      document.getElementById(
        "detailDescription"
      );

    const detailPrice =
      document.getElementById(
        "detailPrice"
      );

    const detailAdd =
      document.getElementById(
        "detailAdd"
      );


    let selectedProduct = null;


    function openProductDetail(id) {

      const product =
        PRODUCTS.find(
          item => item.id === id
        );


      if (!product) {
        return;
      }


      selectedProduct =
        product;


      detailIcon.textContent =
        product.icon;


      detailTitle.textContent =
        product.name;


      detailDescription.textContent =
        product.description;


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
        event => {

          event.preventDefault();

          event.stopPropagation();

          closeProductModal();

        }
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


      const box =
        productModal.querySelector(
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


    /* ==========================================
       ESC
    ========================================== */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          closeProductModal();

        }

      }
    );


    /* ==========================================
       START
    ========================================== */

    renderProducts(
      currentProducts
    );

  </script>

</body>
</html>
