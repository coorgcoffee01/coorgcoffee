import {
  Product,
  Category,
  Review,
  Order,
  AuditLog,
  Coupon,
  Banner,
  StoreSettings,
  AdminAccount,
  SystemNotification,
  CustomerQuery,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_ADMIN_USERS,
  INITIAL_NOTIFICATIONS,
  IS_TEST_PRICE_MODE,
  ORIGINAL_PRODUCTS,
} from '../data/mock-data';
import { db } from '../firebase/config';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { sanitizeInput, sanitizeObject } from './security-service';

const STORAGE_KEYS = {
  PRODUCTS: IS_TEST_PRICE_MODE ? 'coorg_coffee_products_v13_test1rs' : 'coorg_coffee_products_v15_grinds',
  CATEGORIES: 'coorg_coffee_categories_v6',
  REVIEWS: 'coorg_coffee_reviews_v3',
  DELETED_REVIEWS: 'coorg_coffee_deleted_reviews_v1',
  ORDERS: 'coorg_coffee_orders_v3',
  AUDIT_LOGS: 'coorg_coffee_audit_logs_v2',
  SHIPMENTS: 'coorg_coffee_shipments_v2',
  COUPONS: IS_TEST_PRICE_MODE ? 'coorg_coffee_coupons_v2_test1rs' : 'coorg_coffee_coupons_v1',
  BANNERS: 'coorg_coffee_banners_v1',
  SETTINGS: 'coorg_coffee_settings_v1',
  ADMIN_USERS: 'coorg_coffee_admin_users_v1',
  NOTIFICATIONS: 'coorg_coffee_notifications_v1',
  QUERIES: 'coorg_coffee_queries_v1',
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

async function syncFirestoreDoc(collectionName: string, docId: string, data: any) {
  if (!db) {
    console.warn(`[Firebase] Firestore DB not initialized. Skipping sync for ${collectionName}/${docId}`);
    return;
  }
  try {
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(doc(db, collectionName, docId), cleanData, { merge: true });
    console.log(`[Firebase] Successfully saved document to Cloud Firestore: ${collectionName}/${docId}`);
  } catch (err: any) {
    console.error(`[Firebase] Cloud Firestore write failed for ${collectionName}/${docId}:`, err?.message || err);
    if (err?.code === 'permission-denied' || String(err).includes('permission')) {
      console.warn(
        '[Firebase] SECURITY RULES NOTICE: Open Firebase Console -> Cloud Firestore -> Rules tab and set "allow read, write: if true;" to enable Firestore document writes.'
      );
    }
  }
}

let firestoreSyncStarted = false;

export function initFirestoreSync() {
  if (typeof window === 'undefined' || firestoreSyncStarted || !db) return;
  firestoreSyncStarted = true;

  // 1. ORDERS REAL-TIME SYNC FROM CLOUD FIRESTORE
  try {
    const ordersCol = collection(db, 'orders');
    onSnapshot(
      ordersCol,
      (snapshot) => {
        const remoteOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && (data.orderNumber || data.id || data.grandTotal !== undefined)) {
            remoteOrders.push({
              id: docSnap.id,
              ...data,
            } as Order);
          }
        });

        if (remoteOrders.length > 0) {
          const localOrders = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
          const orderMap = new Map<string, Order>();

          // Remote orders from Cloud Firestore are source of truth across domains
          remoteOrders.forEach((o) => orderMap.set(o.id, o));
          // Preserve any local order not yet synced
          localOrders.forEach((o) => {
            if (!orderMap.has(o.id)) {
              orderMap.set(o.id, o);
            }
          });

          const mergedOrders = Array.from(orderMap.values()).sort((a, b) => {
            const timeA = new Date(a.createdAt || 0).getTime();
            const timeB = new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          setStored(STORAGE_KEYS.ORDERS, mergedOrders);
          notifyStoreUpdated('orders');
        }
      },
      (err) => {
        console.warn('[Firestore] Orders listener warning:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach orders listener:', err);
  }

  // 2. REVIEWS REAL-TIME SYNC FROM CLOUD FIRESTORE
  try {
    const reviewsCol = collection(db, 'reviews');
    onSnapshot(
      reviewsCol,
      (snapshot) => {
        const remoteReviews: Review[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Filter out dummy/empty test docs
          if (data && data.userName && (data.comment || data.rating)) {
            remoteReviews.push({
              id: docSnap.id,
              ...data,
            } as Review);
          }
        });

        const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_REVIEWS, []);
        const reviewMap = new Map<string, Review>();

        // Include seed INITIAL_REVIEWS (unless deleted)
        INITIAL_REVIEWS.forEach((r) => {
          if (!deletedIds.includes(r.id)) {
            reviewMap.set(r.id, r);
          }
        });

        // Merge local storage reviews (unless deleted)
        const localReviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
        localReviews.forEach((r) => {
          if (!deletedIds.includes(r.id)) {
            reviewMap.set(r.id, r);
          }
        });

        // Overlay Cloud Firestore reviews (source of truth from customer submissions)
        remoteReviews.forEach((r) => {
          if (!deletedIds.includes(r.id)) {
            reviewMap.set(r.id, r);
          }
        });

        const mergedReviews = Array.from(reviewMap.values()).sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        setStored(STORAGE_KEYS.REVIEWS, mergedReviews);
        notifyStoreUpdated('reviews');
      },
      (err) => {
        console.warn('[Firestore] Reviews listener warning:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to attach reviews listener:', err);
  }
}

const CATALOG_DATA_VERSION = '2026-11-14-v6';

export function initStoreData() {
  if (typeof window === 'undefined') return;
  const currentVer = localStorage.getItem('coorg_catalog_version');
  if (currentVer !== CATALOG_DATA_VERSION) {
    setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    localStorage.setItem('coorg_catalog_version', CATALOG_DATA_VERSION);
  } else if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  } else {
    const stored = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const isOutOfSync = IS_TEST_PRICE_MODE
      ? stored.some((p) => p.variants.some((v) => v.price !== 1 || v.deliveryFee !== 0))
      : stored.some((p) => p.variants.some((v) => v.price === 1));
    if (isOutOfSync) {
      setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    const previousReviews = getStored<Review[]>('coorg_coffee_reviews_v2', INITIAL_REVIEWS);
    setStored(STORAGE_KEYS.REVIEWS, previousReviews);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const previousOrders = getStored<Order[]>('coorg_coffee_orders_v2', []);
    setStored(STORAGE_KEYS.ORDERS, previousOrders);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setStored(STORAGE_KEYS.AUDIT_LOGS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHIPMENTS)) {
    setStored(STORAGE_KEYS.SHIPMENTS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    setStored(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    setStored(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) {
    setStored(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  // Ensure any cached products have updated grind options and clean badges, and include new products
  const storedProducts = getStored<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
  if (storedProducts && Array.isArray(storedProducts)) {
    let hasChanged = false;
    const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));
    const cleaned = storedProducts.map((p) => {
      let updated = p;
      const initial = initialMap.get(p.id);
      if (initial && JSON.stringify(p.grindOptions) !== JSON.stringify(initial.grindOptions)) {
        hasChanged = true;
        updated = { ...updated, grindOptions: initial.grindOptions };
      }
      const origBadges = updated.badges || [];
      const filteredBadges = origBadges.filter((b) => !b.toLowerCase().includes('free delivery'));
      if (filteredBadges.length !== origBadges.length) {
        hasChanged = true;
        updated = { ...updated, badges: filteredBadges };
      }
      return updated;
    });

    // Append any newly added initial products (e.g. chocolates)
    const existingIds = new Set(cleaned.map((p) => p.id));
    const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
    if (missing.length > 0) {
      hasChanged = true;
      cleaned.push(...missing);
    }

    if (hasChanged) {
      setStored(STORAGE_KEYS.PRODUCTS, cleaned);
    }
  }

  // Ensure any newly added categories (e.g. cat-chocolates) exist in stored categories
  const storedCategories = getStored<Category[] | null>(STORAGE_KEYS.CATEGORIES, null);
  if (storedCategories && Array.isArray(storedCategories)) {
    const existingCatIds = new Set(storedCategories.map((c) => c.id));
    const missingCats = INITIAL_CATEGORIES.filter((c) => !existingCatIds.has(c.id));
    if (missingCats.length > 0) {
      setStored(STORAGE_KEYS.CATEGORIES, [...storedCategories, ...missingCats]);
    }
  }

  // Launch real-time synchronization with Cloud Firestore
  initFirestoreSync();
}

/* ==================== STORE EVENT NOTIFIER ==================== */
export function notifyStoreUpdated(type: string = 'products') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('coorg_store_updated', { detail: { type } }));
    try {
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }
}

/* ==================== PRODUCTS ==================== */
export function getProducts(includeDeleted = false): Product[] {
  initStoreData();
  const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (includeDeleted) return all;
  return all.filter((p) => !p.isDeleted);
}

export function getAllProducts(): Product[] {
  return getProducts(true);
}

export function getDeletedProducts(): Product[] {
  initStoreData();
  const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  return all.filter((p) => p.isDeleted);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts(true);
  return products.find(
    (p) => (p.slug === slug || p.id === slug || (p.aliases && p.aliases.includes(slug))) && !p.isDeleted
  );
}

export function searchProducts(query: string, categoryId?: string): Product[] {
  let products = getProducts().filter((p) => p.active && !p.isDeleted);
  if (categoryId && categoryId !== 'cat-all') {
    products = products.filter((p) => p.categoryId === categoryId);
  }
  if (!query.trim()) return products;
  const q = query.toLowerCase().trim();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
  );
}

export function saveProduct(product: Product, adminName = 'Admin'): Product {
  const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const existingIdx = products.findIndex((p) => p.id === product.id);
  let updated: Product[];
  const now = new Date().toISOString();

  let targetProduct: Product;
  if (existingIdx >= 0) {
    const before = products[existingIdx];
    targetProduct = { ...product, updatedAt: now };
    products[existingIdx] = targetProduct;
    updated = [...products];
    logAuditAction(
      adminName,
      'UPDATE_PRODUCT',
      'Product',
      product.id,
      before as unknown as Record<string, unknown>,
      targetProduct as unknown as Record<string, unknown>
    );
  } else {
    targetProduct = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    updated = [targetProduct, ...products];
    logAuditAction(
      adminName,
      'CREATE_PRODUCT',
      'Product',
      targetProduct.id,
      undefined,
      targetProduct as unknown as Record<string, unknown>
    );
  }

  setStored(STORAGE_KEYS.PRODUCTS, updated);
  syncFirestoreDoc('products', targetProduct.id, targetProduct);
  notifyStoreUpdated('products');
  return targetProduct;
}

export function softDeleteProduct(productId: string, adminName = 'Admin'): boolean {
  const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const target = products.find((p) => p.id === productId);
  if (!target) return false;

  target.isDeleted = true;
  target.active = false;
  target.deletedAt = new Date().toISOString();
  target.updatedAt = new Date().toISOString();

  setStored(STORAGE_KEYS.PRODUCTS, products);
  syncFirestoreDoc('products', target.id, target);

  logAuditAction(
    adminName,
    'SOFT_DELETE_PRODUCT',
    'Product',
    productId,
    { isDeleted: false, active: true },
    { isDeleted: true, active: false, deletedAt: target.deletedAt }
  );

  notifyStoreUpdated('products');
  return true;
}

export function restoreProduct(productId: string, adminName = 'Admin'): boolean {
  const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const target = products.find((p) => p.id === productId);
  if (!target) return false;

  target.isDeleted = false;
  target.active = true;
  target.deletedAt = null;
  target.updatedAt = new Date().toISOString();

  setStored(STORAGE_KEYS.PRODUCTS, products);
  syncFirestoreDoc('products', target.id, target);

  logAuditAction(
    adminName,
    'RESTORE_PRODUCT',
    'Product',
    productId,
    { isDeleted: true, active: false },
    { isDeleted: false, active: true }
  );

  notifyStoreUpdated('products');
  return true;
}

export function deleteProduct(productId: string, adminName = 'Admin'): void {
  const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const target = products.find((p) => p.id === productId);
  const updated = products.filter((p) => p.id !== productId);
  setStored(STORAGE_KEYS.PRODUCTS, updated);
  if (target) {
    logAuditAction(
      adminName,
      'PERMANENT_DELETE_PRODUCT',
      'Product',
      productId,
      target as unknown as Record<string, unknown>,
      undefined
    );
  }
  notifyStoreUpdated('products');
}

export function updateVariantStock(
  productId: string,
  variantId: string,
  newStock: number,
  adminName = 'Admin'
): boolean {
  const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const product = products.find((p) => p.id === productId);
  if (!product) return false;
  const variant = product.variants.find((v) => v.variantId === variantId);
  if (!variant) return false;

  const oldStock = variant.stock;
  variant.stock = Math.max(0, newStock);
  product.updatedAt = new Date().toISOString();
  setStored(STORAGE_KEYS.PRODUCTS, products);
  syncFirestoreDoc('products', product.id, product);

  logAuditAction(
    adminName,
    'UPDATE_STOCK',
    'ProductVariant',
    variantId,
    { stock: oldStock },
    { stock: variant.stock }
  );

  // Trigger low-stock notification if stock falls below 10
  if (variant.stock < 10) {
    addSystemNotification({
      title: `Low Stock Warning: ${product.name}`,
      message: `Variant ${variant.label} (${variant.sku}) is down to ${variant.stock} units!`,
      category: 'stock',
      severity: 'warning',
    });
  }

  notifyStoreUpdated('products');
  return true;
}

export function toggleVariantStockStatus(
  productId: string,
  variantId: string,
  outOfStock: boolean,
  defaultRestockQty = 50,
  adminName = 'Admin'
): boolean {
  return updateVariantStock(
    productId,
    variantId,
    outOfStock ? 0 : defaultRestockQty,
    adminName
  );
}

export function toggleProductActive(
  productId: string,
  active: boolean,
  adminName = 'Admin'
): boolean {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return false;
  product.active = active;
  product.updatedAt = new Date().toISOString();
  setStored(STORAGE_KEYS.PRODUCTS, products);
  syncFirestoreDoc('products', product.id, product);
  logAuditAction(
    adminName,
    active ? 'ACTIVATE_PRODUCT' : 'DEACTIVATE_PRODUCT',
    'Product',
    productId,
    undefined,
    { active }
  );
  return true;
}

export function updateOrderAWB(
  orderId: string,
  awbNumber: string,
  courierName = 'DTDC Express Air',
  adminName = 'Admin'
): Order | undefined {
  const order = getOrderById(orderId);
  if (!order) return undefined;

  order.awbNumber = awbNumber;
  order.courier = courierName;
  order.updatedAt = new Date().toISOString();
  saveOrder(order);

  logAuditAction(
    adminName,
    'UPDATE_ORDER_AWB',
    'Order',
    orderId,
    undefined,
    { awbNumber, courier: courierName }
  );

  return order;
}

/* ==================== CATEGORIES ==================== */
export function getCategories(): Category[] {
  initStoreData();
  return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategory(category: Category, adminName = 'Admin'): Category {
  const categories = getCategories();
  const idx = categories.findIndex((c) => c.id === category.id);
  let updated: Category[];

  if (idx >= 0) {
    categories[idx] = category;
    updated = [...categories];
    logAuditAction(adminName, 'UPDATE_CATEGORY', 'Category', category.id, undefined, category as any);
  } else {
    const newCat = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
    };
    updated = [...categories, newCat];
    category = newCat;
    logAuditAction(adminName, 'CREATE_CATEGORY', 'Category', newCat.id, undefined, newCat as any);
  }

  setStored(STORAGE_KEYS.CATEGORIES, updated);
  syncFirestoreDoc('categories', category.id, category);
  return category;
}

export function deleteCategory(categoryId: string, adminName = 'Admin'): void {
  const categories = getCategories();
  const target = categories.find((c) => c.id === categoryId);
  const updated = categories.filter((c) => c.id !== categoryId);
  setStored(STORAGE_KEYS.CATEGORIES, updated);
  if (target) {
    logAuditAction(adminName, 'DELETE_CATEGORY', 'Category', categoryId, target as any, undefined);
  }
}

/* ==================== ORDERS ==================== */
export function getOrders(): Order[] {
  initStoreData();
  return getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function getOrderById(orderIdOrNumber: string): Order | undefined {
  const orders = getOrders();
  return orders.find(
    (o) =>
      o.id === orderIdOrNumber ||
      o.orderNumber.toLowerCase() === orderIdOrNumber.toLowerCase()
  );
}

export function saveOrder(order: Order): Order {
  const sanitizedOrder: Order = {
    ...order,
    guestEmail: sanitizeInput(order.guestEmail),
    guestPhone: sanitizeInput(order.guestPhone),
    shippingAddress: sanitizeObject(order.shippingAddress),
  };
  const orders = getOrders();
  const existingIdx = orders.findIndex((o) => o.id === sanitizedOrder.id);
  if (existingIdx >= 0) {
    orders[existingIdx] = sanitizedOrder;
  } else {
    orders.unshift(sanitizedOrder);
  }
  setStored(STORAGE_KEYS.ORDERS, orders);
  syncFirestoreDoc('orders', sanitizedOrder.id, sanitizedOrder);

  // Notify new order
  addSystemNotification({
    title: `Order Received #${sanitizedOrder.orderNumber}`,
    message: `New order for ₹${sanitizedOrder.grandTotal} from ${sanitizedOrder.shippingAddress.fullName}`,
    category: 'order',
    severity: 'success',
  });

  notifyStoreUpdated('orders');
  return sanitizedOrder;
}

export function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  adminName = 'Admin'
): Order | undefined {
  const order = getOrderById(orderId);
  if (!order) return undefined;

  const beforeStatus = order.status;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveOrder(order);

  logAuditAction(
    adminName,
    'UPDATE_ORDER_STATUS',
    'Order',
    orderId,
    { status: beforeStatus },
    { status }
  );

  return order;
}

export function decrementStockForOrder(order: Order): boolean {
  const products = getProducts();
  let canFulfill = true;

  for (const item of order.items) {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) return false;
    const v = prod.variants.find((v) => v.variantId === item.variantId);
    if (!v || v.stock < item.quantity) {
      canFulfill = false;
      break;
    }
  }

  if (!canFulfill) return false;

  for (const item of order.items) {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      const v = prod.variants.find((v) => v.variantId === item.variantId);
      if (v) {
        v.stock -= item.quantity;
      }
    }
  }

  setStored(STORAGE_KEYS.PRODUCTS, products);
  return true;
}

