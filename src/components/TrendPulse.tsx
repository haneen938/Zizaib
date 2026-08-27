import { motion } from "motion/react";
import { Camera, Scissors, Bike, Sparkles } from "lucide-react";
const vision = { url: "/photos/studio/creator.jpg" };
const craft = { url: "/photos/studio/craft.jpg" };
const delivery = { url: "/photos/studio/delivery.jpg" };

const cards = [
  {
    step: "01",
    title: "The Vision",
    quote: "Hey gize! Working on your vision.",
    image: vision.url,
    icon: Camera,
    alt: "Zizaib content creator filming products in the studio",
  },
  {
    step: "02",
    title: "The Craft",
    quote: "Stitching your fashion taste.",
    image: craft.url,
    icon: Scissors,
    alt: "Artisans crocheting inside Zizaib Studios",
  },
  {
    step: "03",
    title: "The Delivery",
    quote: "Delivering your happiness on your door.",
    image: delivery.url,
    icon: Bike,
    alt: "Zizaib delivery riders with branded boxes",
  },
];

export function TrendPulse() {
  return (
    <section className="container-page py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-primary">
          <Sparkles className="size-3.5" /> Our process
        </p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">The Trend Pulse</h2>
        <p className="mt-3 text-muted-foreground">
          From spark to stitch to your doorstep — three beats that keep Zizaib ahead of the trend.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[2rem] bg-card border border-border/60 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.alt}
                  className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-background/85 backdrop-blur px-3 py-1 text-xs font-brand tracking-[0.2em] text-foreground">
                  {c.step}
                </span>
                <span className="absolute top-4 right-4 grid place-items-center size-10 rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <div className="absolute bottom-4 left-4 right-4 text-background">
                  <p className="font-display text-2xl font-semibold drop-shadow">{c.title}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-foreground/90 italic">
                  "{c.quote}"
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-0 ring-primary/40 group-hover:ring-2 transition-all" />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
