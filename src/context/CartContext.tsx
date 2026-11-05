import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant } from '../lib/types';
import { getProductBySlug } from '../lib/services/store-service';
import { IS_TEST_PRICE_MODE } from '../lib/data/mock-data';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoaded: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
    grindOption?: string,
    roastLevel?: string
  ) => boolean;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  totalWeightGrams: number;
  totalWeightKg: number;
  shippingFee: number;
  isFreeShipping: boolean;
  freeShippingKgRemaining: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = IS_TEST_PRICE_MODE
  ? 'coorg_coffee_cart_items_test1rs'
  : 'coorg_coffee_cart_items_v2';
const BULK_FREE_SHIPPING_GRAMS = 5000; // > 5kg Free Delivery

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (
    product: Product,
    variant: ProductVariant,
    quantity = 1,
    grindOption = 'South Indian Filter Grind',
    roastLevel?: string
  ): boolean => {
    const currentProd = getProductBySlug(product.slug) || product;
    const currentVariant = currentProd.variants.find((v) => v.variantId === variant.variantId) || variant;

    if (currentVariant.stock <= 0) {
      return false;
    }

    const itemWeight = currentVariant.weightGrams ?? (currentVariant.label.includes('1kg') ? 1000 : 500);
    const itemDeliveryFee = currentVariant.deliveryFee ?? (currentVariant.label.includes('1kg') ? 60 : 70);
    const chosenRoast = roastLevel || currentProd.roastLevel;

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (i) =>
          i.productId === product.id &&
          i.variantId === variant.variantId &&
          (i.roastLevel || '') === (chosenRoast || '') &&
          (i.grindOption || '') === (grindOption || '')
      );

      if (existingIdx >= 0 && prevItems[existingIdx]) {
        const existing = prevItems[existingIdx]!;
        const newQty = Math.min(existing.quantity + quantity, currentVariant.stock);
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          unitPrice: currentVariant.salePrice || currentVariant.price,
          weightGrams: itemWeight,
          deliveryFee: itemDeliveryFee,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId: variant.variantId,
          productName: product.name,
          variantLabel: variant.label,
          sku: variant.sku,
          unitPrice: variant.salePrice || variant.price,
          quantity: Math.min(quantity, currentVariant.stock),
          image: variant.image || product.images[0] || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
          grindOption,
          roastLevel: chosenRoast,
          weightGrams: itemWeight,
          deliveryFee: itemDeliveryFee,
        };
        return [...prevItems, newItem];
      }
    });

    setIsOpen(true);
    return true;
  };

  const removeItem = (productId: string, variantId: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string, delta: number) => {
    const product = getProductBySlug(productId);
    const variant = product?.variants.find((v) => v.variantId === variantId);
    const maxStock = variant ? variant.stock : 99;

    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(newQty, maxStock) };
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Weight and Delivery Calculations
  const totalWeightGrams = items.reduce((sum, item) => {
    const w = item.weightGrams ?? (item.variantLabel.includes('1kg') ? 1000 : 500);
    return sum + w * item.quantity;
  }, 0);

  const totalWeightKg = Number((totalWeightGrams / 1000).toFixed(2));
  const isBulkFreeShipping = totalWeightGrams >= BULK_FREE_SHIPPING_GRAMS;

  // Check if all items qualify for free delivery (e.g. 1kg filter packs with deliveryFee === 0)
  const allItemsFreeDelivery =
    items.length > 0 &&
    items.every((item) => (item.deliveryFee ?? (item.variantLabel.includes('1kg') ? 60 : 70)) === 0);

  let shippingFee = 0;
  if (items.length === 0 || IS_TEST_PRICE_MODE) {
    shippingFee = 0;
  } else if (isBulkFreeShipping || allItemsFreeDelivery) {
    shippingFee = 0;
  } else {
    // Highest applicable delivery charge among items in cart
    const chargedItems = items.filter((i) => (i.deliveryFee ?? 70) > 0);
    if (chargedItems.length > 0) {
      shippingFee = Math.max(...chargedItems.map((i) => i.deliveryFee ?? 70));
    } else {
      shippingFee = 0;
    }
  }

  const isFreeShipping = shippingFee === 0 && items.length > 0;
  const freeShippingKgRemaining = Math.max(0, Number(((BULK_FREE_SHIPPING_GRAMS - totalWeightGrams) / 1000).toFixed(1)));
  const freeShippingRemaining = isFreeShipping ? 0 : freeShippingKgRemaining;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoaded,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        totalWeightGrams,
        totalWeightKg,
        shippingFee,
        isFreeShipping,
        freeShippingKgRemaining,
        freeShippingThreshold: 5,
        freeShippingRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
