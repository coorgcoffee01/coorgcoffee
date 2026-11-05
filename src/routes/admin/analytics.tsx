import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Package, DollarSign, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrders, getProducts } from '../../lib/services/store-service';
import { Order, Product } from '../../lib/types';

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [products, setProducts] = useState<Product[]>(getProducts());

  React.useEffect(() => {
    const onStoreUpdate = () => {
      setOrders(getOrders());
      setProducts(getProducts());
    };
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
  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Chart 1: Revenue Trends over months / simulated timeline
  const revenueTrendData = [
    { period: 'Jan 2026', revenue: 4200, orders: 8 },
    { period: 'Feb 2026', revenue: 8900, orders: 15 },
    { period: 'Mar 2026', revenue: 12500, orders: 22 },
    { period: 'Apr 2026', revenue: 16800, orders: 29 },
    { period: 'May 2026', revenue: 21000, orders: 36 },
    { period: 'Jun 2026', revenue: 24500, orders: 42 },
    { period: 'Jul 2026', revenue: 28900, orders: 48 },
    { period: 'Aug 2026', revenue: totalRevenue > 0 ? totalRevenue : 32400, orders: orders.length || 54 },
  ];

  // Chart 2: Top Products by Order Count / Sales
  const topProductsData = products.slice(0, 5).map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    sales: p.variants.reduce((acc, v) => acc + (100 - v.stock), 0) * 15,
  }));

  // Chart 3: Order Status Distribution
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const COLORS = ['#C89B3C', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <AdminLayout
      activeModule="analytics"
      title="BUSINESS ANALYTICS &amp; SALES TRENDS"
      subtitle="Comprehensive revenue charts, top-selling estate coffee rankings, and order distribution insights."
    >
      {/* High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">TOTAL REVENUE</span>
          <p className="font-display text-3xl text-white font-bold">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 font-semibold">+18.5% from last month</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">AVERAGE ORDER VALUE (AOV)</span>
          <p className="font-display text-3xl text-[#C89B3C] font-bold">₹{aov}</p>
          <p className="text-[10px] text-gray-400">Based on {orders.length} total orders</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">ESTATE SKUS ACTIVE</span>
          <p className="font-display text-3xl text-white font-bold">{products.length}</p>
          <p className="text-[10px] text-blue-400">100% Coorg Elevation Grown</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-2">
          <span className="text-xs text-[#B5A490] font-bold uppercase tracking-wider">CONVERSION RATE</span>
          <p className="font-display text-3xl text-emerald-400 font-bold">3.8%</p>
          <p className="text-[10px] text-emerald-400">High checkout completion</p>
        </div>
      </div>

      {/* Revenue Trend Area Chart */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#C89B3C]" />
          <h3 className="font-display text-xl text-white font-bold">MONTHLY REVENUE &amp; GROWTH TREND</h3>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrendData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C89B3C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#8C7A6B" fontSize={11} />
              <YAxis stroke="#8C7A6B" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1C1612', borderColor: '#3D3025', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#C89B3C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products Bar Chart */}
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#C89B3C]" />
            <h3 className="font-display text-lg text-white font-bold">TOP SELLING PRODUCTS</h3>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData}>
                <XAxis dataKey="name" stroke="#8C7A6B" fontSize={10} />
                <YAxis stroke="#8C7A6B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1612', borderColor: '#3D3025', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#C89B3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution Pie Chart */}
        <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-[#C89B3C]" />
            <h3 className="font-display text-lg text-white font-bold">ORDER STATUS DISTRIBUTION</h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-4">
            {pieData.length === 0 ? (
              <p className="text-gray-500 text-xs">No order status data recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C1612', borderColor: '#3D3025', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
