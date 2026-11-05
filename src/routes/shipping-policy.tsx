import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/shipping-policy')({
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed">
        <h1 className="font-display text-4xl text-foreground">SHIPPING &amp; REFUND POLICY</h1>
        <p className="text-xs text-muted-foreground">Last updated: August 2026</p>

        <div className="space-y-4 bg-card border border-border p-6 rounded-2xl">
          <h2 className="font-display text-xl text-[#C89B3C]">1. PAN-INDIA DTDC DISPATCH</h2>
          <p>
            Orders placed on Coorg Coffee are dispatched within 24–48 hours from our Madikeri estate hub via DTDC Express Logistics. Delivery timelines range from 2 to 5 business days across India.
          </p>

          <h2 className="font-display text-xl text-[#C89B3C]">2. FREE SHIPPING THRESHOLD</h2>
          <p>
            Orders exceeding ₹1,000 qualify automatically for Free Express Delivery anywhere in India. Orders under ₹1,000 carry a flat shipping charge of ₹99.
          </p>

          <h2 className="font-display text-xl text-[#C89B3C]">3. REFUNDS &amp; DAMAGED SHIPMENTS</h2>
          <p>
            If a coffee package arrives damaged or unsealed, please notify us within 48 hours of delivery at support@coorgcoffee.in or WhatsApp 90718 70722 for immediate replacement or full Razorpay refund.
          </p>
        </div>
      </div>
    </div>
  );
}
