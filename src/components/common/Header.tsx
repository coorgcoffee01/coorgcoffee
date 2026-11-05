import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ShoppingBag, Search, User, Sun, Moon, Heart, Phone, MapPin, Truck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { IS_TEST_PRICE_MODE } from '../../lib/data/mock-data';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { itemCount, openCart } = useCart();
  const { isUserLoggedIn, wishlist } = useAuth();
  const location = useLocation();

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full shadow-md transition-colors duration-300">
      {/* Utility Bar */}
      <div className="bg-[#1C1612] text-[#D8C7B2] border-b border-[#322820] text-[11px] py-1.5 px-3 sm:px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-center md:text-left">
            <span className="flex items-center gap-1.5 font-medium tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
              <span>From the Land of Mist &amp; Honey, Coorg</span>
            </span>
            {IS_TEST_PRICE_MODE ? (
              <span className="flex items-center gap-1.5 font-bold tracking-wide text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30 text-[10px]">
                <span>🧪 Test Mode: All Coffees ₹1 • Free Delivery for Payment Testing</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-semibold tracking-wide text-[#C89B3C]">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>Free Shipping on Orders Above 5KG</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-center shrink-0 pt-0.5 md:pt-0">
            <a
              href="tel:9483472070"
              className="flex items-center gap-1.5 font-bold text-[#C89B3C] hover:underline text-[11px]"
            >
              <Phone className="w-3 h-3 text-[#C89B3C] shrink-0" />
              <span>94834 72070 | 90718 70722</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border transition-colors py-2.5 sm:py-3.5 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Emblem */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
            <img
              src="/coorg-logo-circle.png"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/coorg-logo.jpg') target.src = '/coorg-logo.jpg';
              }}
              alt="Authentic Coorg Coffee Logo"
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#C89B3C] shadow-md transition-transform group-hover:scale-105 shrink-0 bg-white p-0.5"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl md:text-3xl tracking-wider text-foreground leading-none">
                COORG COFFEE
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#C89B3C] font-bold mt-0.5 whitespace-nowrap">
                PURE ESTATE HARVEST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold tracking-wider uppercase">
            <Link
              to="/"
              className={`transition-colors hover:text-[#C89B3C] ${
                isCurrentPath('/') ? 'text-[#C89B3C] font-bold border-b-2 border-[#C89B3C] pb-1' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`transition-colors hover:text-[#C89B3C] ${
                isCurrentPath('/shop') ? 'text-[#C89B3C] font-bold border-b-2 border-[#C89B3C] pb-1' : 'text-foreground'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-[#C89B3C] ${
                isCurrentPath('/about') ? 'text-[#C89B3C] font-bold border-b-2 border-[#C89B3C] pb-1' : 'text-foreground'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-[#C89B3C] ${
                isCurrentPath('/contact') ? 'text-[#C89B3C] font-bold border-b-2 border-[#C89B3C] pb-1' : 'text-foreground'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full hover:bg-muted text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Search coffee products"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-muted text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-border"
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#E5C16C]" />
              ) : (
                <Moon className="w-5 h-5 text-[#2D5A27]" />
              )}
            </button>

            {/* User Account */}
            <Link
              to={isUserLoggedIn ? '/account' : '/account'}
              className="p-2.5 rounded-full hover:bg-muted text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Account details"
            >
              <User className="w-5 h-5 text-foreground" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/account"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-muted text-foreground transition-colors relative min-w-[44px] min-h-[44px] items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-foreground" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2D5A27] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-[#C89B3C] text-[#12100E] hover:bg-[#b08732] transition-colors font-bold min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2D5A27] text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[20px] text-center border border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
