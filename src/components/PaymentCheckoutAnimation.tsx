import { useMemo, useRef, useState } from "react";
import { Lock, CheckCircle, ShoppingBag, Truck, CreditCard, Landmark, Copy, Check, Wallet, Upload, FileText, RefreshCw, X, Loader2 } from "lucide-react";
import { useMoney } from "@/lib/format";
import { buildReceiptPreview, type ReceiptPreview } from "@/lib/receipt-preview";
import {
  GENERIC_ERROR,
  PAYMENT_PROVIDERS,
  validateProvider,
  validateReceiptMeta,
  validateSenderName,
  validateTransactionId,
} from "@/lib/payment-validation";


type PaymentMethod = "card" | "bank";

export type CashTransferDetails = {
  senderName: string;
  referenceId: string;
  transferDate: string;
  bankName: string;
  receipt?: { fileName: string; contentType: string; dataBase64: string };
};

type Props = {
  amount: number;
  onPay: (method: PaymentMethod, cash?: CashTransferDetails) => void;
};

export default function PaymentCheckoutAnimation({ amount, onPay }: Props) {
  const money = useMoney();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<"form" | "processing" | "success">("form");
  const [errors, setErrors] = useState({ name: false, card: false, expiry: false, cvv: false });
  const [copied, setCopied] = useState(false);
  const [transfer, setTransfer] = useState({ provider: "", senderName: "", referenceId: "" });
  const [receipt, setReceipt] = useState<
    { fileName: string; contentType: string; dataBase64: string; size: number } | null
  >(null);
  const [receiptError, setReceiptError] = useState<string>("");
  const [preview, setPreview] = useState<ReceiptPreview | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const receiptInput = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const transferErrors = useMemo(
    () => ({
      provider: validateProvider(transfer.provider),
      senderName: validateSenderName(transfer.senderName),
      referenceId: validateTransactionId(transfer.referenceId),
      receipt: receiptError || validateReceiptMeta(receipt),
    }),
    [transfer, receipt, receiptError],
  );
  const transferValid = !Object.values(transferErrors).some(Boolean);
  const showErr = (k: keyof typeof transferErrors) => (touched[k] ? transferErrors[k] : undefined);

  const cardDigits = card.replace(/\D/g, "");
  const brand = detectBrand(cardDigits);

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) =>
    val.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{0,2})/, (_, a, b) => (b ? `${a}/${b}` : a));

  const clearReceipt = (message = "") => {
    setReceipt(null);
    setPreview(null);
    setPreviewing(false);
    setReceiptError(message);
    if (receiptInput.current) receiptInput.current.value = "";
  };

  const handleReceipt = (file: File | undefined) => {
    setTouched((t) => ({ ...t, receipt: true }));
    if (!file) {
      clearReceipt(GENERIC_ERROR);
      return;
    }
    const meta = { fileName: file.name, contentType: file.type, size: file.size };
    const err = validateReceiptMeta(meta);
    if (err) {
      clearReceipt(err);
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const contentType = file.type || "image/jpeg";
      const dataBase64 = String(reader.result);
      setReceiptError("");
      setReceipt({ ...meta, contentType, dataBase64 });
      setPreview(null);
      setPreviewing(true);
      try {
        setPreview(await buildReceiptPreview(dataBase64, contentType));
      } catch {
        setPreview(null);
      } finally {
        setPreviewing(false);
      }
    };
    reader.onerror = () => clearReceipt(GENERIC_ERROR);
    reader.readAsDataURL(file);
  };


  const handlePay = () => {
    if (method === "bank") {
      setTouched({ provider: true, senderName: true, referenceId: true, receipt: true });
      if (!transferValid || !receipt) return;
      const payload = {
        senderName: transfer.senderName.trim().replace(/\s+/g, " "),
        referenceId: transfer.referenceId.trim(),
        transferDate: new Date().toISOString().slice(0, 10),
        bankName: transfer.provider,
        receipt: {
          fileName: receipt.fileName,
          contentType: receipt.contentType,
          dataBase64: receipt.dataBase64,
        },
      };
      setStatus("processing");
      setTimeout(() => {
        setStatus("success");
        setTimeout(() => onPay("bank", payload), 1400);
      }, 1500);
      return;
    }
    const newErrors = {
      name: name.trim().length < 2,
      card: cardDigits.length < 16 || !luhnValid(cardDigits),
      expiry: !expiryValid(expiry),
      cvv: cvv.length < 3,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => onPay("card"), 1400);
    }, 2000);
  };

  const IBAN = "PK36ZIZB0000001234567890";
  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-10 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg animate-scale-in">
          <CheckCircle className="size-10" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-emerald-900">
          {method === "card" ? "Payment Successful!" : "Transfer Received!"}
        </h3>
        <p className="mt-2 text-emerald-700/80">
          {method === "card"
            ? "Your transaction was processed securely. Redirecting…"
            : "We'll verify your transfer shortly. Redirecting…"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Method picker */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
            method === "card"
              ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
              : "border-border hover:border-primary/40 bg-card"
          }`}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <CreditCard className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Debit / Credit Card</span>
            <span className="block text-xs text-muted-foreground">Visa · Mastercard · UnionPay</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMethod("bank")}
          className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
            method === "bank"
              ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
              : "border-border hover:border-primary/40 bg-card"
          }`}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
            <Landmark className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Online Bank &amp; Wallet Transfer</span>
            <span className="block text-xs text-muted-foreground">IBAN · Easypaisa · JazzCash · HBL</span>
          </span>
        </button>
      </div>

      {method === "bank" ? (
        <div className="rounded-3xl bg-white border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-600"><ShoppingBag className="size-3.5" /> Cart</span>
            <span className="text-muted-foreground">›</span>
            <span className="flex items-center gap-1.5 text-emerald-600"><Truck className="size-3.5" /> Shipping</span>
            <span className="text-muted-foreground">›</span>
            <span className="flex items-center gap-1.5 font-semibold text-primary"><Landmark className="size-3.5" /> Bank &amp; Wallet Transfer</span>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Online bank &amp; wallet transfer</h3>
            <p className="text-sm text-muted-foreground">
              Send {money(amount)} to the account below (or to our Easypaisa / JazzCash number
              <span className="font-semibold text-foreground"> 0300-1234567</span>), then confirm the details so we can verify it.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 space-y-3">
            <Row label="Bank" value="Meezan Bank" />
            <Row label="Account Title" value="Zizaib Boutique (Pvt) Ltd" />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">IBAN</div>
                <div className="mt-0.5 font-mono text-sm break-all">{IBAN}</div>
              </div>
              <button
                type="button"
                onClick={copyIban}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white border border-border px-3 py-2 text-xs font-medium hover:bg-primary/10"
              >
                {copied ? <><Check className="size-3.5" /> Copied</> : <><Copy className="size-3.5" /> Copy</>}
              </button>
            </div>
            <Row label="Amount" value={money(amount)} bold />
          </div>

          {status === "processing" ? (
            <WalletTransfer amount={money(amount)} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="pay-provider" className="block text-sm font-semibold mb-1">Payment provider *</label>
                <select
                  id="pay-provider"
                  value={transfer.provider}
                  onChange={(e) => setTransfer({ ...transfer, provider: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, provider: true }))}
                  aria-invalid={!!showErr("provider")}
                  className={`w-full rounded-xl border-2 bg-background px-3 py-2.5 min-h-12 text-base outline-none transition ${
                    showErr("provider") ? "border-destructive ring-2 ring-destructive/30" : "border-border focus:border-primary"
                  }`}
                >
                  <option value="">Select where you sent the money…</option>
                  {PAYMENT_PROVIDERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {showErr("provider") && <p className="mt-1 text-xs font-medium text-destructive">{showErr("provider")}</p>}
              </div>

              <Field
                id="pay-sender"
                label="Sender account name *"
                value={transfer.senderName}
                onChange={(v) => setTransfer({ ...transfer, senderName: v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, "") })}
                onBlur={() => setTouched((t) => ({ ...t, senderName: true }))}
                placeholder="Exact legal name on the account"
                error={showErr("senderName")}
              />
              <Field
                id="pay-ref"
                label="Transaction ID / reference number *"
                value={transfer.referenceId}
                onChange={(v) => setTransfer({ ...transfer, referenceId: v.replace(/[^A-Za-z0-9]/g, "").slice(0, 40) })}
                onBlur={() => setTouched((t) => ({ ...t, referenceId: true }))}
                placeholder="e.g. TXN8837201"
                error={showErr("referenceId")}
              />

              <div className="sm:col-span-2">
                <label htmlFor="pay-receipt" className="block text-sm font-semibold mb-1">
                  Receipt upload * <span className="font-normal text-muted-foreground">(JPG, PNG or PDF · max 5 MB)</span>
                </label>

                {!receipt ? (
                  <label
                    htmlFor="pay-receipt"
                    className={`flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 min-h-12 cursor-pointer transition ${
                      showErr("receipt") ? "border-destructive bg-destructive/5" : "border-primary/40 bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    <Upload className="size-4 text-primary" />
                    <span className="text-sm">Upload your transfer confirmation screenshot</span>
                  </label>
                ) : (
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      {previewing && (
                        <div className="absolute inset-0 grid place-items-center">
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      {!previewing && preview && (
                        <img
                          src={preview.url}
                          alt={`Preview of ${receipt.fileName}`}
                          className="size-full object-cover"
                        />
                      )}
                      {!previewing && !preview && (
                        <div className="absolute inset-0 grid place-items-center">
                          <FileText className="size-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{receipt.fileName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {(receipt.size / 1024).toFixed(0)} KB
                        {preview?.kind === "pdf" && preview.pageCount
                          ? ` · PDF, ${preview.pageCount} page${preview.pageCount > 1 ? "s" : ""} (showing page 1)`
                          : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => receiptInput.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent transition"
                        >
                          <RefreshCw className="size-3.5" /> Choose a different file
                        </button>
                        <button
                          type="button"
                          onClick={() => clearReceipt(GENERIC_ERROR)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition"
                        >
                          <X className="size-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={receiptInput}
                  id="pay-receipt"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="sr-only"
                  onChange={(e) => handleReceipt(e.target.files?.[0])}
                />
                {showErr("receipt") && <p className="mt-1 text-xs font-medium text-destructive">{showErr("receipt")}</p>}

              </div>

              <div className="sm:col-span-2 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total amount</span>
                <span className="font-display text-2xl font-bold">{money(amount)}</span>
              </div>

              <button
                onClick={handlePay}
                disabled={!transferValid}
                className="sm:col-span-2 w-full rounded-xl bg-primary text-primary-foreground py-3.5 min-h-12 font-semibold tracking-wide hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                I have transferred {money(amount)}
              </button>
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                We verify every transfer manually. Fake or placeholder details will be rejected.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <style>{`
            @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
            .animate-shake { animation: shake 0.4s ease-in-out; }
            .flip-card { perspective: 1200px; }
            .flip-inner { transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; position:relative; width:100%; aspect-ratio: 1.586/1; }
            .flip-inner.flipped { transform: rotateY(180deg); }
            .flip-face { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:1.25rem; overflow:hidden; }
            .flip-back { transform: rotateY(180deg); }
          `}</style>

          {/* Animated Card */}
          <div className="flip-card">
            <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
              {/* Front */}
              <div className="flip-face bg-primary text-primary-foreground p-6 shadow-2xl">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-lg bg-yellow-300/90" />
                  <span className="font-display font-black italic text-xl tracking-wider">{brand}</span>
                </div>
                <div className="mt-6 font-mono text-lg sm:text-xl tracking-widest">
                  {card || "•••• •••• •••• ••••"}
                </div>
                <div className="mt-6 flex justify-between text-xs">
                  <div>
                    <div className="opacity-70 uppercase tracking-widest text-[10px]">Card Holder</div>
                    <div className="mt-1 font-semibold uppercase tracking-wide truncate max-w-[10rem]">{name || "YOUR NAME"}</div>
                  </div>
                  <div className="text-right">
                    <div className="opacity-70 uppercase tracking-widest text-[10px]">Expires</div>
                    <div className="mt-1 font-semibold font-mono">{expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>
              {/* Back */}
              <div className="flip-face flip-back bg-foreground text-background shadow-2xl">
                <div className="mt-6 h-10 w-full bg-black" />
                <div className="p-6">
                  <div className="text-[10px] uppercase tracking-widest text-white/60">CVV Code</div>
                  <div className="mt-2 h-10 rounded bg-white/95 text-slate-800 font-mono grid place-items-center tracking-widest">
                    {cvv || "•••"}
                  </div>
                  <div className="mt-6 text-[10px] text-white/50 text-center">
                    Authorized Signature • Not Valid Unless Signed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl bg-white border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs mb-6">
              <span className="flex items-center gap-1.5 text-emerald-600"><ShoppingBag className="size-3.5" /> Cart</span>
              <span className="text-muted-foreground">›</span>
              <span className="flex items-center gap-1.5 text-emerald-600"><Truck className="size-3.5" /> Shipping</span>
              <span className="text-muted-foreground">›</span>
              <span className="flex items-center gap-1.5 font-semibold text-primary"><CreditCard className="size-3.5" /> Payment</span>
            </div>

            {status === "processing" ? (
              <div className="py-14 text-center">
                <div className="mx-auto size-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="mt-4 font-medium text-foreground">Processing Secure Transaction…</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-display text-xl font-bold">Payment details</h3>
                  <p className="text-sm text-muted-foreground">Enter your card to complete the transaction.</p>
                </div>

                <div className={`mt-5 ${errors.name ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Cardholder Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white transition ${
                      errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-primary/50"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs font-medium text-destructive">Please enter the name printed on your card.</p>}
                </div>

                <div className={`mt-4 ${errors.card ? "animate-shake" : ""}`}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      value={card}
                      onChange={(e) => setCard(formatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full border rounded-lg pl-4 pr-14 py-3 focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white transition font-mono ${
                        errors.card ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-primary/50"
                      }`}
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                  {errors.card && <p className="mt-1 text-xs font-medium text-destructive">That card number doesn't look valid.</p>}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className={errors.expiry ? "animate-shake" : ""}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expiry</label>
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white transition font-mono ${
                        errors.expiry ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-primary/50"
                      }`}
                    />
                    {errors.expiry && <p className="mt-1 text-xs font-medium text-destructive">Use a future MM/YY date.</p>}
                  </div>
                  <div className={errors.cvv ? "animate-shake" : ""}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">CVV</label>
                    <input
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      onFocus={() => setFlipped(true)}
                      onBlur={() => setFlipped(false)}
                      placeholder="123"
                      maxLength={3}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white transition font-mono ${
                        errors.cvv ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-primary/50"
                      }`}
                    />
                    {errors.cvv && <p className="mt-1 text-xs font-medium text-destructive">3 digits.</p>}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="font-display text-2xl font-bold">{money(amount)}</span>
                </div>

                <button
                  onClick={handlePay}
                  disabled={status !== "form"}
                  className="mt-4 w-full rounded-xl disabled:opacity-60 disabled:cursor-not-allowed bg-primary text-primary-foreground py-3.5 font-semibold tracking-wide hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                >
                  <Lock className="size-4" /> PAY {money(amount)} NOW
                </button>

                <p className="mt-3 text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Lock className="size-3" /> 256-bit encrypted • Sandbox demo — no real charge
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`text-sm ${bold ? "font-display text-lg font-bold text-foreground" : "font-medium text-foreground"}`}>{value}</span>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder ?? ""}
        maxLength={80}
        aria-invalid={!!error}
        className={`w-full rounded-xl border-2 bg-background px-3 py-2.5 min-h-12 text-base outline-none transition ${
          error ? "border-destructive ring-2 ring-destructive/30" : "border-border focus:border-primary"
        }`}
      />
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function WalletTransfer({ amount }: { amount: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100 p-5">
      <style>{`
        @keyframes bill-fly {
          0%   { transform: translate(0,0) rotate(-8deg) scale(0.9); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translate(var(--midX), -22px) rotate(6deg) scale(1); }
          90%  { opacity: 1; }
          100% { transform: translate(var(--endX), 0) rotate(-4deg) scale(0.85); opacity: 0; }
        }
        @keyframes wallet-pulse {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-2px) scale(1.04); }
        }
        @keyframes wallet-recv {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-3px) scale(1.06) rotate(2deg); }
        }
        .bill { animation: bill-fly 1.6s cubic-bezier(.5,-.1,.6,1.1) infinite; }
        .bill.b2 { animation-delay: .35s; }
        .bill.b3 { animation-delay: .7s; }
        .w-from { animation: wallet-pulse 1.6s ease-in-out infinite; transform-origin: center; }
        .w-to   { animation: wallet-recv 1.6s ease-in-out infinite; animation-delay: 1s; transform-origin: center; }
      `}</style>

      <div className="relative flex items-center justify-between gap-2 h-24">
        {/* Customer wallet */}
        <div className="flex flex-col items-center gap-1 w-24 z-10">
          <div className="w-from grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-pink-300/50">
            <Wallet className="size-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">You</span>
        </div>

        {/* Flight path */}
        <div
          className="absolute inset-x-16 top-1/2 -translate-y-1/2 h-16 pointer-events-none"
          style={{ ["--midX" as string]: "50%", ["--endX" as string]: "100%" }}
        >
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-emerald-300/70" />
          <Bill className="bill absolute top-1/2 -translate-y-1/2 left-0" />
          <Bill className="bill b2 absolute top-1/2 -translate-y-1/2 left-0" />
          <Bill className="bill b3 absolute top-1/2 -translate-y-1/2 left-0" />
        </div>

        {/* Store wallet */}
        <div className="flex flex-col items-center gap-1 w-24 z-10">
          <div className="w-to grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-300/50">
            <Landmark className="size-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Zizaib</span>
        </div>
      </div>

      <p className="mt-2 text-center text-sm font-semibold text-emerald-800">
        Sending {amount} to Zizaib…
      </p>
      <p className="text-center text-[11px] text-muted-foreground">
        Verifying the transfer on the bank rails.
      </p>
    </div>
  );
}

function Bill({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" width="40" height="24" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="22" rx="3" fill="#d1fadf" stroke="#059669" strokeWidth="1" />
      <circle cx="20" cy="12" r="5" fill="#a7f3d0" stroke="#047857" strokeWidth="1" />
      <text x="20" y="15" textAnchor="middle" fontSize="6" fontWeight="700" fill="#065f46">$</text>
      <circle cx="5" cy="12" r="1.2" fill="#047857" />
      <circle cx="35" cy="12" r="1.2" fill="#047857" />
    </svg>
  );
}

function luhnValid(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return digits.length > 0 && sum % 10 === 0;
}

function expiryValid(value: string): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const end = new Date(year, month, 1);
  return end > now;
}

function detectBrand(digits: string): string {
  if (/^4/.test(digits)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "MASTERCARD";
  if (/^3[47]/.test(digits)) return "AMEX";
  if (/^62/.test(digits)) return "UNIONPAY";
  return "CARD";
}
