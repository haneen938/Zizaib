import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Zizaib" },
      { name: "description", content: "Fresh arrivals at Zizaib — the latest drops from our trend-led boutique in Pakistan." },
      { property: "og:title", content: "New Arrivals — Zizaib" },
      { property: "og:description", content: "Fresh arrivals at Zizaib — the latest drops from our trend-led boutique." },
    ],
  }),
  component: NewArrivals,
});

function NewArrivals() {
  const items = products.filter((p) => p.badge === "New" || p.badge === "Limited");
  return (
    <div className="container-page py-12">
      <header className="text-center max-w-2xl mx-auto">
        <p className="text-sm uppercase tracking-wider text-primary">Just dropped</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl font-bold">New Arrivals</h1>
        <p className="mt-3 text-muted-foreground">The newest pieces to land in our edit — limited drops, made for your wardrobe.</p>
      </header>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  );
}
