import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  useLocation,
} from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';

import appCss from '../styles.css?url';
import { ThemeProvider } from '../context/ThemeContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { Header } from '../components/common/Header';
import { MobileNav } from '../components/common/MobileNav';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SearchModal } from '../components/common/SearchModal';
import { Footer } from '../components/common/Footer';
import { CoffeeLoader } from '../components/common/CoffeeLoader';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The estate page you are looking for does not exist or has been moved.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#C89B3C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#b08732]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong loading this page
        </h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try refreshing or return to homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#C89B3C] px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-[#b08732]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground uppercase tracking-wider hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function PendingCoffeeLoader() {
  return <CoffeeLoader fullScreen message="Brewing fresh Coorg harvest..." />;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Coorg Coffee — Authentic Coorg Coffee Beans & Filter Coffee Powder Online' },
      {
        name: 'description',
        content:
          'Coorg Coffee: Buy authentic 100% pure shade-grown Coorg coffee online directly from generational estates in Madikeri, Karnataka. Fresh roasted Arabica & Robusta beans, artisanal South Indian filter coffee powder. Fast express delivery across India.',
      },
      {
        name: 'keywords',
        content:
          'coorg coffee, coorg coffee powder, buy coorg coffee, best coorg coffee, coorg coffee beans, authentic coorg coffee, coorg filter coffee, pure coorg coffee, coorg coffee online, madikeri coffee, coorg estate coffee, coorg coffee price, south indian filter coffee, arabica coffee coorg, robusta coffee coorg, kodagu coffee, coorg coffees, coorgcoffees.in',
      },
      { name: 'author', content: 'Coorg Coffee' },
      { name: 'copyright', content: 'Coorg Coffee (coorgcoffees.in)' },
      { name: 'application-name', content: 'Coorg Coffee' },
      { name: 'apple-mobile-web-app-title', content: 'Coorg Coffee' },
      { name: 'geo.region', content: 'IN-KA' },
      { name: 'geo.placename', content: 'Madikeri, Coorg, Karnataka, India' },
      { name: 'geo.position', content: '12.4244;75.7382' },
      { name: 'ICBM', content: '12.4244, 75.7382' },
      { name: 'rating', content: 'general' },
      { name: 'revisit-after', content: '1 days' },
      { name: 'distribution', content: 'Global' },
      { name: 'target', content: 'all' },
      { name: 'google-site-verification', content: 'GMagrQ_0WEJItB4CGrDWrrNwBlLpkfOt0ivRIN6SGDQ' },
      { name: 'google-site-verification', content: 'hRcOgYEav1zNCTw0SYR3qowmgUuM0GAp-rhkN-DEp8E' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { property: 'og:site_name', content: 'Coorg Coffee' },
      { property: 'og:title', content: 'Coorg Coffee — Authentic Coorg Coffee Beans & Filter Coffee Powder Online' },
      {
        property: 'og:description',
        content:
          'Buy authentic single-origin Coorg coffee powder and whole roasted beans sourced directly from generational shade-grown estates in Madikeri, Karnataka. Fast Pan-India delivery.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://coorgcoffees.in' },
      { property: 'og:locale', content: 'en_IN' },
      { property: 'og:image', content: 'https://coorgcoffees.in/coorg-logo-circle.png' },
      { property: 'og:image:secure_url', content: 'https://coorgcoffees.in/coorg-logo-circle.png' },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '1024' },
      { property: 'og:image:height', content: '1024' },
      { property: 'og:image:alt', content: 'Coorg Coffee Official Emblem - Pure Estate Harvest Madikeri' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Coorg Coffee — Authentic Coorg Coffee Beans & Filter Coffee Powder Online' },
      {
        name: 'twitter:description',
        content:
          'Authentic single-origin Coorg coffee powder and roasted beans sourced directly from generational estates in Madikeri, Karnataka.',
      },
      { name: 'twitter:image', content: 'https://coorgcoffees.in/coorg-logo-circle.png' },
      { name: 'theme-color', content: '#C89B3C' },
    ],
    links: [
      { rel: 'canonical', href: 'https://coorgcoffees.in' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Inter:wght@400;500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2026' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=2026' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=2026' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico?v=2026' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=2026' },
      { rel: 'mask-icon', href: '/favicon.svg?v=2026', color: '#C89B3C' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  pendingComponent: PendingCoffeeLoader,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Store', 'OnlineStore'],
        '@id': 'https://coorgcoffees.in/#organization',
        name: 'Coorg Coffee',
        alternateName: ['Coorg Coffee', 'Coorg Coffees', 'Coorg Coffee Crafted', 'Coorg Estate Coffee'],
        url: 'https://coorgcoffees.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://coorgcoffees.in/coorg-logo-circle.png',
          caption: 'Coorg Coffee Official Logo',
        },
        image: 'https://coorgcoffees.in/coorg-logo-circle.png',
        description:
          'Authentic single-origin Coorg coffee powder and whole roasted beans sourced directly from generational shade-grown estates in Madikeri, Karnataka.',
        telephone: '+91-9483472070',
        email: 'support@coorgcoffee.in',
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'UPI, Credit Card, Debit Card, Net Banking',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Madikeri',
          addressLocality: 'Madikeri',
          addressRegion: 'Coorg, Karnataka',
          postalCode: '571201',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 12.4244,
          longitude: 75.7382,
        },
        sameAs: ['https://coorgcoffees.in'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://coorgcoffees.in/#website',
        url: 'https://coorgcoffees.in',
        name: 'Coorg Coffee',
        description: 'Authentic single-origin Coorg coffee powder and whole roasted beans.',
        publisher: {
          '@id': 'https://coorgcoffees.in/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://coorgcoffees.in/shop?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://coorgcoffees.in/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What makes Coorg coffee unique and famous worldwide?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Coorg (Kodagu) is celebrated as the Coffee Capital of India. Grown at 3,500 to 4,500 feet altitude in the Western Ghats under natural shade canopy of silver oak and jackfruit trees, Coorg coffee cherries ripen slowly. This natural microclimate develops dense beans with mild acidity, thick body, and rich chocolate-nutty tasting notes unlike mass-commercial plantation coffees.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I brew authentic South Indian filter coffee using Coorg coffee powder?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Add 2 to 3 tablespoons of Coorg Filter Coffee powder to the upper compartment of a traditional stainless steel or brass filter. Gently press with the tamper disc without packing too tight, pour freshly boiled water, close the lid, and let it steep for 10 to 15 minutes. Combine the viscous decoction with hot frothed milk and sugar, poured back and forth between dabarah and tumbler for rich froth.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between Coorg Arabica and Coorg Robusta?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Coorg Arabica offers a delicate, fragrant cup with citrus sweetness, winey notes, and smooth finish—perfect for pour-overs, French press, and black coffee. Coorg Robusta is world-famous for its punchy boldness, rich crema, higher caffeine concentration, and deep woody-cocoa flavor, making it the essential backbone for authentic South Indian filter coffee.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are your coffee beans and powder freshly roasted in Coorg?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. All our coffee is sourced directly from generational shade-grown estates in Madikeri and small-batch roasted to order. We never use pre-packaged warehouse stocks. Each pouch is sealed with a one-way aroma degassing valve to preserve natural estate oils.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you deliver Coorg coffee across all states in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We ship directly from our Madikeri estate fulfillment center to all 28 States and 8 Union Territories across India via express logistics (DTDC / Express air and surface), with real-time tracking from dispatch to your doorstep.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="GMagrQ_0WEJItB4CGrDWrrNwBlLpkfOt0ivRIN6SGDQ" />
        <meta name="google-site-verification" content="hRcOgYEav1zNCTw0SYR3qowmgUuM0GAp-rhkN-DEp8E" />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground selection:bg-[#C89B3C] selection:text-black">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bust stale Safari/Chrome favicon cache on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const existingIcons = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      existingIcons.forEach((el) => el.remove());

      const svg = document.createElement('link');
      svg.rel = 'icon';
      svg.type = 'image/svg+xml';
      svg.href = `/favicon.svg?v=${Date.now()}`;
      document.head.appendChild(svg);

      const png = document.createElement('link');
      png.rel = 'icon';
      png.type = 'image/png';
      png.sizes = '32x32';
      png.href = `/favicon-32x32.png?v=${Date.now()}`;
      document.head.appendChild(png);

      const ico = document.createElement('link');
      ico.rel = 'shortcut icon';
      ico.type = 'image/x-icon';
      ico.href = `/favicon.ico?v=${Date.now()}`;
      document.head.appendChild(ico);
    } catch {
      // Ignore in non-browser environments
    }
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            {/* Smooth gold route change indicator */}
            {isLoading && (
              <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-[#C89B3C] via-[#E8D9C5] to-[#C89B3C] shadow-[0_0_12px_#C89B3C] animate-pulse" />
            )}

            {!isAdminRoute && <Header onOpenSearch={() => setIsSearchOpen(true)} />}

            <main className="min-h-[70vh] pb-16 lg:pb-0">
              <Outlet />
            </main>

            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <MobileNav onOpenSearch={() => setIsSearchOpen(true)} />}

            <CartDrawer />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
