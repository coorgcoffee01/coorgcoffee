import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { FileSpreadsheet, Download, Calendar, Filter, FileText } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getOrders, getProducts, getCategories } from '../../lib/services/store-service';

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const [reportType, setReportType] = useState<'sales' | 'orders' | 'inventory' | 'customers'>('sales');
  const [dateRange, setDateRange] = useState<'today' | '7_days' | '30_days' | 'all'>('all');

  const orders = getOrders();
  const products = getProducts();

  const handleExportCSV = () => {
    let csvRows: string[] = [];

    if (reportType === 'orders' || reportType === 'sales') {
      csvRows.push(['Order Number', 'Date', 'Customer Name', 'Status', 'Grand Total (INR)', 'Payment Status', 'Courier'].join(','));
      orders.forEach((o) => {
        csvRows.push(
          [
            `"${o.orderNumber}"`,
            `"${new Date(o.createdAt).toLocaleDateString()}"`,
            `"${o.shippingAddress.fullName}"`,
            `"${o.status}"`,
            o.grandTotal,
            `"${o.paymentStatus}"`,
            `"${o.courier}"`,
          ].join(',')
        );
      });
    } else {
      csvRows.push(['Product ID', 'Name', 'Category', 'Roast Level', 'Total Variants', 'Active'].join(','));
      products.forEach((p) => {
        csvRows.push(
          [
            `"${p.id}"`,
            `"${p.name}"`,
            `"${p.categoryName}"`,
            `"${p.roastLevel}"`,
            p.variants.length,
            p.active ? 'Yes' : 'No',
          ].join(',')
        );
      });
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coorg_coffee_${reportType}_report_${dateRange}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const data = reportType === 'inventory' ? products : orders;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coorg_coffee_${reportType}_report_${dateRange}.json`;
    link.click();
  };

  return (
    <AdminLayout
      activeModule="reports"
      title="BUSINESS REPORTS &amp; EXPORT CENTER"
      subtitle="Generate detailed reports for Sales Revenue, Orders Fulfillment, Inventory Stock, and Customer Spend data."
    >
      {/* Report Generator Controls */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-6">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-[#C89B3C]" />
          <h3 className="font-display text-xl text-white font-bold">CONFIGURE REPORT EXPORT</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Select Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
            >
              <option value="sales">Sales &amp; Revenue Report</option>
              <option value="orders">Orders &amp; Dispatch Report</option>
              <option value="inventory">Inventory &amp; SKU Stock Report</option>
              <option value="customers">Customer Directory Report</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Time Period Filter</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
            >
              <option value="today">Today</option>
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
              <option value="all">All Time History</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#3D3025]">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] shadow-md shadow-[#C89B3C]/20"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white font-bold text-xs hover:bg-[#2E251E]"
          >
            <FileText className="w-4 h-4 text-[#C89B3C]" />
            <span>Export Raw JSON</span>
          </button>
        </div>
      </div>

      {/* Report Data Preview */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <h3 className="font-display text-xl text-white font-bold uppercase">
          REPORT PREVIEW: {reportType}
        </h3>

        {reportType === 'orders' || reportType === 'sales' ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#3D3025] text-[#B5A490] font-bold">
                  <th className="py-2.5 px-2">ORDER #</th>
                  <th className="py-2.5 px-2">DATE</th>
                  <th className="py-2.5 px-2">CUSTOMER</th>
                  <th className="py-2.5 px-2">STATUS</th>
                  <th className="py-2.5 px-2">GRAND TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A211B]">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 px-2 font-mono text-[#C89B3C] font-bold">{o.orderNumber}</td>
                    <td className="py-2.5 px-2 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-2 text-white font-bold">{o.shippingAddress.fullName}</td>
                    <td className="py-2.5 px-2 text-gray-300">{o.status}</td>
                    <td className="py-2.5 px-2 font-bold text-emerald-400">₹{o.grandTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#3D3025] text-[#B5A490] font-bold">
                  <th className="py-2.5 px-2">PRODUCT NAME</th>
                  <th className="py-2.5 px-2">CATEGORY</th>
                  <th className="py-2.5 px-2">ROAST</th>
                  <th className="py-2.5 px-2">VARIANTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A211B]">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-2 text-white font-bold">{p.name}</td>
                    <td className="py-2.5 px-2 text-[#C89B3C]">{p.categoryName}</td>
                    <td className="py-2.5 px-2 text-gray-300">{p.roastLevel}</td>
                    <td className="py-2.5 px-2 text-gray-400">{p.variants.length} SKU Variants</td>
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
