import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Truck,
  CreditCard,
  Users,
  TrendingUp,
  Ticket,
  Star,
  Image as ImageIcon,
  Bell,
  UserCheck,
  Settings,
  FileSpreadsheet,
  ShieldCheck,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hasLiveFirebaseConfig } from '../../lib/firebase/config';
import { SHIPPING_MODE } from '../../lib/services/shipping';
import {
  getSystemNotifications,
  markNotificationRead,
  clearAllNotifications,
} from '../../lib/services/store-service';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeModule?: string;
  title?: string;
  subtitle?: string;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { id: 'products', label: 'Products', path: '/admin/products', icon: Package },
  { id: 'categories', label: 'Categories', path: '/admin/categories', icon: Tags },
  { id: 'orders', label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { id: 'shipping', label: 'Shipping', path: '/admin/shipping', icon: Truck },
  { id: 'payments', label: 'Payments', path: '/admin/payments', icon: CreditCard },
  { id: 'customers', label: 'Customers', path: '/admin/customers', icon: Users },
  { id: 'subscribers', label: 'Subscribers & Email', path: '/admin/subscribers', icon: Mail },
  { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
  { id: 'coupons', label: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { id: 'reviews', label: 'Reviews', path: '/admin/reviews', icon: Star },
  { id: 'banners', label: 'Banners', path: '/admin/banners', icon: ImageIcon },
  { id: 'notifications', label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { id: 'admin-users', label: 'Admin Users', path: '/admin/admin-users', icon: UserCheck },
  { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
  { id: 'reports', label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
  { id: 'security', label: 'Security Logs', path: '/admin/security', icon: ShieldCheck },
];

function isStorefrontDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host === 'coorgcoffees.in' || host === 'www.coorgcoffees.in';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeModule,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, isAdminLoggedIn, logoutAdmin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(getSystemNotifications());

  // Never allow admin console to render on public storefront domain
  if (isStorefrontDomain()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#12100E] px-4 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-7xl font-display font-bold text-[#C89B3C]">404</h1>
          <h2 className="text-xl font-semibold text-white">Page not found</h2>
          <p className="text-sm text-[#8E7E6E]">
            The requested page does not exist or has been removed.
          </p>
          <div>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#C89B3C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#b08732]"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }


  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setNotifications(getSystemNotifications());
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#E8D9C5] font-sans flex flex-col">
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1C1612]/95 backdrop-blur-md border-b border-[#3D3025] px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Console Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/coorg-logo-circle.png"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/coorg-logo.jpg') target.src = '/coorg-logo.jpg';
              }}
              alt="Authentic Coorg Coffee Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C89B3C] shadow-lg shadow-[#C89B3C]/20 bg-white p-0.5"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display text-lg tracking-wide text-white font-bold">
                  COORG ESTATE CONSOLE
                </h1>
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/40">
                  V2.5 LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#B5A490]">
                Manager: <strong className="text-white">{admin?.name || 'Administrator'}</strong> ({admin?.role || 'Super Admin'})
              </p>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center space-x-3">
            {/* Database Sync Mode Badge */}
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                hasLiveFirebaseConfig
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
              title={hasLiveFirebaseConfig ? 'Connected to Firebase Firestore' : 'Running with Local Storage fallback sync'}
            >
              <span className={`w-2 h-2 rounded-full ${hasLiveFirebaseConfig ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{hasLiveFirebaseConfig ? 'FIREBASE LIVE' : 'SANDBOX MODE'}</span>
            </span>

            {/* Courier Mode Badge */}
            <span className="hidden sm:flex text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>{SHIPPING_MODE === 'mock' ? 'DTDC SANDBOX' : 'DTDC LIVE API'}</span>
            </span>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-white hover:bg-[#2A211B] transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4 text-[#C89B3C]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#1C1612] border border-[#3D3025] shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-[#3D3025] pb-2">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-[#C89B3C]" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                        System Notifications
                      </h4>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-[10px] text-gray-400 hover:text-red-400"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1 text-xs">
                    {notifications.length === 0 ? (
                      <p className="text-center text-gray-500 py-6 text-xs">No active alerts.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkRead(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-[#241D17]/50 border-[#3D3025] opacity-60'
                              : 'bg-[#241D17] border-[#C89B3C]/40 text-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-bold">{n.title}</span>
                            <span className="text-[9px] text-gray-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#B5A490] mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logoutAdmin();
                navigate({ to: '/admin/login' });
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Module Navigation Tabs */}
      <nav className="bg-[#18130F] border-b border-[#3D3025] px-4 md:px-8 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.id !== 'dashboard' && location.pathname.startsWith(item.path)) ||
              activeModule === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C89B3C] text-black shadow-md shadow-[#C89B3C]/20'
                    : 'bg-[#241D17] text-[#B5A490] border border-[#3D3025] hover:bg-[#2E251E] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Page Title Header (If provided) */}
      {(title || subtitle) && (
        <div className="bg-[#16120E] border-b border-[#2D231A] px-4 md:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-1">
            {title && <h2 className="font-display text-2xl md:text-3xl text-white tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs md:text-sm text-[#B5A490]">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl w-full mx-auto space-y-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#18130F] border-t border-[#3D3025] py-4 text-center text-xs text-[#B5A490]">
        <p>Coorg Coffee Crafted E-Commerce Admin Console &copy; 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};
