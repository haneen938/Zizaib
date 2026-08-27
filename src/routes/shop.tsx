import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Smartphone, Wallet, KeyRound, Flower2, ShoppingBag, Home, Sparkles, Watch, BookOpen, Glasses, Gem, Briefcase, ShoppingBasket, Apple, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { products, categoryLabel, matchesGender, type Category, type Gender, type PouchSub } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { categoryGroups, categoryGroupIds, childrenOf, groupOf, categoryLookbook } from "@/data/categories";

const categories: Category[] = ["phone", "pouches", "keychains", "hair", "bags", "home", "bouquets", "watches", "diaries"];
const pouchSubs: PouchSub[] = ["phone", "glasses"];
const pouchSubLabel: Record<PouchSub, string> = {
  phone: "Phone Pouches",
  glasses: "Glasses Pouches",
};
const pouchSubIcon: Record<PouchSub, LucideIcon> = {
  phone: Smartphone,
  glasses: Glasses,
};

const categoryIcon: Record<Category, LucideIcon> = {
  phone: Smartphone,
  pouches: Wallet,
  keychains: KeyRound,
  hair: Sparkles,
  bags: ShoppingBag,
  home: Home,
  bouquets: Flower2,
  watches: Watch,
  diaries: BookOpen,
};

const search = z.object({
  q: z.string().optional().catch(undefined),
  c: z.enum(categories as [Category, ...Category[]]).optional().catch(undefined),
  sub: z.enum(pouchSubs as [PouchSub, ...PouchSub[]]).optional().catch(undefined),
  g: z.enum(["women", "men"]).optional().catch(undefined),
  group: z.enum(categoryGroupIds).optional().catch(undefined),
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop All Crochet Pieces — Zizaib" },
      { name: "description", content: "Browse the full Zizaib edit: crochet phone covers, pouches, bags, keychains, hair accessories and bouquets. Filter by category and gender." },
      { property: "og:title", content: "Shop All Crochet Pieces — Zizaib" },
      { property: "og:description", content: "Crochet phone covers, pouches, bags, keychains and more — filter the full Zizaib edit." },
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
            ["Are the pieces really handmade?", "Yes. Each item is crocheted by hand, so small variations in stitch and shade are part of the charm."],
            ["Can I see reviews before buying?", "Every product page carries verified customer reviews with photos."],
          ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }),
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q, c, sub, g, group } = Route.useSearch() as z.infer<typeof search>;
  const query = (q ?? "").toLowerCase().trim();
  const activeSub = c === "pouches" ? sub : undefined;

  const groupChildren = group ? childrenOf(group) : null;
  const activeGroup = group ?? (c ? groupOf(c) : undefined);
  const visibleCategories = groupChildren ?? categories;
  const lookbook = c ? categoryLookbook[c] : undefined;

  const filtered = products.filter((p) => {
    if (groupChildren && !groupChildren.includes(p.category)) return false;
    if (c && p.category !== c) return false;
    if (activeSub && p.sub !== activeSub) return false;
    if (!matchesGender(p, g as Gender | undefined)) return false;
    if (query) {
      const hay = `${p.title} ${p.description} ${p.tagline ?? ""} ${categoryLabel[p.category]}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  return (
    <div className="container-page py-12">
      <header className="text-center max-w-2xl mx-auto">
        
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold tracking-tight">Your Next Obsession</h1>
        <p className="mt-3 text-muted-foreground">
          {query ? <>Results for <span className="font-semibold text-foreground">"{q}"</span></> : "Premium pieces · Trend looks · All-in-one."}
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 h-fit card-soft p-5">
          <h2 className="font-display text-lg font-bold">Collections</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <Link to="/shop" search={{ q, g }} className={pillClass(!activeGroup && !c)}>
              Everything
            </Link>
            {categoryGroups.map((grp) => (
              <Link
                key={grp.id}
                to="/shop"
                search={{ group: grp.id, q, g }}
                className={pillClass(activeGroup === grp.id)}
              >
                {grp.label}
              </Link>
            ))}
          </div>

          <h2 className="mt-7 font-display text-lg font-bold">Categories</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <Link to="/shop" search={{ group, q, g }} className={pillClass(!c)}>
              All
            </Link>
            {visibleCategories.map((cat) => {
              const Icon = categoryIcon[cat];
              return (
                <Link
                  key={cat}
                  to="/shop"
                  search={{ c: cat, group, q, g }}
                  className={pillClass(c === cat)}
                >
                  <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  {categoryLabel[cat]}
                </Link>
              );
            })}
          </div>

          <h2 className="mt-7 font-display text-lg font-bold">Shop for</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {([
              { label: "All", value: undefined },
              { label: "Women", value: "women" as const },
              { label: "Men", value: "men" as const },
            ]).map((opt) => (
              <Link
                key={opt.label}
                to="/shop"
                search={{ c, sub, group, q, g: opt.value }}
                className={pillClass(g === opt.value)}
              >
                {opt.label}
              </Link>
            ))}
          </div>

      {c === "pouches" && (
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link to="/shop" search={{ c: "pouches", q, g }} className={subPillClass(!activeSub)}>
            <Sparkles className="size-3.5" strokeWidth={2} />
            All Pouches
          </Link>
          {pouchSubs.map((s) => {
            const Icon = pouchSubIcon[s];
            return (
              <Link
                key={s}
                to="/shop"
                search={{ c: "pouches", sub: s, q, g }}
                className={subPillClass(activeSub === s)}
              >
                <Icon className="size-3.5" strokeWidth={2} />
                {pouchSubLabel[s]}
              </Link>
            );
          })}
        </div>
      )}
        </aside>

        <div>
      {lookbook && (
        <section className="mb-8">
          <h2 className="font-display text-xl font-bold">The bag lookbook</h2>
          <p className="mt-1 text-sm text-muted-foreground">Real Zizaib bags, straight from the studio camera roll.</p>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {lookbook.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Handmade Zizaib crochet bag ${i + 1}`}
                loading="lazy"
                className="h-48 w-auto shrink-0 rounded-2xl border border-border object-cover"
              />
            ))}
          </div>
        </section>
      )}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          <p>No pieces match that search.</p>
          <Link to="/shop" search={{}} className="btn-ghost mt-4">Clear filters</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
        </div>
      </div>

      <section aria-labelledby="shop-guide" className="mt-16 max-w-3xl">
        <h2 id="shop-guide" className="font-display text-2xl md:text-3xl font-bold">
          How to shop the Zizaib edit
        </h2>
        <p className="mt-3 text-muted-foreground">
          Every piece here is <strong className="text-foreground">hand-crocheted in Pakistan</strong> in small
          batches, then shipped worldwide. Use the filters to narrow the edit down in seconds:
        </p>
        <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
          <li><strong className="text-foreground">Category</strong> — jump straight to phone covers, pouches, bags, keychains, hair accessories, home accents, bouquets, bracelets or diaries.</li>
          <li><strong className="text-foreground">Shop for</strong> — switch between Women and Men to see gender-suited colourways only.</li>
          <li><strong className="text-foreground">Pouch type</strong> — inside Pouches, choose phone pouches or glasses pouches.</li>
          <li><strong className="text-foreground">Search</strong> — type a colour, motif or product name in the header search bar.</li>
        </ul>

        <h3 className="mt-10 font-display text-xl font-bold">Frequently asked questions</h3>
        <dl className="mt-4 space-y-5">
          <div>
            <dt className="font-semibold">How long does an order take to arrive?</dt>
            <dd className="mt-1 text-muted-foreground">Pieces are made to order in 2–4 days, then shipped. Local delivery lands in 3–5 days and international orders in 7–14 days. You can follow every step on the <Link to="/track">order tracking page</Link>.</dd>
          </div>
          <div>
            <dt className="font-semibold">Which payment methods do you accept?</dt>
            <dd className="mt-1 text-muted-foreground">Cards at checkout, plus <strong className="text-foreground">bank and cash transfer</strong> — just add the sender name, reference ID and an optional receipt photo when you place the order.</dd>
          </div>
          <div>
            <dt className="font-semibold">Are the pieces really handmade?</dt>
            <dd className="mt-1 text-muted-foreground">Yes. Each item is crocheted by hand, so tiny variations in stitch and shade are part of the charm. Read more about the studio on the <Link to="/about">Zizaib story page</Link>.</dd>
          </div>
          <div>
            <dt className="font-semibold">Can I see reviews before buying?</dt>
            <dd className="mt-1 text-muted-foreground">Every product page carries verified customer reviews with photos, so you can see the piece in real hands before you order.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function pillClass(active: boolean) {
  return `inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:scale-105 ${
    active
      ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-soft)]"
      : "border-border/70 bg-card/80 backdrop-blur hover:bg-primary/10 hover:text-primary hover:border-primary/40 text-muted-foreground"
  }`;
}

function subPillClass(active: boolean) {
  return `inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
    active
      ? "bg-gradient-to-r from-primary to-primary/70 text-primary-foreground border-transparent shadow-[var(--shadow-soft)]"
      : "border-dashed border-primary/50 bg-background/70 backdrop-blur text-primary hover:bg-primary/10 hover:border-primary"
  }`;
}
