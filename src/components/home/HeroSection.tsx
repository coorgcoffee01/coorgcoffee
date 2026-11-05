import React from 'react';
import { Link } from '@tanstack/react-router';
import { Leaf, Mountain, Coffee, Heart, ArrowRight, Play, Truck, ShieldCheck, Award, Trees } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full bg-background border-b border-border transition-colors">
      {/* Main Hero Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Features Column */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Top Cursive & Display Title */}
            <div className="space-y-1">
              <span className="font-script text-3xl sm:text-4xl md:text-5xl text-[#C89B3C] font-normal tracking-wide block">
                From the Land of Mist &amp; Honey
              </span>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase font-black leading-[0.9] text-foreground">
                COORG COFFEE
              </h1>
            </div>

            {/* Brand Subtitle & Description */}
            <div className="space-y-2">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#C89B3C]">
                AUTHENTIC SINGLE-ORIGIN ESTATE COFFEE
              </h2>
              <p className="text-xs sm:text-base text-muted-foreground leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
                Sourced from generational shade-grown estates in Coorg and crafted with care to bring you an unforgettable coffee experience.
              </p>
            </div>

            {/* 4 Circular Feature Icons */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 pt-2">
              <div className="flex flex-col items-center text-center space-y-1.5 group cursor-pointer">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-[#C89B3C]/50 bg-[#F4ECDC]/80 dark:bg-[#241D17]/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#C89B3C]" />
                </div>
                <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-foreground">
                  100% PURE
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1.5 group cursor-pointer">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-[#C89B3C]/50 bg-[#F4ECDC]/80 dark:bg-[#241D17]/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Mountain className="w-5 h-5 sm:w-6 sm:h-6 text-[#C89B3C]" />
                </div>
                <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-foreground">
                  PREMIUM ORIGIN
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1.5 group cursor-pointer">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-[#C89B3C]/50 bg-[#F4ECDC]/80 dark:bg-[#241D17]/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-[#C89B3C]" />
                </div>
                <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-foreground">
                  RICH AROMA
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1.5 group cursor-pointer">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-[#C89B3C]/50 bg-[#F4ECDC]/80 dark:bg-[#241D17]/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#C89B3C]" />
                </div>
                <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider text-foreground">
                  PERFECT TASTE
                </span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#1C2A1B] text-white font-extrabold text-xs uppercase tracking-widest hover:bg-[#263B25] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 min-h-[48px]"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-[#3D3025] bg-card text-foreground font-bold text-xs uppercase tracking-wider hover:bg-muted transition-all min-h-[48px]"
              >
                <Play className="w-3.5 h-3.5 mr-2 fill-current text-[#C89B3C]" />
                <span>OUR STORY</span>
              </Link>
            </div>
          </div>

          {/* Right Standalone Image Column (Not in background) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-xl rounded-3xl overflow-hidden border-2 border-[#C89B3C]/40 shadow-2xl bg-card">
              <picture>
                <source srcSet="/products/hero_section.webp" type="image/webp" />
                <source srcSet="/products/hero_section.jpg" type="image/jpeg" />
                <img
                  src="/products/hero_section.jpg"
                  alt="Authentic Coorg Coffee Display"
                  className="w-full h-auto object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-500"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>

        </div>
      </section>

      {/* Floating White Feature Bar Below Hero */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-[#FAF6F0] dark:bg-[#1C1612] border border-[#E5D7C5] dark:border-[#3D3025] rounded-2xl shadow-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#E5D7C5] dark:divide-[#3D3025]">
          {/* Feature 1 */}
          <div className="flex items-center space-x-3.5 pt-2 sm:pt-0 lg:px-2">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                PAN INDIA DELIVERY
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">Fast &amp; Reliable</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center space-x-3.5 pt-2 sm:pt-0 lg:px-4">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                SAFE &amp; SECURE PAYMENT
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">100% Secure Transactions</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center space-x-3.5 pt-2 sm:pt-0 lg:px-4">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                PREMIUM QUALITY
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">Quality No Compromise</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center space-x-3.5 pt-2 sm:pt-0 lg:px-4">
            <div className="w-10 h-10 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                SUSTAINABLY SOURCED
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium">From Coorg Hills</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
