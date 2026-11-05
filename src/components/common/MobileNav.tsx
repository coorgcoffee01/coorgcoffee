import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, ShoppingBag, Search, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileNavProps {
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSearch }) => {
  const { itemCount, openCart } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/90 border-t border-[#C89B3C]/30 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] pb-safe transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto py-1 px-3">
        <Link
          to="/"
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[10px] font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 ${
            isActive('/') ? 'text-[#C89B3C]' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className={`w-5 h-5 mb-1 transition-transform ${isActive('/') ? 'scale-110 text-[#C89B3C]' : ''}`} />
          <span>Home</span>
          {isActive('/') && <span className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full absolute bottom-0.5 shadow-[0_0_8px_#C89B3C]" />}
        </Link>

        <Link
          to="/shop"
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[10px] font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 ${
            isActive('/shop') ? 'text-[#C89B3C]' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 mb-1 transition-transform ${isActive('/shop') ? 'scale-110 text-[#C89B3C]' : ''}`} />
          <span>Shop</span>
          {isActive('/shop') && <span className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full absolute bottom-0.5 shadow-[0_0_8px_#C89B3C]" />}
        </Link>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground hover:text-[#C89B3C] transition-all duration-200 active:scale-95"
        >
          <Search className="w-5 h-5 mb-1" />
          <span>Search</span>
        </button>

        <button
          onClick={openCart}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground hover:text-[#C89B3C] transition-all duration-200 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C89B3C] text-black text-[10px] font-black px-1.5 py-0.2 rounded-full border border-black shadow-sm">
                {itemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <Link
          to="/account"
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[50px] py-1 text-[10px] font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 ${
            isActive('/account') ? 'text-[#C89B3C]' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className={`w-5 h-5 mb-1 transition-transform ${isActive('/account') ? 'scale-110 text-[#C89B3C]' : ''}`} />
          <span>Account</span>
          {isActive('/account') && <span className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full absolute bottom-0.5 shadow-[0_0_8px_#C89B3C]" />}
        </Link>
      </div>
    </div>
  );
};
