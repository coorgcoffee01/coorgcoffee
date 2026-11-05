import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, Save, Eye } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getBanners, saveBanner, deleteBanner } from '../../lib/services/store-service';
import { Banner } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/banners')({
  component: AdminBannersPage,
});

function AdminBannersPage() {
  const { admin } = useAuth();
  const [banners, setBanners] = useState(getBanners());

  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshBanners = () => setBanners(getBanners());

  const handleOpenAddModal = () => {
    setEditingBanner({
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'EXPLORE HARVEST',
      ctaLink: '/shop',
      position: 'hero',
      active: true,
      sortOrder: banners.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete promotional banner?')) {
      deleteBanner(id, admin?.name);
      refreshBanners();
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;

    const bannerToSave: Banner = {
      id: editingBanner.id || `ban-${Date.now()}`,
      title: editingBanner.title,
      subtitle: editingBanner.subtitle || '',
      imageUrl: editingBanner.imageUrl || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
      ctaText: editingBanner.ctaText || 'EXPLORE NOW',
      ctaLink: editingBanner.ctaLink || '/shop',
      position: editingBanner.position || 'hero',
      active: editingBanner.active !== undefined ? editingBanner.active : true,
      sortOrder: Number(editingBanner.sortOrder) || 1,
      createdAt: editingBanner.createdAt || new Date().toISOString(),
    };

    saveBanner(bannerToSave, admin?.name);
    setIsModalOpen(false);
    setEditingBanner(null);
    refreshBanners();
  };

  return (
    <AdminLayout
      activeModule="banners"
      title="HOMEPAGE BANNERS &amp; PROMOTIONS"
      subtitle="Manage hero banner slides, announcement bars, promotional cards, CTA links, and position ordering."
    >
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div>
          <h3 className="font-display text-lg text-white font-bold">STORE PROMOTIONAL BANNERS</h3>
          <p className="text-xs text-[#B5A490]">Total Banners: {banners.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] shadow-md shadow-[#C89B3C]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner Slide</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((ban) => (
          <div
            key={ban.id}
            className="rounded-2xl bg-[#1C1612] border border-[#3D3025] overflow-hidden space-y-4 flex flex-col justify-between"
          >
            <div className="relative h-44 w-full">
              <img src={ban.imageUrl} alt={ban.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C89B3C] text-black w-fit mb-1">
                  {ban.position}
                </span>
                <h4 className="font-display text-lg text-white font-bold">{ban.title}</h4>
                <p className="text-xs text-gray-300 line-clamp-1">{ban.subtitle}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-[#2D231A] text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block">CTA Link:</span>
                <span className="font-mono text-[#C89B3C] font-bold">{ban.ctaText} $\rightarrow$ {ban.ctaLink}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditModal(ban)}
                  className="p-1.5 rounded-lg bg-[#241D17] border border-[#3D3025] text-white hover:text-[#C89B3C]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ban.id)}
                  className="p-1.5 rounded-lg bg-[#241D17] border border-[#3D3025] text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <h3 className="font-display text-xl text-white font-bold">
                {editingBanner.id ? 'Edit Banner' : 'Create Banner Slide'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. FRESH HARVEST 2026 COORG ARABICA"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value } as any)}
                  placeholder="e.g. Handpicked from Madikeri 4000ft altitude"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 font-bold mb-1">Background Image Upload &amp; URL *</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#241D17] border border-dashed border-[#C89B3C]/50 hover:bg-[#2E251E] cursor-pointer transition-colors text-center text-xs text-[#C89B3C] font-bold flex items-center justify-center space-x-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setEditingBanner({ ...editingBanner, imageUrl: result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  <input
                    type="text"
                    value={editingBanner.imageUrl || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                    placeholder="Or paste Image URL..."
                    className="flex-1 w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white text-xs focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {editingBanner.imageUrl && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-[#3D3025] bg-[#241D17] relative">
                    <img src={editingBanner.imageUrl} alt="Banner preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 text-[9px] font-bold text-white bg-black/70 px-2 py-0.5 rounded">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Placement Area</label>
                  <select
                    value={editingBanner.position || 'hero'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, position: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  >
                    <option value="hero">Hero Carousel</option>
                    <option value="top_announcement">Top Announcement Bar</option>
                    <option value="promo_grid">Promotional Grid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">CTA Link Path</label>
                  <input
                    type="text"
                    value={editingBanner.ctaLink || '/shop'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white"
                  />
                </div>
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
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
