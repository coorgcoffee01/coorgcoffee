import { useState, useEffect } from 'react';
import { createFileRoute, Link, useLocation } from '@tanstack/react-router';
import { Search, ShoppingBag, ArrowRight, Filter, Sparkles, Truck, Coffee } from 'lucide-react';
import { getProducts, getCategories } from '../lib/services/store-service';
import { useCart } from '../context/CartContext';
import { Product } from '../lib/types';

export const Route = createFileRoute('/shop')({
  component: ShopPage,
});

interface CategoryMeta {
  id: string;
  name: string;
  sectionTitle: string;
  badge: string;
  tagline: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'cat-beans': {
    id: 'cat-beans',
    name: 'AA Grade Beans (Medium & Dark Roast)',
    sectionTitle: 'AA Grade Beans (Medium & Dark Roast)',
    badge: '3 Varieties • Medium & Dark Roast',
    tagline: '100% shade-grown AA grade plantation whole beans cultivated at 4,000+ ft. Choose Medium or Dark roast profile.',
  },
  'cat-powder': {
    id: 'cat-powder',
    name: '100% Arabica & Robusta Coffee Powder',
    sectionTitle: '100% Arabica & Robusta Coffee Powder',
    badge: '2 Varieties • Zero Chicory',
    tagline: 'Pure single-origin Arabica & Robusta freshly ground powders with zero chicory and zero fillers.',
  },
  'cat-filter': {
    id: 'cat-filter',
    name: 'Filter Coffee Powder (80% Coffee 20% Chicory)',
    sectionTitle: 'Filter Coffee Powder (80% Coffee 20% Chicory)',
    badge: '5 Varieties • Heritage Blends & Grinds',
    tagline: 'Authentic South Indian degree filter coffee blends slow-roasted with French chicory, plus specialty espresso and moka pot grinds. FREE Delivery on 1kg packs!',
  },
};

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const minVariant = product.variants[0];
  if (!minVariant) return null;

  const allVariantsOutOfStock = product.variants.every((v) => v.stock <= 0);
  const someOutOfStock = product.variants.some((v) => v.stock <= 0) && !allVariantsOutOfStock;
  const inStockVariant = product.variants.find((v) => v.stock > 0);
  const activeVariant = inStockVariant || minVariant;

  let buttonBg = 'bg-[#C89B3C] text-black hover:bg-[#b08732]';
  if (product.accentColor === 'green') buttonBg = 'bg-[#2D5A27] text-white hover:bg-[#23481f]';
  else if (product.accentColor === 'amber') buttonBg = 'bg-[#D97706] text-white hover:bg-[#b45309]';
  else if (product.accentColor === 'brown') buttonBg = 'bg-[#78350F] text-white hover:bg-[#451a03]';


  return (
    <div className={`group rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
      allVariantsOutOfStock ? 'opacity-85 ring-1 ring-red-500/20' : ''
    }`}>
      <div className="relative w-full aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            allVariantsOutOfStock ? 'grayscale-[35%] contrast-90' : ''
          }`}
        />

        {/* Sold Out Full Overlay */}
        {allVariantsOutOfStock && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-10 text-center">
            <span className="px-3.5 py-1.5 rounded-full bg-red-600 text-white font-black text-xs tracking-widest uppercase shadow-xl border border-red-400 animate-pulse">
              OUT OF STOCK
            </span>
            <span className="text-[10px] text-white/90 font-semibold mt-1.5">
              Sold Out • Fresh Batch Roasting
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[#C89B3C] shadow-sm">
            {product.categoryName}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#12100E]/85 text-white backdrop-blur-sm border border-white/10 w-fit">
            {product.roastOptions && product.roastOptions.length > 1
              ? 'Medium & Dark Roast'
              : `${product.roastLevel} Roast`}
          </span>
          {someOutOfStock && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/90 text-black shadow-sm">
              Limited Sizes
            </span>
          )}
        </div>


      </div>

      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            <h3 className="font-display text-xl sm:text-2xl tracking-wide text-foreground group-hover:text-[#C89B3C] transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider line-clamp-1">
            "{product.tagline}"
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.shortDescription || product.description}
          </p>
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.badges.slice(0, 2).map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
          <div>
            <span
              className={`text-[10px] uppercase tracking-wider block font-semibold ${
                allVariantsOutOfStock ? 'text-red-500 font-bold' : 'text-muted-foreground'
              }`}
            >
              {allVariantsOutOfStock ? 'STATUS' : 'FROM'}
            </span>
            <span className="text-xl font-extrabold text-foreground">
              {allVariantsOutOfStock ? (
                <span className="text-red-500 text-base font-bold">Sold Out</span>
              ) : (
                `₹${activeVariant.salePrice || activeVariant.price}`
              )}
            </span>
            {!allVariantsOutOfStock && (
              <span className="text-xs text-muted-foreground font-medium"> / {activeVariant.label}</span>
            )}
            <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
              {allVariantsOutOfStock ? (
                <span className="text-red-400">Available on next roast</span>
              ) : activeVariant.deliveryFee === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE Delivery</span>
              ) : (
                <span>+₹{activeVariant.deliveryFee} delivery • Free &gt; 5kg</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => !allVariantsOutOfStock && addItem(product, activeVariant)}
              disabled={allVariantsOutOfStock}
              className={`p-3 rounded-full border border-border text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                allVariantsOutOfStock
                  ? 'opacity-30 cursor-not-allowed bg-muted pointer-events-none'
                  : 'hover:bg-muted cursor-pointer'
              }`}
              title={allVariantsOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className={`inline-flex items-center px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] ${
                allVariantsOutOfStock
                  ? 'bg-red-950/80 text-red-300 border border-red-700/50 hover:bg-red-900/80'
                  : buttonBg
              }`}
            >
              <span>{allVariantsOutOfStock ? 'OUT OF STOCK' : 'SELECT SIZE'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopPage() {
  const categories = getCategories();
  const location = useLocation();

  const getInitialCategory = () => {
    const searchObj = (location.search || {}) as Record<string, string | undefined>;
    let rawCat = searchObj['category'];
    if (!rawCat && typeof window !== 'undefined') {
      rawCat = new URLSearchParams(window.location.search).get('category') || undefined;
    }
    if (!rawCat) return 'cat-all';
    if (rawCat === 'cat-beans' || rawCat === 'beans') return 'cat-beans';
    if (rawCat === 'cat-powder' || rawCat === 'powder') return 'cat-powder';
    if (rawCat === 'cat-filter' || rawCat === 'filter' || rawCat === 'filter-coffee') return 'cat-filter';
    return rawCat;
  };

  const getInitialQuery = () => {
    const searchObj = (location.search || {}) as Record<string, string | undefined>;
    if (searchObj['q']) return searchObj['q'];
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  };

  const [selectedCat, setSelectedCat] = useState(getInitialCategory);
  const [sortBy, setSortBy] = useState<'curated' | 'popularity' | 'price-asc' | 'price-desc' | 'newest'>('curated');
  const [searchQuery, setSearchQuery] = useState(getInitialQuery);
  const [allProducts, setAllProducts] = useState(() => getProducts().filter((p) => p.active));

  useEffect(() => {
    const nextCat = getInitialCategory();
    if (nextCat && nextCat !== 'cat-all') {
      setSelectedCat(nextCat);
    }
    const nextQ = getInitialQuery();
    if (nextQ) {
      setSearchQuery(nextQ);
    }
  }, [location.search]);

  // Real-time synchronization with inventory & admin updates
  useEffect(() => {
    const handleStoreUpdate = () => {
      setAllProducts(getProducts().filter((p) => p.active));
    };
    window.addEventListener('coorg_store_updated', handleStoreUpdate);
    window.addEventListener('storage', handleStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', handleStoreUpdate);
      window.removeEventListener('storage', handleStoreUpdate);
    };
  }, []);

  // Filter products by category and search
  let filtered = allProducts;
  if (selectedCat !== 'cat-all') {
    filtered = filtered.filter((p) => p.categoryId === selectedCat);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  // Sort products
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'curated') return 0; // Maintain original curated catalogue order (1 to 10)
    const priceA = a.variants[0]?.salePrice || a.variants[0]?.price || 0;
    const priceB = b.variants[0]?.salePrice || b.variants[0]?.price || 0;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.ratingCount - a.ratingCount;
  });

  // Calculate product counts per category (Exact: Beans = 3, Powder = 2, Filter = 5)
  const categoryCounts: Record<string, number> = {
    'cat-all': allProducts.length,
    'cat-beans': allProducts.filter((p) => p.categoryId === 'cat-beans').length,
    'cat-powder': allProducts.filter((p) => p.categoryId === 'cat-powder').length,
    'cat-filter': allProducts.filter((p) => p.categoryId === 'cat-filter').length,
  };

  // Grouped sections for the "All Coffees" curated view
  const activeCategories = ['cat-beans', 'cat-powder', 'cat-filter'];

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-[#C89B3C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTATE HARVEST CATALOGUE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-foreground">
            OUR FRESHLY ROASTED COFFEES
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Organized into 3 curated sections: AA Grade Beans (Medium &amp; Dark Roast), 100% Pure Coffee Powder, and Filter Coffee Powder (80:20 &amp; Specialty Grinds). Freshly roasted and valve packed in Coorg.
          </p>
        </div>

        {/* Categories Bar & Search Filter */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {categories.map((cat) => {
                const isSelected = selectedCat === cat.id;
                const count = categoryCounts[cat.id] ?? 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all min-h-[42px] flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-[#C89B3C] text-black shadow-md scale-105'
                        : 'bg-background border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        isSelected ? 'bg-black/20 text-black' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Sort controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search coffees, roast, grinds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-full pl-9 pr-4 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#C89B3C]"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Filter className="w-4 h-4 text-[#C89B3C]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-background border border-border rounded-full px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:border-[#C89B3C]"
                >
                  <option value="curated">Curated Order</option>
                  <option value="popularity">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Display Sections */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl space-y-4 max-w-md mx-auto">
            <Coffee className="w-12 h-12 text-[#C89B3C] mx-auto opacity-70" />
            <h3 className="font-display text-2xl text-foreground">NO COFFEES FOUND</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search terms or clearing category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCat('cat-all');
                setSearchQuery('');
              }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : selectedCat === 'cat-all' && !searchQuery.trim() && sortBy === 'curated' ? (
          // Grouped Categorized View
          <div className="space-y-16">
            {activeCategories.map((catId) => {
              const meta = CATEGORY_META[catId];
              const sectionProducts = allProducts.filter((p) => p.categoryId === catId);
              if (!meta || sectionProducts.length === 0) return null;

              return (
                <section key={catId} className="space-y-6 scroll-mt-24" id={catId}>
                  {/* Category Header Banner */}
                  <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C89B3C] bg-[#C89B3C]/10 px-2.5 py-0.5 rounded-full border border-[#C89B3C]/20">
                          {meta.badge}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground pt-1">
                        {meta.sectionTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                        {meta.tagline}
                      </p>
                    </div>

                    <div className="shrink-0 text-xs font-bold text-muted-foreground bg-background px-4 py-2 rounded-xl border border-border">
                      {sectionProducts.length} Products
                    </div>
                  </div>

                  {/* Products Grid for Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Filtered or Sorted Grid View
          <div className="space-y-6">
            {selectedCat !== 'cat-all' && CATEGORY_META[selectedCat] && (
              <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-1 shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C89B3C] bg-[#C89B3C]/10 px-2.5 py-0.5 rounded-full border border-[#C89B3C]/20">
                    {CATEGORY_META[selectedCat].badge}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground pt-1">
                  {CATEGORY_META[selectedCat].sectionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {CATEGORY_META[selectedCat].tagline}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
