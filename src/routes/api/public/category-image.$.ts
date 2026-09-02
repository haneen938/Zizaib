// Streams a category picture out of the private storage bucket.
// The bucket stays private; only these read-only bytes are exposed.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/category-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params._splat ?? "").replace(/^\/+/, "");
        if (!path || path.includes("..") || !/^[A-Za-z0-9/_.-]+$/.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage.from("category-images").download(path);
          if (error || !data) return new Response("Not found", { status: 404 });
          return new Response(await data.arrayBuffer(), {
            headers: {
              "content-type": data.type || "image/jpeg",
              "cache-control": "public, max-age=3600",
            },
          });
        } catch (err) {
          console.error("[category-image] download failed", err);
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
