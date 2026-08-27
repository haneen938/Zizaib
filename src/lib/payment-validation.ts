// Shared anti-junk validation for the "Online Bank & Wallet Transfer" method.
// Used by both the checkout UI and the server function.

export const PAYMENT_PROVIDERS = [
  "Direct IBAN (Bank Transfer)",
  "Easypaisa",
  "JazzCash",
  "HBL",
  "Meezan Bank",
  "UBL",
  "Bank Alfalah",
  "SadaPay",
  "NayaPay",
  "Other Bank / Wallet",
] as const;

export const GENERIC_ERROR =
  "Please enter a valid, authentic transaction detail to process your order.";

export const RECEIPT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const RECEIPT_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const PLACEHOLDERS = [
  "test", "testing", "none", "null", "na", "n/a", "nil", "asdf", "asdfgh", "qwer",
  "qwerty", "abc", "abcd", "abcdef", "xyz", "xxx", "dummy", "sample", "fake",
  "unknown", "demo", "example", "aaa", "zzz", "lorem", "ipsum", "admin", "user",
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

export function validateSenderName(raw: string): string | undefined {
  const v = raw.trim().replace(/\s+/g, " ");
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(v)) return GENERIC_ERROR; // letters only
  if (v.replace(/[^A-Za-z]/g, "").length < 4) return GENERIC_ERROR;
  const words = v.split(" ");
  if (words.length < 2) return GENERIC_ERROR; // full legal name required
  for (const w of words) {
    const lw = w.toLowerCase().replace(/[^a-z]/g, "");
    if (lw.length < 2) return GENERIC_ERROR; // single-letter inputs
    if (PLACEHOLDERS.includes(lw)) return GENERIC_ERROR;
    if (!/[aeiouyà-öø-ÿ]/i.test(lw)) return GENERIC_ERROR; // jumbled letters (qwer, xyz)
    if (isSequential(lw)) return GENERIC_ERROR;
    if (new Set(lw).size < 2) return GENERIC_ERROR; // aaa
  }
  return undefined;
}

export function validateTransactionId(raw: string): string | undefined {
  const v = raw.trim();
  if (!/^[A-Za-z0-9]{6,40}$/.test(v)) return GENERIC_ERROR; // strict alphanumeric, min 6
  const lower = v.toLowerCase();
  if (PLACEHOLDERS.some((p) => lower === p || lower.startsWith(p) && lower.length <= p.length + 2))
    return GENERIC_ERROR;
  if (new Set(lower).size < 4) return GENERIC_ERROR; // 000000, 121212
  if (isSequential(lower)) return GENERIC_ERROR; // 123456, abcdef
  if (/^(.+?)\1+$/.test(lower)) return GENERIC_ERROR; // repeated blocks
  if (!/\d/.test(v)) return GENERIC_ERROR; // real bank refs contain digits
  return undefined;
}

export function validateReceiptMeta(
  receipt: { contentType: string; fileName: string; size: number } | null | undefined,
): string | undefined {
  if (!receipt) return GENERIC_ERROR; // required
  if (!receipt.size || receipt.size <= 0) return GENERIC_ERROR;
  if (receipt.size > RECEIPT_MAX_BYTES) return GENERIC_ERROR;
  const type = receipt.contentType.toLowerCase();
  const extOk = /\.(jpe?g|png|pdf)$/i.test(receipt.fileName);
  if (!RECEIPT_TYPES.includes(type) || !extOk) return GENERIC_ERROR;
  return undefined;
}

/**
 * Reads the leading magic bytes of a base64 (or data-URL) payload and reports the
 * real file type. A renamed .exe claiming to be image/png is caught here.
 */
export function sniffReceiptType(dataBase64: string): "image/jpeg" | "image/png" | "application/pdf" | null {
  const raw = (dataBase64.split(",").pop() ?? "").replace(/\s/g, "");
  if (raw.length < 8) return null;
  let head: string;
  try {
    head = atob(raw.slice(0, 12));
  } catch {
    return null;
  }
  const b = [...head].map((c) => c.charCodeAt(0));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (head.startsWith("%PDF-")) return "application/pdf";
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
  const declared = receipt.contentType.toLowerCase() === "image/jpg" ? "image/jpeg" : receipt.contentType.toLowerCase();
  if (sniffed !== declared) return GENERIC_ERROR;

  const ext = (receipt.fileName.split(".").pop() ?? "").toLowerCase();
  const extType = ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : "image/jpeg";
  if (extType !== sniffed) return GENERIC_ERROR;
  return undefined;
}

/**
 * Storage object keys must never be built from a user-supplied filename:
 * "slip.jpg/../../other/receipt.jpg" would write outside the intended folder.
 * The extension is derived from the sniffed bytes instead of the name.
 */
export function safeStorageExtension(
  sniffed: "image/jpeg" | "image/png" | "application/pdf",
): "jpg" | "png" | "pdf" {
  return sniffed === "application/pdf" ? "pdf" : sniffed === "image/png" ? "png" : "jpg";
}

export const REVIEW_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Review photos: images only (no PDFs), real bytes checked, size capped. */
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


