import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, MessageSquarePlus, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { addReview, listReviews, type ReviewRow } from "@/lib/reviews.functions";
const ansa = { url: "/photos/customers/karachi-ansa.jpg" };
const hannah = { url: "/photos/customers/spain-hannah.jpg" };
const faris = { url: "/photos/customers/girl-faris.jpg" };
const anna = { url: "/photos/customers/manchester-anna.jpg" };

type Seed = { name: string; rating: number; text: string; city?: string; date?: string; image?: string; images?: string[] };

// Real customer photo reviews shown on every product page as social proof.
const PHOTO_REVIEWS: Seed[] = [
  { name: "Ansa", city: "Karachi, Pakistan", rating: 5, text: "Ordered from Karachi for me and my best friend — we loved it! The stitching is so neat and it matched both our outfits perfectly. 💕", image: ansa.url },
  { name: "Hannah", city: "Spain", rating: 5, text: "My crochet bag arrived in Spain beautifully packed. The tassels and medallion look even better in person.", image: hannah.url },
  { name: "Faris", city: "Islamabad, Pakistan", rating: 5, text: "I ordered this for my daughter and she absolutely loved it — she takes it everywhere now.", image: faris.url },
  { name: "Anna", city: "Manchester, UK", rating: 5, text: "I ordered this for my little sister and it turned out beautiful — she wears it everywhere. The crochet work is so neat and the colours are lovely. 🥑", image: anna.url },
];

const emailRe = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;

type ReviewImage = { fileName: string; contentType: string; dataBase64: string };
type ReviewPayload = { productId: string; name: string; email: string; rating: number; comment: string; images: ReviewImage[] };

function readFile(file: File): Promise<ReviewImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ fileName: file.name, contentType: file.type || "image/jpeg", dataBase64: String(reader.result) });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 text-primary ${className}`} aria-label={`${value} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`size-4 ${i < value ? "fill-current" : "opacity-25"}`} />
      ))}
    </div>
  );
}

export function ProductReviews({ productId, seedReviews = [] }: { productId: string; seedReviews?: Seed[] }) {
  const qc = useQueryClient();
  const fetchReviews = useServerFn(listReviews);
  const submitReview = useServerFn(addReview);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "" });
  const [images, setImages] = useState<ReviewImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews({ data: { productId } }),
  });

  const mutation = useMutation({
    mutationFn: (payload: ReviewPayload) => submitReview({ data: payload }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error, { duration: 8000 });
        return;
      }
      qc.setQueryData<ReviewRow[]>(["reviews", productId], (prev) => [res.review, ...(prev ?? [])]);
      setForm({ name: "", email: "", rating: 5, comment: "" });
      setImages([]);
      setOpen(false);
      toast.success("Thanks for your review! 💗");
    },
    onError: () => toast.error("Couldn't save your review. Please try again."),
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!emailRe.test(form.email.trim())) next["email"] = "Please enter a valid email address.";
    if (!form.comment.trim()) next["comment"] = "Please write your review.";
    setErrors(next);
    if (Object.keys(next).length) return;
    mutation.mutate({
      productId,
      name: form.name.trim() || "Anonymous",
      email: form.email.trim(),
      rating: form.rating,
      comment: form.comment.trim(),
      images,
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/") && f.size <= 5_000_000);
    const encoded = await Promise.all(picked.map(readFile));
    setImages((prev) => [...prev, ...encoded].slice(0, 5));
  };

  const all = [
    ...reviews.map((r) => ({ name: r.name, rating: r.rating, text: r.comment, date: new Date(r.created_at).toLocaleDateString(), city: undefined as string | undefined, images: r.image_urls ?? [] })),
    ...PHOTO_REVIEWS,
    ...seedReviews.map((s) => ({ name: s.name, rating: s.rating, text: s.text, date: s.date, city: s.city })),
  ] as Seed[];
  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;

  return (
    <section className="container-page pb-12" id="reviews">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl font-bold">Reviews &amp; Comments</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Stars value={Math.round(avg)} />
            <span>{all.length} review{all.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="btn-primary">
          <MessageSquarePlus className="size-4" /> {open ? "Close form" : "Add Review"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="card-soft p-5 mb-8 grid gap-4 sm:grid-cols-2" noValidate>
          <div>
            <label htmlFor="rv-name" className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              id="rv-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={80}
              placeholder="Your name"
              className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="rv-email" className="block text-sm font-semibold mb-1">Email Address *</label>
            <input
              id="rv-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              placeholder="you@example.com"
              aria-invalid={!!errors["email"]}
              className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
            {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
          </div>
          <div className="sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">Star Rating</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="p-1.5 min-h-11 min-w-11 grid place-items-center"
                >
                  <Star className={`size-6 text-primary ${n <= form.rating ? "fill-current" : "opacity-30"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rv-comment" className="block text-sm font-semibold mb-1">Review / Comment *</label>
            <textarea
              id="rv-comment"
              required
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              maxLength={2000}
              placeholder="Tell others what you loved about this product…"
              aria-invalid={!!errors["comment"]}
              className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
            />
            {errors["comment"] && <p className="mt-1 text-xs text-destructive">{errors["comment"]}</p>}
          </div>
          <div className="sm:col-span-2">
            <span className="block text-sm font-semibold mb-1">Photos (optional, up to 5)</span>
            <label className="btn-ghost inline-flex cursor-pointer items-center gap-2">
              <ImagePlus className="size-4" /> Add photos
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void handleFiles(e.target.files); e.target.value = ""; }} />
            </label>
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img.dataBase64} alt={`Preview ${i + 1}`} className="size-24 rounded-xl object-cover border-2 border-border" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                      className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-foreground text-background"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary disabled:opacity-60">
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Submit review
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : all.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your thoughts!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((r, i) => (
            <article key={i} className="card-soft p-5">
              {r.image && (
                <img src={r.image} alt={`Photo review by ${r.name}`} loading="lazy" className="mb-3 aspect-[4/3] w-full rounded-2xl object-cover" />
              )}
              {r.images && r.images.length > 0 && (
                <div className={`mb-3 grid gap-2 ${r.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {r.images.map((src, j) => (
                    <img key={j} src={src} alt={`Photo ${j + 1} from ${r.name}`} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
                  ))}
                </div>
              )}
              <Stars value={r.rating} />
              <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{r.name}</span>
                {r.city ? ` · ${r.city}` : ""}
                {r.date ? ` · ${r.date}` : ""}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}