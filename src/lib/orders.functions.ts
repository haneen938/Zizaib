import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { products } from "@/data/products";
import { FREE_SHIP_THRESHOLD, SHIPPING_PK } from "./pricing";
import {
  GENERIC_ERROR,
  RECEIPT_MAX_BYTES,
  validateProvider,
  validateSenderName,
  validateTransactionId,
  validateReceiptPayload,
  sniffReceiptType,
  safeStorageExtension,
} from "./payment-validation";
import { throttle, humanDuration, ORDER_WINDOWS } from "./rate-limit.server";




const itemSchema = z.object({
  id: z.string().max(120),
  productId: z.string().max(120).optional(),
  title: z.string().max(160),
  qty: z.number().int().positive().max(99),
  price: z.number().nonnegative(),
  color: z.string().max(60).optional(),
  size: z.string().max(20).optional(),
});

const orderInput = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(60),
  postal: z.string().trim().max(20).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
  method: z.enum(["card", "bank", "cash"]),
  total: z.number().nonnegative().max(10_000_000),
  items: z.array(itemSchema).min(1).max(50),
  cash: z
    .object({
      senderName: z.string().trim().min(2).max(80),
      referenceId: z.string().trim().min(3).max(60),
      transferDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
      bankName: z.string().trim().min(2).max(80),
      receipt: z
        .object({
          fileName: z.string().trim().min(1).max(120),
          contentType: z.string().trim().max(80),
          dataBase64: z.string().max(6_000_000),
        })
        .optional(),
    })
    .optional(),
});

export type OrderInput = z.input<typeof orderInput>;

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function makeTracking() {
  const d = new Date();
  const stamp = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  let rand = "";
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 6; i++) rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `ZB${stamp}${rand}`;
}

export type PlaceOrderResult =
  | { ok: true; trackingNumber: string; method: "card" | "bank" | "cash"; total: number; placedAt: string }
  | { ok: false; error: string };

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderInput.parse(data))
  .handler(async ({ data }): Promise<PlaceOrderResult> => {
    const wait = throttle("order", ORDER_WINDOWS);
    if (wait !== null) {
      return {
        ok: false,
        error: `You've placed a few orders in a row already. Please wait about ${humanDuration(
          wait,
        )} before sending another one — if this looks like a mistake, WhatsApp us and we'll finish the order for you.`,
      };
    }

    const supabase = publicClient();
    const trackingNumber = makeTracking();


    // Server-side anti-junk enforcement for bank/wallet transfers.
    if (data.method === "bank" || data.method === "cash") {
      const c = data.cash;
      if (!c) return { ok: false, error: GENERIC_ERROR };
      const raw = c.receipt?.dataBase64.split(",").pop() ?? "";
      const size = Math.floor((raw.length * 3) / 4);
      const bad =
        validateProvider(c.bankName) ||
        validateSenderName(c.senderName) ||
        validateTransactionId(c.referenceId) ||
        validateReceiptPayload(c.receipt);
      if (bad || size > RECEIPT_MAX_BYTES) return { ok: false, error: GENERIC_ERROR };
    }

    // Prices and totals are recomputed from the server catalog — never trusted
    // from the browser, otherwise a tampered request could buy at any price.
    // Cart line ids look like "<productId>__<colour>", so always resolve the
    // catalog entry from the product id (falling back to the line-id prefix).
    const missing: string[] = [];
    const priced = data.items.map((item) => {
      const productId = item.productId ?? item.id.split("__")[0];
      const product =
        products.find((p) => p.id === productId) ?? products.find((p) => p.id === item.id);
      if (!product) {
        missing.push(item.title);
        return null;
      }
      return { id: product.id, title: product.title, qty: item.qty, price: product.price, color: item.color, size: item.size };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    if (missing.length > 0) {
      return {
        ok: false,
        error: `These items are no longer available: ${missing.join(", ")}. Please remove them from your cart and try again.`,
      };
    }
    const subtotal = priced.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_PK;
    const total = subtotal + shipping;

    let receiptPath: string | null = null;
    if (data.cash?.receipt) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const raw = data.cash.receipt.dataBase64.split(",").pop() ?? "";
      const sniffed = sniffReceiptType(raw);
      if (!sniffed) return { ok: false, error: GENERIC_ERROR };
      const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
      // Key built from server-generated values only (no user filename).
      const path = `${trackingNumber}/receipt.${safeStorageExtension(sniffed)}`;
      const { error } = await supabaseAdmin.storage
        .from("receipts")
        .upload(path, bytes, { contentType: sniffed, upsert: true });
      if (!error) receiptPath = path;
    }

    const { error } = await supabase.from("orders").insert({
      tracking_number: trackingNumber,
      status: "processing",
      customer_name: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postal: data.postal || null,
      notes: data.notes || null,
      payment_method: data.method,
      total,
      items: priced,

      cash_sender_name: data.cash?.senderName ?? null,
      cash_reference_id: data.cash?.referenceId ?? null,
      cash_transfer_date: data.cash?.transferDate ?? null,
      cash_bank_name: data.cash?.bankName ?? null,
      cash_receipt_url: receiptPath,
    });
    if (error) {
      console.error("order insert failed", error);
      return { ok: false, error: "We couldn't save your order just now. Please try again, or WhatsApp us and we'll finish it for you." };
    }

    // Read the order back through the public tracking RPC so we only tell the
    // customer "order placed" once the row is really in the database and
    // carries the status we expect. A silent write that never landed is worse
    // than a visible failure right after payment.
    const verified = await verifySavedOrder(supabase, trackingNumber);
    if (!verified) {
      console.error("order verification failed", { trackingNumber });
      return {
        ok: false,
        error:
          `Your payment details went through, but we couldn't confirm the order was saved. ` +
          `Please don't pay again — WhatsApp us with reference ${trackingNumber} and we'll finish it for you.`,
      };
    }
    if (verified.status !== "processing") {
      console.warn("order saved with unexpected status", { trackingNumber, status: verified.status });
    }

    return { ok: true, trackingNumber, method: data.method, total, placedAt: new Date().toISOString() };
  });

type SupabaseLike = ReturnType<typeof publicClient>;

// Small retry loop: read replicas can lag a beat behind the insert.
async function verifySavedOrder(
  supabase: SupabaseLike,
  trackingNumber: string,
): Promise<{ status: string } | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase.rpc("track_order", { _tracking_number: trackingNumber });
    if (!error) {
      const row = (data ?? [])[0];
      if (row) return { status: row.status };
    } else {
      console.error("order verification query failed", error);
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}


export type TrackingResult = {
  trackingNumber: string;
  status: string;
  city: string;
  itemCount: number;
  placedAt: string;
  updatedAt: string;
} | null;

export const trackOrder = createServerFn({ method: "GET" })
  .inputValidator((data: { trackingNumber: string }) =>
    z.object({ trackingNumber: z.string().trim().min(4).max(40) }).parse(data),
  )
  .handler(async ({ data }): Promise<TrackingResult> => {
    const { data: rows, error } = await publicClient().rpc("track_order", {
      _tracking_number: data.trackingNumber,
    });
    if (error) throw new Error(error.message);
    const row = (rows ?? [])[0];
    if (!row) return null;
    return {
      trackingNumber: row.tracking_number,
      status: row.status,
      city: row.city,
      itemCount: row.item_count,
      placedAt: row.placed_at,
      updatedAt: row.updated_at,
    };
  });