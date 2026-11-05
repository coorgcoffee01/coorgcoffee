import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    isFreeShipping,
    freeShippingKgRemaining,
    totalWeightKg,
    isLoaded,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="eyebrow">ORDER SUMMARY</span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
            YOUR SHOPPING CART
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl space-y-4 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#C89B3C] mx-auto" />
            <h3 className="font-display text-2xl text-foreground">YOUR CART IS EMPTY</h3>
            <p className="text-xs text-muted-foreground">
              Explore our single-origin coffees and signature estate blends.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732] transition-colors"
            >
              EXPLORE COFFEES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Table */}
            <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              {/* Free shipping notice */}
              <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#C89B3C] font-semibold">
                  <Truck className="w-4 h-4" />
                  {isFreeShipping ? (
                    <span className="text-[#2D5A27] dark:text-[#4ade80] font-bold">
                      Congratulations! You unlocked FREE Pan-India shipping ({totalWeightKg}kg).
                    </span>
                  ) : (
                    <span>
                      Total Weight: {totalWeightKg}kg • Add {freeShippingKgRemaining}kg more for FREE bulk shipping (5kg+)
                    </span>
                  )}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}-${item.roastLevel || ''}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-xl border border-border shrink-0 bg-muted"
                      />
                      <div>
                        <h3 className="font-display text-xl text-foreground">{item.productName}</h3>
                        <p className="text-xs text-[#C89B3C] font-semibold">
                          {item.variantLabel} {item.roastLevel ? `• ${item.roastLevel}` : ''} • {item.grindOption}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                      <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, -1)}
                          className="p-2.5 text-foreground hover:bg-muted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-bold text-xs text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, 1)}
                          className="p-2.5 text-foreground hover:bg-muted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-extrabold text-lg text-foreground min-w-[80px] text-right">
                        ₹{item.unitPrice * item.quantity}
                      </span>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-muted-foreground hover:text-red-500 p-2 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Box */}
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-display text-xl text-foreground border-b border-border pb-4">
                CHECKOUT SUMMARY
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-foreground">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#2D5A27] dark:text-[#4ade80] font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>GST Tax</span>
                  <span>Included</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <span className="font-bold text-foreground">Grand Total</span>
                  <span className="text-2xl font-extrabold text-[#C89B3C]">
                    ₹{subtotal + shippingFee}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 rounded-xl bg-[#C89B3C] text-black font-extrabold text-sm uppercase tracking-widest hover:bg-[#b08732] transition-all shadow-lg flex items-center justify-center min-h-[52px]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-2">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>100% Encrypted Razorpay Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
