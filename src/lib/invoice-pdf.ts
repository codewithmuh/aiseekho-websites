import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export type InvoicePdfData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  symbol: string;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  items: { description: string; quantity: number; rate: number }[];
  taxRate: number;
  notes: string;
  subtotal: number;
  taxAmount: number;
  total: number;
};

const PRIMARY: [number, number, number] = [79, 70, 229]; // indigo-600
const MUTED: [number, number, number] = [113, 113, 122];

function money(symbol: string, n: number): string {
  return `${symbol}${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Build and trigger download of the invoice PDF entirely client-side. */
export function generateInvoicePdf(data: InvoicePdfData): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...PRIMARY);
  doc.text("INVOICE", margin, 64);

  // Invoice meta (right aligned)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  const metaLines = [
    `Invoice #: ${data.invoiceNumber || "-"}`,
    data.issueDate ? `Issued: ${data.issueDate}` : "",
    data.dueDate ? `Due: ${data.dueDate}` : "",
  ].filter(Boolean);
  metaLines.forEach((line, i) => {
    doc.text(line, pageWidth - margin, 50 + i * 14, { align: "right" });
  });

  // From / Bill to
  let y = 110;
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("FROM", margin, y);
  doc.text("BILL TO", pageWidth / 2, y);

  doc.setFontSize(11);
  doc.setTextColor(24, 24, 27);
  doc.setFont("helvetica", "bold");
  doc.text(data.fromName || "Your business", margin, y + 16);
  doc.text(data.toName || "Client", pageWidth / 2, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const fromLines = doc.splitTextToSize(
    data.fromDetails || "",
    pageWidth / 2 - margin - 12
  );
  const toLines = doc.splitTextToSize(
    data.toDetails || "",
    pageWidth / 2 - margin - 12
  );
  doc.text(fromLines, margin, y + 30);
  doc.text(toLines, pageWidth / 2, y + 30);

  const detailRows = Math.max(fromLines.length, toLines.length);
  y = y + 40 + detailRows * 11;

  // Items table
  autoTable(doc, {
    startY: Math.max(y, 180),
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: data.items.map((it) => [
      it.description || "-",
      String(it.quantity),
      money(data.symbol, it.rate),
      money(data.symbol, (it.quantity || 0) * (it.rate || 0)),
    ]),
    theme: "striped",
    headStyles: {
      fillColor: PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    bodyStyles: { textColor: [39, 39, 42] },
    columnStyles: {
      1: { halign: "right", cellWidth: 60 },
      2: { halign: "right", cellWidth: 90 },
      3: { halign: "right", cellWidth: 90 },
    },
    margin: { left: margin, right: margin },
  });

  // Totals
  // @ts-expect-error - lastAutoTable is added by the autotable plugin
  let ty: number = (doc.lastAutoTable?.finalY ?? y) + 20;
  const labelX = pageWidth - margin - 150;
  const valueX = pageWidth - margin;

  const totalsRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    const c: [number, number, number] = bold ? [24, 24, 27] : MUTED;
    doc.setTextColor(c[0], c[1], c[2]);
    doc.text(label, labelX, ty);
    doc.text(value, valueX, ty, { align: "right" });
    ty += bold ? 20 : 16;
  };

  totalsRow("Subtotal", money(data.symbol, data.subtotal));
  totalsRow(`Tax (${data.taxRate}%)`, money(data.symbol, data.taxAmount));
  doc.setDrawColor(228, 228, 231);
  doc.line(labelX, ty - 8, valueX, ty - 8);
  totalsRow("Total", money(data.symbol, data.total), true);

  // Notes
  if (data.notes) {
    ty += 16;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text("NOTES", margin, ty);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(39, 39, 42);
    const noteLines = doc.splitTextToSize(data.notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, ty + 14);
  }

  const safeNumber = (data.invoiceNumber || "invoice").replace(
    /[^a-z0-9-_]/gi,
    "_"
  );
  doc.save(`${safeNumber}.pdf`);
}
