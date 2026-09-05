import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Truck, Package, Copy, FileDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { z } from "zod";
import { useMoney } from "@/store/currencyStore";
import { downloadReceiptPdf } from "@/lib/receipt-pdf";

export const search = z.object({
  o: z.string().default("YC-XXXXXX"),
  m: z.enum(["card", "bank", "cash"]).default("card"),
  tot: z.coerce.number().nonnegative().optional(),
});


export const Route = createFileRoute("/confirmation")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Order confirmed — Zizaib" },
      { name: "description", content: "Thank you! Your handmade Zizaib order is being prepared." },
    ],
  }),
  component: Confirmation,
});

const methodLabel: Record<"card" | "bank" | "cash", string> = {
  card: "Debit / Credit Card",
  bank: "Online Bank & Wallet Transfer",
  cash: "Online Bank & Wallet Transfer",
};

const MILESTONES = ["Warehouse", "Shipped", "On the Way", "Delivered"] as const;
// percentage positions of each milestone along the track
const POSITIONS = [4, 36, 68, 96];

function Confirmation() {
  const { o, m, tot } = Route.useSearch() as z.infer<typeof search>;
  const [stage, setStage] = useState(2); // index of active milestone; starts at "On the Way"
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const money = useMoney();
  const firedConfetti = useRef(false);


  useEffect(() => {
    if (firedConfetti.current) return;
    firedConfetti.current = true;
    const t = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.3 },
        colors: ["#10b981", "#34d399", "#f472b6", "#fbbf24", "#60a5fa"],
      });
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const trackLive = () => {
    setStage((s) => Math.min(3, s + 1));
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  return (
    <div className="container-page py-16 max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
        className="mx-auto size-20 rounded-full grid place-items-center bg-secondary text-secondary-foreground shadow-[var(--shadow-lift)]"
      >
        <Check className="size-10" strokeWidth={3} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 font-display text-4xl md:text-5xl font-bold"
      >
        Order Confirmed 🎉
      </motion.h1>
      <p className="mt-2 text-muted-foreground">Thank you — we're stitching your order up now.</p>

      <div className="mt-6 mx-auto max-w-md rounded-3xl border-2 border-dashed border-primary/50 bg-primary/5 p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Your tracking number</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-foreground break-all">{o}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => { void navigator.clipboard.writeText(o); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground/60 bg-card px-4 py-2 min-h-11 text-sm font-bold"
          >
            {copied ? <><Check className="size-4" /> Copied</> : <><Copy className="size-4" /> Copy</>}
          </button>
          <Link to="/track" search={{ t: o }} className="btn-primary">
            <Truck className="size-4" /> Track this order
          </Link>
          <button
            type="button"
            disabled={downloading}
            onClick={async () => {
              setDownloading(true);
              try {
                await downloadReceiptPdf({
                  trackingNumber: o,
                  method: m,
                  total: tot !== undefined ? money(tot) : "—",
                  status: MILESTONES[stage],
                });
              } finally {
                setDownloading(false);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground/60 bg-card px-4 py-2 min-h-11 text-sm font-bold disabled:opacity-60"
          >
            <FileDown className="size-4" /> {downloading ? "Preparing…" : "Download receipt (PDF)"}
          </button>

        </div>
        <p className="mt-3 text-xs text-muted-foreground">Save this number — you'll need it to check your shipment status.</p>
      </div>

      {/* Delivery tracker */}
      <div className="mt-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-6 md:p-8">
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm">
          <Package className="size-4" /> Live shipping status
        </div>

        <div className="relative mt-8 h-24">
          {/* Track */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: `${POSITIONS[stage]}%` }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </div>

          {/* Milestones */}
          {MILESTONES.map((label, i) => {
            const active = i <= stage;
            const current = i === stage;
            return (
              <div
                key={label}
                className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${POSITIONS[i]}%` }}
              >
                <span
                  className={`size-3.5 rounded-full ring-4 ring-white transition-colors ${
                    active ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <span
                  className={`mt-3 text-[10px] md:text-xs whitespace-nowrap font-medium ${
                    current
                      ? "text-emerald-600 font-bold"
                      : active
                        ? "text-slate-700"
                        : "text-slate-400"
                  }`}
                  style={current ? { animation: "milestone-pulse 1.4s ease-in-out infinite" } : undefined}
                >
                  {label}
                </span>
              </div>
            );
          })}

          {/* Truck */}
          <motion.div
            className="absolute top-1/2 -translate-y-[110%] -translate-x-1/2 pointer-events-none"
            initial={{ left: "0%" }}
            animate={{ left: `${POSITIONS[stage]}%` }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <div style={{ animation: "truck-bump 0.4s ease-in-out infinite" }}>
              <TruckIcon />
            </div>
          </motion.div>
        </div>

        <button
          onClick={trackLive}
          disabled={stage >= 3}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <Truck className="size-4" />
          {stage >= 3 ? "Delivered!" : "Track Live Order"}
        </button>
      </div>

      <div className="card-soft mt-8 p-6 text-left space-y-2 text-sm">
        <Row k="Tracking number" v={o} />
        <Row k="Payment" v={`${methodLabel[m]} (sandbox)`} />
        <Row k="Status" v={MILESTONES[stage]} />
        <Row k="Estimated ship" v="5–7 business days · across Pakistan" />
      </div>

      <Link to="/" className="btn-primary mt-8">Continue browsing</Link>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg width="56" height="36" viewBox="0 0 56 36" fill="none" className="drop-shadow-md">
      {/* Cargo box */}
      <rect x="2" y="6" width="30" height="20" rx="2" fill="#1e293b" />
      <rect x="6" y="10" width="22" height="4" rx="1" fill="#334155" />
      {/* Cab */}
      <path d="M32 12 L44 12 L52 20 L52 26 L32 26 Z" fill="#0f172a" />
      <rect x="35" y="14" width="10" height="7" rx="1" fill="#93c5fd" />
      {/* Wheels */}
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "wheel-spin 0.6s linear infinite" }}>
        <circle cx="12" cy="28" r="4" fill="#0f172a" />
        <circle cx="12" cy="28" r="1.5" fill="#64748b" />
      </g>
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "wheel-spin 0.6s linear infinite" }}>
        <circle cx="42" cy="28" r="4" fill="#0f172a" />
        <circle cx="42" cy="28" r="1.5" fill="#64748b" />
      </g>
    </svg>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
