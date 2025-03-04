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
    laravel: 120000,
    nextjs: 130000,
    django: 125000,
    rails: 130000,
    'flutter': 220000
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
    sqlite: 20000
  },
  frontends: {
    react: 70000,
    vue: 65000,
    angular: 80000,
    svelte: 75000,
    nuxt: 70000,
    'flutter': 220000
  },
  backends: {
    laravel: 90000,
    express: 75000,
    golang: 90000,
    django: 85000,
    nestjs: 85000,
    spring: 95000
  },
  apis: {
    rest: 25000,
    graphql: 40000,
    grpc: 45000
  },
  uiFrameworks: {
    bootstrap: 25000,
    tailwind: 30000,
    material: 35000,
    antd: 35000,
    chakra: 30000,
    kitten: 25000,
  },
  uiThemes: {
    auto: 20000, // Harga untuk Auto Theme (Switch Dark/Light)
  },
  notifications: {
    browser: 0,
    sweetalert: 15000,
    toastify: 12000,
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