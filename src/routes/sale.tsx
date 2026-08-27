import { createFileRoute, Link } from "@tanstack/react-router";
import { products, isOnSale } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/sale")({
  head: () => ({
    meta: [
      { title: "Sale — Discounted Bags, Jewelry & Clothing | Zizaib" },
      {
        name: "description",
        content:
          "Zizaib pieces at reduced prices — handbags, gold-tone jewelry, clothing and makeup marked down while stock lasts.",
      },
      { property: "og:title", content: "Zizaib Sale" },
      { property: "og:description", content: "Marked-down bags, jewelry, clothing and makeup while stock lasts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sale" }],
  }),
  component: SalePage,
});

function SalePage() {
  const onSale = products.filter(isOnSale);

  return (
    <div className="container-page py-12">
      <header className="text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Limited time</p>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold tracking-tight">Sale</h1>
        <p className="mt-3 text-muted-foreground">
          Reduced prices across bags, jewelry, clothing and makeup — while stock lasts.
        </p>
      </header>

      {onSale.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          <p>Nothing is discounted right now — check back soon.</p>
          <Link to="/shop" search={{}} className="btn-ghost mt-4">Shop the full edit</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {onSale.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
