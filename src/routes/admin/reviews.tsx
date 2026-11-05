import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Star, CheckCircle, XCircle, Trash2, ShieldCheck, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getReviews, updateReviewStatus, deleteReview } from '../../lib/services/store-service';
import { Review } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/reviews')({
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  const { admin } = useAuth();
  const [reviews, setReviews] = useState(getReviews());
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshReviews = () => {
    setIsRefreshing(true);
    setReviews(getReviews());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Real-time synchronization across devices and domains
  useEffect(() => {
    const onStoreUpdate = () => {
      setReviews(getReviews());
    };
    window.addEventListener('coorg_store_updated', onStoreUpdate);
    window.addEventListener('storage', onStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', onStoreUpdate);
      window.removeEventListener('storage', onStoreUpdate);
    };
  }, []);

  const handleModerate = (id: string, status: 'approved' | 'rejected') => {
    updateReviewStatus(id, status, admin?.name);
    refreshReviews();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer review permanently?')) {
      deleteReview(id, admin?.name);
      refreshReviews();
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  const filtered = reviews.filter((r) => statusFilter === 'all' || r.status === statusFilter);

  return (
    <AdminLayout
      activeModule="reviews"
      title="PRODUCT REVIEWS &amp; MODERATION"
      subtitle="Approve, reject, or delete customer product reviews submitted from coorgcoffees.in."
    >
      {/* Pending Reviews Alert Banner */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-amber-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <strong className="font-bold text-white text-sm block">
                {pendingCount} New Customer Review{pendingCount > 1 ? 's' : ''} Awaiting Moderation
              </strong>
              Customer reviews submitted on coorgcoffees.in appear here for admin review.
            </div>
          </div>
          {statusFilter !== 'pending' && (
            <button
              onClick={() => setStatusFilter('pending')}
              className="px-4 py-2 rounded-xl bg-[#C89B3C] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#b08732] transition-colors"
            >
              View Pending ({pendingCount})
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div>
          <h3 className="font-display text-lg text-white font-bold">REVIEWS MODERATION QUEUE</h3>
          <p className="text-xs text-[#B5A490]">
            Total Reviews: <strong className="text-white">{reviews.length}</strong> | Pending:{' '}
            <strong className="text-amber-400">{pendingCount}</strong> | Approved:{' '}
            <strong className="text-emerald-400">{approvedCount}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshReviews}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#241D17] border border-[#3D3025] text-gray-300 hover:text-white hover:border-[#C89B3C]/50 transition-colors"
            title="Refresh Reviews"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C89B3C]' : ''}`} />
            <span>Refresh</span>
          </button>

          {(
            [
              { key: 'all', label: `All (${reviews.length})` },
              { key: 'pending', label: `Pending (${pendingCount})` },
              { key: 'approved', label: `Approved (${approvedCount})` },
              { key: 'rejected', label: `Rejected (${rejectedCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === tab.key
                  ? 'bg-[#C89B3C] text-black font-black'
                  : 'bg-[#241D17] border border-[#3D3025] text-gray-300 hover:bg-[#2A211B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
            No customer reviews match the selected filter.
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 hover:border-[#C89B3C]/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D3025] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-white text-sm">{rev.title || 'Product Review'}</span>
                    {rev.verifiedPurchase && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED PURCHASE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted by <strong className="text-white">{rev.userName}</strong> on{' '}
                    {new Date(rev.createdAt).toLocaleDateString()} for <strong className="text-[#C89B3C]">{rev.productName || 'Estate Coffee'}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : rev.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {rev.status}
                  </span>

                  <button
                    onClick={() => handleModerate(rev.id, 'approved')}
                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                    title="Approve Review"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleModerate(rev.id, 'rejected')}
                    className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                    title="Reject Review"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#E8D9C5] italic">"{rev.comment}"</p>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
