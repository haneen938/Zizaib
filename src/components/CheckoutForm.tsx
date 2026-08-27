import { useEffect, useMemo, useRef, useState } from "react";

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  notes: string;
}

type Errors = Partial<Record<keyof ShippingDetails, string>>;

// Strict validation regexes (also enforced server-side in a real backend).
const FULLNAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ'.-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'.-]+)+$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[0-9\s-]{10,20}$/; // 10–15 digits after stripping separators
const CITY_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40}$/;
// US 5-digit, US ZIP+4, UK, or Canadian postal codes
const POSTAL_RE = /^(?:\d{5}(?:-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d|[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|\d{4,6})$/i;
const ADDRESS_RE = /^[A-Za-z0-9 ,.\-/#]{10,120}$/;
const PO_BOX_RE = /\b(p\.?\s*o\.?\s*box|post\s*office\s*box)\b/i;

const stripToLetters = (v: string) => v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, "");
const stripToAddress = (v: string) => v.replace(/[^A-Za-z0-9 ,.\-/#]/g, "");
const stripToPhone = (v: string) => v.replace(/[^0-9\s-]/g, "").slice(0, 20);

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
    city: values.city || "",
    postal: values.postal || "",
    notes: values.notes || "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingDetails, boolean>>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const validate = (f: ShippingDetails): Errors => {
    const e: Errors = {};
    if (!FULLNAME_RE.test(f.fullName.trim()))
      e.fullName = "Please enter your full name (letters only).";
    if (!EMAIL_RE.test(f.email.trim()))
      e.email = "Please enter a valid email address (e.g., name@example.com).";
    const digits = f.phone.replace(/\D/g, "");
    if (!PHONE_RE.test(f.phone.trim()) || digits.length < 10 || digits.length > 15)
      e.phone = "Please enter a valid phone number (10–15 digits only).";
    if (!ADDRESS_RE.test(f.address.trim()) || f.address.trim().length < 10)
      e.address = "Please enter a valid shipping address.";
    else if (PO_BOX_RE.test(f.address))
      e.address = "Sorry, we don't ship to P.O. Boxes — please provide a street address.";
    if (!CITY_RE.test(f.city.trim())) e.city = "Please enter your city.";
    if (!POSTAL_RE.test(f.postal.trim())) e.postal = "Please enter a valid postal/ZIP code.";
    if (f.notes.length > 250) e.notes = "Order notes cannot exceed 250 characters.";
    return e;
  };

  const liveErrors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(liveErrors).length === 0;

  const update = (k: keyof ShippingDetails, raw: string) => {
    let v = raw;
    if (k === "fullName" || k === "city") v = stripToLetters(raw);
    if (k === "address") v = stripToAddress(raw);
    if (k === "phone") v = stripToPhone(raw);
    if (k === "notes") v = raw.slice(0, 250);
    setForm((f) => ({ ...f, [k]: v }));
  };

  const markTouched = (k: keyof ShippingDetails) =>
    setTouched((t) => ({ ...t, [k]: true }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    setTouched({
      fullName: true, email: true, phone: true, address: true, city: true, postal: true, notes: true,
    });
    if (Object.keys(e).length === 0) onValid(form);
  };

  const showError = (k: keyof ShippingDetails) =>
    (touched[k] || errors[k]) ? liveErrors[k] : undefined;

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
          <div className={`neon-zoom text-center ${CITY_RE.test(form.city.trim()) ? "neon-zoom-in" : ""}`}>
            <div className="text-[10px] tracking-[0.5em] text-[#00ffcc]/70">DESTINATION LOCKED</div>
            <div className="mt-1 font-display text-3xl sm:text-5xl font-bold uppercase text-[#00ffcc] neon-text">
              {form.city.trim() || "—"}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl bg-zinc-950 p-6 text-zinc-100 border border-white/10">
        <Field
          label="Full Name"
          placeholder="Ayesha Khan"
          autoComplete="name"
          value={form.fullName}
          error={showError("fullName")}
          onChange={(v) => update("fullName", v)}
          onBlur={() => markTouched("fullName")}
        />

        <Field
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          error={showError("email")}
          onChange={(v) => update("email", v)}
          onBlur={() => markTouched("email")}
        />

        <Field
          label="Phone Number"
          type="tel"
          placeholder="0300 1234567"
          autoComplete="tel"
          value={form.phone}
          error={showError("phone")}
          onChange={(v) => update("phone", v)}
          onBlur={() => markTouched("phone")}
        />

        <Field
          label="Shipping Address"
          placeholder="House 12, Street 4, DHA Phase 5"
          autoComplete="street-address"
          value={form.address}
          error={showError("address")}
          onChange={(v) => update("address", v)}
          onBlur={() => markTouched("address")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="City"
            placeholder="Karachi"
            autoComplete="address-level2"
            value={form.city}
            error={showError("city")}
            onChange={(v) => update("city", v)}
            onBlur={() => markTouched("city")}
          />
          <Field
            label="Postal / ZIP Code"
            placeholder="75500"
            autoComplete="postal-code"
            value={form.postal}
            error={showError("postal")}
            onChange={(v) => update("postal", v)}
            onBlur={() => markTouched("postal")}
          />
        </div>

        <label className="block group">
          <span className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Order Notes <span className="normal-case text-zinc-500">(optional)</span>
            </span>
            <span className="text-[10px] text-zinc-500">{form.notes.length}/250</span>
          </span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            onBlur={() => markTouched("notes")}
            rows={3}
            placeholder="Any gift-wrapping requests, delivery instructions, etc."
            maxLength={250}
            className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#00ffcc]/60 focus:ring-2 focus:ring-[#00ffcc]/25 resize-none"
          />
          {showError("notes") && (
            <p className="mt-1 text-xs font-medium text-[#ff5566]">{showError("notes")}</p>
          )}
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className="mt-3 w-full rounded-2xl bg-[#00ffcc] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-110 active:scale-[0.98] shadow-[0_0_24px_rgba(0,255,204,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
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
  label, value, error, onChange, onBlur, placeholder, type = "text", autoComplete,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  const invalid = !!error;
  return (
    <label className="block group">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid}
        className={`mt-1 w-full rounded-xl border bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition
          ${invalid
            ? "border-[#8b0000] ring-2 ring-[#8b0000]/40"
            : "border-white/10 focus:border-[#00ffcc]/60 focus:ring-2 focus:ring-[#00ffcc]/25"}`}
      />
      <div className={`grid overflow-hidden transition-all duration-300 ${invalid ? "grid-rows-[1fr] mt-1.5" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0">
          <p className="text-xs font-medium text-[#ff5566]">{error}</p>
        </div>
      </div>
    </label>
  );
}
