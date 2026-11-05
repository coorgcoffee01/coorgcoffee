import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Ticket, Plus, Trash2, Edit2, X, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getCoupons, saveCoupon, deleteCoupon, validateCoupon } from '../../lib/services/store-service';
import { Coupon } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/coupons')({
  component: AdminCouponsPage,
});

function AdminCouponsPage() {
  const { admin } = useAuth();
  const [coupons, setCoupons] = useState(getCoupons());

  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Test validator
  const [testCode, setTestCode] = useState('');
  const [testAmount, setTestAmount] = useState(999);
  const [testResult, setTestResult] = useState<any>(null);

  const refreshCoupons = () => setCoupons(getCoupons());

  const handleOpenAddModal = () => {
    setEditingCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 499,
      maxDiscountAmount: 300,
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon({ ...coupon });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this coupon code?')) {
      deleteCoupon(id, admin?.name);
      refreshCoupons();
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code) return;

    const couponToSave: Coupon = {
      id: editingCoupon.id || `coup-${Date.now()}`,
      code: editingCoupon.code.trim().toUpperCase(),
      discountType: editingCoupon.discountType || 'percentage',
      discountValue: Number(editingCoupon.discountValue) || 10,
      minOrderValue: Number(editingCoupon.minOrderValue) || 0,
      maxDiscountAmount: editingCoupon.maxDiscountAmount ? Number(editingCoupon.maxDiscountAmount) : undefined,
      expiryDate: editingCoupon.expiryDate || '2026-12-31',
      usageLimit: Number(editingCoupon.usageLimit) || 100,
      usedCount: editingCoupon.usedCount || 0,
      active: editingCoupon.active !== undefined ? editingCoupon.active : true,
      createdAt: editingCoupon.createdAt || new Date().toISOString(),
    };

    saveCoupon(couponToSave, admin?.name);
    setIsModalOpen(false);
    setEditingCoupon(null);
    refreshCoupons();
  };

  const handleTestCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateCoupon(testCode, testAmount);
    setTestResult(res);
  };

  return (
    <AdminLayout
      activeModule="coupons"
      title="COUPONS &amp; PROMOTIONAL DISCOUNTS"
      subtitle="Create promotional coupon codes, percentage/fixed discounts, usage limits, and expiration dates."
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div>
          <h3 className="font-display text-lg text-white font-bold">ACTIVE PROMOTIONS</h3>
          <p className="text-xs text-[#B5A490]">Total Active Coupons: {coupons.filter((c) => c.active).length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] shadow-md shadow-[#C89B3C]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 flex flex-col justify-between hover:border-[#C89B3C]/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xl font-extrabold text-[#C89B3C] tracking-wider block">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} FLAT OFF`}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEditModal(coupon)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#C89B3C]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-300 pt-2 border-t border-[#2D231A]">
                <p>Min Order Value: <strong className="text-white">₹{coupon.minOrderValue}</strong></p>
                {coupon.maxDiscountAmount && (
                  <p>Max Discount Cap: <strong className="text-white">₹{coupon.maxDiscountAmount}</strong></p>
                )}
                <p>Expires: <strong className="text-white">{coupon.expiryDate}</strong></p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2D231A] flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[10px]">
                Used: <strong className="text-white">{coupon.usedCount}</strong> / {coupon.usageLimit}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  coupon.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {coupon.active ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Tester Form */}
      <div className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4">
        <h3 className="font-display text-xl text-white font-bold">LIVE COUPON VALIDATOR TESTER</h3>
        <form onSubmit={handleTestCoupon} className="flex flex-wrap items-center gap-4 text-xs">
          <input
            type="text"
            placeholder="Enter Coupon Code (e.g. COORG15)"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C] font-mono"
          />
          <input
            type="number"
            placeholder="Order Subtotal (₹)"
            value={testAmount}
            onChange={(e) => setTestAmount(Number(e.target.value))}
            className="px-3.5 py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#C89B3C] text-black font-bold"
          >
            Test Code
          </button>
        </form>

        {testResult && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center space-x-3 ${
              testResult.valid
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {testResult.valid ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <div>
              <strong className="block font-bold">{testResult.message}</strong>
              {testResult.valid && (
                <span>Discount calculated: <strong>₹{testResult.discountAmount}</strong></span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <h3 className="font-display text-xl text-white font-bold">
                {editingCoupon.id ? 'Edit Coupon' : 'Create Coupon Code'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                  placeholder="e.g. FESTIVAL20"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white font-mono uppercase focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discountType || 'percentage'}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingCoupon.discountValue || 10}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCoupon.minOrderValue || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderValue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={editingCoupon.expiryDate || '2026-12-31'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  checked={editingCoupon.active ?? true}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, active: e.target.checked })}
                  className="rounded bg-[#241D17] border-[#3D3025] text-[#C89B3C]"
                />
                <span className="text-white font-bold">Active for Customers</span>
              </div>

              <div className="pt-4 border-t border-[#3D3025] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C89B3C] text-black font-bold flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
