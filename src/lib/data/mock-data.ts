import { Category, Product, Review } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-all',
    name: 'All Products',
    slug: 'all',
    description: 'Freshly roasted single-origin & blended coffees from Coorg hills',
    sortOrder: 1,
  },
  {
    id: 'cat-chocolates',
    name: 'Artisanal Coorg Chocolates',
    slug: 'chocolates',
    description: 'Handcrafted luxury chocolates: Milk Cashew, Dark Cashew, Mango White, Sugar-Free Dark, Crispy Balls & Purple Blackcurrant (9 Varieties)',
    sortOrder: 2,
    badgeColor: 'amber',
  },
  {
    id: 'cat-wines',
    name: 'Coorg Homemade Fruit Wines',
    slug: 'wines',
    description: 'Authentic Kodagu homemade fruit wines: Kiwi, Bird Eye Chilli, Pepper, Star Apple, Red Wine, Mulberry & Strawberry (7 Flavours)',
    sortOrder: 3,
    badgeColor: 'amber',
  },
  {
    id: 'cat-beans',
    name: 'AA Grade Beans (Medium & Dark Roast)',
    slug: 'beans',
    description: 'Medium and dark roast whole coffee beans from shade-grown Coorg estates (3 Varieties)',
    sortOrder: 2,
    badgeColor: 'amber',
  },
  {
    id: 'cat-powder',
    name: '100% Arabica & Robusta Coffee Powder',
    slug: 'powder',
    description: '100% pure Arabica and Robusta freshly ground coffee powders (2 Varieties)',
    sortOrder: 3,
    badgeColor: 'green',
  },
  {
    id: 'cat-filter',
    name: 'Filter Coffee Powder (80% Coffee 20% Chicory)',
    slug: 'filter-coffee',
    description: 'Traditional filter coffee (80:20) and specialty grinds including Espresso & Moka Pot (5 Varieties)',
    sortOrder: 4,
    badgeColor: 'brown',
  },
];

/**
 * 🧪 TEST MODE TOGGLE
 * Set to `true` to price all coffees at ₹1 with ₹0 delivery fee for end-to-end checkout & payment testing.
 * Set to `false` whenever you are ready to switch back to original prices and delivery charges.
 */
export const IS_TEST_PRICE_MODE = false;