/* ==================== REVIEWS ==================== */
export function getReviews(productId?: string): Review[] {
  initStoreData();
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  if (productId) {
    return reviews.filter((r) => r.productId === productId && r.status === 'approved');
  }
  return reviews;
}

export function addReview(
  review: Omit<Review, 'id' | 'createdAt' | 'status'> & {
    id?: string;
    status?: 'pending' | 'approved' | 'rejected';
    createdAt?: string;
  }
): Review {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const newReview: Review = {
    ...review,
    id: review.id || `rev-${Date.now()}`,
    userName: sanitizeInput(review.userName),
    title: review.title ? sanitizeInput(review.title) : undefined,
    comment: sanitizeInput(review.comment),
    productName: review.productName ? sanitizeInput(review.productName) : undefined,
    status: review.status || 'pending',
    createdAt: review.createdAt || new Date().toISOString(),
  };
  reviews.unshift(newReview);
  setStored(STORAGE_KEYS.REVIEWS, reviews);
  syncFirestoreDoc('reviews', newReview.id, newReview);
  notifyStoreUpdated('reviews');
  return newReview;
}

export function updateReviewStatus(
  reviewId: string,
  status: 'approved' | 'rejected',
  adminName = 'Admin'
): Review | undefined {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const target = reviews.find((r) => r.id === reviewId);
  if (!target) return undefined;

  const beforeStatus = target.status;
  target.status = status;
  setStored(STORAGE_KEYS.REVIEWS, reviews);
  syncFirestoreDoc('reviews', target.id, target);

  logAuditAction(
    adminName,
    'MODERATE_REVIEW',
    'Review',
    reviewId,
    { status: beforeStatus },
    { status }
  );

  notifyStoreUpdated('reviews');
  return target;
}

