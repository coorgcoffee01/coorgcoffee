import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  TrendingUp,
  Package,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  Users,
  DollarSign,
  Tag,
  Activity,
  MessageSquare,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Eye,
  Archive,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  getOrders,
  getProducts,
  getAuditLogs,
  updateOrderStatus,
  getCategories,
  getCustomerQueries,
  updateQueryStatus,
  updateVariantStock,
  toggleVariantStockStatus,
  updateOrderAWB,
} from '../../lib/services/store-service';
import { Order, Product } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { admin } = useAuth();
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [categories] = useState(getCategories());
  const [queries, setQueries] = useState(getCustomerQueries());
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [awbInputs, setAwbInputs] = useState<Record<string, string>>({});
  const [stockSuccessMsg, setStockSuccessMsg] = useState<string | null>(null);

  // Reusable confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    message: string | React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'primary' | 'success';
    icon?: 'alert' | 'trash' | 'archive' | 'package' | 'refresh';
    onConfirm: () => void;
  } | null>(null);

  const refreshData = () => {
    setOrders(getOrders());
    setProducts(getProducts());
  };

  // Real-time synchronization when stock or products change anywhere
  React.useEffect(() => {
    const onStoreUpdate = () => refreshData();
    window.addEventListener('coorg_store_updated', onStoreUpdate);
    window.addEventListener('storage', onStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', onStoreUpdate);
      window.removeEventListener('storage', onStoreUpdate);
    };
  }, []);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === 'captured' ? o.grandTotal : 0),
    0
  );
  const pendingOrders = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Order Placed' || o.status === 'Packed'
  );

  // Count variants with 0 stock (out of stock)
  const outOfStockVariants = products.flatMap((p) =>
    p.variants.filter((v) => v.stock <= 0).map((v) => ({ product: p, variant: v }))
  );

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status, admin?.name);
    refreshData();
  };

  const promptStatusChange = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === newStatus) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Update Order Status?',
      subtitle: `Order #${order.orderNumber}`,
      message: (
        <div className="space-y-2">
          <p>
            Are you sure you want to change status from <strong className="text-amber-400 font-bold">{order.status}</strong> to <strong className="text-white font-bold">{newStatus}</strong>?
          </p>
          {newStatus === 'Cancelled' && (
            <p className="text-[11px] text-red-400 font-bold bg-red-950/40 p-2 rounded-lg border border-red-500/30">
              ⚠️ Warning: Marking as Cancelled will halt fulfillment.
            </p>
          )}
        </div>
      ),
      confirmLabel: `Update to ${newStatus}`,
      variant: newStatus === 'Cancelled' ? 'danger' : 'primary',
      icon: 'package',
      onConfirm: () => {
        handleStatusChange(orderId, newStatus);
        setConfirmDialog(null);
      },
    });
  };

  const handleSaveAWB = (orderId: string) => {
    const awb = awbInputs[orderId];
    if (!awb || !awb.trim()) return;
    updateOrderAWB(orderId, awb.trim(), 'DTDC Express Air', admin?.name);
    refreshData();
    alert(`AWB ${awb} saved for Order!`);
  };

  const handleCopyAddress = (order: Order) => {
    const line1 = order.shippingAddress.line1 || '';
    const line2 = order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : '';
    const addr = `${order.shippingAddress.fullName}\n${line1}${line2}\n${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\nPhone: ${order.shippingAddress.phone}`;
    navigator.clipboard.writeText(addr);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleStock = (productId: string, variantId: string, currentlyOutOfStock: boolean) => {
    // If currently out of stock, mark In Stock (50). If in stock, mark Out of Stock (0).
    const newQty = currentlyOutOfStock ? 50 : 0;
    updateVariantStock(productId, variantId, newQty, admin?.name);
    refreshData();
    const prod = products.find((p) => p.id === productId);
    const v = prod?.variants.find((vr) => vr.variantId === variantId);
    setStockSuccessMsg(
      currentlyOutOfStock
        ? `"${prod?.name} (${v?.label})" is now IN STOCK (50 units).`
        : `"${prod?.name} (${v?.label})" is now marked OUT OF STOCK.`
    );
    setTimeout(() => setStockSuccessMsg(null), 4000);
  };

  const promptToggleStock = (productId: string, variantId: string, currentlyOutOfStock: boolean) => {
    const prod = products.find((p) => p.id === productId);
    const v = prod?.variants.find((vr) => vr.variantId === variantId);
    if (!prod || !v) return;

    if (!currentlyOutOfStock) {
      // Prompting to mark OUT OF STOCK
      setConfirmDialog({
        isOpen: true,
        title: 'Mark Item Out of Stock?',
        subtitle: `${prod.name} • ${v.label}`,
        message: (
          <div className="space-y-2">
            <p>
              Are you sure you want to mark <strong className="text-white">{prod.name} ({v.label})</strong> as <strong className="text-red-400 font-bold">OUT OF STOCK</strong>?
            </p>
            <ul className="text-[11px] text-gray-400 space-y-1 bg-[#1C1612] p-2.5 rounded-lg border border-[#3D3025]">
              <li className="flex items-center gap-1.5 text-red-300">
                <span>• Stock quantity will immediately become 0.</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <span>• Product will display OUT OF STOCK on storefront and shop screen.</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <span>• Customer purchasing for this variant will be disabled.</span>
              </li>
            </ul>
          </div>
        ),
        confirmLabel: 'Yes, Mark Out of Stock',
        variant: 'danger',
        icon: 'alert',
        onConfirm: () => {
          handleToggleStock(productId, variantId, false);
          setConfirmDialog(null);
        },
      });
    } else {
      // Prompting to RESTOCK (50)
      setConfirmDialog({
        isOpen: true,
        title: 'Restock Variant Inventory?',
        subtitle: `${prod.name} • ${v.label}`,
        message: (
          <div className="space-y-2">
            <p>
              Are you sure you want to restock <strong className="text-white">{prod.name} ({v.label})</strong> with <strong className="text-emerald-400 font-bold">50 units</strong>?
            </p>
            <p className="text-[11px] text-gray-400">
              This will immediately re-enable purchasing on the storefront.
            </p>
          </div>
        ),
        confirmLabel: 'Yes, Restock (50 Units)',
        variant: 'success',
        icon: 'refresh',
        onConfirm: () => {
          handleToggleStock(productId, variantId, true);
          setConfirmDialog(null);
        },
      });
    }
  };

  const handleAdjustQty = (productId: string, variantId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    const v = prod?.variants.find((vr) => vr.variantId === variantId);
    if (!v) return;
    const current = v.stock || 0;
    const next = Math.max(0, current + delta);
    updateVariantStock(productId, variantId, next, admin?.name);
    refreshData();
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending') {
      return o.status === 'Confirmed' || o.status === 'Order Placed' || o.status === 'Packed';
    }
    if (orderFilter === 'shipped') {
      return o.status === 'Shipped' || o.status === 'In Transit';
    }
    if (orderFilter === 'delivered') {
      return o.status === 'Delivered';
    }
    return true;
  });

  return (
    <AdminLayout
      activeModule="dashboard"
      title="STORE EXECUTIVE DASHBOARD"
      subtitle="Complete overview of customer orders, revenue collection, fulfillment status, and live stock controls."
    >
      {/* Toast Notification Banner */}
      {stockSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{stockSuccessMsg}</span>
          </div>
          <button
            onClick={() => setStockSuccessMsg(null)}
            className="text-emerald-400 hover:text-white font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* KPI Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2 hover:border-[#C89B3C]/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#B5A490]">
            <span className="font-extrabold tracking-wider uppercase">TOTAL REVENUE</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-3xl sm:text-4xl text-[#C89B3C] font-bold">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Captured via Razorpay Gateway</span>
          </p>
        </div>

        {/* Orders Pending Fulfillment */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2 hover:border-[#C89B3C]/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#B5A490]">
            <span className="font-extrabold tracking-wider uppercase">ACTION NEEDED</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-3xl sm:text-4xl text-white font-bold">
            {pendingOrders.length}
          </p>
          <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Orders Awaiting Pack &amp; Dispatch</span>
          </p>
        </div>

        {/* Out of Stock Alert */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2 hover:border-[#C89B3C]/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#B5A490]">
            <span className="font-extrabold tracking-wider uppercase">STOCK HEALTH</span>
            <div
              className={`p-2 rounded-xl ${
                outOfStockVariants.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-3xl sm:text-4xl text-white font-bold">
            {outOfStockVariants.length > 0 ? (
              <span className="text-red-400">{outOfStockVariants.length} Out</span>
            ) : (
              <span className="text-emerald-400">Healthy</span>
            )}
          </p>
          <p className="text-[11px] text-[#B5A490]">
            {outOfStockVariants.length > 0 ? (
              <span className="text-red-400 font-bold">Items currently Out of Stock</span>
            ) : (
              <span>All 10 estate roasts available in stock</span>
            )}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2 hover:border-[#C89B3C]/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#B5A490]">
            <span className="font-extrabold tracking-wider uppercase">ALL ORDERS</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-3xl sm:text-4xl text-white font-bold">{orders.length}</p>
          <p className="text-[11px] text-purple-300 font-semibold">
            {orders.filter((o) => o.status === 'Delivered').length} Delivered Successfully
          </p>
        </div>
      </div>

      {/* SECTION 1: WHO ORDERED & HOW MUCH (Detailed Customer Orders Feed) */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D3025] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#C89B3C]" />
              <h3 className="font-display text-2xl text-white font-bold tracking-wide">
                CUSTOMER ORDERS: WHO ORDERED &amp; HOW MUCH
              </h3>
            </div>
            <p className="text-xs text-[#B5A490] mt-1">
              Clear breakdown of buyers, items, exact bag sizes, delivery address, and payment amounts.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                orderFilter === 'all'
                  ? 'bg-[#C89B3C] text-black shadow-md'
                  : 'bg-[#241D17] border border-[#3D3025] text-gray-400 hover:text-white'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter('pending')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                orderFilter === 'pending'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-[#241D17] border border-[#3D3025] text-amber-400 hover:bg-[#2A211B]'
              }`}
            >
              Needs Packing ({pendingOrders.length})
            </button>
            <button
              onClick={() => setOrderFilter('shipped')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                orderFilter === 'shipped'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-[#241D17] border border-[#3D3025] text-blue-400 hover:bg-[#2A211B]'
              }`}
            >
              In Transit ({orders.filter((o) => o.status === 'Shipped' || o.status === 'In Transit').length})
            </button>
            <button
              onClick={() => setOrderFilter('delivered')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                orderFilter === 'delivered'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#241D17] border border-[#3D3025] text-emerald-400 hover:bg-[#2A211B]'
              }`}
            >
              Delivered ({orders.filter((o) => o.status === 'Delivered').length})
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 space-y-2">
            <Package className="w-10 h-10 text-gray-600 mx-auto" />
            <p>No customer orders match this filter.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((ord) => {
              const cleanPhone = ord.guestPhone.replace(/[^0-9]/g, '');
              const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
              const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                `Hello ${ord.shippingAddress.fullName}, thank you for ordering from Coorg Coffee! We are preparing your Order #${ord.orderNumber} for dispatch.`
              )}`;

              return (
                <div
                  key={ord.id}
                  className="rounded-2xl bg-[#241D17] border border-[#3D3025] hover:border-[#C89B3C]/50 transition-all overflow-hidden shadow-sm"
                >
                  {/* Card Header Bar */}
                  <div className="p-4 sm:p-5 bg-[#1F1813] border-b border-[#3D3025] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-base sm:text-lg font-bold text-[#C89B3C]">
                        #{ord.orderNumber}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : ord.status === 'Shipped' || ord.status === 'In Transit'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ord.status}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === 'captured'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        Payment: {ord.paymentStatus.toUpperCase()}
                      </span>

                      <span className="text-xs text-[#B5A490] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>
                    </div>

                    {/* Grand Total Amount Badge */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground uppercase font-bold">Grand Total:</span>
                      <span className="font-display text-2xl font-black text-white bg-[#12100E] px-3.5 py-1 rounded-xl border border-[#C89B3C]/40 text-[#C89B3C]">
                        ₹{ord.grandTotal}
                      </span>
                    </div>
                  </div>

                  {/* Card Main Body: Who Ordered (Left) & What / How Much (Right) */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* WHO ORDERED (Customer Info - 5 Columns) */}
                    <div className="lg:col-span-5 space-y-3 border-b lg:border-b-0 lg:border-r border-[#3D3025] pb-4 lg:pb-0 lg:pr-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-[#C89B3C] font-black">
                          WHO ORDERED (CUSTOMER)
                        </span>
                        <button
                          onClick={() => handleCopyAddress(ord)}
                          className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer bg-[#1C1612] px-2 py-0.5 rounded border border-[#3D3025]"
                          title="Copy Full Address for Courier"
                        >
                          {copiedId === ord.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Address</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{ord.shippingAddress.fullName}</span>
                        </h4>

                        {/* Customer Phone & 1-Click WhatsApp */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={`tel:${ord.shippingAddress.phone}`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#1C1612] border border-[#3D3025] text-xs font-mono text-white hover:text-[#C89B3C]"
                          >
                            <Phone className="w-3 h-3 text-[#C89B3C]" />
                            <span>{ord.shippingAddress.phone}</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp Customer</span>
                          </a>
                        </div>

                        {ord.guestEmail && (
                          <p className="text-xs text-gray-400 pt-0.5">{ord.guestEmail}</p>
                        )}
                      </div>

                      {/* Delivery Address */}
                      <div className="p-3 rounded-xl bg-[#1C1612] border border-[#3D3025] space-y-1 text-xs text-gray-300">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 block">
                          Delivery Destination
                        </span>
                        <p className="font-medium text-white">{ord.shippingAddress.line1}</p>
                        {ord.shippingAddress.line2 && (
                          <p className="text-gray-400">{ord.shippingAddress.line2}</p>
                        )}
                        <p className="text-gray-400 font-semibold">
                          {ord.shippingAddress.city}, {ord.shippingAddress.state} -{' '}
                          <strong className="text-white font-mono">{ord.shippingAddress.pincode}</strong>
                        </p>
                      </div>
                    </div>

                    {/* HOW MUCH & ITEMS ORDERED (7 Columns) */}
                    <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-[#C89B3C] font-black">
                            HOW MUCH &amp; ITEMS ORDERED ({ord.items.length} {ord.items.length === 1 ? 'Pack' : 'Packs'})
                          </span>
                          <span className="text-xs text-[#B5A490]">
                            Subtotal: <strong className="text-white">₹{ord.subtotal}</strong>
                          </span>
                        </div>

                        {/* Items Table / List */}
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-[#1C1612] border border-[#3D3025] flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <span className="w-6 h-6 rounded-md bg-[#C89B3C]/10 text-[#C89B3C] font-black text-xs flex items-center justify-center shrink-0 border border-[#C89B3C]/30">
                                  {item.quantity}×
                                </span>
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate">{item.productName}</p>
                                  <p className="text-[11px] text-[#C89B3C] font-semibold">
                                    Size: {item.variantLabel} • SKU: {item.sku}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-bold text-white">₹{item.lineTotal || (item.unitPrice * item.quantity)}</span>
                                <span className="text-[10px] text-gray-500 block">
                                  (₹{item.unitPrice} each)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Cost Breakdown Strip */}
                        <div className="p-2.5 rounded-xl bg-[#17120E] border border-[#3D3025] flex flex-wrap items-center justify-between text-xs text-[#B5A490]">
                          <span>
                            Delivery Fee:{' '}
                            <strong className="text-white">
                              {ord.shippingFee === 0 ? (
                                <span className="text-emerald-400">FREE Delivery</span>
                              ) : (
                                `₹${ord.shippingFee}`
                              )}
                            </strong>
                          </span>

                          <span className="text-sm text-white font-extrabold">
                            Grand Total: <span className="text-[#C89B3C]">₹{ord.grandTotal}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status & DTDC Logistics Update Actions */}
                      <div className="pt-3 border-t border-[#3D3025] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <label className="text-xs font-bold text-[#B5A490]">Update Status:</label>
                          <select
                            value={ord.status}
                            onChange={(e) => promptStatusChange(ord.id, e.target.value as any)}
                            className="px-3 py-1.5 bg-[#1C1612] border border-[#3D3025] text-white rounded-xl text-xs font-bold focus:outline-none focus:border-[#C89B3C]"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped (In Transit)</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* DTDC AWB Tracker */}
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="DTDC AWB Number..."
                              defaultValue={ord.awbNumber || ''}
                              onChange={(e) =>
                                setAwbInputs((prev) => ({ ...prev, [ord.id]: e.target.value }))
                              }
                              className="px-3 py-1.5 bg-[#1C1612] border border-[#3D3025] text-xs font-mono text-white rounded-xl placeholder-gray-500 w-36 focus:outline-none focus:border-[#C89B3C]"
                            />
                          </div>
                          <button
                            onClick={() => handleSaveAWB(ord.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#C89B3C] text-black font-extrabold text-xs hover:bg-[#b08732] cursor-pointer"
                          >
                            Save AWB
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: LIVE INVENTORY & OUT-OF-STOCK MANAGER ("An option to tell out of stock") */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D3025] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Archive className="w-5 h-5 text-[#C89B3C]" />
              <h3 className="font-display text-2xl text-white font-bold tracking-wide">
                INVENTORY &amp; OUT-OF-STOCK QUICK MANAGER
              </h3>
            </div>
            <p className="text-xs text-[#B5A490] mt-1">
              Click "Mark Out of Stock" to immediately disable customer purchasing on any variant or roast.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#B5A490]">
              Showing all <strong className="text-white">{products.length}</strong> Estate Roasts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((prod) => {
            const allVariantsOut = prod.variants.length > 0 && prod.variants.every((v) => v.stock <= 0);
            const outCount = prod.variants.filter((v) => v.stock <= 0).length;

            return (
              <div
                key={prod.id}
                className={`p-5 rounded-2xl border space-y-4 transition-all flex flex-col justify-between relative ${
                  allVariantsOut
                    ? 'bg-[#241714] border-red-500/70 shadow-lg shadow-red-950/30 ring-1 ring-red-500/40'
                    : outCount > 0
                    ? 'bg-[#241D17] border-amber-500/50 hover:border-amber-400'
                    : 'bg-[#241D17] border-[#3D3025] hover:border-[#C89B3C]/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className={`w-14 h-14 object-cover rounded-xl border transition-all ${
                            allVariantsOut
                              ? 'border-red-500/60 grayscale contrast-125'
                              : 'border-[#3D3025]'
                          }`}
                        />
                        {allVariantsOut && (
                          <div className="absolute inset-0 bg-red-950/80 rounded-xl flex items-center justify-center border border-red-500/50">
                            <span className="text-[8px] font-black uppercase tracking-wider text-red-100">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-lg text-white font-bold truncate">{prod.name}</h4>
                        <p className="text-xs text-[#C89B3C] font-semibold">{prod.categoryName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{prod.tagline}</p>
                      </div>
                    </div>

                    {/* Overall Product Stock Badge */}
                    {allVariantsOut ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md flex items-center gap-1 shrink-0 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>OUT OF STOCK</span>
                      </span>
                    ) : outCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                        {outCount} of {prod.variants.length} Out
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        All In Stock
                      </span>
                    )}
                  </div>

                  {/* Variants Stock Stepper and Out-of-Stock Buttons */}
                  <div className="space-y-2.5 pt-4">
                    {prod.variants.map((v) => {
                      const isOutOfStock = v.stock <= 0;

                      return (
                        <div
                          key={v.variantId}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                            isOutOfStock
                              ? 'bg-red-950/40 border-red-500/60 text-red-100 shadow-sm'
                              : 'bg-[#1C1612] border-[#3D3025] text-white'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <strong className="text-sm font-bold text-white">{v.label}</strong>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isOutOfStock
                                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {isOutOfStock ? 'OUT OF STOCK' : `IN STOCK (${v.stock})`}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#C89B3C] font-mono">
                              ₹{v.salePrice || v.price} • SKU: {v.sku}
                            </p>
                          </div>

                          {/* Stock Controls: Stepper & 1-Click Out-of-Stock Toggle */}
                          <div className="flex items-center space-x-2 self-end sm:self-center">
                            {/* Quantity adjustment buttons */}
                            <div className="flex items-center bg-[#2A211B] rounded-lg border border-[#3D3025] overflow-hidden">
                              <button
                                onClick={() => handleAdjustQty(prod.id, v.variantId, -10)}
                                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-[#3D3025] font-bold"
                                title="Decrease 10 pouches"
                              >
                                -10
                              </button>
                              <span className={`px-2 font-mono font-bold text-xs ${isOutOfStock ? 'text-red-400' : 'text-white'}`}>
                                {v.stock}
                              </span>
                              <button
                                onClick={() => handleAdjustQty(prod.id, v.variantId, 10)}
                                className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-[#3D3025] font-bold"
                                title="Add 10 pouches"
                              >
                                +10
                              </button>
                            </div>

                            {/* 1-Click Toggle Button with Confirmation Popup */}
                            <button
                              onClick={() => promptToggleStock(prod.id, v.variantId, isOutOfStock)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                                isOutOfStock
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                              }`}
                            >
                              {isOutOfStock ? 'Restock (50)' : 'Mark Out'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#3D3025] flex items-center justify-between text-xs">
                <Link
                  to="/admin/products"
                  className="text-xs text-[#C89B3C] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Edit Product &amp; Pricing</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/product/$slug"
                  params={{ slug: prod.slug }}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <span>View in Store</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Customer Inquiries & Questions */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#C89B3C]" />
            <h3 className="font-display text-xl text-white font-bold">CUSTOMER INQUIRIES</h3>
          </div>
          <span className="text-xs text-[#B5A490]">
            {queries.filter((q) => q.status === 'new').length} New Unread Messages
          </span>
        </div>

        {queries.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#241D17] border border-[#3D3025] text-center text-xs text-[#B5A490]">
            No customer inquiries right now.
          </div>
        ) : (
          <div className="space-y-3">
            {queries.slice(0, 4).map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <strong className="text-white text-sm">{q.name}</strong>
                    <span className="text-[#C89B3C] font-mono">{q.phone}</span>
                    {q.email && <span className="text-gray-400">({q.email})</span>}
                  </div>
                  <p className="text-[#E8D9C5] italic">"{q.message}"</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=Hello ${encodeURIComponent(
                      q.name
                    )}, this is Coorg Coffee regarding your inquiry.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold"
                  >
                    Reply via WhatsApp
                  </a>
                  {q.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        updateQueryStatus(q.id, 'resolved');
                        setQueries(getCustomerQueries());
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#C89B3C] text-black font-bold"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reusable "Are You Sure?" Confirmation Modal */}
      {confirmDialog && (
        <ConfirmDialog
          {...confirmDialog}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </AdminLayout>
  );
}
