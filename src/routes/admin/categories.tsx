import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Tags, Plus, Edit2, Trash2, X, Save, Layers } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getCategories, saveCategory, deleteCategory, getProducts } from '../../lib/services/store-service';
import { Category } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const { admin } = useAuth();
  const [categories, setCategories] = useState(getCategories());
  const [products] = useState(getProducts());

  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshCategories = () => setCategories(getCategories());

  const handleOpenAddModal = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      sortOrder: categories.length + 1,
      badgeColor: 'green',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory({ ...category });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete category? Products in this category may need reassignment.')) {
      deleteCategory(id, admin?.name);
      refreshCategories();
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    const slug =
      editingCategory.slug ||
      editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const catToSave: Category = {
      id: editingCategory.id || `cat-${Date.now()}`,
      name: editingCategory.name,
      slug,
      description: editingCategory.description || '',
      sortOrder: Number(editingCategory.sortOrder) || 1,
      badgeColor: editingCategory.badgeColor || 'green',
    };

    saveCategory(catToSave, admin?.name);
    setIsModalOpen(false);
    setEditingCategory(null);
    refreshCategories();
  };

  return (
    <AdminLayout
      activeModule="categories"
      title="CATEGORY MANAGEMENT"
      subtitle="Organize estate coffees by Arabica, Robusta, Signature Blends, and custom collections."
    >
      <div className="flex justify-between items-center p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div>
          <h3 className="font-display text-lg text-white font-bold">STORE CATEGORIES</h3>
          <p className="text-xs text-[#B5A490]">Total Categories: {categories.length}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] shadow-md shadow-[#C89B3C]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-[#1C1612] border border-[#3D3025] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-[#C89B3C]">
                      <Tags className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-xl text-white font-bold">{cat.name}</h4>
                      <span className="text-[10px] font-mono text-gray-400">/{cat.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#C89B3C]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {cat.id !== 'cat-all' && (
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#B5A490] line-clamp-2">{cat.description || 'No description set.'}</p>
              </div>

              <div className="pt-4 border-t border-[#2D231A] flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#241D17] text-gray-300 font-bold border border-[#3D3025]">
                  Sort Order: #{cat.sortOrder}
                </span>
                <span className="text-[#C89B3C] font-bold">
                  {productCount} {productCount === 1 ? 'Product' : 'Products'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <h3 className="font-display text-xl text-white font-bold">
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Cold Brew Concentrates"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. cold-brew"
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Brief summary of coffee type..."
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={editingCategory.sortOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sortOrder: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                />
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
