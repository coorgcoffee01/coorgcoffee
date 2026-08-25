import pouchImage from "@/assets/pouch-hero.jpg";

/**
 * Frontend-only catalogue for the storefront slice.
 * Shape mirrors the intended backend model (products + variants + categories)
 * so it can be swapped for a real data source without touching UI code.
 */

export type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type Variant = {
  variantId: string;
  label: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  categoryId: string;
  accent: "forest" | "gold" | "clay";
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  roast: string;
  grind: string;
  notes: string[];
  altitude: string;
  featured: boolean;
  createdAt: string;
  popularity: number;
  variants: Variant[];
};

export const categories: Category[] = [
  { id: "arabica", name: "Arabica", slug: "arabica", sortOrder: 1 },
  { id: "robusta", name: "Robusta", slug: "robusta", sortOrder: 2 },
  { id: "blends", name: "Blends", slug: "blends", sortOrder: 3 },
];

function variants(skuBase: string, base: number, stock: number[]): Variant[] {
  const sizes = ["250g", "500g", "1kg"];
  const multipliers = [1, 1.85, 3.5];
  return sizes.map((label, i) => ({
    variantId: `${skuBase}-${label}`,
    label,
    sku: `${skuBase}-${label.toUpperCase()}`,
    price: Math.round((base * multipliers[i]!) / 10) * 10,
    salePrice: null,
    stock: stock[i] ?? 0,
    active: true,
  }));
}

