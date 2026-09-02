import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { collections, type CollectionId } from "@/data/taxonomy";
import {
  amIAdmin,
  deleteCategoryImage,
  listCategoryImages,
  saveCategoryImage,
} from "@/lib/category-images.functions";
import { defaultCategoryImages, imageKey, type CategoryImageScope } from "@/data/category-images";

export const Route = createFileRoute("/_authenticated/admin/category-images")({
  head: () => ({
    meta: [
      { title: "Category pictures — Zizaib Studio" },
      { name: "description", content: "Upload or paste a picture for any Zizaib category or subcategory." },
      { property: "og:title", content: "Category pictures — Zizaib Studio" },
      { property: "og:description", content: "Manage the artwork shown on Zizaib category cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCategoryImages,
});

type Target = { scope: CategoryImageScope; refKey: string; label: string };

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });

function AdminCategoryImages() {
  const qc = useQueryClient();
  const checkAdmin = useServerFn(amIAdmin);
  const fetchImages = useServerFn(listCategoryImages);
  const save = useServerFn(saveCategoryImage);
  const remove = useServerFn(deleteCategoryImage);

  const admin = useQuery({ queryKey: ["am-i-admin"], queryFn: () => checkAdmin({}) });
  const images = useQuery({ queryKey: ["category-images"], queryFn: () => fetchImages({}) });

  const [collectionId, setCollectionId] = useState<CollectionId>("grocery");
  const [refKey, setRefKey] = useState<string>("grocery-keychain");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const collection = collections.find((c) => c.id === collectionId)!;

  const targets: Target[] = useMemo(() => {
    const list: Target[] = [{ scope: "collection", refKey: collection.id, label: `${collection.label} (whole collection)` }];
    for (const group of collection.groups) {
      list.push({ scope: "group", refKey: group.id, label: `— ${group.label} (group)` });
      for (const sub of group.subs) list.push({ scope: "subcategory", refKey: sub.id, label: `· ${sub.label}` });
    }
    return list;
  }, [collection]);

  const current = targets.find((t) => t.refKey === refKey) ?? targets[0]!;
  const saved = (images.data ?? []).find((r) => r.scope === current.scope && r.ref_key === current.refKey);
  const preview = saved?.image_url ?? defaultCategoryImages[imageKey(current.scope, current.refKey)] ?? null;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = { scope: current.scope, refKey: current.refKey };
      if (alt.trim()) payload["alt"] = alt.trim();
      if (file) payload["upload"] = { fileName: file.name, contentType: file.type, dataBase64: await fileToBase64(file) };
      else payload["imageUrl"] = url.trim();
      return save({ data: payload });
    },
    onSuccess: (res) => {
      if (res.ok) {
        setMessage("Saved.");
        setFile(null);
        setUrl("");
        void qc.invalidateQueries({ queryKey: ["category-images"] });
      } else setMessage(res.error);
    },
    onError: (err) => setMessage(err instanceof Error ? err.message : "Save failed."),
  });

  const removal = useMutation({
    mutationFn: () => remove({ data: { scope: current.scope, refKey: current.refKey } }),
    onSuccess: () => {
      setMessage("Removed — the default picture is back.");
      void qc.invalidateQueries({ queryKey: ["category-images"] });
    },
  });

  if (admin.isLoading) return <main className="container-page py-16">Checking access…</main>;
  if (!admin.data?.isAdmin) {
    return (
      <main className="container-page py-16">
        <h1 className="font-brand text-3xl">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account is signed in but does not have the admin role, so it cannot change category pictures.
        </p>
      </main>
    );
  }

  return (
    <main className="container-page py-12">
      <h1 className="font-brand text-3xl">Category pictures</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Pick a collection, choose the category or subcategory, then upload a photo or paste an image link.
        Saved pictures show instantly on the storefront cards.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(null);
            mutation.mutate();
          }}
        >
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Collection</span>
            <select
              value={collectionId}
              onChange={(e) => {
                const id = e.target.value as CollectionId;
                setCollectionId(id);
                setRefKey(id);
              }}
              className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Category / subcategory</span>
            <select
              value={refKey}
              onChange={(e) => setRefKey(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3"
            >
              {targets.map((t) => (
                <option key={`${t.scope}:${t.refKey}`} value={t.refKey}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Upload a picture (JPG or PNG, max 5 MB)</span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">…or paste an image link (https://)</span>
            <input
              type="url"
              value={url}
              maxLength={2000}
              disabled={Boolean(file)}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3 disabled:opacity-50"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Alt text (accessibility)</span>
            <input
              type="text"
              value={alt}
              maxLength={160}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={mutation.isPending || (!file && !url.trim())}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background disabled:opacity-60"
            >
              {mutation.isPending ? "Saving…" : "Save picture"}
            </button>
            {saved && (
              <button
                type="button"
                onClick={() => removal.mutate()}
                className="rounded-full border border-pink-300 px-6 py-3 text-sm font-semibold"
              >
                Remove saved picture
              </button>
            )}
          </div>

          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </form>

        <aside className="rounded-2xl border border-pink-200 p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Preview — {current.label}</p>
          <div className="mt-3 aspect-square overflow-hidden rounded-xl bg-pink-50">
            {preview ? (
              <img src={preview} alt={saved?.alt ?? current.label} className="size-full object-cover" loading="lazy" />
            ) : (
              <div className="grid size-full place-items-center text-sm text-muted-foreground">No picture yet</div>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {saved ? "Custom picture saved in the database." : "Showing the built-in default."}
          </p>
        </aside>
      </div>
    </main>
  );
}
