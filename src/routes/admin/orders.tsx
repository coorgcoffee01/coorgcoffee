import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ShoppingBag,
  RefreshCw,
  Search,
  Eye,
  X,
  Check,
  Truck,
  CreditCard,
  Phone,
  MessageCircle,
  Copy,
  Clock,
  ExternalLink,
  Package,
  Coffee,
  MapPin,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrders, updateOrderStatus, saveOrder, updateOrderAWB } from '../../lib/services/store-service';
import { Order } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog, ConfirmDialogProps } from '../../components/admin/ConfirmDialog';

export const Route = createFileRoute('/admin/orders')({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { admin } = useAuth();
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [awbInputs, setAwbInputs] = useState<Record<string, string>>({});

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRefundModal, setShowRefundModal] = useState<Order | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps | null>(null);

  const refreshOrders = () => setOrders(getOrders());

  // Real-time synchronization
  React.useEffect(() => {
    const onStoreUpdate = () => refreshOrders();
    window.addEventListener('coorg_store_updated', onStoreUpdate);
    window.addEventListener('storage', onStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', onStoreUpdate);
      window.removeEventListener('storage', onStoreUpdate);
    };
  }, []);

  const handleStatusUpdate = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status, admin?.name);
    refreshOrders();
  };

  const promptStatusChange = (orderId: string, status: Order['status']) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === status) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Update Order Status?',
      subtitle: `Order #${order.orderNumber}`,
      message: (
        <div className="space-y-2">
          <p>
            Are you sure you want to change status from <strong className="text-amber-400 font-bold">{order.status}</strong> to <strong className="text-white font-bold">{status}</strong>?
          </p>
          {status === 'Cancelled' && (
            <p className="text-[11px] text-red-400 font-bold bg-red-950/40 p-2 rounded-lg border border-red-500/30">
              ⚠️ Warning: Marking as Cancelled will halt order fulfillment.
            </p>
          )}
        </div>
      ),
      confirmLabel: `Update to ${status}`,
      variant: status === 'Cancelled' ? 'danger' : 'primary',
      icon: 'package',
      onConfirm: () => {
        handleStatusUpdate(orderId, status);
        setConfirmDialog(null);
      },
    });
  };

  const handleSaveAWB = (orderId: string) => {
    const awb = awbInputs[orderId];
    if (!awb || !awb.trim()) return;
    updateOrderAWB(orderId, awb.trim(), 'DTDC Express Air', admin?.name);
    refreshOrders();
    alert(`DTDC AWB ${awb} saved for Order!`);
  };

  const handleCopyAddress = (order: Order) => {
    const line1 = order.shippingAddress.line1 || '';
    const line2 = order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : '';
    const addr = `${order.shippingAddress.fullName}\n${line1}${line2}\n${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\nPhone: ${order.shippingAddress.phone}`;
    navigator.clipboard.writeText(addr);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExecuteRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRefundModal) return;

    showRefundModal.paymentStatus = 'refunded';
    showRefundModal.status = 'Cancelled';
    saveOrder(showRefundModal);

    setShowRefundModal(null);
    refreshOrders();
    alert(`Razorpay refund of ₹${showRefundModal.grandTotal} processed for Order #${showRefundModal.orderNumber}`);
  };

  const filtered = orders.filter((ord) => {
    const matchesStatus =
      filterStatus === 'all' || ord.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesQuery =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.guestPhone.includes(searchQuery) ||
      ord.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesQuery;
  });

  const totalCollected = orders
    .filter((o) => o.paymentStatus === 'captured')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <AdminLayout
      activeModule="orders"
      title="ORDER MANAGEMENT &amp; DISPATCH"
      subtitle="Complete visibility on who ordered, item quantities, delivery addresses, and payment totals."
    >
      {/* Top Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1C1612] border border-[#3D3025] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#B5A490] uppercase tracking-wider block">
              Total Order Revenue
            </span>
            <span className="font-display text-2xl font-black text-[#C89B3C]">
              ₹{totalCollected.toLocaleString('en-IN')}
            </span>
          </div>
          <CreditCard className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#1C1612] border border-[#3D3025] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#B5A490] uppercase tracking-wider block">
              Pending Packing / Dispatch
            </span>
            <span className="font-display text-2xl font-black text-amber-400">
              {orders.filter((o) => o.status === 'Confirmed' || o.status === 'Packed').length} Orders
            </span>
          </div>
          <Package className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 rounded-xl bg-[#1C1612] border border-[#3D3025] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#B5A490] uppercase tracking-wider block">
              Shipped / In Transit
            </span>
            <span className="font-display text-2xl font-black text-blue-400">
              {orders.filter((o) => o.status === 'Shipped' || o.status === 'In Transit').length} Orders
            </span>
          </div>
          <Truck className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Top Filter & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Phone, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#241D17] border border-[#3D3025] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B3C]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#C89B3C] text-black shadow-md shadow-[#C89B3C]/20 font-black'
                  : 'bg-[#241D17] border border-[#3D3025] text-gray-300 hover:bg-[#2A211B]'
              }`}
            >
              {st} ({orders.filter((o) => st === 'all' || o.status.toLowerCase() === st.toLowerCase()).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
            No orders match the current search filter.
          </div>
        ) : (
          filtered.map((ord) => {
            const cleanPhone = ord.guestPhone.replace(/[^0-9]/g, '');
            const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
            const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
              `Hello ${ord.shippingAddress.fullName}, thank you for ordering from Coorg Coffee! We are processing your Order #${ord.orderNumber}.`
            )}`;

            return (
              <div
                key={ord.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 hover:border-[#C89B3C]/50 transition-all shadow-sm"
              >
                {/* Order Top Bar: Number, Status, Payment, Grand Total */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D3025] pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-lg font-bold text-[#C89B3C]">
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
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      PAYMENT: {ord.paymentStatus.toUpperCase()}
                    </span>

                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>
                        {new Date(ord.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-gray-400 font-bold block">Total Amount:</span>
                      <span className="text-xl sm:text-2xl font-black text-white text-[#C89B3C]">
                        ₹{ord.grandTotal}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white hover:bg-[#2E251E] font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C89B3C]" />
                      <span>Full Details</span>
                    </button>

                    {ord.paymentStatus !== 'refunded' ? (
                      <button
                        onClick={() => setShowRefundModal(ord)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-bold hover:bg-red-500/20 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Issue Refund</span>
                      </button>
                    ) : (
                      <span className="text-xs text-red-400 font-bold">REFUNDED</span>
                    )}
                  </div>
                </div>

                {/* 2-Column Split: WHO ORDERED (Left) vs HOW MUCH & ITEMS (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs pt-1">
                  {/* WHO ORDERED (Customer Information & Actions) */}
                  <div className="lg:col-span-5 space-y-3 border-b lg:border-b-0 lg:border-r border-[#3D3025] pb-4 lg:pb-0 lg:pr-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B3C]">
                        WHO ORDERED
                      </span>
                      <button
                        onClick={() => handleCopyAddress(ord)}
                        className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer bg-[#241D17] px-2 py-0.5 rounded border border-[#3D3025]"
                        title="Copy Address for Shipping Label"
                      >
                        {copiedId === ord.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Address Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{ord.shippingAddress.fullName}</h4>

                      {/* Phone & WhatsApp */}
                      <div className="flex flex-wrap items-center gap-2 pt-1.5">
                        <a
                          href={`tel:${ord.shippingAddress.phone}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#241D17] border border-[#3D3025] text-xs font-mono text-white hover:text-[#C89B3C]"
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
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {ord.guestEmail && (
                        <p className="text-xs text-gray-400 pt-1">{ord.guestEmail}</p>
                      )}
                    </div>

                    {/* Shipping Address Box */}
                    <div className="p-3 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-0.5 text-xs text-gray-300">
                      <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">
                        Delivery Destination
                      </span>
                      <p className="text-white font-medium">{ord.shippingAddress.line1}</p>
                      {ord.shippingAddress.line2 && (
                        <p className="text-gray-400">{ord.shippingAddress.line2}</p>
                      )}
                      <p className="text-gray-400 font-semibold">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state} -{' '}
                        <strong className="text-white font-mono">{ord.shippingAddress.pincode}</strong>
                      </p>
                    </div>
                  </div>

                  {/* HOW MUCH & ITEMS ORDERED */}
                  <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B3C]">
                          HOW MUCH &amp; ITEMS ORDERED ({ord.items.length} {ord.items.length === 1 ? 'Pack' : 'Packs'})
                        </span>
                        <span className="text-xs text-[#B5A490]">
                          Subtotal: <strong className="text-white">₹{ord.subtotal}</strong>
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {ord.items.map((item, idx) => {
                          const grindPreference =
                            item.grindOption ||
                            (item.productName.toLowerCase().includes('bean')
                              ? 'Whole Beans'
                              : 'South Indian Filter Grind');

                          return (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-1.5 text-xs"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center space-x-3 min-w-0">
                                  <span className="w-6 h-6 rounded-md bg-[#C89B3C]/10 text-[#C89B3C] font-black text-xs flex items-center justify-center shrink-0 border border-[#C89B3C]/30">
                                    {item.quantity}×
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-bold text-white text-sm">{item.productName}</p>
                                    <p className="text-[11px] text-gray-400">
                                      Size: <strong className="text-amber-200">{item.variantLabel}</strong>
                                      {item.weightGrams ? ` (${item.weightGrams >= 1000 ? `${item.weightGrams / 1000}kg` : `${item.weightGrams}g`})` : ''} • SKU: <span className="font-mono text-gray-300">{item.sku}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-bold text-white font-mono">
                                    ₹{item.lineTotal || item.unitPrice * item.quantity}
                                  </span>
                                  <span className="text-[10px] text-gray-500 block">
                                    (₹{item.unitPrice} each)
                                  </span>
                                </div>
                              </div>

                              {/* Prominent Grind Preference Pill */}
                              <div className="flex flex-wrap items-center gap-1.5 pl-9">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#C89B3C]/20 border border-[#C89B3C]/50 text-[#C89B3C] font-extrabold text-[11px] uppercase tracking-wide">
                                  <Coffee className="w-3 h-3 text-[#C89B3C]" />
                                  <span>GRIND: {grindPreference}</span>
                                </span>
                                {item.roastLevel && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-semibold">
                                    <span>ROAST: {item.roastLevel}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Financial Breakdown Strip */}
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

                    {/* Quick Status and DTDC AWB Update */}
                    <div className="pt-3 border-t border-[#3D3025] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs font-bold text-gray-400">Update Status:</label>
                        <select
                          value={ord.status}
                          onChange={(e) => promptStatusChange(ord.id, e.target.value as any)}
                          className="bg-[#241D17] border border-[#3D3025] text-white rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C89B3C]"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* DTDC Tracking Input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="DTDC AWB Number..."
                          defaultValue={ord.awbNumber || ''}
                          onChange={(e) =>
                            setAwbInputs((prev) => ({ ...prev, [ord.id]: e.target.value }))
                          }
                          className="px-3 py-1.5 bg-[#241D17] border border-[#3D3025] text-xs font-mono text-white rounded-xl placeholder-gray-500 w-36 focus:outline-none focus:border-[#C89B3C]"
                        />
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
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#3D3025] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display text-xl text-white font-bold tracking-tight">
                    ORDER #{selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedOrder.status === 'Confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : selectedOrder.status === 'Shipped' || selectedOrder.status === 'In Transit'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : selectedOrder.status === 'Delivered'
                        ? 'bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-mono">
                    ✓ PAID (Razorpay)
                  </span>
                </div>
                <p className="text-xs text-[#B5A490] mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Order Items & Grind Preferences */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#C89B3C] uppercase tracking-wider flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-[#C89B3C]" />
                    <span>ORDERED ITEMS &amp; GRIND PREFERENCES ({selectedOrder.items?.length || 0})</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Items: <strong className="text-white">{selectedOrder.items?.reduce((acc, i) => acc + i.quantity, 0)} Units</strong>
                  </span>
                </div>

                <div className="divide-y divide-[#2A211B] border border-[#3D3025] rounded-xl overflow-hidden bg-[#241D17]">
                  {selectedOrder.items?.map((item, idx) => {
                    const grindLabel =
                      item.grindOption ||
                      (item.productName.toLowerCase().includes('bean')
                        ? 'Whole Beans'
                        : 'South Indian Filter Grind');
                    const roastLabel = item.roastLevel || 'Medium-Dark Roast';

                    return (
                      <div key={idx} className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-xl border border-[#3D3025] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm">{item.productName}</p>
                              <p className="text-gray-400 text-xs mt-0.5">
                                Pack Size: <strong className="text-amber-200">{item.variantLabel}</strong>
                                {item.weightGrams ? ` (${item.weightGrams >= 1000 ? `${item.weightGrams / 1000}kg` : `${item.weightGrams}g`})` : ''} • SKU: <span className="font-mono text-gray-300">{item.sku}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-extrabold text-white text-sm font-mono block">
                              ₹{item.lineTotal || item.unitPrice * item.quantity}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              {item.quantity} × ₹{item.unitPrice}
                            </span>
                          </div>
                        </div>

                        {/* EXPLICIT GRIND & ROAST BADGES */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 pl-15">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C89B3C]/20 border border-[#C89B3C]/60 text-[#C89B3C] font-black text-xs uppercase tracking-wide shadow-sm">
                            <Coffee className="w-3.5 h-3.5 text-[#C89B3C]" />
                            <span>GRIND PREFERENCE: {grindLabel}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-bold text-xs uppercase">
                            <span>ROAST: {roastLabel}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#18130F] border border-[#3D3025] text-emerald-400 text-[11px] font-bold">
                            <span>Qty: {item.quantity} Pouch{item.quantity > 1 ? 'es' : ''}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-mono">₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery / Shipping Fee:</span>
                  <span className="text-white font-mono">
                    {selectedOrder.shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE Delivery</span>
                    ) : (
                      `₹${selectedOrder.shippingFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#3D3025] flex justify-between font-bold text-sm text-white">
                  <span>Grand Total Paid:</span>
                  <span className="text-[#C89B3C] text-base font-extrabold font-mono">
                    ₹{selectedOrder.grandTotal}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#C89B3C] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C89B3C]" />
                    <span>CUSTOMER &amp; DELIVERY DESTINATION</span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${selectedOrder.guestPhone || selectedOrder.shippingAddress.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 text-[11px] font-bold hover:bg-emerald-600/30 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?phone=91${(selectedOrder.guestPhone || selectedOrder.shippingAddress.phone).replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(`Hello ${selectedOrder.shippingAddress.fullName}, regarding your Coorg Coffee order #${selectedOrder.orderNumber}: `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 flex items-center gap-1 shadow-sm"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Recipient Name</span>
                    <p className="text-white font-bold text-sm">{selectedOrder.shippingAddress.fullName}</p>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mt-2">Contact Details</span>
                    <p className="text-white font-mono text-xs">
                      Phone: <strong className="text-[#C89B3C]">{selectedOrder.guestPhone || selectedOrder.shippingAddress.phone}</strong>
                    </p>
                    {selectedOrder.guestEmail && (
                      <p className="text-gray-300 text-xs mt-0.5">Email: {selectedOrder.guestEmail}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Delivery Address</span>
                    <p className="text-gray-200 font-medium">
                      {selectedOrder.shippingAddress.line1}
                      {selectedOrder.shippingAddress.line2 ? `, ${selectedOrder.shippingAddress.line2}` : ''}
                    </p>
                    <p className="text-white font-bold mt-1">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                      <span className="font-mono text-[#C89B3C] font-black">{selectedOrder.shippingAddress.pincode}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Logistics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C89B3C] block">
                    💳 PAYMENT TRANSACTION
                  </span>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Status:</span>
                    <span className="text-emerald-400 font-bold uppercase">{selectedOrder.paymentStatus || 'captured'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-white font-mono text-[11px] truncate max-w-[160px]">
                      {selectedOrder.paymentId || 'rzp_live_captured'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Courier Partner:</span>
                    <span className="text-white font-semibold">{selectedOrder.courier || 'DTDC Express Air'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C89B3C] block">
                    🚚 COURIER AWB ASSIGNMENT
                  </span>
                  <div className="flex items-center space-x-2 pt-0.5">
                    <input
                      type="text"
                      placeholder="Enter DTDC AWB #"
                      value={awbInputs[selectedOrder.id] !== undefined ? awbInputs[selectedOrder.id] : (selectedOrder.awbNumber || '')}
                      onChange={(e) => setAwbInputs((prev) => ({ ...prev, [selectedOrder.id]: e.target.value }))}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#18130F] border border-[#3D3025] text-white text-xs font-mono focus:outline-none focus:border-[#C89B3C]"
                    />
                    <button
                      onClick={() => {
                        const awbVal = awbInputs[selectedOrder.id] || selectedOrder.awbNumber || '';
                        if (awbVal.trim()) {
                          updateOrderAWB(selectedOrder.id, awbVal.trim(), selectedOrder.courier || 'DTDC', admin?.name);
                          refreshOrders();
                          setSelectedOrder((prev) => prev ? { ...prev, awbNumber: awbVal.trim() } : null);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] cursor-pointer"
                    >
                      Save AWB
                    </button>
                  </div>
                  {selectedOrder.awbNumber && (
                    <a
                      href={`https://www.dtdc.in/tracking/shipment-tracking.asp?strAWB=${selectedOrder.awbNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#C89B3C] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Track #{selectedOrder.awbNumber} on DTDC.in</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-[#3D3025] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <label className="font-bold text-gray-400">Change Status:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const nextSt = e.target.value as any;
                    updateOrderStatus(selectedOrder.id, nextSt, admin?.name);
                    refreshOrders();
                    setSelectedOrder((prev) => prev ? { ...prev, status: nextSt } : null);
                  }}
                  className="bg-[#241D17] border border-[#3D3025] text-white rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C89B3C]"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const itemsText = selectedOrder.items
                      .map((i) => {
                        const grind = i.grindOption || (i.productName.toLowerCase().includes('bean') ? 'Whole Beans' : 'South Indian Filter Grind');
                        return `${i.quantity}x ${i.productName} (${i.variantLabel}, Grind: ${grind})`;
                      })
                      .join(', ');
                    const text = `COORG COFFEE ORDER #${selectedOrder.orderNumber}\nRecipient: ${selectedOrder.shippingAddress.fullName}\nPhone: ${selectedOrder.guestPhone || selectedOrder.shippingAddress.phone}\nAddress: ${selectedOrder.shippingAddress.line1}${selectedOrder.shippingAddress.line2 ? ', ' + selectedOrder.shippingAddress.line2 : ''}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.pincode}\nItems: ${itemsText}\nTotal: ₹${selectedOrder.grandTotal}`;
                    navigator.clipboard.writeText(text);
                    setCopiedId(selectedOrder.id);
                    setTimeout(() => setCopiedId(null), 2500);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-white hover:bg-[#2A211B] text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  title="Copy formatted shipping text for DTDC label"
                >
                  {copiedId === selectedOrder.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C89B3C]" />
                      <span>Copy Courier Slip Data</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-[#C89B3C] text-black hover:bg-[#D4A748] text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-red-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-lg text-white font-bold">
              ISSUE RAZORPAY REFUND: ORDER #{showRefundModal.orderNumber}
            </h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to process a refund of{' '}
              <strong className="text-white">₹{showRefundModal.grandTotal}</strong> to{' '}
              <strong className="text-white">{showRefundModal.shippingAddress.fullName}</strong>?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRefundModal(null)}
                className="px-4 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-xs text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRefund}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog {...confirmDialog} onCancel={() => setConfirmDialog(null)} />
      )}
    </AdminLayout>
  );
}
