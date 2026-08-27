import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Package, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { trackOrder } from "@/lib/orders.functions";

const search = z.object({ t: z.string().catch("").default("") });

export const Route = createFileRoute("/track")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Track your order — Zizaib" },
      { name: "description", content: "Enter your Zizaib tracking number to see live shipment status for your handmade crochet order." },
      { property: "og:title", content: "Track your Zizaib order" },
      { property: "og:description", content: "Live shipment status for your handmade crochet order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

const STAGES = ["processing", "shipped", "on_the_way", "delivered"] as const;
const STAGE_LABEL: Record<string, string> = {
  processing: "Processing at the studio",
  shipped: "Shipped",
  on_the_way: "On the way",
  delivered: "Delivered",
};

function TrackPage() {
  const { t } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(t);
  const lookup = useServerFn(trackOrder);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["track", t],
    queryFn: () => lookup({ data: { trackingNumber: t } }),
    enabled: t.trim().length >= 4,
  });

  const stageIndex = data ? Math.max(0, STAGES.indexOf(data.status as (typeof STAGES)[number])) : 0;

  return (
    <div className="container-page py-14 max-w-2xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center">Track your order</h1>
      <p className="mt-3 text-center text-muted-foreground">
        Enter the tracking number from your order confirmation to see where your parcel is.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/track", search: { t: value.trim().toUpperCase() } });
        }}
        className="mt-8 flex flex-col sm:flex-row gap-3"
      >
        <label htmlFor="tracking" className="sr-only">Tracking number</label>
        <input
          id="tracking"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. ZB260802ABC123"
          className="flex-1 rounded-full border-2 border-border bg-background px-5 py-3 min-h-12 text-base font-mono uppercase outline-none focus:border-primary"
        />
        <button type="submit" className="btn-primary justify-center">
          <Search className="size-4" /> Track
        </button>
      </form>

      {isFetching && (
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Looking up your parcel…
        </p>
      )}

      {!isFetching && t.trim().length >= 4 && (isError || data === null) && (
        <div className="card-soft mt-8 p-6 text-center">
          <Package className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No order found for “{t}”.</p>
          <p className="mt-1 text-sm text-muted-foreground">Double-check the number in your confirmation email — it starts with <span className="font-mono">ZB</span>.</p>
        </div>
      )}

      {!isFetching && data && (
        <div className="card-soft mt-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Tracking number</p>
              <p className="font-mono text-lg font-bold">{data.trackingNumber}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              {data.status === "delivered" ? <CheckCircle2 className="size-4" /> : <Truck className="size-4" />}
              {STAGE_LABEL[data.status] ?? data.status}
            </span>
          </div>

          <ol className="mt-6 space-y-4">
            {STAGES.map((s, i) => {
              const done = i <= stageIndex;
              return (
                <li key={s} className="flex items-start gap-3">
                  <span className={`mt-1 size-3.5 rounded-full ring-4 ring-background ${done ? "bg-primary" : "bg-muted"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{STAGE_LABEL[s]}</p>
                    {i === stageIndex && (
                      <p className="text-xs text-muted-foreground">Last updated {new Date(data.updatedAt).toLocaleString()}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 grid gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Destination city</span><span className="font-medium">{data.city}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span className="font-medium">{data.itemCount}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Placed on</span><span className="font-medium">{new Date(data.placedAt).toLocaleDateString()}</span></div>
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Need help? <Link to="/about" className="text-primary font-semibold underline">Contact the studio</Link>
      </p>
    </div>
  );
}