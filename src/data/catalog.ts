import type {
  Address,
  Category,
  Collection,
  Customer,
  NewsletterSubscriber,
  Order,
  OrderItem,
  Product,
  ProductBadge,
  ProductColor,
  ProductStatus,
  ProductVariant,
  Promotion,
  ShippingMethod,
} from '@/types';

const CATEGORY_LOOKUP = {
  tops: { id: 'cat_tops', name: 'Tops & Tees', slug: 'tops' },
  outerwear: { id: 'cat_outerwear', name: 'Outerwear', slug: 'outerwear' },
  bottoms: { id: 'cat_bottoms', name: 'Bottoms', slug: 'bottoms' },
  knitwear: { id: 'cat_knitwear', name: 'Knitwear', slug: 'knitwear' },
} as const;

export const categories: Category[] = [
  {
    id: 'cat_tops',
    slug: 'tops',
    name: 'Tops & Tees',
    description: 'Heavyweight jersey, boxy cuts and graphics worth wearing twice.',
    imageUrl: '/images/category-tops.jpg',
    sortOrder: 1,
  },
  {
    id: 'cat_outerwear',
    slug: 'outerwear',
    name: 'Outerwear',
    description: 'Layers with presence — washed canvas, wool blends and utility detailing.',
    imageUrl: '/images/category-outerwear.jpg',
    sortOrder: 2,
  },
  {
    id: 'cat_bottoms',
    slug: 'bottoms',
    name: 'Bottoms',
    description: 'Relaxed denim, grounded tailoring and cargo silhouettes.',
    imageUrl: '/images/category-bottoms.jpg',
    sortOrder: 3,
  },
  {
    id: 'cat_knitwear',
    slug: 'knitwear',
    name: 'Knitwear',
    description: 'Soft structure. Fleece, merino and pieces made for repeat wear.',
    imageUrl: '/images/category-knitwear.jpg',
    sortOrder: 4,
  },
];

export const collections: Collection[] = [
  {
    id: 'col_new',
    slug: 'new-arrivals',
    name: 'New Arrivals',
    tagline: 'SS26 / First delivery',
    description: 'The first chapter of the season — quiet structure, washed colour and everyday shape.',
    imageUrl: '/images/editorial-street.jpg',
    featured: false,
  },
  {
    id: 'col_essentials',
    slug: 'essentials',
    name: 'The Essentials',
    tagline: 'The permanent collection',
    description: 'The pieces we return to. Built in small runs, designed to be worn hard.',
    imageUrl: '/images/collection-essentials.jpg',
    featured: true,
  },
  {
    id: 'col_field',
    slug: 'field-notes',
    name: 'Field Notes',
    tagline: 'Informed by the everyday',
    description: 'Utility references, softened edges and a palette pulled from the city at dusk.',
    imageUrl: '/images/collection-outerwear.jpg',
    featured: true,
  },
  {
    id: 'col_atelier',
    slug: 'atelier',
    name: 'Atelier 01',
    tagline: 'Limited / Numbered',
    description: 'A short run of heavier, more considered pieces. Made once, then archived.',
    imageUrl: '/images/collection-tailoring.jpg',
    featured: true,
  },
];

const C = {
  white: { name: 'Optic White', slug: 'white', hex: '#f1eee5' },
  black: { name: 'Ink Black', slug: 'black', hex: '#191916' },
  charcoal: { name: 'Charcoal', slug: 'charcoal', hex: '#3a3a35' },
  olive: { name: 'Washed Olive', slug: 'olive', hex: '#6d6f4c' },
  sand: { name: 'Warm Sand', slug: 'sand', hex: '#c9b79d' },
  bone: { name: 'Bone', slug: 'bone', hex: '#e5dccb' },
  indigo: { name: 'Rinse Indigo', slug: 'indigo', hex: '#394757' },
  stone: { name: 'Stone', slug: 'stone', hex: '#a9a295' },
} satisfies Record<string, ProductColor>;

type NewProduct = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  category: keyof typeof CATEGORY_LOOKUP;
  collectionIds: string[];
  images: Array<{ file: string; alt: string }>;
  priceMinor: number;
  compareAtPriceMinor?: number;
  colors: ProductColor[];
  sizes: string[];
  details: string[];
  materials: string;
  care: string;
  badge: ProductBadge;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  popularity: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  status?: ProductStatus;
  stockOverrides?: Record<string, number>;
};

