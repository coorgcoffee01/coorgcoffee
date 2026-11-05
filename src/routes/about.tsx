import { createFileRoute, Link } from '@tanstack/react-router';
import { Mountain, Coffee, Sun, ShieldCheck } from 'lucide-react';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <img
            src="/coorg-logo-circle.png"
            alt="Coorg Coffee Emblem"
            className="w-20 h-20 rounded-full border-2 border-[#C89B3C] shadow-xl shadow-[#C89B3C]/20 bg-white p-1 mx-auto"
          />
          <div>
            <span className="eyebrow">OUR HERITAGE</span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
              FROM THE LAND OF MIST &amp; HONEY
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-2">
              Discover the legacy behind Coorg Coffee — grown under natural forest canopy in Madikeri, Karnataka.
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border aspect-video">
          <img
            src="/coorg-estate-hills.jpg"
            alt="Coorg Coffee Estate Hills"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 flex flex-col justify-end">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-widest">
              MADIKERI, COORG • EST. GENERATIONAL ESTATE
            </span>
            <h2 className="text-white font-serif text-2xl md:text-3xl italic mt-1">
              "We grow coffee the way nature intended — slow-matured under shade."
            </h2>
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-4 p-6 rounded-2xl bg-card border border-border">
            <Mountain className="w-8 h-8 text-[#C89B3C]" />
            <h3 className="font-display text-2xl text-foreground">HIGH ELEVATION SHADE GROWING</h3>
            <p>
              Located at an altitude of 4,000 feet above sea level in the Western Ghats, our coffee cherries ripen slowly over 9 months. This extended maturation allows beans to absorb rich soil minerals, producing deep cocoa undertones and low acidity.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-card border border-border">
            <Coffee className="w-8 h-8 text-[#2D5A27] dark:text-[#4ade80]" />
            <h3 className="font-display text-2xl text-foreground">HANDPICKED &amp; SOLAR DRIED</h3>
            <p>
              Only fully ripe crimson red cherries are hand-harvested by our local estate families. Washed in fresh mountain spring water and sun-dried on open patio tables before being small-batch drum roasted.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-4">
          <h3 className="font-display text-3xl text-foreground">EXPERIENCE COORG IN EVERY CUP</h3>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Order your valve-sealed pouch today. Shipped direct from our estate packaging facility.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-4 rounded-full bg-[#C89B3C] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#b08732] shadow-lg"
          >
            SHOP FRESH HARVEST
          </Link>
        </div>
      </div>
    </div>
  );
}
