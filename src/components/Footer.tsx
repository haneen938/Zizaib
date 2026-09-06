const zizaibLogo = { url: "/photos/brand/zizaib-z-logo.png" };
import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Users } from "lucide-react";
import { socials } from "@/data/socials";
import { WHATSAPP_COMMUNITY_LINK } from "@/components/WhatsAppWidget";



export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="container-page py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="logo-3d grid place-items-center size-12 rounded-2xl overflow-hidden bg-white ring-1 ring-foreground/15">
              <img src={zizaibLogo.url} alt="Zizaib" className="size-full object-contain p-1" />
            </span>
            <span className="leading-tight">
              <span className="block font-brand text-lg text-foreground">Zizaib</span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Wear the moment.</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Zizaib is your ultimate fashion destination in Pakistan. If it's trending, you'll get it here — the latest styles, drops and wardrobe essentials, curated for you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                aria-label={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-card border border-border p-2 hover:bg-muted hover:text-primary transition"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">Shop All</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-foreground">New Arrivals</Link></li>
            <li><Link to="/best-sellers" className="hover:text-foreground">Best Sellers</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Customer Care</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Pre-payment only (cards & bank transfer)</li>
            <li>Shipping across Pakistan</li>
            <li>Hand wash, lay flat to dry</li>
            <li>5–7 day production for custom orders</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Reach us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="size-4" /> Zizaib71@gmail.com</li>
            <li>
              <a
                href="https://wa.me/923124855863"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <MessageCircle className="size-4" /> WhatsApp: +92&nbsp;312&nbsp;4855863
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_COMMUNITY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Users className="size-4" /> Join our WhatsApp community
              </a>
            </li>
          </ul>

          <p className="mt-3 text-xs text-muted-foreground">Replies within 24 hrs, Mon–Sat.</p>
        </div>
      </div>
      <div className="container-page py-6 text-xs text-muted-foreground border-t border-border/60 flex justify-between flex-wrap gap-2">
        <span>© 2026 Zizaib. All rights reserved.</span>
        <span>Pre-payment only · No COD</span>
      </div>
    </footer>
  );
}