export const ORIGINAL_PRODUCTS: Product[] = [
  // 1. AA Grade Arabica Beans (Medium & Dark Roast)
  {
    id: 'prod-arabica-beans',
    name: 'AA Grade Arabica Beans',
    slug: 'aa-grade-arabica-coffee-beans',
    aliases: ['premium-arabica-coffee-beans', 'arabica-beans'],
    tagline: 'Medium & Dark Roast • High-Elevation Shade Grown',
    shortDescription:
      'Single-origin AA grade Arabica beans cultivated under shade in Coorg high elevations. Available in Medium and Dark Roast for sweetness, floral aroma, and a clean finish.',
    description:
      'Handpicked at peak ripeness from high-altitude Coorg plantations, our AA Grade Arabica Coffee Beans represent the pinnacle of artisanal shade-grown coffee.\n\nProcessed with mountain spring water and sun-dried on brick patios, these beans yield a refined cup bursting with delicate fragrance, caramel notes, and gentle chocolate sweetness.\n\nChoose between Medium Roast for crisp, vibrant clarity, or Dark Roast for rich dark chocolate tones and deep body.\n\nSpecial shipping: ₹70 for 500g, ₹60 for 1kg, and FREE DELIVERY on orders over 5kg.',
    whyYoullLoveIt: [
      '100% AA Grade Arabica whole beans',
      'Choice of Medium Roast or Dark Roast profile',
      'Naturally sweet with subtle notes of caramel & cocoa',
      'Cultivated at 4,000+ feet shade elevation',
      'Freshly roasted in micro batches',
      'Free delivery on bulk orders above 5 kg',
    ],
    bestFor: [
      'Fresh home grinding',
      'Pour-over & Chemex',
      'French press',
      'Espresso & Aeropress',
    ],
    badges: ['AA Grade Certified', 'Medium & Dark Roast', 'Direct From Estate'],
    roastLevel: 'Medium',
    roastOptions: ['Medium Roast', 'Dark Roast'],
    grindOptions: [
      'Whole Beans',
      'Freshly Ground for Filter',
    ],
    categoryId: 'cat-beans',
    categoryName: 'AA Grade Beans',
    images: ['/products/arabica-coffee-beans.jpg?v=4'],
    ratingAvg: 4.95,
    ratingCount: 184,
    featured: true,
    accentColor: 'green',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-ara-bns-500',
        productId: 'prod-arabica-beans',
        label: '500g Pack',
        sku: 'CC-AA-ARA-BNS-500',
        price: 699,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-ara-bns-1000',
        productId: 'prod-arabica-beans',
        label: '1kg Bulk Pack',
        sku: 'CC-AA-ARA-BNS-1000',
        price: 1299,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // 2. AA Grade Robusta Beans (Medium & Dark Roast)
  {
    id: 'prod-robusta-beans',
    name: 'AA Grade Robusta Beans',
    slug: 'aa-grade-robusta-coffee-beans',
    aliases: ['premium-robusta-coffee-beans', 'robusta-beans'],
    tagline: 'Medium & Dark Roast • Bold Body & Dense Golden Crema',
    shortDescription:
      'Estate-grown AA grade Robusta beans with an intense aroma, full body, and thick golden crema. Available in Medium and Dark Roast.',
    description:
      'Grown amidst pepper vines and silver oaks in Coorg ridges, our AA Grade Robusta Coffee Beans deliver an intense, punchy brew packed with natural caffeine and thick crema.\n\nSelect your roast preference: Medium Roast brings out spicy hazelnut nuances with smooth body, while Dark Roast delivers a smoky, chocolatey punch that pairs spectacularly with hot milk.\n\nSpecial shipping: ₹70 for 500g, ₹60 for 1kg, and FREE DELIVERY on orders over 5kg.',
    whyYoullLoveIt: [
      'Heavy-bodied AA grade Robusta whole beans',
      'Choice of Medium Roast or Dark Roast profile',
      'Rich, long-lasting golden crema',
      'Higher natural caffeine for powerful morning alertness',
      'Pairs wonderfully with fresh milk and jaggery',
      'Free delivery on orders above 5 kg',
    ],
    bestFor: [
      'South Indian filter coffee',
      'Espresso machines',
      'Moka pot stovetop',
      'Strong morning brews',
    ],
    badges: ['AA Grade Robusta', 'Thick Crema', 'Artisanal Dark Roast'],
    roastLevel: 'Dark',
    roastOptions: ['Medium Roast', 'Dark Roast'],
    grindOptions: [
      'Whole Beans',
      'Freshly Ground for Filter',
    ],
    categoryId: 'cat-beans',
    categoryName: 'AA Grade Beans',
    images: ['/products/robusta-coffee-beans.jpg?v=4'],
    ratingAvg: 4.88,
    ratingCount: 142,
    featured: true,
    accentColor: 'amber',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-rob-bns-500',
        productId: 'prod-robusta-beans',
        label: '500g Pack',
        sku: 'CC-AA-ROB-BNS-500',
        price: 599,
        salePrice: null,
        stock: 55,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-rob-bns-1000',
        productId: 'prod-robusta-beans',
        label: '1kg Bulk Pack',
        sku: 'CC-AA-ROB-BNS-1000',
        price: 1100,
        salePrice: null,
        stock: 35,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // 3. Blend Roasted Beans (80% Arabica, 20% Robusta)
  {
    id: 'prod-blend-roasted-beans',
    name: 'Blend Roasted Beans',
    slug: 'blend-roasted-coffee-beans',
    aliases: ['blend-roasted-beans', 'estate-special-blend'],
    tagline: '80% Arabica, 20% Robusta • Balanced Aroma & Velvety Crema',
    shortDescription:
      'Master blend of 80% shade-grown Arabica for fragrance and 20% AA Robusta for body and crema. Available in Medium and Dark Roast.',
    description:
      'The golden ratio of artisan coffee roasting. Our Blend Roasted Coffee Beans combine 80% delicate estate Arabica with 20% bold Coorg Robusta, striking the ideal balance between sweet aromatics and satisfying body.\n\nEvery batch is slow-roasted in micro-lots to develop a luscious caramel sweetness with just enough punch to cut through milk.\n\nAvailable in Medium Roast (for nuanced citrus & milk chocolate notes) or Dark Roast (for toasted nuts & cocoa fudge).',
    whyYoullLoveIt: [
      '80% Arabica & 20% Robusta master proportion',
      'Available in Medium and Dark roast levels',
      'Creamy mouthfeel with balanced acidity and sweetness',
      'Designed for espresso machines and manual filter brewers',
      'Aromatic valve pack keeps roast freshness sealed',
    ],
    bestFor: [
      'Espresso & Americano',
      'Cappuccino & Flat White',
      'Filter coffee',
      'Cold brew',
    ],
    badges: ['80:20 Master Blend', 'Medium & Dark Roast', 'Artisan Roasted'],
    roastLevel: 'Medium-Dark',
    roastOptions: ['Medium Roast', 'Dark Roast'],
    grindOptions: [
      'Whole Beans',
      'Freshly Ground for Filter',
    ],
    categoryId: 'cat-beans',
    categoryName: 'AA Grade Beans',
    images: ['/products/blend-roasted-beans.jpg?v=5'],
    ratingAvg: 4.96,
    ratingCount: 168,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-01-14T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-bld-bns-500',
        productId: 'prod-blend-roasted-beans',
        label: '500g Pack',
        sku: 'CC-BLD-BNS-500',
        price: 650,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-bld-bns-1000',
        productId: 'prod-blend-roasted-beans',
        label: '1kg Bulk Pack',
        sku: 'CC-BLD-BNS-1000',
        price: 1250,
        salePrice: null,
        stock: 30,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // 4. 100% Arabica Coffee Powder
  {
    id: 'prod-arabica-powder',
    name: '100% Arabica Coffee Powder',
    slug: 'arabica-coffee-powder',
    aliases: ['premium-arabica-coffee-powder', 'coorg-arabica-filter-coffee'],
    tagline: '100% Pure Plantation Arabica • Smooth, Aromatic & Gentle',
    shortDescription:
      'Pure 100% Arabica ground coffee with zero chicory. Smooth, fragrant, and gentle with notes of dark honey, brown sugar, and toasted almonds.',
    description:
      'For pure coffee purists who want nothing between their cup and 100% estate Arabica. Our 100% Arabica Coffee Powder contains zero chicory, zero additives—just pure, freshly milled plantation coffee beans.\n\nGround precisely to release aromatic oils and delicate fruity-floral notes, it produces a mild, comforting cup that goes down silky smooth.\n\nSpecial shipping: ₹70 for 500g, ₹60 for 1kg, and FREE DELIVERY on orders over 5kg.',
    whyYoullLoveIt: [
      '100% pure Arabica, zero chicory',
      'Naturally sweet and gentle on sensitive stomachs',
      'Delicate honey, toasted hazelnut, and cocoa aroma',
      'Freshly milled and vacuum valve sealed',
      'Free shipping on orders above 5 kg',
    ],
    bestFor: [
      'South Indian filter coffee (pure decoction)',
      'Traditional drip brewing',
      'Black coffee enthusiasts',
    ],
    badges: ['100% Pure Arabica', 'Zero Chicory', 'Single Origin'],
    roastLevel: 'Medium',
    grindOptions: [
      'South Indian Filter Grind',
      'Traditional Drip Grind',
    ],
    categoryId: 'cat-powder',
    categoryName: '100% Coffee Powder',
    images: ['/products/arabica-coffee-powder.jpg?v=4'],
    ratingAvg: 4.93,
    ratingCount: 195,
    featured: true,
    accentColor: 'green',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-ara-pow-500',
        productId: 'prod-arabica-powder',
        label: '500g Pack',
        sku: 'CC-ARA-POW-500',
        price: 699,
        salePrice: null,
        stock: 65,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-ara-pow-1000',
        productId: 'prod-arabica-powder',
        label: '1kg Bulk Pack',
        sku: 'CC-ARA-POW-1000',
        price: 1299,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // 5. 100% Robusta Coffee Powder
  {
    id: 'prod-robusta-powder',
    name: '100% Robusta Coffee Powder',
    slug: 'robusta-coffee-powder',
    aliases: ['premium-robusta-coffee-powder', 'coorg-dark-roast-robusta'],
    tagline: '100% Pure Robusta • Bold, Strong & Full-Bodied',
    shortDescription:
      '100% pure shade-grown Robusta ground powder with no chicory. Creates a thick, full-bodied brew with dark cocoa finish and deep coffee kick.',
    description:
      'Bold, unapologetic, and packed with flavour. Our 100% Robusta Coffee Powder is made entirely from select Coorg Robusta beans, medium-dark roasted to caramel perfection.\n\nWith double the antioxidants and natural caffeine of Arabica, this coffee yields an intoxicating roasty aroma and a thick, velvety cup that stands up boldly to milk and sugar.\n\nSpecial shipping: ₹70 for 500g, ₹60 for 1kg, and FREE DELIVERY on orders over 5kg.',
    whyYoullLoveIt: [
      '100% pure Robusta coffee, zero chicory',
      'Punchy, full-bodied strength and deep crema',
      'Pronounced notes of dark chocolate and malt',
      'Superb base for strong morning milk coffees',
      'Free shipping on orders above 5 kg',
    ],
    bestFor: [
      'Strong South Indian filter coffee',
      'Traditional drip brewing',
      'Milk-based morning cups',
      'High-energy brew',
    ],
    badges: ['100% Pure Robusta', 'Bold & Intense', 'Shade Grown'],
    roastLevel: 'Medium-Dark',
    grindOptions: [
      'South Indian Filter Grind',
      'Traditional Drip Grind',
    ],
    categoryId: 'cat-powder',
    categoryName: '100% Coffee Powder',
    images: ['/products/robusta-coffee-powder.jpg?v=4'],
    ratingAvg: 4.87,
    ratingCount: 162,
    featured: true,
    accentColor: 'amber',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-16T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-rob-pow-500',
        productId: 'prod-robusta-powder',
        label: '500g Pack',
        sku: 'CC-ROB-POW-500',
        price: 599,
        salePrice: null,
        stock: 70,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-rob-pow-1000',
        productId: 'prod-robusta-powder',
        label: '1kg Bulk Pack',
        sku: 'CC-ROB-POW-1000',
        price: 1100,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // 6. Arabica Filter Coffee (80% coffee 20% chicory)
  {
    id: 'prod-arabica-filter-coffee',
    name: 'Arabica Filter Coffee (80:20)',
    slug: 'arabica-filter-coffee',
    tagline: '80% Arabica, 20% Chicory • Gentle Aromatics & Silky Decoction',
    shortDescription:
      'Classic South Indian filter coffee blend crafted from 80% estate Arabica and 20% roasted French chicory. Smooth, rich, and fragrant with a caramel crown.',
    description:
      'The refined gentleman of South Indian filter coffees. Combining 80% fragrant shade-grown Arabica with 20% high-grade roasted chicory, this blend yields a thick, golden-brown decoction without any astringency or harsh bitterness.\n\nWhen poured between brass dabarah and tumbler with foaming hot milk, it produces a silky head of froth and an irresistible cardamom-caramel estate aroma.\n\nEnjoy FREE DELIVERY on the 1kg pack! (500g: ₹599 + ₹60 delivery)',
    whyYoullLoveIt: [
      '80% Arabica & 20% high-grade roasted chicory',
      'Thick decoction that stays fragrant in milk',
      'Milder acidity with natural caramel sweetness',
      'FREE DELIVERY on 1kg pack',
      'Pan-India delivery straight from Madikeri estate',
    ],
    bestFor: [
      'Traditional South Indian filter coffee',
      'Degree coffee in brass dabarah',
      'Smooth afternoon milk coffee',
    ],
    badges: ['80:20 Arabica Filter', 'Heritage Recipe', 'South Indian Classic'],
    roastLevel: 'Medium-Dark',
    grindOptions: [
      'South Indian Filter Grind',
      'Traditional Drip Grind',
    ],
    categoryId: 'cat-filter',
    categoryName: 'Filter Coffee (80:20)',
    images: ['/products/arabica-filter-coffee.jpg?v=5'],
    ratingAvg: 4.94,
    ratingCount: 178,
    featured: true,
    accentColor: 'green',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-ara-flt-500',
        productId: 'prod-arabica-filter-coffee',
        label: '500g Pack',
        sku: 'CC-ARA-FLT-500',
        price: 599,
        salePrice: null,
        stock: 60,
        active: true,
        weightGrams: 500,
        deliveryFee: 60,
      },
      {
        variantId: 'var-ara-flt-1000',
        productId: 'prod-arabica-filter-coffee',
        label: '1kg Bulk Pack',
        sku: 'CC-ARA-FLT-1000',
        price: 1100,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 1000,
        deliveryFee: 0,
      },
    ],
  },

  // 7. Robusta Filter Coffee (80% coffee 20% chicory)
  {
    id: 'prod-robusta-filter-coffee',
    name: 'Robusta Filter Coffee (80:20)',
    slug: 'robusta-filter-coffee',
    tagline: '80% Robusta, 20% Chicory • Deep Crema & Unmatched Strong Kick',
    shortDescription:
      'Traditional strong South Indian filter coffee blend: 80% dark roasted Robusta paired with 20% roasted chicory for a rich, thick decoction and strong taste.',
    description:
      'Engineered for those who want their filter coffee strong, dark, and lingering. We blend 80% heavy-bodied Coorg Robusta with 20% roasted chicory root to produce an unbeatably thick, dark decoction with rich molasses and toasted hazelnut depth.\n\nA single ounce of decoction transforms hot milk into an authentic hotel-style Madras filter coffee. Long-lasting aroma and intense satisfaction.\n\nEnjoy FREE DELIVERY on the 1kg pack! (500g: ₹550 + ₹60 delivery)',
    whyYoullLoveIt: [
      '80% bold Robusta & 20% roasted chicory',
      'Extra-thick decoction with dark caramel undertones',
      'The classic strong South Indian hotel-style cup',
      'FREE DELIVERY on 1kg pack',
      'Rich golden crema in every pour',
    ],
    bestFor: [
      'Strong South Indian filter coffee',
      'Hotel-style foaming meter kaapi',
      'Early morning energy',
    ],
    badges: ['80:20 Robusta Filter', 'Slow Roasted', 'Bold Decoction'],
    roastLevel: 'Dark',
    grindOptions: [
      'South Indian Filter Grind',
      'Traditional Drip Grind',
    ],
    categoryId: 'cat-filter',
    categoryName: 'Filter Coffee (80:20)',
    images: ['/products/robusta-filter-coffee.jpg?v=5'],
    ratingAvg: 4.91,
    ratingCount: 188,
    featured: true,
    accentColor: 'brown',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-rob-flt-500',
        productId: 'prod-robusta-filter-coffee',
        label: '500g Pack',
        sku: 'CC-ROB-FLT-500',
        price: 550,
        salePrice: null,
        stock: 80,
        active: true,
        weightGrams: 500,
        deliveryFee: 60,
      },
      {
        variantId: 'var-rob-flt-1000',
        productId: 'prod-robusta-filter-coffee',
        label: '1kg Bulk Pack',
        sku: 'CC-ROB-FLT-1000',
        price: 999,
        salePrice: null,
        stock: 60,
        active: true,
        weightGrams: 1000,
        deliveryFee: 0,
      },
    ],
  },

  // 8. Coorg Mist Blend Filter Coffee (Arabica 40%, Robusta 40%, chicory 20%)
  {
    id: 'prod-coorg-mist-blend',
    name: 'Coorg Mist Blend Filter Coffee (40:40:20)',
    slug: 'coorg-mist-blend-filter-coffee',
    aliases: ['coorg-mist-blend'],
    tagline: '40% Arabica, 40% Robusta, 20% Chicory • Heritage Estate Formula',
    shortDescription:
      'The signature estate blend of Kodagu. 40% fragrant Arabica, 40% punchy Robusta, and 20% chicory roasted together for the ultimate balanced cup.',
    description:
      'Our crowning achievement and beloved recipe passed down through generations in Coorg. The Coorg Mist Blend brings together 40% shade-grown Arabica for fragrant floral sweetness, 40% hearty Robusta for thick body and crema, and 20% French chicory for a rich, viscous decoction.\n\nEvery morning across the misty valleys of Madikeri, this is the coffee that fills homes with warmth. Deep, velvety, perfectly balanced, and delightfully aromatic.\n\nEnjoy FREE DELIVERY on the 1kg pack! (500g: ₹560 + ₹60 delivery)',
    whyYoullLoveIt: [
      'Signature 40% Arabica + 40% Robusta + 20% Chicory formula',
      'Perfect harmony of intoxicating aroma and deep strength',
      'Unrivalled head of foam with boiled milk',
      'FREE DELIVERY on 1kg pack',
      'Coorg heritage roast recipe',
    ],
    bestFor: [
      'The definitive South Indian filter coffee',
      'Family breakfast mornings',
      'Gifting to coffee connoisseurs',
    ],
    badges: ['Heritage 40:40:20 Blend', 'Madikeri Harvest', 'Estate Signature'],
    roastLevel: 'Medium-Dark',
    grindOptions: [
      'South Indian Filter Grind',
      'Traditional Drip Grind',
    ],
    categoryId: 'cat-filter',
    categoryName: 'Filter Coffee (80:20)',
    images: ['/products/coorg-mist-blend-filter-coffee.jpg?v=5'],
    ratingAvg: 4.98,
    ratingCount: 236,
    featured: true,
    accentColor: 'amber',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-22T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-mst-flt-500',
        productId: 'prod-coorg-mist-blend',
        label: '500g Pack',
        sku: 'CC-MST-FLT-500',
        price: 560,
        salePrice: null,
        stock: 90,
        active: true,
        weightGrams: 500,
        deliveryFee: 60,
      },
      {
        variantId: 'var-mst-flt-1000',
        productId: 'prod-coorg-mist-blend',
        label: '1kg Bulk Pack',
        sku: 'CC-MST-FLT-1000',
        price: 999,
        salePrice: null,
        stock: 75,
        active: true,
        weightGrams: 1000,
        deliveryFee: 0,
      },
    ],
  },

  // 9. Espresso Coffee Powder
  {
    id: 'prod-espresso-powder',
    name: 'Espresso Coffee Powder',
    slug: 'espresso-coffee-powder',
    tagline: 'Fine Espresso Grind • Dense Hazelnut Crema & Intense Extraction',
    shortDescription:
      'Finely ground dark roast coffee powder formulated specifically for home and commercial espresso machines. Delivers a rich, syrup-like body with thick crema.',
    description:
      'Crafted for the modern coffee aficionado who appreciates a punchy shot of espresso. Our Espresso Coffee Powder is roasted dark and ground to an ultra-precise fine consistency to ensure optimal water pressure resistance and uniform 25-30 second extractions.\n\nYields a dense, velvety crema with flavour notes of bittersweet dark chocolate, roasted almond, and black cherry. Exceptional as a straight double shot or as the foundation for lattes, flat whites, and iced Americanos.\n\nSpecial shipping: ₹70 for 500g, ₹60 for 1kg.',
    whyYoullLoveIt: [
      'Calibrated fine grind size for espresso baskets',
      'Dark roasted for thick syrup viscosity and golden crema',
      'Bold notes of dark cocoa and toasted hazelnut',
      'Free shipping on bulk orders above 5 kg',
    ],
    bestFor: [
      'Espresso portafilters & machines',
      'Lattes, cappuccinos & flat whites',
      'Iced espresso tonics',
    ],
    badges: ['Fine Espresso Grind', 'Intense Crema', 'Dark Roast'],
    roastLevel: 'Dark',
    grindOptions: [
      'Fine Espresso Grind',
      'Manual Lever Machine Grind',
    ],
    categoryId: 'cat-filter',
    categoryName: 'Filter Coffee Powder',
    images: ['/products/espresso-coffee-powder.jpg?v=5'],
    ratingAvg: 4.92,
    ratingCount: 135,
    featured: true,
    accentColor: 'amber',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-esp-pow-500',
        productId: 'prod-espresso-powder',
        label: '500g Pack',
        sku: 'CC-ESP-POW-500',
        price: 699,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-esp-pow-1000',
        productId: 'prod-espresso-powder',
        label: '1kg Bulk Pack',
        sku: 'CC-ESP-POW-1000',
        price: 1299,
        salePrice: null,
        stock: 35,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // 10. Moka Pot Coffee Powder
  {
    id: 'prod-moka-pot-powder',
    name: 'Moka Pot Coffee Powder',
    slug: 'moka-pot-coffee-powder',
    tagline: 'Medium-Fine Stovetop Grind • Rich, Syrupy Italian-Style Brew',
    shortDescription:
      'Specially calibrated medium-fine grind powder engineered specifically for Bialetti and stovetop Moka pots. Zero channeling, rich aroma, and smooth strength.',
    description:
      'Brewing with a classic Moka pot requires the exact right grind size: too fine and it chokes; too coarse and it tastes watery. Our Moka Pot Coffee Powder is custom-milled to the ideal medium-fine consistency for stovetop steam brewing.\n\nRoasted to a rich medium-dark profile, it produces a syrupy, concentrated coffee with notes of dark cacao, warm spices, and toffee. Perfect for starting your morning with the comforting gurgle of the stovetop pot.\n\nSpecial shipping: ₹70 for 500g, ₹60 for 1kg.',
    whyYoullLoveIt: [
      'Precisely calibrated grind prevents clogging & bitterness',
      'Rich, syrupy stovetop extraction',
      'Warm notes of dark cacao, toffee, and spice',
      'Free shipping on bulk orders above 5 kg',
    ],
    bestFor: [
      'Stovetop Moka Pots (Bialetti & stainless steel)',
      'Syrupy café-style Americanos',
      'Rich milk coffee drinks',
    ],
    badges: ['Moka Pot Calibrated', 'Stovetop Specialty', 'Medium-Dark Roast'],
    roastLevel: 'Medium-Dark',
    grindOptions: [
      'Medium-Fine Moka Grind',
      'Bialetti Stovetop Grind',
    ],
    categoryId: 'cat-filter',
    categoryName: 'Filter Coffee Powder',
    images: ['/products/moka-pot-coffee-powder.jpg?v=5'],
    ratingAvg: 4.90,
    ratingCount: 119,
    featured: true,
    accentColor: 'brown',
    active: true,
    freeShippingAboveKg: 5,
    createdAt: '2026-01-28T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
    variants: [
      {
        variantId: 'var-mok-pow-500',
        productId: 'prod-moka-pot-powder',
        label: '500g Pack',
        sku: 'CC-MOK-POW-500',
        price: 699,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 500,
        deliveryFee: 70,
      },
      {
        variantId: 'var-mok-pow-1000',
        productId: 'prod-moka-pot-powder',
        label: '1kg Bulk Pack',
        sku: 'CC-MOK-POW-1000',
        price: 1299,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 1000,
        deliveryFee: 60,
      },
    ],
  },

  // ==================== ARTISANAL COORG CHOCOLATES ====================
  // 11. Premium Milk Cashew Chocolate
  {
    id: 'prod-milk-cashew-choco',
    name: 'Premium Milk Cashew Chocolate',
    slug: 'premium-milk-cashew-chocolate',
    aliases: ['milk-cashew-chocolate', 'milk-cashew'],
    tagline: 'Creamy Chocolate Meets Crunchy Cashew! 🍫',
    shortDescription:
      'Enjoy the rich and creamy taste of premium milk chocolate loaded with crunchy golden roasted cashew nuts.',
    description: `Enjoy the rich and creamy taste of premium milk chocolate from the hills of Coorg.

Handcrafted with generational chocolate-making mastery, our Premium Milk Cashew Chocolate blends velvety smooth milk chocolate with whole roasted cashews for the perfect balance of melt-in-the-mouth sweetness and nutty crunch.

Crafted with no artificial preservatives, this chocolate is an irresistible treat for chocolate lovers of all ages and makes a delightful gift from the land of mist and honey.`,
    whyYoullLoveIt: [
      'Velvety smooth premium milk chocolate base',
      'Loaded with crunchy roasted whole cashew nuts',
      'Generational Coorg artisanal chocolate craftsmanship',
      '250g generous seal-lock freshness tub',
      'Perfect for gifting and festive celebrations',
    ],
    bestFor: [
      'Everyday sweet indulgence',
      'Festive & family gifting',
      'Pairing with hot Coorg filter coffee',
    ],
    badges: ['Best Seller', 'Crunchy Cashew', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/milk-cashew.jpg?v=20261114v2'],
    ratingAvg: 4.96,
    ratingCount: 142,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-milk-cashew-250',
        productId: 'prod-milk-cashew-choco',
        label: '250g Tub',
        sku: 'CC-CHOC-MLK-CSH-250',
        price: 350,
        salePrice: null,
        stock: 60,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 12. Milk Vanilla Cashew Chocolate
  {
    id: 'prod-milk-vanilla-cashew-choco',
    name: 'Milk Vanilla Cashew Chocolate',
    slug: 'milk-vanilla-cashew-chocolate',
    aliases: ['vanilla-cashew-chocolate', 'milk-vanilla-cashew'],
    tagline: 'Creamy Vanilla, Crunchy Cashew, Pure Chocolate Happiness! 🍫',
    shortDescription:
      'Dual-layered bliss combining sweet Madagascan-style vanilla cream with rich milk chocolate and roasted cashews.',
    description: `A harmonious fusion of creamy vanilla and rich milk chocolate.

Our Milk Vanilla Cashew Chocolate features an artisanal dual-layer structure: smooth white vanilla chocolate layered over rich milk chocolate, studded throughout with crispy roasted cashew nuts.

Each bite delivers a symphony of aromatic vanilla sweetness, smooth dairy chocolate, and satisfying nutty crunch.`,
    whyYoullLoveIt: [
      'Artisanal dual-layer milk and vanilla chocolate profile',
      'Rich aromatic vanilla infusion',
      'Crunchy roasted cashew pieces in every bite',
      'Sealed in 250g reusable airtight tub',
    ],
    bestFor: [
      'Vanilla & white chocolate lovers',
      'After-dinner dessert treats',
      'Gift hampers & celebrations',
    ],
    badges: ['Dual Layer Delight', 'Creamy Vanilla', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/milk-vanilla-cashew.jpg?v=20261114v2'],
    ratingAvg: 4.94,
    ratingCount: 118,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-van-cashew-250',
        productId: 'prod-milk-vanilla-cashew-choco',
        label: '250g Tub',
        sku: 'CC-CHOC-VAN-CSH-250',
        price: 360,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 13. Premium Mango White Chocolate
  {
    id: 'prod-mango-white-choco',
    name: 'Premium Mango White Chocolate',
    slug: 'premium-mango-white-chocolate',
    aliases: ['mango-white-chocolate', 'mango-chocolate'],
    tagline: 'A Taste of Tropical Mango in Every Bite! 🥭',
    shortDescription:
      'Vibrant golden mango-infused creamy white chocolate cubes bursting with luscious tropical sweetness.',
    description: `Transport your senses to tropical orchards with our Premium Mango White Chocolate.

Infused with natural ripe mango essence, this golden yellow chocolate marries rich, buttery white cocoa butter with the tangy sweetness of sun-ripened tropical mangoes.

Cut into generous artisan cubes that melt smoothly on your tongue, it is an exotic, refreshing spin on gourmet chocolate.`,
    whyYoullLoveIt: [
      'Sun-ripened natural mango tropical flavor profile',
      'Creamy white chocolate cocoa butter melt',
      'Striking golden mango yellow color',
      '250g tamper-evident sealed tub',
    ],
    bestFor: [
      'Tropical fruit & mango lovers',
      'Unique gifting surprise',
      'Kids & dessert platters',
    ],
    badges: ['Tropical Favorite', 'Real Mango Flavor', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/mango-white.jpg?v=20261114v2'],
    ratingAvg: 4.98,
    ratingCount: 165,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-mango-white-250',
        productId: 'prod-mango-white-choco',
        label: '250g Tub',
        sku: 'CC-CHOC-MNG-WHT-250',
        price: 375,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 14. Premium Dark Cashew Chocolate
  {
    id: 'prod-dark-cashew-choco',
    name: 'Premium Dark Cashew Chocolate',
    slug: 'premium-dark-cashew-chocolate',
    aliases: ['dark-cashew-chocolate', 'dark-cashew'],
    tagline: 'Bold Dark Chocolate, Crunchy Cashew, Pure Happiness! 🍫',
    shortDescription:
      'Intense high-cocoa dark chocolate paired with crisp hand-roasted cashew nuts for a sophisticated bittersweet bite.',
    description: `For the discerning dark chocolate connoisseur.

Our Premium Dark Cashew Chocolate pairs bold, deep dark cocoa with crunchy, golden-roasted cashew nuts sourced directly from South Indian estates.

The deep roasted cocoa profile tempers the natural sweetness, creating a complex, satisfying bittersweet flavor that lingers delightfully.

Net Weight: 250g (Price per 100g: ₹144/-).`,
    whyYoullLoveIt: [
      'Deep, antioxidant-rich dark cocoa blend',
      'Generously embedded with roasted whole cashew nuts',
      'Balanced bittersweet profile with low sugar perception',
      '250g resealable freshness pack',
    ],
    bestFor: [
      'Dark chocolate aficionados',
      'Pairing with dark roast espresso',
      'Healthy conscious snacking',
    ],
    badges: ['Bold Cocoa', 'Roasted Cashew', '₹144/100g'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/dark-cashew.jpg?v=20261114v2'],
    ratingAvg: 4.95,
    ratingCount: 130,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-dark-cashew-250',
        productId: 'prod-dark-cashew-choco',
        label: '250g Tub',
        sku: 'CC-CHOC-DRK-CSH-250',
        price: 350,
        salePrice: null,
        stock: 55,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 15. Premium Dark Sugar-Free Chocolate
  {
    id: 'prod-dark-sugar-free-choco',
    name: 'Premium Dark Sugar-Free Chocolate',
    slug: 'premium-dark-sugar-free-chocolate',
    aliases: ['sugar-free-dark-chocolate', 'sugar-free-chocolate'],
    tagline: 'Pure Dark Indulgence, Without Added Sugar! 🍫',
    shortDescription:
      'Zero added sugar, 100% pure dark chocolate satisfaction. Guilt-free artisanal dark chocolate triangles.',
    description: `Indulge without compromise with our Premium Dark Sugar-Free Chocolate.

Crafted specifically for diabetic-friendly, keto, and health-conscious lifestyles, this chocolate offers the full aromatic intensity of fine estate dark cocoa without any added refined sugar.

Each triangular artisan piece provides pure cocoa richness and silky mouthfeel, letting the authentic flavor of the cocoa bean take center stage.

Net Weight: 150g (Price per 100g: ₹256.67).`,
    whyYoullLoveIt: [
      'Zero added sugar formula',
      'Rich dark cocoa with zero bitter aftertaste',
      'Diabetic-friendly & keto compatible',
      '150g freshness-sealed tub',
    ],
    bestFor: [
      'Diabetic & keto diets',
      'Calorie-conscious dark chocolate fans',
      'Clean eating lifestyles',
    ],
    badges: ['Zero Added Sugar', 'Keto Friendly', '150g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/dark-sugar-free.jpg?v=20261114v2'],
    ratingAvg: 4.93,
    ratingCount: 94,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-dark-sugar-free-150',
        productId: 'prod-dark-sugar-free-choco',
        label: '150g Tub',
        sku: 'CC-CHOC-DRK-SF-150',
        price: 385,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 150,
        deliveryFee: 70,
      },
    ],
  },

  // 16. Premium Dark Chocolate Crispy Balls
  {
    id: 'prod-dark-crispy-balls',
    name: 'Premium Dark Chocolate Crispy Balls',
    slug: 'premium-dark-chocolate-crispy-balls',
    aliases: ['dark-crispy-balls', 'crispy-dark-balls'],
    tagline: 'Crunchy on the Inside, Rich Chocolate on the Outside! 🍫',
    shortDescription:
      'Malted crispy cereal centers enrobed in thick layers of decadent dark chocolate. The ultimate crunch snack!',
    description: `COORG COFFEE — Crunch Into Happiness!

Our Premium Dark Chocolate Crispy Balls bring together the satisfying crunch of toasted malted cereal centers wrapped in a thick, velvety shell of premium dark chocolate.

Light, airy, yet deeply chocolaty, they are impossibly addictive and impossible to stop at just one.

Net Weight: 250g (Price per 100g: ₹178/-).`,
    whyYoullLoveIt: [
      'Ultra-crunchy toasted malted core',
      'Generous thick enrobing of dark chocolate',
      'Bite-sized snacking perfection',
      '250g party-ready sharing tub',
    ],
    bestFor: [
      'Movie night & binge snacking',
      'Kids & party dessert toppings',
      'Coffee table snacks',
    ],
    badges: ['Crunchy Sensation', 'Dark Enrobed', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/dark-crispy-balls.jpg?v=20261114v2'],
    ratingAvg: 4.97,
    ratingCount: 152,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-dark-crispy-balls-250',
        productId: 'prod-dark-crispy-balls',
        label: '250g Tub',
        sku: 'CC-CHOC-DRK-BALLS-250',
        price: 445,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 17. Premium Mixed Assorted Chocolates
  {
    id: 'prod-mixed-assorted-choco',
    name: 'Premium Mixed Assorted Chocolates',
    slug: 'premium-mixed-assorted-chocolates',
    aliases: ['mixed-assorted-chocolates', 'assorted-chocolates'],
    tagline: 'A World of Chocolate Flavours in Every Box! 🍫',
    shortDescription:
      'The grand variety box featuring milk cashew, dark cashew, vanilla layers, and tropical fruit bites.',
    description: `Can’t choose just one? Experience the complete Coorg chocolate collection in one stunning box.

Our Premium Mixed Assorted Chocolates combine hand-selected pieces from our entire chocolate range: rich milk cashew, intense dark cashew, dual-layer vanilla, and fruity tropical bites.

Every piece offers a distinct texture and flavor profile, making this the crown jewel for gifting.

Net Weight: 250g (Price per 100g: ₹142/-).`,
    whyYoullLoveIt: [
      'Hand-selected variety of milk, dark, vanilla & fruit chocolates',
      'Assorted textures: nutty, creamy, and layered',
      'Unmatched variety for the whole family',
      '250g presentation gift tub',
    ],
    bestFor: [
      'The ultimate chocolate gift',
      'Tasting & sampling multiple flavors',
      'Dinner parties & family sharing',
    ],
    badges: ['Grand Assortment', 'All Flavors In One', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/mixed-assorted.jpg?v=20261114v2'],
    ratingAvg: 4.99,
    ratingCount: 210,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-mixed-assorted-250',
        productId: 'prod-mixed-assorted-choco',
        label: '250g Tub',
        sku: 'CC-CHOC-ASSRT-250',
        price: 355,
        salePrice: null,
        stock: 65,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 18. Premium Blackcurrant Chocolate
  {
    id: 'prod-blackcurrant-choco',
    name: 'Premium Blackcurrant Chocolate',
    slug: 'premium-blackcurrant-chocolate',
    aliases: ['blackcurrant-chocolate', 'purple-chocolate'],
    tagline: 'A Burst of Berry Goodness in Every Bite! 💜',
    shortDescription:
      'Exquisite purple chocolate infused with tangy wild blackcurrants and creamy cocoa butter.',
    description: `COORG COFFEE — Taste the Colour of Happiness!

Crafted for fruit and berry enthusiasts, our Premium Blackcurrant Chocolate features an eye-catching royal purple hue and an explosion of tangy, sweet European-style blackcurrant berries.

The natural berry tartness harmonizes seamlessly with rich cocoa butter, creating a refreshing sweet-tart chocolate experience like no other.

Net Weight: 250g (Price per 100g: ₹152/-).`,
    whyYoullLoveIt: [
      'Vibrant natural royal purple chocolate aesthetic',
      'Sweet & tangy blackcurrant berry burst',
      'Silky smooth cocoa butter melt',
      '250g airtight freshness tub',
    ],
    bestFor: [
      'Berry & dark fruit lovers',
      'Instagrammable dessert platters',
      'Unique gourmet gift hampers',
    ],
    badges: ['Wild Berry Infusion', 'Royal Purple', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/blackcurrant.jpg?v=20261114v2'],
    ratingAvg: 4.96,
    ratingCount: 125,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-blackcurrant-250',
        productId: 'prod-blackcurrant-choco',
        label: '250g Tub',
        sku: 'CC-CHOC-BLKCRNT-250',
        price: 380,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // 19. White Chocolate Crispy Balls
  {
    id: 'prod-white-crispy-balls',
    name: 'White Chocolate Crispy Balls',
    slug: 'white-chocolate-crispy-balls',
    aliases: ['white-crispy-balls', 'crispy-white-balls'],
    tagline: 'Creamy White Chocolate with a Crunchy Surprise! 🤍',
    shortDescription:
      'Golden toasted crispy malt balls smothered in thick, creamy vanilla white chocolate.',
    description: `COORG COFFEE — Indulge in the Creamy Crisp Goodness!

Our White Chocolate Crispy Balls combine an airy, ultra-crisp malted center with a luscious, buttery coat of sweet white chocolate.

Each pearl is delicately smooth on the outside with an addictive snap on the inside. Perfect as a standalone indulgence or sprinkled over ice cream and baked desserts.

Net Weight: 250g (Price per 100g: ₹178/-).`,
    whyYoullLoveIt: [
      'Silky sweet white chocolate enrobing',
      'Crunchy toasted malted center with loud snap',
      'Gourmet ice cream & cake topper',
      '250g freshness sealed tub',
    ],
    bestFor: [
      'White chocolate fans',
      'Dessert & ice cream decoration',
      'All-day crunchy snacking',
    ],
    badges: ['Crispy Center', 'Creamy White', '250g Tub'],
    roastLevel: 'Artisanal Chocolate',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-chocolates',
    categoryName: 'Artisanal Chocolates',
    images: ['/products/chocolates/white-crispy-balls.jpg?v=20261114v2'],
    ratingAvg: 4.95,
    ratingCount: 138,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-13T00:00:00Z',
    variants: [
      {
        variantId: 'var-white-crispy-balls-250',
        productId: 'prod-white-crispy-balls',
        label: '250g Tub',
        sku: 'CC-CHOC-WHT-BALLS-250',
        price: 445,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 250,
        deliveryFee: 70,
      },
    ],
  },

  // ==================== COORG HOMEMADE FRUIT WINES ====================
  // 20. Coorg Homemade Kiwi Wine
  {
    id: 'prod-kiwi-wine',
    name: 'Coorg Homemade Kiwi Wine',
    slug: 'coorg-homemade-kiwi-wine',
    aliases: ['kiwi-wine', 'coorg-kiwi-wine'],
    tagline: 'Refreshing & Tangy Estate Kiwi Infusion 🥝🍷',
    shortDescription:
      'Crisp, aromatic Coorg homemade kiwi wine naturally fermented from fresh estate kiwi pulp, boiled water, and sprouted grains.',
    description: `Coorg Homemade Kiwi Wine is an authentic Kodagu estate specialty handcrafted in small artisanal batches following traditional Coorg home-brewing methods.

Made from fresh sun-ripened kiwi fruits, pure boiled water, sugar, and sprouted grains, this wine is 100% naturally fermented without added yeast, synthetic colors, or chemical preservatives.

It offers a crisp, lively acidity and bright tropical sweetness, making it a delightfully refreshing beverage for celebratory toasts, gatherings, and festive gifting.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or elegant keepsake glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      '100% natural estate fermentation with zero added alcohol',
      'Made with fresh kiwi fruit, boiled water, sugar & sprouted grains',
      'No added yeast or synthetic preservatives',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'Pan-India delivery straight from the hills of Kodagu',
    ],
    bestFor: [
      'Celebratory toasts & gatherings',
      'Light evening aperitifs',
      'Festive & family gifting from Coorg',
    ],
    badges: ['100% Natural', 'Coorg Homemade', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/kiwi-wine.jpg?v=20261117'],
    ratingAvg: 4.96,
    ratingCount: 142,
    featured: true,
    accentColor: 'green',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-kiwi-wine-plastic-750',
        productId: 'prod-kiwi-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-KIWI-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-kiwi-wine-glass-750',
        productId: 'prod-kiwi-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-KIWI-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },

  // 21. Coorg Homemade Bird Eye Chilli Wine
  {
    id: 'prod-bird-eye-chilli-wine',
    name: 'Coorg Homemade Bird Eye Chilli Wine',
    slug: 'coorg-homemade-bird-eye-chilli-wine',
    aliases: ['bird-eye-chilli-wine', 'chilli-wine'],
    tagline: 'Fiery Zing Meets Sweet Estate Fermentation 🌶️🍷',
    shortDescription:
      'Coorg’s iconic Bird’s Eye Chilli (Parangi Malu) wine. Smooth, naturally sweet with a warm, exhilarating spice kick on the finish.',
    description: `A true Coorg legend and conversation starter! Our Bird Eye Chilli Wine is handcrafted using indigenous Kodagu bird's eye chillies (known locally as Parangi Malu), revered for their intense aromatics and fiery character.

Naturally fermented with pure boiled water, sugar, and sprouted grains, the upfront palate is surprisingly gentle and sweet, followed by a warm, exhilarating warmth that lingers pleasantly.

Sip slowly to appreciate this unique fusion of sweet fruit wine craftsmanship and authentic Western Ghats spice heritage.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or premium glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      'Crafted with native Kodagu bird\'s eye chillies (Parangi Malu)',
      'Sweet initial sip with an invigorating warm spice finish',
      '100% natural estate fermentation without added yeast',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'A one-of-a-kind signature gourmet gift from Coorg',
    ],
    bestFor: [
      'A unique conversation starter for dinner parties',
      'Warm winter evening sipping',
      'Gourmet food pairing with Coorg delicacies',
    ],
    badges: ['Signature Spicy', '100% Natural', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/bird-eye-chilli-wine.jpg?v=20261117'],
    ratingAvg: 4.94,
    ratingCount: 165,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-chilli-wine-plastic-750',
        productId: 'prod-bird-eye-chilli-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-CHLI-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-chilli-wine-glass-750',
        productId: 'prod-bird-eye-chilli-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-CHLI-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 35,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },

  // 22. Coorg Homemade Pepper Wine
  {
    id: 'prod-pepper-wine',
    name: 'Coorg Homemade Pepper Wine',
    slug: 'coorg-homemade-pepper-wine',
    aliases: ['pepper-wine', 'black-pepper-wine'],
    tagline: 'Aromatic Coorg Black Pepper with Warm Spice Notes 🌿🍷',
    shortDescription:
      'Handcrafted from estate black pepper berries. A soothing, aromatic wine with gentle natural sweetness and comforting peppery warmth.',
    description: `Coorg is universally celebrated as the spice bowl of India, and our Pepper Wine pays homage to the legendary black gold of Kodagu.

Hand-harvested green and black pepper vines from shade-grown coffee plantations are steeped and naturally fermented with boiled water, sugar, and sprouted grains.

The result is an aromatic, amber-hued wine that delivers a soothing sweetness balanced by the comforting, therapeutic warmth of pure Malabar pepper.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or premium glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      'Infused with fresh plantation-grown Coorg black pepper',
      'Soothing, comforting warmth with natural sweet balance',
      '100% natural estate fermentation with zero added alcohol',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'Handmade in small seasonal batches in Madikeri',
    ],
    bestFor: [
      'Cool rainy evenings and winter sipping',
      'Digestif after rich traditional meals',
      'Gifting for spice lovers and connoisseurs',
    ],
    badges: ['Estate Spice', '100% Natural', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/pepper-wine.jpg?v=20261117'],
    ratingAvg: 4.92,
    ratingCount: 119,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-pepper-wine-plastic-750',
        productId: 'prod-pepper-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-PEPR-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-pepper-wine-glass-750',
        productId: 'prod-pepper-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-PEPR-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },

  // 23. Coorg Homemade Star Apple Wine
  {
    id: 'prod-star-apple-wine',
    name: 'Coorg Homemade Star Apple Wine',
    slug: 'coorg-homemade-star-apple-wine',
    aliases: ['star-apple-wine', 'star-fruit-wine'],
    tagline: 'Luscious Tropical Star Apple with Gentle Floral Sweetness ⭐🍷',
    shortDescription:
      'Exotic tropical star apple nectar naturally fermented to perfection. Light golden, fragrant, and softly sweet with a delicate floral bouquet.',
    description: `Harvested from sweet tropical star apple (Carambola) trees flourishing in the microclimate of Coorg river valleys.

Our Star Apple Wine captures the delicate floral fragrance and mild tropical tang of golden star fruits. Naturally fermented with pure estate water and sprouted grains, it pours a glowing light-golden hue with an airy, refreshing sweetness.

Exceptionally light and easy to enjoy, it is an exquisite afternoon wine that delights both newcomers and seasoned fruit wine lovers.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or premium glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      'Pure tropical star apple fruit pulp infusion',
      'Delicate floral sweetness with light golden clarity',
      '100% natural estate fermentation without added yeast',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'Zero chemical additives or synthetic flavors',
    ],
    bestFor: [
      'Relaxed afternoon and sunset sipping',
      'Pairing with fresh cheeses and light desserts',
      'Festive celebrations and family hampers',
    ],
    badges: ['Floral & Mild', '100% Natural', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/star-apple-wine.jpg?v=20261117'],
    ratingAvg: 4.95,
    ratingCount: 104,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-star-apple-wine-plastic-750',
        productId: 'prod-star-apple-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-STAR-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 45,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-star-apple-wine-glass-750',
        productId: 'prod-star-apple-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-STAR-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 35,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },

  // 24. Coorg Homemade Red Wine
  {
    id: 'prod-red-wine',
    name: 'Coorg Homemade Red Wine',
    slug: 'coorg-homemade-red-wine',
    aliases: ['red-wine', 'coorg-red-wine'],
    tagline: 'Classic Coorg Heritage Red Wine with Deep Berry Notes 🍇🍷',
    shortDescription:
      'The timeless Kodagu classic. Rich ruby-red wine naturally fermented from select grapes and estate fruit pulp. Smooth, velvety, and sweet.',
    description: `No trip to Kodagu is complete without experiencing authentic Coorg Homemade Red Wine. Handcrafted following treasured family recipes passed down across generations.

Select dark grapes and estate fruit pulp are slowly fermented with boiled water, sugar, and sprouted paddy grains. The result is a full-bodied, deep ruby-red wine bursting with sweet berry richness and a velvety smooth texture.

Generous in flavor and deeply satisfying, it is the quintessential home-brewed wine of the Coorg hills.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or premium glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      'Generational Coorg heritage red wine recipe',
      'Deep ruby-red color with rich natural grape sweetness',
      '100% naturally fermented without added synthetic alcohol',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'Direct estate dispatch from Madikeri',
    ],
    bestFor: [
      'Traditional family dinners and festive toasts',
      'Evening relaxation and weekend unwinding',
      'The classic Coorg estate souvenir gift',
    ],
    badges: ['Heritage Recipe', '100% Natural', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/red-wine.jpg?v=20261117'],
    ratingAvg: 4.98,
    ratingCount: 228,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-red-wine-plastic-750',
        productId: 'prod-red-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-RED-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 60,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-red-wine-glass-750',
        productId: 'prod-red-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-RED-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },

  // 25. Coorg Homemade Mulberry Wine
  {
    id: 'prod-mulberry-wine',
    name: 'Coorg Homemade Mulberry Wine',
    slug: 'coorg-homemade-mulberry-wine',
    aliases: ['mulberry-wine', 'coorg-mulberry-wine'],
    tagline: 'Rich Velvet Mulberry with Deep Wild Berry Aromas 🫐🍷',
    shortDescription:
      'Exquisite royal purple wine handcrafted from ripe Coorg mulberries. Velvety, antioxidant-rich, with balanced sweet and tart notes.',
    description: `Hand-gathered from wild mulberry groves that dot the shaded edges of Coorg coffee estates.

Our Mulberry Wine features a dramatic royal purple-black tint and a velvety mouthfeel. The natural berry tartness of wild mulberries marries gracefully with slow estate fermentation, resulting in an intense, aromatic fruit wine that coats the palate with notes of ripe dark berries and subtle honey.

Rich in natural fruit antioxidants and delightfully smooth from the first sip to the last.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or premium glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      'Crafted with wild hand-gathered Coorg mulberries',
      'Dramatic natural royal purple hue with silky mouthfeel',
      'Naturally fermented with zero added yeast or preservatives',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'Antioxidant-rich artisanal craft beverage',
    ],
    bestFor: [
      'Dark fruit and berry lovers',
      'Dinner party dessert pairings',
      'Luxury festive hampers and celebrations',
    ],
    badges: ['Wild Mulberry', '100% Natural', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/mulberry-wine.jpg?v=20261117'],
    ratingAvg: 4.97,
    ratingCount: 156,
    featured: true,
    accentColor: 'brown',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-mulberry-wine-plastic-750',
        productId: 'prod-mulberry-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-MULB-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 50,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-mulberry-wine-glass-750',
        productId: 'prod-mulberry-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-MULB-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },

  // 26. Coorg Homemade Strawberry Wine
  {
    id: 'prod-strawberry-wine',
    name: 'Coorg Homemade Strawberry Wine',
    slug: 'coorg-homemade-strawberry-wine',
    aliases: ['strawberry-wine', 'coorg-strawberry-wine'],
    tagline: 'Blush Pink Sweetness Bursting with Ripe Strawberry Notes 🍓🍷',
    shortDescription:
      'Delicate blush-toned wine naturally fermented from fresh hill strawberries. Sweet, intensely aromatic, and wonderfully charming.',
    description: `Sweet, romantic, and beautifully fragrant. Our Strawberry Wine is handcrafted using fresh, plump strawberries harvested from high-elevation hill farms.

Fermented slowly with boiled spring water, sugar, and sprouted grains, it develops a captivating blush-rose hue and a bouquet filled with fresh strawberry garden notes.

Smooth and naturally sweet on the tongue, it is an irresistible fruit wine that pairs effortlessly with celebratory toasts and dessert platters.

• Net Volume: 750ml
• Packaging Options: Food-grade plastic bottle (₹499) or premium glass bottle (₹599)
• Delivery: ₹70 Pan-India express delivery directly from the hills of Coorg
• FSSAI License: 21219108000175`,
    whyYoullLoveIt: [
      'Fresh hill strawberry fruit pulp infusion',
      'Charming natural blush-rose color and aroma',
      '100% natural fermentation with no added yeast',
      'Choice of 750ml food-grade plastic or premium glass bottle',
      'Sweet, approachable, and beloved by all',
    ],
    bestFor: [
      'Romantic evenings and anniversary toasts',
      'Pairing with artisanal chocolates and desserts',
      'Celebratory gifting and festive occasions',
    ],
    badges: ['Blush Rosé', '100% Natural', '750ml'],
    roastLevel: 'Artisanal Wine',
    roastOptions: [],
    grindOptions: [],
    categoryId: 'cat-wines',
    categoryName: 'Coorg Homemade Fruit Wines',
    images: ['/products/wines/strawberry-wine.jpg?v=20261117'],
    ratingAvg: 4.96,
    ratingCount: 172,
    featured: true,
    accentColor: 'amber',
    active: true,
    createdAt: '2026-11-17T00:00:00Z',
    updatedAt: '2026-11-17T00:00:00Z',
    variants: [
      {
        variantId: 'var-strawberry-wine-plastic-750',
        productId: 'prod-strawberry-wine',
        label: '750ml Plastic Bottle',
        sku: 'CC-WINE-STRW-PLAS-750',
        price: 499,
        salePrice: null,
        stock: 55,
        active: true,
        weightGrams: 750,
        deliveryFee: 70,
      },
      {
        variantId: 'var-strawberry-wine-glass-750',
        productId: 'prod-strawberry-wine',
        label: '750ml Glass Bottle',
        sku: 'CC-WINE-STRW-GLAS-750',
        price: 599,
        salePrice: null,
        stock: 40,
        active: true,
        weightGrams: 1200,
        deliveryFee: 70,
      },
    ],
  },
];

export const INITIAL_PRODUCTS: Product[] = IS_TEST_PRICE_MODE
  ? ORIGINAL_PRODUCTS.map((product) => ({
      ...product,
      variants: product.variants.map((variant) => ({
        ...variant,
        originalPrice: variant.price,
        price: 1,
        salePrice: null,
        deliveryFee: 0,
      })),
    }))
  : ORIGINAL_PRODUCTS;

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-coorg-mist-blend',
    productName: 'Coorg Mist Blend',
    userName: 'Col. K. M. Somanna (Retd.)',
    userEmail: 'somanna@example.com',
    rating: 5,
    title: 'Reminds me of home in Madikeri',
    comment:
      'Having lived in Mysore and Bangalore for decades, finding coffee that captures true Coorg estate aroma was hard. This blend has the exact rich decoction thickness and chocolate aroma of our family estate.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-arabica-powder',
    productName: 'Arabica Coffee Powder',
    userName: 'Sunita Rao',
    userEmail: 'sunita.rao@example.com',
    rating: 5,
    title: 'Exquisite smooth filter coffee',
    comment:
      'Very gentle on the stomach with zero bitter burnt taste. The grind size for South Indian filter is perfect, yields thick decoction every morning.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-02-18T09:15:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-robusta-powder',
    productName: 'Robusta Coffee Powder',
    userName: 'Rohan Deshmukh',
    userEmail: 'rohan.d@example.com',
    rating: 5,
    title: 'Strong kick for early morning shifts',
    comment:
      'If you like bold, rich coffee with milk and jaggery, this Robusta is unbeatable. Amazing aroma when brewing.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-02-22T11:45:00Z',
  },
];

export const INITIAL_COUPONS: any[] = [
  {
    id: 'coup-1',
    code: 'COORG15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: IS_TEST_PRICE_MODE ? 1 : 499,
    maxDiscountAmount: 300,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 124,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'coup-2',
    code: 'WELCOME100',
    discountType: 'fixed',
    discountValue: IS_TEST_PRICE_MODE ? 0.5 : 100,
    minOrderValue: IS_TEST_PRICE_MODE ? 1 : 699,
    expiryDate: '2026-10-15',
    usageLimit: 1000,
    usedCount: 412,
    active: true,
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'coup-3',
    code: 'ESTATEFEST',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: IS_TEST_PRICE_MODE ? 1 : 1200,
    maxDiscountAmount: 500,
    expiryDate: '2026-09-30',
    usageLimit: 250,
    usedCount: 89,
    active: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
];

export const INITIAL_BANNERS: any[] = [
  {
    id: 'ban-1',
    title: 'FRESH HARVEST 2026 COORG ARABICA',
    subtitle: 'Handpicked from misty 4,000ft altitude estates in Madikeri',
    imageUrl: '/products/hero_section.png',
    ctaText: 'EXPLORE HARVEST',
    ctaLink: '/shop',
    position: 'hero',
    active: true,
    sortOrder: 1,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'ban-2',
    title: 'FREE PAN-INDIA EXPRESS SHIPPING',
    subtitle: 'On all orders above ₹999 via DTDC Priority Courier',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'SHOP BLENDS',
    ctaLink: '/shop',
    position: 'top_announcement',
    active: true,
    sortOrder: 2,
    createdAt: '2026-01-12T00:00:00Z',
  },
];

export const INITIAL_SETTINGS: any = {
  storeName: 'Coorg Coffee',
  supportEmail: 'support@coorgcoffees.in',
  supportPhone: '+91 94834 72070 | +91 90718 70722',
  address: 'Plantation Road, Madikeri Estate',
  city: 'Madikeri, Coorg',
  state: 'Karnataka',
  pincode: '571201',
  currency: 'INR (₹)',
  gstPercentage: 5,
  taxInclusive: true,
  freeShippingThreshold: 999,
  flatShippingFee: 70,
  razorpayKeyId: 'rzp_live_TZbz11JkUzJbzJ',
  codEnabled: false,
  emailNotifications: true,
  smsNotifications: true,
  whatsappNotifications: true,
  adminAlertPhones: ['9483472070', '9071870722'],
  smsProvider: 'fast2sms',
  smsApiKey: '',
  smsSenderId: 'CRGCOF',
};

export const INITIAL_ADMIN_USERS: any[] = [
  {
    uid: 'admin-1',
    name: 'Coorg Estate Manager',
    email: 'admin@coorgcoffee.in',
    role: 'Super Admin',
    status: 'active',
    lastLoginAt: '2026-08-31T12:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    uid: 'admin-2',
    name: 'Madikeri Inventory Dispatch',
    email: 'inventory@coorgcoffee.in',
    role: 'Inventory Manager',
    status: 'active',
    lastLoginAt: '2026-08-30T16:20:00Z',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    uid: 'admin-3',
    name: 'DTDC Shipping Specialist',
    email: 'fulfillment@coorgcoffee.in',
    role: 'Order Specialist',
    status: 'active',
    lastLoginAt: '2026-08-29T10:45:00Z',
    createdAt: '2026-02-01T00:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: any[] = [
  {
    id: 'notif-1',
    title: 'New High-Value Order Placed',
    message: 'Order #CC-2026-94812 received for ₹1,850 via Razorpay UPI.',
    category: 'order',
    severity: 'success',
    read: false,
    createdAt: '2026-08-31T10:15:00Z',
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert: Arabica 1KG',
    message: 'Variant CC-ARA-1000 has only 5 units remaining in inventory.',
    category: 'stock',
    severity: 'warning',
    read: false,
    createdAt: '2026-08-31T08:30:00Z',
  },
  {
    id: 'notif-3',
    title: 'DTDC AWB Dispatched',
    message: 'AWB #DTDC948123049 attached to Order #CC-2026-94812.',
    category: 'delivery',
    severity: 'info',
    read: true,
    createdAt: '2026-08-30T17:00:00Z',
  },
];

