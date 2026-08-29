// ─────────────────────────────────────────────────────────────
// Zizaib site taxonomy — the single hardcoded source of truth for
// the nav bar, the shop filters and every product's placement.
//
// Shape:  Collection  →  Group (sub-heading)  →  Subcategory
//
// Nothing here is derived at runtime: what you read below is exactly
// what renders in the menu and in the 2-tier shop pills.
// ─────────────────────────────────────────────────────────────

export type CollectionId = "bags" | "jewelry" | "clothing" | "crochet" | "makeup";

export interface Subcategory {
  id: SubcategoryId;
  label: string;
}

export interface TaxonomyGroup {
  id: string;
  label: string;
  subs: Subcategory[];
}

export interface Collection {
  id: CollectionId;
  label: string;
  emoji?: string;
  blurb: string;
  groups: TaxonomyGroup[];
}

export type SubcategoryId =
  // Bags
  | "bags-shoulder-bags"
  | "bags-tote-bags"
  | "bags-crossbody-bags"
  | "bags-clutches"
  | "bags-mini-bags"
  | "bags-evening-bags"
  | "bags-backpacks"
  | "bags-crochet-bags"
  | "bags-woven-bags"
  // Jewelry
  | "jewelry-studs"
  | "jewelry-hoops"
  | "jewelry-drop-earrings"
  | "jewelry-necklaces"
  | "jewelry-bracelets"
  | "jewelry-anklets"
  | "jewelry-rings"
  | "jewelry-sets"
  | "jewelry-statement"
  // Clothing
  | "clothing-dresses"
  | "clothing-tops"
  | "clothing-blouses"
  | "clothing-kurtis"
  | "clothing-shalwar-kameez"
  | "clothing-abayas"
  | "clothing-trousers"
  | "clothing-skirts"
  | "clothing-co-ord-sets"
  | "clothing-mens-jackets"
  | "clothing-mens-coats"
  | "clothing-mens-trench-coats"
  // Crochet
  | "crochet-tote-bags"
  | "crochet-shoulder-bags"
  | "crochet-mini-bags"
  | "crochet-tops"
  | "crochet-cardigans"
  | "crochet-dresses"
  | "crochet-jewelry"
  | "crochet-hair-accessories"
  | "crochet-keychains"
  // Makeup
  | "makeup-foundation-concealer"
  | "makeup-blush-bronzer"
  | "makeup-highlighter-setting"
  | "makeup-eyeliner-kajal"
  | "makeup-mascara"
  | "makeup-eyeshadow"
  | "makeup-lipstick"
  | "makeup-lip-gloss"
  | "makeup-lip-liner";

