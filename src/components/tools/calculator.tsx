"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Op = "+" | "-" | "×" | "÷";

const MAX_DIGITS = 12;

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

/** Format a number for the display, trimming long floats and grouping digits. */
function formatDisplay(value: string): string {
  if (value === "Error") return value;
  if (value.endsWith(".")) {
    const intPart = value.slice(0, -1);
    return `${groupInt(intPart)}.`;
  }
  const [intPart, decPart] = value.split(".");
  const grouped = groupInt(intPart);
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}

function groupInt(intPart: string): string {
  const negative = intPart.startsWith("-");
  const digits = negative ? intPart.slice(1) : intPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return negative ? `-${grouped}` : grouped;
}

/** Round to avoid floating-point noise, then stringify. */
function toDisplayString(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const rounded = parseFloat(n.toPrecision(MAX_DIGITS));
  return String(rounded);
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Op | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setAccumulator(null);
    setPendingOp(null);
    setOverwrite(true);
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      setDisplay((prev) => {
        if (prev === "Error") prev = "0";
        if (overwrite) {
          setOverwrite(false);
          return digit;
        }
        const raw = prev.replace(/,/g, "");
        if (raw.replace(/[.-]/g, "").length >= MAX_DIGITS) return prev;
        return raw === "0" ? digit : raw + digit;
      });
    },
    [overwrite]
  );

  const inputDot = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Error") return "0.";
      if (overwrite) {
        setOverwrite(false);
        return "0.";
      }
      const raw = prev.replace(/,/g, "");
      return raw.includes(".") ? raw : raw + ".";
    });
  }, [overwrite]);

  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Error" || prev === "0") return prev;
      const raw = prev.replace(/,/g, "");
      return raw.startsWith("-") ? raw.slice(1) : `-${raw}`;
    });
  }, []);

  const inputPercent = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Error") return "0";
      const current = parseFloat(prev.replace(/,/g, ""));
      const base = accumulator ?? current;
      // % of the accumulator when chaining, else simple /100
      const result = pendingOp ? (base * current) / 100 : current / 100;
      return toDisplayString(result);
    });
    setOverwrite(true);
  }, [accumulator, pendingOp]);

  const backspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "Error" || overwrite) return prev;
      const raw = prev.replace(/,/g, "");
      const next = raw.length <= 1 || (raw.length === 2 && raw.startsWith("-"))
        ? "0"
        : raw.slice(0, -1);
      return next === "-" || next === "" ? "0" : next;
    });
  }, [overwrite]);

  const chooseOp = useCallback(
    (op: Op) => {
      const current = parseFloat(display.replace(/,/g, ""));
      if (pendingOp !== null && !overwrite && accumulator !== null) {
        const result = compute(accumulator, current, pendingOp);
        const str = toDisplayString(result);
        setDisplay(str === "Error" ? "Error" : formatToRaw(result));
        setAccumulator(str === "Error" ? null : result);
      } else {
        setAccumulator(current);
      }
      setPendingOp(op);
      setOverwrite(true);
    },
    [accumulator, display, overwrite, pendingOp]
  );

  const equals = useCallback(() => {
    if (pendingOp === null || accumulator === null) return;
    const current = parseFloat(display.replace(/,/g, ""));
    const result = compute(accumulator, current, pendingOp);
    setDisplay(toDisplayString(result));
    setAccumulator(null);
    setPendingOp(null);
    setOverwrite(true);
  }, [accumulator, display, pendingOp]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { key } = e;
      if (key >= "0" && key <= "9") inputDigit(key);
      else if (key === ".") inputDot();
      else if (key === "+") chooseOp("+");
      else if (key === "-") chooseOp("-");
      else if (key === "*") chooseOp("×");
      else if (key === "/") {
        e.preventDefault();
        chooseOp("÷");
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        equals();
      } else if (key === "Backspace") backspace();
      else if (key === "Escape") clearAll();
      else if (key === "%") inputPercent();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    backspace,
    chooseOp,
    clearAll,
    equals,
    inputDigit,
    inputDot,
    inputPercent,
  ]);

  const expression =
    accumulator !== null && pendingOp
      ? `${formatDisplay(formatToRaw(accumulator))} ${pendingOp}`
      : " ";

  return (
    <div className="mx-auto max-w-sm">
      <Card className="overflow-hidden p-0">
        {/* Display */}
        <div className="bg-muted/40 px-5 py-6 text-right">
          <div className="h-5 text-sm text-muted-foreground tabular-nums">
            {expression}
          </div>
          <div
            className="mt-1 truncate text-4xl font-semibold tabular-nums"
            aria-live="polite"
          >
            {formatDisplay(display)}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-px bg-border">
          <Key onClick={clearAll} variant="fn">
            AC
          </Key>
          <Key onClick={toggleSign} variant="fn">
            +/−
          </Key>
          <Key onClick={inputPercent} variant="fn">
            %
          </Key>
          <Key onClick={() => chooseOp("÷")} variant="op" active={pendingOp === "÷" && overwrite}>
            ÷
          </Key>

          <Key onClick={() => inputDigit("7")}>7</Key>
          <Key onClick={() => inputDigit("8")}>8</Key>
          <Key onClick={() => inputDigit("9")}>9</Key>
          <Key onClick={() => chooseOp("×")} variant="op" active={pendingOp === "×" && overwrite}>
            ×
          </Key>

          <Key onClick={() => inputDigit("4")}>4</Key>
          <Key onClick={() => inputDigit("5")}>5</Key>
          <Key onClick={() => inputDigit("6")}>6</Key>
          <Key onClick={() => chooseOp("-")} variant="op" active={pendingOp === "-" && overwrite}>
            −
          </Key>

          <Key onClick={() => inputDigit("1")}>1</Key>
          <Key onClick={() => inputDigit("2")}>2</Key>
          <Key onClick={() => inputDigit("3")}>3</Key>
          <Key onClick={() => chooseOp("+")} variant="op" active={pendingOp === "+" && overwrite}>
            +
          </Key>

          <Key onClick={() => inputDigit("0")} className="col-span-2">
            0
          </Key>
          <Key onClick={inputDot}>.</Key>
          <Key onClick={equals} variant="equals">
            =
          </Key>
        </div>
      </Card>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Tip: you can use your keyboard — numbers, + − * /, Enter, %, Backspace
        and Esc.
      </p>
    </div>
  );
}

function formatToRaw(n: number): string {
  return toDisplayString(n);
}

function Key({
  children,
  onClick,
  variant = "digit",
  active = false,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "digit" | "op" | "fn" | "equals";
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-16 items-center justify-center text-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        variant === "digit" && "bg-card hover:bg-accent",
        variant === "fn" &&
          "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
        variant === "op" && "bg-primary/10 text-primary hover:bg-primary/20",
        variant === "op" && active && "bg-primary text-primary-foreground",
        variant === "equals" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {children}
    </button>
  );
}
