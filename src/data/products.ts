// Zizaib — handmade crochet catalog for Pakistan.
// Prices in PKR. Each product has 3 color variants; selecting a color
// updates the displayed image to the matching swatch.
import { extraProducts } from "./products.extra";
import type { SubcategoryId } from "./taxonomy";

export type Category =
  | "phone"
  | "pouches"
  | "keychains"
  | "hair"
  | "bags"
  | "home"
  | "bouquets"
  | "watches"
  | "diaries"
  // Leather line — never crochet, never canvas.
  | "leather"
  // Grocery & everyday essentials — plain cotton canvas / string mesh.
  | "canvas-totes"
  | "grocery-pouches"
  | "market-bags"
  // Gold-tone jewellery (bangles, chain bracelets, rings).
  | "jewelry"
  // Stitched clothing — dresses, traditional wear, bottoms.
  | "clothing"
  // Beauty — face, eye and lip makeup.
  | "makeup";

/**
 * What the product is physically made of. This drives the image-safety check
 * below: a photo from the crochet folder can never be attached to a leather
 * product, and vice versa.
 */
export type Material = "crochet" | "leather" | "canvas" | "metal" | "fabric" | "cosmetic";


export interface ColorVariant {
  name: string;
  swatch: string; // hex / css color shown in the picker
  image: string;
}

export type PouchSub = "phone" | "glasses";

export interface ProductReview {
  name: string;
  city: string;
  rating: number; // 1-5
  text: string;
  date?: string;
}

export interface Product {
  id: string;
  title: string;
  tagline?: string;
  price: number; // PKR
  category: Category;
  /** Overrides the material implied by the category. */
  material?: Material;
  sub?: PouchSub; // pouches sub-category: "phone" or "glasses"
  /** Where this product sits in the site taxonomy (see data/taxonomy.ts). */
  taxon?: SubcategoryId;
  /** Discounted price in PKR. When set, the product shows up under /sale. */
  salePrice?: number;

  description: string;
  longDescription: string;
  variants: ColorVariant[];
  badge?: "Bestseller" | "New" | "Limited";
  reviews?: ProductReview[];
}

// Helper to keep image URLs tidy.
const img = (src: string, q = 80, w = 900) =>
  `https://images.unsplash.com/${src}?w=${w}&q=${q}&auto=format&fit=crop`;

const strawberryPeach = { url: "/photos/bags/strawberry-peach-tote.jpeg" };
const strawberryCream = { url: "/photos/bags/strawberry-cream-tote.jpeg" };
const heartGranny = { url: "/photos/bags/red-heart-checker-tote.jpeg" };
const chunkyTotes = { url: "/photos/bags/daisy-sage-tote.jpeg" };
const redBowTanTote = { url: "/photos/bags/tulip-cream-tote.jpeg" };
const brownBowCreamTote = { url: "/photos/bags/brown-heart-checker-tote.jpeg" };
const sunflowerDaisyDuo = { url: "/photos/bags/sunflower-daisy-duo.jpeg" };
const redHeartCheckerTote = { url: "/photos/bags/red-heart-checker-tote.jpeg" };
const brownHeartCheckerTote = { url: "/photos/bags/brown-heart-checker-tote.jpeg" };
const daisySageTote = { url: "/photos/bags/daisy-sage-tote.jpeg" };
const tulipCreamTote = { url: "/photos/bags/tulip-cream-tote.jpeg" };
// Pouch photos live in /public/photos/pouches so they ship with the source download.
const bunnyBearGlassesPouch = { url: "/photos/pouches/bunny-bear-glasses.jpeg" };
const bearGlassesPouch = { url: "/photos/pouches/honey-bear-glasses.jpeg" };
const glassesPouchCollection = { url: "/photos/pouches/animal-friends-collection.jpeg" };
const pinkBowDuoPouch = { url: "/photos/pouches/pink-bow-duo.jpeg" };
const daisyCreamPhonePouch = { url: "/photos/pouches/daisy-cream-crossbody.jpeg" };
const bowSistersPhonePouch = { url: "/photos/pouches/bow-sisters-purple-white.jpeg" };
const avocadoCrossbodyPouch = { url: "/photos/pouches/avocado-crossbody.jpeg" };
const avocadoBuddyPouch = { url: "/photos/pouches/avocado-buddy.jpeg" };
const ivoryDoilyCrossbody = { url: "/photos/bags/ivory-doily-crossbody.jpeg" };
const rustCreamBobbleTote = { url: "/photos/bags/rust-cream-bobble-tote.jpeg" };
const blushStripeGlassesPouch = { url: "/photos/pouches/blush-stripe-drawstring.jpeg" };
const bluebellGrannyGlassesPouch = { url: "/photos/pouches/bluebell-granny.jpeg" };
const ivoryShellGlassesPouch = { url: "/photos/pouches/ivory-shell.jpeg" };
// Phone cover images live in /public/photos/phone so they ship with the source download.
const ribbonBowKc = { url: "/photos/keychains/crochet-bow-charms.jpeg" };
const miniBouquetKc = { url: "/photos/keychains/rose-bouquet-charm.jpeg" };
const charmGardenKc = { url: "/photos/keychains/crochet-bow-charms.jpeg" };
const cherryHeartKc = { url: "/photos/keychains/berry-mushroom.jpeg" };
const sleepyAvocadoKc = { url: "/photos/keychains/avocado-pair.jpeg" };
const youMeBearKc = { url: "/photos/keychains/you-me-bears.jpeg" };
const iceCreamKc = { url: "/photos/keychains/icecream-duo.jpeg" };
const berryMushroomKc = { url: "/photos/keychains/berry-mushroom.jpeg" };
const sunshineDuckKc = { url: "/photos/keychains/duckling-daisy.jpeg" };
const sunMoonKc = { url: "/photos/keychains/sun-moon.jpeg" };
const flowerVineCrown = { url: "/photos/hair/vine-crown.jpeg" };
const flowerBobbyPins = { url: "/photos/hair/pearl-daisy-trio.jpeg" };
const chunkyPinkBow = { url: "/photos/hair/pink-bow-clip.jpeg" };
const plumeriaClips = { url: "/photos/hair/plumeria-clips.jpeg" };
const pearlDaisyClip = { url: "/photos/hair/pearl-daisy-trio.jpeg" };
const sunflowerHeadband = { url: "/photos/hair/sunflower-headband.jpeg" };
const daisyHeadbandSet = { url: "/photos/hair/daisy-headband-set.jpeg" };
const sunflowerHairClips = { url: "/photos/hair/sunflower-pair-clips.jpeg" };
const mauveBowTail = { url: "/photos/hair/mauve-bow-tail.jpeg" };
const floralHairScarf = { url: "/photos/hair/floral-hair-scarf.jpeg" };
const bandanaTrio = { url: "/photos/hair/bandana-trio.jpeg" };
// Wrist bracelets & watch straps — real photos in /public/photos/wrist/
const natoStripeStrap = { url: "/photos/wrist/nato-stripe-watch-strap.jpeg" };
const tealDiamondStrap = { url: "/photos/wrist/teal-diamond-apple-strap.jpeg" };
const pinkCrochetStrap = { url: "/photos/wrist/pink-crochet-watch-strap.jpeg" };
const floralGrannyStrap = { url: "/photos/wrist/pink-crochet-watch-strap.jpeg" };
const ivoryBobbleBracelet = { url: "/photos/wrist/ivory-cloud-bobble.jpeg" };
const marigoldBobbleBracelet = { url: "/photos/wrist/marigold-bobble.jpeg" };
const rubyBobbleBracelet = { url: "/photos/wrist/ruby-bobble.jpeg" };
const pinkBobbleBracelet = { url: "/photos/wrist/pink-cream-bobble.jpeg" };
// Flower bouquets — real photos in /public/photos/bouquets/
const roseDaisyBouquet = { url: "/photos/bouquets/rose-daisy-pink-wrap.webp" };
const daisyKraftBouquet = { url: "/photos/bouquets/daisy-kraft-bouquet.jpeg" };
const blueLilyBouquet = { url: "/photos/bouquets/lavender-lily-bouquet.jpeg" };
const pastelGardenBouquet = { url: "/photos/bouquets/pastel-tulip-garden.webp" };
const earthyLilyRoseBouquet = { url: "/photos/bouquets/burlap-pink-roses.jpg" };
const bearTulipDaisyBouquet = { url: "/photos/bouquets/sunflower-rose-bouquet.jpeg" };
const sunflowerMeadowBouquet = { url: "/photos/bouquets/sunflower-wildflower-bouquet.jpeg" };
const pinkRoseBouquet = { url: "/photos/bouquets/pink-rose-burlap-bouquet.jpg" };
const lavenderLilyBouquet = { url: "/photos/bouquets/lavender-lily-bouquet.jpeg" };
const sunflowerRoseBouquet = { url: "/photos/bouquets/sunflower-rose-bouquet.jpeg" };
const tripleSunflowerBouquet = { url: "/photos/bouquets/triple-sunflower-bouquet.jpg" };
// Home accessories — local photos in /public/photos/home/
const homeImg = {
  pastelBow: "/photos/home/pastel-bow-mug-cozies.jpeg",
  alphabet: "/photos/home/alphabet-mug-cozies.jpeg",
  tulipSet: "/photos/home/tulip-mug-cozy-coaster.jpeg",
  hearts: "/photos/home/heart-mug-cozy-duo.jpeg",
  animalCoasters: "/photos/home/heart-mug-cozy-duo.jpeg", // fallback
  daisyTieback: "/photos/home/daisy-tieback.jpeg",
  pinkFlowerTieback: "/photos/home/pink-cord-flower-tieback.jpeg",
  bottleTrio: "/photos/home/neutral-bottle-carrier-trio.jpeg",
  bottlePinkBow: "/photos/home/pink-bow-bottle-carrier.jpeg",
  bottleCreamBrown: "/photos/home/cream-brown-bottle-carrier.jpeg",
};
// Diaries & book covers — real photos in /public/photos/diaries/
const pinkDaisyDiary = { url: "/photos/diaries/pink-daisy-diary.jpeg" };
const sageDaisyDiary = { url: "/photos/diaries/sage-daisy-diary.jpeg" };
const strawberryDiary = { url: "/photos/diaries/strawberry-diary.jpeg" };
const pinkMedallionDiary = { url: "/photos/diaries/pink-medallion-diary.jpeg" };
const pinkFloralBouquetDiary = { url: "/photos/diaries/pink-floral-bouquet-diary.jpeg" };
const pinkGrannyDiary = { url: "/photos/diaries/pink-medallion-diary.jpeg" };
const greenDaisyGrannyDiary = { url: "/photos/diaries/green-daisy-granny-diary.jpeg" };
const greenCreamGrannyDiary = { url: "/photos/diaries/green-cream-granny-diary.jpeg" };

