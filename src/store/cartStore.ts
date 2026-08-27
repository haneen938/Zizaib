// Zustand cart with localStorage persistence. Prices in PKR.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  color?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (
    product: Product,
    opts?: { color?: string; image?: string; qty?: number },
  ) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const safeStorage = () =>
  typeof window === "undefined"
    ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
    : window.localStorage;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (product, opts = {}) =>
        set((state) => {
          const variant = product.variants.find((v) => v.name === opts.color) ?? product.variants[0];
          const color = opts.color ?? variant.name;
          const image = opts.image ?? variant.image;
          const qty = opts.qty ?? 1;
          const key = `${product.id}__${color}`;
          const existing = state.items.find((i) => i.id === key);
          if (existing) {
            return {
              items: state.items.map((i) => (i.id === key ? { ...i, qty: i.qty + qty } : i)),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: key,
                productId: product.id,
                title: product.title,
                price: product.price,
                image,
                color,
                qty,
              },
            ],
            isOpen: true,
          };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "yarn-charm-cart-v1",
      storage: createJSONStorage(() => safeStorage() as Storage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export const useCartSubtotal = () =>
  useCart((s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0));
export const useCartCount = () =>
  useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
