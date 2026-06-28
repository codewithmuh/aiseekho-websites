"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "PKR", symbol: "Rs" },
  { code: "INR", symbol: "Rs" },
  { code: "AED", symbol: "AED" },
];

export function InvoiceGenerator() {
  const idCounter = useRef(2);
  const newId = () => String(idCounter.current++);

  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [fromName, setFromName] = useState("");
  const [fromDetails, setFromDetails] = useState("");
  const [toName, setToName] = useState("");
  const [toDetails, setToDetails] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: "0", description: "Website design", quantity: 1, rate: 500 },
    { id: "1", description: "Hosting (monthly)", quantity: 12, rate: 15 },
  ]);

  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState(
    "Thank you for your business! Payment due within 14 days."
  );

  const symbol = currencies.find((c) => c.code === currency)?.symbol ?? "$";

  const { subtotal, taxAmount, total } = useMemo(() => {
    const sub = items.reduce(
      (sum, it) => sum + (it.quantity || 0) * (it.rate || 0),
      0
    );
    const tax = (sub * (parseFloat(taxRate) || 0)) / 100;
    return { subtotal: sub, taxAmount: tax, total: sub + tax };
  }, [items, taxRate]);

  const fmt = (n: number) =>
    `${symbol}${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: newId(), description: "", quantity: 1, rate: 0 },
    ]);

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const handleDownload = async () => {
    try {
      const { generateInvoicePdf } = await import("@/lib/invoice-pdf");
      generateInvoicePdf({
        invoiceNumber,
        issueDate,
        dueDate,
        symbol,
        fromName,
        fromDetails,
        toName,
        toDetails,
        items,
        taxRate: parseFloat(taxRate) || 0,
        notes,
        subtotal,
        taxAmount,
        total,
      });
      toast.success("Invoice PDF downloaded");
    } catch {
      toast.error("Sorry, the PDF could not be generated.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ---------------- Form ---------------- */}
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Invoice details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="invno">Invoice number</Label>
              <Input
                id="invno"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={currency}
                onValueChange={(v) => v && setCurrency(v)}
              >
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} · {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue">Issue date</Label>
              <Input
                id="issue"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due">Due date</Label>
              <Input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">From (you)</h3>
              <Input
                placeholder="Your name / business"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
              <Textarea
                placeholder="Address, email, phone, tax ID…"
                rows={3}
                value={fromDetails}
                onChange={(e) => setFromDetails(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Bill to (client)</h3>
              <Input
                placeholder="Client name / business"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
              <Textarea
                placeholder="Address, email, phone…"
                rows={3}
                value={toDetails}
                onChange={(e) => setToDetails(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Line items</h3>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="size-4" />
              Add item
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {/* header */}
            <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-right">Qty</span>
              <span className="col-span-3 text-right">Rate</span>
              <span className="col-span-1" />
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-2"
              >
                <Input
                  className="col-span-12 sm:col-span-6"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, { description: e.target.value })
                  }
                />
                <Input
                  className="col-span-5 sm:col-span-2 text-right"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, {
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  className="col-span-5 sm:col-span-3 text-right"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(item.id, {
                      rate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-2 sm:col-span-1 text-muted-foreground hover:text-destructive"
                  aria-label="Remove item"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator className="my-5" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tax">Tax rate (%)</Label>
              <Input
                id="tax"
                type="number"
                min={0}
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* ---------------- Preview ---------------- */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview</h2>
          <Button onClick={handleDownload}>
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="bg-white p-8 text-sm text-zinc-900">
            {/* header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="size-5" />
                  <span className="text-base font-bold">INVOICE</span>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  {invoiceNumber || "—"}
                </p>
              </div>
              <div className="text-right text-xs text-zinc-500">
                {issueDate && (
                  <p>
                    <span className="font-medium text-zinc-700">Issued:</span>{" "}
                    {issueDate}
                  </p>
                )}
                {dueDate && (
                  <p>
                    <span className="font-medium text-zinc-700">Due:</span>{" "}
                    {dueDate}
                  </p>
                )}
              </div>
            </div>

            {/* parties */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  From
                </p>
                <p className="mt-1 font-medium">{fromName || "Your business"}</p>
                <p className="whitespace-pre-line text-xs text-zinc-500">
                  {fromDetails}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Bill to
                </p>
                <p className="mt-1 font-medium">{toName || "Client"}</p>
                <p className="whitespace-pre-line text-xs text-zinc-500">
                  {toDetails}
                </p>
              </div>
            </div>

            {/* table */}
            <table className="mt-6 w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 text-right font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Rate</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-2">
                      {item.description || (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {fmt(item.rate)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {fmt((item.quantity || 0) * (item.rate || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-48 space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Tax ({parseFloat(taxRate) || 0}%)</span>
                  <span className="tabular-nums">{fmt(taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-1.5 text-sm font-bold text-zinc-900">
                  <span>Total</span>
                  <span className="tabular-nums">{fmt(total)}</span>
                </div>
              </div>
            </div>

            {notes && (
              <div className="mt-6 border-t border-zinc-100 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Notes
                </p>
                <p className="mt-1 whitespace-pre-line text-xs text-zinc-500">
                  {notes}
                </p>
              </div>
            )}
          </div>
        </Card>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Everything is generated in your browser — nothing is uploaded.
        </p>
      </div>
    </div>
  );
}
