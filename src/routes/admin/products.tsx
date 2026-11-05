import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  Check,
  Save,
  Image as ImageIcon,
  Send,
  Archive,
  RotateCcw,
  AlertTriangle,
  CheckSquare,
  Square,
  CheckCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  getProducts,
  getAllProducts,
  getCategories,
  saveProduct,
  deleteProduct,
  softDeleteProduct,
  restoreProduct,
  updateVariantStock,
} from '../../lib/services/store-service';
import { Product, ProductVariant } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { newsletterService } from '../../lib/services/newsletter-service';
import { toast } from 'sonner';
import { ConfirmDialog, DeleteProductDialog, ConfirmDialogProps } from '../../components/admin/ConfirmDialog';

export const Route = createFileRoute('/admin/products')({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { admin } = useAuth();
  const [products, setProducts] = useState(getAllProducts());
  const [categories] = useState(getCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outofstock' | 'archived'>('all');
  const [notifyEmailSubscribers, setNotifyEmailSubscribers] = useState(true);

  // Selection & Bulk Actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Dialog States
  const [deleteDialogProduct, setDeleteDialogProduct] = useState<Product | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps | null>(null);

  // Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshProducts = () => setProducts(getAllProducts());

  // Real-time synchronization
  useEffect(() => {
    const onStoreUpdate = () => refreshProducts();
    window.addEventListener('coorg_store_updated', onStoreUpdate);
    window.addEventListener('storage', onStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', onStoreUpdate);
      window.removeEventListener('storage', onStoreUpdate);
    };
  }, []);

  const handleStockChange = (productId: string, variantId: string, newStock: number) => {
    updateVariantStock(productId, variantId, newStock, admin?.name);
    refreshProducts();
  };

  const handleToggleVariantStock = (productId: string, variantId: string, currentlyOut: boolean) => {
    const nextQty = currentlyOut ? 50 : 0;
    updateVariantStock(productId, variantId, nextQty, admin?.name);
    refreshProducts();
  };

  const promptToggleVariantStock = (product: Product, variantId: string, currentlyOut: boolean) => {
    const v = product.variants.find((vr) => vr.variantId === variantId);
    if (!v) return;

    if (!currentlyOut) {
      setConfirmDialog({
        isOpen: true,
        title: 'Mark Variant Out of Stock?',
        subtitle: `${product.name} • ${v.label}`,
        message: (
          <div className="space-y-2">
            <p>
              Are you sure you want to mark <strong className="text-white font-bold">{product.name} ({v.label})</strong> as <strong className="text-red-400 font-bold">OUT OF STOCK</strong>?
            </p>
            <p className="text-[11px] text-gray-400">
              This will immediately reflect with an OUT OF STOCK badge and disable customer purchase buttons on the shop and storefront.
            </p>
          </div>
        ),
        confirmLabel: 'Yes, Mark Out of Stock',
        variant: 'danger',
        icon: 'alert',
        onConfirm: () => {
          handleToggleVariantStock(product.id, variantId, false);
          setConfirmDialog(null);
          toast.info(`"${product.name} (${v.label})" marked out of stock.`);
        },
      });
    } else {
      setConfirmDialog({
        isOpen: true,
        title: 'Restock Variant Inventory?',
        subtitle: `${product.name} • ${v.label}`,
        message: (
          <div>
            <p>
              Are you sure you want to restock <strong className="text-white font-bold">{product.name} ({v.label})</strong> with <strong className="text-emerald-400 font-bold">50 units</strong>?
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              This will immediately re-enable purchasing on the storefront.
            </p>
          </div>
        ),
        confirmLabel: 'Yes, Restock (50 Units)',
        variant: 'success',
        icon: 'refresh',
        onConfirm: () => {
          handleToggleVariantStock(product.id, variantId, true);
          setConfirmDialog(null);
          toast.success(`"${product.name} (${v.label})" restocked with 50 units.`);
        },
      });
    }
  };

  const handleAdjustQty = (productId: string, variantId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    const v = prod?.variants.find((vr) => vr.variantId === variantId);
    if (!v) return;
    const nextQty = Math.max(0, (v.stock || 0) + delta);
    updateVariantStock(productId, variantId, nextQty, admin?.name);
    refreshProducts();
  };

  // Open Delete Confirmation Dialog with Soft vs Hard delete options
  const handleDeleteClick = (product: Product) => {
    setDeleteDialogProduct(product);
  };

  const handleSoftDelete = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    softDeleteProduct(productId, admin?.name);
    refreshProducts();
    setDeleteDialogProduct(null);
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    toast.success(`"${prod?.name || 'Product'}" was safely archived (soft-deleted).`);
  };

  const handlePermanentDelete = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    deleteProduct(productId, admin?.name);
    refreshProducts();
    setDeleteDialogProduct(null);
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    toast.error(`"${prod?.name || 'Product'}" permanently deleted from database.`);
  };

  const handleRestore = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setConfirmDialog({
      isOpen: true,
      title: 'Restore Product to Storefront?',
      subtitle: prod?.name || '',
      message: (
        <div>
          <p>
            Are you sure you want to restore <strong className="text-white font-bold">{prod?.name}</strong> back to active store listings?
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Customers will immediately be able to view and purchase this roast again on the storefront.
          </p>
        </div>
      ),
      confirmLabel: 'Yes, Restore to Storefront',
      variant: 'success',
      icon: 'refresh',
      onConfirm: () => {
        restoreProduct(productId, admin?.name);
        refreshProducts();
        setConfirmDialog(null);
        toast.success(`"${prod?.name}" is restored and active on the storefront!`);
      },
    });
  };

  // Selection Checkboxes
  const toggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = (filteredIds: string[]) => {
    if (selectedProductIds.length === filteredIds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredIds);
    }
  };

  // Bulk Actions
  const handleBulkMarkOutOfStock = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Mark Selected Products Out of Stock?',
      subtitle: `${selectedProductIds.length} Products Selected`,
      message: `Are you sure you want to mark all variants of ${selectedProductIds.length} selected product(s) as OUT OF STOCK?`,
      confirmLabel: 'Yes, Mark Out of Stock',
      variant: 'danger',
      icon: 'alert',
      onConfirm: () => {
        selectedProductIds.forEach((pid) => {
          const p = products.find((pr) => pr.id === pid);
          p?.variants.forEach((vr) => {
            updateVariantStock(pid, vr.variantId, 0, admin?.name);
          });
        });
        refreshProducts();
        setSelectedProductIds([]);
        setConfirmDialog(null);
        toast.success(`Marked all variants of selected products OUT OF STOCK.`);
      },
    });
  };

  const handleBulkRestock = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restock Selected Products?',
      subtitle: `${selectedProductIds.length} Products Selected`,
      message: `Are you sure you want to restock all variants of ${selectedProductIds.length} selected product(s) with 50 units each?`,
      confirmLabel: 'Yes, Restock (50 Units Each)',
      variant: 'success',
      icon: 'refresh',
      onConfirm: () => {
        selectedProductIds.forEach((pid) => {
          const p = products.find((pr) => pr.id === pid);
          p?.variants.forEach((vr) => {
            updateVariantStock(pid, vr.variantId, 50, admin?.name);
          });
        });
        refreshProducts();
        setSelectedProductIds([]);
        setConfirmDialog(null);
        toast.success(`Restocked selected products.`);
      },
    });
  };

  const handleBulkSoftDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Archive / Soft Delete Selected Products?',
      subtitle: `${selectedProductIds.length} Products Selected`,
      message: `Are you sure you want to soft delete and archive ${selectedProductIds.length} product(s)? They will be hidden from the storefront, but you can restore them anytime.`,
      confirmLabel: 'Archive Selected',
      variant: 'warning',
      icon: 'archive',
      onConfirm: () => {
        selectedProductIds.forEach((pid) => {
          softDeleteProduct(pid, admin?.name);
        });
        refreshProducts();
        setSelectedProductIds([]);
        setConfirmDialog(null);
        toast.success(`Archived ${selectedProductIds.length} products.`);
      },
    });
  };

  const handleOpenAddModal = () => {
    setEditingProduct({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      roastLevel: 'Medium',
      grindOptions: ['South Indian Filter Grind', 'Traditional Drip Grind', 'Whole Beans'],
      categoryId: categories[1]?.id || 'cat-arabica',
      categoryName: categories[1]?.name || 'Arabica Specials',
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'],
      ratingAvg: 5.0,
      ratingCount: 1,
      featured: true,
      accentColor: 'green',
      active: true,
      variants: [
        {
          variantId: `var-${Date.now()}-250`,
          productId: '',
          label: '250g Pouch',
          sku: `CC-PRD-250`,
          price: 350,
          salePrice: null,
          stock: 50,
          active: true,
        },
        {
          variantId: `var-${Date.now()}-500`,
          productId: '',
          label: '500g Pack',
          sku: `CC-PRD-500`,
          price: 650,
          salePrice: 600,
          stock: 30,
          active: true,
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsModalOpen(true);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const isNew = !editingProduct.id;
    const slug =
      editingProduct.slug ||
      editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const cat = categories.find((c) => c.id === editingProduct.categoryId);

    const productToSave: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name,
      slug,
      tagline: editingProduct.tagline || 'Artisan Roasted Coorg Blend',
      description: editingProduct.description || '',
      roastLevel: editingProduct.roastLevel || 'Medium',
      grindOptions: editingProduct.grindOptions || [],
      categoryId: editingProduct.categoryId || 'cat-arabica',
      categoryName: cat ? cat.name : 'Arabica Specials',
      images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'],
      ratingAvg: editingProduct.ratingAvg || 5.0,
      ratingCount: editingProduct.ratingCount || 1,
      featured: Boolean(editingProduct.featured),
      accentColor: editingProduct.accentColor || 'green',
      active: editingProduct.active !== undefined ? editingProduct.active : true,
      variants: editingProduct.variants || [],
      createdAt: editingProduct.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProduct(productToSave, admin?.name);

    if (notifyEmailSubscribers) {
      try {
        const mainVar = productToSave.variants[0];
        const res = await newsletterService.notifySubscribers({
          templateType: isNew ? 'new_product_launch' : 'price_drop_alert',
          subject: isNew
            ? `🚀 New Release: ${productToSave.name} has arrived!`
            : `📉 Special Alert: ${productToSave.name} updated offer!`,
          title: isNew ? `New Roast Launch: ${productToSave.name}` : `Offer Update: ${productToSave.name}`,
          message: productToSave.tagline || productToSave.description,
          productName: productToSave.name,
          productImage: productToSave.images[0] || '',
          newPrice: (mainVar?.salePrice || mainVar?.price) ?? 0,
          ctaText: 'SHOP THIS ROAST NOW',
          ctaUrl: `https://webtech-6dfba--staging-t9tcm2ki.web.app/product/${productToSave.slug}`,
        });
        toast.success(`Saved product & emailed ${res.sent} active subscriber(s)!`);
      } catch (err) {
        console.warn('Notification broadcast error:', err);
      }
    } else {
      toast.success('Product saved successfully.');
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    refreshProducts();
  };

  const activeProducts = products.filter((p) => !p.isDeleted);
  const archivedProducts = products.filter((p) => p.isDeleted);
  const outOfStockCount = activeProducts.filter((p) => p.variants.some((v) => v.stock <= 0)).length;

  const currentProductPool = stockFilter === 'archived' ? archivedProducts : activeProducts;

  const filteredProducts = currentProductPool.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const isOutOfStock = p.variants.some((v) => v.stock <= 0);
    const matchesStock =
      stockFilter === 'all' || stockFilter === 'archived'
        ? true
        : stockFilter === 'outofstock'
        ? isOutOfStock
        : p.variants.every((v) => v.stock > 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <AdminLayout
      activeModule="products"
      title="PRODUCT &amp; CATALOGUE MANAGEMENT"
      subtitle="Manage estate coffee products, pricing, discounts, SKU variants, and live inventory stock counts."
    >
      {/* Top Filter Bar */}
      <div className="space-y-3 p-4 rounded-2xl bg-[#1C1612] border border-[#3D3025]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#241D17] border border-[#3D3025] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C89B3C]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#241D17] border border-[#3D3025] rounded-xl text-xs text-white focus:outline-none focus:border-[#C89B3C]"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#C89B3C] text-black font-bold text-xs hover:bg-[#D4A748] shadow-md shadow-[#C89B3C]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stock Filter Pills */}
        {/* Stock Filter Pills & Bulk Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2D231A]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#B5A490] font-bold mr-1">Filter by Stock:</span>
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-[#C89B3C] text-black shadow'
                  : 'bg-[#241D17] border border-[#3D3025] text-gray-300 hover:bg-[#2A211B]'
              }`}
            >
              All Active ({activeProducts.length})
            </button>

            <button
              onClick={() => setStockFilter('instock')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stockFilter === 'instock'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-[#241D17] border border-[#3D3025] text-emerald-400 hover:bg-[#2A211B]'
              }`}
            >
              In Stock Only ({activeProducts.length - outOfStockCount})
            </button>

            <button
              onClick={() => setStockFilter('outofstock')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stockFilter === 'outofstock'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-[#241D17] border border-[#3D3025] text-red-400 hover:bg-[#2A211B]'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>

            <button
              onClick={() => setStockFilter('archived')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                stockFilter === 'archived'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-[#241D17] border border-[#3D3025] text-amber-400 hover:bg-[#2A211B]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archived / Soft-Deleted ({archivedProducts.length})</span>
            </button>
          </div>

          {/* Selection toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleSelectAll(filteredProducts.map((p) => p.id))}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#241D17] border border-[#3D3025] text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
            >
              {selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-[#C89B3C]" />
              ) : (
                <Square className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span>
                {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedProductIds.length > 0 && (
        <div className="sticky top-20 z-30 p-3.5 rounded-xl bg-[#281E16] border-2 border-[#C89B3C] shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-xs">
            <CheckCircle className="w-4 h-4 text-[#C89B3C]" />
            <strong className="text-white font-bold">
              {selectedProductIds.length} Product(s) Selected
            </strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkMarkOutOfStock}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wide cursor-pointer transition-all shadow"
            >
              Mark Selected Out of Stock
            </button>
            <button
              onClick={handleBulkRestock}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide cursor-pointer transition-all shadow"
            >
              Restock Selected (50)
            </button>
            <button
              onClick={handleBulkSoftDelete}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold tracking-wide cursor-pointer transition-all shadow"
            >
              Archive / Soft Delete Selected
            </button>
            <button
              onClick={() => setSelectedProductIds([])}
              className="px-3 py-1.5 rounded-lg bg-[#1C1612] border border-[#3D3025] text-gray-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              Cancel Selection
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProducts.map((product) => {
          const allVariantsOut = product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);
          const isArchived = Boolean(product.isDeleted);
          const isSelected = selectedProductIds.includes(product.id);

          return (
            <div
              key={product.id}
              className={`p-6 rounded-2xl border space-y-6 flex flex-col justify-between transition-all relative ${
                isArchived
                  ? 'bg-[#211A14] border-amber-500/50 shadow-md'
                  : allVariantsOut
                  ? 'bg-[#221614] border-red-500/60 shadow-lg shadow-red-950/20 ring-1 ring-red-500/30'
                  : isSelected
                  ? 'bg-[#241D17] border-[#C89B3C] ring-1 ring-[#C89B3C]'
                  : 'bg-[#1C1612] border-[#3D3025] hover:border-[#C89B3C]/40'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                    {/* Select Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-4 h-4 rounded text-[#C89B3C] border-[#3D3025] bg-[#241D17] accent-[#C89B3C] cursor-pointer shrink-0"
                    />

                    <div className="relative shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-16 h-16 object-cover rounded-xl border ${
                          allVariantsOut ? 'border-red-500/50 grayscale contrast-125' : 'border-[#3D3025] bg-[#241D17]'
                        }`}
                      />
                      {allVariantsOut && !isArchived && (
                        <div className="absolute inset-0 bg-red-950/80 rounded-xl flex items-center justify-center border border-red-500/50">
                          <span className="text-[9px] font-black uppercase tracking-wider text-red-100">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-display text-xl text-white font-bold truncate">{product.name}</h3>
                        {isArchived ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            ARCHIVED (SOFT-DELETED)
                          </span>
                        ) : !product.active ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            INACTIVE
                          </span>
                        ) : allVariantsOut ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shadow-sm flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>OUT OF STOCK</span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-[#C89B3C] font-semibold">
                        {product.categoryName} • {product.roastLevel} Roast
                      </p>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{product.tagline}</p>
                    </div>
                  </div>

                  {/* Actions for Card */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {isArchived ? (
                      <>
                        <button
                          onClick={() => handleRestore(product.id)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all shadow"
                          title="Restore Product to Active Storefront"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(product.id)}
                          className="p-1.5 rounded-lg bg-[#241D17] border border-red-500/40 text-red-400 hover:bg-red-500/20 cursor-pointer"
                          title="Permanently Delete from Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 rounded-lg bg-[#241D17] border border-[#3D3025] text-[#C89B3C] hover:bg-[#2E251E] cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 rounded-lg bg-[#241D17] border border-[#3D3025] text-red-400 hover:bg-red-500/20 cursor-pointer"
                          title="Delete / Archive Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Variants Stock Manager */}
                <div className="space-y-3 pt-4 border-t border-[#2D231A]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C89B3C]">
                      VARIANTS &amp; INVENTORY STOCK
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      {product.variants.filter((v) => v.stock <= 0).length > 0 ? (
                        <span className="text-red-400 font-bold">
                          {product.variants.filter((v) => v.stock <= 0).length} Variant(s) Out of Stock
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">All Sizes In Stock</span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {product.variants.map((variant) => {
                      const isOut = variant.stock <= 0;

                      return (
                        <div
                          key={variant.variantId}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                            isOut
                              ? 'bg-red-950/30 border-red-500/50 text-red-200'
                              : 'bg-[#241D17] border-[#3D3025] text-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm block">{variant.label}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isOut
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {isOut ? 'OUT OF STOCK' : `IN STOCK (${variant.stock})`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-[11px]">
                              <span className="font-bold text-[#C89B3C]">
                                ₹{variant.salePrice || variant.price}
                              </span>
                              {variant.salePrice && (
                                <span className="line-through text-gray-500 text-[10px]">
                                  ₹{variant.price}
                                </span>
                              )}
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 font-mono text-[10px]">{variant.sku}</span>
                            </div>
                          </div>

                          {/* Stock Controls: Steppers, Number Input, and 1-Click Out-of-Stock Button with Confirmation */}
                          <div className="flex items-center space-x-2 self-end sm:self-center">
                            {/* Stepper buttons */}
                            <div className="flex items-center bg-[#1C1612] rounded-lg border border-[#3D3025] overflow-hidden">
                              <button
                                onClick={() => handleAdjustQty(product.id, variant.variantId, -10)}
                                className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#2E251E] font-bold"
                                title="Decrease 10"
                              >
                                -10
                              </button>
                              <input
                                type="number"
                                min={0}
                                value={variant.stock}
                                onChange={(e) =>
                                  handleStockChange(product.id, variant.variantId, Number(e.target.value))
                                }
                                className={`w-14 px-1 py-1 text-center font-mono font-bold text-xs bg-transparent focus:outline-none ${
                                  isOut ? 'text-red-400 font-black' : 'text-white'
                                }`}
                              />
                              <button
                                onClick={() => handleAdjustQty(product.id, variant.variantId, 10)}
                                className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#2E251E] font-bold"
                                title="Increase 10"
                              >
                                +10
                              </button>
                            </div>

                            {/* 1-Click Out-of-Stock Toggle Button with Confirmation */}
                            <button
                              onClick={() => promptToggleVariantStock(product, variant.variantId, isOut)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                                isOut
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                              }`}
                            >
                              {isOut ? 'Restock (50)' : 'Mark Out'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#3D3025] pb-4">
              <h3 className="font-display text-xl text-white font-bold">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Arabica Special Filter Coffee"
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Category *</label>
                  <select
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingProduct.tagline || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="e.g. Smooth, Balanced & Aromatic"
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Roast Level</label>
                  <select
                    value={editingProduct.roastLevel || 'Medium'}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, roastLevel: e.target.value as any })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                  >
                    <option value="Light">Light Roast</option>
                    <option value="Medium">Medium Roast</option>
                    <option value="Medium-Dark">Medium-Dark Roast</option>
                    <option value="Dark">Dark Roast</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed estate origin, tasting notes, brewing recommendation..."
                  className="w-full p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              {/* Product Images & Upload Manager */}
              <div className="space-y-3 pt-2">
                <label className="block text-gray-300 font-bold">Product Images &amp; Uploads *</label>

                {/* Upload & Add URL Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Input */}
                  <label className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#241D17] border border-dashed border-[#C89B3C]/50 hover:bg-[#2E251E] cursor-pointer transition-colors text-center text-xs text-[#C89B3C] font-bold">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Image File</span>
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
                              const current = editingProduct.images || [];
                              setEditingProduct({ ...editingProduct, images: [result, ...current] });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Add URL Field */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      id="new-img-url-input"
                      placeholder="Paste Image URL..."
                      className="flex-1 p-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-white text-xs focus:outline-none focus:border-[#C89B3C]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('new-img-url-input') as HTMLInputElement;
                        if (el && el.value.trim()) {
                          const current = editingProduct.images || [];
                          setEditingProduct({ ...editingProduct, images: [...current, el.value.trim()] });
                          el.value = '';
                        }
                      }}
                      className="px-3 py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-[#C89B3C] font-bold text-xs hover:bg-[#2E251E]"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {/* Preset Coffee Estate Images Quick Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Quick Presets (Click to Add):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Filter Powder', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Roasted Beans', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Fresh Cup Brew', url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Estate Harvest', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const current = editingProduct.images || [];
                          if (!current.includes(preset.url)) {
                            setEditingProduct({ ...editingProduct, images: [...current, preset.url] });
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#241D17] border border-[#3D3025] text-[10px] text-gray-300 font-bold hover:text-[#C89B3C] hover:border-[#C89B3C]/50"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Gallery Preview Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {(editingProduct.images || []).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl border overflow-hidden bg-[#241D17] h-24 ${
                        idx === 0 ? 'border-[#C89B3C] ring-2 ring-[#C89B3C]/30' : 'border-[#3D3025]'
                      }`}
                    >
                      <img src={imgUrl} alt={`Product preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#C89B3C] text-black font-extrabold text-[8px] uppercase">
                          Primary
                        </span>
                      )}

                      {/* Action buttons on hover */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1 transition-opacity">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = [...(editingProduct.images || [])];
                              const [target] = imgs.splice(idx, 1);
                              if (target) imgs.unshift(target);
                              setEditingProduct({ ...editingProduct, images: imgs });
                            }}
                            className="px-1.5 py-1 rounded bg-[#C89B3C] text-black font-bold text-[9px]"
                            title="Set as Primary Image"
                          >
                            Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const imgs = (editingProduct.images || []).filter((_, i) => i !== idx);
                            setEditingProduct({ ...editingProduct, images: imgs });
                          }}
                          className="p-1 rounded bg-red-500 text-white font-bold text-[9px]"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 py-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.active ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.checked })}
                    className="rounded bg-[#241D17] border-[#3D3025] text-[#C89B3C] focus:ring-0"
                  />
                  <span className="text-white font-bold">Active in Store</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded bg-[#241D17] border-[#3D3025] text-[#C89B3C] focus:ring-0"
                  />
                  <span className="text-white font-bold">Featured Product</span>
                </label>
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
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Archive Product Dialog with Soft vs Permanent Delete Options */}
      {deleteDialogProduct && (
        <DeleteProductDialog
          isOpen={Boolean(deleteDialogProduct)}
          product={deleteDialogProduct}
          onClose={() => setDeleteDialogProduct(null)}
          onSoftDelete={handleSoftDelete}
          onHardDelete={handlePermanentDelete}
        />
      )}

      {/* Reusable "Are You Sure?" Action Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          {...confirmDialog}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </AdminLayout>
  );
}
