import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product, type Variant } from "@/lib/catalogue";

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type ResolvedLine = CartLine & {
  product: Product;
  variant: Variant;
  unitPrice: number;
  lineTotal: number;
};

const STORAGE_KEY = "coorg-cart-v1";

type CartApi = {
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (productId: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
};

const CartContext = createContext<CartApi | null>(null);

function resolve(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.variantId === line.variantId);
    if (!product || !variant) return [];
    const unitPrice = variant.salePrice ?? variant.price;
    return [{ ...line, product, variant, unitPrice, lineTotal: unitPrice * line.quantity }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore malformed cart */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((productId: string, variantId: string, quantity = 1) => {
    setLines((current) => {
      const product = products.find((p) => p.id === productId);
      const variant = product?.variants.find((v) => v.variantId === variantId);
      if (!variant) return current;
      const existing = current.find((l) => l.variantId === variantId);
      if (existing) {
        return current.map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.min(variant.stock, l.quantity + quantity) }
            : l,
        );
      }
      return [...current, { productId, variantId, quantity: Math.min(variant.stock, quantity) }];
    });
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.variantId !== variantId) return [line];
        const variant = products
          .flatMap((p) => p.variants)
          .find((v) => v.variantId === variantId);
        const capped = Math.min(quantity, variant?.stock ?? quantity);
        return capped < 1 ? [] : [{ ...line, quantity: capped }];
      }),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setLines((current) => current.filter((l) => l.variantId !== variantId));
  }, []);

  const value = useMemo<CartApi>(() => {
    const resolved = resolve(lines);
    return {
      lines,
      resolved,
      count: resolved.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: resolved.reduce((sum, l) => sum + l.lineTotal, 0),
      drawerOpen,
      setDrawerOpen,
      add,
      setQuantity,
      remove,
    };
  }, [lines, drawerOpen, add, setQuantity, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
