import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ShoppingBag, Sparkles, CheckCircle2, Truck, Coffee } from 'lucide-react';
import { getProducts } from '../../lib/services/store-service';
import { useCart } from '../../context/CartContext';
import { Product } from '../../lib/types';
import { IS_TEST_PRICE_MODE } from '../../lib/data/mock-data';

interface CategoryShowcaseMeta {
  id: string;
  name: string;
  shortName: string;
  roastTag: string;
  countBadge: string;
  startingPrice: number;
  image: string;
  description: string;
  highlights: string[];
  deliveryPerk: string;
  accentClass: {
    badge: string;
    button: string;
    tag: string;
  };
}

const CATEGORY_SHOWCASE: CategoryShowcaseMeta[] = [
  {
    id: 'cat-beans',
    name: 'AA Grade Beans',
    shortName: 'AA Grade Beans (3)',
    roastTag: 'Medium & Dark Roast • Whole Beans',
    countBadge: '3 Varieties',
    startingPrice: 599,
    image: '/products/blend-roasted-beans.jpg?v=5',
    description:
      'Single-origin Arabica, high-elevation Robusta, and our 80:20 master blend. Cultivated at 4,000+ ft under natural shade canopy in Coorg hills.',
    highlights: [
      'Available in both Medium Roast & Dark Roast profiles',
      'Whole beans preserving volatile aromatics and natural sweetness',
      'Pure single-origin shade-grown high-elevation beans',
    ],
    accentClass: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      button: 'bg-[#D97706] text-white hover:bg-[#b45309]',
      tag: 'border-amber-500/30 text-amber-600 dark:text-amber-400',
    },
  },
  {
    id: 'cat-powder',
    name: '100% Coffee Powder',
    shortName: '100% Coffee Powder (2)',
    roastTag: 'Pure Ground Coffee • Zero Chicory',
    countBadge: '2 Varieties',
    startingPrice: 599,
    image: '/products/arabica-coffee-powder.jpg?v=4',
    description:
      '100% pure Arabica and bold Robusta freshly ground to perfection. Zero chicory, zero fillers, and zero adulteration for pure coffee purists.',
    highlights: [
      '100% pure unblended coffee with zero chicory',
      'Versatile grind for pour-over, Chemex, French press & drip',
      'Micro-batch roasted for optimum aroma extraction',
    ],
    deliveryPerk: 'Pure Single-Origin',
    accentClass: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      button: 'bg-[#1C2A1B] text-white hover:bg-[#263B25] dark:bg-emerald-700 dark:hover:bg-emerald-600',
      tag: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    },
  },
  {
    id: 'cat-filter',
    name: 'Filter Coffee Powder',
    shortName: 'Filter Coffee Powder (5)',
    roastTag: '80% Coffee 20% Chicory & Specialty',
    countBadge: '5 Varieties',
    startingPrice: 375,
    image: '/products/arabica-filter-coffee.jpg?v=5',
    description:
      'Authentic South Indian degree filter coffee slow-roasted with French chicory, alongside specialty grinds for espresso machines & Bialetti Moka pots.',
    highlights: [
      'Authentic 80:20 degree filter decoction blends',
      'Fine espresso machine & stovetop moka pot grinds',
      'FREE Delivery on all 1kg filter coffee packs',
    ],
    deliveryPerk: '1kg Packs FREE Delivery',
    accentClass: {
      badge: 'bg-[#C89B3C]/10 text-[#C89B3C] border-[#C89B3C]/30',
      button: 'bg-[#C89B3C] text-black hover:bg-[#b08732]',
      tag: 'border-[#C89B3C]/30 text-[#C89B3C]',
    },
  },
  {
    id: 'cat-chocolates',
    name: 'Artisanal Chocolates',
    shortName: 'Artisanal Chocolates (9)',
    roastTag: 'Handcrafted in Coorg • 9 Varieties',
    countBadge: '9 Varieties',
    startingPrice: 350,
    image: '/products/chocolates/milk-cashew-card.jpeg',
    description:
      'Artisanal handcrafted luxury chocolates from the hills of Coorg. Creamy milk cashews, vanilla layers, mango white chocolate, bold dark cashews, crispy balls, and sugar-free treats.',
    highlights: [
      'Loaded with crunchy whole roasted cashews & fruits',
      'Zero added sugar & crispy malted ball options',
      'Direct from Coorg estate chocolate artisans',
    ],
    deliveryPerk: '250g Freshness Sealed Tubs',
    accentClass: {
      badge: 'bg-amber-600/10 text-amber-600 dark:text-[#C89B3C] border-amber-600/30',
      button: 'bg-[#C89B3C] text-black hover:bg-[#b08732]',
      tag: 'border-[#C89B3C]/30 text-[#C89B3C]',
    },
  },
];