const productSeeds: NewProduct[] = [
  {
    slug: 'essential-boxy-tee',
    name: 'Essential Boxy Tee',
    subtitle: 'Relaxed fit / 240gsm cotton',
    description:
      'The baseline layer. A structured, boxy tee cut from heavyweight cotton with a clean neckline and a deliberately short body. Wears in, not out.',
    story:
      'We spent eighteen months getting the shoulder line right. The result is a tee that holds its shape under a jacket and still feels broken-in on the first wear.',
    category: 'tops',
    collectionIds: ['col_essentials', 'col_new'],
    images: [
      { file: 'product-tee-white.jpg', alt: 'Essential Boxy Tee in optic white' },
      { file: 'product-tee-white-alt.jpg', alt: 'Essential Boxy Tee fabric detail' },
      { file: 'product-tees-folded.jpg', alt: 'Folded Essentials tees in neutral tones' },
    ],
    priceMinor: 99_900,
    colors: [C.white, C.black, C.olive],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    details: ['Boxy fit, slightly cropped', '240gsm compact cotton jersey', 'Ribbed neckline', 'Unisex sizing'],
    materials: '100% organic cotton. Dyed in small batches.',
    care: 'Cold machine wash inside out. Line dry. Warm iron if needed.',
    badge: 'Bestseller',
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    popularity: 98,
    rating: 4.8,
    reviewCount: 126,
    createdAt: '2026-01-08',
    stockOverrides: { 'white-xs': 0, 'white-xxl': 0, 'olive-m': 2 },
  },
  {
    slug: 'heavyweight-studio-tee',
    name: 'Heavyweight Studio Tee',
    subtitle: 'Garment-dyed / 300gsm',
    description:
      'A denser take on the everyday tee. Garment-dyed for a lived-in tone, with a wider body and a weight that sits away from the body.',
    story:
      'Named for the studio floor it was cut on. The garment-dye process means no two pieces land exactly the same shade.',
    category: 'tops',
    collectionIds: ['col_essentials', 'col_new'],
    images: [
      { file: 'product-tee-charcoal.jpg', alt: 'Heavyweight Studio Tee in charcoal' },
      { file: 'product-look-3.jpg', alt: 'Model wearing the Heavyweight Studio Tee' },
      { file: 'product-tees-folded.jpg', alt: 'Folded studio tees' },
    ],
    priceMinor: 129_900,
    colors: [C.charcoal, C.bone, C.black],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    details: ['Oversized fit', '300gsm garment-dyed jersey', 'Dropped shoulder', 'Made in small runs'],
    materials: '100% cotton. Low-impact garment dye.',
    care: 'Wash cold with similar colours. Do not tumble dry.',
    badge: 'New',
    isNew: true,
    isBestSeller: true,
    isFeatured: false,
    popularity: 91,
    rating: 4.7,
    reviewCount: 64,
    createdAt: '2026-09-14',
    stockOverrides: { 'charcoal-xl': 1, 'bone-s': 0, 'black-xxl': 0 },
  },
  {
    slug: 'souvenir-graphic-tee',
    name: 'Souvenir Graphic Tee',
    subtitle: 'Screen print / 260gsm',
    description:
      'A faded souvenir print on a relaxed jersey base. The graphic is pulled from an archive postcard and printed by hand in short runs.',
    story:
      'A nod to the places that shape a wardrobe — half remembered, slightly worn at the edges.',
    category: 'tops',
    collectionIds: ['col_new', 'col_field'],
    images: [
      { file: 'product-tee-white-alt.jpg', alt: 'Souvenir Graphic Tee in bone' },
      { file: 'product-tee-white.jpg', alt: 'Souvenir Graphic Tee alternate view' },
      { file: 'product-look-1.jpg', alt: 'Editorial look with the Souvenir Graphic Tee' },
    ],
    priceMinor: 149_900,
    compareAtPriceMinor: 179_900,
    colors: [C.bone, C.white, C.olive],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    details: ['Relaxed fit', 'Hand-pulled water-based print', '260gsm cotton jersey', 'Archive postcard graphic'],
    materials: '100% cotton. Water-based inks.',
    care: 'Wash inside out at 30°C. Do not iron the print.',
    badge: null,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    popularity: 76,
    rating: 4.6,
    reviewCount: 38,
    createdAt: '2026-09-02',
    stockOverrides: { 'bone-l': 2, 'white-s': 0 },
  },
  {
    slug: 'urban-layer-jacket',
    name: 'Urban Layer Jacket',
    subtitle: 'Washed canvas / Lined',
    description:
      'A workwear-informed layer in washed cotton canvas. Roomy through the body, with a corduroy collar and deep utility pockets.',
    story:
      'Built to be the piece you reach for when the temperature drops. The canvas is washed twice for an immediately broken-in hand.',
    category: 'outerwear',
    collectionIds: ['col_field', 'col_new'],
    images: [
      { file: 'product-jacket-charcoal.jpg', alt: 'Urban Layer Jacket in charcoal canvas' },
      { file: 'editorial-street.jpg', alt: 'Urban Layer Jacket styled on the street' },
      { file: 'product-jacket-black.jpg', alt: 'Urban Layer Jacket detail' },
    ],
    priceMinor: 499_900,
    compareAtPriceMinor: 599_900,
    colors: [C.charcoal, C.olive, C.black],
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['Relaxed workwear fit', '10oz washed cotton canvas', 'Corduroy collar', 'Three exterior pockets'],
    materials: '100% cotton canvas. Cotton lining.',
    care: 'Spot clean or dry clean. Do not bleach.',
    badge: 'Bestseller',
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    popularity: 96,
    rating: 4.9,
    reviewCount: 82,
    createdAt: '2026-08-22',
    stockOverrides: { 'olive-m': 0, 'charcoal-s': 0, 'black-xl': 1 },
  },
  {
    slug: 'washed-field-overshirt',
    name: 'Washed Field Overshirt',
    subtitle: 'Brushed twill / Oversized',
    description:
      'A shirt-jacket hybrid in brushed cotton twill. Cut long and loose, with a soft collar and tonal buttons. Layer it open or closed.',
    story:
      'Field Notes is our study of utility pieces worn softly. This is the shirt that became a jacket.',
    category: 'outerwear',
    collectionIds: ['col_field'],
    images: [
      { file: 'product-jacket-olive.jpg', alt: 'Washed Field Overshirt in olive' },
      { file: 'product-jacket-black.jpg', alt: 'Washed Field Overshirt alternate view' },
      { file: 'editorial-street.jpg', alt: 'Washed Field Overshirt editorial look' },
    ],
    priceMinor: 349_900,
    colors: [C.olive, C.sand, C.charcoal],
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['Oversized overshirt fit', 'Brushed cotton twill', 'Tonal corozo buttons', 'Two chest pockets'],
    materials: '100% brushed cotton.',
    care: 'Wash cold. Hang dry. Steam to relax creases.',
    badge: 'New',
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    popularity: 84,
    rating: 4.7,
    reviewCount: 29,
    createdAt: '2026-09-20',
    stockOverrides: { 'olive-l': 2, 'sand-s': 0 },
  },
  {
    slug: 'atelier-bomber',
    name: 'Atelier Bomber',
    subtitle: 'Wool blend / Limited run',
    description:
      'A pared-back bomber in a dry wool blend. Ribbed collar and cuffs, a single interior pocket, and a clean matte finish.',
    story:
      'Atelier 01 is made in a numbered run of 120. When it is gone, it stays gone. Each piece carries a small woven label inside the placket.',
    category: 'outerwear',
    collectionIds: ['col_atelier'],
    images: [
      { file: 'product-jacket-black.jpg', alt: 'Atelier Bomber in black wool blend' },
      { file: 'product-jacket-charcoal.jpg', alt: 'Atelier Bomber silhouette' },
      { file: 'product-look-3.jpg', alt: 'Atelier Bomber editorial styling' },
    ],
    priceMinor: 649_900,
    colors: [C.black, C.charcoal],
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['Regular fit', 'Dry wool-blend shell', 'Ribbed trims', 'Numbered edition of 120'],
    materials: '62% wool, 34% polyamide, 4% elastane.',
    care: 'Dry clean only. Store on a wide hanger.',
    badge: 'Limited',
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    popularity: 72,
    rating: 4.8,
    reviewCount: 17,
    createdAt: '2026-07-11',
    stockOverrides: { 'black-m': 1, 'black-l': 0, 'charcoal-s': 2 },
  },
  {
    slug: 'relaxed-denim',
    name: 'Relaxed Denim',
    subtitle: 'Rinse wash / Straight leg',
    description:
      'A straight-leg jean with room through the thigh and a clean break at the ankle. Rinse-washed rigid denim that moulds to you.',
    story:
      'Cut on a vintage straight block, then corrected for a modern rise. Wear it hard for a month and it becomes yours.',
    category: 'bottoms',
    collectionIds: ['col_essentials'],
    images: [
      { file: 'product-denim.jpg', alt: 'Relaxed Denim in rinse indigo' },
      { file: 'product-cargo.jpg', alt: 'Relaxed Denim alternate view' },
      { file: 'product-look-2.jpg', alt: 'Relaxed Denim editorial look' },
    ],
    priceMinor: 289_900,
    colors: [C.indigo, C.black, C.stone],
    sizes: ['28', '30', '32', '34', '36'],
    details: ['Relaxed straight fit', '13.5oz rigid denim', 'Mid rise', 'Button fly'],
    materials: '100% cotton denim.',
    care: 'Wash sparingly, cold, inside out. Hang dry.',
    badge: 'Bestseller',
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    popularity: 94,
    rating: 4.7,
    reviewCount: 103,
    createdAt: '2026-02-19',
    stockOverrides: { 'indigo-32': 1, 'black-28': 0, 'stone-36': 0 },
  },
  {
    slug: 'utility-cargo-trouser',
    name: 'Utility Cargo Trouser',
    subtitle: 'Ripstop / Adjustable hem',
    description:
      'A relaxed cargo in matte ripstop. Bellowed pockets, an adjustable hem and a waistband that sits comfortable all day.',
    story:
      'The most technical piece in Field Notes, softened with a garment wash so it never feels like equipment.',
    category: 'bottoms',
    collectionIds: ['col_field', 'col_new'],
    images: [
      { file: 'product-cargo.jpg', alt: 'Utility Cargo Trouser in olive' },
      { file: 'product-denim.jpg', alt: 'Utility Cargo Trouser alternate view' },
      { file: 'editorial-street.jpg', alt: 'Utility Cargo Trouser editorial look' },
    ],
    priceMinor: 249_900,
    colors: [C.olive, C.black, C.sand],
    sizes: ['28', '30', '32', '34', '36'],
    details: ['Relaxed fit', 'Cotton ripstop with garment wash', 'Six pockets', 'Adjustable bungee hem'],
    materials: '100% cotton ripstop.',
    care: 'Machine wash cold. Do not tumble dry.',
    badge: 'New',
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    popularity: 80,
    rating: 4.5,
    reviewCount: 41,
    createdAt: '2026-09-25',
    stockOverrides: { 'olive-30': 2, 'black-34': 0, 'sand-28': 1 },
  },
  {
    slug: 'tailored-wide-trouser',
    name: 'Tailored Wide Trouser',
    subtitle: 'Wool blend / Pressed crease',
    description:
      'A wide-leg trouser with a soft, fluid drape. Cut from a mid-weight wool blend and finished with a single pressed crease.',
    story:
      'Our take on dressing up without trying. Pair it with the Studio Tee or the Merino Crew — it holds either way.',
    category: 'bottoms',
    collectionIds: ['col_atelier'],
    images: [
      { file: 'product-trouser.jpg', alt: 'Tailored Wide Trouser in charcoal' },
      { file: 'product-look-2.jpg', alt: 'Tailored Wide Trouser editorial look' },
      { file: 'product-look-1.jpg', alt: 'Tailored Wide Trouser styled look' },
    ],
    priceMinor: 299_900,
    colors: [C.charcoal, C.black, C.sand],
    sizes: ['28', '30', '32', '34', '36'],
    details: ['Wide leg, high rise', 'Mid-weight wool blend', 'Pressed centre crease', 'Side adjusters'],
    materials: '54% wool, 44% viscose, 2% elastane.',
    care: 'Dry clean. Steam between wears.',
    badge: null,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    popularity: 69,
    rating: 4.6,
    reviewCount: 22,
    createdAt: '2026-06-04',
    stockOverrides: { 'charcoal-32': 1, 'black-28': 0, 'sand-36': 2 },
  },
  {
    slug: 'studio-hoodie',
    name: 'Studio Hoodie',
    subtitle: 'Heavy fleece / Boxy',
    description:
      'A heavyweight fleece hoodie with a structured hood, dropped shoulders and a boxy body. The kind of weight that holds its shape.',
    story:
      'We tested nine fleece weights before landing here. 480gsm, brushed inside, dense enough to stand away from the body.',
    category: 'knitwear',
    collectionIds: ['col_essentials'],
    images: [
      { file: 'product-hoodie-charcoal.jpg', alt: 'Studio Hoodie in charcoal' },
      { file: 'product-hoodie-sand.jpg', alt: 'Studio Hoodie alternate colour' },
      { file: 'product-look-1.jpg', alt: 'Studio Hoodie editorial look' },
    ],
    priceMinor: 399_900,
    colors: [C.charcoal, C.bone, C.olive],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    details: ['Boxy fit', '480gsm brushed-back fleece', 'Double-layer hood', 'Kangaroo pocket'],
    materials: '82% cotton, 18% recycled polyester.',
    care: 'Wash cold inside out. Reshape while damp.',
    badge: 'Bestseller',
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    popularity: 99,
    rating: 4.9,
    reviewCount: 158,
    createdAt: '2026-01-30',
    stockOverrides: { 'charcoal-s': 0, 'bone-xl': 1, 'olive-xxl': 0 },
  },
  {
    slug: 'sand-fleece-hoodie',
    name: 'Sand Fleece Hoodie',
    subtitle: 'Garment-dyed / 420gsm',
    description:
      'A softer, warmer hoodie in a sandy garment dye. Slightly longer body, ribbed cuffs and a low-profile hood.',
    story:
      'The colour is pulled from the walls of the studio in late afternoon. It photographs differently in every light.',
    category: 'knitwear',
    collectionIds: ['col_new', 'col_field'],
    images: [
      { file: 'product-hoodie-sand.jpg', alt: 'Sand Fleece Hoodie in warm sand' },
      { file: 'product-hoodie-charcoal.jpg', alt: 'Sand Fleece Hoodie alternate view' },
      { file: 'editorial-woman.jpg', alt: 'Sand Fleece Hoodie editorial look' },
    ],
    priceMinor: 449_900,
    colors: [C.sand, C.stone, C.charcoal],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    details: ['Relaxed fit', '420gsm garment-dyed fleece', 'Low-profile hood', 'Hidden side pockets'],
    materials: '100% cotton fleece.',
    care: 'Cold wash separately for first wash. Hang dry.',
    badge: 'New',
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    popularity: 86,
    rating: 4.7,
    reviewCount: 33,
    createdAt: '2026-09-18',
    stockOverrides: { 'sand-m': 1, 'stone-xs': 0 },
  },
  {
    slug: 'merino-crew-knit',
    name: 'Merino Crew Knit',
    subtitle: 'Extra-fine merino / Boxy',
    description:
      'A fine-gauge merino crew with a boxy body and a clean, rolled neckline. Light enough to layer, warm enough to stand alone.',
    story:
      'Atelier 01’s quietest piece. Extra-fine merino, knitted in a family mill and finished by hand.',
    category: 'knitwear',
    collectionIds: ['col_atelier', 'col_essentials'],
    images: [
      { file: 'product-knit.jpg', alt: 'Merino Crew Knit in bone' },
      { file: 'product-knit-alt.jpg', alt: 'Merino Crew Knit texture detail' },
      { file: 'editorial-atelier.jpg', alt: 'Merino Crew Knit editorial look' },
    ],
    priceMinor: 549_900,
    compareAtPriceMinor: 649_900,
    colors: [C.bone, C.black, C.olive],
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['Boxy fit', 'Extra-fine merino wool', 'Rolled neckline', 'Fully fashioned knit'],
    materials: '100% extra-fine merino wool.',
    care: 'Hand wash cold or dry clean. Dry flat.',
    badge: 'Limited',
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    popularity: 74,
    rating: 4.8,
    reviewCount: 19,
    createdAt: '2026-07-29',
    stockOverrides: { 'bone-m': 2, 'black-s': 0, 'olive-xl': 1 },
  },
];

