import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ShoppingBag, Zap } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { safeImage, type Product } from "@/data/products";
import { useMoney } from "@/lib/format";
import { useCart } from "@/store/cartStore";
import { flyToCart } from "@/lib/flyToCart";

// Product card with hover lift + scroll-fade-in. Shows the first variant.
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cover = product.variants[0];
  // Material-checked: never renders an image from another material's folder.
  const coverImage = safeImage(product, cover.image);
  const addItem = useCart((s) => s.addItem);
  const money = useMoney();
  const imgRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imgRef.current) flyToCart(imgRef.current, coverImage, product.title);
    // slight delay so the badge bumps as the image lands
    setTimeout(() => {
      addItem(product, { color: cover.name, image: coverImage });
    }, 750);
    toast.success(`${product.title} added to your basket 🧶`, {
      description: `Color: ${cover.name} · ${money(product.price)}`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, { color: cover.name, image: coverImage });
    navigate({ to: "/checkout" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="group block card-soft overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            ref={imgRef}
            src={coverImage}
            alt={`${product.title} — ${product.description}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-primary">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold leading-tight">{product.title}</h3>
          {product.tagline ? (
            <p className="mt-0.5 text-xs italic text-primary">{product.tagline}</p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{product.description}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <p className="font-semibold">{money(product.price)}</p>
            <div className="flex -space-x-1">
              {product.variants.map((v) => (
                <span
                  key={v.name}
                  className="size-4 rounded-full border-2 border-card"
                  style={{ background: v.swatch }}
                  title={v.name}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Add ${product.title} to cart`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-foreground/70 bg-card px-3 py-2 min-h-11 text-xs sm:text-sm font-bold text-foreground transition hover:bg-secondary active:scale-95"
            >
              <ShoppingBag className="size-4" /> Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              aria-label={`Buy ${product.title} now`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 min-h-11 text-xs sm:text-sm font-bold text-primary-foreground transition hover:shadow-[var(--shadow-lift)] active:scale-95"
            >
              <Zap className="size-4" /> Buy Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
