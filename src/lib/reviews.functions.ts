import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { safeStorageExtension, validateReviewImage } from "./payment-validation";
import { throttle, humanDuration, REVIEW_WINDOWS } from "./rate-limit.server";



export type ReviewRow = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  image_urls: string[];
};

const reviewInput = z.object({
  productId: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(80).default("Anonymous"),
  email: z.string().trim().email().max(255),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(2000),
  images: z
    .array(
      z.object({
        fileName: z.string().trim().min(1).max(120),
        contentType: z.string().trim().max(80),
        dataBase64: z.string().max(8_000_000),
      }),
    )
    .max(5)
    .optional()
    .default([]),
});

function client() {
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

export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((data: { productId: string }) => z.object({ productId: z.string().trim().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { data: rows, error } = await client()
      .from("product_reviews")
      .select("id, product_id, name, rating, comment, created_at, image_urls")
      .eq("product_id", data.productId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ReviewRow[];
  });

export type AddReviewResult = { ok: true; review: ReviewRow } | { ok: false; error: string };

export const addReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reviewInput.parse(data))
  .handler(async ({ data }): Promise<AddReviewResult> => {
    const wait = throttle("review", REVIEW_WINDOWS);
    if (wait !== null) {
      return {
        ok: false,
        error: `Thanks for sharing! You've posted a couple of reviews just now, so please come back in about ${humanDuration(
          wait,
        )} to add another one.`,
      };
    }

    const imageUrls: string[] = [];

    if (data.images.length) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      // Folder name is sanitized: a product id like "../../receipts" must not
      // let an uploader write outside its own folder.
      const folder = data.productId.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100) || "unknown";
      for (const img of data.images.slice(0, 5)) {
        // Real bytes decide the type — a renamed .exe or .svg is rejected here.
        const sniffed = validateReviewImage(img);
        if (!sniffed) continue;
        const raw = img.dataBase64.split(",").pop() ?? "";
        const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
        const path = `${folder}/${crypto.randomUUID()}.${safeStorageExtension(sniffed)}`;
        const up = await supabaseAdmin.storage
          .from("review-images")
          .upload(path, bytes, { contentType: sniffed, upsert: true });
        if (up.error) continue;
        const signed = await supabaseAdmin.storage
          .from("review-images")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
        if (signed.data?.signedUrl) imageUrls.push(signed.data.signedUrl);
      }
    }


    const { data: row, error } = await client()
      .from("product_reviews")
      .insert({
        product_id: data.productId,
        name: data.name,
        email: data.email,
        rating: data.rating,
        comment: data.comment,
        image_urls: imageUrls,
      })
      .select("id, product_id, name, rating, comment, created_at, image_urls")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, review: row as ReviewRow };
  });