export function deleteReview(reviewId: string, adminName = 'Admin'): void {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const target = reviews.find((r) => r.id === reviewId);
  const updated = reviews.filter((r) => r.id !== reviewId);
  setStored(STORAGE_KEYS.REVIEWS, updated);

  const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_REVIEWS, []);
  if (!deletedIds.includes(reviewId)) {
    deletedIds.push(reviewId);
    setStored(STORAGE_KEYS.DELETED_REVIEWS, deletedIds);
  }

  if (db) {
    deleteDoc(doc(db, 'reviews', reviewId)).catch((err) => {
      console.warn('[Firebase] Delete review from Firestore warning:', err);
    });
  }

  if (target) {
    logAuditAction(adminName, 'DELETE_REVIEW', 'Review', reviewId, target as any, undefined);
  }
  notifyStoreUpdated('reviews');
}

/* ==================== COUPONS ==================== */
export function getCoupons(): Coupon[] {
  initStoreData();
  return getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
}

export function saveCoupon(coupon: Coupon, adminName = 'Admin'): Coupon {
  const coupons = getCoupons();
  const idx = coupons.findIndex((c) => c.id === coupon.id);
  let updated: Coupon[];
  const now = new Date().toISOString();

  if (idx >= 0) {
    coupons[idx] = coupon;
    updated = [...coupons];
    logAuditAction(adminName, 'UPDATE_COUPON', 'Coupon', coupon.id, undefined, coupon as any);
  } else {
    const newCoupon = {
      ...coupon,
      id: coupon.id || `coup-${Date.now()}`,
      createdAt: now,
    };
    coupon = newCoupon;
    updated = [newCoupon, ...coupons];
    logAuditAction(adminName, 'CREATE_COUPON', 'Coupon', newCoupon.id, undefined, newCoupon as any);
  }

  setStored(STORAGE_KEYS.COUPONS, updated);
  syncFirestoreDoc('coupons', coupon.id, coupon);
  return coupon;
}

