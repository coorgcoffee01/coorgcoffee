# Coorg Coffee Crafted

ANTIGRAVITY BUILD PROMPT — Coorg Coffee E-Commerce Platform

Copy everything below into Antigravity as a single build instruction.

1. PROJECT SUMMARY

Build Coorg Coffee, a premium single-brand coffee e-commerce web application for the Indian market. This is a production-grade application, not a prototype — treat every workflow (payments, inventory, admin actions) as if real money and real customers depend on it, because they do.

Brand: Coorg Coffee — "From the Land of Mist & Honey." Sourced from Coorg, Karnataka. Positioning: authentic, premium, heritage, trustworthy, no-compromise quality.

Business model: Single-brand storefront (not a marketplace), ~10–20 SKUs at launch, India-only shipping, price point ~₹500+ per unit depending on variant.

Audience: All ages, with a meaningful share of older customers. This has direct UI consequences: large touch targets, high contrast, no cramped text, no cleverness that sacrifices clarity.

Timeline: ~1 week. Priorities are strictly tiered (P0/P1/P2 — see Section 21). Never let P1/P2 work delay or destabilize P0 work.

2. DESIGN SYSTEM — SOURCE OF TRUTH

Three reference images are provided and must be treated as the primary visual authority for this build — not inspiration to loosely riff on, but the actual design language to reproduce and extend into a working app:

