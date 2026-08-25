import { CreditCard, Leaf, Truck, Award } from "lucide-react";

const items = [
  { icon: Truck, label: "Pan India Delivery" },
  { icon: CreditCard, label: "Safe & Secure Payment" },
  { icon: Award, label: "Premium Quality" },
  { icon: Leaf, label: "Sustainably Sourced" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why you can buy with confidence" className="bg-ink text-ink-foreground">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/60">
              <Icon className="size-5 text-gold" aria-hidden />
            </span>
            <span className="text-sm font-medium tracking-wide">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
