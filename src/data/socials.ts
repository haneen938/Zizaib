import { Instagram, Music2, Pin, MessageSquare, type LucideIcon } from "lucide-react";

export type Social = { label: string; href: string; Icon: LucideIcon };

export const socials: Social[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/zizaib2026?igsh=MTZncXRiNHA3djhyNA==",
    Icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@zizaib8?_r=1&_t=ZS-986vle6odtN",
    Icon: Music2,
  },
  { label: "Pinterest", href: "https://pin.it/6vZPCJ9Hq", Icon: Pin },
  { label: "Reddit", href: "https://www.reddit.com/u/ZIZAIB/s/52g0cRlQeX", Icon: MessageSquare },
];