export const FeaturedCollection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [allProducts, setAllProducts] = useState(() => getProducts().filter((p) => p.active));
  const { addItem } = useCart();

  // Real-time synchronization with inventory & admin updates
  React.useEffect(() => {
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

  // Get products for each category
  const productsByCat: Record<string, Product[]> = {
    'cat-beans': allProducts.filter((p) => p.categoryId === 'cat-beans'),
    'cat-powder': allProducts.filter((p) => p.categoryId === 'cat-powder'),
    'cat-filter': allProducts.filter((p) => p.categoryId === 'cat-filter'),
    'cat-chocolates': allProducts.filter((p) => p.categoryId === 'cat-chocolates'),
  };

  return (
    <section className="py-12 sm:py-20 md:py-28 px-4 md:px-8 bg-background border-b border-border transition-colors relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C89B3C]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-[#C89B3C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTATE HARVEST CATEGORIES</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground uppercase leading-tight">
            EXPLORE BY <span className="shimmer-gold">COFFEE CATEGORY</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Three artisanal collections crafted from the high-elevation slopes of Coorg. Select your preferred style: whole beans, pure single-origin powders, or heritage filter kaapi.
          </p>

          <div className="w-20 sm:w-28 h-0.5 mx-auto bg-[#C89B3C]" />
        </div>

        {/* Category Filter Pills (Zero Emojis, Clean & Responsive) */}
        <div className="flex items-center sm:justify-center overflow-x-auto no-scrollbar py-2 px-2 sm:px-0 gap-2.5 max-w-4xl mx-auto scroll-smooth snap-x">
          <button
            onClick={() => setActiveTab('all')}
            className={`shrink-0 snap-center px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 min-h-[44px] flex items-center space-x-2 active:scale-95 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#C89B3C] text-black shadow-[0_4px_20px_rgba(200,155,60,0.4)] scale-105'
                : 'bg-card border border-border text-foreground hover:bg-muted active:bg-muted/80'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black transition-colors ${
                activeTab === 'all' ? 'bg-black/20 text-black' : 'bg-muted text-muted-foreground'
              }`}
            >
              10 Roasts
            </span>
          </button>

          {CATEGORY_SHOWCASE.map((cat) => {
            const isSelected = activeTab === cat.id;
            const itemsCount = productsByCat[cat.id]?.length || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`shrink-0 snap-center px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 min-h-[44px] flex items-center space-x-2 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#C89B3C] text-black shadow-[0_4px_20px_rgba(200,155,60,0.4)] scale-105'
                    : 'bg-card border border-border text-foreground hover:bg-muted active:bg-muted/80'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black transition-colors ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {itemsCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* DEFAULT HOME VIEW: The 3 Original Showcase Category Cards (Preserving Home Page Layout) */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {CATEGORY_SHOWCASE.map((cat, idx) => {
              const catProducts = productsByCat[cat.id] || [];

              return (
                <div
                  key={cat.id}
                  className="group relative rounded-3xl bg-card border border-border overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:border-[#C89B3C]/60 hover:-translate-y-2 active:scale-[0.99]"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  {/* Category Image Header with Smooth Scale & Steam */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                    {/* Subtle Steam Wisps Over Category Image */}
                    <div className="absolute top-4 right-4 flex space-x-1 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-1 h-4 rounded-full bg-[#C89B3C]/50 animate-steam-1" />
                      <div className="w-1.5 h-6 rounded-full bg-[#C89B3C]/70 animate-steam-2" />
                      <div className="w-1 h-5 rounded-full bg-[#C89B3C]/50 animate-steam-3" />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md bg-background/90 animate-float-gentle ${cat.accentClass.badge}`}
                      >
                        {cat.countBadge}
                      </span>
                    </div>

                    {/* Bottom Image Overlay Text */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white pointer-events-none">
                      <div className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider mb-0.5">
                        <span>{cat.roastTag}</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white drop-shadow-md group-hover:text-[#F3D382] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Category Body & Product List */}
                  <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {cat.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-1.5 text-xs text-foreground font-medium">
                        {cat.highlights.map((h, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C89B3C] shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Included Roasts Mini-Shelf with Touch-Active Feedback */}
                      <div className="space-y-2 pt-2 border-t border-border/80">
                        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center justify-between">
                          <span>
                            {cat.id === 'cat-chocolates' ? 'INCLUDED VARIETIES' : 'INCLUDED ROASTS'} ({catProducts.length})
                          </span>
                          <span className="text-[#C89B3C] font-bold">FROM ₹{IS_TEST_PRICE_MODE ? 1 : cat.startingPrice}</span>
                        </div>

                        <div className="space-y-1.5">
                          {catProducts.map((p) => {
                            const allOOS = p.variants.every((v) => v.stock <= 0);
                            const minV = p.variants.find((v) => v.stock > 0) || p.variants[0];
                            return (
                              <Link
                                key={p.id}
                                to="/product/$slug"
                                params={{ slug: p.slug }}
                                className={`flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-background/80 hover:bg-[#C89B3C]/5 active:bg-[#C89B3C]/10 border border-border/60 hover:border-[#C89B3C]/50 active:scale-[0.98] transition-all group/item ${
                                  allOOS ? 'opacity-70' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-2 truncate pr-2">
                                  <span className="font-semibold text-foreground group-hover/item:text-[#C89B3C] transition-colors truncate">
                                    {p.name}
                                  </span>
                                  {allOOS && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white shrink-0">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1.5 shrink-0">
                                  <span className={`text-xs font-black ${allOOS ? 'text-red-500' : 'text-foreground'}`}>
                                    {allOOS ? 'Sold Out' : `₹${minV?.salePrice || minV?.price}`}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover/item:text-[#C89B3C] group-hover/item:translate-x-0.5 transition-all" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer CTA: Switches to category view with the horizontal card layout */}
                    <div className="pt-4 border-t border-border/80 space-y-2">
                      <button
                        onClick={() => setActiveTab(cat.id)}
                        className={`w-full py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 cursor-pointer ${cat.accentClass.button}`}
                      >
                        <span>EXPLORE {cat.name.toUpperCase()} ({catProducts.length})</span>
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WHEN CLICKED ON A CATEGORY: Show that Category with the Horizontal Cards Layout (Matching User Reference Image) */}
        {activeTab !== 'all' && (
          <div className="space-y-8">
            {CATEGORY_SHOWCASE.filter((c) => c.id === activeTab).map((cat) => {
              const catProducts = productsByCat[cat.id] || [];

              return (
                <div key={cat.id} className="space-y-6 sm:space-y-8">
                  {/* Category Banner (Zero Emojis) */}
                  <div className="relative rounded-3xl overflow-hidden bg-card border border-border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${cat.accentClass.badge}`}>
                          {cat.countBadge}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl sm:text-4xl uppercase text-foreground">
                        {cat.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('all')}
                        className="px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        ALL CATEGORIES
                      </button>
                      <Link
                        to="/shop"
                        search={{ category: cat.id }}
                        className={`shrink-0 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center space-x-2 transition-all shadow-md ${cat.accentClass.button}`}
                      >
                        <span>VIEW IN SHOP</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Horizontal Cards Layout (Reference Image Style: Details on Left, Photo on Right) */}
                  <div className="flex flex-col gap-4 sm:gap-6">
                    {catProducts.map((product) => {
                      const allOOS = product.variants.every((v) => v.stock <= 0);
                      const minVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
                      if (!minVariant) return null;

                      let buttonBg = 'bg-[#C89B3C] text-black hover:bg-[#b08732]';
                      if (product.accentColor === 'green') buttonBg = 'bg-[#1C2A1B] text-white hover:bg-[#263B25]';
                      else if (product.accentColor === 'amber') buttonBg = 'bg-[#D97706] text-white hover:bg-[#b45309]';
                      else if (product.accentColor === 'brown') buttonBg = 'bg-[#78350F] text-white hover:bg-[#451a03]';

                      return (
                        <div
                          key={product.id}
                          className={`group relative rounded-2xl sm:rounded-3xl bg-card border border-border/90 hover:border-[#C89B3C]/70 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row items-stretch justify-between min-h-[160px] sm:min-h-[190px] md:min-h-[210px] ${
                            allOOS ? 'opacity-85 ring-1 ring-red-500/20' : ''
                          }`}
                        >
                          {/* Left Side: Product Information */}
                          <div className="flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between z-10">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-[#C89B3C]/10 text-[#C89B3C] border-[#C89B3C]/20">
                                  {product.categoryName}
                                </span>
                                {allOOS && (
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white shadow-sm">
                                    Out of Stock
                                  </span>
                                )}
                              </div>

                              <div>
                                <Link to="/product/$slug" params={{ slug: product.slug }}>
                                  <h4 className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-foreground group-hover:text-[#C89B3C] transition-colors leading-tight">
                                    {product.name}
                                  </h4>
                                </Link>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-1 max-w-xl">
                                  "{product.tagline}" • {product.shortDescription || product.description}
                                </p>
                              </div>
                            </div>

                            {/* Bottom CTA & Pricing */}
                            <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-4">
                              <div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                                  allOOS ? 'text-red-500' : 'text-muted-foreground'
                                }`}>
                                  {allOOS ? 'Status' : 'From'}
                                </span>
                                <span className="text-lg sm:text-xl font-black text-foreground">
                                  {allOOS ? (
                                    <span className="text-red-500 text-base font-bold">Sold Out</span>
                                  ) : (
                                    `₹${minVariant.salePrice || minVariant.price}`
                                  )}
                                </span>
                                {!allOOS && (
                                  <span className="text-xs text-muted-foreground ml-1">/ {minVariant.label.split(' ')[0]}</span>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => !allOOS && addItem(product, minVariant)}
                                  disabled={allOOS}
                                  className={`p-2.5 rounded-full border border-border text-foreground transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center ${
                                    allOOS
                                      ? 'opacity-30 cursor-not-allowed bg-muted pointer-events-none'
                                      : 'hover:bg-muted cursor-pointer active:scale-95'
                                  }`}
                                  title={allOOS ? 'Out of Stock' : 'Add to Cart'}
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                </button>

                                <Link
                                  to="/product/$slug"
                                  params={{ slug: product.slug }}
                                  className={`inline-flex items-center px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all min-h-[40px] ${
                                    allOOS
                                      ? 'bg-red-950/80 text-red-300 border border-red-700/50 hover:bg-red-900/80'
                                      : buttonBg
                                  }`}
                                >
                                  <span>{allOOS ? 'OUT OF STOCK' : 'SELECT SIZE'}</span>
                                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Product Image (Flush on right, top, bottom as in Image 2) */}
                          <div className="w-5/12 sm:w-1/2 md:w-5/12 shrink-0 relative overflow-hidden bg-muted">
                            <Link to="/product/$slug" params={{ slug: product.slug }} className="block w-full h-full">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                                  allOOS ? 'grayscale-[35%] contrast-90' : ''
                                }`}
                              />
                              {allOOS && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-2 text-center">
                                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-lg">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-transparent to-transparent hidden sm:block pointer-events-none" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Global Shop Catalogue CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#1A120B] via-[#2A1E14] to-[#1A120B] border-2 border-[#C89B3C]/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-[#C89B3C] text-xs font-black uppercase tracking-widest">
              <Coffee className="w-4 h-4" />
              <span>DIRECT FROM SHADE-GROWN PLANTATIONS</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl uppercase text-white tracking-tight">
              LOOKING FOR OUR FULL HARVEST COLLECTION?
            </h3>

            <p className="text-sm text-neutral-300">
              Browse all 10 single-origin and blended roasts with customizable grind sizes, roast levels (Medium &amp; Dark), and bulk pack discounts.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-4 rounded-full bg-[#C89B3C] text-black font-black text-xs uppercase tracking-widest hover:bg-[#b08732] transition-all shadow-xl hover:-translate-y-0.5"
              >
                <span>EXPLORE ALL 10 ROASTS IN OUR SHOP</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
