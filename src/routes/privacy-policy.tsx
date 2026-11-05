import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed">
        <h1 className="font-display text-4xl text-foreground">PRIVACY POLICY</h1>
        <p className="text-xs text-muted-foreground">Last updated: August 2026</p>

        <div className="space-y-4 bg-card border border-border p-6 rounded-2xl">
          <h2 className="font-display text-xl text-[#C89B3C]">1. INFORMATION WE COLLECT</h2>
          <p>
            Coorg Coffee collects personal details provided during guest checkout including full name, shipping address, email address, and phone number for order fulfillment and DTDC express shipping updates.
          </p>

          <h2 className="font-display text-xl text-[#C89B3C]">2. RAZORPAY PAYMENT SECURITY</h2>
          <p>
            All online transactions are securely handled via Razorpay Payment Gateway. Coorg Coffee never stores credit card details or netbanking passwords on our servers. Signature verifications happen using server-side HMAC SHA256 secrets.
          </p>

          <h2 className="font-display text-xl text-[#C89B3C]">3. SMS &amp; WHATSAPP TRANSACTIONAL NOTIFICATIONS</h2>
          <p>
            By placing an order, you agree to receive essential transactional updates (Order Confirmation, Dispatch &amp; DTDC Tracking) on your registered mobile number via SMS and WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
