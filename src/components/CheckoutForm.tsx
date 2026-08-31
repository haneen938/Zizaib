import { useEffect, useMemo, useRef, useState } from "react";

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  postal: string;
  notes: string;
}

type Errors = Partial<Record<keyof ShippingDetails, string>>;

/* ---------------------------------------------------------------------------
 * Strict validation rules. Every rule below is mirrored server-side in
 * src/lib/orders.functions.ts — the browser copy exists only for fast feedback.
 * ------------------------------------------------------------------------- */
export const LIMITS = {
  fullName: 50,
  email: 100,
  phone: 15,
  address: 100,
  address2: 50,
  city: 50,
  postal: 10,
  notes: 500,
} as const;

// Letters (incl. accents), spaces, hyphens and apostrophes only.
const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+?[0-9 -]+$/;
const CITY_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const POSTAL_RE = /^[A-Za-z0-9][A-Za-z0-9 -]*[A-Za-z0-9]$/;
const ADDRESS_RE = /^[A-Za-z0-9 ,.\-/#]+$/;
const PO_BOX_RE = /\b(p\.?\s*o\.?\s*box|post\s*office\s*box)\b/i;

// Input sanitisers — invalid characters simply never make it into state.
const stripName = (v: string) => v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, "").replace(/\s{2,}/g, " ");
const stripCity = (v: string) => v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]/g, "").replace(/\s{2,}/g, " ");
const stripAddress = (v: string) => v.replace(/[^A-Za-z0-9 ,.\-/#]/g, "");
const stripPhone = (v: string) => {
  const plus = v.trimStart().startsWith("+") ? "+" : "";
  return (plus + v.replace(/[^0-9 -]/g, "")).slice(0, LIMITS.phone);
};
const stripPostal = (v: string) => v.replace(/[^A-Za-z0-9 -]/g, "").slice(0, LIMITS.postal);

export function CheckoutForm({
  onValid,
  values,
}: {
  onValid: (v: ShippingDetails) => void;
  values: Partial<ShippingDetails>;
}) {
  const [form, setForm] = useState<ShippingDetails>({
    fullName: values.fullName || "",
    email: values.email || "",
    phone: values.phone || "",
    address: values.address || "",
    address2: values.address2 || "",
    city: values.city || "",
    postal: values.postal || "",
    notes: values.notes || "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingDetails, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const validate = (f: ShippingDetails): Errors => {
    const e: Errors = {};

    const name = f.fullName.trim();
    if (!name) e.fullName = "Full name is required.";
    else if (name.length < 3) e.fullName = "Please enter at least 3 characters.";
    else if (name.length > LIMITS.fullName) e.fullName = `Maximum ${LIMITS.fullName} characters.`;
    else if (!NAME_RE.test(name)) e.fullName = "Letters, spaces, hyphens and apostrophes only.";

    const email = f.email.trim();
    if (!email) e.email = "Email address is required.";
    else if (email.length > LIMITS.email) e.email = `Maximum ${LIMITS.email} characters.`;
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address (e.g. name@example.com).";

    const phone = f.phone.trim();
    const digits = phone.replace(/\D/g, "");
    if (!phone) e.phone = "Phone number is required.";
    else if (!PHONE_RE.test(phone)) e.phone = "Digits, spaces, hyphens and a leading + only.";
    else if (digits.length < 10) e.phone = "Enter at least 10 digits.";
    else if (phone.length > LIMITS.phone) e.phone = `Maximum ${LIMITS.phone} characters.`;

    const addr = f.address.trim();
    if (!addr) e.address = "Address line 1 is required.";
    else if (addr.length < 5) e.address = "Please enter your full street address.";
    else if (addr.length > LIMITS.address) e.address = `Maximum ${LIMITS.address} characters.`;
    else if (!ADDRESS_RE.test(addr)) e.address = "Letters, numbers and , . - / # only.";
    else if (PO_BOX_RE.test(addr)) e.address = "We don't ship to P.O. Boxes — please give a street address.";

    const addr2 = f.address2.trim();
    if (addr2 && addr2.length > LIMITS.address2) e.address2 = `Maximum ${LIMITS.address2} characters.`;
    else if (addr2 && !ADDRESS_RE.test(addr2)) e.address2 = "Letters, numbers and , . - / # only.";

    const city = f.city.trim();
    if (!city) e.city = "City is required.";
    else if (city.length < 2) e.city = "Please enter at least 2 characters.";
    else if (city.length > LIMITS.city) e.city = `Maximum ${LIMITS.city} characters.`;
    else if (!CITY_RE.test(city)) e.city = "Letters and spaces only.";

    const postal = f.postal.trim();
    if (!postal) e.postal = "Postal / ZIP code is required.";
    else if (postal.length < 3) e.postal = "Please enter at least 3 characters.";
    else if (postal.length > LIMITS.postal) e.postal = `Maximum ${LIMITS.postal} characters.`;
    else if (!POSTAL_RE.test(postal)) e.postal = "Letters, numbers, spaces and hyphens only.";

    if (f.notes.length > LIMITS.notes) e.notes = `Order notes cannot exceed ${LIMITS.notes} characters.`;

    return e;
  };

  const liveErrors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(liveErrors).length === 0;

  const update = (k: keyof ShippingDetails, raw: string) => {
    let v = raw;
    if (k === "fullName") v = stripName(raw).slice(0, LIMITS.fullName);
    if (k === "city") v = stripCity(raw).slice(0, LIMITS.city);
    if (k === "address") v = stripAddress(raw).slice(0, LIMITS.address);
    if (k === "address2") v = stripAddress(raw).slice(0, LIMITS.address2);
    if (k === "phone") v = stripPhone(raw);
    if (k === "postal") v = stripPostal(raw);
    if (k === "email") v = raw.replace(/\s/g, "").slice(0, LIMITS.email);
    if (k === "notes") v = raw.slice(0, LIMITS.notes);
    setForm((f) => ({ ...f, [k]: v }));
  };

  const markTouched = (k: keyof ShippingDetails) => setTouched((t) => ({ ...t, [k]: true }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    if (isValid) onValid(form);
  };

  const showError = (k: keyof ShippingDetails) =>
    touched[k] || submitted ? liveErrors[k] : undefined;

  return (
    <div className="space-y-6">
      {/* Cinematic destination banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_20px_60px_-20px_rgba(0,255,204,0.35)] aspect-[16/6]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          autoPlay loop muted playsInline preload="auto"
          poster="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=60"
        >
          <source src="https://cdn.pixabay.com/video/2020/08/30/48569-454825064_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        <div className="absolute inset-0 grid place-items-center">
          <div className={`neon-zoom text-center ${form.city.trim().length >= 2 && !liveErrors.city ? "neon-zoom-in" : ""}`}>
            <div className="text-[10px] tracking-[0.5em] text-[#00ffcc]/70">DESTINATION LOCKED</div>
            <div className="mt-1 font-display text-3xl sm:text-5xl font-bold uppercase text-[#00ffcc] neon-text">
              {form.city.trim() || "—"}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl bg-zinc-950 p-5 sm:p-6 text-zinc-100 border border-white/10">
        <Field
          label="Full Name"
          placeholder="Ayesha Khan"
          autoComplete="name"
          maxLength={LIMITS.fullName}
          value={form.fullName}
          error={showError("fullName")}
          onChange={(v) => update("fullName", v)}
          onBlur={() => markTouched("fullName")}
        />

        <Field
          label="Email Address"
          type="email"
          inputMode="email"
          placeholder="name@example.com"
          autoComplete="email"
          maxLength={LIMITS.email}
          value={form.email}
          error={showError("email")}
          onChange={(v) => update("email", v)}
          onBlur={() => markTouched("email")}
        />

        <Field
          label="Phone Number"
          type="tel"
          inputMode="tel"
          placeholder="+92 300 1234567"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          value={form.phone}
          error={showError("phone")}
          onChange={(v) => update("phone", v)}
          onBlur={() => markTouched("phone")}
        />

        <Field
          label="Address Line 1"
          placeholder="House 12, Street 4, DHA Phase 5"
          autoComplete="address-line1"
          maxLength={LIMITS.address}
          value={form.address}
          error={showError("address")}
          onChange={(v) => update("address", v)}
          onBlur={() => markTouched("address")}
        />

        <Field
          label="Address Line 2"
          optional
          placeholder="Apartment, suite, floor (optional)"
          autoComplete="address-line2"
          maxLength={LIMITS.address2}
          value={form.address2}
          error={showError("address2")}
          onChange={(v) => update("address2", v)}
          onBlur={() => markTouched("address2")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="City"
            placeholder="Karachi"
            autoComplete="address-level2"
            maxLength={LIMITS.city}
            value={form.city}
            error={showError("city")}
            onChange={(v) => update("city", v)}
            onBlur={() => markTouched("city")}
          />
          <Field
            label="Postal / ZIP Code"
            placeholder="75500"
            autoComplete="postal-code"
            maxLength={LIMITS.postal}
            value={form.postal}
            error={showError("postal")}
            onChange={(v) => update("postal", v)}
            onBlur={() => markTouched("postal")}
          />
        </div>

        <label className="block">
          <span className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Order Notes <span className="normal-case text-zinc-500">(optional)</span>
            </span>
            <span className={`text-[10px] tabular-nums ${form.notes.length >= LIMITS.notes ? "text-[#ff5566]" : "text-zinc-500"}`}>
              {form.notes.length} / {LIMITS.notes}
            </span>
          </span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            onBlur={() => markTouched("notes")}
            rows={3}
            placeholder="Gift-wrapping requests, delivery instructions, etc."
            maxLength={LIMITS.notes}
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#00ffcc]/60 focus:ring-2 focus:ring-[#00ffcc]/25 resize-none"
          />
          {showError("notes") && <p className="mt-1 text-xs font-medium text-[#ff5566]">{showError("notes")}</p>}
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className="mt-3 w-full rounded-2xl bg-[#00ffcc] px-6 py-3 min-h-12 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-110 active:scale-[0.98] shadow-[0_0_24px_rgba(0,255,204,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {isValid ? "Continue to payment →" : "Fill required fields to continue"}
        </button>
      </form>

      <style>{`
        .neon-text {
          text-shadow: 0 0 8px rgba(0,255,204,0.75), 0 0 22px rgba(0,255,204,0.45), 0 0 44px rgba(0,255,204,0.25);
          letter-spacing: 0.28em;
        }
        .neon-zoom { opacity: 0; transform: scale(0.35); transition: opacity 700ms ease, transform 900ms cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
        .neon-zoom-in { opacity: 1; transform: scale(1); }
      `}</style>
    </div>
  );
}

function Field({
  label, value, error, onChange, onBlur, placeholder, type = "text", autoComplete, maxLength, inputMode, optional,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  inputMode?: "text" | "tel" | "email" | "numeric";
  optional?: boolean;
}) {
  const invalid = !!error;
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal text-zinc-500">(optional)</span>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid}
        className={`mt-1 w-full rounded-xl border bg-zinc-900 px-4 py-3 min-h-12 text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition ${
          invalid
            ? "border-[#ff5566] ring-2 ring-[#ff5566]/25"
            : "border-white/10 focus:border-[#00ffcc]/60 focus:ring-2 focus:ring-[#00ffcc]/25"
        }`}
      />
      {invalid && <p className="mt-1 text-xs font-medium text-[#ff5566]">{error}</p>}
    </label>
  );
}