function buildVariants(seed: NewProduct, productId: string): ProductVariant[] {
  const variants: ProductVariant[] = [];
  seed.colors.forEach((color, colorIndex) => {
    seed.sizes.forEach((size, sizeIndex) => {
      const key = `${color.slug}-${size.toLowerCase()}`;
      const override = seed.stockOverrides?.[key];
      const generated = [5, 8, 3, 9, 1, 6, 4, 0, 7, 2, 5, 8][(colorIndex * seed.sizes.length + sizeIndex) % 12];
      variants.push({
        id: `${seed.slug}-${color.slug}-${size.toLowerCase()}`,
        productId,
        sku: `SW-${seed.slug.slice(0, 3).toUpperCase()}-${color.slug.slice(0, 2).toUpperCase()}-${size.toUpperCase()}`,
        size,
        colorSlug: color.slug,
        priceMinor: seed.priceMinor,
        compareAtPriceMinor: seed.compareAtPriceMinor,
        stock: override ?? generated,
      });
    });
  });
  return variants;
}

export const products: Product[] = productSeeds.map((seed) => {
  const category = CATEGORY_LOOKUP[seed.category];
  const id = `prd_${seed.slug}`;
  return {
    id,
    slug: seed.slug,
    name: seed.name,
    subtitle: seed.subtitle,
    description: seed.description,
    story: seed.story,
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    collectionIds: seed.collectionIds,
    images: seed.images.map((image, imageIndex) => ({
      id: `${id}_img_${imageIndex + 1}`,
      url: `/images/${image.file}`,
      alt: image.alt,
    })),
    priceMinor: seed.priceMinor,
    compareAtPriceMinor: seed.compareAtPriceMinor,
    currency: 'INR',
    colors: seed.colors,
    sizes: seed.sizes,
    variants: buildVariants(seed, id),
    details: seed.details,
    materials: seed.materials,
    care: seed.care,
    badge: seed.badge,
    isNew: seed.isNew,
    isBestSeller: seed.isBestSeller,
    isFeatured: seed.isFeatured,
    popularity: seed.popularity,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    createdAt: seed.createdAt,
    status: seed.status ?? 'active',
  } satisfies Product;
});

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard delivery',
    description: 'Free on orders over ₹1,999. Otherwise ₹149.',
    priceMinor: 14_900,
    estimatedDays: '3–5 business days',
  },
  {
    id: 'express',
    name: 'Express delivery',
    description: 'Priority dispatch and tracked delivery.',
    priceMinor: 29_900,
    estimatedDays: '1–2 business days',
  },
];