Dark hero reference — near-black background, gold/amber accent color (#C89B3C-ish), serif/script "From the Land of Mist & Honey" headline treatment mixed with a bold condensed display font for "MIST & HONEY", circular gold-foil brand emblem (mountains, coffee branch, hut), floating coffee-bean photography, icon row (100% Pure / Premium Origin / Rich Aroma / Perfect Taste) in thin-outline circular badges, dual CTA (solid gold "SHOP NOW" pill + outline "OUR STORY" with play icon), bottom trust strip on a dark bar (Pan India Delivery / Safe & Secure Payment / Premium Quality / Sustainably Sourced) plus a WhatsApp contact chip.

Light hero reference — the same structural layout and same content, but on a warm cream/parchment background with a utility bar above the header (location, free-shipping threshold, phone numbers), and a hills/forest photographic backdrop behind the product pack shot. Product cards below use white cards with a photo tile + text block side by side, each in a different accent color (green for Arabica, amber for Robusta, dark brown for Coorg Mist Blend).

Product-only cutout — the black stand-up pouch on a clean neutral backdrop, used for catalogue/PDP imagery treatment (soft studio shadow, no background clutter).

Build the theme system as light = the parchment/cream reference, dark = the near-black gold reference. Do not treat "dark mode" as an inverted afterthought — both are fully art-directed states with their own considered palette, matching these two references almost 1:1 in tone even though the app also needs a Shop/PDP/Cart/Checkout/Admin surface these references don't show.

Design tokens (implement as CSS variables / Tailwind theme extension, never hard-coded hex in components):

--bg, --bg-elevated (cards), --fg, --fg-muted

--border

--accent-primary (the gold, ~#C89B3C light / slightly brighter in dark for contrast)

--accent-secondary (deep forest green, echoing the Arabica card)

--cta-primary-bg, --cta-primary-fg, --cta-secondary-bg, --cta-secondary-fg

--success, --warning, --error

--input-bg, --input-border, --input-focus-ring

Typography: a bold condensed display face for hero/section headers (reference uses something like an Anton/Bebas-style condensed sans for "MIST & HONEY"), a script/serif accent face for the "From the Land of" line, and a clean, highly-legible sans (Inter/similar) for all body copy, forms, and product data — legibility for older users takes precedence over editorial flourish everywhere below the hero.

Explicitly avoid: gradients-as-decoration, generic SaaS card shadows, playful rounded-everything, coffee-cup clip-art, badge clutter, and any layout that reads as a default WooCommerce/Shopify theme. The bar is "real premium Indian heritage brand," not "AI-generated coffee template."

Theme toggle: header-level control, instant switch, persisted (localStorage + respected on load), defaults to system preference on first visit, WCAG AA contrast maintained in both modes including on the gold accent (verify gold-on-black and gold-on-cream both pass contrast for CTA text, adjusting shade per-theme if needed rather than reusing one gold value everywhere).

3. TECH STACK

Framework: Next.js (latest stable), TypeScript throughout, App Router.

UI: React + Tailwind CSS, component-based, all components consuming the design tokens above — no component may hardcode a color.

Server logic: Next.js Route Handlers / Server Actions for all privileged operations. Do not stand up a separate backend service. Business logic lives in isolated lib/services/* modules callable from API routes — routes stay thin (validate input → call service → return response).

Database: Firebase Firestore (not Postgres).

File/media storage: Firebase Storage, for product images and any admin-uploaded assets.

Auth: Firebase Authentication — optional for customers (guest checkout must always work), required for admin.

Hosting/deploy: Firebase App Hosting (or the current best-fit Firebase hosting product for a Next.js SSR app) — set up so staging and production are distinct Firebase projects/environments.

Payments: Razorpay (server-verified).

Shipping: DTDC, behind an adapter interface (see Section 12) — no real credentials exist yet, so a mock/sandbox mode is mandatory for V1.

Notifications: SMS + WhatsApp, behind a provider-agnostic interface (see Section 14) — provider undecided, so mock mode is mandatory for V1.

Use only well-established, actively maintained packages. No experimental/unstable dependencies for a 1-week production build.

4. FIRESTORE DATA MODEL

Design and implement these collections (adjust field names as needed but preserve the entities and relationships):

users — customer accounts (uid, name, email, phone, createdAt). Optional; guests never get a doc here.

admins — admin accounts (uid, name, email, role: "admin" for V1, structured so more roles can be added later without a schema change).

products — id, name, slug, description, categoryId, images[] (Storage URLs), ratingAvg, ratingCount, active (bool), metadata (SEO title/description), createdAt/updatedAt.

product_variants — subcollection or top-level with productId FK: variantId, label (e.g. "250g"), sku, price, salePrice (nullable), stock, active, image (optional override).

categories — id, name, slug, sortOrder.

carts — id (session/user scoped), userId (nullable for guest, tied to a persisted cart token/cookie instead), items[] (denormalized snapshot at add-time is NOT authoritative — always re-validate price/stock server-side at checkout).

cart_items — if modeled as a subcollection: variantId, quantity, addedAt.

orders — id, orderNumber (human-readable), customer info (guest or userId), shippingAddress, status (see lifecycle in Section 13), totals (subtotal, shipping, tax if applicable, grandTotal — all computed server-side), paymentStatus, paymentId, shipmentId, createdAt/updatedAt.

order_items — orderId FK, productId, variantId, name/label snapshot at time of order (never trust live product data for historical orders), unitPrice snapshot, quantity, lineTotal.

payments — orderId FK, razorpayOrderId, razorpayPaymentId, razorpaySignature, status (created/authorized/captured/failed/refunded), amount, verifiedAt, rawWebhookPayload (for audit).

shipments — orderId FK, courier: "DTDC", awbNumber (nullable until generated), status, trackingHistory[] (status + timestamp + location if available), mode ("mock" | "live").

reviews — productId FK, userId or guest name, rating (1–5), comment, verifiedPurchase (bool, derived from an order check), status (pending/approved/rejected if you add light moderation), createdAt.

addresses — userId FK (for saved addresses on logged-in accounts only).

coupons — schema only, not wired into pricing logic in V1. code, type, value, active, expiresAt — present so a discount engine can be added later without an order-model rewrite. Do not build redemption logic now.

notifications — log of sent/mock notifications: orderId, type (event name), channel (sms/whatsapp), status, payloadSnapshot, sentAt.

audit_logs — actorId, actorType (admin), action, targetType, targetId, before/after snapshot where relevant, timestamp. Write on every sensitive admin mutation (status change, refund, stock edit, product publish/unpublish).

homepage_content — a small settings doc/collection so hero copy, featured product IDs, and promo strip text are editable without a redeploy (nice-to-have if time allows in P0, otherwise P1).

Non-negotiable rule: nothing about price, stock, payment status, or order ownership is ever trusted from the client. Every checkout/payment/admin mutation re-reads and re-validates from Firestore server-side.

5. INFORMATION ARCHITECTURE / PAGES

Customer-facing:

/ Home

/shop Shop (listing, category filter, sort, basic search)

/product/[slug] Product detail

/about About Us

/contact Contact Us

/cart Full cart page

/checkout Checkout (guest-first)

/account (only reachable if authenticated) → orders, order detail, addresses, wishlist, reviews

/account/orders/[id] Order detail + tracking

/track/[orderNumber] Public order-tracking lookup (so a guest with an order number + phone/email can check status without logging in)

/login, /signup, /forgot-password

/privacy-policy, /terms, /shipping-policy

Admin (separate route group, e.g. /admin/*, fully gated):

/admin/login

/admin Dashboard

/admin/products (list/create/edit, variant + stock management, image upload)

/admin/orders (list/filter/detail, status update, refund initiation, shipment/AWB view)

/admin/customers (list/detail/order history)

/admin/reviews (moderation, if implemented)

/admin/settings (homepage content, if implemented)

6. NAVIGATION

Desktop header: logo/emblem + "Coorg Coffee" wordmark, primary links (Home / Shop / About / Contact), and a right-aligned action cluster: search icon (opens inline/expandable search), theme toggle, account icon, wishlist icon (if implemented), cart icon with a live item-count badge.

Mobile: a dedicated mobile nav — not a shrunk desktop bar. Use a hamburger/slide-out or bottom-tab pattern (your call, but it must be purpose-built), with the cart and search still reachable without opening the full menu, and touch targets ≥44px.

7. HOMEPAGE SECTIONS

Compose from (not all mandatory — match the reference composition, don't pad):

Utility bar (location/shipping note + phone numbers) — light theme reference includes this; carry it into both themes.

Header/nav.

Hero: script "From the Land of" + bold "MIST & HONEY" headline, subcopy, 4-icon trust row (100% Pure / Premium Origin / Rich Aroma / Perfect Taste), dual CTA (Shop Now solid + Our Story outline w/ play icon), hero product photography per the references.

Trust strip: Pan India Delivery / Safe & Secure Payment / Premium Quality / Sustainably Sourced, each with an outline icon.

Featured collection: "OUR COLLECTION" eyebrow + "Premium Coffee, Pure & Authentic" heading, then a 3-card (or N-card, data-driven) product showcase — photo + name + one-line descriptor + "FROM ₹X / size" + colored Shop Now button, matching the card style in reference image 2 (photo tile beside text block, distinct accent color per product/category).

"Why Choose Coorg Coffee" strip (Single Origin / Freshly Roasted / No Compromise / Crafted for Coffee Lovers) + a WhatsApp "Need help?" chip.

Brand/origin storytelling section (short, editorial, photography-led).

Footer: policy links, contact info, socials, newsletter signup (optional email capture only — no gated content).

All section content (featured products, hero copy) should pull from Firestore, not be hardcoded, so admin can update it later.

8. PRODUCT CATALOGUE, PDP, SEARCH

Product cards on /shop: image, name, "From ₹X", quick category tag, Shop Now / Add to Cart.

Basic filtering: category + sort (price, newest, popularity) — no faceted filter builder in V1.

Basic search: name + description keyword match against Firestore (client-side filter over a cached product list is acceptable at this catalogue size — do not build a search index for 10–20 products). Structure the query behind a searchProducts() service function so it can later be swapped for a real search backend without touching UI code.

Empty/no-results states styled to brand (not a bare "No results").

PDP: large gallery (swipeable on mobile), name, price (reflecting selected variant), variant selector (clearly labeled, large touch targets — this is the #1 place older users get confused, so make the selected state unmistakable), stock status, quantity stepper, Add to Cart and Buy Now as clearly distinct, high-contrast CTAs, wishlist toggle, share, ratings/reviews section, full description. Buy Now should go straight to a pre-filled checkout with that single item.

9. CART

Drawer: opens on add-to-cart, shows line items (image, name, variant, qty stepper, price, remove), subtotal, "View Cart" + "Checkout" actions.

Full page (/cart): same data, more room, order summary block, checkout CTA.

Persistence: guests persist via a cart-id cookie/localStorage token mapped to a Firestore cart doc; logged-in users persist via userId. Merge guest cart into account cart on login (don't silently drop items).

Stock enforcement: quantity steppers must not allow exceeding live stock; if stock drops between add-to-cart and checkout, surface it before payment, not after.

10. CHECKOUT (GUEST-FIRST)

No forced login. Collect: name, phone, email, shipping address (line1/2, city, state, pincode with format validation). Client-side validation for immediate feedback, but all values are re-validated server-side before order creation.

Server-side checkout flow:

Re-fetch cart items from Firestore (never trust client-held cart state for pricing).

Re-validate each variant's live price + stock.

Recompute subtotal/shipping/total server-side.

Create a pending order doc + a Razorpay order (see Section 11).

Only on verified payment does the order become paid and stock get decremented — atomically (Firestore transaction) to prevent oversell under concurrent checkouts.

11. RAZORPAY INTEGRATION

Keys: RAZORPAY_KEY_ID public (frontend-safe), RAZORPAY_KEY_SECRET and webhook secret server-only, never bundled to the client.

Flow: client requests order creation → server validates cart/total → server calls Razorpay Orders API → returns order_id to client → client opens Razorpay Checkout (UPI, cards, netbanking all enabled) → on client callback, do not trust it — server independently verifies the payment signature (razorpay_order_id + razorpay_payment_id + razorpay_signature) using the secret before marking anything paid.

Implement a webhook endpoint as the source of truth for payment state (covers cases where the client never returns, e.g. tab closed after payment). Verify webhook signature. Handle idempotently — a webhook may be delivered more than once; use the Razorpay payment/order ID as an idempotency key so it's processed exactly once in effect.

States to handle explicitly: success, failure, user-cancelled, abandoned (pending timeout — decide a reasonable expiry, e.g. release reserved stock after N minutes if unpaid), retry-payment-on-same-order.

Refunds: admin-triggered from /admin/orders/[id], calls Razorpay refund API server-side, writes a payments-linked refund record (amount, status, reason, timestamps) — never expose secret keys to the browser at any point in this flow.

12. DTDC SHIPPING — ADAPTER PATTERN

Define a ShippingProvider interface (TypeScript) with methods like createShipment, generateAWB, getTrackingStatus, cancelShipment, schedulePickup (extend for COD/returns later). Implement:

DtdcShippingProvider — reads DTDC_API_BASE_URL, DTDC_API_KEY/account credentials from env vars. Do not invent real DTDC endpoint paths or payload shapes — stub the actual HTTP calls with clearly marked // TODO: wire to real DTDC endpoint once credentials + API docs are provided and throw a clear "not configured" error if called in live mode without credentials present.

MockShippingProvider — fully functional fake implementation (generates a plausible AWB-style number, simulates a status progression over time or on-demand) so checkout → order → shipment → tracking can be built, demoed, and tested end-to-end without real DTDC access.

A single config flag (env var, e.g. SHIPPING_MODE=mock|live) selects which implementation the app uses at runtime. Admin UI should visibly show which mode is active (e.g. a small "Sandbox Mode" badge) so nobody mistakes mock AWBs for real ones.

Admin order detail should surface: courier name (DTDC), AWB number, current status, tracking history — sourced through the adapter regardless of which implementation is active.

13. ORDER LIFECYCLE / TRACKING

Primary path: Order Placed → Confirmed → Packed → Shipped → In Transit → Out for Delivery → Delivered

Exception states: Payment Failed, Cancelled, Refund Initiated, Refund Completed, Return Requested (if implemented).

Build /track/[orderNumber] and the logged-in order-detail equivalent as a clear visual stepper showing current state, with timestamps where available from the shipment doc. This should read clearly to an older, non-technical user — no jargon, no ambiguous icons without labels.

14. NOTIFICATIONS — PROVIDER-AGNOSTIC

Define a NotificationProvider interface (sendSms, sendWhatsApp) with a MockNotificationProvider (logs to the notifications collection instead of actually sending) as the V1 default, and a config flag to swap in a real provider later without touching call sites. Trigger points: order placed, payment confirmed, order shipped, order delivered, payment failed, refund initiated, refund completed. Transactional only — never trigger promotional sends automatically.

15. ACCOUNTS, WISHLIST, REVIEWS

Optional account creation; guest purchase always works.

Logged-in account area: profile, orders (list + detail + tracking), addresses, wishlist, reviews.

No loyalty points system — explicitly out of scope for V1.

Reviews: rating + comment, tie to verifiedPurchase when the reviewer's order history includes that product; apply basic anti-abuse (e.g. rate-limit review submissions, no arbitrary rating edits post-moderation) rather than an open free-for-all.

16. ADMIN PORTAL

Custom-built, not raw Firestore console access exposed to the client. Gate every admin route and every admin API call server-side against the admins collection / custom claims — a normal customer session must never be able to call an admin endpoint successfully, even by guessing the URL.

Dashboard: today's revenue, total revenue, monthly revenue, total/pending/completed/cancelled orders, total customers, average order value, top products, low-stock products, payment status breakdown, shipment status breakdown — a small number of clean charts, not a wall of widgets.

Product management: create/edit/archive, image upload to Storage (with size/type validation), category management, variant management (add/edit/remove variant, price, stock, SKU, active toggle), description editing, review moderation hooks.

Order management: list/search/filter, order detail (customer info, items, payment status, shipment/AWB, DTDC status), manual status transitions where appropriate, refund initiation, refund status view.

Customer management: list/search, profile view, order history, total lifetime value.

Admin UI aesthetic: clean, dense-but-readable, efficient — it does not need to match the storefront's editorial styling. Functionality over decoration here, per the brief.

17. SECURITY REQUIREMENTS

Firestore Security Rules: default-deny; customers can only read/write their own cart/orders/addresses; product/category reads are public; all writes to products, orders (status), payments, shipments, coupons, admin-only fields go through server-side Admin SDK code paths, not direct client writes.

All privileged mutations (order status change, refund, stock adjustment, product publish) happen in server code, authenticated as admin, and are recorded in audit_logs.

Server-side re-validation of price, stock, payment status, and order ownership on every request that touches them — the client is never authoritative for any of these.

Razorpay and DTDC secrets live only in server env vars, never in client bundles.

Webhook signature verification (Razorpay) before acting on any webhook payload.

Rate limiting on public write endpoints (checkout creation, review submission, contact form) to blunt abuse.

Secure file upload validation (type/size limits) for admin product images.

18. UX QUALITY BARS

Accessibility: semantic HTML, sufficient color contrast in both themes, visible focus states, keyboard navigability throughout (including the cart drawer and checkout form), ARIA labels on icon-only controls, ≥44px touch targets, clear plain-language error messages, meaningful alt text on all product imagery, never place text over an uncontrolled busy image background without a scrim.

Responsive design: genuinely designed (not just squeezed) breakpoints for mobile/tablet/laptop/desktop across nav, product cards, PDP gallery, cart drawer, checkout, account, and admin tables (admin tables should collapse to a card/list layout on small screens, not force horizontal scroll as the only option).

Animation: subtle, editorial-feeling transitions (page/section reveals, hover states, cart drawer slide, button feedback) — no gaming/SaaS-flashy motion, and respect prefers-reduced-motion.

Loading/empty/error states: skeleton loaders for product grids and admin tables, button-level loading states (with disabled state to prevent double-submit — this matters a lot for payment/order buttons specifically), on-brand empty states (empty cart, empty wishlist, no orders, no search results, no reviews), and a real error UI (not a blank page) for product-not-found, out-of-stock, payment failed/cancelled, network errors, unauthorized admin access.

Toasts: for add/remove-from-cart, wishlist changes, payment success/failure, profile updates, review submission — used sparingly, never stacked into noise.

19. PERFORMANCE

Optimized/responsive images with lazy loading, efficient Firestore queries (avoid fetching the full catalogue on every route), pagination for admin lists and order history, sensible caching for largely-static content (homepage sections, product listings), code-splitting via Next.js defaults, and a lean dependency footprint — don't add libraries for things Next.js/Tailwind already handle.

20. ENVIRONMENTS, GIT, DOCS

.env.example covering: Firebase client config, Firebase Admin credentials, Razorpay key/secret/webhook secret, DTDC credentials/base URL (+ SHIPPING_MODE), notification provider credentials (+ mock mode flag). Never commit real secrets.

Structure for Development → GitHub → Staging → Production, with no hardcoded environment-specific URLs (read from env).

Deliver a README covering: setup, Firebase project setup (Firestore + Storage + rules deploy + Auth), Razorpay setup, DTDC integration notes (what's mocked vs. what needs real credentials), notification provider notes, and deployment steps.

21. PRIORITY ORDER — 1 WEEK BUILD

P0 (must work): Home, Shop, PDP, variants, add-to-cart, cart drawer, cart page, guest checkout, Razorpay payment + server verification, order creation, safe inventory decrement, order confirmation, admin login, admin dashboard, admin product management, admin order management, DTDC adapter with mock mode, order-tracking UI, full responsiveness, light/dark theme.

P1 (important, after P0 is solid): customer accounts, wishlist, reviews, admin customer management, refund management, SMS/WhatsApp abstraction wired to mock mode, basic search, lightweight analytics.

P2 (explicitly future, do not let this eat P0/P1 time): AI shopping assistant, AI recommendations/review summaries/natural-language search, advanced search engine, loyalty, referrals, coupon redemption logic, advanced SEO tooling.

Do not sacrifice any P0 item to build a P1/P2 item. If time runs short, a rougher-but-functional P1 feature is acceptable; a broken or fake P0 feature (e.g. unverified payment, unsafe stock decrement) is not.

22. ACCEPTANCE CRITERIA (VERIFY BEFORE CALLING THIS DONE)

Customer: browse products; select variant; add to cart; cart drawer and full cart both work and stay in sync; guest checkout completes end-to-end; Razorpay payment completes and is verified server-side (not just client callback); order is created with correct totals; inventory decrements safely with no oversell under concurrent orders; customer can view and track their order without an account via order number; light/dark theme both work, look intentional (not inverted), and persist; full site is usable on mobile including checkout; all product imagery loads and is not distorted.

Admin: admin login is properly gated; dashboard renders real aggregate data; full CRUD on products including variants, stock, images, and category; order list/detail/status update; refund can be initiated and its status tracked; shipment info (courier, AWB, status) is visible via the DTDC adapter in mock mode; customer list/detail with order history is visible.

Integrations: Razorpay order-creation, signature verification, and webhook handling are all implemented and idempotent; DTDC adapter interface exists with a working mock provider and a clearly-stubbed live provider ready for real credentials; notification interface exists with a working mock provider; no secret ever appears in client-side code or bundles; Firestore rules block direct client writes to anything privileged.

Build to this specification. Where the brief and the reference images ever conflict on a visual detail, follow the reference images. Where a requirement is ambiguous, choose the interpretation that best serves an older, non-technical Indian customer buying premium coffee online for the first time — clarity and trust over cleverness, everywhere.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
