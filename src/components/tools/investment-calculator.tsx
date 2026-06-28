"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type YearPoint = {
  year: number;
  invested: number;
  value: number;
};

type Result = {
  futureValue: number;
  totalInvested: number;
  totalGain: number;
  roi: number;
  series: YearPoint[];
};

/**
 * Compound growth with regular contributions, compounded monthly.
 * Contributions are added at the end of each month.
 */
function calculate(
  initial: number,
  monthly: number,
  annualRatePct: number,
  years: number
): Result {
  const months = Math.round(years * 12);
  const monthlyRate = annualRatePct / 100 / 12;
  const series: YearPoint[] = [
    { year: 0, invested: initial, value: initial },
  ];

  let value = initial;
  for (let m = 1; m <= months; m++) {
    value = value * (1 + monthlyRate) + monthly;
    if (m % 12 === 0) {
      series.push({
        year: m / 12,
        invested: initial + monthly * m,
        value,
      });
    }
  }

  const totalInvested = initial + monthly * months;
  const futureValue = value;
  const totalGain = futureValue - totalInvested;
  const roi = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return { futureValue, totalInvested, totalGain, roi, series };
}

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "PKR", symbol: "₨" },
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
];

export function InvestmentCalculator() {
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("100");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [currency, setCurrency] = useState("USD");

  const symbol =
    currencies.find((c) => c.code === currency)?.symbol ?? "$";

  const result = useMemo(
    () =>
      calculate(
        Math.max(0, parseFloat(initial) || 0),
        Math.max(0, parseFloat(monthly) || 0),
        parseFloat(rate) || 0,
        Math.min(80, Math.max(0, parseFloat(years) || 0))
      ),
    [initial, monthly, rate, years]
  );

  const fmt = (n: number) =>
    `${symbol}${n.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <Card className="p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold">Your plan</h2>
        <div className="mt-5 space-y-4">
          <Field
            id="initial"
            label="Initial investment"
            prefix={symbol}
            value={initial}
            onChange={setInitial}
          />
          <Field
            id="monthly"
            label="Monthly contribution"
            prefix={symbol}
            value={monthly}
            onChange={setMonthly}
          />
          <Field
            id="rate"
            label="Expected annual return"
            suffix="%"
            value={rate}
            onChange={setRate}
            step="0.1"
          />
          <Field
            id="years"
            label="Years to grow"
            suffix="yrs"
            value={years}
            onChange={setYears}
          />
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
                    {c.symbol} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-6 lg:col-span-3">
        <div className="grid gap-4 sm:grid-cols-2">
          <Stat
            label="Future value"
            value={fmt(result.futureValue)}
            highlight
          />
          <Stat label="Return on investment" value={`${result.roi.toFixed(1)}%`} />
          <Stat label="Total invested" value={fmt(result.totalInvested)} />
          <Stat
            label="Total gain"
            value={fmt(result.totalGain)}
            positive={result.totalGain >= 0}
          />
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Projected growth
          </h3>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={result.series}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-3)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-3)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => `Y${v}`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) =>
                    v >= 1000 ? `${symbol}${(v / 1000).toFixed(0)}k` : `${symbol}${v}`
                  }
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmt(Number(value)),
                    name === "value" ? "Total value" : "Invested",
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                    fontSize: "0.8rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="var(--chart-3)"
                  fill="url(#fillInvested)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  fill="url(#fillValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <LegendDot color="var(--chart-1)" label="Total value" />
            <LegendDot color="var(--chart-3)" label="Total invested" />
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">
          Estimates assume a fixed annual return compounded monthly. Actual
          investment returns vary and are not guaranteed. This tool is for
          illustration only and is not financial advice.
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={prefix ? "pl-7" : suffix ? "pr-12" : undefined}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  positive,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <Card
      className={
        highlight
          ? "border-primary/30 bg-primary/5 p-5"
          : "p-5"
      }
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={
          "mt-1 text-2xl font-bold tabular-nums " +
          (highlight
            ? "text-primary"
            : positive === false
              ? "text-destructive"
              : "")
        }
      >
        {value}
      </p>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
