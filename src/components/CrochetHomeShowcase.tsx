import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type ShopCategory = "phone" | "pouches" | "keychains" | "hair" | "bags" | "home" | "bouquets" | "watches" | "diaries";

type Slide = {
  category: string;
  c?: ShopCategory;
  name: string;
  price: string;
  img: string;
};

const products: Slide[] = [
  { category: "All", name: "Signature Crochet Collection", price: "$24.99", img: "/photos/bouquets/daisy-kraft-bouquet.jpeg" },
  { category: "Phone Covers", c: "phone", name: "Pastel Crochet Phone Sleeve", price: "$14.99", img: "/photos/phone/butter-tulip.jpeg" },
  { category: "Pouches", c: "pouches", name: "Handmade Cosmetic Pouch", price: "$19.99", img: "/photos/pouches/blush-stripe-drawstring.jpeg" },
  { category: "Keychains", c: "keychains", name: "Amigurumi Mini Keychain", price: "$7.99", img: "/photos/keychains/avocado-pair.jpeg" },
  { category: "Hair Accessories", c: "hair", name: "Crochet Floral Hair Band", price: "$11.49", img: "/photos/hair/daisy-headband-set.jpeg" },
  { category: "Bags", c: "bags", name: "Boho Crochet Tote Bag", price: "$34.99", img: "/photos/bags/daisy-sage-tote.jpeg" },
  { category: "Home Accessories", c: "home", name: "Cozy Knit Coaster Set", price: "$12.99", img: "/photos/home/daisy-tieback.jpeg" },
  { category: "Flower Bouquets", c: "bouquets", name: "Forever Tulip Crochet Bouquet", price: "$29.99", img: "/photos/bouquets/lavender-lily-bouquet.jpeg" },
  { category: "Bracelets & Watch Straps", c: "watches", name: "Woven Watch Band & Strap", price: "$16.99", img: "/photos/wrist/nato-stripe-watch-strap.jpeg" },
  { category: "Diaries & Book Covers", c: "diaries", name: "Vintage Premium Book Sleeve", price: "$21.99", img: "/photos/diaries/pink-daisy-diary.jpeg" },
];

export default function CrochetHomeShowcase() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<"before" | "after">("before");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStage("after"), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const iv = setInterval(() => setIndex((p) => (p + 1) % products.length), 3000);
    return () => clearInterval(iv);
  }, [isHovered]);

  const current = products[index];

  const goToCategory = (c?: ShopCategory) => {
    navigate({ to: "/shop", search: c ? { c } : {} });
  };

  return (
    <div className="w-full min-h-[750px] bg-[#F8F8F8] flex flex-col items-center justify-center py-16 px-4 select-none">
      <div className="h-12 mb-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <span className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-md">
              {stage === "before" ? "Before 😮" : "After 🔥"}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute -top-3 left-8 w-12 h-5 bg-cyan-400 rounded-full rotate-12 shadow-md border-b-2 border-cyan-500 z-10" />
        <div className="absolute -top-3 right-8 w-12 h-5 bg-orange-400 rounded-full -rotate-12 shadow-md border-b-2 border-orange-500 z-10" />

        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8">
          <p className="font-extrabold text-gray-800 tracking-tight text-lg">Crochet Turning Fashion</p>
          <div className="hidden md:flex gap-6 text-xs uppercase font-bold tracking-wider text-gray-400">
            <span className="text-black border-b-2 border-black pb-4 -mb-4">Home</span>
            <span className="hover:text-black transition cursor-pointer">Shop</span>
            <span className="hover:text-black transition cursor-pointer">Categories</span>
          </div>
        </div>

        <div className="min-h-[380px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.category}
              initial={{ opacity: 0, x: 60, rotate: 3, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, rotate: -3, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="flex-1 w-full flex justify-center">
                <div
                  className="relative group p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner cursor-pointer"
                  onClick={() => goToCategory(current.c)}
                >
                  <img
                    src={current.img}
                    alt={current.name}
                    className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-xl shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex-1 w-full text-center md:text-left flex flex-col justify-center space-y-4">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                    {current.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 tracking-tight leading-tight">
                    {current.name}
                  </h3>
                  <p className="text-xl font-mono font-bold text-gray-600 mt-1">{current.price}</p>
                </div>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed mx-auto md:mx-0">
                  Beautifully handcrafted stitch-by-stitch to bring cozy textures and vibrant style straight into your lifestyle.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => goToCategory(current.c)}
                    className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-[var(--shadow-soft)] hover:opacity-90 transition-all transform hover:-translate-y-0.5 mx-auto md:mx-0"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8 border-t border-gray-50 pt-6">
          {products.map((p, i) => (
            <div key={p.category} className="relative group/dot flex flex-col items-center">
              <div className="absolute bottom-full mb-2 hidden group-hover/dot:flex flex-col items-center z-20 pointer-events-none">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wide px-2.5 py-1 rounded shadow-md whitespace-nowrap">
                  {p.category}
                </span>
                <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 -mt-1" />
              </div>
              <button
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "bg-primary w-6 shadow-sm" : "bg-muted w-2 hover:bg-secondary"
                }`}
                aria-label={`Go to ${p.category}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
