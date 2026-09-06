// Category / subcategory pictures — public reads plus admin-only writes.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validateReviewImage, safeStorageExtension } from "./payment-validation";
import { collectionIds, groupIds, subcategoryIds } from "@/data/taxonomy";

export type CategoryImageRow = {
  id: string;
  scope: "collection" | "group" | "subcategory";
  ref_key: string;
  image_url: string;
  alt: string | null;
  updated_at: string;
};

const BUCKET = "category-images";

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

/** Public: every saved category picture, keyed as `scope:ref_key` by the caller. */
export const listCategoryImages = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await publicClient()
      .from("category_images")
      .select("id, scope, ref_key, image_url, alt, updated_at")
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []) as CategoryImageRow[];
  } catch (err) {
    // A picture table outage must never take the storefront down.
    console.error("[category-images] list failed", err);
    return [] as CategoryImageRow[];
  }
});

const refKeys = new Set<string>([...collectionIds, ...groupIds, ...subcategoryIds]);

const saveInput = z
  .object({
    scope: z.enum(["collection", "group", "subcategory"]),
    refKey: z.string().trim().min(1).max(80),
    alt: z.string().trim().max(160).optional(),
    imageUrl: z.string().trim().max(2000).optional(),
    upload: z
      .object({
        fileName: z.string().trim().min(1).max(120),
        contentType: z.string().trim().max(80),
        dataBase64: z.string().max(8_000_000),
      })
      .optional(),
  })
  .refine((v) => refKeys.has(v.refKey), { message: "Unknown category" })
  .refine((v) => Boolean(v.imageUrl) || Boolean(v.upload), { message: "Provide an image link or a file" });

export type SaveResult = { ok: true; row: CategoryImageRow } | { ok: false; error: string };

async function assertAdmin(context: { supabase: ReturnType<typeof publicClient>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const saveCategoryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => saveInput.parse(data))
  .handler(async ({ data, context }): Promise<SaveResult> => {
    try {
      await assertAdmin(context as never);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      let url = data.imageUrl?.trim() ?? "";

      if (data.upload) {
        const sniffed = validateReviewImage(data.upload);
        if (!sniffed) return { ok: false, error: "Only real JPG or PNG images can be uploaded." };
        const bytes = Uint8Array.from(
          atob((data.upload.dataBase64.split(",").pop() ?? "").replace(/\s/g, "")),
          (c) => c.charCodeAt(0),
        );
        const path = `${data.scope}/${data.refKey}-${Date.now()}.${safeStorageExtension(sniffed)}`;
        const { error: upErr } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(path, bytes, { contentType: sniffed, upsert: true });
        if (upErr) return { ok: false, error: upErr.message };
        url = `/api/public/category-image/${path}`;
      } else if (!/^https:\/\/[^\s]+$/i.test(url)) {
        return { ok: false, error: "Image links must be a full https:// URL." };
      }

      const { data: row, error } = await supabaseAdmin
        .from("category_images")
        .upsert(
          { scope: data.scope, ref_key: data.refKey, image_url: url, alt: data.alt ?? null },
          { onConflict: "scope,ref_key" },
        )
        .select("id, scope, ref_key, image_url, alt, updated_at")
        .single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, row: row as CategoryImageRow };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save that image.";
      console.error("[category-images] save failed", message);
      return { ok: false, error: message === "Forbidden" ? "Admins only." : "Could not save that image." };
    }
  });

export const deleteCategoryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ scope: z.enum(["collection", "group", "subcategory"]), refKey: z.string().trim().min(1).max(80) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<{ ok: boolean; error?: string }> => {
    try {
      await assertAdmin(context as never);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin
        .from("category_images")
        .delete()
        .eq("scope", data.scope)
        .eq("ref_key", data.refKey);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (err) {
      console.error("[category-images] delete failed", err);
      return { ok: false, error: "Could not remove that image." };
    }
  });

/** Cheap check the admin panel uses to decide what to render. */
export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });
