import { OrderData, PriceList } from '../types/order';

export const PRICE_LIST: PriceList = {
  roles: {
    user: 6000,
    admin: 12000,
    superadmin: 18000,
    finance: 14000,
    editor: 10000,
    moderator: 10000,
    operator: 9000,
  },
  fullstackFrameworks: {
    laravel: 125000,  // Naik biar setara dengan Django
    django: 125000,
    rails: 125000,  // Turun sedikit karena lebih niche
    nextjs: 130000,
    'flutter': 280000
  },
  flutterUIFrameworks: {
    // 1️⃣ Default UI Framework (Gratis)
    "flutter-material{default)": 0,

    // 2️⃣ Third-Party UI Frameworks (Custom UI)
    "flutter-getwidget": 60000,
    "flutter-flutterflow": 60000,
    "flutter-velocityx": 50000,
    "flutter-uikit": 50000,

    // 3️⃣ Advanced UI & Animation Frameworks
    "flutter-lottie": 50000,
    "flutter-animated-text-kit": 40000,

    // 4️⃣ UI Component Libraries
    "flutter-shadcn": 50000,
    "flutter-tailwind": 50000,
    "flutter-fluent-ui": 60000,

    // 5️⃣ Design System Frameworks
    "flutter-material3": 60000,
    "flutter-adaptive-theme": 50000,
  },
  databases: {
    mysql: 25000,
    postgresql: 30000,
    firebase: 35000,
    supabase: 35000,
  },
  frontends: {
    vue: 65000,
    nuxt: 70000,
    svelte: 70000,  // Turun dikit
    vite: 75000,
    react: 80000,
    angular: 85000,  // Naik dikit karena kompleks
    nextjs: 90000,  // Naik dikit karena SSR
    'flutter': 220000
  },
  backends: {
    express: 75000,
    nestjs: 88000,  // Naik sedikit karena lebih enterprise-ready
    django: 92000,  // Naik sedikit karena skalabilitas tinggi
    laravel: 90000,
    golang: 95000,  // Naik sedikit karena performa tinggi
    spring: 130000  // Naik karena lebih kompleks dan enterprise-level
  },
  apis: {
    rest: 25000,
    graphql: 42000,  // Naik sedikit karena lebih kompleks
  },  
  uiFrameworks: {
    bootstrap: 25000,
    tailwind: 30000,
    chakra: 30000,
    material: 35000,
    antd: 35000,
    kitten: 25000,
  },
  uiThemes: {
    auto: 20000, // Harga untuk Auto Theme (Switch Dark/Light)
  },
  notifications: {
    browser: 0,
    sweetalert: 15000,
    toastify: 16000,  // Naik sedikit karena tetap lebih ringan dari Snackbar
    snackbar: 18000,
  },  
  deadlines: {
    '30days': 0,
    '14days': 30000,
    '7days': 55000,
    '3days': 85000
  }
};

export const calculateOrderPrice = (orderData: OrderData): number => {
  let total = 0;
  
  // Hitung harga berdasarkan roles
  if (orderData.roles) {
    orderData.roles.forEach(role => {
      total += PRICE_LIST.roles[role] || 0;
    });
  }

  // Hitung harga stack teknologi
  if (orderData.developmentMethod === 'fullstack' && orderData.fullstackChoice) {
    total += PRICE_LIST.fullstackFrameworks[orderData.fullstackChoice.framework] || 0;
    total += PRICE_LIST.databases[orderData.fullstackChoice.database] || 0;
  } else if (orderData.mixmatchChoice) {
    total += PRICE_LIST.frontends[orderData.mixmatchChoice.frontend] || 0;
    total += PRICE_LIST.backends[orderData.mixmatchChoice.backend] || 0;
    total += PRICE_LIST.apis[orderData.mixmatchChoice.api] || 0;
    total += PRICE_LIST.databases[orderData.mixmatchChoice.database] || 0;
  }

// Hitung harga UI Framework
if (orderData.uiFramework) {
  orderData.uiFramework.forEach(framework => {
    total += PRICE_LIST.uiFrameworks[framework] || 0;
  });
}

// Hitung harga Flutter UI Framework (jika ada)
if (orderData.uiFramework) {
  orderData.uiFramework.forEach(framework => {
    if (framework.startsWith("flutter-")) {
      total += PRICE_LIST.flutterUIFrameworks?.[framework] || 0;
    }
  });
}


    // 🔹 Hitung harga tema UI (jika memilih auto)
    if (orderData.themeChoice?.mode === "auto") {
      total += PRICE_LIST.uiThemes.auto || 0;
    }

  // Hitung harga notifikasi
  if (orderData.notificationType) {
    total += PRICE_LIST.notifications[orderData.notificationType] || 0;
  }

  // Hitung harga deadline
  if (orderData.deadline) {
    total += PRICE_LIST.deadlines[orderData.deadline] || 0;
  }

  // Terapkan diskon jika ada
  if (orderData.discount) {
    total = total - (total * orderData.discount / 100);
  }

  return total;
}; 