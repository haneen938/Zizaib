// Shared anti-junk validation for the "Online Bank & Wallet Transfer" method.
// Used by both the checkout UI and the server function so the browser can
// never relax a rule the backend enforces.

export const PAYMENT_PROVIDERS = [
  "Meezan Bank",
  "Easypaisa",
  "JazzCash",
  "Nayapay",
  "Sadapay",
  "Other Bank",
] as const;

export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

/** Wallets whose reference numbers are strictly numeric (11–12 digits). */
const WALLET_PROVIDERS = ["Easypaisa", "JazzCash"];

export const GENERIC_ERROR =
  "Please enter a valid, authentic transaction detail to process your order.";

export const RECEIPT_MIN_BYTES = 20 * 1024; // 20 KB — blocks blank 1px images
export const RECEIPT_MAX_BYTES = 4 * 1024 * 1024; // 4 MB
export const RECEIPT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type SniffedType = "image/jpeg" | "image/png" | "image/webp";

const PLACEHOLDERS = [
  "test", "testing", "none", "null", "na", "n/a", "nil", "asdf", "asdfgh", "qwer",
  "qwerty", "abc", "abcd", "abcdef", "xyz", "xxx", "dummy", "sample", "fake",
  "unknown", "demo", "example", "aaa", "zzz", "lorem", "ipsum", "admin", "user",
  "done", "paid", "payment", "transfer", "sent", "ok", "okay", "yes",
];

const isSequential = (s: string) => {
  if (s.length < 3) return false;
  let asc = true, desc = true;
  for (let i = 1; i < s.length; i++) {
    const d = s.charCodeAt(i) - s.charCodeAt(i - 1);
    if (d !== 1) asc = false;
    if (d !== -1) desc = false;
  }
  return asc || desc;
};

export function validateProvider(v: string): string | undefined {
  return (PAYMENT_PROVIDERS as readonly string[]).includes(v.trim())
    ? undefined
    : GENERIC_ERROR;
}

/** Title-cases each word as the customer types ("john  doe" -> "John Doe"). */
export function titleCaseName(raw: string): string {
  return raw
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|\s)(\p{L})/gu, (_m, sp: string, ch: string) => sp + ch.toUpperCase())
    .slice(0, 50);
}

/** Sender account name: 5–50 chars, letters and single spaces only. */
export function validateSenderName(raw: string): string | undefined {
  const v = raw.trim();
  if (v.length < 5 || v.length > 50) return GENERIC_ERROR;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(v)) return GENERIC_ERROR;
  const words = v.split(" ");
  if (words.length < 2) return GENERIC_ERROR; // full account name required
  for (const w of words) {
    const lw = w.toLowerCase();
    if (lw.length < 2) return GENERIC_ERROR;
    if (PLACEHOLDERS.includes(lw)) return GENERIC_ERROR;
    if (!/[aeiouyà-öø-ÿ]/i.test(lw)) return GENERIC_ERROR; // jumbled letters
    if (isSequential(lw)) return GENERIC_ERROR;
    if (new Set(lw).size < 2) return GENERIC_ERROR;
  }
  return undefined;
}

/**
 * Transaction / reference number. Easypaisa and JazzCash issue 11–12 digit
 * numeric TIDs; every other bank gets an 8–20 character alphanumeric rule.
 */
export function validateTransactionId(raw: string, provider = ""): string | undefined {
  const v = raw.trim();
  const wallet = WALLET_PROVIDERS.includes(provider.trim());

  if (wallet) {
    if (!/^\d{11,12}$/.test(v)) return GENERIC_ERROR;
  } else {
    if (!/^[A-Za-z0-9]{8,20}$/.test(v)) return GENERIC_ERROR;
    if (!/\d/.test(v)) return GENERIC_ERROR; // real bank refs contain digits
  }

  const lower = v.toLowerCase();
  if (PLACEHOLDERS.some((p) => lower === p || (lower.startsWith(p) && lower.length <= p.length + 2)))
    return GENERIC_ERROR;
  if (new Set(lower).size < 4) return GENERIC_ERROR; // 000000000000
  if (isSequential(lower)) return GENERIC_ERROR; // 123456789012
  if (/^(.+?)\1+$/.test(lower)) return GENERIC_ERROR; // repeated blocks
  return undefined;
}