export const promotions: Promotion[] = [
  {
    id: 'promo_welcome',
    code: 'WELCOME10',
    description: '10% off orders over ₹1,999',
    type: 'percentage',
    value: 10,
    minSubtotalMinor: 199_900,
    active: true,
    startsAt: '2026-01-01',
    endsAt: '2027-12-31',
    usageLimit: 500,
    usageCount: 112,
  },
  {
    id: 'promo_field',
    code: 'FIELDNOTES',
    description: 'Complimentary standard shipping',
    type: 'free_shipping',
    value: 0,
    active: true,
    usageCount: 24,
  },
  {
    id: 'promo_archive',
    code: 'ARCHIVE15',
    description: '15% off Atelier orders over ₹4,999',
    type: 'percentage',
    value: 15,
    minSubtotalMinor: 499_900,
    active: false,
    usageCount: 0,
  },
];

export const demoCustomer: Customer = {
  id: 'cus_demo',
  email: 'demo@streetwear.studio',
  firstName: 'Ari',
  lastName: 'Sharma',
  phone: '+91 98765 43210',
  createdAt: '2026-02-11T10:00:00.000Z',
  demo: true,
};

export const demoCustomers: Customer[] = [
  demoCustomer,
  {
    id: 'cus_maya',
    email: 'maya@fieldnotes.demo',
    firstName: 'Maya',
    lastName: 'Iyer',
    phone: '+91 99887 76655',
    createdAt: '2026-04-02T08:30:00.000Z',
    demo: true,
  },
  {
    id: 'cus_kabir',
    email: 'kabir@atelier.demo',
    firstName: 'Kabir',
    lastName: 'Nair',
    phone: '+91 90000 12345',
    createdAt: '2026-06-19T14:15:00.000Z',
    demo: true,
  },
  {
    id: 'cus_jo',
    email: 'jo@studio.demo',
    firstName: 'Jo',
    lastName: 'Fernandes',
    createdAt: '2026-08-27T17:45:00.000Z',
    demo: true,
  },
];