export const collections: Collection[] = [
  {
    id: "bags",
    label: "Bags",
    blurb: "Leather, structured and handmade bags for every day and every evening.",
    groups: [
      {
        id: "bags-handbags",
        label: "Handbags",
        subs: [
          { id: "bags-shoulder-bags", label: "Shoulder Bags" },
          { id: "bags-tote-bags", label: "Tote Bags" },
          { id: "bags-crossbody-bags", label: "Crossbody Bags" },
        ],
      },
      {
        id: "bags-clutches-mini-bags",
        label: "Clutches & Mini Bags",
        subs: [
          { id: "bags-clutches", label: "Clutches" },
          { id: "bags-mini-bags", label: "Mini Bags" },
          { id: "bags-evening-bags", label: "Evening Bags" },
        ],
      },
      {
        id: "bags-backpacks-handmade-bags",
        label: "Backpacks & Handmade Bags",
        subs: [
          { id: "bags-backpacks", label: "Backpacks" },
          { id: "bags-crochet-bags", label: "Crochet Bags" },
          { id: "bags-woven-bags", label: "Woven Bags" },
        ],
      },
    ],
  },
  {
    id: "jewelry",
    label: "Jewelry",
    emoji: "💎",
    blurb: "Gold-tone earrings, chains, rings and sets — made to stack.",
    groups: [
      {
        id: "jewelry-earrings",
        label: "Earrings",
        subs: [
          { id: "jewelry-studs", label: "Studs" },
          { id: "jewelry-hoops", label: "Hoops" },
          { id: "jewelry-drop-earrings", label: "Drop Earrings" },
        ],
      },
      {
        id: "jewelry-necklaces-bracelets",
        label: "Necklaces & Bracelets",
        subs: [
          { id: "jewelry-necklaces", label: "Necklaces" },
          { id: "jewelry-bracelets", label: "Bracelets" },
          { id: "jewelry-anklets", label: "Anklets" },
        ],
      },
      {
        id: "jewelry-rings-sets",
        label: "Rings & Jewelry Sets",
        subs: [
          { id: "jewelry-rings", label: "Rings" },
          { id: "jewelry-sets", label: "Jewelry Sets" },
          { id: "jewelry-statement", label: "Statement Jewelry" },
        ],
      },
    ],
  },
  {
    id: "clothing",
    label: "Clothing",
    emoji: "👗",
    blurb: "Everyday tops, traditional wear and co-ord sets, cut for real life.",
    groups: [
      {
        id: "clothing-dresses-tops",
        label: "Dresses & Tops",
        subs: [
          { id: "clothing-dresses", label: "Dresses" },
          { id: "clothing-tops", label: "Tops" },
          { id: "clothing-blouses", label: "Blouses" },
        ],
      },
      {
        id: "clothing-traditional-wear",
        label: "Traditional Wear",
        subs: [
          { id: "clothing-kurtis", label: "Kurtis" },
          { id: "clothing-shalwar-kameez", label: "Shalwar Kameez" },
          { id: "clothing-abayas", label: "Abayas" },
        ],
      },
      {
        id: "clothing-bottoms-co-ords",
        label: "Bottoms & Co-ords",
        subs: [
          { id: "clothing-trousers", label: "Trousers" },
          { id: "clothing-skirts", label: "Skirts" },
          { id: "clothing-co-ord-sets", label: "Co-Ord Sets" },
        ],
      },
      {
        id: "clothing-mens",
        label: "Men's Wear",
        subs: [
          { id: "clothing-mens-jackets", label: "Jackets" },
          { id: "clothing-mens-coats", label: "Coats" },
          { id: "clothing-mens-trench-coats", label: "Trench Coats" },
        ],
      },
    ],
  },
  {
    id: "crochet",
    label: "Crochet",
    emoji: "🧶",
    blurb: "Hand-crocheted in yarn, small batches only — bags, clothing and gifts.",
    groups: [
      {
        id: "crochet-bags",
        label: "Crochet Bags",
        subs: [
          { id: "crochet-tote-bags", label: "Tote Bags" },
          { id: "crochet-shoulder-bags", label: "Shoulder Bags" },
          { id: "crochet-mini-bags", label: "Mini Bags" },
        ],
      },
      {
        id: "crochet-clothing",
        label: "Crochet Clothing",
        subs: [
          { id: "crochet-tops", label: "Tops" },
          { id: "crochet-cardigans", label: "Cardigans" },
          { id: "crochet-dresses", label: "Dresses" },
        ],
      },
      {
        id: "crochet-accessories-gifts",
        label: "Crochet Accessories & Gifts",
        subs: [
          { id: "crochet-jewelry", label: "Jewelry" },
          { id: "crochet-hair-accessories", label: "Hair Accessories" },
          { id: "crochet-keychains", label: "Keychains" },
        ],
      },
    ],
  },
  {
    id: "makeup",
    label: "Makeup",
    emoji: "💄",
    blurb: "Face, eye and lip essentials — everyday finishes that photograph well.",
    groups: [
      {
        id: "makeup-face",
        label: "Face Makeup",
        subs: [
          { id: "makeup-foundation-concealer", label: "Foundation & Concealer" },
          { id: "makeup-blush-bronzer", label: "Blush & Bronzer" },
          { id: "makeup-highlighter-setting", label: "Highlighter & Setting" },
        ],
      },
      {
        id: "makeup-eye",
        label: "Eye Makeup",
        subs: [
          { id: "makeup-eyeliner-kajal", label: "Eyeliner & Kajal" },
          { id: "makeup-mascara", label: "Mascara" },
          { id: "makeup-eyeshadow", label: "Eyeshadow" },
        ],
      },
      {
        id: "makeup-lip",
        label: "Lip Makeup",
        subs: [
          { id: "makeup-lipstick", label: "Lipstick" },
          { id: "makeup-lip-gloss", label: "Lip Gloss" },
          { id: "makeup-lip-liner", label: "Lip Liner" },
        ],
      },
    ],
  },
];

export const collectionIds = collections.map((c) => c.id) as [CollectionId, ...CollectionId[]];

export const subcategoryIds = collections.flatMap((c) =>
  c.groups.flatMap((g) => g.subs.map((s) => s.id)),
) as [SubcategoryId, ...SubcategoryId[]];

export const groupIds = collections.flatMap((c) => c.groups.map((g) => g.id)) as [string, ...string[]];

const SUB_INDEX = new Map<SubcategoryId, { collection: Collection; group: TaxonomyGroup; sub: Subcategory }>();
for (const collection of collections) {
  for (const group of collection.groups) {
    for (const sub of group.subs) SUB_INDEX.set(sub.id, { collection, group, sub });
  }
}

export const collectionById = (id: CollectionId) => collections.find((c) => c.id === id);
export const collectionOfSub = (id: SubcategoryId) => SUB_INDEX.get(id)?.collection;
export const groupOfSub = (id: SubcategoryId) => SUB_INDEX.get(id)?.group;
export const subLabel = (id: SubcategoryId) => SUB_INDEX.get(id)?.sub.label ?? id;
export const isSubcategoryId = (v: string): v is SubcategoryId => SUB_INDEX.has(v as SubcategoryId);

/** All subcategory ids that live under a collection. */
export const subsOfCollection = (id: CollectionId): SubcategoryId[] =>
  collectionById(id)?.groups.flatMap((g) => g.subs.map((s) => s.id)) ?? [];

/** All subcategory ids that live under a group (sub-heading). */
export const subsOfGroup = (groupId: string): SubcategoryId[] => {
  for (const c of collections) {
    const g = c.groups.find((x) => x.id === groupId);
    if (g) return g.subs.map((s) => s.id);
  }
  return [];
};
