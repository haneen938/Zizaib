// Single source of truth for shipping rules, shared by the checkout UI and the
// server order handler so the two can never drift apart.
export const SHIPPING_PK = 250; // PKR flat-rate across Pakistan
export const FREE_SHIP_THRESHOLD = 5000;

export function shippingFor(subtotal: number, itemCount: number): number {
  if (itemCount === 0 || subtotal >= FREE_SHIP_THRESHOLD) return 0;
  return SHIPPING_PK;
}
