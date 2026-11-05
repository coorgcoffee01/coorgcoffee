import { createFileRoute, Link } from '@tanstack/react-router';
import { ShieldCheck, Lock, CreditCard, Server, Eye, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

export const Route = createFileRoute('/security-policy')({
  component: SecurityPolicyPage,
});

function SecurityPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8 text-sm leading-relaxed">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Link to="/" className="hover:text-[#C89B3C] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Security Policy</span>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#C89B3C]/10 text-[#C89B3C] border border-[#C89B3C]/30 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-foreground">
            SECURITY &amp; DATA PROTECTION POLICY
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Our multi-layered security architecture, bank-grade payment encryption, and strict data governance policies protecting your estate coffee orders.
          </p>
          <p className="text-[11px] text-[#C89B3C] font-mono">
            Status: Fully Enforced • TLS 1.3 Active • PCI-DSS Level 1 Compliant
          </p>
        </div>

        {/* Key Security Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-[#C89B3C]">
              <Lock className="w-5 h-5" />
              <h3 className="font-display text-base font-bold">256-Bit SSL/TLS</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Every request is encrypted in transit using TLS 1.3 with automated HSTS preloaded headers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-display text-base font-bold">Zero Card Storage</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Card numbers, UPI PINs, and banking credentials are never stored or processed on our servers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-400">
              <Server className="w-5 h-5" />
              <h3 className="font-display text-base font-bold">Edge Protection</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Google Cloud global CDN edge firewalling with automated DDoS and bot attack mitigation.
            </p>
          </div>
        </div>

        {/* Detailed Security Clauses */}
        <div className="space-y-6 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm">
          <section className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              <h2 className="font-display text-xl text-[#C89B3C]">1. TRANSPORT &amp; INFRASTRUCTURE SECURITY</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All communications between your browser and <strong>coorgcoffees.in</strong> are encrypted using HTTPS with TLS 1.3 protocol suites. We implement Strict-Transport-Security (HSTS) with a 1-year max-age directive and subdomains inclusion, guaranteeing that no traffic is ever downgraded to unencrypted HTTP.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 pl-4 list-disc">
              <li>Automatic SSL/TLS certificate rotation and certificate transparency monitoring.</li>
              <li>Global Content Delivery Network (CDN) with geographic edge caching and instant DDoS filtering.</li>
              <li>Cloud Firestore security rules validating data schemas, value ranges, and rejecting unauthorized mutations.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              <h2 className="font-display text-xl text-[#C89B3C]">2. RAZORPAY PAYMENT &amp; PCI-DSS COMPLIANCE</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Payment processing is handled exclusively through <strong>Razorpay Software Private Limited</strong>, a PCI-DSS Level 1 certified payment aggregator regulated by the Reserve Bank of India (RBI).
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 pl-4 list-disc">
              <li><strong>Zero Credential Storage</strong>: Coorg Coffee never receives, stores, or handles credit/debit card numbers, CVVs, expiry dates, or UPI PINs.</li>
              <li><strong>Tokenization</strong>: Card payments use tokenized cryptograms compliant with RBI tokenization guidelines.</li>
              <li><strong>Cryptographic Verification</strong>: All payment receipts are verified server-side using HMAC-SHA256 signature validation before order confirmation.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              <h2 className="font-display text-xl text-[#C89B3C]">3. BROWSER SECURITY &amp; XSS DEFENSES</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We deploy strict HTTP security headers designed to thwart common web application threats:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 pl-4 list-disc">
              <li><strong>Content Security Policy (CSP)</strong>: Restricts executable script sources to approved origins, preventing unauthorized inline code execution.</li>
              <li><strong>X-Content-Type-Options: nosniff</strong>: Instructs browsers to reject MIME-type confusion attacks.</li>
              <li><strong>X-Frame-Options: SAMEORIGIN / DENY</strong>: Blocks clickjacking and unauthorized embedding of pages in external frames.</li>
              <li><strong>Automated Input Sanitization</strong>: All user-submitted text (product reviews, contact requests, address notes) undergoes regex-based HTML/script stripping before storage.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              <h2 className="font-display text-xl text-[#C89B3C]">4. ADMINISTRATIVE ACCESS &amp; AUDITABILITY</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our administrative portal operates under strict isolation:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 pl-4 list-disc">
              <li><strong>Domain Isolation</strong>: The administration console is hosted on a separate authenticated domain, preventing storefront cross-context leakage.</li>
              <li><strong>Brute-Force Rate Limiting</strong>: Repeated invalid login attempts trigger automated progressive lockout periods.</li>
              <li><strong>Immutable Audit Logging</strong>: Administrative actions (stock changes, price updates, order statuses) are recorded with timestamps, actor IDs, and delta diffs.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              <h2 className="font-display text-xl text-[#C89B3C]">5. RESPONSIBLE VULNERABILITY DISCLOSURE</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We welcome responsible security research. If you believe you have discovered a vulnerability affecting our services, please report it to our engineering team at <strong className="text-[#C89B3C]">security@coorgcoffee.in</strong> or through our <Link to="/contact" className="underline hover:text-[#C89B3C]">Contact Desk</Link>.
            </p>
            <p className="text-xs text-muted-foreground">
              Please include detailed reproduction steps, HTTP requests/responses, and allow us reasonable time to remediate before public disclosure.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-muted-foreground border-t border-border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Coorg Coffee Crafted — Security Standards Enforced</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/privacy-policy" className="hover:text-[#C89B3C] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#C89B3C] transition-colors">Terms of Service</Link>
            <Link to="/shipping-policy" className="hover:text-[#C89B3C] transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
