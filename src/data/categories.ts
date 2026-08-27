// Parent → child category taxonomy.
// Every product carries a single `category`; groups sit on top so the navbar
// and shop filters can offer broad parents ("Crochet", "Bags", "Grocery") with
// sub-categories underneath. Add a new group by appending to `categoryGroups`.
//
// Materials never mix across groups: Crochet holds yarn pieces only, Bags holds
// the leather line only, Grocery holds plain cotton canvas / string only.
import { products, categoryLabel, categoryMaterial, type Category, type Material } from "@/data/products";

export type CategoryGroupId = "crochet" | "leather-bags" | "grocery" | "jewelry";

export interface CategoryGroup {
  id: CategoryGroupId;
  label: string;
  blurb: string;
  /** Every child of a group must share this material. */
  material: Material;
  children: Category[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: "crochet",
    label: "Crochet",
    blurb: "Hand-crocheted in yarn, small batches only — bags, pouches and accessories.",
    material: "crochet",
    children: [
      "bags",
      "pouches",
      "phone",
      "keychains",
      "hair",
      "home",
      "bouquets",
      "watches",
      "diaries",
    ],
  },
  {
    id: "leather-bags",
    label: "Bags",
    blurb: "The leather line — structured, luxury and everyday leather. No yarn here.",
    material: "leather",
    children: ["leather"],
  },
  {
    id: "grocery",
    label: "Grocery",
    blurb: "Everyday essentials in plain cotton canvas and string — wash, reuse, repeat.",
    material: "canvas",
    children: ["canvas-totes", "grocery-pouches", "market-bags"],
  },
  {
    id: "jewelry",
    label: "Jewellery",
    blurb: "Gold-plated bangles, chain bracelets and filigree rings.",
    material: "metal",
    children: ["jewelry"],
  },
];

export const categoryGroupIds = categoryGroups.map((g) => g.id) as [CategoryGroupId, ...CategoryGroupId[]];

export function groupOf(category: Category): CategoryGroupId | undefined {
  return categoryGroups.find((g) => g.children.includes(category))?.id;
}

export function childrenOf(groupId: CategoryGroupId): Category[] {
  return categoryGroups.find((g) => g.id === groupId)?.children ?? [];
}

/**
 * First product photo in a category — used as the menu thumbnail.
 * Only returns a photo whose material matches the category, so a crochet
 * texture can never end up illustrating Leather Bags (or the reverse).
 */
export function categoryThumb(category: Category): string | undefined {
  const wanted = categoryMaterial[category];
  const product = products.find(
    (p) => p.category === category && (p.material ?? categoryMaterial[p.category]) === wanted,
  );
  return product?.variants[0]?.image;
}

export const labelFor = (category: Category) => categoryLabel[category];

/** Extra lookbook photography attached to a category (crochet bags only). */
export const categoryLookbook: Partial<Record<Category, string[]>> = {
  bags: Array.from({ length: 8 }, (_, i) => `/photos/bags/lookbook/bag-${i + 1}.jpg`),
};
