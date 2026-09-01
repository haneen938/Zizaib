// Client-side PDF receipt generation for a placed order.
// Uses jsPDF lazily so the library is only downloaded when a customer asks
// for their receipt.

export type ReceiptData = {
  trackingNumber: string;
  method: "card" | "bank" | "cash";
  total: string;
  placedAt?: string;
  status?: string;
  city?: string;
  itemCount?: number;
};

const METHOD_LABEL: Record<ReceiptData["method"], string> = {
  card: "Debit / Credit Card",
  bank: "Online Bank & Wallet Transfer",
  cash: "Online Bank & Wallet Transfer",
};

export async function downloadReceiptPdf(data: ReceiptData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 56;
  let y = 72;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("Zizaib", left, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(110);
  doc.text("Handmade crochet & accessories", left, y + 18);
  doc.setTextColor(0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Order receipt", pageWidth - left, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(
    new Date(data.placedAt ?? Date.now()).toLocaleString(),
    pageWidth - left,
    y + 16,
    { align: "right" },
  );
  doc.setTextColor(0);

  y += 44;
  doc.setDrawColor(220);
  doc.line(left, y, pageWidth - left, y);

  const rows: Array<[string, string]> = [
    ["Tracking number", data.trackingNumber],
    ["Payment method", METHOD_LABEL[data.method]],
    ["Order status", data.status ?? "Processing"],
    ...(data.city ? ([["Destination city", data.city]] as Array<[string, string]>) : []),
    ...(data.itemCount ? ([["Items", String(data.itemCount)]] as Array<[string, string]>) : []),
  ];

  y += 30;
  doc.setFontSize(11);
  for (const [k, v] of rows) {
    doc.setTextColor(110);
    doc.text(k, left, y);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(v, pageWidth - left, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 22;
  }

  y += 8;
  doc.setDrawColor(220);
  doc.line(left, y, pageWidth - left, y);
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total paid", left, y);
  doc.text(data.total, pageWidth - left, y, { align: "right" });

  y += 44;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Keep this receipt — your tracking number is needed to check your shipment status at /track.",
    left,
    y,
    { maxWidth: pageWidth - left * 2 },
  );

  doc.save(`zizaib-receipt-${data.trackingNumber}.pdf`);
}
