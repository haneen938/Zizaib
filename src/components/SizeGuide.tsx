import { useState } from "react";
import { Ruler, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { JACKET_SIZE_CHART, SIZE_CHART_IMAGE } from "@/data/sizing";

/** Pill row for picking a garment size. */
export function SizePicker({
  sizes,
  value,
  onChange,
  error,
}: {
  sizes: readonly string[];
  value: string | null;
  onChange: (size: string) => void;
  error?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-semibold mb-2">
        Size:{" "}
        <span className="font-normal text-muted-foreground">
          {value ?? "please select"}
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            aria-pressed={value === s}
            className={`min-h-11 rounded-full border-2 px-4 text-sm font-bold transition active:scale-95 ${
              value === s
                ? "border-primary bg-primary text-primary-foreground"
                : error
                  ? "border-destructive/60 bg-card text-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm font-semibold text-destructive">
          Please choose a size before adding this piece to your basket.
        </p>
      )}
    </div>
  );
}

/** Collapsible measurement chart shown under the product image. */
export function SizeChart() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 card-soft overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full min-h-12 items-center justify-between gap-3 px-5 py-3 text-left font-semibold"
      >
        <span className="inline-flex items-center gap-2">
          <Ruler className="size-4 shrink-0 text-primary" /> Men&apos;s jacket size chart
        </span>
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <caption className="sr-only">Men&apos;s jacket measurements in inches</caption>
                  <thead className="bg-muted">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-bold">Size</th>
                      <th scope="col" className="px-3 py-2 font-bold">Body chest</th>
                      <th scope="col" className="px-3 py-2 font-bold">Jacket chest</th>
                      <th scope="col" className="px-3 py-2 font-bold">Shoulder</th>
                      <th scope="col" className="px-3 py-2 font-bold">Sleeves</th>
                      <th scope="col" className="px-3 py-2 font-bold">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JACKET_SIZE_CHART.map((row) => (
                      <tr key={row.size} className="border-t border-border">
                        <th scope="row" className="px-3 py-2 font-semibold">{row.size}</th>
                        <td className="px-3 py-2">{row.bodyChest}</td>
                        <td className="px-3 py-2">{row.jacketChest}</td>
                        <td className="px-3 py-2">{row.shoulder}</td>
                        <td className="px-3 py-2">{row.sleeves}</td>
                        <td className="px-3 py-2">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Customized tailor-fit service available based on your own body measurements — message the studio.
              </p>

              <h3 className="mt-4 font-display text-lg font-bold">What size should I pick?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Wrap a measuring tape under your armpits at the fullest part of your chest. If your body chest is
                37&quot;–38&quot;, your jacket chest is 21&quot; single side — always at least 4&quot;–5&quot; more than
                your body chest.
              </p>

              <img
                src={SIZE_CHART_IMAGE}
                alt="Men's jacket size chart with body chest, jacket chest, shoulder, sleeve and length measurements"
                loading="lazy"
                className="mt-4 w-full rounded-2xl border border-border"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
