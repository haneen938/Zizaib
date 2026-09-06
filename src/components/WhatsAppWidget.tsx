import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ShoppingBag, Star, Users } from "lucide-react";

export const WHATSAPP_NUMBER = "923124855863";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const ORDER_MESSAGE =
  "Hi! I would like to place an order from your website. Please help me with the process.";
const REVIEW_MESSAGE =
  "Hi! I want to share my feedback and leave a review about my experience.";

export const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/LJtZ8YBl5EhKPDeq5lacS6";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 print:hidden"
    >
      {open && (
        <div className="w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)] overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3 bg-[#25D366] px-4 py-3 text-white">
            <p className="text-sm font-semibold leading-snug">
              👋 Hi there! How can we help you today?
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat options"
              className="rounded-full p-1 hover:bg-white/20 transition"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="p-3 space-y-2">
            <a
              href={waLink(ORDER_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
            >
              <ShoppingBag className="size-4" /> 🛍️ Order via WhatsApp
            </a>
            <a
              href={waLink(REVIEW_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              <Star className="size-4" /> ⭐ Leave a Review / Feedback
            </a>
            <a
              href={WHATSAPP_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-foreground hover:bg-[#25D366]/20 transition"
            >
              <Users className="size-4" /> 👥 Join our WhatsApp Community
            </a>
            <p className="pt-1 text-center text-[11px] text-muted-foreground">
              We usually reply within a few minutes.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with us on WhatsApp"
        aria-expanded={open}
        className="relative grid place-items-center size-14 rounded-full bg-[#25D366] text-white shadow-[var(--shadow-lift)] hover:scale-105 active:scale-95 transition"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
        />
        <MessageCircle className="relative size-7" />
      </button>
    </div>
  );
}
