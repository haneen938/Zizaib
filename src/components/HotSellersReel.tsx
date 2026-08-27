import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Hand } from "lucide-react";
import { products } from "@/data/products";
import { useMoney } from "@/lib/format";
import StrokeText from "@/components/StrokeText";

const hotSellers = products.filter((p) => p.badge === "Bestseller").slice(0, 6);

export function HotSellersReel() {
  const [i, setI] = useState(0);
  const money = useMoney();

  useEffect(() => {
    if (hotSellers.length < 2) return;
    const iv = setInterval(() => setI((p) => (p + 1) % hotSellers.length), 3600);
    return () => clearInterval(iv);
  }, []);

  if (hotSellers.length === 0) return null;
  const p = hotSellers[i];
  const img = p.variants[0].image;

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%), radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%)",
        }}
      />
      <div className="container-page">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3.5" /> Hot Right Now
          </span>
          <h2 className="sr-only">Straight off the studio table</h2>
          <div className="mt-3">
            <StrokeText text="Straight off the studio table" strokeColor="#6aa877" fillColor="#5c4033" fontSize={72} trigger="scroll" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground italic">
            Watch our best-sellers get picked up — one cute piece at a time.
          </p>
        </div>

        <div className="relative mx-auto max-w-md">
          {/* wooden table */}
          <div
            className="relative mx-auto h-72 md:h-80 w-full rounded-[2.5rem] shadow-[var(--shadow-lift)] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #d9b487 0%, #c69a6a 45%, #b3844f 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(90,50,20,0.35) 0 2px, transparent 2px 22px)",
              }}
            />
            {/* soft floor shadow */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 rounded-full bg-black/25 blur-md" />

            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ y: 40, opacity: 0, rotate: -12, scale: 0.8 }}
                animate={{
                  y: [40, -30, 0],
                  opacity: [0, 1, 1],
                  rotate: [-12, 6, 0],
                  scale: [0.8, 1.05, 1],
                }}
                exit={{ y: -180, opacity: 0, rotate: 18, scale: 0.7 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative">
                  <img
                    src={img}
                    alt={p.title}
                    className="w-52 h-52 md:w-60 md:h-60 object-cover rounded-2xl shadow-2xl ring-4 ring-white/70"
                  />
                  {/* pick-up hand */}
                  <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: [-60, -20, -80], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.6, times: [0, 0.5, 1] }}
                    className="absolute -top-6 right-4 text-foreground/80"
                  >
                    <Hand className="size-8 rotate-12 drop-shadow" />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id + "-info"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-primary font-bold">
                Bestseller · Just Picked
              </p>
              <h3 className="mt-1 font-display text-2xl md:text-3xl font-semibold">
                {p.title}
              </h3>
              <p className="mt-1 font-brand text-xl text-primary">
                {money(p.price)}
              </p>
              <Link
                to="/products/$id"
                params={{ id: p.id }}
                className="btn-primary mt-4"
              >
                Take a closer look
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* dots */}
          <div className="mt-6 flex justify-center gap-2">
            {hotSellers.map((hp, idx) => (
              <button
                key={hp.id}
                onClick={() => setI(idx)}
                aria-label={`Show ${hp.title}`}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
