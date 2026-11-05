import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Users, Search, ShoppingBag, Eye, X, Phone, Mail, MapPin } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrders } from '../../lib/services/store-service';
import { Order } from '../../lib/types';

export const Route = createFileRoute('/admin/customers')({
  component: AdminCustomersPage,
});

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: string;
  orders: Order[];
}

function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  React.useEffect(() => {
    const onStoreUpdate = () => setOrders(getOrders());
    window.addEventListener('coorg_store_updated', onStoreUpdate);
    window.addEventListener('storage', onStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', onStoreUpdate);
      window.removeEventListener('storage', onStoreUpdate);
    };
  }, []);

  // Aggregate customer records from order database
  const customerMap = new Map<string, CustomerSummary>();

  orders.forEach((ord) => {
    const key = ord.guestEmail ? ord.guestEmail.toLowerCase() : ord.shippingAddress.phone || ord.id;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: `cust-${customerMap.size + 1}`,
        name: ord.shippingAddress.fullName || 'Guest Coffee Lover',
        email: ord.guestEmail || 'N/A',
        phone: ord.guestPhone || ord.shippingAddress.phone || 'N/A',
        address: ord.shippingAddress.line1,
        city: ord.shippingAddress.city,
        state: ord.shippingAddress.state,
        pincode: ord.shippingAddress.pincode,
        orderCount: 1,
        totalSpend: ord.grandTotal,
        lastOrderDate: ord.createdAt,
        orders: [ord],
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.orderCount += 1;
      existing.totalSpend += ord.grandTotal;
      existing.orders.push(ord);
      if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.createdAt;
      }
    }
  });

  const customersList = Array.from(customerMap.values()).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <AdminLayout
      activeModule="customers"
      title="CUSTOMER DIRECTORY &amp; SPEND INSIGHTS"
      subtitle="View customer order history, total lifetime spend, contact details, and shipping address book."
    >
      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025] flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#241D17] border border-[#3D3025] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B3C]"
          />
        </div>
        <span className="text-xs text-[#B5A490] font-bold">
          Total Customers: <strong className="text-white">{customersList.length}</strong>
        </span>
      </div>

      {/* Customer Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customersList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-500">No customers found.</div>
        ) : (
          customersList.map((cust) => (
            <div
              key={cust.id}
              className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 flex flex-col justify-between hover:border-[#C89B3C]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/40 flex items-center justify-center font-bold text-sm">
                    {cust.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-white font-bold">{cust.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">{cust.city}, {cust.state}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-300 pt-2 border-t border-[#2D231A]">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#C89B3C]" />
                    <span>{cust.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2D231A] flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">LIFETIME SPEND</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{cust.totalSpend}</span>
                </div>

                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="px-3 py-1.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white hover:bg-[#2E251E] font-bold text-xs flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>{cust.orderCount} Orders</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer History Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <div>
                <h3 className="font-display text-xl text-white font-bold">{selectedCustomer.name}</h3>
                <p className="text-xs text-[#B5A490]">Customer Profile &amp; Order History</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-2">
                <h4 className="font-bold text-[#C89B3C] uppercase tracking-wider">DEFAULT SHIPPING ADDRESS</h4>
                <p className="text-white font-bold">{selectedCustomer.name}</p>
                <p className="text-gray-400">{selectedCustomer.address}</p>
                <p className="text-gray-400">
                  {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#C89B3C] uppercase tracking-wider">PAST ORDERS</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-[#241D17] border border-[#3D3025] flex justify-between items-center"
                    >
                      <div>
                        <strong className="text-white block">#{ord.orderNumber}</strong>
                        <span className="text-gray-400 text-[10px]">
                          {new Date(ord.createdAt).toLocaleDateString()} • {ord.status}
                        </span>
                      </div>
                      <span className="font-bold text-[#C89B3C]">₹{ord.grandTotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#3D3025]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
