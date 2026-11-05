import React from 'react';
import { Mountain, Flame, Shield, HeartHandshake } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-10 sm:py-16 md:py-24 px-4 md:px-8 bg-card border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
          <span className="eyebrow">THE COORG DIFFERENCE</span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl tracking-tight text-foreground uppercase leading-snug">
            WHY CHOOSE COORG COFFEE?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Unlike mass commercial brands, every bean is cultivated under natural rainforest canopy in Karnataka's Western Ghats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border space-y-2.5 sm:space-y-3 text-left transition-colors flex sm:block items-center gap-4 sm:gap-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30 flex items-center justify-center shrink-0">
              <Mountain className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl tracking-wide text-foreground mt-1 sm:mt-2">SINGLE ORIGIN</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Sourced 100% from our generational family estate in Madikeri &amp; Virajpet, Coorg at 4,000 ft elevation.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border space-y-2.5 sm:space-y-3 text-left transition-colors flex sm:block items-center gap-4 sm:gap-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2D5A27]/10 text-[#2D5A27] dark:text-[#4ade80] border border-[#2D5A27]/30 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl tracking-wide text-foreground mt-1 sm:mt-2">FRESHLY ROASTED</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Roasted in micro-batches every week to preserve volatile aromatics and delivered fresh to your door.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border space-y-2.5 sm:space-y-3 text-left transition-colors flex sm:block items-center gap-4 sm:gap-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl tracking-wide text-foreground mt-1 sm:mt-2">NO COMPROMISE</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Zero artificial chicory, zero synthetic additives. Only pure, unadulterated coffee beans.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border space-y-2.5 sm:space-y-3 text-left transition-colors flex sm:block items-center gap-4 sm:gap-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#78350F]/10 text-[#78350F] dark:text-[#fcd34d] border border-[#78350F]/30 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl tracking-wide text-foreground mt-1 sm:mt-2">CRAFTED WITH PASSION</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Inherited roasting heritage passed down across generations for South Indian coffee connoisseurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
