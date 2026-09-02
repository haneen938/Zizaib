// Fallback pictures for categories / subcategories.
// Anything an admin saves in the database (table `category_images`) wins over
// the defaults below; these just make sure a card is never empty.
import glovesHeartCream from "@/assets/grocery/gloves-heart-cream.jpeg.asset.json";
import glovesHeartNavy from "@/assets/grocery/gloves-heart-navy.jpeg.asset.json";
import glovesBowBurgundy from "@/assets/grocery/gloves-bow-burgundy.jpeg.asset.json";
import wristFlowerCorsage from "@/assets/grocery/wrist-flower-corsage.jpeg.asset.json";
import keychainCherryBells from "@/assets/grocery/keychain-cherry-bells.jpeg.asset.json";
import headbandsFloralSet from "@/assets/grocery/headbands-floral-set.jpeg.asset.json";
import hairClipsSet from "@/assets/grocery/hair-clips-set.jpeg.asset.json";
import headbandPearlOlive from "@/assets/grocery/headband-pearl-olive.jpeg.asset.json";
import type { SubcategoryId } from "@/data/taxonomy";

export type CategoryImageScope = "collection" | "group" | "subcategory";

/** Composite key used by the database row and by the lookup maps. */
export const imageKey = (scope: CategoryImageScope, refKey: string) => `${scope}:${refKey}`;

export const defaultCategoryImages: Record<string, string> = {
  [imageKey("collection", "grocery")]: keychainCherryBells.url,
  [imageKey("subcategory", "grocery-keychain")]: keychainCherryBells.url,
  [imageKey("subcategory", "grocery-hair-accessories")]: headbandsFloralSet.url,
  [imageKey("subcategory", "grocery-hair")]: hairClipsSet.url,
  [imageKey("subcategory", "grocery-hand")]: glovesHeartCream.url,
  [imageKey("subcategory", "grocery-bracelets")]: wristFlowerCorsage.url,
  [imageKey("subcategory", "grocery-misc")]: headbandPearlOlive.url,
};

/** Extra photography shown on the Grocery page beneath the cards. */
export const groceryGallery: { url: string; caption: string; sub: SubcategoryId }[] = [
  { url: glovesHeartCream.url, caption: "Cream heart hand warmers", sub: "grocery-hand" },
  { url: glovesHeartNavy.url, caption: "Navy heart fingerless gloves", sub: "grocery-hand" },
  { url: glovesBowBurgundy.url, caption: "Burgundy bow hand warmers", sub: "grocery-hand" },
  { url: wristFlowerCorsage.url, caption: "Pearl rose wrist corsage", sub: "grocery-bracelets" },
  { url: keychainCherryBells.url, caption: "Cherry & bellflower keychains", sub: "grocery-keychain" },
  { url: headbandsFloralSet.url, caption: "Floral headband set", sub: "grocery-hair-accessories" },
  { url: hairClipsSet.url, caption: "Butterfly & cherry hair clips", sub: "grocery-hair" },
  { url: headbandPearlOlive.url, caption: "Olive pearl headband", sub: "grocery-misc" },
];
