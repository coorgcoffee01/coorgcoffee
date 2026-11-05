import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Coffee } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const COORG_COFFEE_FAQS: FaqItem[] = [
  {
    question: 'What makes Coorg coffee unique and famous worldwide?',
    answer:
      'Coorg (Kodagu) is celebrated as the Coffee Capital of India. Grown at 3,500 to 4,500 feet altitude in the Western Ghats under natural shade canopy of silver oak and jackfruit trees, Coorg coffee cherries ripen slowly. This natural microclimate develops dense beans with mild acidity, thick body, and rich chocolate-nutty tasting notes unlike mass-commercial plantation coffees.',
  },
  {
    question: 'How do I brew authentic South Indian filter coffee using Coorg coffee powder?',
    answer:
      'Add 2 to 3 tablespoons of Coorg Filter Coffee powder to the upper compartment of a traditional stainless steel or brass filter. Gently press with the tamper disc without packing too tight, pour freshly boiled water, close the lid, and let it steep for 10 to 15 minutes. Combine the viscous decoction with hot frothed milk and sugar, poured back and forth between dabarah and tumbler for rich froth.',
  },
  {
    question: 'What is the difference between Coorg Arabica and Coorg Robusta?',
    answer:
      'Coorg Arabica offers a delicate, fragrant cup with citrus sweetness, winey notes, and smooth finish—perfect for pour-overs, French press, and black coffee. Coorg Robusta is world-famous for its punchy boldness, rich crema, higher caffeine concentration, and deep woody-cocoa flavor, making it the essential backbone for authentic South Indian filter coffee.',
  },
  {
    question: 'Are your coffee beans and powder freshly roasted in Coorg?',
    answer:
      'Yes. All our coffee is sourced directly from generational shade-grown estates in Madikeri and small-batch roasted to order. We never use pre-packaged warehouse stocks. Each pouch is sealed with a one-way aroma degassing valve to preserve natural estate oils.',
  },
  {
    question: 'Do you deliver Coorg coffee across all states in India?',
    answer:
      'Yes. We ship directly from our Madikeri estate fulfillment center to all 28 States and 8 Union Territories across India via express logistics (DTDC / Express air and surface), with real-time tracking from dispatch to your doorstep.',
  },
];

export const CoffeeFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-background border-b border-border transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#C89B3C]/15 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COORG COFFEE KNOWLEDGE BASE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-foreground font-black">
            FREQUENTLY ASKED QUESTIONS ABOUT <span className="shimmer-gold">COORG COFFEE</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about estate origin, shade cultivation, roast profiles, and traditional South Indian brewing.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {COORG_COFFEE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-card border-[#C89B3C] shadow-lg shadow-[#C89B3C]/5'
                    : 'bg-card/50 border-border hover:border-border/80'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-3">
                    <Coffee className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-[#C89B3C]' : 'text-muted-foreground'}`} />
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#C89B3C] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-2">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
