const DEFAULT_PRODUCTS = [
    {
        id: "script-ui",
        name: "Script UI Demo",
        category: "Script",
        price: 49000,
        image: "images/products/script-ui.png",
        description: "Script giao diện demo dành cho website.",
        featured: true
    },

    {
        id: "script-tool",
        name: "Script Utility",
        category: "Script",
        price: 69000,
        image: "images/products/script-tool.png",
        description: "Bộ công cụ script tiện ích.",
        featured: true
    },

    {
        id: "account-demo",
        name: "Tài khoản Demo",
        category: "Account",
        price: 39000,
        image: "images/products/account-demo.png",
        description: "Tài khoản demo hợp lệ để thử nghiệm.",
        featured: true
    },

    {
        id: "minecraft-pack",
        name: "Minecraft Setup Pack",
        category: "Minecraft",
        price: 79000,
        image: "images/products/minecraft-pack.png",
        description: "Bộ thiết lập Minecraft.",
        featured: true
    },

    {
        id: "web-template",
        name: "Website Template",
        category: "Script",
        price: 59000,
        image: "images/products/web-template.png",
        description: "Mẫu website hiện đại.",
        featured: false
    },

    {
        id: "config-pack",
        name: "Config Pack",
        category: "Minecraft",
        price: 29000,
        image: "images/products/config-pack.png",
        description: "Gói cấu hình Minecraft.",
        featured: false
    }
];

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

function loadProducts() {
    const saved = localStorage.getItem(STORAGE.products);

    if (!saved) {
        localStorage.setItem(
            STORAGE.products,
            JSON.stringify(DEFAULT_PRODUCTS)
        );

        return [...DEFAULT_PRODUCTS];
    }

    try {
        return JSON.parse(saved);
    } catch {
        localStorage.setItem(
            STORAGE.products,
            JSON.stringify(DEFAULT_PRODUCTS)
        );

        return [...DEFAULT_PRODUCTS];
    }
}

function saveProducts(products) {
    localStorage.setItem(
        STORAGE.products,
        JSON.stringify(products)
    );
}
