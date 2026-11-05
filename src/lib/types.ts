export type ThemeMode = 'light' | 'dark';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  badgeColor?: string; // green, amber, brown
}

export interface ProductVariant {
  variantId: string;
  productId: string;
  label: string; // e.g. "500g", "1kg"
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  active: boolean;
  image?: string;
  weightGrams?: number; // e.g. 500, 1000
  deliveryFee?: number; // e.g. 70, 60, 0
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  aliases?: string[];
  tagline: string;
  description: string;
  roastLevel: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark' | string;
  roastOptions?: string[]; // e.g. ["Medium Roast", "Dark Roast"]
  grindOptions: string[]; // e.g. ["Whole Bean", "Filter Roast", "South Indian Filter", "Espresso", "French Press"]
  categoryId: string;
  categoryName: string;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  featured: boolean;
  accentColor: 'green' | 'amber' | 'brown';
  active: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  variants: ProductVariant[];
  shortDescription?: string;
  whyYoullLoveIt?: string[];
  bestFor?: string[];
  badges?: string[];
  freeShippingAboveKg?: number; // e.g. 5
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  image: string;
  grindOption?: string;
  roastLevel?: string;
  weightGrams?: number;
  deliveryFee?: number;
}

export interface Cart {
  id: string;
  userId?: string | null;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Payment Failed';

export type PaymentStatus =
  | 'pending'
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image: string;
  grindOption?: string;
  roastLevel?: string;
  weightGrams?: number;
  deliveryFee?: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CC-2026-94812"
  userId?: string | null;
  guestEmail: string;
  guestPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  shipmentId?: string;
  awbNumber?: string;
  courier: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  method?: string;
  verifiedAt?: string;
  rawWebhookPayload?: Record<string, unknown>;
  createdAt: string;
}

export interface TrackingPoint {
  status: OrderStatus;
  timestamp: string;
  location: string;
  description: string;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  courier: 'DTDC';
  awbNumber: string;
  status: OrderStatus;
  trackingHistory: TrackingPoint[];
  mode: 'mock' | 'live';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  orderId: string;
  type: string;
  channel: 'sms' | 'whatsapp';
  status: 'sent' | 'mocked' | 'failed';
  recipient: string;
  payloadSnapshot: string;
  sentAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorType: 'admin';
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeSnapshot?: Record<string, unknown>;
  afterSnapshot?: Record<string, unknown>;
  timestamp: string;
}

export interface UserAccount {
  uid: string;
  name: string;
  email: string;
  phone: string;
  addresses: ShippingAddress[];
  savedWishlist: string[]; // product IDs
  createdAt: string;
}

export interface AdminAccount {
  uid: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Inventory Manager' | 'Order Specialist' | 'Support Lead' | 'admin';
  status?: 'active' | 'inactive';
  lastLoginAt?: string;
  createdAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number | undefined;
  expiryDate: string; // YYYY-MM-DD
  usageLimit: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  position: 'hero' | 'top_announcement' | 'promo_grid';
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  currency: string;
  gstPercentage: number;
  taxInclusive: boolean;
  freeShippingThreshold: number;
  flatShippingFee: number;
  razorpayKeyId: string;
  codEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  adminAlertPhones?: string[];
  smsProvider?: 'fast2sms' | 'twilio' | 'custom_webhook' | 'mock';
  smsApiKey?: string;
  smsSenderId?: string;
  customWebhookUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: 'order' | 'stock' | 'payment' | 'delivery' | 'system';
  severity: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

export interface ReportFilter {
  reportType: 'sales' | 'orders' | 'inventory' | 'customers';
  dateRange: 'today' | 'last_7_days' | 'last_30_days' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface CustomerQuery {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  preferences: {
    welcomeSent: boolean;
    newProducts: boolean;
    priceDrops: boolean;
    siteActivity: boolean;
  };
  lastNotifiedAt?: string;
}

export type EmailTemplateType =
  | 'welcome_subscription'
  | 'new_product_launch'
  | 'price_drop_alert'
  | 'site_activity_announcement';

export interface EmailLog {
  id: string;
  templateType: EmailTemplateType;
  recipientEmail: string;
  subject: string;
  status: 'sent' | 'mocked' | 'failed';
  sentAt: string;
  previewSnippet: string;
  metadata?: Record<string, unknown>;
}

export interface BroadcastPayload {
  templateType: EmailTemplateType;
  subject: string;
  title: string;
  message: string;
  productName?: string;
  productSlug?: string;
  productImage?: string;
  originalPrice?: number;
  newPrice?: number;
  ctaText?: string;
  ctaUrl?: string;
}


