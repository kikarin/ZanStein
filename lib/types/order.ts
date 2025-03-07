import { Timestamp } from "firebase/firestore";

export interface OrderData {
  // User Info
  userId?: string;
  customerName: string;
  whatsappNumber: string;
  paymentMethod?: "DANA" | "OVO" | "GOPAY";
  isNameLocked?: boolean;
  // Project Info
  projectType: string;
  
  platform: string;
  projectName: string;
  applicationType: string;
  customApplicationType?: string;
  referenceLink?: string;

  // Development Info
  developmentMethod?: 'fullstack' | 'mixmatch';
  fullstackChoice?: {
    framework: string;
    database: string;
  };
  mixmatchChoice?: {
    frontend: string;
    backend: string;
    api: string;
    database: string;
  };
  roles?: string[];
  uiFramework?: string[];
  flutterUIFrameworks?: string[];
  themeChoice?: {
    mode?: string;
    style?: string;
  };

  
  notificationType?: string;
  customColors?: {
    colors: string[];
    count?: number;
  };

  // Additional Info
  deadline?: string;
  notes?: string;

  // Price Info
  originalPrice?: number;
  finalPrice?: number;
  discount?: number;
  totalPrice?: number;
   voucherCode?: string;

  // Metadata
  status?: string;
  createdAt?: Timestamp;
  lastUpdated?: Timestamp;
}

export interface PriceList {
  roles: {
    [key: string]: number;
  };
  fullstackFrameworks: {
    [key: string]: number;
  };
  databases: {
    [key: string]: number;
  };
  frontends: {
    [key: string]: number;
  };
  backends: {
    [key: string]: number;
  };
  apis: {
    [key: string]: number;
  };
  uiFrameworks: {
    [key: string]: number;
  };
  flutterUIFrameworks: {
    [key: string]: number;
  };
  notifications: {
    [key: string]: number;
  };
  deadlines: {
    [key: string]: number;
  };
  uiThemes: { [key: string]: number };
}