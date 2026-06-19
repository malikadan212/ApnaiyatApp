"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Repeat, Pause, Play, X, AlertTriangle, Calendar, Moon } from "lucide-react";
import type { RecurringPledge } from "@/lib/mockDonorData";
import { cn } from "@/lib/utils";

interface Props {
  pledges: RecurringPledge[];
  setPledges: React.Dispatch<React.SetStateAction<RecurringPledge[]>>;
}

export default function RecurringDonations({ pledges, setPledges }: Props) {
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  function togglePause(id: string) {
    setPledges((prev) =>
      prev.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p)),
    );
  }

  function cancelPledge(id: string) {
    setPledges((prev) => prev.filter((p) => p.id !== id));
    setConfirmCancel(null);
  }

  const active = pledges.filter((p) => !p.paused);
  const paused = pledges.filter((p) => p.paused);
  const monthlyTotal = active.reduce((s, p) => s + p.amountPerMonth, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      {pledges.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-brand/15 bg-brand/5 px-5 py-3">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold text-foreground">
              {active.length} active pledge{active.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-sm font-bold text-brand">
            PKR {monthlyTotal.toLocaleString("en-PK")} / month
          </span>
        </div>
      )}

      {pledges.length === 0 && (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-secondary/20 py-16 text-center">
          <Repeat className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            No recurring donations
          </p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Set up a monthly pledge from any campaign page to see it here.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-mid"
          >
            Browse campaigns
          </Link>
        </div>
      )}

      <AnimatePresence>
        {pledges.map((pledge) => (
          <motion.div
            key={pledge.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28 }}
            className={cn(
              "rounded-2xl border bg-card p-5 transition-colors",
              pledge.paused ? "border-border opacity-70" : "border-border",
            )}
          >
            {/* Top row */}
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br",
                  pledge.campaignGradient,
                )}
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/campaign/${pledge.campaignId}`}
                  className="text-sm font-semibold text-foreground hover:text-brand transition-colors line-clamp-1"
                >
                  {pledge.campaignTitle}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-bold text-brand">
                    <Repeat className="h-3 w-3" />
                    PKR {pledge.amountPerMonth.toLocaleString("en-PK")} / month
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    {pledge.givingType === "Zakat" && <Moon className="h-3 w-3" />}
                    {pledge.givingType}
                  </span>
                  {pledge.paused && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      Paused
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Next payment info */}
            {!pledge.paused && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Next payment: <span className="font-semibold text-foreground">{pledge.nextPaymentDate}</span>
                <span className="mx-1">·</span>
                Started {pledge.startedDate}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePause(pledge.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
                  pledge.paused
                    ? "border-brand bg-brand/8 text-brand hover:bg-brand/15"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {pledge.paused ? (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    Pause
                  </>
                )}
              </button>

              {confirmCancel === pledge.id ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Sure?
                  </span>
                  <button
                    type="button"
                    onClick={() => cancelPledge(pledge.id)}
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                  >
                    Yes, cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmCancel(null)}
                    className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Keep it
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(pledge.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-red-300 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {paused.length > 0 && active.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {paused.length} paused pledge{paused.length !== 1 ? "s" : ""} above
        </p>
      )}
    </div>
  );
}
