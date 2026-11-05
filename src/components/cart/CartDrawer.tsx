import React from 'react';
import { Link } from '@tanstack/react-router';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    isFreeShipping,
    totalWeightKg,
    freeShippingKgRemaining,
  } = useCart();

  if (!isOpen) return null;

  const progressPct = Math.min(100, Math.round((totalWeightKg / 5) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col justify-between transition-colors">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/coorg-logo-circle.png"
                alt="Coorg Coffee"
                className="w-8 h-8 rounded-full border border-[#C89B3C] shadow-sm bg-white p-0.5 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl tracking-wide text-foreground leading-none">YOUR CART</h3>
                  <span className="text-[10px] font-bold bg-[#C89B3C]/20 text-[#C89B3C] px-2 py-0.5 rounded-full border border-[#C89B3C]/30">
                    {items.reduce((sum, i) => sum + i.quantity, 0)} items ({totalWeightKg}kg)
                  </span>
                </div>
                <span className="text-[9px] text-[#C89B3C] font-semibold tracking-wider uppercase">Direct Estate Dispatch</span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-muted text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-card px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
              <span className="flex items-center gap-1.5 text-[#C89B3C]">
                <Truck className="w-4 h-4" />
                {isFreeShipping ? (
                  <span className="text-[#2D5A27] dark:text-[#4ade80] font-bold">
                    You unlocked FREE Pan-India Shipping!
                  </span>
                ) : (
                  <span>Add {freeShippingKgRemaining}kg more for FREE bulk shipping (5kg+)</span>
                )}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C89B3C] transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 text-[#C89B3C]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xl text-foreground">YOUR CART IS EMPTY</h4>
                  <p className="text-xs text-muted-foreground">
                    Discover our freshly roasted Coorg estate coffees &amp; blends.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732] transition-colors"
                >
                  BROWSE COFFEES
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}-${item.roastLevel || ''}`}
                  className="flex space-x-4 pb-6 border-b border-border last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-xl border border-border bg-muted shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-display text-lg text-foreground leading-tight">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-muted-foreground hover:text-red-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#C89B3C] font-semibold mt-0.5">
                        {item.variantLabel} {item.roastLevel ? `• ${item.roastLevel}` : ''} • {item.grindOption || 'Filter Grind'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, -1)}
                          className="px-2.5 py-1 text-foreground hover:bg-muted transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, 1)}
                          className="px-2.5 py-1 text-foreground hover:bg-muted transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-foreground text-sm">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-card space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Shipping ({totalWeightKg}kg)</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#2D5A27] dark:text-[#4ade80] font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center px-4 py-3 rounded-xl border border-border font-bold text-xs uppercase tracking-wider text-foreground hover:bg-muted transition-colors min-h-[48px]"
                >
                  VIEW CART
                </Link>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732] transition-colors shadow-md min-h-[48px]"
                >
                  <span>CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
