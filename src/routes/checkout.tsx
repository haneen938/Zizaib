import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckoutForm, type ShippingDetails } from "@/components/CheckoutForm";
import PaymentCheckoutAnimation, { type CashTransferDetails } from "@/components/PaymentCheckoutAnimation";
import { placeOrder } from "@/lib/orders.functions";
type PaymentMethod = "card" | "bank";
import { useCart, useCartSubtotal } from "@/store/cartStore";
import { useMoney } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Zizaib" },
      { name: "description", content: "Secure pre-payment checkout for your Zizaib crochet order." },
    ],
  }),
  component: Checkout,
});

import { shippingFor } from "@/lib/pricing";


function Checkout() {
  const money = useMoney();
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCartSubtotal();
  const clear = useCart((s) => s.clear);
  const submitOrder = useServerFn(placeOrder);

  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [details, setDetails] = useState<ShippingDetails>({ fullName: "", email: "", phone: "", address: "", city: "", postal: "", notes: "" });

  const shipping = shippingFor(subtotal, items.length);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to check out yet</h1>
        <p className="mt-2 text-muted-foreground">Add a piece or two from the shop first.</p>
        <Link to="/shop" className="btn-primary mt-6">Browse the shop</Link>
      </div>
    );
  }

  const handlePaid = async (method: PaymentMethod, cash?: CashTransferDetails) => {
    try {
      const res = await submitOrder({
        data: {
          fullName: details.fullName,
          email: details.email,
          phone: details.phone,
          address: details.address,
          city: details.city,
          postal: details.postal,
          notes: details.notes,
          method,
          total,
          items: items.map((i) => ({ id: i.id, productId: i.productId, title: i.title, qty: i.qty, price: i.price, color: i.color ?? "", size: i.size ?? "" })),
          ...(cash ? { cash } : {}),
        },
      });
      if (!res.ok) {
        toast.error(res.error, { duration: 8000 });
        return;
      }
      clear();
      navigate({ to: "/confirmation", search: { o: res.trackingNumber, m: method } });

    } catch {
      toast.error("We couldn't save your order. Please try again in a moment.");
    }
  };

  return (
    <div className="container-page py-12 grid lg:grid-cols-[1fr_380px] gap-10">
      <div>
        <h1 className="font-display text-4xl font-bold">Checkout</h1>
        <div className="mt-6 flex gap-2 text-sm">
          <StepDot active={step === "shipping"} done={step === "payment"} n={1} label="Shipping" />
          <div className="flex-1 self-center h-px bg-border" />
          <StepDot active={step === "payment"} done={false} n={2} label="Payment" />
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="card-soft p-6 mt-8"
        >
          {step === "shipping" ? (
            <CheckoutForm
              values={details}
              onValid={(v) => {
                setDetails(v);
                setStep("payment");
              }}
            />
          ) : (
            <>
              <button onClick={() => setStep("shipping")} className="text-xs text-muted-foreground hover:text-foreground mb-4">
                ← Edit shipping
              </button>
              <PaymentCheckoutAnimation amount={total} onPay={handlePaid} />
            </>
          )}
        </motion.div>
      </div>

      <aside className="card-soft p-6 h-fit lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-bold">Order summary</h2>
        <ul className="mt-4 space-y-3 max-h-72 overflow-y-auto">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 items-center">
              <img src={i.image} alt="" className="size-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{i.title}</p>
                <p className="text-xs text-muted-foreground">{i.color ? `${i.color} · ` : ""}Qty {i.qty}</p>
              </div>
              <span className="text-sm font-semibold">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 pt-4 border-t border-border space-y-2 text-sm">
          <Row label="Subtotal" value={money(subtotal)} />
          <Row label="Shipping" value={shipping === 0 ? "Free" : money(shipping)} />
          <Row label="Total" value={money(total)} bold />
        </div>
        {shipping === 0 && (
          <p className="mt-2 text-xs text-primary">Yay! Free Pakistan-wide shipping unlocked 💕</p>
        )}
      </aside>
    </div>
  );
}

function StepDot({ active, done, n, label }: { active: boolean; done: boolean; n: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-7 rounded-full grid place-items-center text-xs font-semibold ${
        active || done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }`}>
        {n}
      </span>
      <span className={active ? "font-semibold" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold pt-2 border-t border-border" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}