export function deleteCoupon(couponId: string, adminName = 'Admin'): void {
  const coupons = getCoupons();
  const target = coupons.find((c) => c.id === couponId);
  const updated = coupons.filter((c) => c.id !== couponId);
  setStored(STORAGE_KEYS.COUPONS, updated);
  if (target) {
    logAuditAction(adminName, 'DELETE_COUPON', 'Coupon', couponId, target as any, undefined);
  }
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string } {
  const coupons = getCoupons();
  const target = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

  if (!target) {
    return { valid: false, discountAmount: 0, message: 'Invalid or inactive coupon code.' };
  }

  const today = new Date().toISOString().split('T')[0] ?? '';
  if (target.expiryDate && target.expiryDate < today) {
    return { valid: false, discountAmount: 0, message: 'This coupon code has expired.' };
  }

  if (subtotal < target.minOrderValue) {
    return { valid: false, discountAmount: 0, message: `Minimum order value for this code is ₹${target.minOrderValue}` };
  }

  if (target.usageLimit && target.usedCount >= target.usageLimit) {
    return { valid: false, discountAmount: 0, message: 'Coupon usage limit reached.' };
  }

  let discount = 0;
  if (target.discountType === 'percentage') {
    discount = Math.round((subtotal * target.discountValue) / 100);
    if (target.maxDiscountAmount && discount > target.maxDiscountAmount) {
      discount = target.maxDiscountAmount;
    }
  } else {
    discount = target.discountValue;
  }

  return { valid: true, discountAmount: Math.min(discount, subtotal), message: `Coupon ${target.code} applied!` };
}

