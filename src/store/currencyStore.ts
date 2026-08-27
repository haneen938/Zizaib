// Global currency store. Prices are stored in PKR; converted for display.
// Persists user choice, auto-detects on first visit via IP geolocation.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";

export type CurrencyCode = "PKR" | "USD";

interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string; // shown next to the globe
  rate: number; // multiplier applied to PKR base price
  fractionDigits: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  PKR: { code: "PKR", symbol: "Rs.", label: "PKR (Rs.)", rate: 1, fractionDigits: 0 },
  USD: { code: "USD", symbol: "$", label: "USD ($)", rate: 1 / 280, fractionDigits: 2 },
};

interface CurrencyState {
  code: CurrencyCode;
  autoDetected: boolean;
  setCurrency: (code: CurrencyCode) => void;
  markDetected: () => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      code: "USD",
      autoDetected: false,
      setCurrency: (code) => set({ code, autoDetected: true }),
      markDetected: () => set({ autoDetected: true }),
    }),
    {
      name: "zizaib-currency",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function formatMoney(pkrAmount: number, code: CurrencyCode): string {
  const meta = CURRENCIES[code];
  const converted = pkrAmount * meta.rate;
  const value =
    meta.fractionDigits === 0
      ? Math.round(converted).toLocaleString("en-US")
      : converted.toFixed(meta.fractionDigits);
  return code === "PKR" ? `${meta.symbol} ${value}` : `${meta.symbol}${value}`;
}

export function useMoney() {
  const code = useCurrency((s) => s.code);
  return (pkrAmount: number) => formatMoney(pkrAmount, code);
}

// Runs once on the client to auto-select PKR for Pakistan visitors, USD otherwise.
export function useAutoDetectCurrency() {
  const autoDetected = useCurrency((s) => s.autoDetected);
  useEffect(() => {
    if (autoDetected) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (!res.ok) throw new Error("geo failed");
        const data = (await res.json()) as { country_code?: string };
        if (cancelled) return;
        const next: CurrencyCode = data.country_code === "PK" ? "PKR" : "USD";
        useCurrency.setState({ code: next, autoDetected: true });
      } catch {
        if (!cancelled) useCurrency.setState({ autoDetected: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [autoDetected]);
}
