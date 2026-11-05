import React, { useState } from 'react';
import { AlertTriangle, Trash2, Archive, X, Check, ShieldAlert, Package, RefreshCw } from 'lucide-react';
import { Product } from '../../lib/types';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  subtitle?: string | undefined;
  confirmLabel?: string | undefined;
  cancelLabel?: string | undefined;
  variant?: ('danger' | 'warning' | 'primary' | 'success') | undefined;
  icon?: ('alert' | 'trash' | 'archive' | 'package' | 'refresh') | undefined;
  onConfirm: () => void;
  onCancel?: (() => void) | undefined;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  subtitle,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  icon = 'alert',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  let btnStyle = 'bg-[#C89B3C] text-black hover:bg-[#D4A748]';
  let iconColor = 'text-[#C89B3C] bg-[#C89B3C]/10 border-[#C89B3C]/30';

  if (variant === 'danger') {
    btnStyle = 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30';
    iconColor = 'text-red-400 bg-red-500/10 border-red-500/30';
  } else if (variant === 'success') {
    btnStyle = 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30';
    iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (variant === 'warning') {
    btnStyle = 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30';
    iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => onCancel?.()}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A211B] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl border shrink-0 ${iconColor}`}>
            {icon === 'trash' && <Trash2 className="w-5 h-5" />}
            {icon === 'archive' && <Archive className="w-5 h-5" />}
            {icon === 'package' && <Package className="w-5 h-5" />}
            {icon === 'refresh' && <RefreshCw className="w-5 h-5" />}
            {icon === 'alert' && <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="space-y-1 pr-4">
            <h3 className="font-display text-lg sm:text-xl text-white font-bold tracking-wide">
              {title}
            </h3>
            {subtitle && <p className="text-[11px] font-bold text-[#C89B3C] uppercase tracking-wider">{subtitle}</p>}
          </div>
        </div>

        <div className="text-xs text-[#E8D9C5] leading-relaxed bg-[#241D17] border border-[#3D3025] p-3.5 rounded-xl">
          {message}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="px-4 py-2 rounded-xl bg-[#241D17] border border-[#3D3025] text-gray-300 font-bold text-xs hover:bg-[#2A211B] hover:text-white transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer ${btnStyle}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export interface DeleteProductDialogProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSoftDelete: (productId: string) => void;
  onHardDelete: (productId: string) => void;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  product,
  onClose,
  onSoftDelete,
  onHardDelete,
}) => {
  const [deleteMode, setDeleteMode] = useState<'soft' | 'hard'>('soft');

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    if (deleteMode === 'soft') {
      onSoftDelete(product.id);
    } else {
      onHardDelete(product.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#1C1612] border border-[#3D3025] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A211B] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5 border-b border-[#3D3025] pb-4">
          <div className="p-2.5 rounded-xl border text-red-400 bg-red-500/10 border-red-500/30 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl text-white font-bold tracking-wide">
              Delete Product Confirmation
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose how you wish to remove this product from the estate catalogue.
            </p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="p-3 bg-[#241D17] border border-[#3D3025] rounded-xl flex items-center space-x-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border border-[#3D3025] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-sm truncate">{product.name}</h4>
            <p className="text-[11px] text-[#C89B3C] font-semibold">{product.categoryName} • {product.roastLevel}</p>
            <p className="text-[10px] text-gray-400">{product.variants.length} variant(s) registered</p>
          </div>
        </div>

        {/* Deletion Mode Radio Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#B5A490] block">
            Select Deletion Method
          </label>

          {/* Option 1: Soft Delete (Archive) */}
          <div
            onClick={() => setDeleteMode('soft')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              deleteMode === 'soft'
                ? 'bg-amber-500/10 border-[#C89B3C] text-white shadow-md'
                : 'bg-[#241D17] border-[#3D3025] text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="deleteMode"
                checked={deleteMode === 'soft'}
                onChange={() => setDeleteMode('soft')}
                className="mt-0.5 text-[#C89B3C] focus:ring-[#C89B3C]"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Archive className="w-4 h-4 text-[#C89B3C]" />
                  <strong className="text-xs font-bold text-white">
                    Soft Delete / Move to Archive (Recommended)
                  </strong>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/30">
                    SAFE &amp; REVERSIBLE
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Hides this roast from the customer storefront immediately. It is safely placed in your
                  <strong className="text-white"> "Archived / Soft-Deleted"</strong> list and can be restored back to the shop with 1 click at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Option 2: Permanent Delete (Hard Delete) */}
          <div
            onClick={() => setDeleteMode('hard')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              deleteMode === 'hard'
                ? 'bg-red-500/10 border-red-500 text-white shadow-md'
                : 'bg-[#241D17] border-[#3D3025] text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="deleteMode"
                checked={deleteMode === 'hard'}
                onChange={() => setDeleteMode('hard')}
                className="mt-0.5 text-red-500 focus:ring-red-500"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <strong className="text-xs font-bold text-white">
                    Permanent Delete (Hard Delete)
                  </strong>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    IRREVERSIBLE
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Completely and permanently purges this product, all SKU variants, and pricing from the database. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#3D3025]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#241D17] border border-[#3D3025] text-gray-300 font-bold text-xs hover:bg-[#2A211B] hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer ${
              deleteMode === 'soft'
                ? 'bg-[#C89B3C] text-black hover:bg-[#D4A748]'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {deleteMode === 'soft' ? 'Archive Product' : 'Permanently Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