const baseProducts: Product[] = [
  // — Phone covers —
  {
    id: "blossom-phone-cover",
    title: "Blossom Phone Cover",
    tagline: "A whole garden of tiny crochet blooms 🌸",
    price: 1200,
    category: "phone",
    description: "Snug crochet sleeve covered in hand-stitched colorful flowers.",
    longDescription:
      "A soft, padded crochet phone cover bursting with hand-stitched flowers in pastel shades. Each bloom is shaped and sewn on by hand, giving your phone a cozy, one-of-a-kind garden look. Fits most 6.1\" phones — gently stretchy for a snug fit.",
    variants: [
      { name: "Pastel Garden", swatch: "#e8a5b0", image: "/photos/phone/purple-bow-blossom.jpeg" },
      { name: "Lavender Bloom", swatch: "#c9b9e5", image: "/photos/phone/purple-bow-blossom.jpeg" },
      { name: "Butter Cream", swatch: "#f3dc99", image: "/photos/phone/purple-bow-blossom.jpeg" },
    ],
    badge: "New",
  },
  {
    id: "floral-duo-phone-cover",
    title: "Garden Floral Phone Cover",
    tagline: "Pick your bloom — berry or blush 🌸",
    price: 1600,
    category: "phone",
    description: "Snug crochet cover with raised crochet flowers and pearl dots.",
    longDescription:
      "Two cheerful designs to choose from — a berry pink cover scattered with mini flowers and pearls, or a blush pink cover with oversized daisies. Soft, padded fit for most phones.",
    variants: [
      { name: "Berry Pink", swatch: "#c41e5a", image: "/photos/phone/floral-duo.jpeg" },
      { name: "Blush Daisy", swatch: "#f3b8c4", image: "/photos/phone/floral-duo.jpeg" },
    ],
    badge: "Bestseller",
  },
  {
    id: "sage-granny-phone-cover",
    title: "Sage Granny Square Phone Cover",
    tagline: "Vintage charm meets your phone ✨",
    price: 1800,
    category: "phone",
    description: "Granny-square cover with matching beaded charm strap.",
    longDescription:
      "Hand-joined sage and cream granny squares wrap your phone in vintage charm. Comes with a matching beaded charm strap — flower & leaf pendants included.",
    variants: [
      { name: "Sage & Cream", swatch: "#b9cdb1", image: "/photos/phone/sage-granny.jpeg" },
    ],
    badge: "New",
  },
  {
    id: "butter-tulip-phone-cover",
    title: "Butter Tulip Phone Cover",
    tagline: "Tulips that never wilt 🌷",
    price: 1500,
    category: "phone",
    description: "Soft butter-yellow cover with two pink crochet tulips.",
    longDescription:
      "A two-tone butter cream cover with two hand-shaped pink tulips and green leaves stitched on. Sweet and gentle — perfect everyday cover.",
    variants: [
      { name: "Butter Yellow", swatch: "#f5e6a8", image: "/photos/phone/butter-tulip.jpeg" },
    ],
    badge: "New",
  },
  {
    id: "bow-daisy-phone-cover",
    title: "Cream Bow & Daisy Cover",
    tagline: "Coquette-core for your phone 🎀",
    price: 1700,
    category: "phone",
    description: "Cream cover with pink bows, daisies and a sage bow.",
    longDescription:
      "Cosy cream cover decorated with hand-crocheted pink bows, fluffy daisies and a single sage bow — the prettiest little gallery for your phone.",
    variants: [
      { name: "Cream Coquette", swatch: "#f4ecdc", image: "/photos/phone/cream-bow-daisy.jpeg" },
    ],
    badge: "Bestseller",
  },
  {
    id: "sunflower-bow-duo-cover",
    title: "Sunflower & Bow Duo Cover",
    tagline: "Comment your fav design 🌻🎀",
    price: 1500,
    category: "phone",
    description: "Two darling covers — sunflower cream or pink-bow black.",
    longDescription:
      "Pick your mood: a cream cover bursting with sunflowers and leaves, or a moody black cover with a bright pink bow. Both crocheted by hand.",
    variants: [
      { name: "Sunflower Cream", swatch: "#f5e6a8", image: "/photos/phone/sunflower-bow-duo.jpeg" },
      { name: "Pink Bow Black", swatch: "#2a2a2a", image: "/photos/phone/sunflower-bow-duo.jpeg" },
    ],
  },
  {
    id: "big-sunflower-phone-cover",
    title: "Big Sunflower Phone Cover",
    tagline: "One big bloom of sunshine 🌻",
    price: 1400,
    category: "phone",
    description: "Cream cover topped with one oversized crochet sunflower.",
    longDescription:
      "A single statement sunflower — gold petals, dark center — on a soft cream crochet base. Snug fit for iPhone-sized phones.",
    variants: [
      { name: "Cream & Gold", swatch: "#f4ecdc", image: "/photos/phone/big-sunflower.jpeg" },
    ],
  },
  {
    id: "scallop-pink-phone-cover",
    title: "Scallop Edge Pink Cover",
    tagline: "Soft, scalloped & sweet 💕",
    price: 1600,
    category: "phone",
    description: "Blush pink cover trimmed with a cream scallop border.",
    longDescription:
      "A clean blush pink crochet face with a delicate cream scallop edging the whole cover. Minimal, romantic, and beautifully soft.",
    variants: [
      { name: "Blush Pink", swatch: "#f4c8d2", image: "/photos/phone/scallop-pink.jpeg" },
    ],
    badge: "New",
  },
  {
    id: "blue-bow-scallop-cover",
    title: "Blue Bow Scallop Cover",
    tagline: "Bow lovers' dream 🎀",
    price: 1750,
    category: "phone",
    description: "Cream cover with sky-blue scallop trim and a big bow.",
    longDescription:
      "A cream crochet cover edged in sky blue with a chunky blue bow front and center — coquette and cosy at the same time.",
    variants: [
      { name: "Sky Blue Bow", swatch: "#9ec7e3", image: "/photos/phone/blue-bow-scallop.jpeg" },
    ],
    badge: "Bestseller",
  },

  // — Pouches —
  {
    id: "pink-bow-duo-phone-pouch",
    title: "Pink Bow Duo Phone Pouch",
    tagline: "Coquette-core, crocheted 🎀💕",
    price: 1750,
    category: "pouches",
    sub: "phone",
    description: "Soft pink & cream phone pouches trimmed with tiny bows and scallops.",
    longDescription:
      "A darling duo — a pastel pink and a cream phone pouch, each tied with a tiny crochet bow and finished with ruffled scallop edges. Comes with a pearl beaded crossbody strap. Snug fit for most phones.",
    variants: [
      { name: "Blush Pink", swatch: "#f4b8c4", image: pinkBowDuoPouch.url },
      { name: "Cream White", swatch: "#f5ede0", image: pinkBowDuoPouch.url },
    ],
    badge: "New",
    reviews: [
      { name: "Alizeh", city: "Lahore", rating: 5, date: "Jun 22, 2026", text: "The bows!!! So dainty and the pearl strap feels luxe 🫶" },
      { name: "Minha", city: "Karachi", rating: 5, date: "Jun 05, 2026", text: "Fits my iPhone perfectly, super soft crochet." },
    ],
  },
  {
    id: "daisy-cream-phone-pouch",
    title: "Daisy Cream Phone Pouch",
    tagline: "One little daisy, all the charm 🌼",
    price: 1500,
    category: "pouches",
    sub: "phone",
    description: "Cream crossbody phone pouch with a single crochet daisy.",
    longDescription:
      "Airy open-stitch cream pouch with a chunky crochet strap and a hand-sewn daisy on the flap. Light, breathable, and gentle on your phone screen.",
    variants: [
      { name: "Ivory Daisy", swatch: "#f4ecdc", image: daisyCreamPhonePouch.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Zoya", city: "Islamabad", rating: 5, date: "Jun 18, 2026", text: "Perfect little crossbody for uni, gets compliments daily 🌼" },
      { name: "Hadiya", city: "Rawalpindi", rating: 5, date: "May 30, 2026", text: "So light I barely feel it, and the daisy is adorable." },
    ],
  },
  {
    id: "bow-sisters-phone-pouch",
    title: "Bow Sisters Phone Pouch",
    tagline: "Twin pouches with pearl bow drama 💜🤍",
    price: 1800,
    category: "pouches",
    sub: "phone",
    description: "Purple & white phone pouches with big bows and pearl accents.",
    longDescription:
      "A pair of matching phone pouches — one rich lilac purple, one snowy white — each topped with an oversized crochet bow and pearl detailing. Pearl beaded strap included. Get one, or split with your bestie.",
    variants: [
      { name: "Lilac Purple", swatch: "#a488d8", image: bowSistersPhonePouch.url },
      { name: "Snow White", swatch: "#f7f4ee", image: bowSistersPhonePouch.url },
    ],
    badge: "New",
    reviews: [
      { name: "Eshal", city: "Islamabad", rating: 5, date: "Jun 25, 2026", text: "Got the purple one, my sister took the white — matching bestie energy 💜" },
      { name: "Sara", city: "Karachi", rating: 5, date: "Jun 10, 2026", text: "The pearl strap is so pretty. Roomy for phone + cards." },
    ],
  },
  {
    id: "avocado-crossbody-pouch",
    title: "Avocado Crossbody Pouch",
    tagline: "Extra ripe, extra cute 🥑",
    price: 2200,
    category: "pouches",
    sub: "phone",
    description: "Plump avocado-shaped crossbody pouch with tiny arms & legs.",
    longDescription:
      "A hand-stuffed avocado pouch — full green body, buttery yellow center, and a cheeky brown pit that opens for storage. Tiny embroidered face and little arms & legs make it the internet's favourite pouch. Long crochet strap for hands-free carry.",
    variants: [
      { name: "Sage Avocado", swatch: "#9dbf90", image: avocadoCrossbodyPouch.url },
      { name: "With Baby Buddy", swatch: "#4a6b3a", image: avocadoBuddyPouch.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Mahnoor", city: "Lahore", rating: 5, date: "Jun 20, 2026", text: "Wore it to brunch and three girls stopped me to ask where it's from 🥑" },
      { name: "Taniya", city: "Karachi", rating: 5, date: "Jun 03, 2026", text: "SO much bigger and better made than expected. Fits phone + cards + lip balm." },
      { name: "Zainab", city: "Multan", rating: 5, date: "May 20, 2026", text: "The little face 🥹 my new favourite thing I own." },
    ],
  },
  {
    id: "bunny-glasses-pouch",
    title: "Bunny Glasses Pouch",
    tagline: "Tiny ears, big charm 🐰",
    price: 1600,
    category: "pouches",
    sub: "glasses",
    description: "Cream bunny-eared sleeve that hugs your glasses.",
    longDescription:
      "A soft cream crochet sleeve with little bunny ears and a hand-stitched face. Snug fit for everyday frames or sunnies — soft inside so lenses stay scratch-free.",
    variants: [
      { name: "Cream Bunny", swatch: "#f4ecdc", image: bunnyBearGlassesPouch.url },
      { name: "Cocoa Bear", swatch: "#8a6a55", image: bunnyBearGlassesPouch.url },
    ],
    badge: "New",
  },
  {
    id: "bear-glasses-pouch",
    title: "Honey Bear Glasses Pouch",
    tagline: "Bear hug for your specs 🐻",
    price: 1550,
    category: "pouches",
    sub: "glasses",
    description: "Caramel bear pouch with rounded ears and a sweet snout.",
    longDescription:
      "Crocheted in warm caramel yarn with little round ears and an embroidered nose. Open-top design — slide your glasses in, take them out in a second.",
    variants: [
      { name: "Honey Caramel", swatch: "#c89b6a", image: bearGlassesPouch.url },
    ],
    badge: "Bestseller",
  },
  {
    id: "animal-friends-glasses-pouch",
    title: "Animal Friends Glasses Pouch",
    tagline: "Pick your little buddy 🐶🐱",
    price: 1700,
    category: "pouches",
    sub: "glasses",
    description: "Smiley animal-face pouches in seven cheerful colors.",
    longDescription:
      "A whole family of crochet animal pouches — each with embroidered eyes, rosy cheeks and a tiny smile. Soft cotton yarn, gentle on lenses.",
    variants: [
      { name: "Sky Blue", swatch: "#9ec7e3", image: glassesPouchCollection.url },
      { name: "Cloud White", swatch: "#f6f0e6", image: glassesPouchCollection.url },
      { name: "Caramel", swatch: "#c89b6a", image: glassesPouchCollection.url },
      { name: "Lilac", swatch: "#c9b9e5", image: glassesPouchCollection.url },
      { name: "Butter Yellow", swatch: "#f3dc99", image: glassesPouchCollection.url },
      { name: "Cherry Red", swatch: "#d9534f", image: glassesPouchCollection.url },
      { name: "Blush Pink", swatch: "#f3b8c4", image: glassesPouchCollection.url },
    ],
    badge: "New",
  },
  {
    id: "blush-stripe-glasses-pouch",
    title: "Blush Stripe Glasses Pouch",
    tagline: "Stripes, drawstrings & wooden beads ✨",
    price: 1400,
    category: "pouches",
    sub: "glasses",
    description: "Pink & cream striped drawstring pouch for sunnies.",
    longDescription:
      "A cosy drawstring glasses pouch in blush-and-cream stripes, finished with two wooden beads on the ties. Cushioned crochet keeps lenses safe in your bag.",
    variants: [
      { name: "Blush Stripe", swatch: "#f2c7cf", image: blushStripeGlassesPouch.url },
    ],
    badge: "New",
    reviews: [
      { name: "Areeba", city: "Karachi", rating: 5, date: "Jun 12, 2026", text: "The wooden beads are the cutest touch. My sunglasses are safe & stylish 🕶️" },
      { name: "Hooriya", city: "Lahore", rating: 5, date: "May 28, 2026", text: "Thick, well-padded crochet. Way better than store-bought sleeves." },
    ],
  },
  {
    id: "bluebell-granny-glasses-pouch",
    title: "Bluebell Granny Glasses Pouch",
    tagline: "Vintage granny squares, all blue everything 💙",
    price: 1650,
    category: "pouches",
    sub: "glasses",
    description: "Granny-square glasses pouches in dreamy blue tones.",
    longDescription:
      "Hand-joined granny squares in denim, sky blue and cream — mixed and matched for a nostalgic vintage feel. Comes with a slim crochet wrist loop.",
    variants: [
      { name: "Denim Mix", swatch: "#6b8fb5", image: bluebellGrannyGlassesPouch.url },
      { name: "Sky Cream", swatch: "#c5daea", image: bluebellGrannyGlassesPouch.url },
    ],
    badge: "New",
    reviews: [
      { name: "Zunaira", city: "Islamabad", rating: 5, date: "Jun 15, 2026", text: "Feels like nani's living room in the best way. Beautiful stitching 💙" },
      { name: "Fajr", city: "Rawalpindi", rating: 5, date: "May 22, 2026", text: "Ordered two — one for me, one for my mum. She loved it!" },
    ],
  },
  {
    id: "ivory-shell-glasses-pouch",
    title: "Ivory Shell Glasses Pouch",
    tagline: "Shell-stitch elegance for your specs 🤍",
    price: 1500,
    category: "pouches",
    sub: "glasses",
    description: "Ivory shell-stitch drawstring pouch with wooden beads.",
    longDescription:
      "A soft ivory glasses pouch worked in a delicate shell stitch, cinched with a drawstring and two wooden beads. Neutral, timeless, and pairs with everything.",
    variants: [
      { name: "Natural Ivory", swatch: "#efe6d3", image: ivoryShellGlassesPouch.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Haniya", city: "Lahore", rating: 5, date: "Jun 19, 2026", text: "Minimal and gorgeous, goes with every bag I own." },
      { name: "Sara", city: "Karachi", rating: 5, date: "May 25, 2026", text: "The shell pattern is *chef's kiss* — feels handmade in the best way." },
    ],
  },



  // — Keychains —
  {
    id: "ribbon-bow-keychain",
    title: "Ribbon Bow Keychain",
    tagline: "A little bow for your everyday bag 🎀",
    price: 550,
    category: "keychains",
    description: "Chunky crochet bow charm with a sturdy lobster clip.",
    longDescription:
      "Hand-crocheted ribbon bow in soft, plush yarn — finished with a polished lobster clip. Two dreamy shades: blushing pink or fresh ivory. Clips onto bags, backpacks, or jeans loops.",
    variants: [
      { name: "Blush Pink", swatch: "#e8a5b0", image: ribbonBowKc.url },
      { name: "Ivory White", swatch: "#f5ede0", image: ribbonBowKc.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Areeba", city: "Lahore", rating: 5, date: "May 12, 2026", text: "The pink bow is even prettier in person! Clips on so securely 💕" },
      { name: "Minha", city: "Karachi", rating: 5, date: "Apr 28, 2026", text: "Got both colours — they're so well-made and the yarn feels lovely." },
      { name: "Eshal", city: "Islamabad", rating: 5, date: "Apr 10, 2026", text: "Coquette-core dream 🎀 packaging was adorable too." },
    ],
  },
  {
    id: "mini-bouquet-keychain",
    title: "Mini Bouquet Keychain",
    tagline: "A tiny bouquet that never wilts 💐",
    price: 700,
    category: "keychains",
    description: "Tiny crochet bouquet — sunflower, tulip, or daisy.",
    longDescription:
      "Hand-stitched mini bouquet wrapped in cocoa-brown 'paper' with a twine bow. Pick your bloom — sunflower, pink tulip, or daisy. The sweetest little gift to clip onto a bag.",
    variants: [
      { name: "Sunflower & Pearls", swatch: "#f2b53a", image: "/photos/keychains/sunflower-pearl.jpeg" },
      { name: "Pink Tulip Bow", swatch: "#e8a5b0", image: "/photos/keychains/tulip-bow.jpeg" },
      { name: "Red Rose Bouquet", swatch: "#c41e3a", image: "/photos/keychains/rose-bouquet-charm.jpeg" },
      { name: "Daisy", swatch: "#f4ece0", image: miniBouquetKc.url },
    ],
    badge: "New",
    reviews: [
      { name: "Hadiya", city: "Rawalpindi", rating: 5, date: "May 18, 2026", text: "Bought the tulip for my best friend — she literally cried. So thoughtful 🌷" },
      { name: "Sara", city: "Karachi", rating: 5, date: "May 02, 2026", text: "Detail is insane for the price. The little twine bow is the cutest touch." },
      { name: "Mahnoor", city: "Lahore", rating: 4, date: "Apr 22, 2026", text: "Sunflower is so cheerful, only wish it were a bit bigger!" },
    ],
  },
  {
    id: "charm-garden-mini-set",
    title: "Charm Garden Mini Set",
    tagline: "Mix-and-match tiny charms 🌼",
    price: 500,
    category: "keychains",
    description: "Petite crochet charms — bows, stars, flowers & cherries.",
    longDescription:
      "Build your own little charm garden — pick from cherries, bluebell, tulip, daisy, bow or stars. Each one is hand-crocheted and finished with a silver keyring. Perfect stocking-fillers or rakhi-style gifts.",
    variants: [
      { name: "Cherry Duo", swatch: "#f0c9c0", image: charmGardenKc.url },
      { name: "Bluebell", swatch: "#9ec3e3", image: charmGardenKc.url },
      { name: "Coral Bow", swatch: "#ee9085", image: charmGardenKc.url },
      { name: "Star (Cream/Black)", swatch: "#1a1a1a", image: charmGardenKc.url },
    ],
    badge: "New",
    reviews: [
      { name: "Taniya", city: "Karachi", rating: 5, date: "May 24, 2026", text: "Ordered four for my girls' group — everyone picked a different one. So fun!" },
      { name: "Zainab", city: "Multan", rating: 5, date: "May 09, 2026", text: "The cherry duo is my new favourite thing on my bag 🍒" },
    ],
  },
  {
    id: "cherry-heart-keychain",
    title: "Cherry Heart Keychain",
    tagline: "Wear your heart on your bag ❤️",
    price: 400,
    category: "keychains",
    description: "Bright cherry-red crochet heart on a silver ring.",
    longDescription:
      "A plump, hand-crocheted heart in a glossy cherry red, finished with a sturdy silver keyring. Tiny, lightweight, and the prettiest little pop of colour for keys, bags, or pencil cases.",
    variants: [
      { name: "Cherry Red", swatch: "#cc2840", image: cherryHeartKc.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Haniya", city: "Lahore", rating: 5, date: "May 30, 2026", text: "Tiny but so well-stitched. The red is such a beautiful shade ❤️" },
      { name: "Areeba", city: "Faisalabad", rating: 5, date: "May 14, 2026", text: "Gifted to my mum on Mother's Day. She keeps it on her house keys now 🥺" },
      { name: "Eshal", city: "Peshawar", rating: 5, date: "Apr 27, 2026", text: "Arrived super fast and packaged so cutely!" },
    ],
  },
  {
    id: "sleepy-avocado-keychain",
    title: "Sleepy Avocado Keychain",
    tagline: "Soft, sleepy & a little bit extra 🥑",
    price: 650,
    category: "keychains",
    description: "Plush avocado charm — pick plain or with a bow.",
    longDescription:
      "Hand-stuffed crochet avocado with sleepy eyes and rosy cheeks. Choose the classic look or the pink-bow version for extra cute. Sturdy keyring included.",
    variants: [
      { name: "Classic Sleepy", swatch: "#cdd28f", image: "/photos/keychains/avocado-pair.jpeg" },
      { name: "Bow Babe", swatch: "#f3b8c4", image: "/photos/keychains/avocado-pair.jpeg" },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Minha", city: "Karachi", rating: 5, date: "Jun 02, 2026", text: "The face. THE FACE. I'm obsessed 🥺🥑" },
      { name: "Sara", city: "Karachi", rating: 5, date: "May 19, 2026", text: "Got both for me and my sister, matching avocados 💕" },
      { name: "Hadiya", city: "Rawalpindi", rating: 5, date: "May 03, 2026", text: "Soft, squishy, and so much better quality than the pictures show." },
    ],
  },
  {
    id: "you-and-me-bear-keychain",
    title: "You & Me Bear Couple Keychain",
    tagline: "Matching bears for you & your favourite person 🧸",
    price: 1200,
    category: "keychains",
    description: "Set of two crochet bears — 'you' bear and 'me' bear in pink tutu.",
    longDescription:
      "A pair of hand-crocheted teddy bears — one classic brown 'you' bear and one 'me' bear in a tiny pink tutu and bow. Sold as a set, packaged together. The sweetest anniversary, BFF or sibling gift.",
    variants: [
      { name: "Set of 2", swatch: "#7a4a2b", image: "/photos/keychains/you-me-bears.jpeg" },
    ],
    badge: "New",
    reviews: [
      { name: "Mahnoor", city: "Lahore", rating: 5, date: "Jun 10, 2026", text: "Gave the set to my boyfriend on our anniversary 🥹 he loved it so much." },
      { name: "Taniya", city: "Karachi", rating: 5, date: "May 28, 2026", text: "The little tutu kills me every time. Quality is top." },
      { name: "Zainab", city: "Multan", rating: 5, date: "May 11, 2026", text: "Bought for me + my best friend. Now we both have a 'me' bear hehe." },
    ],
  },
  {
    id: "sweet-scoop-icecream-keychain",
    title: "Sweet Scoop Ice Cream Keychain",
    tagline: "A scoop that never melts 🍦",
    price: 600,
    category: "keychains",
    description: "Crochet ice-cream cone with a gold keyring.",
    longDescription:
      "Hand-crocheted cone with a fluffy scoop on top — choose strawberry pink or cool mint blue. Finished with a delicate gold-tone keyring. Petite but so detailed.",
    variants: [
      { name: "Strawberry", swatch: "#f0a8b8", image: "/photos/keychains/icecream-duo.jpeg" },
      { name: "Mint Cloud", swatch: "#c8dde3", image: "/photos/keychains/icecream-duo.jpeg" },
    ],
    badge: "New",
    reviews: [
      { name: "Haniya", city: "Lahore", rating: 5, date: "Jun 06, 2026", text: "The gold ring makes it feel so premium! Love both colours." },
      { name: "Eshal", city: "Islamabad", rating: 5, date: "May 21, 2026", text: "Looks like a tiny dessert 🍦 adorable." },
    ],
  },
  {
    id: "berry-cap-mushroom-keychain",
    title: "Berry Cap Mushroom Keychain",
    tagline: "A little forest friend 🍄",
    price: 700,
    category: "keychains",
    description: "Stuffed mushroom charm with a pink berry cap.",
    longDescription:
      "A chubby hand-stuffed mushroom with a hot-pink berry cap, little green leaves, and tiny black bead eyes. Sturdy keyring on top — perfect for backpacks.",
    variants: [
      { name: "Berry Pink", swatch: "#e34c8a", image: "/photos/keychains/berry-mushroom.jpeg" },
    ],
    badge: "New",
    reviews: [
      { name: "Areeba", city: "Faisalabad", rating: 5, date: "Jun 11, 2026", text: "My new favourite backpack charm. Stuffing is firm, stitching is so neat." },
      { name: "Minha", city: "Karachi", rating: 5, date: "May 25, 2026", text: "Cuter than expected — the little face is too much 🥺" },
    ],
  },
  {
    id: "sunshine-duckling-keychain",
    title: "Sunshine Duckling Keychain",
    tagline: "A little duckling holding a daisy 🌼",
    price: 800,
    category: "keychains",
    description: "Soft cream duckling charm with a tiny daisy.",
    longDescription:
      "Hand-stuffed cream-yellow duckling with a pink bonnet, blushed cheeks, and a tiny crochet daisy in its wing. Comes on a heavy-duty lobster clip.",
    variants: [
      { name: "Cream Duckling", swatch: "#f5ecd2", image: "/photos/keychains/duckling-daisy.jpeg" },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Hadiya", city: "Rawalpindi", rating: 5, date: "Jun 14, 2026", text: "Carrying this on my tote and getting stopped by strangers asking where I got it 🦆" },
      { name: "Sara", city: "Karachi", rating: 5, date: "May 30, 2026", text: "The little daisy detail!! So worth it." },
      { name: "Mahnoor", city: "Lahore", rating: 5, date: "May 12, 2026", text: "Heavy clip, doesn't feel cheap at all. Love it." },
    ],
  },
  {
    id: "sun-moon-keychain-pair",
    title: "Sun & Moon Keychain Pair",
    tagline: "Matching sun & moon for best friends ☀️🌙",
    price: 1100,
    category: "keychains",
    description: "Set of two — golden sun & starry navy moon.",
    longDescription:
      "A matching set of hand-crocheted celestial keychains — a swirly golden sun and a starry navy crescent moon (with hand-embroidered stars). Sold as a pair — split with your soulmate.",
    variants: [
      { name: "Set of 2", swatch: "#1f3a72", image: "/photos/keychains/sun-moon.jpeg" },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Taniya", city: "Karachi", rating: 5, date: "Jun 18, 2026", text: "Split with my sister — she took the moon, I kept the sun ☀️🌙 perfect gift." },
      { name: "Zainab", city: "Multan", rating: 5, date: "Jun 04, 2026", text: "The little embroidered stars on the moon are EVERYTHING." },
      { name: "Eshal", city: "Peshawar", rating: 5, date: "May 22, 2026", text: "Beautifully made, sturdy keyrings. Worth every rupee." },
    ],
  },
  {
    id: "chunky-bow-charm-keychain",
    title: "Chunky Bow Charm Keychain",
    tagline: "A plush little bow for your keys 🎀",
    price: 750,
    category: "keychains",
    description: "Oversized chunky crochet bow charm — pick your colour.",
    longDescription:
      "Big, chunky, hand-crocheted bow charm finished with a small hair tie loop so it clips onto keys, bag zips, or ponytails alike. Comes in four rich shades — cobalt blue, magenta, lime, and ivory. Squishy, plush, and endlessly cute.",
    variants: [
      { name: "Cobalt Blue", swatch: "#1f4fb0", image: "/photos/keychains/crochet-bow-charms.jpeg" },
      { name: "Magenta", swatch: "#a11d6a", image: "/photos/keychains/crochet-bow-charms.jpeg" },
      { name: "Lime", swatch: "#c9d94a", image: "/photos/keychains/crochet-bow-charms.jpeg" },
      { name: "Ivory", swatch: "#f5ede0", image: "/photos/keychains/crochet-bow-charms.jpeg" },
      { name: "Slate Blue", swatch: "#4a6a86", image: "/photos/keychains/crochet-bow-charms.jpeg" },
    ],
    badge: "New",
    reviews: [
      { name: "Iman", city: "Lahore", rating: 5, date: "Jul 02, 2026", text: "The magenta is SO rich. Chunkiest bow I've ever owned 🎀" },
      { name: "Rida", city: "Karachi", rating: 5, date: "Jun 20, 2026", text: "Got the whole set — my keys have never looked cuter." },
    ],
  },



  // — Hair accessories —
  {
    id: "flower-vine-crown",
    title: "Wildflower Vine Crown",
    tagline: "Fairycore dreams, woven in yarn 🌸🌿",
    price: 1450,
    category: "hair",
    description: "Trailing crochet flower crown with vine ties.",
    longDescription:
      "A delicate crown of tiny pink blossoms strung on a soft green vine, with two long trailing leaf ties. Perfect for mehndi pictures, garden shoots, or just feeling like a forest fairy on a Tuesday.",
    variants: [
      { name: "Blush Pink", swatch: "#e8a5b0", image: flowerVineCrown.url },
      { name: "Sage Vine", swatch: "#9bb38a", image: flowerVineCrown.url },
      { name: "Ivory Bloom", swatch: "#f3ead7", image: flowerVineCrown.url },
    ],
    badge: "New",
    reviews: [
      { name: "Hooriya", city: "Lahore", rating: 5, date: "May 22, 2026", text: "Wore it for my friend's mehndi and got SO many compliments 🌸 it's even softer than it looks." },
      { name: "Zunaira", city: "Islamabad", rating: 5, date: "May 04, 2026", text: "Such pretty detail on the little flowers. The vine ties make it adjustable too." },
    ],
  },
  {
    id: "flower-bobby-pin-set",
    title: "Flower Garden Bobby Pin Set",
    tagline: "A tiny bouquet for your hair 🌼💙",
    price: 850,
    category: "hair",
    description: "Set of 8 crochet flower bobby pins in 4 colours.",
    longDescription:
      "Eight little crochet flowers — denim blue, snow white, bubblegum pink, and sunflower yellow — stitched onto sturdy bronze bobby pins. Scatter them through a braid or pin back your front pieces.",
    variants: [
      { name: "Full Set (8)", swatch: "#e8a5b0", image: flowerBobbyPins.url },
      { name: "Pink & Yellow", swatch: "#f2b53a", image: flowerBobbyPins.url },
      { name: "Blue & White", swatch: "#3a6ea5", image: flowerBobbyPins.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Areeba", city: "Karachi", rating: 5, date: "Jun 02, 2026", text: "Obsessed. I use these almost every day, the pins actually hold my thick hair 🌼" },
      { name: "Mahnoor", city: "Lahore", rating: 5, date: "May 17, 2026", text: "Colours are so vibrant! Perfect little gift for my sister." },
      { name: "Fajr", city: "Rawalpindi", rating: 4, date: "Apr 30, 2026", text: "Adorable — wish there were a few more pink ones in the set." },
    ],
  },
  {
    id: "chunky-pink-bow-clip",
    title: "Chunky Pink Bow Clip",
    tagline: "Coquette-core, but make it crochet 🎀",
    price: 1100,
    category: "hair",
    description: "Oversized soft pink crochet bow on a sturdy hair clip.",
    longDescription:
      "A big, plush, hand-crocheted bow in the dreamiest blush pink — mounted on a strong French clip that holds half-up styles, low ponies, or thick buns without sliding.",
    variants: [
      { name: "Blush Pink", swatch: "#f3b8c4", image: chunkyPinkBow.url },
      { name: "Cream", swatch: "#f5ede0", image: chunkyPinkBow.url },
      { name: "Cocoa", swatch: "#8b6f5e", image: chunkyPinkBow.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Eshal", city: "Islamabad", rating: 5, date: "Jun 10, 2026", text: "THE bow. Wear it everywhere — uni, dinners, brunches. Holds my hair perfectly 🎀" },
      { name: "Minha", city: "Karachi", rating: 5, date: "May 25, 2026", text: "So plush and well-made. The pink is exactly the soft shade in the photo." },
      { name: "Alizeh", city: "Lahore", rating: 5, date: "May 08, 2026", text: "I get asked where it's from every single time I wear it 💕" },
    ],
  },
  {
    id: "plumeria-flower-clips",
    title: "Plumeria Flower Clip Set",
    tagline: "Soft petals for soft girls 🌺",
    price: 950,
    category: "hair",
    description: "Set of 3 puffy plumeria flower clips.",
    longDescription:
      "Three hand-crocheted plumeria blooms — peach-yellow, bubblegum pink, and snow-white-with-buttercup-yellow — each on a smooth alligator clip. The petals are softly stuffed so they sit perfectly.",
    variants: [
      { name: "Trio Set", swatch: "#f7c8a8", image: plumeriaClips.url },
      { name: "Pink", swatch: "#f5a3b3", image: plumeriaClips.url },
      { name: "Peach", swatch: "#f7c8a8", image: plumeriaClips.url },
    ],
    badge: "New",
    reviews: [
      { name: "Zoya", city: "Karachi", rating: 5, date: "Jun 14, 2026", text: "Like wearing flowers from a Hawaiian beach 🌺 the peach one is my favourite." },
      { name: "Hadiya", city: "Lahore", rating: 5, date: "May 29, 2026", text: "Petals are so puffy and pretty. Worth every rupee!" },
    ],
  },
  {
    id: "pearl-daisy-trio-clip",
    title: "Pearl Daisy Trio Clip",
    tagline: "Three tiny daisies, one big mood 🤍",
    price: 750,
    category: "hair",
    description: "Three crochet daisies with gold pearl centres on one clip.",
    longDescription:
      "Three little white crochet daisies in a neat row, each finished with a tiny gold pearl bead at its centre. Mounted on a slim metal clip — perfect to pin back your front pieces or wear with a half-up.",
    variants: [
      { name: "White & Gold", swatch: "#f5ede0", image: pearlDaisyClip.url },
      { name: "Cream", swatch: "#f3ead7", image: pearlDaisyClip.url },
      { name: "Soft Pink", swatch: "#f3b8c4", image: pearlDaisyClip.url },
    ],
    reviews: [
      { name: "Sara", city: "Islamabad", rating: 5, date: "Jun 07, 2026", text: "So dainty and elegant. The little gold beads make it look so expensive ✨" },
      { name: "Iman", city: "Lahore", rating: 5, date: "May 20, 2026", text: "Perfect for the office — subtle but so cute." },
      { name: "Rafia", city: "Karachi", rating: 4, date: "May 03, 2026", text: "Beautiful — just smaller than I expected, but still gorgeous." },
    ],
  },
  {
    id: "sunflower-headband",
    title: "Sunshine Sunflower Headband",
    tagline: "A field of sunflowers on your head 🌻",
    price: 1350,
    category: "hair",
    description: "Padded headband covered in crochet sunflowers.",
    longDescription:
      "A row of bright golden sunflowers with cocoa-brown centres, hand-stitched onto a comfy padded headband. Sits gently without pinching — great for long wear at events or shoots.",
    variants: [
      { name: "Golden", swatch: "#f2b53a", image: sunflowerHeadband.url },
      { name: "Honey", swatch: "#e5b96a", image: sunflowerHeadband.url },
      { name: "Butter", swatch: "#f3dc99", image: sunflowerHeadband.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Mahnoor", city: "Lahore", rating: 5, date: "Jun 12, 2026", text: "Wore this for an outdoor photoshoot — every picture turned out magical 🌻" },
      { name: "Areeba", city: "Karachi", rating: 5, date: "May 28, 2026", text: "Doesn't hurt behind the ears like other headbands. Love love love." },
      { name: "Noor", city: "Multan", rating: 5, date: "May 11, 2026", text: "The sunflowers are SO detailed. Looks even better in person." },
    ],
  },
  {
    id: "daisy-headband-set",
    title: "Daisy Field Headband + Clip Set",
    tagline: "Headband + matching clip, daisy duo 🌼",
    price: 1550,
    category: "hair",
    description: "Padded daisy headband with a matching double-daisy clip.",
    longDescription:
      "A soft daisy headband paired with a coordinating mini double-daisy clip — wear them together, share with a sister, or alternate them through the week. White petals, sunny yellow centres, sage-green base.",
    variants: [
      { name: "White & Sage", swatch: "#dce5d4", image: daisyHeadbandSet.url },
      { name: "All Cream", swatch: "#f3ead7", image: daisyHeadbandSet.url },
      { name: "Pink Petal", swatch: "#f3b8c4", image: daisyHeadbandSet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Hooriya", city: "Islamabad", rating: 5, date: "Jun 18, 2026", text: "Got the set for me and my little sister — she hasn't taken hers off since 🌼" },
      { name: "Zunaira", city: "Lahore", rating: 5, date: "Jun 01, 2026", text: "Such good value, two pieces for the price of one fancy headband elsewhere." },
    ],
  },
  {
    id: "sunflower-hair-clips",
    title: "Sunflower Pair Hair Clips",
    tagline: "Two suns for your hair ☀️🌻",
    price: 700,
    category: "hair",
    description: "Set of 2 chunky sunflower alligator clips.",
    longDescription:
      "A pair of bold, hand-crocheted sunflowers with rich cocoa centres — mounted on sturdy alligator clips that grip even fine hair. Wear them on either side for full main-character energy.",
    variants: [
      { name: "Pair", swatch: "#f2b53a", image: sunflowerHairClips.url },
      { name: "Golden", swatch: "#e5b96a", image: sunflowerHairClips.url },
      { name: "Butter", swatch: "#f3dc99", image: sunflowerHairClips.url },
    ],
    reviews: [
      { name: "Eshal", city: "Karachi", rating: 5, date: "Jun 09, 2026", text: "Chunky and adorable! Clips are strong — they stay put all day 🌻" },
      { name: "Fajr", city: "Rawalpindi", rating: 5, date: "May 23, 2026", text: "Perfect summer accessory. Already planning to gift a pair." },
      { name: "Iman", city: "Lahore", rating: 4, date: "May 06, 2026", text: "Really cute, slightly bigger than expected — but I love a statement piece." },
    ],
  },
  {
    id: "long-tail-bow-clip",
    title: "Long-Tail Ribbon Bow Clip",
    tagline: "The it-girl bow with dreamy trailing tails 🎀",
    price: 1250,
    category: "hair",
    description: "Oversized crochet bow with long lace-stitch tails.",
    longDescription:
      "A soft mauve crochet bow with long, airy lace-stitch tails that sway down your hair. Mounted on a strong French clip that holds thick hair without slipping.",
    variants: [
      { name: "Mauve", swatch: "#b892a6", image: mauveBowTail.url },
      { name: "Blush Pink", swatch: "#f3b8c4", image: mauveBowTail.url },
      { name: "Cream", swatch: "#f3ead7", image: mauveBowTail.url },
    ],
    badge: "New",
    reviews: [
      { name: "Rania", city: "Lahore", rating: 5, date: "Jun 20, 2026", text: "The tails move so prettily when I walk — feels like a mini fashion moment 🎀" },
      { name: "Sara", city: "Karachi", rating: 5, date: "Jun 04, 2026", text: "Mauve is such a rare shade to find — I get compliments constantly." },
    ],
  },
  {
    id: "floral-hair-scarf",
    title: "Blossom Hair Scarf",
    tagline: "Cottagecore triangle scarf with dangling blooms 🌸",
    price: 1750,
    category: "hair",
    description: "Crochet triangle hair scarf covered in pink blossoms.",
    longDescription:
      "An ivory checker-lace triangle scarf hand-stitched with pink 3D blossoms and green leaves — with dangling flower tassels at the edges. Ties comfortably at the nape for a soft cottagecore look.",
    variants: [
      { name: "Ivory & Pink", swatch: "#f3ead7", image: floralHairScarf.url },
      { name: "Cream & Peach", swatch: "#f7c8a8", image: floralHairScarf.url },
      { name: "White & Sage", swatch: "#dce5d4", image: floralHairScarf.url },
    ],
    badge: "New",
    reviews: [
      { name: "Areeba", city: "Islamabad", rating: 5, date: "Jun 21, 2026", text: "So so pretty — wore it to a garden brunch and everyone asked where it's from 🌸" },
    ],
  },
  {
    id: "granny-bandana-trio",
    title: "Granny Square Bandana",
    tagline: "Retro triangle bandana, three dreamy colourways 🎨",
    price: 1650,
    category: "hair",
    description: "Hand-crocheted granny-square hair bandana.",
    longDescription:
      "A soft, drapey triangle bandana made from tiny granny squares — pick your mood: cream floral with berry centres, snowy white ruffle, or blush pink with a butter bow. Ties at the back or under a low pony.",
    variants: [
      { name: "Cream Floral", swatch: "#f3ead7", image: bandanaTrio.url },
      { name: "Snow White", swatch: "#ffffff", image: bandanaTrio.url },
      { name: "Blush Pink", swatch: "#f3b8c4", image: bandanaTrio.url },
    ],
    reviews: [
      { name: "Hooriya", city: "Lahore", rating: 5, date: "Jun 17, 2026", text: "The pink one is my new signature — soft, cute, and easy to tie 💕" },
      { name: "Zoya", city: "Karachi", rating: 5, date: "May 30, 2026", text: "Feels vintage and modern at the same time. Obsessed with the cream one." },
    ],
  },



  // — Bags —
  {
    id: "red-bow-tan-tote",
    title: "Purple Tulip Cream Tote",
    tagline: "A little garden you can carry 🌷",
    price: 2900,
    category: "bags",
    description: "Cream crochet tote with a row of hand-stitched purple tulips.",
    longDescription:
      "A soft ivory tote crocheted in a tight everyday stitch and finished with a scalloped top edge. Hand-stitched purple and lilac tulips bloom across the front — springtime in bag form. 🌷🧶",
    variants: [
      { name: "Ivory & Tulip", swatch: "#f4ece0", image: tulipCreamTote.url },
    ],
    badge: "New",
  },
  {
    id: "ivory-doily-crossbody-bag",
    title: "Ivory Doily Crossbody Bag",
    tagline: "Heirloom lace, made for every day ✨",
    price: 15000,
    category: "bags",
    description: "Ivory heart-shaped crossbody with lace medallion & tassels.",
    longDescription:
      "A statement heirloom piece — hand-crocheted in creamy ivory cotton with a delicate lace medallion, cascading tassels, and a polished gold chain strap. Structured heart silhouette, fully lined inside. Truly a one-of-a-kind Zizaib treasure. 🤍",
    variants: [
      { name: "Ivory Heirloom", swatch: "#efe5d3", image: ivoryDoilyCrossbody.url },
    ],
    badge: "Limited",
  },
  {
    id: "rust-cream-bobble-tote",
    title: "Rust & Cream Bobble Tote",
    tagline: "Autumn textures, hand-stitched with love 🍂",
    price: 7000,
    category: "bags",
    description: "Chunky rust, cream & mocha bobble tote with tassel charm.",
    longDescription:
      "Woven in rich rust, warm cream and mocha bobble stitches with braided shoulder straps and a plush tassel charm. Roomy, cosy and structured — the perfect cottage-core carry-all. 🍂🧶",
    variants: [
      { name: "Rust & Cream", swatch: "#b3502a", image: rustCreamBobbleTote.url },
    ],
    badge: "New",
  },
  {
    id: "brown-bow-cream-tote",
    title: "Daisy Meadow Sage Tote",
    tagline: "A meadow of daisies on soft sage 🌼",
    price: 2750,
    category: "bags",
    description: "Sage-green granny-square tote scattered with puffy white daisies.",
    longDescription:
      "Hand-joined sage-green granny squares, each blooming with a fluffy white-and-yellow daisy. Long shoulder straps and a squishy, cottage-core silhouette. 🌼🧶",
    variants: [
      { name: "Sage Meadow", swatch: "#9dbf90", image: daisySageTote.url },
    ],
    badge: "New",
  },
  {
    id: "sunflower-daisy-duo-tote",
    title: "Sunflower & Daisy Granny Tote",
    tagline: "Pick your bloom — sunflower or daisy 🌻🌼",
    price: 3100,
    category: "bags",
    description: "Granny-square floral tote — sunflower cream or daisy black.",
    longDescription:
      "Hand-joined granny squares, each blooming with a tiny crocheted sunflower or daisy. Choose sunny cream-and-yellow or dreamy black-and-white — both handmade with so much love. 💕🧶",
    variants: [
      { name: "Sunflower Cream", swatch: "#f1e7d3", image: sunflowerDaisyDuo.url },
      { name: "Daisy Black", swatch: "#1a1a1a", image: sunflowerDaisyDuo.url },
    ],
    badge: "Bestseller",
  },
  {
    id: "red-heart-checker-tote",
    title: "Red Heart Checker Tote",
    tagline: "Hearts on hearts in cherry & cream ❤️",
    price: 2700,
    category: "bags",
    description: "Granny-square tote in cherry red & cream with heart motifs.",
    longDescription:
      "A checker-style tote of hand-joined granny squares in rich cherry red and soft cream, each square crocheted with a tiny heart in the middle. Romantic, cosy and one-of-a-kind. 💖🧶",
    variants: [
      { name: "Cherry & Cream", swatch: "#b9303a", image: redHeartCheckerTote.url },
    ],
    badge: "New",
  },
  {
    id: "brown-heart-checker-tote",
    title: "Cocoa Heart Checker Tote",
    tagline: "Cocoa & cream hearts, hand-stitched with love 🤎",
    price: 2700,
    category: "bags",
    description: "Brown & cream granny-square tote with sweet heart motifs.",
    longDescription:
      "Rich chocolate brown and warm cream granny squares, each one crocheted with a little heart at its centre. A cosy autumn classic with thick shoulder straps. 💕🧶",
    variants: [
      { name: "Cocoa & Cream", swatch: "#7a4a2b", image: brownHeartCheckerTote.url },
    ],
    badge: "New",
  },
  {
    id: "strawberry-tote",
    title: "Strawberry Patch Tote",
    tagline: "Hand-stitched strawberries 🍓",
    price: 2800,
    category: "bags",
    description: "Cream tote sprinkled with tiny crochet strawberries.",
    longDescription:
      "A roomy cream tote dotted with hand-stitched strawberry bobbles. Sturdy long straps, soft cotton lining inside — sweet enough to eat. 🍓✨",
    variants: [
      { name: "Peach Blush", swatch: "#f7c8a8", image: strawberryPeach.url },
      { name: "Buttercream", swatch: "#f5ecd2", image: strawberryCream.url },
    ],
    badge: "Bestseller",
  },
  {
    id: "heart-granny-tote",
    title: "Heart Granny Square Tote",
    tagline: "Patchwork hearts in pastel squares 💕",
    price: 2600,
    category: "bags",
    description: "Granny-square tote with sweet heart motifs.",
    longDescription:
      "Hand-joined granny squares featuring tiny crochet hearts. Pick blush rose or soft sage — each square is crocheted, then stitched together by hand. 🧶💕",
    variants: [
      { name: "Blush Rose", swatch: "#e8b8be", image: heartGranny.url },
      { name: "Soft Sage", swatch: "#b9cdb1", image: heartGranny.url },
    ],
    badge: "Bestseller",
  },
  {
    id: "chunky-knit-tote",
    title: "Chunky Crochet Tote",
    tagline: "Cosy, structured & oh-so-chunky 🧶",
    price: 3200,
    category: "bags",
    description: "Thick chunky-yarn tote — four cosy shades to choose from.",
    longDescription:
      "Crocheted in plush chunky yarn with rolled handles that sit beautifully on the shoulder. Lined inside and structured enough to hold its shape all day. ✨",
    variants: [
      { name: "Cocoa Brown", swatch: "#7a4a2b", image: chunkyTotes.url },
      { name: "Sage Green", swatch: "#9dbf90", image: chunkyTotes.url },
      { name: "Ivory", swatch: "#f4ece0", image: chunkyTotes.url },
      { name: "Warm Beige", swatch: "#d9bfa3", image: chunkyTotes.url },
    ],
    badge: "New",
  },

  // — Home accessories —
  {
    id: "pastel-bow-mug-cozy",
    title: "Pastel Bow Mug Cozy",
    tagline: "A little sweater for your chai ☕🎀",
    price: 850,
    category: "home",
    description: "Textured crochet mug cozy topped with a hand-tied bow — choose your pastel.",
    longDescription:
      "Keeps your fingers cool and your chai cosy. Stretchy textured crochet band with a soft matching bow — slips onto takeaway cups and most mugs. Pick your favourite pastel.",
    variants: [
      { name: "Blush Pink", swatch: "#f4c8d2", image: homeImg.pastelBow },
      { name: "Sky Blue", swatch: "#9ec7e3", image: homeImg.pastelBow },
      { name: "Sage Green", swatch: "#b6cfa8", image: homeImg.pastelBow },
      { name: "Lilac", swatch: "#c9b9e5", image: homeImg.pastelBow },
    ],
    badge: "New",
    reviews: [
      { name: "Alizeh", city: "Lahore", rating: 5, date: "Jun 22, 2026", text: "So cute on my morning coffee cup! The bow is the cherry on top 🎀" },
    ],
  },
  {
    id: "alphabet-mug-cozies",
    title: "Alphabet Letter Mug Cozy",
    tagline: "Your initial, hand-stitched 💌",
    price: 1200,
    category: "home",
    description: "Personalised mug cozy with your letter & a tiny flower.",
    longDescription:
      "Pick your favourite pastel — butter, dusty pink, sky blue, lilac, blush or lavender — and I'll crochet your initial with a tiny flower accent. Buttons on so it hugs any mug. The sweetest gift for a bestie or bridal party.",
    variants: [
      { name: "Butter Yellow", swatch: "#f3dc99", image: homeImg.alphabet },
      { name: "Dusty Pink", swatch: "#c98aa4", image: homeImg.alphabet },
      { name: "Sky Blue", swatch: "#9ec7e3", image: homeImg.alphabet },
      { name: "Lilac", swatch: "#b9a3d6", image: homeImg.alphabet },
      { name: "Blush", swatch: "#f4c8d2", image: homeImg.alphabet },
      { name: "Lavender Grey", swatch: "#b7b3c8", image: homeImg.alphabet },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Zoya", city: "Islamabad", rating: 5, date: "Jun 15, 2026", text: "Gifted these to my bridesmaids with their initials — they cried 🥹" },
      { name: "Minha", city: "Karachi", rating: 5, date: "Jun 02, 2026", text: "So neat, the letter is perfectly stitched." },
    ],
  },
  {
    id: "tulip-mug-cozy-set",
    title: "White Tulip Mug Cozy & Coaster",
    tagline: "Tulips on your tea table 🌷",
    price: 2200,
    category: "home",
    description: "Lacy white mug cozy + matching tulip-edge coaster.",
    longDescription:
      "A soft white lace mug cozy topped with a row of pink tulip buds, paired with a matching round coaster edged in tulips and sage leaves. Perfect for cottagecore mornings.",
    variants: [
      { name: "White & Pink", swatch: "#f7f4ee", image: homeImg.tulipSet },
    ],
    badge: "New",
    reviews: [
      { name: "Hadiya", city: "Rawalpindi", rating: 5, date: "Jun 18, 2026", text: "The tulips are so tiny and perfect. My tea nook looks like a fairytale 🌷" },
    ],
  },
  {
    id: "sweetheart-mug-cozy-duo",
    title: "Sweetheart Mug Cozy Duo",
    tagline: "For chai dates & love notes 💕",
    price: 1700,
    category: "home",
    description: "Pair of hearts mug cozies — blush confetti & classic red.",
    longDescription:
      "A romantic duo of mug cozies: one soft blush pink dotted with tiny multi-shade hearts, and one bold red with a single big pink heart and stitched trim. Perfect for couples, besties, or a cosy self-care shelf.",
    variants: [
      { name: "Blush + Red Pair", swatch: "#e94f6a", image: homeImg.hearts },
      { name: "Blush Confetti Only", swatch: "#f4c8d2", image: homeImg.hearts },
      { name: "Red Big Heart Only", swatch: "#c9243a", image: homeImg.hearts },
    ],
    badge: "New",
    reviews: [
      { name: "Iman", city: "Karachi", rating: 5, date: "Jun 30, 2026", text: "Got the pair for me and my husband — coffee time hits different 💕" },
    ],
  },
  {
    id: "daisy-curtain-tieback",
    title: "White Daisy Curtain Tieback",
    tagline: "Fresh daisies for your windows 🌼",
    price: 1500,
    category: "home",
    description: "Sage cord tieback with two puffy white daisies & leaves.",
    longDescription:
      "A slim sage-green braided cord that ties around your curtain and blooms into two plush white daisies with sunny yellow centres and crisp green leaves. Sold as a single tieback — grab two for a matching pair.",
    variants: [
      { name: "White & Sage", swatch: "#eef2e6", image: homeImg.daisyTieback },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Taniya", city: "Karachi", rating: 5, date: "Jun 12, 2026", text: "Instantly upgraded my dull curtains 🥹 so delicate!" },
    ],
  },
  {
    id: "pink-blossom-curtain-tieback",
    title: "Pink Cord Blossom Tieback",
    tagline: "Two dusty pink bows, two beige blossoms 🌸",
    price: 1700,
    category: "home",
    description: "Dusty pink braided tieback finished in a bow with beige blossom charms.",
    longDescription:
      "A soft dusty-pink braided cord that loops your curtain into a plush bow, with two hand-crocheted beige daisy blossoms dangling from the tails. Feminine, minimal, and endlessly cottage.",
    variants: [
      { name: "Dusty Pink & Beige", swatch: "#d8a3b2", image: homeImg.pinkFlowerTieback },
    ],
    badge: "New",
    reviews: [
      { name: "Hira", city: "Rawalpindi", rating: 5, date: "Jun 09, 2026", text: "The bow is just perfect — swings so prettily 💕" },
    ],
  },
  {
    id: "bottle-carrier-sleeve",
    title: "Cosy Bottle Carrier Sleeve",
    tagline: "Your water bottle deserves a hug 💧",
    price: 2400,
    category: "home",
    description: "Openwork crochet bottle sleeve with a crossbody strap — fits most bottles.",
    longDescription:
      "A breathable openwork bottle carrier with a sturdy woven handle and detachable crossbody strap. Fits standard 500ml–1L bottles. Choose from soft neutrals or the sweetheart pink bow edition.",
    variants: [
      { name: "Ivory", swatch: "#f4ece0", image: homeImg.bottleTrio },
      { name: "Sand Beige", swatch: "#d9bfa3", image: homeImg.bottleTrio },
      { name: "Taupe", swatch: "#a48468", image: homeImg.bottleTrio },
      { name: "Pink Bow Edition", swatch: "#f3b8c4", image: homeImg.bottlePinkBow },
      { name: "Cream & Cocoa Bow", swatch: "#5b3a2a", image: homeImg.bottleCreamBrown },
    ],
    badge: "New",
    reviews: [
      { name: "Sara", city: "Lahore", rating: 5, date: "Jun 28, 2026", text: "Turned my boring water bottle into an accessory 💧✨" },
    ],
  },



  // — Diaries & Book Covers —
  {
    id: "daisy-embroidered-diary-cover",
    title: "Daisy Embroidered Diary Cover",
    tagline: "Hand-stitched daisies on soft pastel crochet 🌼",
    price: 3200,
    category: "diaries",
    description: "A5 crochet diary cover with embroidered daisy bouquet, button closure and tassel bookmark.",
    longDescription:
      "A soft cotton crochet cover with a scalloped edge, tiny wooden button and cream tassel bookmark. Hand-embroidered daisies bloom on the front. Slides onto most A5 diaries and journals. Pick your colour.",
    variants: [
      { name: "Blush Pink", swatch: "#f4c8d2", image: pinkDaisyDiary.url },
      { name: "Sage Green", swatch: "#b9cdb1", image: sageDaisyDiary.url },
    ],
    badge: "New",
    reviews: [
      { name: "Alizeh", city: "Lahore", rating: 5, date: "Jun 21, 2026", text: "Made my journaling era feel so special 📖🩷" },
    ],
  },
  {
    id: "berry-sprinkle-diary-cover",
    title: "Berry Sprinkle Diary Cover",
    tagline: "Tiny embroidered strawberries all over ✨🍓",
    price: 3400,
    category: "diaries",
    description: "Cream crochet A5 diary cover sprinkled with hand-stitched strawberries and a soft pink button.",
    longDescription:
      "Cotton crochet cover in soft cream, hand-embroidered with rows of little red strawberries and green leaves. A pastel pink button closure keeps it shut. Fits most A5 diaries. Choose the berry pattern or a minimal pink option with a single floral medallion.",
    variants: [
      { name: "Cream Strawberry", swatch: "#f6ead9", image: strawberryDiary.url },
      { name: "Pink Petal", swatch: "#e7a9c0", image: pinkMedallionDiary.url },
    ],
    badge: "New",
    reviews: [
      { name: "Mahnoor", city: "Islamabad", rating: 5, date: "Jun 18, 2026", text: "The strawberries are so tiny and perfect 🍓" },
    ],
  },
  {
    id: "floral-bouquet-diary-cover",
    title: "Floral Bouquet Diary Cover",
    tagline: "A little crochet bouquet on your journal 💐",
    price: 3600,
    category: "diaries",
    description: "Blush pink crochet diary cover with a 3D floral bouquet applique and long bookmark tie.",
    longDescription:
      "Textured blush pink crochet cover with a hand-appliqued bouquet of tiny flowers, leaves and a wooden button. A long crochet tie doubles as a bookmark. Slips onto most A5 diaries.",
    variants: [
      { name: "Blush Pink", swatch: "#f2b6c6", image: pinkFloralBouquetDiary.url },
    ],
    reviews: [
      { name: "Anood", city: "Karachi", rating: 5, date: "Jun 15, 2026", text: "The little bouquet on the front is the cutest thing 💐" },
    ],
  },
  {
    id: "granny-square-diary-cover",
    title: "Granny Square Diary Cover",
    tagline: "Classic granny squares, journal edition 🌸",
    price: 3000,
    category: "diaries",
    description: "A5 diary cover made of six hand-crocheted granny squares with a flower bookmark tie.",
    longDescription:
      "Six chunky granny squares stitched together into a cosy diary cover. Comes with a crochet flower bookmark on a long tie so you never lose your page. Pick your palette.",
    variants: [
      { name: "Pink & Tan", swatch: "#d68aa4", image: pinkGrannyDiary.url },
      { name: "Green Daisy", swatch: "#a8c948", image: greenDaisyGrannyDiary.url },
      { name: "Sage & Cream", swatch: "#7ea683", image: greenCreamGrannyDiary.url },
    ],
    badge: "New",
    reviews: [
      { name: "Zara", city: "Lahore", rating: 5, date: "Jun 12, 2026", text: "Obsessed with the sage & cream one — feels like a keepsake 🌿" },
    ],
  },

  // — Flower bouquets —
  {
    id: "rose-daisy-bouquet",
    title: "Rose & Daisy Garden Bouquet",
    tagline: "Roses, daisies and a twine bow — pure cottagecore 🌹🌼",
    price: 3200,
    category: "bouquets",
    description: "Red, white and butter roses with daisies, tied in jute twine.",
    longDescription:
      "A lush hand-tied bouquet of crocheted roses (cherry red, soft white, butter yellow) nestled with classic daisies and chunky green leaves, finished with a rustic jute twine bow. A forever-bloom gift for anniversaries, weddings or just because. 🌹🌼🎀",
    variants: [
      { name: "Garden Mix", swatch: "#b8323a", image: roseDaisyBouquet.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Hira", city: "Lahore", rating: 5, text: "Gifted this to my mum on her birthday — she literally cried. The roses look so real!", date: "2026-05-02" },
      { name: "Sana", city: "Karachi", rating: 5, text: "Worth every rupee. The twine bow is such a cute detail. 🥺", date: "2026-04-18" },
    ],
  },
  {
    id: "daisy-kraft-bouquet",
    title: "Fresh Daisy Kraft Bouquet",
    tagline: "A handful of sunshine daisies in kraft paper ☀️🌼",
    price: 2600,
    category: "bouquets",
    description: "Seven chunky daisies wrapped in kraft paper with a satin bow.",
    longDescription:
      "Seven hand-stitched fluffy daisies with sunny yellow centers and crisp white petals, bundled with crochet leaves and wrapped in kraft paper, finished with a silky white satin bow. Cheerful, simple, and forever in bloom. 🌼✨",
    variants: [
      { name: "Daisy White", swatch: "#fafaf6", image: daisyKraftBouquet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Mahira", city: "Islamabad", rating: 5, text: "So so cute! Sitting on my study desk and instantly cheers me up. 🌼", date: "2026-05-20" },
      { name: "Ayesha", city: "Rawalpindi", rating: 5, text: "Packaging was beautiful, daisies are even fluffier in person.", date: "2026-05-11" },
    ],
  },
  {
    id: "blue-lily-bouquet",
    title: "Midnight Blue Lily Bouquet",
    tagline: "One bold cobalt lily — minimal, moody, magic 💙",
    price: 1900,
    category: "bouquets",
    description: "Single statement crochet lily in deep cobalt blue.",
    longDescription:
      "A single, oversized crocheted lily in rich cobalt blue with tiny golden stamens, hand-wrapped in soft white paper and tied with a satin blue ribbon. Minimal, romantic, and unforgettable. 💙🎀",
    variants: [
      { name: "Cobalt", swatch: "#1f3a9b", image: blueLilyBouquet.url },
    ],
    reviews: [
      { name: "Zoya", city: "Lahore", rating: 5, text: "Got this for my boyfriend instead of regular flowers — he loved how unique it was.", date: "2026-04-29" },
      { name: "Areeba", city: "Karachi", rating: 4, text: "Such a statement piece. The blue is even prettier in real life.", date: "2026-05-06" },
    ],
  },
  {
    id: "pastel-garden-bouquet",
    title: "Pastel Garden Dream Bouquet",
    tagline: "Sunflower, roses, tulips — a whole pastel garden 🌻🌷🌸",
    price: 3800,
    category: "bouquets",
    description: "A pastel mix of sunflower, roses, tulips and tiny buds.",
    longDescription:
      "An overflowing bouquet of soft pastels — a golden sunflower, lavender and pink roses, butter and blue tulips, with delicate tulle peeking through, all hand-wrapped in kraft paper with a blush satin bow. A whole garden in one bouquet. 🌻💐",
    variants: [
      { name: "Pastel Mix", swatch: "#f3b8c4", image: pastelGardenBouquet.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Eman", city: "Islamabad", rating: 5, text: "The most beautiful bouquet I've ever received. Sitting pretty in my room forever now. 🥹", date: "2026-05-22" },
      { name: "Noor", city: "Lahore", rating: 5, text: "Absolutely worth it — the sunflower is HUGE and so well made.", date: "2026-05-08" },
      { name: "Hafsa", city: "Faisalabad", rating: 5, text: "Best gift I gave my sister on her wedding. She still has it on her dresser. 💕", date: "2026-04-25" },
    ],
  },
  {
    id: "earthy-lily-rose-bouquet",
    title: "Earthy Lily & Rose Bouquet",
    tagline: "Moody lilies, cocoa rose, ivory tulips — pure poetry 🤎",
    price: 3500,
    category: "bouquets",
    description: "Cocoa, ivory and peach lilies with a chocolate rose.",
    longDescription:
      "An artisanal bouquet of crocheted lilies in deep cocoa and soft peach, a chocolate-brown rose, and crisp ivory tulips, layered with deep green leaves and tied in textured kraft paper with a 'Love is Eternal' ribbon. For someone who loves a moody, earthy palette. 🤎🌿",
    variants: [
      { name: "Cocoa & Cream", swatch: "#6a3a25", image: earthyLilyRoseBouquet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Mehwish", city: "Karachi", rating: 5, text: "Obsessed with the colour palette — so different from typical pink bouquets!", date: "2026-05-15" },
      { name: "Rabia", city: "Lahore", rating: 5, text: "Looks so expensive and high-end. The brown rose is my favourite. 🍫", date: "2026-05-03" },
    ],
  },
  {
    id: "bear-tulip-daisy-bouquet",
    title: "Teddy & Tulip Mini Bouquet",
    tagline: "A tiny bear, a tulip and daisies — the cutest little gift 🧸🌷",
    price: 2200,
    category: "bouquets",
    description: "Mini bouquet with a yellow teddy, pink tulips and daisies.",
    longDescription:
      "A small but mighty cute bouquet — a smiley yellow teddy bear, two pink crochet tulips and two cheerful daisies, hand-wrapped in kraft paper with a silver satin bow. Perfect for besties, kids, or a 'thinking of you' surprise. 🧸💐",
    variants: [
      { name: "Sunny Bear", swatch: "#f4d36b", image: bearTulipDaisyBouquet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Alizeh", city: "Islamabad", rating: 5, text: "Gave it to my best friend on her birthday — she screamed at the cuteness! 🧸", date: "2026-05-18" },
      { name: "Fatima", city: "Lahore", rating: 5, text: "Perfect size, perfect price. The bear is so smiley. 🥰", date: "2026-05-09" },
    ],
  },
  {
    id: "sunflower-meadow-bouquet",
    title: "Sunflower Meadow Bouquet",
    tagline: "A big sunflower in a wildflower meadow 🌻🌾",
    price: 3400,
    category: "bouquets",
    description: "Bold sunflower with daisies, buds, lilies and tiny purples.",
    longDescription:
      "A statement crocheted sunflower surrounded by wild daisies, lilies, pink buds and tiny purple blossoms — like a hand-picked summer meadow that never fades. Wrapped in natural burlap-style fabric for a warm, rustic finish. 🌻🌾✨",
    variants: [
      { name: "Sunflower Meadow", swatch: "#e8a73c", image: sunflowerMeadowBouquet.url },
    ],
    reviews: [
      { name: "Komal", city: "Karachi", rating: 5, text: "The sunflower is GIANT and gorgeous. So much detail in every petal!", date: "2026-05-12" },
      { name: "Sadia", city: "Multan", rating: 5, text: "Brightens up my whole room. Felt like summer in a bouquet. 🌻", date: "2026-04-30" },
    ],
  },
  {
    id: "pink-rose-bouquet",
    title: "Blush Pink Rose Bouquet",
    tagline: "Soft pink rose, tiny blossoms and tulle — total princess energy 🌸👑",
    price: 2900,
    category: "bouquets",
    description: "Big blush rose with pink blossoms, leaves and tulle wrap.",
    longDescription:
      "A dreamy bouquet built around one chubby blush rose with delicate pink blossoms, soft green leaves and airy tulle, wrapped in soft pink paper with a sheer ribbon. The girliest, pinkest gift in the shop. 🌸💕",
    variants: [
      { name: "Blush Pink", swatch: "#f3b8c4", image: pinkRoseBouquet.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Iqra", city: "Lahore", rating: 5, text: "The PINKEST cutest bouquet ever. Got it for my bridal shower decor. 💕", date: "2026-05-21" },
      { name: "Anum", city: "Islamabad", rating: 5, text: "Tulle wrap made it look so premium. My sister wouldn't stop hugging it. 🥺", date: "2026-05-04" },
    ],
  },
  {
    id: "lavender-lily-bouquet",
    title: "Lavender & White Lily Bouquet",
    tagline: "Purple lavender sprigs with dreamy white lilies 💜🤍",
    price: 2800,
    category: "bouquets",
    description: "Hand-crocheted white lilies with lavender sprigs, wrapped in ivory paper.",
    longDescription:
      "A serene bouquet of two large ivory lilies with golden centers, nestled among slender purple lavender sprigs and a single crochet rose. Wrapped in a textured ivory paper with a lilac satin ribbon — the calmest, prettiest gift. 💜✨",
    variants: [
      { name: "Lavender & Ivory", swatch: "#b7a4d8", image: lavenderLilyBouquet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Aiman", city: "Islamabad", rating: 5, date: "Jun 26, 2026", text: "The lavender sprigs are so delicate — feels like a piece of art on my shelf 💜" },
    ],
  },
  {
    id: "sunflower-rose-bouquet",
    title: "Sunflower & Rose Grand Bouquet",
    tagline: "A big sunflower, red roses, pink blush — bridal energy 🌻🌹",
    price: 4200,
    category: "bouquets",
    description: "Sunflower with red roses, blush rose, tulips and pink baby's breath.",
    longDescription:
      "A grand hand-tied bouquet — a golden sunflower crown, deep cherry roses, a chubby blush rose, cream and pink tulips, and airy pink baby's breath. Wrapped in blush pink and gold-trimmed paper with a rich burgundy ribbon. The showstopper gift for anniversaries, engagements, or big moments. 💐✨",
    variants: [
      { name: "Blush & Burgundy", swatch: "#9b1c2c", image: sunflowerRoseBouquet.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Nashwa", city: "Lahore", rating: 5, date: "Jun 24, 2026", text: "GORGEOUS. Gifted for my sister's engagement — she's keeping it forever." },
      { name: "Rida", city: "Karachi", rating: 5, date: "Jun 10, 2026", text: "So much bigger and more premium than the photos. Worth every rupee!" },
    ],
  },
  {
    id: "triple-sunflower-bouquet",
    title: "Triple Sunflower Burlap Bouquet",
    tagline: "Three big sunflowers in rustic burlap ☀️🌻",
    price: 2700,
    category: "bouquets",
    description: "Three chunky sunflowers wrapped in warm burlap with a satin bow.",
    longDescription:
      "Three oversized hand-crocheted sunflowers with rich dark centers and bright golden petals, nestled in rustic burlap wrap with a soft cream satin bow. Warm, sunny, and timeless — for the person who brightens your day. 🌻",
    variants: [
      { name: "Golden Trio", swatch: "#e8a73c", image: tripleSunflowerBouquet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Hafsa", city: "Faisalabad", rating: 5, date: "Jun 28, 2026", text: "So bright and cheerful — sits by my window and makes me smile every morning ☀️" },
    ],
  },
  {
    id: "pastel-tulip-garden-bouquet",
    title: "Pastel Tulip Garden Bouquet",
    tagline: "Tulips, bluebells & daisies in blush wrap 🌷💗",
    price: 3600,
    category: "bouquets",
    description: "Blush tulips, bluebells, daisies and yellow buds wrapped in pink paper.",
    longDescription:
      "A soft, romantic hand-tied garden bouquet — coral and pink tulips, powder-blue bluebells, cheerful daisies with buttery centers, and clusters of tiny yellow buds. Wrapped in blush and ivory textured paper with a white satin ribbon. Pure spring in your hands. 🌷🌼",
    variants: [
      { name: "Blush Garden", swatch: "#f3b8c4", image: "/photos/bouquets/pastel-tulip-garden.webp" },
    ],
    badge: "New",
    reviews: [
      { name: "Areesha", city: "Lahore", rating: 5, date: "Jul 04, 2026", text: "The prettiest bouquet I have ever seen — every flower is so detailed 💗" },
      { name: "Nimra", city: "Islamabad", rating: 5, date: "Jun 22, 2026", text: "Bought for my mum's birthday. She keeps taking pictures of it 🥺" },
    ],
  },
  {
    id: "burlap-pink-rose-bouquet",
    title: "Burlap Blush Rose Bouquet",
    tagline: "Chunky pink roses in rustic burlap 🌹",
    price: 3100,
    category: "bouquets",
    description: "Three plush blush roses with leaves, wrapped in burlap with a satin bow.",
    longDescription:
      "Three hand-crocheted blush pink roses with soft green leaves, nestled in warm rustic burlap and finished with a blush satin bow and a tiny heart tag. Cozy, timeless, and full of love. 🌹💕",
    variants: [
      { name: "Blush Roses", swatch: "#e6a9b3", image: "/photos/bouquets/burlap-pink-roses.jpg" },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Zoha", city: "Karachi", rating: 5, date: "Jul 06, 2026", text: "The burlap wrap is so premium — feels like a florist bouquet 🌹" },
    ],
  },
  {
    id: "rose-daisy-pink-wrap-bouquet",
    title: "Single Rose & Daisy Bouquet",
    tagline: "One pink rose, daisies & baby's breath 🌸",
    price: 2400,
    category: "bouquets",
    description: "One statement rose with daisies and dried baby's breath in pink wrap.",
    longDescription:
      "A single showstopper pink crochet rose with two crisp daisies and delicate dried baby's breath sprigs, hand-wrapped in a sheer pink cellophane fan with an organza white bow. Minimal, romantic, unforgettable. 🌸💐",
    variants: [
      { name: "Pink Rose", swatch: "#d6708b", image: "/photos/bouquets/rose-daisy-pink-wrap.webp" },
    ],
    badge: "New",
    reviews: [
      { name: "Fatima", city: "Rawalpindi", rating: 5, date: "Jul 08, 2026", text: "Gave it to my sister — she said it looked more premium than a real bouquet 🌸" },
    ],
  },



  // — Bracelets & Watch Straps —
  {
    id: "nato-stripe-watch-strap",
    title: "Sunny NATO Stripe Watch Strap",
    tagline: "Hand-crocheted NATO strap with buckle 🧶⌚",
    price: 1850,
    category: "watches",
    description: "Bold blue/yellow/red stripe strap with metal buckle.",
    longDescription:
      "A pull-through NATO-style watch strap, crocheted in fine cotton stripes of cobalt, sunflower yellow, cherry red and cream — finished with a sturdy stainless steel buckle. Fits standard 18–22mm lugs. ⌚✨",
    variants: [
      { name: "Cobalt Stripe", swatch: "#234aa8", image: natoStripeStrap.url },
    ],
    badge: "New",
    reviews: [
      { name: "Hira", city: "Lahore", rating: 5, date: "Jun 14, 2026", text: "Switched my old leather strap for this — so many compliments! Feels well made too." },
      { name: "Anum", city: "Karachi", rating: 5, date: "May 30, 2026", text: "The colours pop in person. Buckle is proper metal, very secure." },
    ],
  },
  {
    id: "teal-diamond-apple-strap",
    title: "Teal Diamond Apple Watch Strap",
    tagline: "Boho Apple Watch band with tassels 🌊",
    price: 1650,
    category: "watches",
    description: "Aqua & coral diamond-motif band for Apple Watch.",
    longDescription:
      "A hand-crocheted Apple Watch band in soft aqua with coral diamond motifs and the cutest little braided tassels at each end. Ties on for a perfect, adjustable fit. Fits 38–45mm Apple Watch cases. ✨",
    variants: [
      { name: "Aqua & Coral", swatch: "#5fb8b3", image: tealDiamondStrap.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Mahnoor", city: "Islamabad", rating: 5, date: "Jun 08, 2026", text: "So pretty for summer! The tassels are the cutest detail." },
      { name: "Sana", city: "Lahore", rating: 5, date: "May 24, 2026", text: "Light, comfy and feels gentle on the wrist all day." },
      { name: "Eshal", city: "Karachi", rating: 4, date: "May 10, 2026", text: "Took a few tries to tie it just right, but it looks adorable." },
    ],
  },
  {
    id: "floral-granny-watch-strap",
    title: "Floral Granny Watch Strap",
    tagline: "Tiny granny-square flowers for your wrist 🌸",
    price: 1750,
    category: "watches",
    description: "Cream watch strap with red, pink & yellow flower squares.",
    longDescription:
      "A cream crochet strap built from petite granny squares, each blooming with a red, pink or marigold puff flower. Links onto your existing watch face with sturdy jump rings. Adjustable fit. 🌼🧶",
    variants: [
      { name: "Cream Garden", swatch: "#f4ecdc", image: floralGrannyStrap.url },
    ],
    badge: "New",
    reviews: [
      { name: "Areeba", city: "Rawalpindi", rating: 5, date: "Jun 12, 2026", text: "Took me right back to my nani's crochet — so nostalgic and pretty." },
      { name: "Iman", city: "Karachi", rating: 5, date: "May 28, 2026", text: "Looks gorgeous with my vintage watch face. Sturdy stitching too." },
    ],
  },
  {
    id: "pink-crochet-watch-strap",
    title: "Blush Petal Crochet Watch Strap",
    tagline: "Soft lilac-pink strap with a copper button 🌸",
    price: 1550,
    category: "watches",
    description: "Minimal pink crochet watch strap with copper button clasp.",
    longDescription:
      "A delicate hand-crocheted watch strap in the softest blush lilac cotton, finished with a warm copper button clasp. Slim, comfy and endlessly wearable — pairs beautifully with a rose-gold watch face. 🌸✨",
    variants: [
      { name: "Blush Lilac", swatch: "#e7c3d4", image: pinkCrochetStrap.url },
      { name: "Cream Garden", swatch: "#f4ecdc", image: floralGrannyStrap.url },
    ],
    badge: "New",
    reviews: [
      { name: "Noor", city: "Lahore", rating: 5, date: "Jun 22, 2026", text: "So dainty and soft on the wrist — the copper button is adorable ✨" },
      { name: "Zara", city: "Karachi", rating: 5, date: "Jun 09, 2026", text: "Matches my rose gold watch perfectly. Compliments non-stop." },
    ],
  },
  {
    id: "ivory-bobble-bracelet",
    title: "Ivory Cloud Bobble Bracelet",
    tagline: "Fluffy bobbles + tiny bell drops 🤍🔔",
    price: 1100,
    category: "watches",
    description: "Stretchy ivory popcorn-stitch bracelet with bell charms.",
    longDescription:
      "Plush cream popcorn-stitch bracelet with soft sage stems and tiny silver bells that gently jingle as you move. Stretchy fit, slips on easy — wear one or stack with the bobble bracelet family. ✨",
    variants: [
      { name: "Ivory & Bells", swatch: "#f5ede0", image: ivoryBobbleBracelet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Zoya", city: "Lahore", rating: 5, date: "Jun 16, 2026", text: "So soft and bridal — wore it to a mehendi and got so many compliments 🤍" },
      { name: "Hadiya", city: "Karachi", rating: 5, date: "Jun 02, 2026", text: "The little bells are the cutest touch. Stretchy and very comfy." },
    ],
  },
  {
    id: "marigold-bobble-bracelet",
    title: "Marigold Bobble Bracelet",
    tagline: "Genda phool for your wrist 🌼",
    price: 1100,
    category: "watches",
    description: "Vibrant marigold popcorn bracelet with little bud drops.",
    longDescription:
      "A bright marigold popcorn-stitch bracelet with sage green stems and tiny crocheted bud charms — desi wedding energy in a wearable form. Stretchy, soft, easy on. 🌼✨",
    variants: [
      { name: "Marigold", swatch: "#f2a23a", image: marigoldBobbleBracelet.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Alizeh", city: "Lahore", rating: 5, date: "Jun 18, 2026", text: "Perfect for mayoun! Looked like real genda phool around my wrist 🌼" },
      { name: "Minha", city: "Multan", rating: 5, date: "Jun 05, 2026", text: "Pakistani aesthetic done so well. Stretchy and stays put." },
      { name: "Sara", city: "Karachi", rating: 5, date: "May 22, 2026", text: "Bought 3 for my cousins — they LOVED it. So well made." },
    ],
  },
  {
    id: "ruby-bobble-bracelet",
    title: "Ruby Rose Bobble Bracelet",
    tagline: "Deep red bobbles with bud charms ❤️",
    price: 1100,
    category: "watches",
    description: "Rich ruby popcorn-stitch bracelet with rose bud drops.",
    longDescription:
      "A romantic ruby red popcorn-stitch bracelet finished with sage stems and tiny crocheted rose buds. Stretchy, snug, and dramatic in the prettiest way. Stack with the marigold for full bridal joora vibes. 💃",
    variants: [
      { name: "Ruby Red", swatch: "#9b1c2c", image: rubyBobbleBracelet.url },
    ],
    badge: "New",
    reviews: [
      { name: "Fajr", city: "Islamabad", rating: 5, date: "Jun 20, 2026", text: "WORE THIS WITH RED. Felt like a whole moment ❤️" },
      { name: "Taniya", city: "Karachi", rating: 5, date: "Jun 06, 2026", text: "Such a rich colour, and the bud charms are so detailed." },
    ],
  },
  {
    id: "pink-bobble-bracelet",
    title: "Pink & Cream Bobble Bracelet",
    tagline: "Cotton candy on your wrist 🩷",
    price: 1100,
    category: "watches",
    description: "Soft pink & cream popcorn bracelet — sweetest stretch fit.",
    longDescription:
      "Plush bracelet crocheted in alternating pink and cream popcorn stitches — soft, squishy and so easy to slip on. Wear solo or layer with the bobble bracelet family. 🩷✨",
    variants: [
      { name: "Pink & Cream", swatch: "#f3b8c4", image: pinkBobbleBracelet.url },
    ],
    badge: "Bestseller",
    reviews: [
      { name: "Eshal", city: "Lahore", rating: 5, date: "Jun 19, 2026", text: "The softest pink — matches everything in my wardrobe 🩷" },
      { name: "Hira", city: "Rawalpindi", rating: 5, date: "Jun 04, 2026", text: "Comfy enough to forget I'm wearing it. Stitches are so neat." },
      { name: "Areeba", city: "Karachi", rating: 4, date: "May 18, 2026", text: "Adorable! Slightly tight for me — order one size up if your wrist is wide." },
    ],
  },

  // ——— Leather line (Bags → Leather Bags). Photos live in /photos/leather only. ———
  {
    id: "milano-structured-leather-tote",
    title: "Milano Structured Leather Tote",
    tagline: "Holds a laptop, a lunchbox and your composure",
    price: 12500,
    category: "leather",
    material: "leather",
    description: "Full-grain tan leather tote with a firm base and gold feet.",
    longDescription:
      "Cut from full-grain tan leather with a reinforced base so it stands upright on the floor. Zip top, suede-lined interior, one laptop sleeve and two card slots. Ages into a deeper caramel with wear.",
    variants: [
      { name: "Tan", swatch: "#b1743f", image: "/photos/leather/tan-structured-leather-tote.jpg" },
    ],
    badge: "New",
  },
  {
    id: "noir-leather-crossbody",
    title: "Noir Everyday Leather Crossbody",
    tagline: "Phone, keys, lipstick — nothing else fits, and that's the point",
    price: 8900,
    category: "leather",
    material: "leather",
    description: "Pebbled black leather crossbody with an adjustable strap.",
    longDescription:
      "Soft pebbled black leather with a twist-lock flap and a strap that adjusts from hip to shoulder. Light enough to forget you're wearing it, structured enough to keep its shape.",
    variants: [
      { name: "Black", swatch: "#1b1b1b", image: "/photos/leather/black-leather-crossbody.jpg" },
    ],
  },
  {
    id: "cognac-quilted-leather-shoulder",
    title: "Cognac Quilted Shoulder Bag",
    tagline: "The dinner bag",
    price: 15400,
    category: "leather",
    material: "leather",
    description: "Glossy cognac quilted leather with a gold chain strap.",
    longDescription:
      "Diamond-quilted cognac leather with a polished gold chain that tucks inside to convert from shoulder to clutch. Suede lining, magnetic flap, one slip pocket.",
    variants: [
      { name: "Cognac", swatch: "#8a4a24", image: "/photos/leather/cognac-leather-shoulder.jpg" },
    ],
    badge: "Limited",
  },

  // ——— Grocery & everyday essentials. Photos live in /photos/grocery only. ———
  {
    id: "organic-canvas-grocery-tote",
    title: "Organic Canvas Grocery Tote",
    tagline: "Takes 12kg of vegetables without a complaint",
    price: 1450,
    category: "canvas-totes",
    material: "canvas",
    description: "Heavyweight unbleached cotton canvas tote with box corners.",
    longDescription:
      "12oz unbleached organic cotton canvas, double-stitched webbing handles and boxed corners so tins sit flat. Machine washable at 40°C. No dye, no print — just honest canvas.",
    variants: [
      { name: "Natural", swatch: "#e6ddc9", image: "/photos/grocery/organic-canvas-grocery-tote.jpg" },
    ],
    badge: "New",
  },
  {
    id: "canvas-produce-pouch-set",
    title: "Canvas Produce Pouch Set (3)",
    tagline: "For lentils, spices and the loose change of the kitchen",
    price: 1100,
    category: "grocery-pouches",
    material: "canvas",
    description: "Three drawstring cotton pouches in small, medium and large.",
    longDescription:
      "A set of three plain ecru cotton drawstring pouches — small for spices, medium for lentils, large for bread. Breathable weave keeps produce from sweating. Wash and reuse indefinitely.",
    variants: [
      { name: "Ecru", swatch: "#efe7d6", image: "/photos/grocery/canvas-produce-pouch-set.jpg" },
    ],
  },
  {
    id: "reusable-mesh-market-bag",
    title: "Reusable String Market Bag",
    tagline: "Folds into a fist, opens into a week of fruit",
    price: 950,
    category: "market-bags",
    material: "canvas",
    description: "Cotton string net bag that stretches to hold 10kg.",
    longDescription:
      "Knotted cotton string net that packs into a pocket and stretches to swallow a full fruit run. Reinforced handles, no plastic anywhere in it.",
    variants: [
      { name: "Natural", swatch: "#efe9dc", image: "/photos/grocery/reusable-mesh-market-bag.jpg" },
    ],
    badge: "Bestseller",
  },

  // ——— Gold-tone jewellery. Photos live in /photos/jewelry only. ———
  {
    id: "onyx-stone-gold-bangle",
    title: "Onyx Stone Gold Bangle",
    tagline: "One black stone, three lines of light",
    price: 4200,
    category: "jewelry",
    material: "metal",
    description: "Twin-band gold bangle set with a black square stone.",
    longDescription:
      "18k gold-plated stainless steel bangle with two crystal-set rails and a bezel-set black stone at the centre. Hinged clasp, tarnish-resistant, hypoallergenic.",
    variants: [
      { name: "Gold / Onyx", swatch: "#c8a33c", image: "/photos/jewelry/gold-black-stone-bangle.jpeg" },
      { name: "Gold / Pavé", swatch: "#d8bb62", image: "/photos/jewelry/gold-pave-bangle-angle.jpeg" },
    ],
    badge: "New",
  },
  {
    id: "emerald-pave-bangle",
    title: "Emerald Pavé Bangle",
    tagline: "Green enough to notice, small enough to wear daily",
    price: 4600,
    category: "jewelry",
    material: "metal",
    description: "Gold bangle with a pavé rail and emerald-green centre stone.",
    longDescription:
      "Slim open-frame bangle in 18k gold plating with a full pavé crystal rail and a baguette emerald-green stone. Hinged for easy on-off; sits flat against the wrist.",
    variants: [
      { name: "Gold / Emerald", swatch: "#1f7a52", image: "/photos/jewelry/emerald-pave-bangle-worn.jpeg" },
    ],
  },
  {
    id: "clover-chain-bracelet",
    title: "Clover Chain Bracelet",
    tagline: "Mother-of-pearl or onyx — pick your side",
    price: 3200,
    category: "jewelry",
    material: "metal",
    description: "Delicate gold chain with five clover motifs.",
    longDescription:
      "A fine gold-plated chain strung with five clover motifs in mother-of-pearl or black onyx. Lobster clasp with a 2cm extender, layers beautifully with the bangles.",
    variants: [
      { name: "Mother of Pearl", swatch: "#f0ece2", image: "/photos/jewelry/clover-chain-stack.jpeg" },
      { name: "Black Onyx", swatch: "#1b1b1b", image: "/photos/jewelry/clover-chain-stack.jpeg" },
    ],
    badge: "Bestseller",
  },
  {
    id: "gold-stack-trio",
    title: "Classic Gold Stack (3 pieces)",
    tagline: "Cuff, nail bangle and tennis chain, sold together",
    price: 6900,
    category: "jewelry",
    material: "metal",
    description: "Three-piece stack: screw cuff, nail bangle, crystal tennis chain.",
    longDescription:
      "The full stack in one box — a screw-detail cuff, a wrap-around nail bangle and a crystal tennis chain. All 18k gold-plated stainless steel, water-safe and tarnish-resistant.",
    variants: [
      { name: "Gold", swatch: "#cfa93f", image: "/photos/jewelry/love-nail-tennis-stack.jpeg" },
    ],
    badge: "Bestseller",
  },
  {
    id: "herringbone-rope-trio",
    title: "Herringbone & Rope Trio",
    tagline: "Flat, sparkling, twisted — worn all at once",
    price: 5400,
    category: "jewelry",
    material: "metal",
    description: "Herringbone, crystal and rope chain bracelets, sold as a set.",
    longDescription:
      "Three gold-plated bracelets designed to sit together: a flat herringbone, a crystal-set curb and a twisted rope chain. Each has its own clasp so you can also wear them apart.",
    variants: [
      { name: "Gold", swatch: "#d2ad4a", image: "/photos/jewelry/herringbone-rope-trio.jpeg" },
    ],
  },
  {
    id: "filigree-gold-ring-set",
    title: "Filigree Gold Ring Set",
    tagline: "Six cut-out patterns, one hand",
    price: 2800,
    category: "jewelry",
    material: "metal",
    description: "Wide gold-plated band rings with laser-cut filigree patterns.",
    longDescription:
      "Wide-band rings with laser-cut filigree work — lattice, leaf, mosaic and wave patterns. Gold-plated stainless steel, adjustable sizing on request.",
    variants: [
      { name: "Gold", swatch: "#caa53d", image: "/photos/jewelry/filigree-gold-rings.jpeg" },
    ],
    badge: "New",
  },
];


export const getProduct = (id: string) => products.find((p) => p.id === id);

// ——— Gender targeting (used by the shop sidebar filter) ———
export type Gender = "women" | "men" | "unisex";

const MEN_IDS = new Set<string>([
  "nato-stripe-watch-strap",
  "teal-diamond-apple-strap",
  "sage-granny-cover",
  "bear-glasses-pouch",
  "avocado-crossbody-pouch",
  "avocado-buddy-pouch",
  "sleepy-avocado-keychains",
  "sun-moon-keychain-pair",
]);

const WOMEN_CATEGORIES = new Set<Category>(["hair", "bags", "bouquets", "diaries"]);

export const genderOf = (p: Product): Gender => {
  if (MEN_IDS.has(p.id)) return "unisex";
  if (WOMEN_CATEGORIES.has(p.category)) return "women";
  return "unisex";
};

export const matchesGender = (p: Product, g: Gender | undefined) => {
  if (!g) return true;
  const target = genderOf(p);
  if (target === "unisex") return true;
  return target === g;
};

// ——— Reviews ———
// Every product shows social proof: authored reviews when present,
// otherwise a deterministic set generated from the product id.
const FALLBACK_NAMES = [
  ["Ayesha", "Lahore"],
  ["Zainab", "Karachi"],
  ["Mahnoor", "Islamabad"],
  ["Iqra", "Multan"],
  ["Hafsa", "Peshawar"],
  ["Noor", "Faisalabad"],
];
const FALLBACK_TEXT = [
  "Stitching is so neat and tight — it looks even better in person.",
  "Packed beautifully and delivered quickly. Everyone asks where I got it.",
  "Colours are exactly like the photos. Worth every rupee.",
  "Bought it as a gift and she hasn't put it down since 💕",
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

export const getReviews = (p: Product): ProductReview[] => {
  if (p.reviews && p.reviews.length > 0) return p.reviews;
  const h = hash(p.id);
  return [0, 1, 2].map((i) => {
    const [name, city] = FALLBACK_NAMES[(h + i * 2) % FALLBACK_NAMES.length];
    return {
      name,
      city,
      rating: (h + i) % 5 === 0 ? 4 : 5,
      text: FALLBACK_TEXT[(h + i) % FALLBACK_TEXT.length],
    };
  });
};

export const ratingOf = (p: Product) => {
  const rs = getReviews(p);
  return rs.reduce((s, r) => s + r.rating, 0) / rs.length;
};

export const categoryLabel: Record<Category, string> = {
  phone: "Phone Covers",
  pouches: "Pouches",
  keychains: "Keychains",
  hair: "Hair Accessories",
  bags: "Crochet Bags",
  home: "Home Accessories",
  bouquets: "Flower Bouquets",
  watches: "Bracelets & Watch Straps",
  diaries: "Diaries & Book Covers",
  leather: "Leather Bags",
  "canvas-totes": "Canvas Tote Bags",
  "grocery-pouches": "Grocery Pouches",
  "market-bags": "Reusable Market Bags",
  jewelry: "Gold Jewellery",
  clothing: "Clothing",
  makeup: "Makeup",
};

// ——— Material safety net ———
// Every category belongs to exactly one material, and every material may only
// use photos from its own folders. This is what stops a crochet texture from
// ever showing up under Leather Bags (or the reverse).
export const categoryMaterial: Record<Category, Material> = {
  phone: "crochet",
  pouches: "crochet",
  keychains: "crochet",
  hair: "crochet",
  bags: "crochet",
  home: "crochet",
  bouquets: "crochet",
  watches: "crochet",
  diaries: "crochet",
  leather: "leather",
  "canvas-totes": "canvas",
  "grocery-pouches": "canvas",
  "market-bags": "canvas",
  jewelry: "metal",
  clothing: "fabric",
  makeup: "cosmetic",
};

const MATERIAL_IMAGE_ROOTS: Record<Material, string[]> = {
  leather: ["/photos/leather/"],
  canvas: ["/photos/grocery/"],
  metal: ["/photos/jewelry/"],
  fabric: ["/photos/clothing/"],
  cosmetic: ["/photos/makeup/"],
  // Crochet keeps its historic per-category folders.
  crochet: [
    "/photos/bags/",
    "/photos/pouches/",
    "/photos/phone/",
    "/photos/keychains/",
    "/photos/hair/",
    "/photos/home/",
    "/photos/bouquets/",
    "/photos/wrist/",
    "/photos/diaries/",
    "/photos/studio/",
    "/photos/clothing/",
  ],
};

export const materialOf = (p: Product): Material => p.material ?? categoryMaterial[p.category];

/** True when this image is allowed to represent this product's material. */
export function imageMatchesMaterial(product: Product, src: string): boolean {
  if (!src.startsWith("/photos/")) return true; // remote/CDN images are not folder-scoped
  return MATERIAL_IMAGE_ROOTS[materialOf(product)].some((root) => src.startsWith(root));
}

/**
 * Returns a variant image only when it matches the product's material,
 * otherwise falls back to the first safe image on the product.
 * Components should render through this instead of touching `variant.image`.
 */
export function safeImage(product: Product, src?: string): string {
  if (src && imageMatchesMaterial(product, src)) return src;
  const safe = product.variants.find((v) => imageMatchesMaterial(product, v.image));
  return safe?.image ?? src ?? "";
}

/** Dev-only catalog audit — logs any mismatched image instead of shipping it silently. */
export function auditCatalogImages(): string[] {
  const problems: string[] = [];
  for (const p of products) {
    for (const v of p.variants) {
      if (!imageMatchesMaterial(p, v.image)) {
        problems.push(`${p.id} (${materialOf(p)}) uses off-material image ${v.image}`);
      }
    }
  }
  return problems;
}

// ——— Taxonomy placement ———
// Legacy catalog products carry an old `category`; this map remaps every one of
// them onto the hardcoded taxonomy in data/taxonomy.ts. Newer products set
// `taxon` explicitly and win over this default.
export const DEFAULT_TAXON: Record<Category, SubcategoryId> = {
  phone: "crochet-mini-bags",
  pouches: "crochet-mini-bags",
  keychains: "crochet-keychains",
  hair: "crochet-hair-accessories",
  bags: "crochet-tote-bags",
  home: "crochet-keychains",
  bouquets: "crochet-keychains",
  watches: "crochet-jewelry",
  diaries: "crochet-keychains",
  leather: "bags-shoulder-bags",
  "canvas-totes": "bags-tote-bags",
  "grocery-pouches": "bags-mini-bags",
  "market-bags": "bags-woven-bags",
  jewelry: "jewelry-bracelets",
  clothing: "clothing-dresses",
  makeup: "makeup-lipstick",
};

/** The single subcategory a product belongs to. Never guessed at render time. */
export const taxonOf = (p: Product): SubcategoryId => p.taxon ?? DEFAULT_TAXON[p.category];

/** Products discounted right now. */
export const isOnSale = (p: Product) => typeof p.salePrice === "number" && p.salePrice < p.price;

/** Full catalog: legacy pieces plus the new Bags / Jewelry / Clothing / Makeup lines. */
export const products: Product[] = [...baseProducts, ...extraProducts];
