import { motion } from "motion/react";
import { CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import { useMoney } from "@/lib/format";

export type PaymentMethod = "card" | "bank";

const methods: { id: PaymentMethod; label: string; tagline: string; icon: React.ReactNode; tint: string }[] = [
  { id: "card", label: "Debit / Credit Card", tagline: "Visa · Mastercard · UnionPay (PK)", icon: <CreditCard className="size-5" />, tint: "from-peach/40 to-pink/40" },
  { id: "bank", label: "Online Bank Transfer", tagline: "Direct transfer · IBAN shared on next step", icon: <Landmark className="size-5" />, tint: "from-sage/40 to-beige/60" },
];

// Pakistani pre-payment picker. Pure UI — real PSP plugs in here.
export function PaymentOptions({ onPay, amount }: { onPay: (m: PaymentMethod) => void; amount: number }) {
  const money = useMoney();
  const [selected, setSelected] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    onPay(selected);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-secondary/40 p-3 text-xs text-secondary-foreground border border-secondary">
        🔒 Pre-payment only — Zizaib does not offer Cash on Delivery. Sandbox demo: no real charge will be made.
      </div>
      <div className="space-y-3">
        {methods.map((m) => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(m.id)}
            className={`w-full text-left rounded-2xl border-2 p-4 flex items-center gap-4 transition bg-gradient-to-br ${m.tint} ${
              selected === m.id ? "border-primary shadow-[var(--shadow-soft)]" : "border-transparent"
            }`}
          >
            <span className="rounded-xl bg-background/80 p-3">{m.icon}</span>
            <span className="flex-1">
              <span className="block font-semibold">{m.label}</span>
              <span className="block text-xs text-muted-foreground">{m.tagline}</span>
            </span>
            <span className={`size-4 rounded-full border-2 ${selected === m.id ? "border-primary bg-primary" : "border-border"}`} />
          </motion.button>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handlePay}
        disabled={processing}
        className="btn-primary w-full disabled:opacity-70"
      >
        {processing ? "Processing…" : `Pay ${money(amount)}`}
      </motion.button>
    </div>
  );
}
