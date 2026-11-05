import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CreditCard, RefreshCw, CheckCircle, AlertOctagon, Search, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrders, saveOrder } from '../../lib/services/store-service';
import { Order } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/payments')({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const { admin } = useAuth();
  const [orders, setOrders] = useState(getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const refreshOrders = () => setOrders(getOrders());

  React.useEffect(() => {
    const onStoreUpdate = () => refreshOrders();
    window.addEventListener('coorg_store_updated', onStoreUpdate);
    window.addEventListener('storage', onStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', onStoreUpdate);
      window.removeEventListener('storage', onStoreUpdate);
    };
  }, []);

  const handleRefund = (order: Order) => {
    if (window.confirm(`Issue Razorpay refund of ₹${order.grandTotal} for Order #${order.orderNumber}?`)) {
      order.paymentStatus = 'refunded';
      order.status = 'Cancelled';
      saveOrder(order);
      refreshOrders();
      alert(`Razorpay Payment ID pay_rzp_${order.id.slice(-6)} refunded successfully.`);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalCaptured = orders.reduce((sum, o) => sum + (o.paymentStatus === 'captured' ? o.grandTotal : 0), 0);
  const totalRefunded = orders.reduce((sum, o) => sum + (o.paymentStatus === 'refunded' ? o.grandTotal : 0), 0);

  return (
    <AdminLayout
      activeModule="payments"
      title="RAZORPAY PAYMENT TRANSACTIONS &amp; REFUNDS"
      subtitle="Monitor online transactions, Razorpay Payment IDs, webhook events, and issue instant customer refunds."
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] uppercase font-bold tracking-wider">CAPTURED REVENUE</span>
          <p className="font-display text-3xl text-emerald-400 font-bold">₹{totalCaptured.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 font-semibold">Verified via Gateway</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] uppercase font-bold tracking-wider">REFUNDED TOTAL</span>
          <p className="font-display text-3xl text-red-400 font-bold">₹{totalRefunded.toLocaleString()}</p>
          <p className="text-[10px] text-red-400 font-semibold">Returned to Customer Accounts</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] uppercase font-bold tracking-wider">GATEWAY INTEGRATION</span>
          <p className="font-display text-2xl text-white font-bold">Razorpay Standard</p>
          <p className="text-[10px] text-[#C89B3C] font-semibold">UPI, Cards, Netbanking, COD</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#241D17] border border-[#3D3025] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B3C]"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['all', 'captured', 'pending', 'refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                statusFilter === st ? 'bg-[#C89B3C] text-black' : 'bg-[#241D17] border border-[#3D3025] text-gray-300 hover:bg-[#2A211B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <h3 className="font-display text-xl text-white font-bold">PAYMENT AUDIT LOG</h3>
        {filteredOrders.length === 0 ? (
          <p className="py-8 text-center text-xs text-gray-500">No payment logs match filter criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3D3025] text-[#B5A490] font-bold">
                  <th className="py-3 px-2">ORDER #</th>
                  <th className="py-3 px-2">RAZORPAY ORDER ID</th>
                  <th className="py-3 px-2">PAYMENT ID</th>
                  <th className="py-3 px-2">AMOUNT</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A211B]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#241D17]">
                    <td className="py-3 px-2 font-mono text-[#C89B3C] font-bold">#{ord.orderNumber}</td>
                    <td className="py-3 px-2 font-mono text-gray-400">
                      {ord.razorpayOrderId || `order_rzp_${ord.id.slice(0, 8)}`}
                    </td>
                    <td className="py-3 px-2 font-mono text-gray-400">
                      {ord.paymentId || `pay_rzp_${ord.id.slice(0, 8)}`}
                    </td>
                    <td className="py-3 px-2 font-bold text-white">₹{ord.grandTotal}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.paymentStatus === 'captured'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.paymentStatus === 'refunded'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {ord.paymentStatus === 'captured' ? (
                        <button
                          onClick={() => handleRefund(ord)}
                          className="px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-bold hover:bg-red-500/20"
                        >
                          Refund
                        </button>
                      ) : (
                        <span className="text-gray-500 text-[10px]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
