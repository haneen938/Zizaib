import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Heart, Gift, Sparkles } from "lucide-react";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Us — Zizaib Club" },
      { name: "description", content: "Join the Zizaib club — early access to new drops, special discounts, and behind-the-stitches updates." },
      { property: "og:title", content: "Join the Zizaib Club" },
      { property: "og:description", content: "Early access to new drops and special discounts." },
    ],
  }),
  component: Join,
});

function Join() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="container-page py-20 max-w-xl text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-auto size-16 rounded-full bg-gradient-to-br from-peach to-pink grid place-items-center text-2xl"
      >
        🧶
      </motion.div>
      <h1 className="mt-6 font-display text-4xl md:text-5xl font-bold">Join the charm club</h1>
      <p className="mt-3 text-muted-foreground">
        Be the first to know about new drops, special discounts, and behind-the-stitches studio peeks.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-3 text-left">
        {[
          { icon: <Sparkles className="size-4" />, label: "Early access to new drops" },
          { icon: <Gift className="size-4" />, label: "Member-only discounts" },
          { icon: <Heart className="size-4" />, label: "Birthday surprises 🎁" },
        ].map((p) => (
          <div key={p.label} className="card-soft p-4 flex items-start gap-2">
            <span className="text-primary mt-0.5">{p.icon}</span>
            <span className="text-sm">{p.label}</span>
          </div>
        ))}
      </div>

      {joined ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft mt-10 p-6"
        >
          <p className="font-semibold">You're in! 💕</p>
          <p className="text-sm text-muted-foreground mt-1">Check your inbox for a tiny welcome note from the studio.</p>
        </motion.div>
      ) : (
        <form
          className="mt-10 flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => { e.preventDefault(); setJoined(true); }}
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="btn-primary">Join the club</button>
        </form>
      )}
      <p className="mt-3 text-xs text-muted-foreground">No spam — only soft, cozy updates.</p>
    </div>
  );
}
