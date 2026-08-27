import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Sparkles, Leaf, MapPin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Zizaib" },
      { name: "description", content: "Zizaib is a latest-fashion boutique based in Pakistan, curating premium crochet pieces and evolving trends as the market moves." },
      { property: "og:title", content: "About Zizaib — Zizaib" },
      { property: "og:description", content: "A trend-led Pakistani boutique spotlighting premium crochet now, with an open edit for what's next in fashion." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-sm uppercase tracking-wider text-primary">Our story</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl font-bold">Trend-led, made with intention.</h1>
      </motion.header>

      <p className="mt-8 text-lg leading-relaxed text-foreground/90">
        <strong>Zizaib</strong> is a Pakistani fashion boutique dedicated to bringing you the latest style movements as they happen. Right now, premium crochet is at the forefront of contemporary fashion — and we're spotlighting it across pouches, bags, hair accessories, bouquets, and home accents. As trends shift, our edit stays open: we'll keep introducing high-demand fashion pieces that fit your wardrobe and your vibe.
      </p>

      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { icon: <Heart className="size-5" />, title: "Curated with care", text: "Every piece selected and finished with attention to detail." },
          { icon: <Leaf className="size-5" />, title: "Limited drops", text: "Small, intentional collections that feel fresh and exclusive." },
          { icon: <MapPin className="size-5" />, title: "Proudly Pakistani", text: "Styled, made, and shipped from Pakistan for fashion lovers here." },
        ].map((v) => (
          <div key={v.title} className="card-soft p-5">
            <span className="inline-grid place-items-center size-9 rounded-full bg-secondary text-secondary-foreground">{v.icon}</span>
            <p className="mt-3 font-semibold">{v.title}</p>
            <p className="text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>

      <section className="card-soft p-8 mt-12">
        <div className="flex items-start gap-3">
          <Sparkles className="size-5 text-primary mt-1" />
          <div>
            <h2 className="font-display text-2xl font-bold">Our promise</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Premium, hand-finished pieces you can actually wear</li>
              <li>· Soft, skin-friendly cotton & acrylic materials</li>
              <li>· Three color options on every product</li>
              <li>· Pre-payment via Pakistani cards or bank transfer (no COD)</li>
              <li>· Pakistan-wide shipping, free over Rs 5,000</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link to="/shop" className="btn-primary">Shop the edit</Link>
      </div>
    </div>
  );
}
