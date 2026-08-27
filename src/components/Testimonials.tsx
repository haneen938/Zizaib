import { motion } from "motion/react";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="container-page py-20" id="reviews">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-sm uppercase tracking-wider text-primary">Style notes</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold">Loved across Pakistan</h2>
        <p className="mt-3 text-muted-foreground">What fashion-forward customers are saying about this season's Zizaib edit.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3) }}
            className="card-soft p-6"
          >
            <div className="flex items-center gap-1 text-primary" aria-label={`${t.rating} of 5 stars`}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`size-4 ${idx < t.rating ? "fill-current" : "opacity-25"}`} />
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.text}"</blockquote>
            <figcaption className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{t.name}</span>
              <span>{t.city ? `${t.city} · ` : ""}{t.date}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
