import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CURRENCIES, useCurrency, type CurrencyCode } from "@/store/currencyStore";

// Minimalist currency dropdown for the global header.
export function CurrencySwitcher() {
  const code = useCurrency((s) => s.code);
  const setCurrency = useCurrency((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const active = CURRENCIES[code];
  const codes = Object.keys(CURRENCIES) as CurrencyCode[];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${active.label}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium tracking-wide hover:bg-muted transition"
      >
        <Globe className="size-3.5 text-primary" />
        <span>{active.label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-lift)] p-1.5 z-50"
          >
            {codes.map((c) => {
              const meta = CURRENCIES[c];
              const selected = c === code;
              return (
                <li key={c}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setCurrency(c);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-left transition ${
                      selected ? "bg-muted text-foreground" : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Globe className="size-3.5 text-primary" />
                      {meta.label}
                    </span>
                    {selected && <Check className="size-3.5 text-primary" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