export const products: Product[] = [
  {
    id: "p-arabica-classic",
    name: "Coorg Arabica",
    slug: "coorg-arabica",
    tagline: "Smooth, floral, gently sweet",
    description:
      "Shade-grown Arabica from the misty slopes above Madikeri, hand-picked at peak ripeness and slow roasted in small batches. Clean acidity, a soft floral lift and a long honeyed finish — the cup we hand first-time filter-coffee drinkers.",
    categoryId: "arabica",
    accent: "forest",
    images: [pouchImage],
    ratingAvg: 4.8,
    ratingCount: 214,
    roast: "Medium",
    grind: "Whole bean or filter grind",
    notes: ["Jasmine", "Honey", "Cocoa nib"],
    altitude: "1,100 – 1,400 m",
    featured: true,
    createdAt: "2026-02-10",
    popularity: 98,
    variants: variants("CC-ARB", 620, [42, 28, 12]),
  },
  {
    id: "p-robusta-bold",
    name: "Coorg Robusta",
    slug: "coorg-robusta",
    tagline: "Bold body, deep crema",
    description:
      "Washed Robusta grown on the valley floors of Kodagu, roasted dark for the thick body and heavy crema that South Indian filter coffee and home espresso both ask for. Strong without being harsh, and it stands up beautifully to milk and jaggery.",
    categoryId: "robusta",
    accent: "gold",
    images: [pouchImage],
    ratingAvg: 4.6,
    ratingCount: 168,
    roast: "Dark",
    grind: "Whole bean or espresso grind",
    notes: ["Dark chocolate", "Toasted nut", "Molasses"],
    altitude: "750 – 1,000 m",
    featured: true,
    createdAt: "2026-01-28",
    popularity: 91,
    variants: variants("CC-ROB", 540, [60, 34, 18]),
  },
  {
    id: "p-mist-honey-blend",
    name: "Coorg Mist Blend",
    slug: "coorg-mist-blend",
    tagline: "Our house blend, 70:30",
    description:
      "Seventy parts Arabica for aroma, thirty parts Robusta for backbone. Blended after roasting, never before, so each bean gets the profile it deserves. This is the everyday cup of the estate — balanced, aromatic and forgiving of any brewing method.",
    categoryId: "blends",
    accent: "clay",
    images: [pouchImage],
    ratingAvg: 4.9,
    ratingCount: 302,
    roast: "Medium dark",
    grind: "Whole bean, filter or French press",
    notes: ["Baked spice", "Caramel", "Roasted almond"],
    altitude: "900 – 1,400 m",
    featured: true,
    createdAt: "2026-03-02",
    popularity: 100,
    variants: variants("CC-MST", 580, [51, 22, 9]),
  },
  {
    id: "p-peaberry",
    name: "Estate Peaberry",
    slug: "estate-peaberry",
    tagline: "Rare single-bean cherries",
    description:
      "Roughly five in a hundred cherries grow a single round bean instead of two flat halves. We sort them out by hand and roast them separately for a brighter, more concentrated cup with a distinctly juicy middle.",
    categoryId: "arabica",
    accent: "forest",
    images: [pouchImage],
    ratingAvg: 4.7,
    ratingCount: 86,
    roast: "Medium light",
    grind: "Whole bean or filter grind",
    notes: ["Orange peel", "Brown sugar", "Black tea"],
    altitude: "1,250 – 1,450 m",
    featured: false,
    createdAt: "2026-03-18",
    popularity: 74,
    variants: variants("CC-PBY", 760, [18, 9, 4]),
  },
  {
    id: "p-monsoon-malabar",
    name: "Monsooned Malabar",
    slug: "monsooned-malabar",
    tagline: "Aged in the coastal monsoon",
    description:
      "Green beans rested in monsoon winds on the Malabar coast until they swell and pale, a century-old Indian process. The result is famously low in acidity with a heavy, earthy, almost savoury sweetness.",
    categoryId: "blends",
    accent: "clay",
    images: [pouchImage],
    ratingAvg: 4.5,
    ratingCount: 64,
    roast: "Dark",
    grind: "Whole bean or French press",
    notes: ["Tobacco leaf", "Cedar", "Dried fig"],
    altitude: "900 – 1,200 m",
    featured: false,
    createdAt: "2026-02-24",
    popularity: 68,
    variants: variants("CC-MMB", 690, [24, 14, 6]),
  },
  {
    id: "p-filter-classic",
    name: "Filter Coffee Classic",
    slug: "filter-coffee-classic",
    tagline: "80:20 with chicory",
    description:
      "Fine-ground Robusta-forward coffee cut with roasted chicory, the way a Kodagu kitchen makes it. Brew in a steel filter, add hot milk and sugar to taste, and you have the decoction our families have made every morning for generations.",
    categoryId: "robusta",
    accent: "gold",
    images: [pouchImage],
    ratingAvg: 4.8,
    ratingCount: 421,
    roast: "Dark",
    grind: "Fine filter grind",
    notes: ["Chicory", "Malt", "Bittersweet cocoa"],
    altitude: "750 – 1,100 m",
    featured: false,
    createdAt: "2026-01-12",
    popularity: 95,
    variants: variants("CC-FLT", 500, [88, 52, 30]),
  },
];

export function formatPrice(paise: number) {
  return `₹${paise.toLocaleString("en-IN")}`;
}

export function fromPrice(product: Product) {
  return Math.min(...product.variants.filter((v) => v.active).map((v) => v.salePrice ?? v.price));
}

export function categoryName(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.name ?? "Coffee";
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function featuredProducts() {
  return products.filter((p) => p.featured);
}

export type SortKey = "popularity" | "price-asc" | "price-desc" | "newest";

/** Search + filter + sort behind one function so a real backend can replace it. */
export function searchProducts(options: {
  query?: string;
  categoryId?: string | null;
  sort?: SortKey;
}) {
  const query = (options.query ?? "").trim().toLowerCase();
  let list = products.slice();

  if (options.categoryId) {
    list = list.filter((p) => p.categoryId === options.categoryId);
  }

  if (query) {
    list = list.filter((p) =>
      [p.name, p.tagline, p.description, ...p.notes].join(" ").toLowerCase().includes(query),
    );
  }

  switch (options.sort ?? "popularity") {
    case "price-asc":
      list.sort((a, b) => fromPrice(a) - fromPrice(b));
      break;
    case "price-desc":
      list.sort((a, b) => fromPrice(b) - fromPrice(a));
      break;
    case "newest":
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    default:
      list.sort((a, b) => b.popularity - a.popularity);
  }

  return list;
}
