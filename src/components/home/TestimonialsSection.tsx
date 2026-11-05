import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp, Sparkles } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  coffeeChoice: string;
  category: 'filter' | 'espresso' | 'locals';
  rating: number;
  quote: string;
  details: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Col. K. M. Somanna (Retd.)',
    role: 'Coorg Estate Native',
    location: 'Madikeri, Coorg',
    coffeeChoice: 'Coorg Mist Blend (Filter Grind)',
    category: 'locals',
    rating: 5,
    quote: 'Reminds me of our family estate in Madikeri.',
    details:
      'Having lived across India, finding true Coorg estate coffee was rare. This blend delivers that authentic thick decoction, zero artificial bitterness, and rich chocolate aroma.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '2',
    name: 'Sunita Rao',
    role: 'Home Barista & Architect',
    location: 'Indiranagar, Bangalore',
    coffeeChoice: '100% Plantation Arabica',
    category: 'filter',
    rating: 5,
    quote: 'The smoothest South Indian filter coffee I have ever brewed.',
    details:
      'Every morning starts with Coorg Coffee. The grind size is precise for traditional brass filters. It leaves a delicate citrus finish with wild honey sweetness.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '3',
    name: 'Dr. Ananya Hegde',
    role: 'Physician & Coffee Aficionado',
    location: 'Gokulam, Mysore',
    coffeeChoice: 'Robusta Bold Roast',
    category: 'espresso',
    rating: 5,
    quote: 'Incredible crema and body for milk brews.',
    details:
      'High-grade Robusta grown under shade trees makes all the difference. The crema is rich, dense, and full-bodied. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '4',
    name: 'Rohan Deshmukh',
    role: 'Tech Lead & Espresso Enthusiast',
    location: 'Bandra, Mumbai',
    coffeeChoice: 'Coorg Dark Roast Espresso',
    category: 'espresso',
    rating: 5,
    quote: 'Unbeatable freshness & aroma lock pouch.',
    details:
      'The multi-layer valve pouch keeps the roasted beans incredibly fresh. Dark cocoa and subtle cinnamon notes shine in every shot.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'filter' | 'espresso' | 'locals'>('all');
  const [likes, setLikes] = useState<Record<string, number>>({ '1': 48, '2': 39, '3': 52, '4': 27 });

  const filtered = activeCategory === 'all'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.category === activeCategory);

  const handleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-background border-b border-border transition-colors relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C89B3C]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
            <span className="eyebrow">ESTATE TESTIMONIALS</span>
            <Sparkles className="w-4 h-4 text-[#C89B3C]" />
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl tracking-tight text-foreground uppercase leading-snug">
            COFFEE LOVERS <span className="shimmer-gold">SPEAK</span>
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Hear from coffee connoisseurs, filter traditionalists, and Coorg natives who start their daily ritual with our estate roast.
          </p>
          <div className="w-16 sm:w-24 h-0.5 mx-auto bg-[#C89B3C]" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: 'All Testimonials' },
            { id: 'filter', label: 'South Indian Filter' },
            { id: 'espresso', label: 'Espresso & Bold' },
            { id: 'locals', label: 'Coorg Natives' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all min-h-[40px] sm:min-h-[44px] ${
                activeCategory === tab.id
                  ? 'bg-[#C89B3C] text-black shadow-lg scale-105'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl sm:rounded-3xl bg-card border border-border p-5 sm:p-8 shadow-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C89B3C] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Quote Icon & Rating */}
                <div className="flex items-center justify-between">
                  <Quote className="w-10 h-10 text-[#C89B3C]/30 group-hover:text-[#C89B3C] transition-colors" />
                  <div className="flex items-center space-x-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>

                {/* Quote & Description */}
                <h3 className="font-display text-xl sm:text-2xl tracking-wide text-foreground group-hover:text-[#C89B3C] transition-colors">
                  "{item.quote}"
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.details}
                </p>
              </div>

              {/* Bottom Customer Info */}
              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C89B3C]/40 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-foreground">{item.name}</span>
                      <span title="Verified Customer">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground block">{item.location}</span>
                    <span className="text-[10px] font-semibold text-[#C89B3C] block uppercase tracking-wider mt-0.5">
                      {item.coffeeChoice}
                    </span>
                  </div>
                </div>

                {/* Helpful / Like Button */}
                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>{likes[item.id] || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
