import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchProducts } from '../../lib/services/store-service';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = searchProducts(query);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-black/70 backdrop-blur-md flex justify-center items-start">
      <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden transition-colors">
        <div className="p-4 sm:p-6 border-b border-border flex items-center gap-3">
          <Search className="w-6 h-6 text-[#C89B3C] shrink-0" />
          <input
            type="text"
            placeholder="Search Arabica, Robusta, Coorg Mist Blend..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base md:text-lg focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 space-y-3">
              <img
                src="/coorg-logo-circle.png"
                alt="Coorg Coffee"
                className="w-12 h-12 rounded-full border border-[#C89B3C] shadow-sm bg-white p-0.5 mx-auto"
              />
              <p className="text-sm text-muted-foreground">
                Search single-origin Arabica, Robusta, filter coffee, or whole beans...
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-foreground font-semibold">No matching coffees found</p>
              <p className="text-xs text-muted-foreground">
                Try searching for "Arabica", "Robusta", "Blend", or "Whole Beans"
              </p>
            </div>
          ) : (
            results.map((product) => {
              const minVariant = product.variants[0];
              if (!minVariant) return null;

              return (
                <Link
                  key={product.id}
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display text-lg text-foreground group-hover:text-[#C89B3C] transition-colors truncate">
                        {product.name}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C89B3C]/10 text-[#C89B3C]">
                        {product.categoryName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{product.tagline}</p>
                    <p className="text-xs font-bold text-foreground mt-1">
                      From ₹{minVariant.salePrice || minVariant.price} / {minVariant.label}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[#C89B3C] transition-colors shrink-0" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
