import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Truck, ShieldCheck, Heart, Sparkles, Globe2 } from "lucide-react";
const heroFashion = "/photos/hero-fashion.jpg";
import { products, taxonOf } from "@/data/products";
import { collections, collectionOfSub } from "@/data/taxonomy";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { TrendPulse } from "@/components/TrendPulse";
import { HotSellersReel } from "@/components/HotSellersReel";
import CurvedLoop from "@/components/CurvedLoop";
import RotatingText from "@/components/RotatingText";
import StrokeText from "@/components/StrokeText";
import DomeGallery from "@/components/DomeGallery";
import { ClientOnly } from "@tanstack/react-router";
const customerItaly = { url: "/photos/customers/italy-sofia.jpg" };
const customerCanada = { url: "/photos/customers/canada-liam.jpg" };
const customerChina = { url: "/photos/customers/china-wei.jpg" };
const customerPakistan = { url: "/photos/customers/pakistan-faryal.jpg" };
const customerTurkey = { url: "/photos/customers/turkey-elif.jpg" };
const customerAnsa = { url: "/photos/customers/karachi-ansa.jpg" };
const customerHannah = { url: "/photos/customers/spain-hannah.jpg" };
const customerFaris = { url: "/photos/customers/girl-faris.jpg" };
const customerAnna = { url: "/photos/customers/manchester-anna.jpg" };


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zizaib — Zizaib · Latest Fashion Boutique in Pakistan" },
      { name: "description", content: "Discover the latest trends at Zizaib. We bring you the most popular, in-demand products of the day, updated constantly to match exactly what is trending right now." },
      { property: "og:title", content: "Zizaib — Zizaib · Latest Fashion Boutique" },
      { property: "og:description", content: "A trend-led Pakistani boutique spotlighting premium crochet now, with an open edit for the next big fashion movements." },
    ],
  }),
  component: Home,
});



