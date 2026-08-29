const zizaibLogo = { url: "/photos/brand/zizaib-z-logo.png" };
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X, Search, Heart, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { collections, type CollectionId, type SubcategoryId } from "@/data/taxonomy";
import { products, safeImage, taxonOf } from "@/data/products";
import { useCart, useCartCount } from "@/store/cartStore";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { useAutoDetectCurrency } from "@/store/currencyStore";
import CircularText from "@/components/CircularText";

// Flat links that sit after the collection menus in the bar.
const flatLinks = [
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/best-sellers", label: "Best Sellers" },
  { to: "/sale", label: "Sale" },
] as const;

// Zizaib sticky navbar: Home | Bags | Jewelry | Clothing | Crochet | Makeup |
// New Arrivals | Best Sellers | Sale.
export function Navbar() {
  useAutoDetectCurrency();
  const count = useCartCount();
  const toggleCart = useCart((s) => s.toggleCart);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState<CollectionId | null>(null);

  // First real photo found in each subcategory, used as the menu thumbnail.
  const subThumb = useMemo(() => {
    const map = new Map<SubcategoryId, string>();
    for (const p of products) {
      const key = taxonOf(p);
      if (!map.has(key)) map.set(key, safeImage(p, p.variants[0]?.image));
    }
    return map;
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate({ to: "/shop", search: { q } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-pink-100/95 via-pink-50/90 to-pink-50/70 border-b-2 border-pink-300/80 shadow-[0_2px_10px_-4px_rgba(244,114,182,0.35)]">
      <nav className="container-page flex items-center justify-between gap-2 py-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative size-20 shrink-0">
            <motion.span
              whileHover={{ scale: 1.08, rotateY: 15, rotateX: -6 }}
              transition={{ type: "spring", stiffness: 260 }}
              style={{ transformStyle: "preserve-3d", perspective: 400 }}
              className="logo-3d absolute inset-[14px] grid place-items-center rounded-full overflow-hidden bg-white ring-1 ring-pink-200"
            >
              <img src={zizaibLogo.url} alt="Zizaib" className="size-full object-contain p-0.5" />
            </motion.span>
            <div className="absolute -inset-1 pointer-events-none">
              <CircularText text="TRUSTED*SECURED*REGISTERED*" spinDuration={18} onHover="speedUp" />
            </div>
          </div>
          <span className="leading-tight">
            <span className="block font-brand text-xl tracking-wide text-foreground">Zizaib</span>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-foreground/80">Trends know no boundaries</span>
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-5 text-sm font-medium">
          <Link
            to="/"
            className="story-link text-muted-foreground hover:text-foreground transition"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>

          {collections.map((col) => (
            <div
              key={col.id}
              className="relative"
              onMouseEnter={() => setOpenMenu(col.id)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                to="/shop"
                search={{ col: col.id }}
                aria-expanded={openMenu === col.id}
                onClick={() => setOpenMenu(null)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
              >
                {col.label}
                <ChevronDown className={`size-3.5 transition-transform ${openMenu === col.id ? "rotate-180" : ""}`} />
              </Link>
              <AnimatePresence>
                {openMenu === col.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full z-50 pt-3"
                  >
                    <div className="w-[640px] rounded-2xl border border-pink-200 bg-background p-5 shadow-xl">
                      <p className="px-1 pb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{col.blurb}</p>
                      <div className="grid grid-cols-3 gap-4">
                        {col.groups.map((grp) => (
                          <div key={grp.id}>
                            <Link
                              to="/shop"
                              search={{ col: col.id, grp: grp.id }}
                              onClick={() => setOpenMenu(null)}
                              className="block text-sm font-bold text-foreground hover:text-primary transition"
                            >
                              {grp.label}
                            </Link>
                            <ul className="mt-2 space-y-1">
                              {grp.subs.map((s) => {
                                const thumb = subThumb.get(s.id);
                                return (
                                  <li key={s.id}>
                                    <Link
                                      to="/shop"
                                      search={{ col: col.id, grp: grp.id, sub: s.id }}
                                      onClick={() => setOpenMenu(null)}
                                      className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                    >
                                      {thumb && (
                                        <img src={thumb} alt="" loading="lazy" className="size-8 rounded-md object-cover" />
                                      )}
                                      {s.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/shop"
                        search={{ col: col.id }}
                        onClick={() => setOpenMenu(null)}
                        className="mt-4 inline-block px-1 text-sm font-semibold text-primary"
                      >
                        See everything in {col.label}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {flatLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="story-link text-muted-foreground hover:text-foreground transition"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <form onSubmit={onSearch} className="hidden md:flex items-center gap-1 rounded-full bg-muted/70 px-3 py-1.5 flex-1 max-w-[180px]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="bg-transparent text-sm placeholder:text-muted-foreground outline-none flex-1 min-w-0"
            aria-label="Search products"
          />
        </form>

        <div className="flex items-center gap-1 shrink-0">
          <CurrencySwitcher />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
            aria-label="Open cart"
            className="relative rounded-full p-2.5 hover:bg-muted transition"
          >
            <span id="cart-icon" className="inline-flex">
              <ShoppingBag className="size-5" />
            </span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1.4, 1] }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <button
            className="xl:hidden rounded-full p-2.5 hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden border-t border-pink-200/80"
          >
            <div className="container-page py-4 flex flex-col gap-3">
              <form onSubmit={onSearch} className="flex items-center gap-1 rounded-full bg-muted px-3 py-2 md:hidden">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the edit…"
                  className="bg-transparent text-sm placeholder:text-muted-foreground outline-none flex-1 min-w-0"
                />
              </form>

              <Link to="/" onClick={() => setOpen(false)} className="text-foreground py-1.5 flex items-center gap-2">
                <Heart className="size-3.5 text-primary" /> Home
              </Link>

              {collections.map((col) => (
                <div key={col.id} className="border-t border-pink-200/70 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpenMenu((v) => (v === col.id ? null : col.id))}
                    className="flex w-full items-center justify-between py-1.5 text-foreground"
                  >
                    <span className="flex items-center gap-2"><Heart className="size-3.5 text-primary" /> {col.label}</span>
                    <ChevronDown className={`size-4 transition-transform ${openMenu === col.id ? "rotate-180" : ""}`} />
                  </button>
                  {openMenu === col.id && (
                    <div className="pl-6 pb-2 space-y-3">
                      {col.groups.map((grp) => (
                        <div key={grp.id}>
                          <Link
                            to="/shop"
                            search={{ col: col.id, grp: grp.id }}
                            onClick={() => setOpen(false)}
                            className="block text-sm font-semibold text-foreground"
                          >
                            {grp.label}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                            {grp.subs.map((s) => (
                              <Link
                                key={s.id}
                                to="/shop"
                                search={{ col: col.id, grp: grp.id, sub: s.id }}
                                onClick={() => setOpen(false)}
                                className="text-xs text-muted-foreground hover:text-primary"
                              >
                                {s.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {flatLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-foreground py-1.5 flex items-center gap-2">
                  <Heart className="size-3.5 text-primary" /> {l.label}
                </Link>
              ))}
              <div className="sm:hidden pt-1"><CurrencySwitcher /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
