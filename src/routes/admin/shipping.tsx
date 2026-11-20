import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Truck, Package, MapPin, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrders, saveOrder } from '../../lib/services/store-service';
import { Order } from '../../lib/types';
import { generateAWB, SHIPPING_MODE } from '../../lib/services/shipping';
import { useAuth } from '../../context/AuthContext';
import {
  getOrderItemSpec,
  getOrderDepartments,
  getDepartmentLabel,
  getDepartmentBadgeClasses,
} from '../../lib/utils/product-kind';

export const Route = createFileRoute('/admin/shipping')({
  component: AdminShippingPage,
});

function AdminShippingPage() {
  const { admin } = useAuth();
  const [orders, setOrders] = useState(getOrders());
  const [selectedCourierMap, setSelectedCourierMap] = useState<Record<string, string>>({});

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

  const handleGenerateAWB = (order: Order) => {
    const courier = selectedCourierMap[order.id] || order.courier || 'DTDC';
    const newAwb = generateAWB();
    order.courier = courier;
    order.awbNumber = newAwb;
    order.trackingUrl = `https://www.dtdc.in/tracking/shipment-tracking.asp?strAWB=${newAwb}`;
    order.status = 'Shipped';
    saveOrder(order);
    refreshOrders();
    alert(`Generated ${courier} AWB: ${newAwb} for Order #${order.orderNumber}`);
  };

  const handleTimelineAdvance = (order: Order, nextStatus: Order['status']) => {
    order.status = nextStatus;
    saveOrder(order);
    refreshOrders();
  };

  return (
    <AdminLayout
      activeModule="shipping"
      title="COURIER &amp; LOGISTICS DISPATCH"
      subtitle="Manage shipping destinations, assign DTDC/Delhivery express couriers, and generate AWB tracking numbers."
    >
      <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-white font-bold">DISPATCH CONSOLE</h3>
          <p className="text-xs text-[#B5A490]">
            Logistics Adapter: <strong className="text-[#C89B3C]">{SHIPPING_MODE === 'mock' ? 'DTDC SANDBOX API' : 'LIVE COURIER API'}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-[#C89B3C]">
          <Truck className="w-4 h-4" />
          <span>Pan-India Priority Air &amp; Surface Dispatch</span>
        </div>
      </div>

      {/* Orders Ready for Shipping */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
            No orders available for shipping management.
          </div>
        ) : (
          orders.map((ord) => {
            const { departments: ordDepts, hasGlassBottle } = getOrderDepartments(ord.items);
            return (
            <div
              key={ord.id}
              className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 hover:border-[#C89B3C]/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D3025] pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-lg font-bold text-[#C89B3C]">#{ord.orderNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C89B3C]/20 text-[#C89B3C]">
                      {ord.status}
                    </span>
                    {ordDepts.map((dept) => (
                      <span
                        key={dept}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getDepartmentBadgeClasses(dept)}`}
                      >
                        {getDepartmentLabel(dept)}
                      </span>
                    ))}
                    {hasGlassBottle && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Fragile Glass Handling
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Customer: <strong className="text-white">{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.city}, {ord.shippingAddress.state})
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {!ord.awbNumber ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedCourierMap[ord.id] || ord.courier || 'DTDC'}
                        onChange={(e) =>
                          setSelectedCourierMap((prev) => ({ ...prev, [ord.id]: e.target.value }))
                        }
                        className="bg-[#241D17] border border-[#3D3025] text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                      >
                        <option value="DTDC">DTDC Express</option>
                        <option value="Delhivery">Delhivery Surface</option>
                        <option value="BlueDart">BlueDart Air Priority</option>
                        <option value="India Post">India Post Speed Post</option>
                      </select>

                      <button
                        onClick={() => handleGenerateAWB(ord)}
                        className="px-4 py-1.5 rounded-xl bg-[#C89B3C] text-black font-bold text-xs flex items-center space-x-1 hover:bg-[#D4A748]"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Generate AWB</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#C89B3C] font-bold block">
                        AWB: {ord.awbNumber}
                      </span>
                      <span className="text-[10px] text-gray-400">Partner: {ord.courier}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Contents & Packing Specifications */}
              <div className="p-3.5 rounded-xl bg-[#1A1410] border border-[#3D3025] space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C89B3C] block">
                    PACKAGE CONTENTS &amp; PACKING SPECIFICATIONS ({ord.items?.length || 0})
                  </span>
                  {hasGlassBottle && (
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-950/50 border border-rose-500/40 px-2 py-0.5 rounded-md">
                      Contains Glass Wine Bottle — Use Bubble Wrap &amp; Fragile Label
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ord.items?.map((item, idx) => {
                    const spec = getOrderItemSpec(item);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#241D17] border border-[#3D3025] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate text-xs">{item.productName}</p>
                          <p className="text-[10px] text-gray-400">Pack: {item.variantLabel}</p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded border font-extrabold text-[10px] uppercase ${
                              spec.isFragileGlass
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                : getDepartmentBadgeClasses(spec.department)
                            }`}
                          >
                            {spec.department === 'coffee'
                              ? spec.primaryTag
                              : spec.secondaryTag || spec.primaryTag}
                          </span>
                        </div>
                        <span className="font-bold text-white shrink-0 text-xs font-mono bg-black/40 px-2 py-1 rounded">
                          {item.quantity}× {spec.unitWord}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Address & Tracking Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-2">
                  <div className="flex items-center space-x-2 text-[#C89B3C] font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>DELIVERY DESTINATION</span>
                  </div>
                  <p className="text-white font-bold">{ord.shippingAddress.fullName}</p>
                  <p className="text-gray-400">{ord.shippingAddress.line1}, {ord.shippingAddress.line2 || ''}</p>
                  <p className="text-gray-400">
                    {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                  </p>
                  <p className="text-[#B5A490]">Phone: {ord.guestPhone}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#241D17] border border-[#3D3025] space-y-3">
                  <div className="flex items-center space-x-2 text-[#C89B3C] font-bold">
                    <Navigation className="w-4 h-4" />
                    <span>DELIVERY LIFECYCLE TIMELINE</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Current Status:</span>
                    <span className="text-white font-bold">{ord.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#3D3025]">
                    {['Confirmed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleTimelineAdvance(ord, st as any)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          ord.status === st
                            ? 'bg-[#C89B3C] text-black'
                            : 'bg-[#1C1612] text-gray-400 border border-[#3D3025] hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
