import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, Heart, LogOut, User, MapPin, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrders, getProducts } from '../lib/services/store-service';

export const Route = createFileRoute('/account')({
  component: AccountPage,
});

function AccountPage() {
  const { user, isUserLoggedIn, loginUser, logoutUser, wishlist } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const orders = getOrders();
  const wishlistProducts = getProducts().filter((p) => wishlist.includes(p.id));

  if (!isUserLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-6 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <img
              src="/coorg-logo-circle.png"
              alt="Coorg Coffee"
              className="w-16 h-16 rounded-full border-2 border-[#C89B3C] shadow-lg shadow-[#C89B3C]/20 bg-white p-0.5 mx-auto"
            />
            <h1 className="font-display text-3xl text-foreground">CUSTOMER LOGIN</h1>
            <p className="text-xs text-muted-foreground">
              Sign in to view past orders, saved shipping addresses, and wishlist.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (emailInput.trim()) loginUser(emailInput, nameInput || 'Coffee Lover');
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="font-bold block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#C89B3C] text-black font-extrabold uppercase tracking-widest hover:bg-[#b08732] transition-colors shadow-md"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Account Banner */}
        <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#C89B3C] text-black flex items-center justify-center font-bold text-xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl text-foreground">{user?.name}</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Saved Wishlist */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-foreground flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <span>SAVED WISHLIST ({wishlistProducts.length})</span>
          </h2>

          {wishlistProducts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
              Your wishlist is currently empty. Tap the heart icon on any coffee page to save favorites.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-card border border-border flex items-center space-x-4">
                  <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded-lg border border-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate">{p.name}</h4>
                    <p className="text-xs text-[#C89B3C] font-semibold">From ₹{p.variants[0]?.price}</p>
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="text-[11px] font-extrabold uppercase text-foreground hover:text-[#C89B3C] pt-1 block">
                      View Coffee &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="font-display text-2xl text-foreground flex items-center space-x-2">
            <Package className="w-5 h-5 text-[#C89B3C]" />
            <span>MY ORDERS ({orders.length})</span>
          </h2>

          {orders.length === 0 ? (
            <div className="p-6 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
              You haven't placed any orders yet. Explore our shop to enjoy authentic Coorg coffee.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-6 rounded-2xl bg-card border border-border space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs">
                    <div>
                      <span className="font-bold text-[#C89B3C]">ORDER #{ord.orderNumber}</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-foreground">₹{ord.grandTotal}</span>
                      <Link
                        to="/track/$orderNumber"
                        params={{ orderNumber: ord.orderNumber }}
                        className="px-3 py-1 rounded-full bg-[#C89B3C] text-black font-bold text-[10px] uppercase tracking-wider"
                      >
                        Track Shipment
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {ord.items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-muted-foreground">
                        <span>{item.productName} ({item.variantLabel}) x {item.quantity}</span>
                        <span className="font-bold text-foreground">₹{item.lineTotal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
