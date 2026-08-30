// Size handling for garments (currently men's jackets, coats and trench coats).
// A single hardcoded source of truth so the picker, the chart and the cart all
// agree on the exact same set of sizes.
import type { Product } from "./products";

export const JACKET_SIZES = ["Small", "Medium", "Large", "XL", "2XL", "3XL", "4XL"] as const;
export type JacketSize = (typeof JACKET_SIZES)[number];

export const SIZE_CHART_IMAGE = "/photos/clothing/mens/mens-jacket-size-chart.jpeg";

export interface SizeRow {
  size: string;
  bodyChest: string;
  jacketChest: string;
  shoulder: string;
  sleeves: string;
  length: string;
}

/** Measurements in inches, mirroring the printed men's jacket size chart. */
export const JACKET_SIZE_CHART: SizeRow[] = [
  { size: "Small", bodyChest: '34"–36"', jacketChest: '20"', shoulder: '17"', sleeves: '24"', length: '25"' },
  { size: "Medium", bodyChest: '37"–38"', jacketChest: '21"', shoulder: '18"', sleeves: '24.5"', length: '25"' },
  { size: "Large", bodyChest: '39"–40"', jacketChest: '22"', shoulder: '19"', sleeves: '25"', length: '26"' },
  { size: "XL", bodyChest: '41"–42"', jacketChest: '23"', shoulder: '19.5"', sleeves: '25.5"', length: '27"' },
  { size: "2XL", bodyChest: '43"–44"', jacketChest: '24"', shoulder: '20"', sleeves: '26"', length: '28"' },
  { size: "3XL", bodyChest: '45"–46"', jacketChest: '25"', shoulder: '20.5"', sleeves: '26.5"', length: '28.5"' },
  { size: "4XL", bodyChest: '48"–50"', jacketChest: '27"', shoulder: '21.5"', sleeves: '27"', length: '29"' },
];

/** Sizes a product must be ordered in, or `null` when size does not apply. */
export function sizesFor(product: Pick<Product, "taxon">): readonly string[] | null {
  if (product.taxon?.startsWith("clothing-mens-")) return JACKET_SIZES;
  return null;
}

export function requiresSize(product: Pick<Product, "taxon">): boolean {
  return sizesFor(product) !== null;
}
