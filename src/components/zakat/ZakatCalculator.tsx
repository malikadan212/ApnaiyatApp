"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Wallet,
  Landmark,
  Coins,
  Briefcase,
  HandCoins,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calculator,
  Info,
} from "lucide-react";
import {
  computeZakat,
  EMPTY_ASSETS,
  DEFAULT_GOLD_RATE,
  DEFAULT_SILVER_RATE,
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  type ZakatAssets,
} from "@/utils/zakat";
import { formatPKRFull } from "@/utils/format";
import { cn } from "@/lib/utils";

type FieldKey = keyof ZakatAssets;

const MONEY_FIELDS: {
  key: FieldKey;
  label: string;
  hint: string;
  icon: typeof Wallet;
}[] = [
  { key: "cash", label: "Cash in hand", hint: "Notes & coins at home", icon: Wallet },
  { key: "bank", label: "Bank balance", hint: "Savings & current accounts", icon: Landmark },
  { key: "businessAssets", label: "Business assets", hint: "Stock, inventory for sale", icon: Briefcase },
  { key: "receivables", label: "Money owed to you", hint: "Loans you expect back", icon: HandCoins },
];

export default function ZakatCalculator({
  onGive,
}: {
  onGive?: () => void;
}) {
  const [assets, setAssets] = useState<ZakatAssets>(EMPTY_ASSETS);
  const [goldRate, setGoldRate] = useState(DEFAULT_GOLD_RATE);
  const [silverRate, setSilverRate] = useState(DEFAULT_SILVER_RATE);

  const result = useMemo(
    () => computeZakat(assets, { goldRate, silverRate }),
    [assets, goldRate, silverRate],
  );

  const set = (key: FieldKey, value: string) =>
    setAssets((prev) => ({ ...prev, [key]: Number(value) || 0 }));

  const reset = () => {
    setAssets(EMPTY_ASSETS);
    setGoldRate(DEFAULT_GOLD_RATE);
    setSilverRate(DEFAULT_SILVER_RATE);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* ── Inputs ── */}
      <div className="space-y-6">
        {/* Cash group */}
        <Group
          title="Cash & Savings"
          subtitle="Everything you've held for the past lunar year"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {MONEY_FIELDS.map((f) => (
              <MoneyField
                key={f.key}
                icon={f.icon}
                label={f.label}
                hint={f.hint}
                value={assets[f.key]}
                onChange={(v) => set(f.key, v)}
              />
            ))}
          </div>
        </Group>

        {/* Gold & Silver */}
        <Group
          title="Gold & Silver"
          subtitle="Enter weight in grams — we value it at today's rate"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <MetalField
              label="Gold"
              accent="text-amber-500"
              grams={assets.goldGrams}
              onGrams={(v) => set("goldGrams", v)}
              rate={goldRate}
              onRate={(v) => setGoldRate(Number(v) || 0)}
              value={result.goldValue}
            />
            <MetalField
              label="Silver"
              accent="text-slate-400"
              grams={assets.silverGrams}
              onGrams={(v) => set("silverGrams", v)}
              rate={silverRate}
              onRate={(v) => setSilverRate(Number(v) || 0)}
              value={result.silverValue}
            />
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
            Rates are editable — update them to the current market price. Nisab is
            based on {GOLD_NISAB_GRAMS}g gold or {SILVER_NISAB_GRAMS}g silver.
          </p>
        </Group>

        {/* Liabilities */}
        <Group
          title="Liabilities"
          subtitle="Debts & bills due now — these are deducted"
        >
          <MoneyField
            icon={Receipt}
            label="Money you owe"
            hint="Outstanding debts, due bills, committee"
            value={assets.liabilities}
            onChange={(v) => set("liabilities", v)}
          />
        </Group>

        <button
          onClick={reset}
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
        >
          Reset calculator
        </button>
      </div>

      {/* ── Result (sticky) ── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1b3a2c] to-brand px-6 py-5 text-white">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Calculator className="h-4 w-4" />
              Your Zakat for this year
            </div>
            <p className="mt-2 font-heading text-4xl font-semibold tabular-nums">
              {formatPKRFull(Math.round(result.zakatDue))}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {result.meetsNisab
                ? "2.5% of your zakatable wealth"
                : "Your wealth is currently below Nisab"}
            </p>
          </div>

          {/* Body */}
          <div className="space-y-3 p-6">
            <Row label="Cash, bank & business" value={assets.cash + assets.bank + assets.businessAssets} />
            <Row label="Gold value" value={result.goldValue} />
            <Row label="Silver value" value={result.silverValue} />
            <Row label="Money owed to you" value={assets.receivables} />
            <Row label="Less: liabilities" value={-assets.liabilities} negative />

            <div className="my-1 border-t border-dashed border-border" />

            <Row label="Net zakatable wealth" value={result.netZakatable} bold />

            {/* Nisab status */}
            <div
              className={cn(
                "mt-3 flex items-start gap-2.5 rounded-2xl p-3 text-xs leading-relaxed",
                result.meetsNisab
                  ? "bg-brand/10 text-brand"
                  : "bg-amber-50 text-amber-700",
              )}
            >
              {result.meetsNisab ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>
                {result.meetsNisab
                  ? `Your wealth is above the Nisab threshold of ${formatPKRFull(Math.round(result.nisabThreshold))}, so Zakat is due.`
                  : `Nisab threshold is ${formatPKRFull(Math.round(result.nisabThreshold))}. No Zakat is obligatory until your wealth exceeds this.`}
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/#campaigns"
              onClick={onGive}
              className={cn(
                "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all active:translate-y-px",
                result.zakatDue > 0
                  ? "bg-brand text-primary-foreground hover:bg-brand-mid"
                  : "pointer-events-none bg-secondary text-muted-foreground",
              )}
            >
              Give your Zakat
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-center text-[11px] text-muted-foreground">
              Distribute to Zakat-eligible verified causes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Group({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MoneyField({
  icon: Icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: typeof Wallet;
  label: string;
  hint: string;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-brand" />
        {label}
      </span>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
          PKR
        </span>
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="h-11 w-full rounded-xl border border-border bg-background pl-12 pr-3 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30"
        />
      </div>
      <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
    </label>
  );
}

function MetalField({
  label,
  accent,
  grams,
  onGrams,
  rate,
  onRate,
  value,
}: {
  label: string;
  accent: string;
  grams: number;
  onGrams: (v: string) => void;
  rate: number;
  onRate: (v: string) => void;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <span className={cn("flex items-center gap-1.5 text-sm font-semibold", accent)}>
        <Coins className="h-4 w-4" />
        {label}
      </span>
      <div className="mt-3 space-y-2">
        <label className="block">
          <span className="text-[11px] font-medium text-muted-foreground">
            Weight (grams)
          </span>
          <input
            type="number"
            min={0}
            value={grams || ""}
            onChange={(e) => onGrams(e.target.value)}
            placeholder="0"
            className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-medium text-muted-foreground">
            Rate / gram (PKR)
          </span>
          <input
            type="number"
            min={0}
            value={rate || ""}
            onChange={(e) => onRate(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30"
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Value:{" "}
        <span className="font-semibold text-foreground">
          {formatPKRFull(Math.round(value))}
        </span>
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  negative,
}: {
  label: string;
  value: number;
  bold?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={cn(bold ? "font-semibold text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span
        className={cn(
          "tabular-nums",
          bold ? "text-base font-bold text-foreground" : "font-medium text-foreground",
          negative && "text-urgent",
        )}
      >
        {negative && value !== 0 ? "−" : ""}
        {formatPKRFull(Math.abs(Math.round(value)))}
      </span>
    </div>
  );
}