/* ==================== BANNERS ==================== */
export function getBanners(): Banner[] {
  initStoreData();
  return getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
}

export function saveBanner(banner: Banner, adminName = 'Admin'): Banner {
  const banners = getBanners();
  const idx = banners.findIndex((b) => b.id === banner.id);
  let updated: Banner[];

  if (idx >= 0) {
    banners[idx] = banner;
    updated = [...banners];
    logAuditAction(adminName, 'UPDATE_BANNER', 'Banner', banner.id, undefined, banner as any);
  } else {
    const newBanner = {
      ...banner,
      id: banner.id || `ban-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    banner = newBanner;
    updated = [...banners, newBanner];
    logAuditAction(adminName, 'CREATE_BANNER', 'Banner', newBanner.id, undefined, newBanner as any);
  }

  setStored(STORAGE_KEYS.BANNERS, updated);
  syncFirestoreDoc('banners', banner.id, banner);
  return banner;
}

export function deleteBanner(bannerId: string, adminName = 'Admin'): void {
  const banners = getBanners();
  const target = banners.find((b) => b.id === bannerId);
  const updated = banners.filter((b) => b.id !== bannerId);
  setStored(STORAGE_KEYS.BANNERS, updated);
  if (target) {
    logAuditAction(adminName, 'DELETE_BANNER', 'Banner', bannerId, target as any, undefined);
  }
}

/* ==================== STORE SETTINGS ==================== */
export function getStoreSettings(): StoreSettings {
  initStoreData();
  return getStored<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveStoreSettings(settings: StoreSettings, adminName = 'Admin'): StoreSettings {
  const before = getStoreSettings();
  setStored(STORAGE_KEYS.SETTINGS, settings);
  syncFirestoreDoc('settings', 'store_config', settings);
  logAuditAction(adminName, 'UPDATE_SETTINGS', 'StoreSettings', 'store_config', before as any, settings as any);
  return settings;
}

/* ==================== ADMIN USERS ==================== */
export function getAdminUsers(): AdminAccount[] {
  initStoreData();
  return getStored<AdminAccount[]>(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
}

export function saveAdminUser(user: AdminAccount, adminName = 'Admin'): AdminAccount {
  const users = getAdminUsers();
  const idx = users.findIndex((u) => u.uid === user.uid);
  let updated: AdminAccount[];

  if (idx >= 0) {
    users[idx] = user;
    updated = [...users];
    logAuditAction(adminName, 'UPDATE_ADMIN_USER', 'AdminUser', user.uid, undefined, user as any);
  } else {
    const newUser = {
      ...user,
      uid: user.uid || `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    user = newUser;
    updated = [...users, newUser];
    logAuditAction(adminName, 'CREATE_ADMIN_USER', 'AdminUser', newUser.uid, undefined, newUser as any);
  }

  setStored(STORAGE_KEYS.ADMIN_USERS, updated);
  syncFirestoreDoc('admin_users', user.uid, user);
  return user;
}

export function deleteAdminUser(uid: string, adminName = 'Admin'): void {
  const users = getAdminUsers();
  const target = users.find((u) => u.uid === uid);
  const updated = users.filter((u) => u.uid !== uid);
  setStored(STORAGE_KEYS.ADMIN_USERS, updated);
  if (target) {
    logAuditAction(adminName, 'DELETE_ADMIN_USER', 'AdminUser', uid, target as any, undefined);
  }
}

/* ==================== SYSTEM NOTIFICATIONS ==================== */
export function getSystemNotifications(): SystemNotification[] {
  initStoreData();
  return getStored<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function addSystemNotification(
  notif: Omit<SystemNotification, 'id' | 'read' | 'createdAt'>
): SystemNotification {
  const list = getSystemNotifications();
  const newNotif: SystemNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newNotif);
  setStored(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 100));
  return newNotif;
}

