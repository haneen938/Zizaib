import { describe, expect, it } from "vitest";
import {
  GENERIC_ERROR,
  RECEIPT_MAX_BYTES,
  sniffReceiptType,
  validateProvider,
  validateReceiptMeta,
  validateReceiptPayload,
  validateSenderName,
  validateTransactionId,
  safeStorageExtension,
  validateReviewImage,
} from "./payment-validation";

const b64 = (bytes: number[], padTo = 0) => {
  const all = [...bytes, ...Array(Math.max(0, padTo - bytes.length)).fill(0x20)];
  let bin = "";
  for (const b of all) bin += String.fromCharCode(b);
  return btoa(bin);
};
const JPEG = (size = 3000) => b64([0xff, 0xd8, 0xff, 0xe0], size);
const PNG = (size = 3000) => b64([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], size);
const PDF = (size = 3000) => b64([..."%PDF-1.7"].map((c) => c.charCodeAt(0)), size);

describe("provider", () => {
  it("accepts a listed provider", () => {
    expect(validateProvider("Easypaisa")).toBeUndefined();
  });
  it("rejects anything off the list", () => {
    expect(validateProvider("My Uncle's Bank")).toBe(GENERIC_ERROR);
  });
});

describe("sender name", () => {
  it("accepts a real two-part name", () => {
    expect(validateSenderName("Zenia Khan")).toBeUndefined();
  });
  it.each(["Zenia", "test test", "qwer qwer", "aaa aaa", "Z K", "123 456"])(
    "rejects junk: %s",
    (v) => expect(validateSenderName(v)).toBe(GENERIC_ERROR),
  );
});

describe("transaction id", () => {
  it("accepts a plausible bank reference", () => {
    expect(validateTransactionId("TXN8837201")).toBeUndefined();
  });
  it.each(["123456", "000000", "abcdef", "test12", "ABCABCABC", "TXNREFERENCE"])(
    "rejects junk: %s",
    (v) => expect(validateTransactionId(v)).toBe(GENERIC_ERROR),
  );
});

describe("receipt metadata", () => {
  it("accepts a valid jpeg", () => {
    expect(validateReceiptMeta({ fileName: "slip.jpg", contentType: "image/jpeg", size: 2048 })).toBeUndefined();
  });
  it("requires a file", () => {
    expect(validateReceiptMeta(null)).toBe(GENERIC_ERROR);
  });
  it("rejects empty files", () => {
    expect(validateReceiptMeta({ fileName: "slip.png", contentType: "image/png", size: 0 })).toBe(GENERIC_ERROR);
  });
  it("rejects oversized files", () => {
    expect(
      validateReceiptMeta({ fileName: "slip.png", contentType: "image/png", size: RECEIPT_MAX_BYTES + 1 }),
    ).toBe(GENERIC_ERROR);
  });
  it("rejects disallowed types and extensions", () => {
    expect(validateReceiptMeta({ fileName: "x.exe", contentType: "application/x-msdownload", size: 10 })).toBe(GENERIC_ERROR);
    expect(validateReceiptMeta({ fileName: "x.exe", contentType: "image/png", size: 10 })).toBe(GENERIC_ERROR);
  });
});

describe("magic byte sniffing", () => {
  it("identifies jpeg, png and pdf", () => {
    expect(sniffReceiptType(JPEG())).toBe("image/jpeg");
    expect(sniffReceiptType(`data:image/png;base64,${PNG()}`)).toBe("image/png");
    expect(sniffReceiptType(PDF())).toBe("application/pdf");
  });
  it("returns null for unknown bytes", () => {
    expect(sniffReceiptType(b64([0x4d, 0x5a, 0x90, 0x00], 100))).toBeNull();
    expect(sniffReceiptType("")).toBeNull();
  });
});

describe("server receipt payload validation", () => {
  it("accepts a genuine jpeg upload", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.jpg", contentType: "image/jpeg", dataBase64: `data:image/jpeg;base64,${JPEG()}` }),
    ).toBeUndefined();
  });
  it("accepts a genuine pdf upload", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.pdf", contentType: "application/pdf", dataBase64: PDF() }),
    ).toBeUndefined();
  });
  it("rejects an executable renamed to .png", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.png", contentType: "image/png", dataBase64: b64([0x4d, 0x5a, 0x90, 0x00], 3000) }),
    ).toBe(GENERIC_ERROR);
  });
  it("rejects a pdf declared as an image", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.jpg", contentType: "image/jpeg", dataBase64: PDF() }),
    ).toBe(GENERIC_ERROR);
  });
  it("rejects a mismatched extension", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.png", contentType: "image/jpeg", dataBase64: JPEG() }),
    ).toBe(GENERIC_ERROR);
  });
  it("rejects payloads over the size cap", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.jpg", contentType: "image/jpeg", dataBase64: JPEG(RECEIPT_MAX_BYTES + 100) }),
    ).toBe(GENERIC_ERROR);
  });
  it("rejects garbage that is not base64", () => {
    expect(
      validateReceiptPayload({ fileName: "slip.jpg", contentType: "image/jpeg", dataBase64: "not base64 @@@" }),
    ).toBe(GENERIC_ERROR);
  });
  it("rejects a missing receipt", () => {
    expect(validateReceiptPayload(undefined)).toBe(GENERIC_ERROR);
  });
});

describe("storage key safety", () => {
  it("never derives a key from the user filename", () => {
    expect(safeStorageExtension("image/jpeg")).toBe("jpg");
    expect(safeStorageExtension("image/png")).toBe("png");
  });
});

describe("validateReviewImage", () => {
  const jpeg = btoa(String.fromCharCode(0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0));
  it("accepts a real jpeg", () => {
    expect(validateReviewImage({ fileName: "a.jpg", contentType: "image/jpeg", dataBase64: jpeg })).toBe("image/jpeg");
  });
  it("rejects a pdf posing as a review photo", () => {
    const pdf = btoa("%PDF-1.4 fake payload");
    expect(validateReviewImage({ fileName: "a.jpg", contentType: "image/jpeg", dataBase64: pdf })).toBeNull();
  });
  it("rejects a renamed script", () => {
    const html = btoa("<script>alert(1)</script>padding");
    expect(validateReviewImage({ fileName: "a.png", contentType: "image/png", dataBase64: html })).toBeNull();
  });
});
