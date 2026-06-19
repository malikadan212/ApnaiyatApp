"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Flag, Unlock } from "lucide-react";
import type { Milestone } from "@/types/campaign";
import { cn } from "@/lib/utils";

interface Props {
  milestones: Milestone[];
  onToggle: (id: string) => void;
}

export default function MilestonePanel({ milestones, onToggle }: Props) {
  const reachedCount = milestones.filter((m) => m.reached).length;

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold text-foreground">Milestones</h3>
        </div>
        {milestones.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {reachedCount}/{milestones.length} reached
          </span>
        )}
      </div>

      {milestones.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border bg-secondary/20 py-8 text-center">
          <Flag className="h-6 w-6 text-muted-foreground/40" />
          <p className="mt-2 text-xs font-semibold text-foreground">
            No milestones yet
          </p>
          <p className="mt-1 max-w-[200px] text-[11px] leading-relaxed text-muted-foreground">
            Add milestones when creating or editing your campaign to unlock
            proof-gated fund releases.
          </p>
        </div>
      ) : (
        <>
          {/* Mini progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-mid"
              animate={{
                width: `${milestones.length > 0 ? Math.round((reachedCount / milestones.length) * 100) : 0}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <ol className="mt-4 space-y-2.5">
            {milestones.map((m, i) => (
              <li
                key={m.id}
                className={cn(
                  "group rounded-2xl border p-3.5 transition-all",
                  m.reached
                    ? "border-brand/20 bg-brand/5"
                    : "border-border bg-background",
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      m.reached
                        ? "bg-brand text-primary-foreground"
                        : "border-2 border-border bg-card text-muted-foreground",
                    )}
                  >
                    {m.reached ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold leading-snug",
                        m.reached ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {m.label}
                    </p>

                    <AnimatePresence>
                      {m.reached && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {m.amountReleased != null &&
                              m.amountReleased > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                                  <Unlock className="h-3 w-3" />
                                  PKR{" "}
                                  {m.amountReleased.toLocaleString("en-PK")}{" "}
                                  released
                                </span>
                              )}
                            {m.date && (
                              <span className="text-[11px] text-muted-foreground">
                                {m.date}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => onToggle(m.id)}
                    className={cn(
                      "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all",
                      m.reached
                        ? "bg-secondary text-muted-foreground hover:bg-red-50 hover:text-red-600"
                        : "bg-brand text-primary-foreground hover:bg-brand-mid",
                    )}
                  >
                    {m.reached ? "Undo" : "Mark reached"}
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {reachedCount === milestones.length && milestones.length > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-brand/8 border border-brand/15 px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
              <p className="text-xs font-semibold text-brand">
                All milestones reached — campaign complete!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
