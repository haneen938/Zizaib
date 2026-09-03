import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ShoppingBag, Gem, Shirt, Sparkles, Brush, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { products, matchesGender, taxonOf, type Gender } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import {
  collections,
  collectionById,
  collectionIds,
  subcategoryIds,
  groupIds,
  subsOfCollection,
  subsOfGroup,
  subLabel,
  type CollectionId,
  type SubcategoryId,
} from "@/data/taxonomy";

const collectionIcon: Record<CollectionId, LucideIcon> = {
  bags: ShoppingBag,
  jewelry: Gem,
  clothing: Shirt,
  crochet: Sparkles,
  makeup: Brush,
  grocery: ShoppingCart,
};

const search = z.object({
  q: z.string().optional().catch(undefined),
  col: z.enum(collectionIds).optional().catch(undefined),
  grp: z.enum(groupIds).optional().catch(undefined),
  sub: z.enum(subcategoryIds).optional().catch(undefined),
  g: z.enum(["women", "men"]).optional().catch(undefined),
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop Bags, Jewelry, Clothing, Crochet & Makeup — Zizaib" },
      {
        name: "description",
        content:
          "Browse the full Zizaib edit — handbags, gold-tone jewelry, clothing, hand-crocheted pieces and makeup. Filter by collection and subcategory in one tap.",
      },
      { property: "og:title", content: "Shop the Zizaib Edit" },
      {
        property: "og:description",
        content: "Bags, Jewelry, Clothing, Crochet and Makeup — filter the full Zizaib catalog by collection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            ["How long does an order take to arrive?", "Pieces are made to order in 2-4 days, then shipped. Local delivery lands in 3-5 days and international orders in 7-14 days."],
            ["Which payment methods do you accept?", "Cards at checkout, plus bank and cash transfer with sender name, reference ID and an optional receipt photo."],
            ["Are the handmade pieces really handmade?", "Yes. Every crochet piece is hooked by hand, so small variations in stitch and shade are part of the charm."],
            ["Can I see reviews before buying?", "Every product page carries verified customer reviews with ratings."],
          ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }),
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q, col, grp, sub, g } = Route.useSearch();
  const query = (q ?? "").toLowerCase().trim();

  const activeCollection = col ? collectionById(col) : undefined;

  // Exactly one set of subcategory ids is allowed through to the grid, so a
  // product can never leak into a folder it does not belong to.
  const allowed: Set<SubcategoryId> | null = sub
    ? new Set([sub])
    : grp
      ? new Set(subsOfGroup(grp))
      : col
        ? new Set(subsOfCollection(col))
        : null;

  const filtered = products.filter((p) => {
    if (allowed && !allowed.has(taxonOf(p))) return false;
    if (!matchesGender(p, g as Gender | undefined)) return false;
    if (query) {
      const hay = `${p.title} ${p.description} ${p.tagline ?? ""} ${subLabel(taxonOf(p))}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  return (
    <div className="container-page py-12">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold tracking-tight">
          {activeCollection ? activeCollection.label : "Your Next Obsession"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {query ? (
            <>Results for <span className="font-semibold text-foreground">"{q}"</span></>
          ) : (
            activeCollection?.blurb ?? "Bags · Jewelry · Clothing · Crochet · Makeup"
          )}
        </p>
      </header>

      {/* ─── Tier 1: main collections ─── */}
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        <Link to="/shop" search={{ q, g }} className={pillClass(!col)}>
          Home
        </Link>
        {collections.map((c) => {
          const Icon = collectionIcon[c.id];
          return (
            <Link key={c.id} to="/shop" search={{ col: c.id, q, g }} className={pillClass(col === c.id)}>
              <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* ─── Tier 2: sub-headings + subcategories of the active collection ─── */}
      {activeCollection && (
        <div className="mt-5 rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/shop" search={{ col: activeCollection.id, q, g }} className={subPillClass(!grp && !sub)}>
              All {activeCollection.label}
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {activeCollection.groups.map((group) => (
              <div key={group.id}>
                <Link
                  to="/shop"
                  search={{ col: activeCollection.id, grp: group.id, q, g }}
                  className={`block text-sm font-bold tracking-wide transition ${
                    grp === group.id && !sub ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {group.label}
                </Link>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.subs.map((s) => (
                    <Link
                      key={s.id}
                      to="/shop"
                      search={{ col: activeCollection.id, grp: group.id, sub: s.id, q, g }}
                      className={subPillClass(sub === s.id)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        {([
          { label: "Everyone", value: undefined },
          { label: "Women", value: "women" as const },
          { label: "Men", value: "men" as const },
        ]).map((opt) => (
          <Link key={opt.label} to="/shop" search={{ col, grp, sub, q, g: opt.value }} className={pillClass(g === opt.value)}>
            {opt.label}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          <p>No pieces match that filter yet.</p>
          <Link to="/shop" search={{}} className="btn-ghost mt-4">Clear filters</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <section aria-labelledby="shop-guide" className="mt-16 max-w-3xl">
        <h2 id="shop-guide" className="font-display text-2xl md:text-3xl font-bold">
          How to shop the Zizaib edit
        </h2>
        <p className="mt-3 text-muted-foreground">
          Pick a collection in the top row, then narrow it down with the sub-headings underneath.
          The grid updates instantly and only ever shows pieces from the folder you selected.
        </p>
        <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
          <li><strong className="text-foreground">Bags</strong> — handbags, clutches &amp; mini bags, backpacks &amp; handmade bags.</li>
          <li><strong className="text-foreground">Jewelry</strong> — earrings, necklaces &amp; bracelets, rings &amp; jewelry sets.</li>
          <li><strong className="text-foreground">Clothing</strong> — dresses &amp; tops, traditional wear, bottoms &amp; co-ords.</li>
          <li><strong className="text-foreground">Crochet</strong> — crochet bags, crochet clothing, crochet accessories &amp; gifts.</li>
          <li><strong className="text-foreground">Makeup</strong> — face, eye and lip makeup.</li>
        </ul>

        <h3 className="mt-10 font-display text-xl font-bold">Frequently asked questions</h3>
        <dl className="mt-4 space-y-5">
          <div>
            <dt className="font-semibold">How long does an order take to arrive?</dt>
            <dd className="mt-1 text-muted-foreground">Made-to-order pieces take 2–4 days, then ship. Local delivery lands in 3–5 days and international orders in 7–14 days. Follow every step on the <Link to="/track">order tracking page</Link>.</dd>
          </div>
          <div>
            <dt className="font-semibold">Which payment methods do you accept?</dt>
            <dd className="mt-1 text-muted-foreground">Cards at checkout, plus <strong className="text-foreground">bank and cash transfer</strong> — add the sender name, reference ID and an optional receipt photo when you place the order.</dd>
          </div>
          <div>
            <dt className="font-semibold">Are the crochet pieces really handmade?</dt>
            <dd className="mt-1 text-muted-foreground">Yes. Each one is hooked by hand, so tiny variations in stitch and shade are part of the charm. Read more on the <Link to="/about">Zizaib story page</Link>.</dd>
          </div>
          <div>
            <dt className="font-semibold">Can I see reviews before buying?</dt>
            <dd className="mt-1 text-muted-foreground">Every product page carries verified customer reviews and ratings.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function pillClass(active: boolean) {
  return `inline-flex min-h-11 items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 ease-out hover:scale-105 ${
    active
      ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-soft)]"
      : "border-border/70 bg-card/80 backdrop-blur hover:bg-primary/10 hover:text-primary hover:border-primary/40 text-muted-foreground"
  }`;
}

function subPillClass(active: boolean) {
  return `inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
    active
      ? "bg-gradient-to-r from-primary to-primary/70 text-primary-foreground border-transparent shadow-[var(--shadow-soft)]"
      : "border-dashed border-primary/50 bg-background/70 backdrop-blur text-primary hover:bg-primary/10 hover:border-primary"
  }`;
}
