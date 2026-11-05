import React from 'react';
import { Truck, ShieldCheck, Award, TreePine, MessageSquare } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-card border-b border-border py-6 sm:py-8 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
        {/* 4 Trust Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 flex-1">
          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-background/50 border border-border/50 sm:border-none sm:bg-transparent">
            <div className="w-10 h-10 rounded-lg border border-[#C89B3C]/40 bg-background flex items-center justify-center text-[#C89B3C] shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground leading-tight">
                PAN INDIA DELIVERY
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">Fast &amp; Reliable Dispatch</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-background/50 border border-border/50 sm:border-none sm:bg-transparent">
            <div className="w-10 h-10 rounded-lg border border-[#C89B3C]/40 bg-background flex items-center justify-center text-[#C89B3C] shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground leading-tight">
                SAFE &amp; SECURE PAYMENT
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">100% Encrypted Transactions</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-background/50 border border-border/50 sm:border-none sm:bg-transparent">
            <div className="w-10 h-10 rounded-lg border border-[#C89B3C]/40 bg-background flex items-center justify-center text-[#C89B3C] shrink-0 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground leading-tight">
                PREMIUM QUALITY
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">No Compromise Blend</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-background/50 border border-border/50 sm:border-none sm:bg-transparent">
            <div className="w-10 h-10 rounded-lg border border-[#C89B3C]/40 bg-background flex items-center justify-center text-[#C89B3C] shrink-0 shadow-sm">
              <TreePine className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground leading-tight">
                SUSTAINABLY SOURCED
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">Direct From Coorg Hills</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Contact Button */}
        <a
          href="https://wa.me/919071870722"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-3 bg-[#2D5A27] text-white px-5 py-3 rounded-full hover:bg-[#23481f] transition-all shadow-md shrink-0 border border-white/20 min-h-[48px] w-full sm:w-auto xl:w-auto"
        >
          <MessageSquare className="w-5 h-5 fill-current text-white shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider opacity-90 font-medium">
              Need Help? Chat With Us
            </span>
            <span className="text-xs font-extrabold tracking-wide">94834 72070 | 90718 70722</span>
          </div>
        </a>
      </div>
    </section>
  );
};