export function validateReceiptMeta(
  receipt: { contentType: string; fileName: string; size: number } | null | undefined,
): string | undefined {
  if (!receipt) return GENERIC_ERROR; // required
  if (!receipt.size || receipt.size < RECEIPT_MIN_BYTES) return GENERIC_ERROR;
  if (receipt.size > RECEIPT_MAX_BYTES) return GENERIC_ERROR;
  const type = receipt.contentType.toLowerCase();
  const extOk = /\.(jpe?g|png|webp)$/i.test(receipt.fileName);
  if (!RECEIPT_TYPES.includes(type) || !extOk) return GENERIC_ERROR;
  return undefined;
}

/** Human-readable upload error for the UI (the generic one hides the reason). */
export function receiptUploadError(file: File): string | undefined {
  const type = file.type.toLowerCase();
  if (type === "application/pdf") return "PDF files aren't accepted — please upload a photo or screenshot (JPG, PNG or WebP).";
  if (!RECEIPT_TYPES.includes(type) || !/\.(jpe?g|png|webp)$/i.test(file.name))
    return "Only JPG, PNG or WebP images are accepted.";
  if (file.size < RECEIPT_MIN_BYTES) return "That image is too small to be a real receipt (minimum 20 KB).";
  if (file.size > RECEIPT_MAX_BYTES) return "That file is larger than 4 MB — please upload a smaller image.";
  return undefined;
}

/**
 * Reads the leading magic bytes of a base64 (or data-URL) payload and reports the
 * real file type. A renamed .exe claiming to be image/png is caught here.
 */
export function sniffReceiptType(dataBase64: string): SniffedType | null {
  const raw = (dataBase64.split(",").pop() ?? "").replace(/\s/g, "");
  if (raw.length < 24) return null;
  let head: string;
  try {
    head = atob(raw.slice(0, 32));
  } catch {
    return null;
  }
  const b = [...head].map((c) => c.charCodeAt(0));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (head.startsWith("RIFF") && head.slice(8, 12) === "WEBP") return "image/webp";
  return null;
}

/** Full server-side receipt check: metadata, declared type, real bytes and size. */
export function validateReceiptPayload(
  receipt: { fileName: string; contentType: string; dataBase64: string } | null | undefined,
): string | undefined {
  if (!receipt) return GENERIC_ERROR;
  const raw = (receipt.dataBase64.split(",").pop() ?? "").replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(raw)) return GENERIC_ERROR;
  const size = Math.floor((raw.length * 3) / 4);
  const metaError = validateReceiptMeta({
    fileName: receipt.fileName,
    contentType: receipt.contentType,
    size,
  });
  if (metaError) return metaError;

  const sniffed = sniffReceiptType(raw);
  if (!sniffed) return GENERIC_ERROR;
  const declared =
    receipt.contentType.toLowerCase() === "image/jpg" ? "image/jpeg" : receipt.contentType.toLowerCase();
  if (sniffed !== declared) return GENERIC_ERROR;

  const ext = (receipt.fileName.split(".").pop() ?? "").toLowerCase();
  const extType = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";
  if (extType !== sniffed) return GENERIC_ERROR;
  return undefined;
}

/**
 * Storage object keys must never be built from a user-supplied filename:
 * "slip.jpg/../../other/receipt.jpg" would write outside the intended folder.
 * The extension is derived from the sniffed bytes instead of the name.
 */
export function safeStorageExtension(sniffed: SniffedType): "jpg" | "png" | "webp" {
  return sniffed === "image/webp" ? "webp" : sniffed === "image/png" ? "png" : "jpg";
}

export const REVIEW_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Review photos: images only, real bytes checked, size capped. */
export function validateReviewImage(img: {
  fileName: string;
  contentType: string;
  dataBase64: string;
}): "image/jpeg" | "image/png" | null {
  const raw = (img.dataBase64.split(",").pop() ?? "").replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(raw)) return null;
  if (Math.floor((raw.length * 3) / 4) > REVIEW_IMAGE_MAX_BYTES) return null;
  const sniffed = sniffReceiptType(raw);
  if (sniffed !== "image/jpeg" && sniffed !== "image/png") return null;
  return sniffed;
}
