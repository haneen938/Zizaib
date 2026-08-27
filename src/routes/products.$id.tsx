import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Check, ChevronLeft, ShoppingBag, Star, Zap } from "lucide-react";
import { getProduct, getReviews, products, safeImage } from "@/data/products";
import { useCart } from "@/store/cartStore";
import { ProductCard } from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";
import { useMoney } from "@/lib/format";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — Zizaib` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.title },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.variants[0].image },
          { name: "twitter:image", content: loaderData.product.variants[0].image },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/" className="btn-primary mt-6">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: import("@/data/products").Product };
  const addItem = useCart((s) => s.addItem);
  const money = useMoney();
  const navigate = useNavigate();
  const [colorIdx, setColorIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const activeColor = product.variants[colorIdx];

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    addItem(product, { color: activeColor.name, image: safeImage(product, activeColor.image) });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addItem(product, { color: activeColor.name, image: safeImage(product, activeColor.image) });
    navigate({ to: "/checkout" });
  };

  return (
    <>
      <div className="container-page py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Back to shop
        </Link>
      </div>
      <article className="container-page grid lg:grid-cols-2 gap-12 pb-16">
        {/* Gallery — image swaps when a color is selected */}
        <div>
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-muted shadow-[var(--shadow-soft)] relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={safeImage(product, activeColor.image)}
                src={safeImage(product, activeColor.image)}
                alt={`${product.title} in ${activeColor.name}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="mt-4 flex gap-3">
            {product.variants.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setColorIdx(i)}
                aria-label={`Show in ${v.name}`}
                className={`size-20 rounded-2xl overflow-hidden border-2 transition ${
                  colorIdx === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img src={safeImage(product, v.image)} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-wider text-primary">Handmade with love</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">{product.title}</h1>
          {product.tagline && <p className="mt-2 italic text-primary">{product.tagline}</p>}
          <p className="mt-4 text-2xl font-bold">{money(product.price)}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.longDescription}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold mb-2">
              Color: <span className="text-muted-foreground font-normal">{activeColor.name}</span>
            </p>
            <div className="flex gap-3 flex-wrap">
              {product.variants.map((v, i) => (
                <button
                  key={v.name}
                  onClick={() => setColorIdx(i)}
                  aria-label={v.name}
                  className={`size-10 rounded-full border-2 transition active:scale-95 ring-offset-2 ring-offset-background ${
                    colorIdx === i ? "border-primary ring-2 ring-primary" : "border-border hover:border-foreground/40"
                  }`}
                  style={{ background: v.swatch }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className="btn-ghost relative overflow-hidden min-w-44"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span key="added" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="inline-flex items-center gap-2">
                    <Check className="size-4" /> Added to basket
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="inline-flex items-center gap-2">
                    <ShoppingBag className="size-4" /> Add to basket
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleBuyNow}
              className="btn-primary"
            >
              <Zap className="size-4" /> Buy now
            </motion.button>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <li className="card-soft p-3">Ships across Pakistan</li>
            <li className="card-soft p-3">Pre-payment only · No COD</li>
            <li className="card-soft p-3">Hand wash, lay flat</li>
            <li className="card-soft p-3">Made to order — 5–7 days</li>
          </ul>
        </div>
      </article>

      <ProductReviews productId={product.id} seedReviews={getReviews(product)} />

      {related.length > 0 && (
        <section className="container-page pb-20">
          <h2 className="font-display text-3xl font-bold mb-6">You may also love</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
