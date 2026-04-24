// =========================================================
// FIREBASE CONFIGURATION (PLACEHOLDER)
// =========================================================
// FIXME: User instructions:
// 1. Go to Firebase Console -> Project Settings
// 2. Copy the "firebaseConfig" object
// 3. Paste it below to replace the placeholder
// 4. Uncomment the import if using module system or verify script tag loading

/* 
  import { initializeApp } from "firebase/app";
  import { getFirestore, collection, getDocs } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "API_KEY_HERE",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // EXAMPLE: Function to get products from Firebase
  async function getProducts() {
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
  }
*/

// =========================================================
// APPLICATION LOGIC
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const initialView = document.body.dataset.initialView || 'login';

    // --- DOM Elements ---
    const views = {
        login: document.getElementById('login-view'),
        forgotPass: document.getElementById('forgot-password-view'),
        home: document.getElementById('home-view')
    };

    // Login Form
    const loginForm = document.getElementById('login-form');
    const userInput = document.getElementById('username');
    const passInput = document.getElementById('password');
    const linkForgot = document.getElementById('link-forgot-password');

    // Forgot Password Flow
    const fpSteps = [
        document.getElementById('fp-step-1'),
        document.getElementById('fp-step-2'),
        document.getElementById('fp-step-3')
    ];
    const btnSendOtp = document.getElementById('btn-send-otp');
    const btnVerifyOtp = document.getElementById('btn-verify-otp');
    const btnChangePass = document.getElementById('btn-change-pass');
    const btnBackLogin = document.querySelector('.btn-back-login');

    // Home / Nav
    const navItems = document.querySelectorAll('.nav-item-h'); // Updated to horizontal class
    // const btnLogout = document.getElementById('btn-logout'); // Removed

    // Modals
    const modalContainer = document.getElementById('modal-container');
    const modalError = document.getElementById('modal-content-error');
    const modalSuccess = document.getElementById('modal-content-success');
    const btnCloseModal = document.querySelector('.modal-close-x');

    // Header Link
    const btnHomeLogo = document.getElementById('btn-home-logo');

    // --- State ---
    const HARDCODED_USER = "NT_Mart123";
    const HARDCODED_PASS = "NT_Mart123";
    const viewPaths = {
        login: '/login/',
        forgotPass: '/forgot-password/',
        home: '/dashboard/'
    };

    // --- UTILS ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' <u>đ</u>';
    };

    // --- FUNCTIONS ---

    function resetForgotPasswordFlow() {
        fpSteps.forEach((step, idx) => {
            step.classList.toggle('active-step', idx === 0);
            step.classList.toggle('icon-hidden', idx !== 0);
        });
    }

    function syncUrl(viewName, mode = 'push') {
        const targetPath = viewPaths[viewName];
        if (!targetPath || window.location.pathname === targetPath) {
            return;
        }

        const method = mode === 'replace' ? 'replaceState' : 'pushState';
        window.history[method]({ view: viewName }, '', targetPath);
    }

    function switchView(viewName, options = {}) {
        const { syncHistory = true, historyMode = 'push' } = options;

        // Find the view by key and add active class, remove from others
        Object.keys(views).forEach(key => {
            if (key === viewName) {
                views[key].classList.add('active-view');
                views[key].classList.remove('icon-hidden');
            } else {
                views[key].classList.remove('active-view');
                views[key].classList.add('icon-hidden');
            }
        });

        if (viewName === 'forgotPass') {
            resetForgotPasswordFlow();
        }

        if (syncHistory) {
            syncUrl(viewName, historyMode);
        }
    }

    function showModal(type, message = "") {
        modalContainer.classList.remove('icon-hidden');
        if (type === 'error') {
            modalError.classList.remove('icon-hidden');
            modalSuccess.classList.add('icon-hidden');
        } else if (type === 'success') {
            modalSuccess.classList.remove('icon-hidden');
            modalError.classList.add('icon-hidden');
            if (message) document.getElementById('success-msg').textContent = message;
        }
    }

    function closeModal() {
        modalContainer.classList.add('icon-hidden');
    }

    // --- Event Listeners ---

    // 1. LOGIN HANDLER
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = userInput.value;
        const p = passInput.value;

        // LOGIN VALIDATION LOGIC
        // Note: In future, replace this with Firebase Auth call
        if (u === HARDCODED_USER && p === HARDCODED_PASS) {
            console.log("Login Success");
            switchView('home');
        } else {
            console.log("Login Failed");
            showModal('error');
        }
    });

    btnCloseModal.addEventListener('click', closeModal);

    // 2. FORGOT PASSWORD FLOW
    linkForgot.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('forgotPass');
    });

    btnBackLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('login');
    });

    if (btnHomeLogo) {
        btnHomeLogo.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('home');

            // Remove selection from navigation
            navItems.forEach(nav => nav.classList.remove('active'));

            // Show Home Placeholder, Hide Other Pages
            const homePlaceholder = document.getElementById('home-placeholder');
            if (homePlaceholder) homePlaceholder.classList.remove('icon-hidden');
            document.querySelectorAll('.page-section').forEach(page => page.classList.add('icon-hidden'));
        });
    }

    // Step 1 -> Step 2
    btnSendOtp.addEventListener('click', () => {
        const phone = document.getElementById('fp-phone').value;
        if (!phone) {
            // Simple validation
            alert("Vui lòng nhập số điện thoại");
            return;
        }
        // Logic gửi OTP (Fake)
        // document.getElementById('display-phone').textContent = phone; // Element removed in redesign

        fpSteps[0].classList.add('icon-hidden');
        fpSteps[1].classList.remove('icon-hidden');
    });

    // Step 2 -> Step 3
    btnVerifyOtp.addEventListener('click', () => {
        // Logic verify OTP (Fake) -> Success
        fpSteps[1].classList.add('icon-hidden');
        fpSteps[2].classList.remove('icon-hidden');
    });

    // Step 3 -> Finish
    btnChangePass.addEventListener('click', () => {
        // Logic đổi pass (Fake)
        showModal('success', 'Đổi mật khẩu thành công');

        // Auto redirect after 2 sec
        setTimeout(() => {
            closeModal();
            switchView('login');
        }, 1500);
    });

    window.addEventListener('popstate', () => {
        const pathToView = {
            '/login/': 'login',
            '/forgot-password/': 'forgotPass',
            '/dashboard/': 'home'
        };
        const targetView = pathToView[window.location.pathname] || 'login';
        switchView(targetView, { syncHistory: false });
    });

    switchView(viewPaths[initialView] ? initialView : 'login', { syncHistory: true, historyMode: 'replace' });

    // --- MOCK DATA ---
    // --- REALISTIC MOCK DATA ENGINE ---

    // 1. DATA POOLS (Vietnamese Context)
    const DATA_POOL = {
        firstNames: ["Anh", "Bình", "Châu", "Cường", "Dũng", "Dương", "Đạt", "Đức", "Giang", "Hải", "Hạnh", "Hiếu", "Hoàng", "Hùng", "Hương", "Khánh", "Lan", "Linh", "Long", "Mai", "Minh", "Nam", "Nga", "Ngọc", "Nhân", "Phong", "Phúc", "Phương", "Quân", "Quang", "Quỳnh", "Sơn", "Thảo", "Thắng", "Thịnh", "Thu", "Thủy", "Trang", "Trí", "Trọng", "Trung", "Tuấn", "Tùng", "Uyên", "Vân", "Việt", "Vinh", "Vy", "Xuân", "Yến"],
        middleNames: ["Thị", "Văn", "Ngọc", "Thanh", "Minh", "Đức", "Hữu", "Hoàng", "Quốc", "Gia", "Khánh", "Thùy", "Kim", "Bảo", "Xuân", "Mỹ"],
        lastNames: ["Nguyễn", "Trần", "Lê", "Phạm", "Huỳnh", "Hoàng", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"],

        streets: ["Nguyễn Huệ", "Lê Lợi", "Bạch Đằng", "Hùng Vương", "Lê Duẩn", "Nguyễn Văn Linh", "Điện Biên Phủ", "Tôn Đức Thắng", "Hoàng Diệu", "Trưng Nữ Vương", "Núi Thành", "2/9", "Phạm Văn Đồng", "Võ Nguyên Giáp", "Nguyễn Tất Thành", "Âu Cơ", "Trần Cao Vân"],
        wards: ["Hải Châu 1", "Hải Châu 2", "Thạch Thang", "Thanh Bình", "Thuận Phước", "Hòa Cường Bắc", "Hòa Cường Nam", "An Khê", "Thanh Khê Tây", "Hòa Minh", "Hòa Khánh Bắc"],
        districts: ["Hải Châu", "Thanh Khê", "Liên Chiểu", "Sơn Trà", "Ngũ Hành Sơn", "Cẩm Lệ"],

        suppliers: [
            { name: "Công ty Cổ phần Acecook Việt Nam", short: "Acecook" },
            { name: "Công ty TNHH Nước Giải Khát Suntory PepsiCo", short: "PepsiCo" },
            { name: "Công ty TNHH Bia và Nước giải khát Heineken Việt Nam", short: "Heineken VN" },
            { name: "Công ty Cổ phần Tập đoàn Masan", short: "Masan Consumer" },
            { name: "Công ty Cổ phần Sữa Việt Nam", short: "Vinamilk" },
            { name: "Công ty TNHH Quốc tế Unilever Việt Nam", short: "Unilever" },
            { name: "Công ty TNHH Dầu thực vật Cái Lân", short: "Cái Lân" },
            { name: "Công ty CP TP Dinh Dưỡng NutiFood", short: "NutiFood" },
            { name: "Tổng Quy Công ty Bia - Rượu - Nước giải khát Sài Gòn", short: "Sabeco" },
            { name: "Công ty TNHH URC Việt Nam", short: "URC" }
        ],

        products: [
            // Beverages
            { name: "Thùng Bia Tiger Nâu 24 Lon", unit: "Thùng", basePrice: 380000, cat: "Bia" },
            { name: "Thùng Bia Heineken Silver 24 Lon", unit: "Thùng", basePrice: 440000, cat: "Bia" },
            { name: "Lốc 6 Lon Bia Larue", unit: "Lốc", basePrice: 65000, cat: "Bia" },
            { name: "Thùng Nước ngọt Coca Cola 24 Lon", unit: "Thùng", basePrice: 190000, cat: "Nước ngọt" },
            { name: "Lốc 6 Chai Sting Dâu 330ml", unit: "Lốc", basePrice: 55000, cat: "Nước ngọt" },
            { name: "Chai Nước Ngọt Pepsi 1.5 Lít", unit: "Chai", basePrice: 18000, cat: "Nước ngọt" },
            { name: "Thùng Nước Suối Aquafina 350ml", unit: "Thùng", basePrice: 90000, cat: "Nước suối" },
            { name: "Lốc 4 Hộp Sữa Tươi Vinamilk Có Đường 180ml", unit: "Lốc", basePrice: 28000, cat: "Sữa" },
            { name: "Hộp Sữa Đặc Ông Thọ Đỏ 380g", unit: "Lon", basePrice: 24000, cat: "Sữa" },
            { name: "Lốc 4 Hộp Sữa Chua TH True Milk", unit: "Lốc", basePrice: 32000, cat: "Sữa" },

            // Dry Food & Spices
            { name: "Thùng Mì Hảo Hảo Tôm Chua Cay (30 Gói)", unit: "Thùng", basePrice: 115000, cat: "Mì ăn liền" },
            { name: "Gói Mì Omachi Sườn Hầm Ngũ Quả", unit: "Gói", basePrice: 7500, cat: "Mì ăn liền" },
            { name: "Gói Phở Bò Cung Đình", unit: "Gói", basePrice: 9000, cat: "Mì ăn liền" },
            { name: "Chai Dầu Ăn Tường An Cooking Oil 1L", unit: "Chai", basePrice: 52000, cat: "Gia vị" },
            { name: "Chai Dầu Ăn Neptune Light 2L", unit: "Chai", basePrice: 115000, cat: "Gia vị" },
            { name: "Chai Nước Mắm Nam Ngư 750ml", unit: "Chai", basePrice: 42000, cat: "Gia vị" },
            { name: "Chai Nước Mắm Chinsu Cá Hồi 500ml", unit: "Chai", basePrice: 45000, cat: "Gia vị" },
            { name: "Chai Tương Ớt Chinsu 250g", unit: "Chai", basePrice: 15000, cat: "Gia vị" },
            { name: "Gói Hạt Nêm Knorr Thịt Thăn 400g", unit: "Gói", basePrice: 38000, cat: "Gia vị" },
            { name: "Gói Bột Ngọt Ajinomoto 454g", unit: "Gói", basePrice: 32000, cat: "Gia vị" },
            { name: "Gói Đường Tinh Luyện Biên Hòa 1kg", unit: "Gói", basePrice: 22000, cat: "Gia vị" },

            // Household
            { name: "Túi Bột Giặt OMO Sạch Cực Nhanh 2.9kg", unit: "Túi", basePrice: 145000, cat: "Hóa phẩm" },
            { name: "Chai Nước Giặt Ariel Cửa Trước 3.2kg", unit: "Chai", basePrice: 195000, cat: "Hóa phẩm" },
            { name: "Túi Nước Xả Vải Downy Huyền Bí 2.2L", unit: "Túi", basePrice: 165000, cat: "Hóa phẩm" },
            { name: "Can Nước Rửa Chén Sunlight Chanh 3.6kg", unit: "Can", basePrice: 120000, cat: "Hóa phẩm" },
            { name: "Chai Nước Lau Sàn Sunlight 1kg", unit: "Chai", basePrice: 32000, cat: "Hóa phẩm" },
            { name: "Lốc 6 Cuộn Giấy Vệ Sinh Corelex", unit: "Lốc", basePrice: 45000, cat: "Giấy" },

            // Snacks
            { name: "Gói Bánh Snack Oishi Tôm Cay", unit: "Gói", basePrice: 6000, cat: "Bánh kẹo" },
            { name: "Hộp Bánh ChocoPie Orion (12 cái)", unit: "Hộp", basePrice: 55000, cat: "Bánh kẹo" },
            { name: "Gói Kẹo Dẻo Chupa Chups", unit: "Gói", basePrice: 25000, cat: "Bánh kẹo" },
            { name: "Hộp Bánh Ritz Crackers", unit: "Hộp", basePrice: 45000, cat: "Bánh kẹo" }
        ]
    };

    // 2. HELPER FUNCTIONS
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const generateName = () => {
        const last = randomItem(DATA_POOL.lastNames);
        const middle = randomItem(DATA_POOL.middleNames);
        const first = randomItem(DATA_POOL.firstNames);
        return `${last} ${middle} ${first}`;
    };

    const generatePhone = () => {
        const prefixes = ["090", "091", "093", "097", "098", "036", "037", "038", "070", "079", "083", "085"];
        const prefix = randomItem(prefixes);
        const suffix = String(randomInt(1000000, 9999999));
        return prefix + suffix;
    };

    const generateAddress = () => {
        const types = ["Số", "K", "Hẻm"];
        const type = randomItem(types);
        const number = randomInt(1, 999);
        const street = randomItem(DATA_POOL.streets);
        const ward = randomItem(DATA_POOL.wards);
        const district = randomItem(DATA_POOL.districts);

        let addr1 = "";
        if (type === "Số") addr1 = `Số ${number} ${street}`;
        else addr1 = `${type} ${number}/${randomInt(1, 20)} ${street}`;

        return `${addr1}, P. ${ward}, Q. ${district}, TP. Đà Nẵng`;
    };

    const generateDate = (startMonthsAgo, endMonthsAgo = 0) => {
        const now = new Date();
        const start = new Date();
        start.setMonth(now.getMonth() - startMonthsAgo);
        const end = new Date();
        end.setMonth(now.getMonth() - endMonthsAgo);

        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        const d = new Date(randomTime);

        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    // 3. GENERATORS

    // A. CUSTOMERS
    const generateCustomerData = () => {
        const data = [];
        for (let i = 1; i <= 60; i++) {
            const name = generateName();
            const code = 'KH' + String(i).padStart(8, '0');
            const phone = generatePhone();
            const address = generateAddress();
            const orders = randomInt(0, 50);
            const total = formatCurrency(orders * randomInt(200000, 1000000));
            const noteOpts = ["Khách quen", "Khách sỉ", "Giao chành xe", "", "", "", "", "Thanh toán chậm"];

            data.push({
                name, code, phone, address, orders, total,
                note: randomItem(noteOpts)
            });
        }
        return data;
    };

    // B. SUPPLIERS
    const generateSupplierData = () => {
        const data = [];
        DATA_POOL.suppliers.forEach((sup, i) => {
            const code = 'NCC' + String(i + 1).padStart(7, '0');
            data.push({
                name: sup.name,
                contact: generateName(),
                code: code,
                phone: generatePhone(),
                address: `Tầng ${randomInt(1, 20)}, Tòa nhà ${randomItem(['Vincom', 'Indochina', 'Software Park'])}, Q. Hải Châu, Đà Nẵng`
            });
        });
        // Add some randoms
        for (let j = 11; j <= 25; j++) {
            const code = 'NCC' + String(j).padStart(7, '0');
            const short = randomItem(["Đại lý", "NPP", "Kho"]) + " " + randomItem(DATA_POOL.firstNames);
            data.push({
                name: short,
                contact: generateName(),
                code: code,
                phone: generatePhone(),
                address: generateAddress()
            });
        }
        return data;
    };

    // C. PRODUCTS (MASTER)
    const generateProductData = () => {
        const data = [];
        // Generate from realistic pool
        const pool = DATA_POOL.products;

        pool.forEach((prod, index) => {
            const id = 'HH' + String(index + 1).padStart(8, '0');
            // Selling price variation (+- 5%)
            const priceVar = randomInt(-2, 5) * 1000;
            const finalPrice = Math.max(prod.basePrice + priceVar, 1000);

            // Import Profit Margin (15% - 35%)
            const margin = randomInt(15, 35) / 100;
            const importPrice = Math.floor(finalPrice / (1 + margin) / 500) * 500; // Round to 500d

            // Stock
            const stock = randomInt(0, 500);
            let status = 'Còn hàng';
            if (stock === 0) status = 'Hết hàng';
            else if (stock <= 10) status = 'Sắp hết';

            // Expiry
            const today = new Date();
            const future = new Date();
            future.setMonth(today.getMonth() + randomInt(-2, 18)); // Some expired 2 months ago, some valid 18 months
            const expDate = `${String(future.getDate()).padStart(2, '0')}/${String(future.getMonth() + 1).padStart(2, '0')}/${future.getFullYear()}`;

            data.push({
                id,
                name: prod.name,
                unit: prod.unit,
                price: formatCurrency(finalPrice),
                priceRaw: finalPrice,
                importPrice: importPrice,
                stock,
                status,
                expiryDate: expDate
            });
        });

        // Add some filler items to reach ~60
        const fillerCount = 60 - data.length;
        for (let i = 0; i < fillerCount; i++) {
            const baseItem = randomItem(pool);
            const id = 'HH' + String(data.length + 1).padStart(8, '0');
            const finalPrice = baseItem.basePrice;
            const importPrice = Math.floor(finalPrice * 0.7);
            data.push({
                id,
                name: baseItem.name + " (Mới)",
                unit: baseItem.unit,
                price: formatCurrency(finalPrice),
                priceRaw: finalPrice,
                importPrice: importPrice,
                stock: randomInt(0, 50),
                status: 'Còn hàng',
                expiryDate: '01/01/2026'
            });
        }
        return data;
    };

    // D. SALES & IMPORTS (RELATIONAL)
    // We pass the generated product list to ensure relationships
    const generateTransactionalData = (products, customers, suppliers) => {
        const sales = [];
        const imports = [];

        // 1. Generate 80 Sales
        for (let i = 1; i <= 80; i++) {
            const id = 'BH' + String(i).padStart(8, '0');
            const cust = randomItem(customers);
            const date = generateDate(6, 0); // Last 6 months

            const numItems = randomInt(1, 8);
            const orderItems = [];
            let totalVal = 0;

            // Pick distinct random products
            const shuffledProds = [...products].sort(() => 0.5 - Math.random());
            const selectedProds = shuffledProds.slice(0, numItems);

            selectedProds.forEach(prod => {
                const qty = randomInt(1, 5); // Retail qty
                const lineTotal = qty * prod.priceRaw;
                orderItems.push({
                    productId: prod.id,
                    name: prod.name,
                    unit: prod.unit,
                    qty: qty,
                    price: prod.priceRaw,
                    // For potential profit report
                    importPrice: prod.importPrice,
                    total: lineTotal
                });
                totalVal += lineTotal;
            });

            const itemsStr = orderItems.map(x => `${x.qty}x ${x.name}`).join(', ');

            sales.push({
                id, date,
                customer: cust.name,
                phone: cust.phone,
                address: cust.address,
                items: orderItems.length,
                itemsDetail: orderItems,
                itemsStr,
                total: formatCurrency(totalVal),
                totalRaw: totalVal
            });
        }

        // 2. Generate 40 Imports (Restocking)
        for (let i = 1; i <= 40; i++) {
            const id = 'NH' + String(i).padStart(8, '0');
            const supp = randomItem(suppliers);
            const date = generateDate(12, 0); // Last 12 months

            const numItems = randomInt(3, 15);
            const orderItems = [];
            let totalVal = 0;

            const shuffledProds = [...products].sort(() => 0.5 - Math.random());
            const selectedProds = shuffledProds.slice(0, numItems);

            selectedProds.forEach(prod => {
                const qty = randomInt(10, 100); // Wholesale qty
                const lineTotal = qty * prod.importPrice;
                orderItems.push({
                    productId: prod.id,
                    name: prod.name,
                    qty: qty,
                    price: prod.importPrice,
                    total: lineTotal
                });
                totalVal += lineTotal;
            });

            imports.push({
                id, date,
                supplier: supp.name,
                phone: supp.phone,
                address: supp.address,
                items: orderItems.length,
                itemsDetail: orderItems,
                total: formatCurrency(totalVal),
                totalRaw: totalVal
            });
        }

        return { sales, imports };
    };

    // --- INITIALIZE DATASETS ---
    let customerData = [];
    let supplierData = [];
    let productData = [];
    let salesData = [];
    let importData = [];

    // Filtered Arrays (Must be initialized)
    let filteredCustomerData = [];
    let filteredSupplierData = [];
    let filteredProductData = [];
    let filteredSalesData = [];
    let filteredImportData = [];

    function applyApiData(data) {
        productData = (data.products || []).map((item) => ({
            ...item,
            id: item.id || item.code
        }));
        customerData = (data.customers || []).map((item) => ({
            ...item,
            id: item.id || item.code
        }));
        supplierData = (data.suppliers || []).map((item) => ({
            ...item,
            id: item.id || item.code
        }));
        salesData = (data.sales || []).map((item) => ({
            ...item,
            id: item.id || item.code
        }));
        importData = (data.imports || []).map((item) => ({
            ...item,
            id: item.id || item.code
        }));

        filteredProductData = [...productData];
        filteredCustomerData = [...customerData];
        filteredSupplierData = [...supplierData];
        filteredSalesData = [...salesData];
        filteredImportData = [...importData];
    }

    function renderAllEntityViews() {
        if (typeof renderSales === 'function') renderSales();
        if (typeof renderImports === 'function') renderImports();
        if (typeof renderCustomers === 'function') renderCustomers();
        if (typeof renderSuppliers === 'function') renderSuppliers();
        if (typeof renderProducts === 'function') renderProducts();
    }

    const API_RESOURCE_MAP = {
        products: '/api/products/',
        customers: '/api/customers/',
        suppliers: '/api/suppliers/',
        sales: '/api/sales/',
        imports: '/api/imports/'
    };

    // Fetch data from Django API
    fetch('/api/data/')
        .then(res => res.json())
        .then(data => {
            applyApiData(data);

            console.log('Data loaded from API successfully!');
    // --- BACKEND SYNC ---
    window.syncWithBackend = function(action, entity, payload) {
        const baseUrl = API_RESOURCE_MAP[entity];
        if (!baseUrl) {
            return Promise.reject(new Error(`Unsupported entity: ${entity}`));
        }

        const resourceId = encodeURIComponent(payload.id || payload.code || '');
        let requestUrl = baseUrl;
        let method = 'POST';
        let body;

        if (action === 'update') {
            requestUrl = `${baseUrl}${resourceId}/`;
            method = 'PATCH';
            body = JSON.stringify(payload);
        } else if (action === 'delete') {
            requestUrl = `${baseUrl}${resourceId}/`;
            method = 'DELETE';
        } else {
            body = JSON.stringify(payload);
        }

        return fetch(requestUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.error || `Backend sync failed: ${res.status}`);
                }
                console.log('Sync success:', { action, entity, data });
                return data;
            })
            .catch(err => {
                console.error('Sync error:', err);
                showModal('error');
                throw err;
            });
    };

            
            renderAllEntityViews();
        })
        .catch(err => console.error('API Fetch Error:', err));


    // --- PAGINATION STATE ---
    const ITEMS_PER_PAGE = 10;
    let currentPageSales = 1;
    let currentPageImport = 1;
    let currentPageCustomers = 1;
    let currentPageSuppliers = 1;
    let currentPageProducts = 1;

    // --- RENDERING FUNCTIONS ---
    function renderPagination(totalItems, currentPage, containerSelector, onPageChange) {
        // Since the HTML has pagination-container inside each page-section, we need to find the correct one.
        // The containerSelector might be an ID or we find it relative to the page.
        // Let's assume we pass the .pagination-container element or its ID.
        // Actually, looking at HTML, each page has a .pagination-container.
        // Let's pass the container element itself.

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const container = document.querySelector(containerSelector);

        if (!container) return;

        // Auto-hide if 1 page or less
        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        } else {
            container.style.display = 'flex';
        }

        let html = '';

        // Prev Button
        html += `<button class="page-btn-circle prev-btn" ${currentPage === 1 ? 'disabled' : ''}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>`;

        // Page Numbers Logic
        if (totalPages <= 3) {
            // Case B: Show all normal
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="page-num-square ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        } else {
            // Case A: Strict Dynamic 1 ... Current ... Last

            // 1. First Page
            html += `<button class="page-num-square ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>`;

            // 2. Leading Separator
            if (currentPage > 2) {
                html += `<span class="page-dots">...</span>`;
            }

            // 3. Current Page (if distinct from First and Last)
            if (currentPage > 1 && currentPage < totalPages) {
                html += `<button class="page-num-square active" data-page="${currentPage}">${currentPage}</button>`;
            }

            // 4. Trailing Separator
            if (currentPage < totalPages - 1) {
                html += `<span class="page-dots">...</span>`;
            }

            // 5. Last Page
            html += `<button class="page-num-square ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next Button
        html += `<button class="page-btn-circle next-btn" ${currentPage === totalPages ? 'disabled' : ''}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>`;

        container.innerHTML = html;

        // Add Event Listeners
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const numberBtns = container.querySelectorAll('.page-num-square');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) onPageChange(currentPage - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) onPageChange(currentPage + 1);
            });
        }

        numberBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                onPageChange(page);
            });
        });
    }

    function renderSales() {
        const container = document.getElementById('pos-list-container');
        if (container) {
            // Apply Fade In
            container.classList.remove('fade-in');
            void container.offsetWidth; // Trigger reflow
            container.classList.add('fade-in');

            // Slice Data
            const start = (currentPageSales - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentData = filteredSalesData.slice(start, end);

            container.innerHTML = currentData.map(item => `
                <div class="ticket-card" data-type="sales" data-id="${item.id}">
                    <div class="card-header-row">
                        <span class="ticket-id">${item.id}</span>
                        <div class="card-actions">
                            <button type="button" class="icon-btn btn-edit" data-type="sales" data-id="${item.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            <button type="button" class="icon-btn delete" data-type="sales" data-id="${item.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                        </div>
                    </div>
                    <div class="ticket-date">Ngày: ${item.date}</div>
                    <div class="ticket-row">
                        <span class="ticket-info-label">Khách hàng:</span>
                        <span class="ticket-info-val">Số điện thoại:</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-address">${item.customer}</span>
                        <span class="ticket-address">${item.phone}</span>
                    </div>
                    <div class="ticket-info-label">Địa chỉ:</div>
                    <div class="ticket-address">${item.address}</div>
                    <div class="ticket-divider"></div>
                    <div class="ticket-row">
                        <span class="ticket-info-label">Hàng hóa (${item.items} mặt hàng)</span>
                        <span class="view-detail-link" data-type="sales" data-id="${item.id}" style="cursor: pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Chi tiết</span>
                    </div>
                    <div class="ticket-footer">
                        <span class="total-label">TỔNG TIỀN:</span>
                        <span class="total-amount">${item.total}</span>
                    </div>
                </div>
            `).join('');

            // Render Pagination
            renderPagination(filteredSalesData.length, currentPageSales, '#page-pos .pagination-container', (newPage) => {
                currentPageSales = newPage;
                renderSales();
            });
        }
    }

    function renderImports() {
        const container = document.getElementById('import-list-container');
        if (container) {
            // Apply Fade In
            container.classList.remove('fade-in');
            void container.offsetWidth; // Trigger reflow
            container.classList.add('fade-in');

            // Slice Data
            const start = (currentPageImport - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentData = filteredImportData.slice(start, end);

            container.innerHTML = currentData.map(item => `
                <div class="ticket-card" data-type="imports" data-id="${item.id}">
                     <div class="card-header-row">
                        <span class="ticket-id">${item.id}</span>
                        <div class="card-actions">
                            <button type="button" class="icon-btn btn-edit" data-type="imports" data-id="${item.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            <button type="button" class="icon-btn delete" data-type="imports" data-id="${item.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                        </div>
                    </div>
                    <div class="ticket-date">Ngày: ${item.date}</div>
                    <div class="ticket-row">
                        <span class="ticket-info-label">Nhà cung cấp:</span>
                        <span class="ticket-info-val">Số điện thoại:</span>
                    </div>
                    <div class="ticket-row">
                        <span class="ticket-address">${item.supplier}</span>
                        <span class="ticket-address">${item.phone}</span>
                    </div>
                    <div class="ticket-info-label">Địa chỉ:</div>
                    <div class="ticket-address">${item.address}</div>
                    <div class="ticket-divider"></div>
                    <div class="ticket-row">
                        <span class="ticket-info-label">Hàng hóa (${item.items} mặt hàng)</span>
                        <span class="view-detail-link" data-type="imports" data-id="${item.id}" style="cursor: pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:2px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Chi tiết</span>
                    </div>
                    <div class="ticket-footer">
                        <span class="total-label">TỔNG TIỀN:</span>
                        <span class="total-amount">${item.total}</span>
                    </div>
                </div>
            `).join('');

            // Render Pagination
            renderPagination(filteredImportData.length, currentPageImport, '#page-import .pagination-container', (newPage) => {
                currentPageImport = newPage;
                renderImports();
            });
        }
    }

    function renderCustomers() {
        const container = document.getElementById('customers-table-container');
        if (container) {
            // Apply Fade In
            container.classList.remove('fade-in');
            void container.offsetWidth;
            container.classList.add('fade-in');

            const start = (currentPageCustomers - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentData = filteredCustomerData.slice(start, end);

            container.innerHTML = `
                <table class="entity-table">
                    <thead>
                        <tr>
                            <th style="text-align: left">Tên khách hàng</th>
                            <th style="text-align: left">Số điện thoại</th>
                            <th style="text-align: left">Địa chỉ</th>
                            <th style="text-align: center">Đơn hàng</th>
                            <th style="text-align: center">Tổng chi tiêu</th>
                            <th style="text-align: left">Ghi chú</th>
                            <th style="text-align: center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentData.map(item => `
                        <tr>
                            <td style="text-align: left">
                                <span class="entity-main-text">${item.name}</span>
                                <span class="entity-sub-text">${item.code}</span>
                            </td>
                            <td style="text-align: left">${item.phone}</td>
                            <td style="text-align: left">${item.address}</td>
                            <td style="text-align: center">${item.orders}</td>
                            <td style="text-align: center">${item.total}</td>
                            <td style="text-align: left">${item.note}</td>
                            <td style="text-align: center">
                                 <div class="card-actions" style="justify-content: center">
                                <button type="button" class="icon-btn btn-edit" data-id="${item.code}" data-type="customers"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                    <button class="icon-btn delete" data-type="customers" data-id="${item.code}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2-2 2h-14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg></button>
                                </div>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            renderPagination(filteredCustomerData.length, currentPageCustomers, '#page-customers .pagination-container', (newPage) => {
                currentPageCustomers = newPage;
                renderCustomers();
            });
        }
    }

    function renderSuppliers() {
        const container = document.getElementById('suppliers-table-container');
        if (container) {
            // Apply Fade In
            container.classList.remove('fade-in');
            void container.offsetWidth;
            container.classList.add('fade-in');

            const start = (currentPageSuppliers - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentData = filteredSupplierData.slice(start, end);

            container.innerHTML = `
                <table class="entity-table">
                    <thead>
                        <tr>
                            <th style="text-align: left">Tên công ty</th>
                            <th style="text-align: left">Số điện thoại</th>
                            <th style="text-align: left">Địa chỉ</th>
                            <th style="text-align: center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                         ${currentData.map(item => `
                        <tr>
                            <td style="text-align: left">
                                <span class="entity-main-text">${item.name}</span>
                                <span class="entity-sub-text">${item.code}</span>
                            </td>
                            <td style="text-align: left">${item.phone}</td>
                            <td style="text-align: left">${item.address}</td>
                            <td style="text-align: center">
                                 <div class="card-actions" style="justify-content: center">
                                <button type="button" class="icon-btn btn-edit" data-id="${item.code}" data-type="suppliers"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                    <button class="icon-btn delete" data-type="suppliers" data-id="${item.code}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                </div>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            renderPagination(filteredSupplierData.length, currentPageSuppliers, '#page-suppliers .pagination-container', (newPage) => {
                currentPageSuppliers = newPage;
                renderSuppliers();
            });
        }
    }

    function renderProducts() {
        const container = document.getElementById('products-table-container');
        if (container) {
            // Apply Fade In
            container.classList.remove('fade-in');
            void container.offsetWidth;
            container.classList.add('fade-in');

            const start = (currentPageProducts - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentData = filteredProductData.slice(start, end);

            container.innerHTML = `
                <table class="entity-table">
                    <thead>
                        <tr>
                            <th style="text-align: left">Mã hàng</th>
                            <th style="text-align: left">Sản phẩm</th>
                            <th style="text-align: center">Đơn vị tính</th>
                            <th style="text-align: right">Giá bán</th>
                            <th style="text-align: center">Tồn kho</th>
                            <th style="text-align: center">Trạng thái</th>
                            <th style="text-align: center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentData.map(item => `
                        <tr>
                            <td style="text-align: left">${item.id}</td>
                            <td style="text-align: left"><span class="entity-main-text">${item.name}</span></td>
                            <td style="text-align: center">${item.unit}</td>
                            <td style="text-align: right">${item.price}</td>
                            <td style="text-align: center">${item.stock}</td>
                            <td style="text-align: center"><span class="status-badge ${item.stock > 10 ? 'status-green' : (item.stock > 0 ? 'status-orange' : 'status-red')}">${item.status}</span></td>
                            <td style="text-align: center">
                                 <div class="card-actions" style="justify-content: center">
                                    <button class="icon-btn btn-edit" data-id="${item.id}" data-type="products"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                    <button class="icon-btn delete" data-type="products" data-id="${item.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                </div>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // Calculate Stats
            const total = productData.length;
            // Logic: High (>10), Low (1-10), Out (0)
            const low = productData.filter(i => i.stock > 0 && i.stock <= 10).length;
            const out = productData.filter(i => i.stock === 0).length;

            // Update DOM
            const elTotal = document.getElementById('stat-total-products');
            const elLow = document.getElementById('stat-low-stock');
            const elOut = document.getElementById('stat-out-stock');

            if (elTotal) elTotal.textContent = total;
            if (elLow) elLow.textContent = low;
            if (elOut) elOut.textContent = out;

            renderPagination(filteredProductData.length, currentPageProducts, '#page-products .pagination-container', (newPage) => {
                currentPageProducts = newPage;
                renderProducts();
            });
        }
    }

    // 3. NAVIGATION LOGIC
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');

            const tabName = item.dataset.tab;
            console.log("Switching to tab:", tabName);

            // Hide Home Placeholder
            const homePlaceholder = document.getElementById('home-placeholder');
            if (homePlaceholder) homePlaceholder.classList.add('icon-hidden');

            // Hide all pages
            document.querySelectorAll('.page-section').forEach(page => page.classList.add('icon-hidden'));

            // Show specific page
            if (tabName === 'pos') {
                const p = document.getElementById('page-pos');
                if (p) { p.classList.remove('icon-hidden'); renderSales(); }
            } else if (tabName === 'import') {
                const p = document.getElementById('page-import');
                if (p) { p.classList.remove('icon-hidden'); renderImports(); }
            } else if (tabName === 'customers') {
                const p = document.getElementById('page-customers');
                if (p) { p.classList.remove('icon-hidden'); renderCustomers(); }
            } else if (tabName === 'suppliers') {
                const p = document.getElementById('page-suppliers');
                if (p) { p.classList.remove('icon-hidden'); renderSuppliers(); }
            } else if (tabName === 'products') {
                const p = document.getElementById('page-products');
                if (p) { p.classList.remove('icon-hidden'); renderProducts(); }
            } else if (tabName === 'reports') {
                const p = document.getElementById('page-reports');
                if (p) { p.classList.remove('icon-hidden'); renderReports(); }
            }
        });
    });

    // Auto focus OTP inputs
    const otpInputs = document.querySelectorAll('.otp-box-styled'); // Updated class name
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // Enforce numbers only
            input.value = input.value.replace(/[^0-9]/g, '');

            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // --- SEARCH FUNCTIONALITY ---
    function normalizeString(str) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    function filterData(sourceData, keyword, fields) {
        if (!keyword) return [...sourceData];
        const lowerKeyword = normalizeString(keyword);

        return sourceData.filter(item => {
            return fields.some(field => {
                const val = item[field];
                return val && normalizeString(String(val)).includes(lowerKeyword);
            });
        });
    }

    // 1. Sales Search
    const salesSearchInput = document.querySelector('#page-pos .search-input');
    if (salesSearchInput) {
        salesSearchInput.addEventListener('input', (e) => {
            const keyword = e.target.value;
            // Fields: id, customer, phone, address
            filteredSalesData = filterData(salesData, keyword, ['id', 'customer', 'phone', 'address']);
            currentPageSales = 1;
            renderSales();
        });
    }

    // 2. Import Search
    const importSearchInput = document.querySelector('#page-import .search-input');
    if (importSearchInput) {
        importSearchInput.addEventListener('input', (e) => {
            const keyword = e.target.value;
            // Fields: id, supplier, phone, address
            filteredImportData = filterData(importData, keyword, ['id', 'supplier', 'phone', 'address']);
            currentPageImport = 1;
            renderImports();
        });
    }

    // 3. Customers Search
    const customerSearchInput = document.querySelector('#page-customers .search-input');
    if (customerSearchInput) {
        customerSearchInput.addEventListener('input', (e) => {
            const keyword = e.target.value;
            // Requirement: Code, Name, Phone
            filteredCustomerData = filterData(customerData, keyword, ['code', 'name', 'phone']);
            currentPageCustomers = 1;
            renderCustomers();
        });
    }

    // 4. Suppliers Search
    const supplierSearchInput = document.querySelector('#page-suppliers .search-input');
    if (supplierSearchInput) {
        supplierSearchInput.addEventListener('input', (e) => {
            const keyword = e.target.value;
            // Requirement: Code, Name, Phone
            filteredSupplierData = filterData(supplierData, keyword, ['code', 'name', 'phone']);
            currentPageSuppliers = 1;
            renderSuppliers();
        });
    }

    // 5. Products Search
    const productSearchInput = document.querySelector('#page-products .search-input');
    if (productSearchInput) {
        productSearchInput.addEventListener('input', (e) => {
            const keyword = e.target.value;
            // Requirement: Code (id), Name
            filteredProductData = filterData(productData, keyword, ['id', 'name']);
            currentPageProducts = 1;
            renderProducts();
        });
    }

    // Enforce Phone Number numeric only
    const phoneInput = document.getElementById('fp-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // --- GENERIC FORM HANDLER ---

    class GenericFormHandler {
        constructor() {
            this.modal = document.getElementById('modal-container-form');
            this.btnClose = document.getElementById('modal-close-form');
            this.btnCancel = document.getElementById('btn-cancel-form');
            this.form = document.getElementById('form-generic');
            this.titleEl = this.modal.querySelector('.modal-title');
            this.container = document.getElementById('form-fields-container');
            this.btnSave = document.getElementById('btn-save-form');

            this.currentConfig = null;
            this.state = {}; // Stores form values

            this.bindEvents();
        }

        bindEvents() {
            this.btnClose.addEventListener('click', () => this.close());
            this.btnCancel.addEventListener('click', () => this.close());
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        open(config) {
            this.currentConfig = config;
            this.state = {};
            this.titleEl.textContent = config.title;
            this.renderFields(config.fields);

            this.validate();

            this.modal.classList.remove('icon-hidden');

            const firstInput = this.container.querySelector('input, textarea');
            if (firstInput) firstInput.focus();
        }

        close() {
            this.modal.classList.add('icon-hidden');
            this.container.innerHTML = '';
            this.currentConfig = null;
        }

        renderFields(fields) {
            this.container.innerHTML = '';

            fields.forEach(field => {
                const group = document.createElement('div');
                group.className = 'form-group';
                if (field.marginTop) group.style.marginTop = field.marginTop;

                const label = document.createElement('label');
                label.style.fontWeight = 'bold';
                label.style.color = '#000';
                label.innerHTML = `${field.label} ${field.required ? '<span style="color: red">*</span>' : ''}`;
                group.appendChild(label);

                if (field.type === 'custom_unit') {
                    this.renderUnitField(group, field);
                } else if (field.type === 'textarea') {
                    const input = document.createElement('textarea');
                    input.className = 'input-field-styled modal-input-rounded';
                    input.placeholder = field.placeholder || '';
                    if (field.rows) input.rows = field.rows;
                    input.value = field.value || '';

                    input.addEventListener('input', (e) => {
                        this.state[field.key] = e.target.value;
                        this.validate();
                    });
                    this.state[field.key] = field.value || '';

                    group.appendChild(input);
                } else {
                    const input = document.createElement('input');
                    input.type = field.type || 'text';
                    input.className = 'input-field-styled modal-input-rounded';
                    input.placeholder = field.placeholder || '';
                    if (field.hidden) input.type = 'hidden';
                    input.value = field.value || '';

                    if (field.key === 'phone') {
                        input.addEventListener('input', (e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Enforce numbers
                            this.state[field.key] = e.target.value;
                            this.validate();
                        });
                    } else if (field.key === 'price' || field.key === 'stock') {
                        input.addEventListener('input', (e) => {
                            this.state[field.key] = e.target.value; // Keep raw for now
                            this.validate();
                        });
                    } else {
                        input.addEventListener('input', (e) => {
                            this.state[field.key] = e.target.value;
                            this.validate();
                        });
                    }

                    // Pre-fill state
                    this.state[field.key] = field.value || '';

                    group.appendChild(input);
                }

                this.container.appendChild(group);
            });
        }

        renderUnitField(container, field) {
            container.classList.add('unit-dropdown-group'); // Identifier for CSS

            // Re-creating the specific DOM structure for the Unit Dropdown
            // Container for input + toggle
            const wrapper = document.createElement('div');
            wrapper.className = 'modal-input-rounded';
            wrapper.style.cssText = "display: flex; align-items: center; padding: 0; position: relative; background: #fff; border: 1px solid transparent;";

            // Input
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = field.placeholder;
            input.className = 'input-field-styled';
            input.style.cssText = "flex: 1; border: none; outline: none; background: transparent; padding: 12px 15px; font-size: 15px; border-radius: 8px 0 0 8px;";
            input.value = field.value || '';
            this.state[field.key] = field.value || '';

            input.addEventListener('input', (e) => {
                this.state[field.key] = e.target.value;
                this.validate();
            });

            // Toggle Button
            const toggle = document.createElement('div');
            toggle.className = 'unit-dropdown-toggle';
            toggle.style.cssText = "padding: 10px 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;";
            // Using the requested LEFT chevron < which will rotate -90deg to DOWN V
            toggle.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" style="transition: transform 0.2s ease;"><polyline points="15 18 9 12 15 6"></polyline></svg>`;

            wrapper.appendChild(input);
            wrapper.appendChild(toggle);

            // Dropdown Menu
            const menu = document.createElement('div');
            menu.className = 'dropdown-menu';
            menu.id = 'dynamic-unit-dropdown';
            const units = ['Gói', 'Chai', 'Lon', 'Hộp', 'Bịch', 'Cái', 'Kg', 'Lít', 'Tuýp', 'Lốc', 'Thùng', 'Thanh', 'Vỉ', 'Cuộn', 'Nải', 'Túi'];
            units.forEach(u => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.textContent = u;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    input.value = u;
                    this.state[field.key] = u;
                    this.validate();
                    container.classList.remove('active'); // Close wrapper active state (managed below)
                });
                menu.appendChild(item);
            });

            container.appendChild(wrapper);
            container.appendChild(menu);
            container.style.position = 'relative'; // Ensure dropdown positioning

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                container.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    container.classList.remove('active');
                }
            });
        }

        validate() {
            let isValid = true;
            if (this.currentConfig && this.currentConfig.fields) {
                this.currentConfig.fields.forEach(f => {
                    if (f.required) {
                        const val = this.state[f.key];
                        if (!val || val.trim() === '') isValid = false;
                    }
                });
            }

            if (isValid) {
                this.btnSave.classList.remove('btn-disabled');
                this.btnSave.classList.add('btn-primary-valid');
            } else {
                this.btnSave.classList.remove('btn-primary-valid');
                this.btnSave.classList.add('btn-disabled');
            }
        }

        handleSubmit(e) {
            e.preventDefault();
            if (this.btnSave.classList.contains('btn-disabled')) return;

            if (this.currentConfig && this.currentConfig.onSubmit) {
                this.currentConfig.onSubmit(this.state);
                this.close();
            }
        }
    }

    const modalForm = new GenericFormHandler();


    // --- SPECIFIC FORM LOGIC ---

    // 1. ADD PRODUCT
    const btnOpenAddProduct = document.querySelector('#page-products .btn-add-new');
    if (btnOpenAddProduct) {
        btnOpenAddProduct.addEventListener('click', () => {
            modalForm.open({
                title: 'Thêm hàng hóa',
                fields: [
                    { key: 'name', label: 'Tên hàng hóa', type: 'text', required: true, placeholder: 'Nhập tên hàng hóa' },
                    { key: 'unit', label: 'Đơn vị tính', type: 'custom_unit', required: true, placeholder: 'Nhập đơn vị tính', marginTop: '15px' },
                ],
                onSubmit: (data) => {
                    // Logic to Add Product
                    // Generate Code
                    const maxId = productData.reduce((max, p) => {
                        const num = parseInt(p.id.replace('HH', ''));
                        return num > max ? num : max;
                    }, 0);
                    const code = 'HH' + String(maxId + 1).padStart(8, '0');

                    const newProduct = {
                        id: code,
                        name: data.name,
                        unit: data.unit,
                        priceRaw: 0,
                        importPrice: 0,
                        price: '0 đ', // Default
                        stock: 0,
                        status: 'Hết hàng',
                        expiryDate: ''
                    };
                    productData.push(newProduct);
                    filteredProductData = [...productData];
                    window.syncWithBackend('add', 'products', newProduct);

                    showModal('success', 'Thêm hàng hóa thành công');
                    handlePostSave('products', code);
                }
            });
        });
    }

    // Edit Product Logic (Adapted)
    window.editProduct = function (id) {
        const product = productData.find(p => p.id === id);
        if (!product) return;

        // Extract numeric price
        const priceNum = String(product.price).replace(/[^0-9]/g, '');

        modalForm.open({
            title: 'Cập nhật hàng hóa',
            fields: [
                { key: 'name', label: 'Tên hàng hóa', type: 'text', required: true, value: product.name },
                { key: 'unit', label: 'Đơn vị tính', type: 'custom_unit', required: true, value: product.unit, marginTop: '15px' },
                { key: 'price', label: 'Giá bán', type: 'text', required: false, value: priceNum, marginTop: '15px' },
                { key: 'stock', label: 'Tồn kho', type: 'number', required: false, value: product.stock, marginTop: '15px' }
            ],
            onSubmit: (data) => {
                const index = productData.findIndex(p => p.id === id);
                if (index !== -1) {
                    // Format Price
                    const pVal = parseInt(data.price) || 0;
                    const formattedPrice = new Intl.NumberFormat('vi-VN').format(pVal) + ' đ';

                    productData[index] = {
                        ...productData[index],
                        name: data.name,
                        unit: data.unit,
                        priceRaw: pVal,
                        price: formattedPrice,
                        stock: parseInt(data.stock) || 0,
                        status: (parseInt(data.stock) || 0) === 0 ? 'Hết hàng' : ((parseInt(data.stock) || 0) <= 10 ? 'Sắp hết hàng' : 'Còn hàng')
                    };
                    filteredProductData = [...productData];
                    window.syncWithBackend('update', 'products', productData[index]);
                    showModal('success', 'Cập nhật hàng hóa thành công');
                    // Trigger search/focus on the updated item
                    handlePostSave('products', id);
                }
            }
        });
    }

    // 2. ADD CUSTOMER
    const btnOpenAddCustomer = document.querySelector('#page-customers .btn-add-new');
    if (btnOpenAddCustomer) {
        btnOpenAddCustomer.addEventListener('click', () => {
            modalForm.open({
                title: 'Thêm khách hàng',
                fields: [
                    { key: 'name', label: 'Tên khách hàng', type: 'text', required: true, placeholder: 'Nhập tên khách hàng' },
                    { key: 'phone', label: 'Số điện thoại', type: 'text', required: true, placeholder: 'Nhập số điện thoại khách hàng' },
                    { key: 'address', label: 'Địa chỉ', type: 'text', required: true, placeholder: 'Nhập địa chỉ khách hàng' },
                    { key: 'note', label: 'Ghi chú', type: 'textarea', required: false, placeholder: 'Nhập ghi chú khách hàng', rows: 3 }
                ],
                onSubmit: (data) => {
                    // Generate ID
                    // KH + 8 digits taking max
                    const maxId = customerData.reduce((max, c) => {
                        const num = parseInt(c.code.replace('KH', ''));
                        return num > max ? num : max;
                    }, 0);
                    const code = 'KH' + String(maxId + 1).padStart(8, '0');

                    const newCustomer = {
                        name: data.name,
                        code: code,
                        phone: data.phone,
                        address: data.address,
                        orders: 0,
                        total: '0 <u>đ</u>',
                        note: data.note || ''
                    };

                    customerData.push(newCustomer);
                    filteredCustomerData = [...customerData];
                    window.syncWithBackend('add', 'customers', newCustomer);
                    showModal('success', 'Thêm khách hàng thành công');
                    handlePostSave('customers', code);
                }
            });
        });
    }

    // 3. ADD SUPPLIER
    const btnOpenAddSupplier = document.querySelector('#page-suppliers .btn-add-new');
    if (btnOpenAddSupplier) {
        btnOpenAddSupplier.addEventListener('click', () => {
            modalForm.open({
                title: 'Thêm nhà cung cấp',
                fields: [
                    { key: 'name', label: 'Tên công ty', type: 'text', required: true, placeholder: 'Nhập tên công ty nhà cung cấp' },
                    { key: 'contact', label: 'Người liên hệ', type: 'text', required: true, placeholder: 'Tên người liên hệ' },
                    { key: 'phone', label: 'Số điện thoại', type: 'text', required: true, placeholder: 'Nhập số điện thoại nhà cung cấp' },
                    { key: 'address', label: 'Địa chỉ', type: 'text', required: true, placeholder: 'Nhập số địa chỉ nhà cung cấp' }
                ],
                onSubmit: (data) => {
                    // Generate ID NCC + 7 digits
                    const maxId = supplierData.reduce((max, s) => {
                        const num = parseInt(s.code.replace('NCC', ''));
                        return num > max ? num : max;
                    }, 0);
                    const code = 'NCC' + String(maxId + 1).padStart(7, '0');

                    const newSupplier = {
                        name: data.name,
                        contact: data.contact,
                        code: code,
                        phone: data.phone,
                        address: data.address
                    };

                    supplierData.push(newSupplier);
                    filteredSupplierData = [...supplierData];
                    window.syncWithBackend('add', 'suppliers', newSupplier);
                    showModal('success', 'Thêm nhà cung cấp thành công');
                    handlePostSave('suppliers', code);
                }
            });
        });
    }


    // --- POST SAVE LOGIC (Search & Focus) ---
    function handlePostSave(type, id) {
        let searchInputSelector = '';
        let renderFunc = null;
        let dataList = null;
        let keys = [];

        if (type === 'products') {
            searchInputSelector = '#page-products .search-input';
            renderFunc = renderProducts;
            dataList = productData;
            keys = ['id', 'name'];
        } else if (type === 'customers') {
            searchInputSelector = '#page-customers .search-input';
            renderFunc = renderCustomers;
            dataList = customerData;
            keys = ['code', 'name', 'phone'];
        } else if (type === 'suppliers') {
            searchInputSelector = '#page-suppliers .search-input';
            renderFunc = renderSuppliers;
            dataList = supplierData;
            keys = ['code', 'name', 'phone'];
        } else if (type === 'sales') {
            searchInputSelector = '#page-pos .search-input';
            renderFunc = renderSales;
            dataList = salesData;
            keys = ['id', 'customer', 'phone'];
        } else if (type === 'imports') {
            searchInputSelector = '#page-import .search-input';
            renderFunc = renderImports;
            dataList = importData;
            keys = ['id', 'supplier', 'phone'];
        }
        const input = document.querySelector(searchInputSelector);
        if (input) {
            input.value = id;

            const keyword = id;
            const filtered = filterData(dataList, keyword, keys);

            if (type === 'products') filteredProductData = filtered;
            else if (type === 'customers') filteredCustomerData = filtered;
            else if (type === 'suppliers') filteredSupplierData = filtered;
            else if (type === 'sales') filteredSalesData = filtered;
            else if (type === 'imports') filteredImportData = filtered;

            if (type === 'products') currentPageProducts = 1;
            else if (type === 'customers') currentPageCustomers = 1;
            else if (type === 'suppliers') currentPageSuppliers = 1;
            else if (type === 'sales') currentPageSales = 1;
            else if (type === 'imports') currentPageImport = 1;

            if (renderFunc) renderFunc();
        }
    }


    // --- EDIT FUNCTIONALITY ---

    const editCustomer = (id) => {
        const cx = customerData.find(c => c.code === id);
        if (!cx) return;

        modalForm.open({
            title: 'Cập nhật khách hàng',
            fields: [
                { key: 'name', label: 'Tên khách hàng', type: 'text', required: true, value: cx.name },
                { key: 'phone', label: 'Số điện thoại', type: 'text', required: true, value: cx.phone },
                { key: 'address', label: 'Địa chỉ', type: 'text', required: true, value: cx.address },
                { key: 'note', label: 'Ghi chú', type: 'textarea', required: false, rows: 3, value: cx.note }
            ],
            onSubmit: (data) => {
                const index = customerData.findIndex(c => c.code === id);
                if (index !== -1) {
                    // Update Source
                    customerData[index] = { ...customerData[index], ...data };
                    filteredCustomerData = [...customerData];
                    window.syncWithBackend('update', 'customers', customerData[index]);

                    showModal('success', 'Cập nhật khách hàng thành công');
                    // Trigger search/focus on the updated item
                    handlePostSave('customers', id);
                }
            }
        });
    };

    const editSupplier = (id) => {
        const sp = supplierData.find(s => s.code === id);
        if (!sp) return;

        modalForm.open({
            title: 'Cập nhật nhà cung cấp',
            fields: [
                { key: 'name', label: 'Tên công ty', type: 'text', required: true, value: sp.name },
                { key: 'contact', label: 'Người liên hệ', type: 'text', required: true, value: sp.contact },
                { key: 'phone', label: 'Số điện thoại', type: 'text', required: true, value: sp.phone },
                { key: 'address', label: 'Địa chỉ', type: 'text', required: true, value: sp.address }
            ],
            onSubmit: (data) => {
                const index = supplierData.findIndex(s => s.code === id);
                if (index !== -1) {
                    // Update Source
                    // Update Source
                    supplierData[index] = { ...supplierData[index], ...data };
                    filteredSupplierData = [...supplierData];
                    window.syncWithBackend('update', 'suppliers', supplierData[index]);

                    showModal('success', 'Cập nhật nhà cung cấp thành công');
                    // Trigger search/focus on the updated item
                    handlePostSave('suppliers', id);
                }
            }
        });
    };

    // Global Edit Delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-edit');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            const type = btn.dataset.type;

            if (!id || !type) return;

            if (type === 'products') {
                if (window.editProduct) window.editProduct(id);
            } else if (type === 'customers') {
                editCustomer(id);
            } else if (type === 'suppliers') {
                editSupplier(id);
            } else if (type === 'sales' || type === 'imports') {
                if (window.transactionForm) {
                    window.transactionForm.open(type, id);
                } else if (typeof transactionForm !== 'undefined') {
                    transactionForm.open(type, id);
                }
            }
            return;
        }

        const card = e.target.closest('.ticket-card');
        if (!card) return;
        if (e.target.closest('.delete') || e.target.closest('.view-detail-link') || e.target.closest('.card-actions')) return;

        const type = card.dataset.type;
        const id = card.dataset.id;
        if (type === 'sales' || type === 'imports') {
            if (window.transactionForm) {
                window.transactionForm.open(type, id);
            } else if (typeof transactionForm !== 'undefined') {
                transactionForm.open(type, id);
            }
        }
    });

    // --- TRANSACTION FORM HANDLER (Sales & Import) ---
    class TransactionFormHandler {
        constructor() {
            this.modal = document.getElementById('modal-container-transaction-edit');
            this.btnClose = document.getElementById('tm-edit-close');
            this.titleEl = document.getElementById('tm-edit-title');
            this.codeEl = document.getElementById('tm-edit-code');

            this.btnCancel = document.getElementById('btn-cancel-edit-transaction');
            this.btnSave = document.getElementById('btn-save-edit-transaction');
            this.btnAddRow = document.getElementById('btn-add-row');

            // Fields
            this.nameInput = document.getElementById('tm-edit-name');
            this.dateInput = document.getElementById('tm-edit-date');
            this.phoneInput = document.getElementById('tm-edit-phone');
            this.addressInput = document.getElementById('tm-edit-address');
            this.partyTitle = document.getElementById('tm-party-title');
            this.nameLabel = document.getElementById('tm-name-label');
            this.totalDisplay = document.getElementById('tm-edit-total');
            this.tbody = document.getElementById('tm-edit-tbody');

            this.currentType = null; // 'sales' or 'imports'
            this.currentId = null;
            this.items = []; // Array of objects {name, unit, qty, price, total}

            this.bindEvents();
        }

        bindEvents() {
            if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
            if (this.btnCancel) this.btnCancel.addEventListener('click', () => this.close());
            if (this.btnAddRow) this.btnAddRow.addEventListener('click', () => this.addRow());
            if (this.btnSave) this.btnSave.addEventListener('click', () => this.save());

            // Bind Validation to Header Inputs
            if (this.nameInput) {
                this.nameInput.addEventListener('input', () => {
                    this.handlePartyChange();
                    this.validate();
                });
                this.nameInput.addEventListener('change', () => {
                    this.handlePartyChange();
                    this.validate();
                });
            }
        }

        getPartyList() {
            return this.currentType === 'sales' ? customerData : supplierData;
        }

        getSelectedParty(name) {
            const normalizedName = (name || '').trim().toLowerCase();
            if (!normalizedName) return null;
            return this.getPartyList().find((item) => item.name.trim().toLowerCase() === normalizedName) || null;
        }

        getPartyTitle() {
            return this.currentType === 'sales'
                ? 'T\u00ean kh\u00e1ch h\u00e0ng'
                : 'T\u00ean nh\u00e0 cung c\u1ea5p';
        }

        getPartyHeading() {
            return this.currentType === 'sales'
                ? 'Th\u00f4ng tin kh\u00e1ch h\u00e0ng'
                : 'Th\u00f4ng tin nh\u00e0 cung c\u1ea5p';
        }

        getPartyPlaceholderOption() {
            return this.currentType === 'sales'
                ? '-- Ch\u1ecdn kh\u00e1ch h\u00e0ng --'
                : '-- Ch\u1ecdn nh\u00e0 cung c\u1ea5p --';
        }

        async ensurePartyDataLoaded() {
            const isSales = this.currentType === 'sales';
            const currentList = isSales ? customerData : supplierData;
            if (currentList.length > 0) return;

            const endpoint = isSales ? '/api/customers/' : '/api/suppliers/';
            try {
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error(`Failed to load ${endpoint}: ${response.status}`);

                const payload = await response.json();
                const rows = Array.isArray(payload) ? payload : (payload.results || []);
                const normalizedRows = rows.map((item) => ({
                    ...item,
                    id: item.id || item.code
                }));

                if (isSales) {
                    customerData = normalizedRows;
                    filteredCustomerData = [...customerData];
                } else {
                    supplierData = normalizedRows;
                    filteredSupplierData = [...supplierData];
                }
            } catch (error) {
                console.error('Party data load error:', error);
            }
        }

        renderPartyOptions(selectedName = '') {
            if (!this.nameInput) return;

            this.nameInput.innerHTML = [
                `<option value="">${this.getPartyPlaceholderOption()}</option>`,
                ...this.getPartyList().map((item) => `<option value="${item.name}">${item.name}</option>`)
            ].join('');
            this.nameInput.value = selectedName || '';
            this.handlePartyChange();
        }

        syncPartyLabels() {
            if (this.partyTitle) {
                this.partyTitle.textContent = this.getPartyHeading();
            }
            if (this.nameLabel) {
                this.nameLabel.textContent = this.getPartyTitle();
            }
        }

        handlePartyChange() {
            const selectedParty = this.getSelectedParty(this.nameInput ? this.nameInput.value : '');
            if (!selectedParty) {
                if (this.phoneInput) this.phoneInput.value = '';
                if (this.addressInput) this.addressInput.value = '';
                return;
            }

            if (this.phoneInput) this.phoneInput.value = selectedParty.phone || '';
            if (this.addressInput) this.addressInput.value = selectedParty.address || '';
        }

        async open(type, id) {
            console.log(`Attempting to open transaction: ${type} #${id}`);

            // Re-query modal in case it wasn't valid at construction time
            if (!this.modal) {
                this.modal = document.getElementById('modal-container-transaction-edit');
            }

            if (!this.modal) {
                console.error("Critical: Modal container not found!");
                alert("Lỗi: Không tìm thấy modal giao diện (modal-container-transaction-edit).");
                return;
            }

            this.currentType = type;
            this.currentId = id;
            this.items = [];
            this.syncPartyLabels();
            await this.ensurePartyDataLoaded();

            if (id === null) {
                // ADD NEW MODE
                this.titleEl.textContent = type === 'sales' ? 'THÊM PHIẾU BÁN HÀNG' : 'THÊM PHIẾU NHẬP HÀNG';
                if (this.codeEl) this.codeEl.textContent = '[MỚI]';

                // Clear fields
                this.renderPartyOptions();
                if (this.dateInput) this.dateInput.value = new Date().toLocaleDateString('vi-VN'); // Today
                if (this.phoneInput) this.phoneInput.value = '';
                if (this.addressInput) this.addressInput.value = '';

                // Add initial empty row
                this.addRow();

            } else {
                // EDIT MODE
                let data = null;
                if (type === 'sales') {
                    // Ensure ID comparison matches (String vs Number)
                    data = salesData.find(i => i.id == id);
                    if (data) {
                        this.titleEl.textContent = 'PHIẾU BÁN HÀNG';
                        if (this.codeEl) this.codeEl.textContent = `[${id}]`;
                    }
                } else {
                    data = importData.find(i => i.id == id);
                    if (data) {
                        this.titleEl.textContent = 'PHIẾU NHẬP HÀNG';
                        if (this.codeEl) this.codeEl.textContent = `[${id}]`;
                    }
                }

                if (!data) {
                    console.error(`Transaction not found in ${type}Data for id ${id}`);
                    alert("Lỗi: Không tìm thấy dữ liệu phiếu này.");
                    return;
                }

                // Populate Header
                this.renderPartyOptions(type === 'sales' ? data.customer : data.supplier);
                if (this.dateInput) this.dateInput.value = data.date;
                if (this.phoneInput) this.phoneInput.value = data.phone;
                if (this.addressInput) this.addressInput.value = data.address;

                // Populate Items
                this.items = this.parseItemsDetail(data.itemsDetail, data.itemsStr || data.items);
            }

            this.renderRows();
            this.calculateTotal();
            this.validate(); // Initial Validation

            this.modal.classList.remove('icon-hidden');
            console.log("Modal opened successfully.");
        }

        // --- VALIDATION HELPERS ---
        showError(input, msg) {
            if (!input) return;
            input.classList.add('input-error');
            // Check if error msg exists
            let err = input.nextElementSibling;
            if (!err || !err.classList.contains('error-msg')) {
                err = document.createElement('span');
                err.className = 'error-msg';
                input.parentNode.insertBefore(err, input.nextSibling);
            }
            err.textContent = msg;
        }

        clearError(input) {
            if (!input) return;
            input.classList.remove('input-error');
            const err = input.nextElementSibling;
            if (err && err.classList.contains('error-msg')) {
                err.remove();
            }
        }

        validate() {
            let isValid = true;

            // 1. Header Validation (Customer/Supplier)
            const nameVal = this.nameInput ? this.nameInput.value.trim() : '';
            if (!nameVal) {
                this.showError(this.nameInput, this.currentType === 'sales' ? 'Vui long chon khach hang' : 'Vui long chon nha cung cap');
                isValid = false;
                // Empty is generic error, but checking existence is stricter
                // this.showError(this.nameInput, 'Không được để trống');
                // isValid = false;
            } else {
                // Relational Check
                let exists = false;
                if (this.currentType === 'sales') {
                    // Check Customer Name or ID match? The form uses Name.
                    exists = customerData.some(c => c.name.toLowerCase() === nameVal.toLowerCase());
                    if (!exists) {
                        this.showError(this.nameInput, 'Khách hàng không tồn tại trong hệ thống');
                        isValid = false;
                    } else {
                        this.clearError(this.nameInput);
                    }
                } else if (this.currentType === 'imports') {
                    exists = supplierData.some(s => s.name.toLowerCase() === nameVal.toLowerCase());
                    if (!exists) {
                        this.showError(this.nameInput, 'Nhà cung cấp không tồn tại trong hệ thống');
                        isValid = false;
                    } else {
                        this.clearError(this.nameInput);
                    }
                }
            }

            // 2. Items Validation
            if (this.items.length === 0) {
                isValid = false; // Need at least one item
            }

            const rows = this.tbody.querySelectorAll('tr');

            rows.forEach((tr, index) => {
                const item = this.items[index];
                const realInputQty = tr.querySelector('td:nth-child(2) input'); // Qty
                const realInputName = tr.querySelector('td:nth-child(1) input'); // Name
                const realInputPrice = tr.querySelector('td:nth-child(4) input'); // Price

                // A. Product Existence
                if (item.name) {
                    const prodExists = productData.some(p => p.name.toLowerCase() === item.name.toLowerCase());
                    if (!prodExists) {
                        this.showError(realInputName, 'Hàng hóa không tồn tại');
                        isValid = false;
                    } else {
                        this.clearError(realInputName);
                    }
                } else {
                    // Empty name
                    // isValid = false; // Optional: mark as required
                }

                // B. Numeric Validation (Qty > 0)
                if (item.qty <= 0) {
                    this.showError(realInputQty, 'Số lượng > 0');
                    isValid = false;
                } else {
                    this.clearError(realInputQty);
                }

                // C. Numeric Validation (Price > 0)
                if (item.price <= 0) {
                    this.showError(realInputPrice, 'Giá > 0');
                    isValid = false;
                } else {
                    this.clearError(realInputPrice);
                }
            });

            // Toggle Save Button
            if (this.btnSave) {
                if (isValid) {
                    this.btnSave.classList.remove('btn-disabled');
                    this.btnSave.classList.add('btn-primary-valid');
                    this.btnSave.disabled = false;
                    this.btnSave.style.pointerEvents = 'auto';
                    this.btnSave.style.opacity = '1';
                } else {
                    this.btnSave.classList.add('btn-disabled');
                    this.btnSave.classList.remove('btn-primary-valid');
                    this.btnSave.disabled = true;
                    this.btnSave.style.pointerEvents = 'none';
                    this.btnSave.style.opacity = '0.6';
                }
            }

            return isValid;
        }

        parseItemsString(itemsStr) {
            // Mock Data Format: "5x Mì Hảo Hảo, 2x Nước Suối"
            // We need to support existing format.
            if (!itemsStr) return [];
            return itemsStr.split(', ').map(s => {
                const parts = s.split('x ');
                const qty = parseInt(parts[0]) || 1;
                const name = parts[1] || 'Sản phẩm';
                const price = 10000; // Dummy price

                return {
                    name: name,
                    unit: 'Cái',
                    qty: qty,
                    price: price,
                    total: qty * price
                };
            });
        }

        parseItemsDetail(itemsDetail, fallbackItemsStr = '') {
            if (Array.isArray(itemsDetail) && itemsDetail.length > 0) {
                return itemsDetail.map((item) => {
                    const qty = parseInt(item.qty, 10) || 0;
                    const price = parseInt(item.price, 10) || 0;
                    return {
                        name: item.name || '',
                        unit: item.unit || '',
                        qty,
                        price,
                        importPrice: parseInt(item.importPrice, 10) || 0,
                        productId: item.productId || item.id || '',
                        total: qty * price
                    };
                });
            }

            return this.parseItemsString(fallbackItemsStr);
        }

        close() {
            this.modal.classList.add('icon-hidden');
            this.currentType = null;
            this.currentId = null;
        }

        addRow() {
            this.items.push({
                name: '',
                unit: '',
                qty: 0,
                price: 0,
                total: 0
            });
            this.renderRows();
        }

        deleteRow(index) {
            this.items.splice(index, 1);
            this.renderRows();
            this.calculateTotal();
        }

        updateRow(index, field, value) {
            const item = this.items[index];
            if (field === 'qty' || field === 'price') {
                // Remove non-numeric
                const num = parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
                item[field] = num;
                item.total = item.qty * item.price;
            } else {
                item[field] = value;
            }

            this.updateRowDOM(index);
        }

        updateRowDOM(index) {
            const item = this.items[index];
            // Update total cell
            const totalCell = document.getElementById(`tm-row-total-${index}`);
            if (totalCell) totalCell.innerHTML = formatCurrency(item.qty * item.price);
            this.calculateTotal();
        }

        applyProductSelection(index, product, tr) {
            if (!product) return;

            this.items[index].name = product.name;
            this.items[index].productId = product.id || '';
            this.items[index].unit = product.unit || '';
            this.items[index].importPrice = product.importPrice || 0;
            this.items[index].price = this.currentType === 'sales' ? (product.priceRaw || 0) : (product.importPrice || 0);
            this.items[index].total = this.items[index].qty * this.items[index].price;

            const unitInput = tr.querySelector('.tm-row-unit');
            const priceInput = tr.querySelector('.tm-row-price');
            if (unitInput) unitInput.value = this.items[index].unit;
            if (priceInput) priceInput.value = this.items[index].price;

            this.updateRowDOM(index);
        }

        renderRows() {
            this.tbody.innerHTML = '';
            this.items.forEach((item, index) => {
                const tr = document.createElement('tr');
                const tdName = document.createElement('td');
                const inputName = document.createElement('input');
                const productOptions = document.createElement('datalist');
                const productOptionsId = `tm-product-options-${index}`;
                inputName.className = 'input-field-styled';
                inputName.type = 'text';
                inputName.setAttribute('list', productOptionsId);
                inputName.setAttribute('autocomplete', 'off');
                inputName.style.width = '100%';
                inputName.placeholder = 'Chon hang hoa';
                productOptions.id = productOptionsId;
                productOptions.innerHTML = productData
                    .map((p) => `<option value="${p.name}"></option>`)
                    .join('');
                inputName.value = item.name || '';
                inputName.oninput = (e) => {
                    const product = productData.find((p) => p.name === e.target.value);
                    if (product) {
                        this.applyProductSelection(index, product, tr);
                    } else {
                        this.items[index].name = e.target.value;
                        this.items[index].productId = '';
                        if (!e.target.value) {
                            this.items[index].unit = '';
                            this.items[index].price = 0;
                            this.items[index].importPrice = 0;
                            this.items[index].total = 0;

                            const unitInput = tr.querySelector('.tm-row-unit');
                            const priceInput = tr.querySelector('.tm-row-price');
                            if (unitInput) { unitInput.value = ''; }
                            if (priceInput) { priceInput.value = ''; }
                            this.updateRowDOM(index);
                        }
                    }
                    this.validate();
                };
                inputName.onchange = inputName.oninput;
                tdName.appendChild(inputName);
                tdName.appendChild(productOptions);

                const tdQty = document.createElement('td');
                const qtyContainer = document.createElement('div');
                qtyContainer.style.display = 'flex';
                qtyContainer.style.alignItems = 'center';
                qtyContainer.style.justifyContent = 'center';
                qtyContainer.style.gap = '5px';
                tdQty.style.position = 'relative';

                const btnMinus = document.createElement('button');
                btnMinus.textContent = '-';
                btnMinus.className = 'btn-action-gray';
                btnMinus.style.padding = '5px 12px';
                btnMinus.style.minWidth = '30px';
                btnMinus.type = 'button';

                const inputQty = document.createElement('input');
                inputQty.type = 'text';
                inputQty.className = 'input-field-styled';
                inputQty.style.width = '60px';
                inputQty.style.textAlign = 'center';
                inputQty.value = item.qty;

                const btnPlus = document.createElement('button');
                btnPlus.textContent = '+';
                btnPlus.className = 'btn-action-gray';
                btnPlus.style.padding = '5px 12px';
                btnPlus.style.minWidth = '30px';
                btnPlus.type = 'button';

                const updateQtyFromButton = (newVal) => {
                    if (newVal < 0) newVal = 0;
                    this.items[index].qty = newVal;
                    inputQty.value = newVal;
                    this.updateRowDOM(index);
                    this.validate();
                };

                const updateQtyFromInput = (valStr) => {
                    const cleanVal = valStr.replace(/[^0-9]/g, '');
                    if (valStr !== cleanVal) {
                        inputQty.value = cleanVal;
                    }
                    const numVal = parseInt(cleanVal) || 0;
                    this.items[index].qty = numVal;
                    this.updateRowDOM(index);
                    this.validate();
                };

                btnMinus.onclick = () => updateQtyFromButton(this.items[index].qty - 1);
                btnPlus.onclick = () => updateQtyFromButton(this.items[index].qty + 1);
                inputQty.oninput = (e) => updateQtyFromInput(e.target.value);

                qtyContainer.appendChild(btnMinus);
                qtyContainer.appendChild(inputQty);
                qtyContainer.appendChild(btnPlus);
                tdQty.appendChild(qtyContainer);

                const tdUnit = document.createElement('td');
                const inputUnit = document.createElement('input');
                inputUnit.type = 'text';
                inputUnit.className = 'input-field-styled tm-row-unit';
                inputUnit.style.width = '100%';
                inputUnit.style.textAlign = 'center';
                inputUnit.value = item.unit;
                inputUnit.readOnly = true;
                inputUnit.style.backgroundColor = '#f5f5f5';
                inputUnit.style.color = '#555';
                tdUnit.appendChild(inputUnit);

                const tdPrice = document.createElement('td');
                const inputPrice = document.createElement('input');
                inputPrice.type = 'text';
                inputPrice.className = 'input-field-styled tm-row-price';
                inputPrice.style.width = '100%';
                inputPrice.style.textAlign = 'right';
                inputPrice.value = item.price;
                if (this.currentType === 'sales') {
                    inputPrice.readOnly = true;
                    inputPrice.style.backgroundColor = '#f5f5f5';
                    inputPrice.style.color = '#555';
                }
                inputPrice.oninput = (e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    e.target.value = val;
                    this.updateRow(index, 'price', val);
                    this.validate();
                };
                tdPrice.appendChild(inputPrice);

                const tdTotal = document.createElement('td');
                tdTotal.style.textAlign = 'right';
                tdTotal.style.fontWeight = 'bold';
                tdTotal.id = `tm-row-total-${index}`;
                tdTotal.innerHTML = formatCurrency(item.qty * item.price);

                const tdAction = document.createElement('td');
                tdAction.style.textAlign = 'center';
                const btnDel = document.createElement('button');
                btnDel.type = 'button';
                btnDel.className = 'icon-btn delete';
                btnDel.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
                btnDel.onclick = () => this.deleteRow(index);
                tdAction.appendChild(btnDel);

                tr.appendChild(tdName);
                tr.appendChild(tdQty);
                tr.appendChild(tdUnit);
                tr.appendChild(tdPrice);
                tr.appendChild(tdTotal);
                tr.appendChild(tdAction);

                this.tbody.appendChild(tr);
            });
        }

        calculateTotal() {
            const total = this.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            this.totalDisplay.innerHTML = formatCurrency(total);
        }

        save() {
            if (!this.validate()) return;

            const newName = this.nameInput.value;
            const newPhone = this.phoneInput.value;
            const newAddress = this.addressInput.value;

            const itemsStr = this.items.map(i => `${i.qty}x ${i.name}`).join(', ');
            const itemsCount = this.items.length;
            const itemsDetail = this.items.map(i => {
                const matchedProduct = productData.find(p => p.name === i.name);
                return {
                    productId: matchedProduct ? matchedProduct.id : (i.productId || ''),
                    name: i.name,
                    unit: i.unit,
                    qty: i.qty,
                    price: i.price,
                    importPrice: matchedProduct ? (matchedProduct.importPrice || 0) : (i.importPrice || 0)
                };
            });
            const totalVal = this.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            const totalStr = formatCurrency(totalVal);

            if (this.currentId === null) {
                const currentLen = this.currentType === 'sales' ? salesData.length : importData.length;
                const prefix = this.currentType === 'sales' ? 'BH' : 'NH';
                const newId = prefix + String(currentLen + 1).padStart(8, '0');

                const newObj = {
                    id: newId,
                    date: this.dateInput.value || new Date().toLocaleDateString('vi-VN'),
                    items: itemsCount,
                    itemsStr,
                    itemsDetail,
                    total: totalStr,
                    totalRaw: totalVal,
                    ...(this.currentType === 'sales' ? {
                        customer: newName,
                        phone: newPhone,
                        address: newAddress
                    } : {
                        supplier: newName,
                        phone: newPhone,
                        address: newAddress
                    })
                };

                if (this.currentType === 'sales') {
                    salesData.unshift(newObj);
                    filteredSalesData = [...salesData];
                    window.syncWithBackend('add', 'sales', newObj);
                } else {
                    importData.unshift(newObj);
                    filteredImportData = [...importData];
                    window.syncWithBackend('add', 'imports', newObj);
                }

                const savedType = this.currentType;
                showModal('success', 'Thêm mới phiếu thành công');
                this.close();
                handlePostSave(savedType, newId);

            } else {
                const savedType = this.currentType;
                if (this.currentType === 'sales') {
                    const index = salesData.findIndex(i => i.id == this.currentId);
                    if (index !== -1) {
                        salesData[index] = {
                            ...salesData[index],
                            customer: newName,
                            phone: newPhone,
                            address: newAddress,
                            items: itemsCount,
                            itemsStr,
                            itemsDetail,
                            total: totalStr,
                            totalRaw: totalVal,
                        };
                        filteredSalesData = [...salesData];
                        window.syncWithBackend('update', 'sales', salesData[index]);
                    }
                } else {
                    const index = importData.findIndex(i => i.id == this.currentId);
                    if (index !== -1) {
                        importData[index] = {
                            ...importData[index],
                            supplier: newName,
                            phone: newPhone,
                            address: newAddress,
                            items: itemsCount,
                            itemsDetail,
                            total: totalStr,
                            totalRaw: totalVal
                        };
                        filteredImportData = [...importData];
                        window.syncWithBackend('update', 'imports', importData[index]);
                    }
                }
                showModal('success', 'Cập nhật phiếu thành công');
                this.close();
                handlePostSave(savedType, this.currentId);
            }
        }
    }

    // Expose globally for event listeners
    window.transactionForm = new TransactionFormHandler();
    console.log("TransactionFormHandler initialized and attached to window");

    // "Add New" Button Listeners
    const btnAddSales = document.getElementById('btn-add-sales');
    const btnAddImport = document.getElementById('btn-add-import');

    if (btnAddSales) {
        btnAddSales.addEventListener('click', () => {
            window.transactionForm.open('sales', null);
        });
    }

    if (btnAddImport) {
        btnAddImport.addEventListener('click', () => {
            window.transactionForm.open('imports', null);
        });
    }


    // --- DELETE FUNCTIONALITY (Global Delegation) ---
    // State for delete modal
    let pendingDelete = null;
    const modalConfirmDelete = document.getElementById('modal-container-confirm-delete');
    const btnCloseConfirmDelete = document.getElementById('modal-close-confirm-delete');
    const btnCancelConfirmDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmActionDelete = document.getElementById('btn-confirm-delete');

    function closeDeleteModal() {
        if (modalConfirmDelete) modalConfirmDelete.classList.add('icon-hidden');
        pendingDelete = null;
    }

    // Bind Modal Events
    if (btnCloseConfirmDelete) btnCloseConfirmDelete.addEventListener('click', closeDeleteModal);
    if (btnCancelConfirmDelete) btnCancelConfirmDelete.addEventListener('click', closeDeleteModal);
    if (btnConfirmActionDelete) {
        btnConfirmActionDelete.addEventListener('click', () => {
            if (pendingDelete) {
                const { id, type } = pendingDelete;
                let dataArray = null;
                let filteredArrayName = null;
                let renderFunc = null;
                if (type === 'sales') {
                    dataArray = salesData;
                    filteredArrayName = 'filteredSalesData';
                    renderFunc = renderSales;
                }
                else if (type === 'imports') {
                    dataArray = importData;
                    filteredArrayName = 'filteredImportData';
                    renderFunc = renderImports;
                }
                else if (type === 'customers') {
                    dataArray = customerData;
                    filteredArrayName = 'filteredCustomerData';
                    renderFunc = renderCustomers;
                }
                else if (type === 'suppliers') {
                    dataArray = supplierData;
                    filteredArrayName = 'filteredSupplierData';
                    renderFunc = renderSuppliers;
                }
                else if (type === 'products') {
                    dataArray = productData;
                    filteredArrayName = 'filteredProductData';
                    renderFunc = renderProducts;
                }

                if (dataArray && renderFunc) {
                    // 1. Remove from Source Data
                    const index = dataArray.findIndex(item => (item.id === id || item.code === id));
                    if (index !== -1) {
                        dataArray.splice(index, 1);
                        window.syncWithBackend('delete', type, { id });

                        // 2. Remove from Filtered Data (using filter as requested)
                        // Note: We need to access the variable by name from the scope.
                        // Since they are likely local to the DOMContentLoaded closure, we can't use window[name].
                        // We have to explicitly map the array itself.

                        if (type === 'sales') filteredSalesData = filteredSalesData.filter(item => item.id !== id);
                        else if (type === 'imports') filteredImportData = filteredImportData.filter(item => item.id !== id);
                        else if (type === 'customers') filteredCustomerData = filteredCustomerData.filter(item => item.code !== id);
                        else if (type === 'suppliers') filteredSupplierData = filteredSupplierData.filter(item => item.code !== id);
                        else if (type === 'products') filteredProductData = filteredProductData.filter(item => item.id !== id);

                        renderFunc(); // Re-render to update UI and Stats
                        console.log(`Deleted ${type} item with id ${id}`);
                    }
                }
                closeDeleteModal();
            }
        });
    }

    document.addEventListener('click', (e) => {
        // Look for .delete button or its children
        const deleteBtn = e.target.closest('.delete');
        if (!deleteBtn) return;

        e.preventDefault();
        e.stopPropagation();

        // Get info
        const id = deleteBtn.dataset.id;
        const type = deleteBtn.dataset.type;

        if (!id || !type) return;

        // Open Confirm Modal
        pendingDelete = { id, type };
        if (modalConfirmDelete) {
            modalConfirmDelete.classList.remove('icon-hidden');
            // Optional: Update text to show what is being deleted if modal supports it
        }
    });

    // --- PRODUCT MANAGEMENT SUB-VIEWS STATE ---
    let currentPagePrice = 1;
    let currentPageInv = 1;
    let currentPageExp = 1;

    // --- PRODUCT DROPDOWN & SUB-VIEWS LOGIC ---
    const dropdownManage = document.getElementById('product-manage-dropdown');
    if (dropdownManage) {
        const toggle = dropdownManage.querySelector('.dropdown-toggle');
        const menu = dropdownManage.querySelector('.dropdown-menu');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownManage.classList.toggle('open');
            menu.classList.toggle('show');
        });

        // Close on click out
        document.addEventListener('click', (e) => {
            if (!dropdownManage.contains(e.target)) {
                dropdownManage.classList.remove('open');
                menu.classList.remove('show');
            }
        });

        // Menu Items
        const items = menu.querySelectorAll('.dropdown-item');
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                // 0: Price, 1: Inventory, 2: Expiry
                // Close dropdown
                dropdownManage.classList.remove('open');
                menu.classList.remove('show');

                // Switch View (Hide main product list, show sub-view)
                // Note: We stay in "Products" tab active state visually in nav
                document.getElementById('page-products').classList.add('icon-hidden'); // Main list

                if (index === 0) {
                    // Price
                    const p = document.getElementById('page-product-price');
                    if (p) { p.classList.remove('icon-hidden'); renderProductPriceManagement(); }
                } else if (index === 1) {
                    // Inventory
                    const p = document.getElementById('page-product-inventory');
                    if (p) { p.classList.remove('icon-hidden'); renderProductInventoryManagement(); }
                } else if (index === 2) {
                    // Expiry
                    const p = document.getElementById('page-product-expiry');
                    if (p) { p.classList.remove('icon-hidden'); renderProductExpiryManagement(); }
                }
            });
        });
    }

    // "Exit" Buttons
    document.querySelectorAll('.btn-exit-subview').forEach(btn => {
        btn.addEventListener('click', () => {
            // Hide subviews
            document.getElementById('page-product-price').classList.add('icon-hidden');
            document.getElementById('page-product-inventory').classList.add('icon-hidden');
            document.getElementById('page-product-expiry').classList.add('icon-hidden');
            // Show main product view
            document.getElementById('page-products').classList.remove('icon-hidden');
            renderProducts(); // Refresh
        });
    });

    // Helper: Parse DD/MM/YYYY
    function parseDateV(str) {
        if (!str) return new Date();
        const parts = str.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    // --- RENDER FUNCTIONS FOR SUB-VIEWS ---

    // 1. Price Management
    function renderProductPriceManagement() {
        const container = document.getElementById('product-price-table-container');
        if (!container) return;

        // Use filteredProductData
        const start = (currentPagePrice - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const currentData = filteredProductData.slice(start, end);

        container.innerHTML = `
            <table class="entity-table">
                <thead>
                    <tr>
                        <th style="text-align: left">Mã</th>
                        <th style="text-align: left">Sản phẩm</th>
                        <th style="text-align: center">Đơn vị tính</th>
                        <th style="text-align: right">Giá nhập</th>
                        <th style="text-align: center">% Giá bán</th>
                        <th style="text-align: right">Giá bán</th>
                        <th style="text-align: center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentData.map(item => {
            // Calc Margin %
            // Formula: Selling = Import + (Margin% * Import)
            // Selling - Import = Margin% * Import  => Margin% = (Selling - Import)/Import
            let margin = 0;
            if (item.importPrice > 0) {
                margin = Math.round(((item.priceRaw - item.importPrice) / item.importPrice) * 100);
            }
            return `
                        <tr>
                            <td style="text-align: left">${item.id}</td>
                            <td style="text-align: left"><span class="entity-main-text">${item.name}</span></td>
                             <td style="text-align: center">${item.unit}</td>
                            <td style="text-align: right">${formatCurrency(item.importPrice)}</td>
                            <td style="text-align: center">
                                <span style="background:#eee; padding:4px 8px; border-radius:4px; font-weight:bold;">${margin} %</span>
                            </td>
                            <td style="text-align: right">${item.price}</td>
                             <td style="text-align: center">
                                <button type="button" class="icon-btn btn-edit" data-id="${item.id}" data-type="products"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            </td>
                        </tr>
                        `
        }).join('')}
                </tbody>
            </table>
        `;

        renderPagination(filteredProductData.length, currentPagePrice, '#page-product-price .pagination-container', (p) => {
            currentPagePrice = p;
            renderProductPriceManagement();
        });
    }

    // 2. Inventory Management
    function renderProductInventoryManagement() {
        const container = document.getElementById('product-inventory-table-container');
        if (!container) return;

        // Slice
        const start = (currentPageInv - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const currentData = filteredProductData.slice(start, end);

        // Stats (Calculate on Full Data, not filtered)
        const totalOk = productData.filter(i => i.stock > 10).length;
        const totalLow = productData.filter(i => i.stock > 0 && i.stock <= 10).length;
        const totalOut = productData.filter(i => i.stock === 0).length;

        const elOk = document.getElementById('inv-stat-ok');
        const elLow = document.getElementById('inv-stat-low');
        const elOut = document.getElementById('inv-stat-out');
        if (elOk) elOk.textContent = totalOk;
        if (elLow) elLow.textContent = totalLow;
        if (elOut) elOut.textContent = totalOut;

        container.innerHTML = `
            <table class="entity-table">
                <thead>
                    <tr>
                         <th style="text-align: left">Mã</th>
                        <th style="text-align: left">Sản phẩm</th>
                        <th style="text-align: center">Đơn vị tính</th>
                        <th style="text-align: center">Tồn kho</th>
                        <th style="text-align: center">Mức cảnh báo</th>
                        <th style="text-align: center">Trạng thái</th>
                        <th style="text-align: center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                     ${currentData.map(item => {
            let badgeStyle = 'background:#E0E0E0; color:#333;'; // Default
            let statusText = 'Còn hàng';

            if (item.stock === 0) {
                badgeStyle = 'background:#FFEBEE; color:#C62828;';
                statusText = 'Hết hàng';
            } else if (item.stock <= 10) {
                badgeStyle = 'background:#FFF3E0; color:#EF6C00;'; // Using orange for Low
                statusText = 'Sắp hết';
            }

            // Alert Threshold: 10
            const threshold = 10;

            return `
                        <tr>
                             <td style="text-align: left">${item.id}</td>
                            <td style="text-align: left"><span class="entity-main-text">${item.name}</span></td>
                            <td style="text-align: center">${item.unit}</td>
                            <td style="text-align: center">${item.stock}</td>
                            <td style="text-align: center"><span style="background:#eee; padding:4px 8px; border-radius:4px;">${threshold}</span></td>
                             <td style="text-align: center"><span class="status-badge" style="${badgeStyle}">${statusText}</span></td>
                             <td style="text-align: center">
                                <button class="icon-btn btn-edit" data-id="${item.id}" data-type="products"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            </td>
                        </tr>
                        `
        }).join('')}
                </tbody>
            </table>
        `;

        renderPagination(filteredProductData.length, currentPageInv, '#page-product-inventory .pagination-container', (p) => {
            currentPageInv = p;
            renderProductInventoryManagement();
        });
    }

    // 3. Expiry Management
    function renderProductExpiryManagement() {
        const container = document.getElementById('product-expiry-table-container');
        if (!container) return;

        // Slice
        const start = (currentPageExp - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const currentData = filteredProductData.slice(start, end);

        // Calculate Days Remaining and Status
        const today = new Date(); // Or fixed date

        // Helper
        const getDaysLeft = (expStr) => {
            const exp = parseDateV(expStr);
            const diff = exp - today;
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        };

        // Stats
        let valid = 0, near = 0, expired = 0;
        productData.forEach(p => {
            const days = getDaysLeft(p.expiryDate);
            if (days < 0) expired++;
            else if (days < 30) near++; // Assume 30 days is threshold
            else valid++;
        });

        const elOk = document.getElementById('exp-stat-ok');
        const elNear = document.getElementById('exp-stat-near');
        const elExp = document.getElementById('exp-stat-expired');
        if (elOk) elOk.textContent = valid;
        if (elNear) elNear.textContent = near;
        if (elExp) elExp.textContent = expired;

        // Set Today
        const elToday = document.getElementById('current-date-display');
        if (elToday) elToday.textContent = formatDateForInput(today).split('-').reverse().join('/');

        container.innerHTML = `
            <table class="entity-table">
                <thead>
                    <tr>
                         <th style="text-align: left">Mã</th>
                        <th style="text-align: left">Sản phẩm</th>
                        <th style="text-align: center">Đơn vị tính</th>
                        <th style="text-align: center">Ngày hết hạn</th>
                        <th style="text-align: center">Mức cảnh báo</th>
                        <th style="text-align: center">Trạng thái</th>
                        <th style="text-align: center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                     ${currentData.map(item => {
            const days = getDaysLeft(item.expiryDate);
            let statusStr = 'Còn hạn';
            let badgeStyle = 'background:#E0E0E0; color:#333;';

            if (days < 0) {
                statusStr = 'Hết hạn';
                badgeStyle = 'background:#FFEBEE; color:#C62828;'; // Red
            } else if (days < 30) {
                statusStr = 'Sắp hết';
                badgeStyle = 'background:#FFF3E0; color:#EF6C00;'; // Orange
            }

            // Alert threshold random
            const th = [10, 20, 25, 30][Math.floor(Math.random() * 4)];

            return `
                        <tr>
                             <td style="text-align: left">${item.id}</td>
                            <td style="text-align: left"><span class="entity-main-text">${item.name}</span></td>
                            <td style="text-align: center">${item.unit}</td>
                            <td style="text-align: center">${item.expiryDate}</td>
                            <td style="text-align: center"><span style="background:#eee; padding:4px 8px; border-radius:4px;">${th} ngày</span></td>
                             <td style="text-align: center"><span class="status-badge" style="${badgeStyle}">${statusStr}</span></td>
                             <td style="text-align: center">
                                <button class="icon-btn btn-edit" data-id="${item.id}" data-type="products"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            </td>
                        </tr>
                        `
        }).join('')}
                </tbody>
            </table>
        `;

        renderPagination(filteredProductData.length, currentPageExp, '#page-product-expiry .pagination-container', (p) => {
            currentPageExp = p;
            renderProductExpiryManagement();
        });
    }

    // Bind Search Inputs for sub-views
    const bindSubSearch = (selector, type) => {
        const inp = document.querySelector(selector);
        if (inp) {
            inp.addEventListener('input', (e) => {
                const k = e.target.value;
                filteredProductData = filterData(productData, k, ['id', 'name']);

                if (type === 'price') { currentPagePrice = 1; renderProductPriceManagement(); }
                else if (type === 'inv') { currentPageInv = 1; renderProductInventoryManagement(); }
                else if (type === 'exp') { currentPageExp = 1; renderProductExpiryManagement(); }
            });
        }
    }

    bindSubSearch('#page-product-price .search-input', 'price');
    bindSubSearch('#page-product-inventory .search-input', 'inv');
    bindSubSearch('#page-product-expiry .search-input', 'exp');

    // --- TRANSACTION MODAL LOGIC ---

    const generateMockTransactionItems = (count, totalStr, type) => {
        let html = '';
        const productsList = [
            'Mỳ SiuKay Phô Mai', 'Mỳ Hảo Hảo Tôm Chua Cay', 'Nước ngọt Coca Cola',
            'Bánh Snack Khoai Tây', 'Dầu ăn Tường An', 'Nước mắm Nam Ngư',
            'Viên giặt Ariel', 'Sữa tươi Vinamilk', 'Bánh ChocoPie'
        ];

        for (let i = 0; i < count; i++) {
            const prodName = productsList[i % productsList.length];
            const qty = Math.floor(Math.random() * 10) + 1;
            const price = (Math.floor(Math.random() * 50) + 10) * 1000;
            const subtotal = qty * price;

            // Generate Random Future Date for HSD
            let hsdLabel = '';
            if (type === 'imports') {
                const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
                const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
                const year = 2025 + Math.floor(Math.random() * 3);
                hsdLabel = `<div class="tm-item-hsd">HSD: ${day}-${month}-${year}</div>`;
            }

            html += `
                <div class="tm-item">
                    ${hsdLabel}
                    <div class="tm-item-name">${prodName}</div>
                    <div class="tm-item-row">
                         <div class="tm-col tm-info-card">
                             <label>Số lượng</label>
                             <span>${qty}</span>
                         </div>
                         <div class="tm-col tm-info-card">
                            <label>Đơn giá</label>
                            <span>${formatCurrency(price)}</span>
                        </div>
                        <div class="tm-col tm-info-card">
                            <label>Thành tiền</label>
                            <span>${formatCurrency(subtotal)}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        return html;
    };

    const showTransactionDetail = (type, id) => {
        let item = null;
        let titlePrefix = '';

        if (type === 'sales') {
            item = salesData.find(x => x.id === id);
            titlePrefix = 'Chi tiết phiếu bán';
        } else if (type === 'imports') {
            item = importData.find(x => x.id === id);
            titlePrefix = 'Chi tiết phiếu nhập';
        }

        if (!item) return;

        // Populate Header
        const container = document.querySelector('.transaction-modal-box');
        if (container) {
            container.querySelector('.tm-title-prefix').textContent = titlePrefix;
            container.querySelector('#tm-id').textContent = id;

            // Populate Info
            const nameLabel = container.querySelector('.tm-info-group label');
            const nameVal = container.querySelector('#tm-customer');
            const phoneVal = container.querySelector('#tm-phone');

            if (type === 'sales') {
                nameLabel.textContent = 'Khách hàng';
                nameVal.textContent = item.customer;
            } else {
                nameLabel.textContent = 'Nhà cung cấp';
                nameVal.textContent = item.supplier;
            }
            phoneVal.textContent = item.phone;

            container.querySelector('#tm-date').textContent = item.date;
            container.querySelector('#tm-total').innerHTML = item.total;

            // Generate Items
            const listContainer = document.getElementById('tm-items-list');
            const detailItems = Array.isArray(item.itemsDetail) ? item.itemsDetail : [];
            if (detailItems.length > 0) {
                listContainer.innerHTML = detailItems.map(detail => {
                    const qty = parseInt(detail.qty, 10) || 0;
                    const price = parseInt(detail.price, 10) || 0;
                    const subtotal = qty * price;
                    return `
                <div class="tm-item">
                    <div class="tm-item-name">${detail.name || ''}</div>
                    <div class="tm-item-row">
                         <div class="tm-col tm-info-card">
                             <label>Số lượng</label>
                             <span>${qty}</span>
                         </div>
                         <div class="tm-col tm-info-card">
                            <label>Đơn vị</label>
                            <span>${detail.unit || ''}</span>
                        </div>
                        <div class="tm-col tm-info-card">
                            <label>Đơn giá</label>
                            <span>${formatCurrency(price)}</span>
                        </div>
                        <div class="tm-col tm-info-card">
                            <label>Thành tiền</label>
                            <span>${formatCurrency(subtotal)}</span>
                        </div>
                    </div>
                </div>`;
                }).join('');
            } else {
                listContainer.innerHTML = generateMockTransactionItems(item.items, item.total, type);
            }
        }

        document.getElementById('transaction-modal').classList.remove('icon-hidden');
    };

    // Event Delegation for Detail Links
    document.addEventListener('click', (e) => {
        // Use recursive check or closest
        const link = e.target.closest('.view-detail-link');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
            const type = link.dataset.type;
            const id = link.dataset.id;
            if (type && id) {
                showTransactionDetail(type, id);
            }
        }

        // Close Modal
        if (e.target.closest('#tm-close-icon') || e.target.closest('#tm-exit-btn')) {
            document.getElementById('transaction-modal').classList.add('icon-hidden');
        }

        // Click outside to close
        if (e.target.id === 'transaction-modal') {
            document.getElementById('transaction-modal').classList.add('icon-hidden');
        }
    });


    // =========================================================
    // REPORT LOGIC
    // =========================================================

    function parseDate(dateStr) {
        // format dd-mm-yyyy
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }

    function formatDateForInput(date) {
        // yyyy-mm-dd for input type="date"
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function renderReports() {
        console.log("Rendering Reports...");
        const container = document.getElementById('page-reports');
        if (!container) return;

        // 1. Get Elements by ID (Updated IDs)
        const filterCategory = document.getElementById('report-category');
        const filterTimeScale = document.getElementById('report-time-scale');
        const filterStart = document.getElementById('report-start-date');
        const filterEnd = document.getElementById('report-end-date');
        const filterDisplayType = document.getElementById('report-display-type');
        const btnApply = document.getElementById('btn-report-apply');
        const vizArea = container.querySelector('.report-visualization-area');

        // Check if elements exist (might not be if HTML update failed or partial)
        if (!filterCategory || !filterTimeScale || !filterStart || !filterEnd || !filterDisplayType) {
            console.error("Report elements not found - check HTML");
            return;
        }

        // 2. Set Default - Month (or User Default 'Week')
        if (!filterStart.value) {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            filterStart.value = formatDateForInput(firstDay);
        }
        if (!filterEnd.value) {
            filterEnd.value = formatDateForInput(new Date());
        }

        // 3. Event Listeners (Attach ONCE)
        // Check if already attached
        const newBtn = btnApply.cloneNode(true);
        btnApply.parentNode.replaceChild(newBtn, btnApply);

        newBtn.addEventListener('click', () => {
            updateReportView();
        });

        [filterCategory, filterTimeScale, filterDisplayType].forEach(el => {
            el.onchange = () => updateReportView();
        });

        // 4. Update View Function
        function updateReportView() {
            const category = filterCategory.value;
            const timeScale = filterTimeScale.value; // day, week, month, year
            const startStr = filterStart.value;
            const endStr = filterEnd.value;
            const displayType = filterDisplayType.value; // table, chart

            if (!startStr || !endStr) return;

            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            endDate.setHours(23, 59, 59, 999);

            // Filter Data by Date Range
            const validSales = salesData.filter(s => {
                const sDate = parseDate(s.date); // s.date is "dd-mm-yyyy" from generator
                if (!sDate) return false;
                return sDate >= startDate && sDate <= endDate;
            });

            vizArea.innerHTML = ''; // Clear

            if (category === 'revenue') {
                // Scenario A Logic: If Table is selected, still show Dashboard (Chart+Cards) as requested for now
                // or we could split it if the user strictly wants a data table.
                // Given "Image 5" request for "Detailed Table", we render renderRevenueReport.
                renderRevenueReport(validSales, timeScale, vizArea);
            }
            else if (category === 'top_selling') {
                // Scenario B
                renderTopProductsReport(validSales, vizArea);
            }
            else if (category === 'inventory') {
                // New Option
                renderInventoryReport(vizArea);
            }
        }

        // Initial Call
        updateReportView();
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return { week: weekNo, year: d.getUTCFullYear() };
    }

    // --- REVENUE REPORT LOGIC ---
    function renderRevenueReport(data, timeScale, container) {
        // Group Data
        const groups = {};

        data.forEach(item => {
            const date = parseDate(item.date); // dd-mm-yyyy
            if (!date) return;

            let key = '';
            // timeScale: "day", "week", "month", "year"
            if (timeScale === 'year') {
                key = date.getFullYear();
            } else if (timeScale === 'month') {
                key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            } else if (timeScale === 'week') {
                const w = getWeekNumber(date);
                key = `W${w.week}/${w.year}`;
            } else {
                // Default Day
                key = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!groups[key]) {
                groups[key] = { revenue: 0, profit: 0, orders: 0 };
            }

            groups[key].orders += 1;
            groups[key].revenue += item.totalRaw;

            if (item.itemsDetail && Array.isArray(item.itemsDetail)) {
                item.itemsDetail.forEach(d => {
                    const profit = (d.price - d.importPrice) * d.qty;
                    groups[key].profit += profit;
                });
            } else {
                groups[key].profit += item.totalRaw * 0.3;
            }
        });

        let labels = Object.keys(groups);

        // Sort labels
        if (timeScale === 'day') {
            // sort dd/mm (assume same year for simplicity or parse)
            labels.sort((a, b) => {
                const [d1, m1] = a.split('/').map(Number);
                const [d2, m2] = b.split('/').map(Number);
                if (m1 !== m2) return m1 - m2;
                return d1 - d2;
            });
        }
        else if (timeScale === 'week') {
            labels.sort((a, b) => {
                const [w1, y1] = a.replace('W', '').split('/').map(Number);
                const [w2, y2] = b.replace('W', '').split('/').map(Number);
                if (y1 !== y2) return y1 - y2;
                return w1 - w2;
            });
        }
        else if (timeScale === 'month') {
            labels.sort((a, b) => {
                const [m1, y1] = a.split('/').map(Number);
                const [m2, y2] = b.split('/').map(Number);
                if (y1 !== y2) return y1 - y2;
                return m1 - m2;
            });
        }
        else {
            labels.sort();
        }

        const revenueData = labels.map(k => groups[k].revenue);
        const profitData = labels.map(k => groups[k].profit);

        // --- RENDER LAYOUT (Matches Image 5) ---
        container.style.display = 'flex';
        container.style.gap = '20px';
        container.style.flexDirection = 'row';
        container.style.height = 'auto'; // Flex height

        // 1. Chart Container (Left)
        const chartContainer = document.createElement('div');
        chartContainer.style.flex = '3';
        chartContainer.style.background = '#fff';
        chartContainer.style.borderRadius = '12px';
        chartContainer.style.border = '1px solid #e0e0e0';
        chartContainer.style.padding = '20px';
        chartContainer.style.display = 'flex';
        chartContainer.style.flexDirection = 'column';
        chartContainer.style.minHeight = '400px';

        chartContainer.innerHTML = '<h3 style="margin-top:0; font-size:18px; color:#333; margin-bottom: 20px;">Biểu đồ Doanh thu & Lợi nhuận</h3>';

        if (labels.length > 0) {
            const svg = createLineChartSVG(labels, revenueData, profitData);
            chartContainer.appendChild(svg);
        } else {
            chartContainer.innerHTML += '<div style="flex:1; display:flex; align-items:center; justify-content:center; color:#999">Không có dữ liệu</div>';
        }

        // 2. Summary Container (Right) - Grid of cards
        const summaryContainer = document.createElement('div');
        summaryContainer.style.flex = '2';
        summaryContainer.style.display = 'grid';
        summaryContainer.style.gridTemplateColumns = '1fr';
        summaryContainer.style.gap = '20px';

        // Calculate Totals
        const totalRev = revenueData.reduce((a, b) => a + b, 0);
        const totalProf = profitData.reduce((a, b) => a + b, 0);
        const totalOrd = labels.reduce((a, k) => a + groups[k].orders, 0);

        // Create Summary Cards
        const createSumCard = (title, value, color, icon) => {
            return `
            <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #e0e0e0; display:flex; align-items:center; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: ${color}20; display:flex; justify-content:center; align-items:center; margin-right: 15px; color: ${color}; font-size: 24px;">
                   ${icon}
                </div>
                <div>
                   <div style="font-size: 14px; color: #666; margin-bottom: 5px;">${title}</div>
                   <div style="font-size: 24px; font-weight: bold; color: #333;">${value}</div>
                </div>
            </div>`;
        };

        summaryContainer.innerHTML = `
            ${createSumCard('Tổng doanh thu', formatCurrency(totalRev), '#0069D9', '$')}
            ${createSumCard('Tổng lợi nhuận', formatCurrency(totalProf), '#28a745', '+')}
            ${createSumCard('Tổng đơn hàng', totalOrd, '#f0ad4e', '#')}
        `;

        container.appendChild(chartContainer);
        container.appendChild(summaryContainer);
    }

    // --- INVENTORY REPORT PLACEHOLDER ---
    function renderInventoryReport(container) {
        container.innerHTML = `
            <div style="width: 100%; background: white; border-radius: 12px; padding: 20px; border: 1px solid #ddd;">
                <h3>Báo cáo Hàng Tồn Kho</h3>
                <div style="margin-top:20px; overflow-x:auto;">
                    <table class="entity-table">
                        <thead>
                            <tr style="background:#f5f5f5;">
                                <th style="padding:10px;">Mã SP</th>
                                <th>Tên Sản Phẩm</th>
                                <th>Đơn Vị</th>
                                <th style="text-align:right;">Giá Nhập</th>
                                <th style="text-align:right;">Giá Bán</th>
                                <th style="text-align:center;">Tồn Kho</th>
                                <th style="text-align:center;">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productData.map(p => `
                                <tr>
                                    <td style="padding:10px;">${p.id}</td>
                                    <td>${p.name}</td>
                                    <td>${p.unit}</td>
                                    <td style="text-align:right;">${formatCurrency(p.importPrice)}</td>
                                    <td style="text-align:right;">${p.price}</td>
                                    <td style="text-align:center; font-weight:bold;">${p.stock}</td>
                                    <td style="text-align:center;">
                                        <span class="status-badge ${p.stock == 0 ? 'status-red' : (p.stock < 10 ? 'status-orange' : 'status-green')}">
                                            ${p.status}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function createLineChartSVG(labels, data1, data2) {
        // data1: Revenue (Blue), data2: Profit (Green)
        const width = 600;
        const height = 300;
        const padding = 40;

        const maxVal = Math.max(...data1, ...data2, 1);
        const scaleY = (height - padding * 2) / maxVal;

        // Safety for single point
        const count = Math.max(labels.length - 1, 1);
        const scaleX = (width - padding * 2) / count;

        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.overflow = "visible";

        // Axis
        const axisPath = document.createElementNS(ns, "path");
        axisPath.setAttribute("d", `M ${padding} ${padding} V ${height - padding} H ${width - padding}`);
        axisPath.setAttribute("stroke", "#ccc");
        axisPath.setAttribute("fill", "none");
        svg.appendChild(axisPath);

        const getPoints = (data) => {
            return data.map((val, idx) => {
                const x = padding + idx * scaleX;
                const y = height - padding - (val * scaleY);
                return `${x},${y}`;
            }).join(' ');
        };

        // Line 1 (Revenue)
        if (data1.length > 0) {
            const line1 = document.createElementNS(ns, "polyline");
            line1.setAttribute("points", getPoints(data1));
            line1.setAttribute("fill", "none");
            line1.setAttribute("stroke", "#0069D9");
            line1.setAttribute("stroke-width", "2");
            svg.appendChild(line1);
        }

        // Line 2 (Profit)
        if (data2.length > 0) {
            const line2 = document.createElementNS(ns, "polyline");
            line2.setAttribute("points", getPoints(data2));
            line2.setAttribute("fill", "none");
            line2.setAttribute("stroke", "#28a745");
            line2.setAttribute("stroke-width", "2");
            svg.appendChild(line2);
        }

        // Labels (Limit to ~6-7 to avoid clutter)
        const step = Math.ceil(labels.length / 7);
        labels.forEach((l, i) => {
            if (i % step === 0 || i === labels.length - 1) {
                const text = document.createElementNS(ns, "text");
                const x = padding + i * scaleX;
                text.setAttribute("x", x);
                text.setAttribute("y", height - padding + 15);
                text.setAttribute("font-size", "10");
                text.setAttribute("text-anchor", "middle");
                text.textContent = l;
                svg.appendChild(text);
            }
        });

        return svg;
    }

    // --- TOP PRODUCTS REPORT LOGIC ---
    function renderTopProductsReport(salesData, container) {
        // Calculate Metrics
        const productStats = {}; // { id: { name, qty } }

        // Initialize all products with 0
        productData.forEach(p => {
            productStats[p.id] = { name: p.name, qty: 0 };
        });

        // Sum Sales Qty
        salesData.forEach(s => {
            if (s.itemsDetail && Array.isArray(s.itemsDetail)) {
                s.itemsDetail.forEach(d => {
                    const pid = d.productId || d.id; // handle variation
                    if (productStats[pid]) {
                        productStats[pid].qty += d.qty;
                    } else {
                        // fallback find by name if id missing??
                        // For now strict id
                    }
                });
            }
        });

        const allStats = Object.values(productStats);

        // Sorts
        const bestSelling = [...allStats].sort((a, b) => b.qty - a.qty).slice(0, 10);

        // Slow Moving: > 0 but lowest
        const soldProducts = allStats.filter(p => p.qty > 0);
        const slowMoving = [...soldProducts].sort((a, b) => a.qty - b.qty).slice(0, 10);

        // Non Selling
        const nonSelling = allStats.filter(p => p.qty === 0).slice(0, 10);

        // --- RENDER LAYOUT ---
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr 1fr';
        container.style.gap = '20px';
        container.style.height = 'auto';

        const createCard = (title, items, colorClass) => {
            const card = document.createElement('div');
            card.className = 'report-card';
            card.style.background = '#fff';
            card.style.border = '1px solid #ccc';
            card.style.borderRadius = '8px';
            card.style.overflow = 'hidden';

            const header = document.createElement('div');
            header.style.background = colorClass === 'blue' ? '#0069D9' : (colorClass === 'navy' ? '#003366' : '#d32f2f');
            header.style.color = '#fff';
            header.style.padding = '10px';
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';
            header.textContent = title;
            card.appendChild(header);

            const list = document.createElement('div');
            list.style.padding = '10px';

            if (items.length === 0) {
                list.innerHTML = '<div style="color:#999; text-align:center">Không có dữ liệu</div>';
            } else {
                items.forEach((item, idx) => {
                    const row = document.createElement('div');
                    row.style.borderBottom = '1px solid #eee';
                    row.style.padding = '8px 0';
                    row.style.fontSize = '13px';
                    row.textContent = `${idx + 1}. ${item.name} (${item.qty})`;
                    list.appendChild(row);
                });
            }
            card.appendChild(list);
            return card;
        };

        container.appendChild(createCard('Top 10 sản phẩm bán chạy', bestSelling, 'blue'));
        container.appendChild(createCard('Top 10 sản phẩm bán chậm', slowMoving, 'navy'));
        container.appendChild(createCard('Những sản phẩm không bán được', nonSelling, 'blue'));
    }

});