function Home() {
  const bestSellers = products.filter((p) => p.badge === "Bestseller");
  const newArrivals = products.filter((p) => p.badge === "New");

  return (
    <>
      <Hero />
      <ValueStrip />
      <HotSellersReel />
      <Section title="Best Sellers" subtitle="The most-loved pieces this season">
        <Grid items={bestSellers.slice(0, 6)} />
        <div className="mt-8 text-center">
          <Link to="/best-sellers" className="btn-ghost">View all best sellers <ArrowRight className="size-4" /></Link>
        </div>
      </Section>
      <CategoryStrip />
      <Section title="New Arrivals" subtitle="Just dropped" tint>
        <Grid items={newArrivals} />
        <div className="mt-8 text-center">
          <Link to="/new-arrivals" className="btn-ghost">See what's new <ArrowRight className="size-4" /></Link>
        </div>
      </Section>
      <MeetTheMaker />
      <TrendPulse />
      <GlobalLove />
      <Testimonials />

    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />
      <div className="container-page py-20 md:py-28 text-center flex flex-col items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="relative w-full -mx-4 text-primary flex items-center justify-center">
            <div className="flex-1">
              <CurvedLoop
                marqueeText="Moving with the times ✦ Styling you ahead of the crowd ✦ "
                speed={1.6}
                curveAmount={120}
                interactive={true}
                className="curved-banner fill-primary text-[1.9rem] md:text-[3rem] font-extrabold tracking-wide"
              />
            </div>
          </div>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground py-2">
            <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>Pakistan's boutique for</span>
              <RotatingText
                texts={["trending fashion", "viral crochet", "everyday luxe", "gifts they love"]}
                mainClassName="px-3 sm:px-4 py-1 md:py-2 bg-primary text-primary-foreground rounded-xl overflow-hidden justify-center"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2200}
              />
            </span>
            <span className="block">delivered worldwide.</span>
          </h1>
          <p className="mt-6 mx-auto max-w-xl text-base md:text-lg text-foreground leading-relaxed">
            The destination for curated styles you'll love—from viral crochet to upcoming trends.
          </p>

          <div className="mt-10 mb-8 flex flex-col items-center gap-4">
            <Link to="/shop" className="btn-cta">
              Shop the latest drop <ArrowRight className="size-5" />
            </Link>
            <Link to="/best-sellers" className="text-base font-semibold text-foreground hover:text-primary underline underline-offset-4">
              Or browse customer favorites →
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function ValueStrip() {
  const values = [
    { icon: <Truck className="size-5" />, title: "Worldwide shipping", text: "Free over $50." },
    { icon: <ShieldCheck className="size-5" />, title: "Secure checkout", text: "Cards & bank transfer." },
  ];
  return (
    <section className="container-page py-12">
      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="card-soft p-5 flex gap-3 items-start"
          >
            <span className="rounded-full bg-secondary p-2 text-secondary-foreground">{v.icon}</span>
            <div>
              <p className="font-semibold">{v.title}</p>
              <p className="text-sm text-muted-foreground">{v.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="container-page py-12">
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-primary">Browse the collection</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Shop by category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {collections.map((c) => {
          const sample = products.find((p) => collectionOfSub(taxonOf(p))?.id === c.id);
          if (!sample) return null;
          return (
            <Link
              key={c.id}
              to="/shop"
              search={{ col: c.id }}
              className="card-soft overflow-hidden group"
            >
              <div className="aspect-square overflow-hidden">
                <img src={sample.variants[0].image} alt={c.label} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="p-3 text-sm font-semibold text-center">{c.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Section({ title, subtitle, tint, children }: { title: string; subtitle: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section className={`py-16 ${tint ? "bg-muted/40" : ""}`}>
      <div className="container-page">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-primary">{subtitle}</p>
          <h2 className="mt-1 font-display text-4xl md:text-5xl font-bold sr-only">{title}</h2>
          <div className="mx-auto max-w-2xl">
            <StrokeText text={title} strokeColor="#6aa877" fillColor="#5c4033" fontSize={88} trigger="scroll" />
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Grid({ items }: { items: typeof products }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

function MeetTheMaker() {
  return (
    <section className="container-page py-20">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video rounded-[2rem] overflow-hidden shadow-[var(--shadow-lift)] bg-muted"
        >
          <img
            src={heroFashion}
            alt="Inside the Zizaib studio"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-background text-xs uppercase tracking-[0.24em] opacity-90">
            Studio film coming soon
          </div>
        </motion.div>
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 font-display italic text-primary"
          >
            <motion.span
              animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              ✨
            </motion.span>
            <span className="text-2xl md:text-3xl tracking-tight">Inside The Making</span>
            <motion.span
              animate={{ rotate: [0, -15, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              aria-hidden
            >
              🧵
            </motion.span>
          </motion.p>
          <h2 className="mt-1 font-display text-4xl md:text-5xl font-bold">A small studio with a trend-led eye.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Zizaib started with a love for fashion-forward detail. Today we're a boutique that curates the latest style movements — beginning with premium crochet because it's everywhere right now. No machines, no mass production: just a sharp eye for what you'll want next.
          </p>
          <Link to="/about" className="btn-primary mt-6">Our story <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}

function GlobalLove() {
  const stats = [
    { icon: <Globe2 className="size-4" />, label: "30+ countries shipped" },
    { icon: <Heart className="size-4" />, label: "10,000+ happy customers" },
    { icon: <Sparkles className="size-4" />, label: "4.9★ average rating" },
  ];
  const globalCustomers = [
    { src: customerItaly.url, alt: "Sofia from Italy", meta: { name: "Sofia Ricci", country: "🇮🇹 Portofino, Italy", review: "Bellissimo! My Zizaib tote turns heads on every piazza — the crochet is so neat and it fits my whole day inside. Grazie mille! 💛", product: "Sunflower & Daisy Granny Tote" } },
    { src: customerCanada.url, alt: "Liam from Canada", meta: { name: "Liam Bennett", country: "🇨🇦 Muskoka, Canada", review: "Bought the crochet glasses cover for my hikes — soft inside, sturdy outside, and my sunglasses have zero scratches after a full autumn on the trails. Beautifully made!", product: "Ivory Shell Glasses Pouch" } },
    { src: customerChina.url, alt: "Wei from China", meta: { name: "Wei Zhang", country: "🇨🇳 Shanghai, China", review: "Gifted the crochet bouquet to my wife for our anniversary — she cried happy tears and it's now on our shelf forever. Zero wilting, all love. 🌸", product: "Pastel Garden Dream Bouquet" } },
    { src: customerPakistan.url, alt: "Faryal from Pakistan", meta: { name: "Faryal Ahmed", country: "🇵🇰 Lahore, Pakistan", review: "Carrying my Zizaib tote to uni every single day. It's roomy, sturdy, and honestly the prettiest thing on campus. Everyone keeps asking where I got it!", product: "Cocoa Heart Checker Tote" } },
    { src: customerTurkey.url, alt: "Elif from Turkey", meta: { name: "Elif Yılmaz", country: "🇹🇷 Istanbul, Turkey", review: "The hair accessories are a dream — I bought the flower clips and headband set and wear them everywhere. Such delicate stitchwork, feels handmade with love. ✨", product: "Sunflower Hair Clips Set" } },
    { src: customerAnsa.url, alt: "Ansa from Karachi, Pakistan", meta: { name: "Ansa", country: "🇵🇰 Karachi, Pakistan", review: "I ordered two pieces from Karachi — one for me and one for my best friend. We wore them together and honestly we loved it! The crochet potli bags matched our outfits perfectly. 💕", product: "Crochet Potli Bag Duo" } },
    { src: customerHannah.url, alt: "Hannah from Spain", meta: { name: "Hannah", country: "🇪🇸 Barcelona, Spain", review: "Ordered the crochet doily crossbody bag and I'm in love — the tassels and the medallion stitch are stunning in person. It goes with every linen outfit I own.", product: "Ivory Doily Crossbody Bag" } },
    { src: customerFaris.url, alt: "Faris ordered for his daughter", meta: { name: "Faris", country: "🇵🇰 Islamabad, Pakistan", review: "I ordered this little crochet bag for my daughter and she absolutely loved it — she won't take it off, even at picnics! Beautiful quality and so soft. 🐚", product: "Sea Blossom Kids Crochet Bag" } },
    { src: customerAnna.url, alt: "Anna from Manchester, UK", meta: { name: "Anna", country: "🇬🇧 Manchester, UK", review: "I ordered the avocado crossbody for my little sister and it turned out beautiful — she wears it everywhere now. The crochet work is so neat and the colours are exactly as pictured. 🥑", product: "Avocado Crossbody Pouch" } },
  ];
  return (
    <section className="container-page py-20">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-primary">Loved worldwide</p>
        <h2 className="sr-only">Different places, same happiness.</h2>
        <div className="mt-2">
          <StrokeText text="Different places," strokeColor="#6aa877" fillColor="#5c4033" fontSize={82} trigger="scroll" />
          <StrokeText text="same happiness." strokeColor="#6aa877" fillColor="#2f6b3a" fontSize={82} trigger="scroll" />
        </div>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          From Karachi to New York, Milan to Tokyo — thousands of style-lovers are wearing Zizaib every day. Every parcel is packed with care and shipped worldwide, because a good outfit knows no borders. Join a global community that trusts us for the pieces they'll actually wear on repeat.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {stats.map((s) => (
            <li key={s.label} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 backdrop-blur px-4 py-2 text-sm font-medium text-foreground">
              <span className="text-primary">{s.icon}</span>
              {s.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <p className="text-center text-sm text-muted-foreground mb-4">Drag to spin the globe · Tap a face to read their story</p>
        <div className="relative w-full h-[520px] md:h-[620px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100 ring-1 ring-pink-200/60 shadow-[var(--shadow-lift)]">
          <ClientOnly fallback={<div className="w-full h-full grid place-items-center text-muted-foreground">Loading global community…</div>}>
            <DomeGallery
              images={globalCustomers}
              grayscale={false}
              overlayBlurColor="#fdf2f8"
              fit={0.6}
              minRadius={420}
              imageBorderRadius="18px"
              openedImageBorderRadius="22px"
              openedImageWidth="300px"
              openedImageHeight="400px"
            />
          </ClientOnly>
        </div>
        <div className="text-center mt-8">
          <Link to="/shop" className="btn-primary">Shop now <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}

