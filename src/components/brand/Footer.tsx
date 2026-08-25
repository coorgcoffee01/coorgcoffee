import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
import emblem from "@/assets/emblem.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={emblem} alt="" width={48} height={48} loading="lazy" className="size-12" />
            <span>
              <span className="block font-display text-2xl">Coorg Coffee</span>
              <span className="block font-script text-base text-gold">
                From the Land of Mist &amp; Honey
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed opacity-80">
            Single-estate coffee from Kodagu, Karnataka. Picked ripe, roasted in small batches and
            packed the same week it ships to your home.
          </p>
          <form
            className="mt-7 flex max-w-sm gap-2"
            onSubmit={(event) => event.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <Input
              id="footer-email"
              type="email"
              placeholder="Your email address"
              className="h-12 border-border/60 bg-background/10 text-ink-foreground placeholder:opacity-60"
            />
            <Button type="submit" variant="gold" size="lg" className="shrink-0">
              <Mail aria-hidden /> Join
            </Button>
          </form>
        </div>

        <nav aria-label="Shop links">
          <h2 className="font-display text-base tracking-widest text-gold">Shop</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/shop" className="hover:text-gold">
                All coffees
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "arabica" }} className="hover:text-gold">
                Arabica
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "robusta" }} className="hover:text-gold">
                Robusta
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ category: "blends" }} className="hover:text-gold">
                Blends
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-base tracking-widest text-gold">Help</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/about" className="hover:text-gold">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact us
              </Link>
            </li>
            <li>
              <a href="tel:+918212345678" className="hover:text-gold">
                +91 82123 45678
              </a>
            </li>
            <li>
              <a href="mailto:hello@coorgcoffee.in" className="hover:text-gold">
                hello@coorgcoffee.in
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-4">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-gold">
              <Instagram className="size-5" aria-hidden />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-gold">
              <Facebook className="size-5" aria-hidden />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:text-gold">
              <Youtube className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs opacity-70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Coorg Coffee. Made in Kodagu, Karnataka.</p>
          <p>Shipping across India · Secure payments</p>
        </div>
      </div>
    </footer>
  );
}
