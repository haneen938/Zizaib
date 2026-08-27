import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/best-sellers")({
  head: () => ({
    meta: [
      { title: "Best Sellers — Zizaib" },
      { name: "description", content: "The most-loved pieces in the Zizaib edit — premium crochet and trend-led accessories flying out the door." },
      { property: "og:title", content: "Best Sellers — Zizaib" },
      { property: "og:description", content: "The most-loved pieces in the Zizaib edit — premium crochet and trend-led accessories." },
    ],
  }),
  component: BestSellers,
});

function BestSellers() {
  const items = products.filter((p) => p.badge === "Bestseller");
  return (
    <div className="container-page py-12">
      <header className="text-center max-w-2xl mx-auto">
        <p className="text-sm uppercase tracking-wider text-primary">Customer favorites</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl font-bold">Best Sellers</h1>
        <p className="mt-3 text-muted-foreground">The pieces our community is buying again and again.</p>
      </header>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  );
}