export function markNotificationRead(id: string): void {
  const list = getSystemNotifications();
  const target = list.find((n) => n.id === id);
  if (target) {
    target.read = true;
    setStored(STORAGE_KEYS.NOTIFICATIONS, list);
  }
}

export function clearAllNotifications(): void {
  setStored(STORAGE_KEYS.NOTIFICATIONS, []);
}

/* ==================== AUDIT LOGS ==================== */
export function getAuditLogs(): AuditLog[] {
  initStoreData();
  return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
}

export function logAuditAction(
  actorName: string,
  action: string,
  targetType: string,
  targetId: string,
  beforeSnapshot?: Record<string, unknown>,
  afterSnapshot?: Record<string, unknown>
): AuditLog {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actorId: 'admin-1',
    actorType: 'admin',
    actorName,
    action,
    targetType,
    targetId,
    ...(beforeSnapshot !== undefined && { beforeSnapshot }),
    ...(afterSnapshot !== undefined && { afterSnapshot }),
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  setStored(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  syncFirestoreDoc('audit_logs', newLog.id, newLog);
  return newLog;
}

/* ==================== CUSTOMER QUERIES ==================== */
export function getCustomerQueries(): CustomerQuery[] {
  initStoreData();
  return getStored<CustomerQuery[]>(STORAGE_KEYS.QUERIES, []);
}

export function addCustomerQuery(queryData: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): CustomerQuery {
  const queries = getCustomerQueries();
  const newQuery: CustomerQuery = {
    id: `query-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: sanitizeInput(queryData.name),
    phone: sanitizeInput(queryData.phone),
    ...(queryData.email && { email: sanitizeInput(queryData.email) }),
    message: sanitizeInput(queryData.message),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  queries.unshift(newQuery);
  setStored(STORAGE_KEYS.QUERIES, queries);

  // Sync to Cloud Firestore Database (SB / Firebase DB)
  syncFirestoreDoc('queries', newQuery.id, newQuery);

  // Trigger System Notification for Admin Dashboard & Topbar Bell
  const notifications = getSystemNotifications();
  const newNotif: SystemNotification = {
    id: `notif-${Date.now()}`,
    title: `New Customer Query from ${newQuery.name}`,
    message: `Phone: ${newQuery.phone} — "${newQuery.message.slice(0, 50)}${newQuery.message.length > 50 ? '...' : ''}"`,
    category: 'system',
    severity: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotif);
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
  syncFirestoreDoc('notifications', newNotif.id, newNotif);

  return newQuery;
}

export function updateQueryStatus(
  queryId: string,
  status: 'new' | 'in_progress' | 'resolved'
): void {
  const queries = getCustomerQueries();
  const target = queries.find((q) => q.id === queryId);
  if (target) {
    target.status = status;
    setStored(STORAGE_KEYS.QUERIES, queries);
    syncFirestoreDoc('queries', queryId, target);
  }
}
