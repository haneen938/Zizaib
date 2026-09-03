import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { collectionById } from "@/data/taxonomy";
import { listCategoryImages } from "@/lib/category-images.functions";
import { defaultCategoryImages, groceryGallery, imageKey } from "@/data/category-images";

export const Route = createFileRoute("/grocery")({
  head: () => ({
    meta: [
      { title: "Grocery — Keychains, Hair Pieces & Hand Warmers | Zizaib" },
      {
        name: "description",
        content:
          "Zizaib Grocery: hand-crocheted keychains, headbands, hair clips, hand warmers, wrist corsages and the little extras — browse every subcategory.",
      },
      { property: "og:title", content: "Zizaib Grocery — everyday handmade little things" },
      {
        property: "og:description",
        content: "Keychains, hair accessories, hand warmers and bracelets, all crocheted in small batches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="container-page py-20 text-center">
      <p className="font-semibold">The Grocery page could not load.</p>
      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <div className="container-page py-20 text-center">Nothing here yet.</div>,
  component: GroceryPage,
});

function GroceryPage() {
  const fetchImages = useServerFn(listCategoryImages);
  const { data: rows, isPending, isError } = useQuery({
    queryKey: ["category-images"],
    queryFn: () => fetchImages({}),
  });

  const collection = collectionById("grocery")!;
  const saved = new Map<string, { url: string; alt: string | null }>();
  for (const r of rows ?? []) saved.set(imageKey(r.scope, r.ref_key), { url: r.image_url, alt: r.alt });

  const pictureFor = (scope: "collection" | "group" | "subcategory", refKey: string) =>
    saved.get(imageKey(scope, refKey))?.url ?? defaultCategoryImages[imageKey(scope, refKey)] ?? null;

  return (
    <div className="container-page py-14">
      <header className="text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Zizaib</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">🧺 Grocery</h1>
        <p className="mt-3 text-muted-foreground">{collection.blurb}</p>
      </header>

      {isPending && (
        <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading category pictures…
        </p>
      )}
      {isError && (
        <p role="alert" className="mt-10 text-center text-sm text-muted-foreground">
          Saved pictures are unavailable right now — showing the studio defaults.
        </p>
      )}

      {collection.groups.map((group) => (
        <section key={group.id} className="mt-12">
          <h2 className="font-display text-2xl font-bold">{group.label}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.subs.map((sub) => {
              const url = pictureFor("subcategory", sub.id);
              return (
                <Link
                  key={sub.id}
                  to="/shop"
                  search={{ col: "grocery", grp: group.id, sub: sub.id }}
                  className="card-soft group overflow-hidden rounded-2xl transition hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    {url ? (
                      <img
                        src={url}
                        alt={saved.get(imageKey("subcategory", sub.id))?.alt ?? sub.label}
                        loading="lazy"
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                        Picture coming soon
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold">{sub.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Shop {sub.label.toLowerCase()} →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">From the studio</h2>
        <div className="mt-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {groceryGallery.map((shot) => (
            <figure key={shot.url} className="overflow-hidden rounded-2xl border border-border">
              <img src={shot.url} alt={shot.caption} loading="lazy" className="aspect-square w-full object-cover" />
              <figcaption className="p-3 text-xs text-muted-foreground">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
