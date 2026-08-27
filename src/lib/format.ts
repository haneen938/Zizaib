// Currency-aware price formatter. Prices are stored in PKR.
// Prefer `useMoney()` inside components for reactivity; `pkr()` is kept as a
// non-reactive fallback that reads the currently selected currency.
import { formatMoney, useCurrency, useMoney } from "@/store/currencyStore";

export function pkr(n: number): string {
  return formatMoney(n, useCurrency.getState().code);
}

export { useMoney };
