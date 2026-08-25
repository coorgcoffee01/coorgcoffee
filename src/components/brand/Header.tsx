import { Link } from "@tanstack/react-router";
import { Menu, Phone, Search, ShoppingBag, User, X, MapPin } from "lucide-react";
import { useState } from "react";
import emblem from "@/assets/emblem.png";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { useCart } from "@/lib/cart";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function UtilityBar() {
  return (
    <div className="hidden bg-ink text-ink-foreground md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-[0.78rem] tracking-wide">
        <p className="flex items-center gap-2">
          <MapPin className="size-3.5 text-gold" aria-hidden />
          Roasted in Madikeri, Coorg · Delivered across India
        </p>
        <p className="text-gold">Free shipping on orders above ₹999</p>
        <p className="flex items-center gap-2">
          <Phone className="size-3.5 text-gold" aria-hidden />
          <a href="tel:+918212345678" className="hover:text-gold">
            +91 82123 45678
          </a>
          <span aria-hidden className="opacity-40">
            /
          </span>
          <a href="tel:+919845098450" className="hover:text-gold">
            +91 98450 98450
          </a>
        </p>
      </div>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <UtilityBar />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Coorg Coffee home">
          <img src={emblem} alt="" width={44} height={44} className="size-11" />
          <span className="leading-none">
            <span className="block font-display text-xl text-foreground">Coorg Coffee</span>
            <span className="block font-script text-sm text-muted-foreground">
              Mist &amp; Honey
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-4 py-3 text-sm font-medium tracking-wide uppercase text-foreground/85 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-4">
          <Button variant="ghost" size="icon" asChild aria-label="Search coffees">
            <Link to="/shop" search={{ q: "" }}>
              <Search aria-hidden />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild aria-label="Your account">
            <Link to="/account">
              <User aria-hidden />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <ShoppingBag aria-hidden />
            {count > 0 && (
              <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-gold text-[0.68rem] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-border bg-elevated px-4 pt-2 pb-6 lg:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-border py-4 text-base font-medium tracking-wide uppercase"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+918212345678"
            className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Phone className="size-4 text-gold" aria-hidden /> +91 82123 45678
          </a>
        </nav>
      )}
    </header>
  );
}
