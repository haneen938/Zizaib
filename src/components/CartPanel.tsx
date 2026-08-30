import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart, useCartSubtotal } from "@/store/cartStore";
import { useMoney } from "@/lib/format";

export function CartPanel() {
  const money = useMoney();
  const { isOpen, closeCart, items, updateQty, removeItem } = useCart();
  const subtotal = useCartSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md bg-background shadow-[var(--shadow-lift)] flex flex-col"
          >
            <header className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl font-bold">Your basket</h2>
              <button onClick={closeCart} aria-label="Close" className="rounded-full p-2 hover:bg-muted">
                <X className="size-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3">
                <span className="text-5xl">🧺</span>
                <p className="text-muted-foreground">Your basket is empty — go pick something charming.</p>
                <button onClick={closeCart} className="btn-primary mt-2">Keep browsing</button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto p-5 space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4 card-soft p-3"
                      >
                        <img src={item.image} alt={item.title} className="size-20 rounded-2xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <p className="font-semibold leading-tight truncate">{item.title}</p>
                            <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          {(item.color || item.size) && (
                            <p className="text-xs text-muted-foreground">
                              {[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1 rounded-full border border-border">
                              <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-muted rounded-full" aria-label="Decrease">
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-muted rounded-full" aria-label="Increase">
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <p className="font-semibold">{money(item.price * item.qty)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t border-border p-5 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-semibold text-base">{money(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping calculated at checkout.</p>
                  <Link to="/checkout" onClick={closeCart} className="btn-primary w-full">
                    Checkout →
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