export const demoAddresses: Address[] = [
  {
    id: 'adr_demo_home',
    customerId: demoCustomer.id,
    label: 'Home',
    firstName: 'Ari',
    lastName: 'Sharma',
    line1: '14 Field Notes Lane',
    line2: 'Apartment 3B',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'adr_demo_studio',
    customerId: demoCustomer.id,
    label: 'Studio',
    firstName: 'Ari',
    lastName: 'Sharma',
    line1: '2nd Floor, 8 Atelier Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

export const newsletterSubscribers: NewsletterSubscriber[] = [
  { email: 'maya@fieldnotes.demo', subscribedAt: '2026-03-02T09:00:00.000Z', source: 'footer' },
  { email: 'jo@studio.demo', subscribedAt: '2026-08-30T12:20:00.000Z', source: 'home' },
];

function makeSeedOrder(
  id: string,
  status: Order['status'],
  createdAt: string,
  items: Array<{ slug: string; size: string; color: string; quantity: number }>,
  overrides: Partial<Order> = {},
): Order {
  const orderItems: OrderItem[] = items.flatMap(({ slug, size, color, quantity }) => {
    const product = products.find((item) => item.slug === slug);
    const variant = product?.variants.find(
      (item) => item.size === size && item.colorSlug === color && item.stock >= 0,
    );
    if (!product || !variant) return [];
    const lineTotalMinor = variant.priceMinor * quantity;
    return [
      {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productSlug: product.slug,
        variantLabel: `${product.colors.find((c) => c.slug === color)?.name ?? color} / ${size}`,
        sku: variant.sku,
        imageUrl: product.images[0]?.url ?? '',
        unitPriceMinor: variant.priceMinor,
        quantity,
        lineTotalMinor,
      },
    ];
  });
  const subtotalMinor = orderItems.reduce((sum, item) => sum + item.lineTotalMinor, 0);
  return {
    id,
    number: `SW-${createdAt.slice(0, 4)}-${id.slice(-4).toUpperCase()}`,
    email: demoCustomer.email,
    customerId: demoCustomer.id,
    items: orderItems,
    shippingAddress: {
      firstName: demoCustomer.firstName,
      lastName: demoCustomer.lastName,
      line1: '14 Field Notes Lane',
      line2: 'Apartment 3B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      phone: '+91 98765 43210',
    },
    shippingMethod: shippingMethods[0]!,
    subtotalMinor,
    discountMinor: 0,
    shippingMinor: 0,
    totalMinor: subtotalMinor,
    currency: 'INR',
    status,
    paymentStatus: 'demo_authorised',
    createdAt,
    idempotencyKey: `seed_${id}`,
    ...overrides,
  };
}

export const seedOrders: Order[] = [
  makeSeedOrder('ord_1001', 'delivered', '2026-08-14T11:20:00.000Z', [
    { slug: 'essential-boxy-tee', size: 'M', color: 'white', quantity: 2 },
    { slug: 'relaxed-denim', size: '32', color: 'indigo', quantity: 1 },
  ]),
  makeSeedOrder('ord_1002', 'processing', '2026-10-18T16:05:00.000Z', [
    { slug: 'urban-layer-jacket', size: 'M', color: 'charcoal', quantity: 1 },
  ]),
  makeSeedOrder(
    'ord_1003',
    'shipped',
    '2026-10-22T09:40:00.000Z',
    [{ slug: 'studio-hoodie', size: 'L', color: 'charcoal', quantity: 1 }],
    { email: 'maya@fieldnotes.demo', customerId: 'cus_maya' },
  ),
  makeSeedOrder(
    'ord_1004',
    'confirmed',
    '2026-10-27T13:10:00.000Z',
    [
      { slug: 'souvenir-graphic-tee', size: 'M', color: 'bone', quantity: 1 },
      { slug: 'utility-cargo-trouser', size: '32', color: 'olive', quantity: 1 },
    ],
    { email: 'jo@studio.demo', customerId: 'cus_jo' },
  ),
];
