// Client-side thumbnail generation for uploaded transfer receipts.
// Images preview directly; PDFs are rasterised (first page only) with pdf.js.

export type ReceiptPreview = {
  url: string;
  kind: "image" | "pdf";
  pageCount?: number;
};

function base64Body(dataUrl: string) {
  return dataUrl.split(",").pop() ?? "";
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const raw = base64Body(dataUrl);
  const bin = atob(raw);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Renders page 1 of a PDF data URL into a JPEG data URL of at most `maxEdge` px. */
async function renderPdfFirstPage(dataUrl: string, maxEdge: number): Promise<ReceiptPreview> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const doc = await pdfjs.getDocument({ data: dataUrlToBytes(dataUrl) }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(maxEdge / base.width, maxEdge / base.height, 2);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas unavailable");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;

  const url = canvas.toDataURL("image/jpeg", 0.82);
  const pageCount = doc.numPages;
  void doc.cleanup();
  return { url, kind: "pdf", pageCount };
}

export async function buildReceiptPreview(
  dataUrl: string,
  contentType: string,
  maxEdge = 640,
): Promise<ReceiptPreview> {
  if (contentType.toLowerCase() === "application/pdf") {
    return renderPdfFirstPage(dataUrl, maxEdge);
  }
  return { url: dataUrl, kind: "image" };
}
