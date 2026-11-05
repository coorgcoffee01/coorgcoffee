import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed">
        <h1 className="font-display text-4xl text-foreground">TERMS &amp; CONDITIONS</h1>
        <p className="text-xs text-muted-foreground">Last updated: August 2026</p>

        <div className="space-y-4 bg-card border border-border p-6 rounded-2xl">
          <h2 className="font-display text-xl text-[#C89B3C]">1. PRODUCT SPECIFICATIONS &amp; PRICING</h2>
          <p>
            All prices listed on Coorg Coffee are in Indian Rupees (INR) inclusive of applicable taxes. Weight options (250g, 500g, 1KG) represent net coffee weight inside sealed multi-layer valve pouches.
          </p>

          <h2 className="font-display text-xl text-[#C89B3C]">2. ORDER ACCEPTANCE &amp; INVENTORY</h2>
          <p>
            Orders are confirmed only after successful payment authorization via Razorpay. In the event of temporary inventory depletion, affected orders will be refunded immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
