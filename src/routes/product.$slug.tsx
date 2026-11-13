import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { Star, ShieldCheck, Truck, Plus, Minus, Heart, Share2, Check, CheckCircle, ArrowRight } from 'lucide-react';
import { getProductBySlug, getReviews, addReview } from '../lib/services/store-service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductVariant } from '../lib/types';

export const Route = createFileRoute('/product/$slug')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(() => getProductBySlug(slug));
  const [reviews, setReviews] = useState(() => {
    const p = getProductBySlug(slug);
    return p ? getReviews(p.id) : [];
  });

  // Real-time synchronization with store & inventory events
  useEffect(() => {
    const handleStoreUpdate = () => {
      const p = getProductBySlug(slug);
      setProduct(p);
      if (p) {
        setReviews(getReviews(p.id));
      }
    };
    window.addEventListener('coorg_store_updated', handleStoreUpdate);
    window.addEventListener('storage', handleStoreUpdate);
    return () => {
      window.removeEventListener('coorg_store_updated', handleStoreUpdate);
      window.removeEventListener('storage', handleStoreUpdate);
    };
  }, [slug]);

  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useAuth();

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="font-display text-4xl text-foreground">COFFEE NOT FOUND</h1>
          <p className="text-sm text-muted-foreground">
            The requested product slug does not exist in our estate inventory.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b08732]"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const firstVariant: ProductVariant = product.variants[0]!;

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedVariantId, setSelectedVariantId] = useState(firstVariant.variantId);
  const [selectedGrind, setSelectedGrind] = useState(
    product.grindOptions && product.grindOptions.length > 0 ? product.grindOptions[0] : ''
  );
  const [selectedRoast, setSelectedRoast] = useState(
    product.roastOptions && product.roastOptions.length > 0 ? product.roastOptions[0] : product.roastLevel
  );
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const selectedVariant: ProductVariant =
    product.variants.find((v) => v.variantId === selectedVariantId) || firstVariant;

  const allVariantsOutOfStock = product.variants.every((v) => v.stock <= 0);

  const inWishlist = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity, selectedGrind, selectedRoast);
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, quantity, selectedGrind, selectedRoast);
    navigate({ to: '/checkout' });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() && reviewComment.trim()) {
      addReview({
        productId: product.id,
        productName: product.name,
        userName: reviewName.trim(),
        rating: reviewRating,
        title: `${reviewRating} Star Estate Review`,
        comment: reviewComment.trim(),
        verifiedPurchase: true,
        status: 'pending',
      });
      setReviewSubmitted(true);
      setReviewName('');
      setReviewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
          <Link to="/" className="hover:text-[#C89B3C]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C89B3C]">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover ${
                  allVariantsOutOfStock ? 'grayscale-[30%] contrast-90' : ''
                }`}
              />

              {/* Sold Out Full Overlay */}
              {allVariantsOutOfStock && (
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                  <span className="px-5 py-2 rounded-full bg-red-600 text-white font-black text-sm tracking-widest uppercase shadow-2xl border-2 border-red-400 animate-pulse">
                    OUT OF STOCK
                  </span>
                  <span className="text-xs text-white/90 font-semibold mt-2">
                    Batch Sold Out • Fresh Harvest Roasting Soon
                  </span>
                </div>
              )}

              <div className="absolute top-4 left-4 z-10">
                <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[#C89B3C]">
                  {product.categoryName}
                </span>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === imgUrl ? 'border-[#C89B3C] scale-95 shadow-md' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2 border-b border-border pb-6">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground">
                {product.name}
              </h1>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#C89B3C]">
                {product.tagline}
              </p>

              <div className="flex items-center space-x-3 pt-2 text-sm">
                <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider px-3 py-1 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/20">
                  {product.categoryId === 'cat-chocolates' ? 'Artisanal Coorg Chocolate' : `${product.roastLevel} Roast`}
                </span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-[#E8D9C5]/80 font-medium">100% Estate Harvest</span>
              </div>
            </div>

            {/* Out of Stock Notice Banner */}
            {allVariantsOutOfStock ? (
              <div className="p-4 rounded-2xl bg-red-950/40 border-2 border-red-500/50 flex items-start space-x-3 text-red-200 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 mt-1.5 animate-ping" />
                <div>
                  <h4 className="font-extrabold text-sm text-red-400 uppercase tracking-wider">
                    CURRENTLY SOLD OUT (ALL SIZES)
                  </h4>
                  <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                    This estate roast is sold out across all pouch sizes. Our roaster in Coorg is currently roasting and packaging the next fresh batch.
                  </p>
                </div>
              </div>
            ) : selectedVariant.stock <= 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2 shadow-sm">
                <span className="text-base">⚠️</span>
                <span>
                  The selected <strong className="text-amber-400">{selectedVariant.label}</strong> size is out of stock. Please select an available pouch size below.
                </span>
              </div>
            ) : null}

            <div className="space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-foreground">
                  ₹{selectedVariant.salePrice || selectedVariant.price}
                </span>
                {selectedVariant.salePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{selectedVariant.price}
                  </span>
                )}
                <span className="text-xs text-muted-foreground font-medium">
                  (Incl. of all taxes)
                </span>
              </div>
              {selectedVariant.stock <= 0 && (
                <p className="text-xs text-red-500 font-bold">
                  Out of Stock
                </p>
              )}
            </div>

            {/* Delivery Charge Info Badge */}
            <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#C89B3C]" />
                <span className="font-semibold text-foreground">
                  {selectedVariant.deliveryFee === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      FREE Pan-India Delivery on this {selectedVariant.label}
                    </span>
                  ) : (
                    <span>
                      Delivery: <strong className="text-foreground">₹{selectedVariant.deliveryFee}</strong>
                      <span className="text-muted-foreground ml-2 text-[11px]">• FREE on orders over 5kg</span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Variant / Bag Size Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                {product.categoryId === 'cat-chocolates' ? 'Select Pack Size / Quantity' : 'Select Bag Size / Quantity'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isSelected = v.variantId === selectedVariantId;
                  const isOutOfStock = v.stock <= 0;
                  return (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariantId(v.variantId)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all min-h-[64px] flex flex-col justify-between ${
                        isSelected
                          ? isOutOfStock
                            ? 'border-red-500 bg-red-500/10 text-foreground font-bold shadow-sm'
                            : 'border-[#C89B3C] bg-[#C89B3C]/10 text-foreground font-bold shadow-sm'
                          : isOutOfStock
                            ? 'border-red-500/40 bg-red-500/5 text-muted-foreground hover:border-red-500/60'
                            : 'border-border bg-card text-muted-foreground hover:border-foreground/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-extrabold text-foreground">{v.label}</span>
                        <span className="text-sm font-extrabold text-[#C89B3C]">
                          ₹{v.salePrice || v.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className="text-[11px] text-muted-foreground">
                          {v.deliveryFee === 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE Delivery</span>
                          ) : (
                            `+₹${v.deliveryFee} delivery`
                          )}
                        </span>
                        {isOutOfStock && (
                          <span className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roast Selection (for Whole Beans & specialty) */}
            {product.roastOptions && product.roastOptions.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  Select Roast Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.roastOptions.map((roast) => {
                    const isSelected = roast === selectedRoast;
                    return (
                      <button
                        key={roast}
                        onClick={() => setSelectedRoast(roast)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                          isSelected
                            ? 'bg-[#C89B3C] text-black shadow-md'
                            : 'bg-card border border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {roast}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grind Option Selection (for Coffee) */}
            {product.grindOptions && product.grindOptions.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  Select Grind Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.grindOptions.map((grind) => {
                    const isSelected = grind === selectedGrind;
                    return (
                      <button
                        key={grind}
                        onClick={() => setSelectedGrind(grind)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                          isSelected
                            ? 'bg-foreground text-background shadow-md'
                            : 'bg-card border border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {grind}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  QTY:
                </label>
                <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    disabled={selectedVariant.stock <= 0 || quantity >= selectedVariant.stock}
                    className="p-3 text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    inWishlist ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-border text-foreground hover:bg-muted'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center relative"
                  aria-label="Share product"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock <= 0}
                  className="w-full py-4 rounded-xl border-2 border-[#C89B3C] text-foreground font-bold text-sm uppercase tracking-widest hover:bg-[#C89B3C]/10 transition-all min-h-[52px] disabled:opacity-50 disabled:border-muted-foreground/30 disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  {selectedVariant.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedVariant.stock <= 0}
                  className="w-full py-4 rounded-xl bg-[#C89B3C] text-black font-extrabold text-sm uppercase tracking-widest hover:bg-[#b08732] transition-all shadow-lg min-h-[52px] flex items-center justify-center disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  <span>{selectedVariant.stock <= 0 ? 'CURRENTLY UNAVAILABLE' : 'BUY NOW'}</span>
                  {selectedVariant.stock > 0 && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </div>
            </div>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#C89B3C]/15 text-[#C89B3C] border border-[#C89B3C]/30"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-foreground font-semibold">
                <Truck className="w-4 h-4 text-[#C89B3C]" />
                <span>Pan-India Dispatch within 24 Hours</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
                <span>{product.categoryId === 'cat-chocolates' ? 'Freshness-Sealed Artisanal Tubs' : 'Packed in Freshness-Preserving Valve Pouches'}</span>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border">
              <div className="space-y-2">
                <h3 className="font-display text-xl text-foreground uppercase tracking-wide">
                  {product.categoryId === 'cat-chocolates' ? 'ABOUT THIS CHOCOLATE' : 'ABOUT THIS COFFEE'}
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Why You'll Love It */}
              {product.whyYoullLoveIt && product.whyYoullLoveIt.length > 0 && (
                <div className="space-y-3 p-4 rounded-xl bg-card border border-border">
                  <h4 className="font-display text-base text-foreground uppercase tracking-wider">WHY YOU'LL LOVE IT</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground font-medium">
                    {product.whyYoullLoveIt.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-[#C89B3C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best For */}
              {product.bestFor && product.bestFor.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-display text-sm text-foreground uppercase tracking-wider">
                    {product.categoryId === 'cat-chocolates' ? 'BEST ENJOYED FOR:' : 'BEST FOR BREWING:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.bestFor.map((bf, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold border border-border"
                      >
                        {bf}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow">ESTATE TESTIMONIALS</span>
              <h2 className="font-display text-3xl text-foreground uppercase">
                CUSTOMER REVIEWS ({reviews.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-6 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
                  Be the first to review this Coorg estate harvest.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl bg-card border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm">{rev.userName}</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="text-xs font-bold text-[#C89B3C]">{rev.title}</h4>}
                    <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border space-y-4">
              <h3 className="font-display text-xl text-foreground">WRITE A REVIEW</h3>
              {reviewSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold space-y-1">
                  <p className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Review Submitted!</span>
                  </p>
                  <p className="font-normal text-[#E8D9C5]/80">
                    Thank you! Your estate harvest review has been submitted to the admin moderation queue and will be published shortly after verification.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                    >
                      <option value={5}>5 Stars - Exceptional</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Good</option>
                      <option value={2}>2 Stars - Average</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with aroma, taste, and decoction quality..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#C89B3C] text-black font-bold uppercase tracking-wider hover:bg-[#b08732]"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
