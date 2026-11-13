import { createFileRoute } from '@tanstack/react-router';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/home/TrustStrip';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CoffeeFaqSection } from '../components/home/CoffeeFaqSection';
import { Link } from '@tanstack/react-router';
import { Coffee, ArrowRight, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors overflow-x-hidden">
      {/* Animated Hero Section with Bolder Title */}
      <HeroSection />

      {/* Trust Strip */}
      <TrustStrip />

      {/* Featured Coffee & Chocolate Collection */}
      <FeaturedCollection />

      {/* Artisanal Chocolates Feature Banner */}
      <section className="py-12 sm:py-16 px-4 md:px-8 bg-gradient-to-r from-[#1C1612] via-[#2A1F18] to-[#1C1612] text-white border-y border-[#C89B3C]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-[11px] font-black uppercase tracking-widest">
              <span>✨ NEW ESTATE RELEASE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              HANDCRAFTED COORG <span className="text-[#C89B3C]">ARTISANAL CHOCOLATES</span>
            </h2>
            <p className="text-sm sm:text-base text-[#D8C7B2] leading-relaxed">
              From creamy roasted milk cashews and Madagascan-style vanilla layers to tropical golden mango, bold dark chocolates, crispy cereal pearls, and sugar-free treats. Handcrafted in micro-batches with love from Madikeri estates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/shop"
              search={{ category: 'cat-chocolates' }}
              className="px-8 py-4 rounded-full bg-[#C89B3C] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#b08732] active:scale-95 transition-all shadow-xl shadow-[#C89B3C]/20 flex items-center gap-2"
            >
              <span>EXPLORE ALL 9 CHOCOLATES 🍫</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Estate Difference */}
      <WhyChooseUs />

      {/* Coffee Lovers Speak (Testimonials Section) */}
      <TestimonialsSection />

      {/* SEO Frequently Asked Questions Knowledge Base */}
      <CoffeeFaqSection />

      {/* Brand Heritage Story Banner */}
      <section className="py-20 px-4 md:px-8 bg-card border-b border-border transition-colors relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C89B3C]" />
              <span className="eyebrow">HERITAGE &amp; ORIGIN</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-foreground">
              SOURCED FROM THE LAND OF <span className="shimmer-gold">MIST &amp; HONEY</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Nestled at 4,000 feet in the Western Ghats of Karnataka, Coorg produces some of the finest shade-grown Arabicas and Robustas in Asia. Handpicked by local estate artisans, solar-dried on patio floors, and roasted in small batches to preserve natural essential oils.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 rounded-full bg-[#C89B3C] text-black font-black text-xs uppercase tracking-widest hover:bg-[#b08732] transition-all shadow-lg hover:-translate-y-0.5"
              >
                <span>READ OUR ESTATE STORY</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C89B3C]/40 aspect-video sm:aspect-[4/3] group">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
              alt="Coorg Estate Coffee Beans Roasting"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-8 flex flex-col justify-end">
              <div className="flex items-center space-x-2 text-[#C89B3C] text-xs font-black uppercase tracking-widest mb-1">
                <Coffee className="w-4 h-4" />
                <span>ESTATE HARVEST 2026</span>
              </div>
              <p className="text-white text-xl font-serif italic">
                "Pure estate coffee untouched by artificial flavorings."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
