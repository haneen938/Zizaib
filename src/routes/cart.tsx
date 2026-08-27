import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, useCartSubtotal } from "@/store/cartStore";
import { useMoney } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your basket — Zizaib" },
      { name: "description", content: "Review the handmade crochet pieces in your basket before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const money = useMoney();
  const { items, updateQty, removeItem } = useCart();
  const subtotal = useCartSubtotal();

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <span className="text-6xl">🧺</span>
        <h1 className="mt-4 font-display text-4xl font-bold">Your basket is empty</h1>
        <p className="mt-2 text-muted-foreground">Find something soft to take home.</p>
        <Link to="/shop" className="btn-primary mt-6">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12 grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <h1 className="font-display text-4xl font-bold">Your basket</h1>
        <ul className="mt-6 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="card-soft p-4 flex gap-4 items-center"
              >
                <img src={item.image} alt={item.title} className="size-24 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{item.title}</p>
                  {item.color && <p className="text-xs text-muted-foreground">{item.color}</p>}
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-muted rounded-full">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-muted rounded-full">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{money(item.price * item.qty)}</p>
                  <button onClick={() => removeItem(item.id)} className="mt-2 text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <aside className="card-soft p-6 h-fit lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-bold">Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span className="text-foreground">{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span><span className="text-foreground">Calculated next</span>
          </div>
        </div>
        <Link to="/checkout" className="btn-primary w-full mt-6">Checkout →</Link>
      </aside>
    </div>
  );
}
