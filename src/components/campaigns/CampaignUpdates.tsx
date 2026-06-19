"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  FileText,
  ImageIcon,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import type { CampaignUpdate } from "@/types/campaign";
import { formatPKRFull } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function CampaignUpdates({
  updates,
}: {
  updates?: CampaignUpdate[];
}) {
  const isEmpty = !updates || updates.length === 0;

  return (
    <div className="mt-14">
      {/* Section label */}
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
          <Receipt className="h-4 w-4 text-brand" />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
          Proof of Use
        </span>
      </div>

      {/* Explainer */}
      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Campaign runners submit receipts and photos as funds are spent.
          Every update is{" "}
          <span className="font-semibold text-foreground">
            reviewed and approved by Apnaiyat
          </span>{" "}
          before it appears here — so you always know exactly where your rupees
          went.
        </p>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/20 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Clock className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            No updates yet
          </p>
          <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Updates will appear here as the campaign runner submits proof of
            spending. Funds are only released when proof is approved.
          </p>
        </div>
      ) : (
        /* Timeline */
        <div className="relative mt-8 overflow-x-clip pl-10">
          {/* Vertical rail */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border" />

          <div className="space-y-7">
            {updates.map((update, i) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute -left-10 top-4 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2",
                    update.status === "approved"
                      ? "border-brand bg-card text-brand"
                      : "border-amber-400 bg-card text-amber-500",
                  )}
                >
                  {update.status === "approved" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>

                {/* Card */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  {/* Card header bar */}
                  <div
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5",
                    )}
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      {update.date}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                        update.status === "approved"
                          ? "bg-brand/10 text-brand"
                          : "bg-amber-50 text-amber-600",
                      )}
                    >
                      {update.status === "approved" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Verified by Apnaiyat
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          Under Review
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h4 className="text-base font-semibold text-foreground">
                      {update.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {update.description}
                    </p>

                    {/* Meta chips */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {update.amountSpent != null && update.amountSpent > 0 && (
                        <span className="flex items-center gap-1.5 rounded-xl bg-brand/8 px-3 py-1.5 text-xs font-semibold text-brand">
                          <Receipt className="h-3.5 w-3.5" />
                          {formatPKRFull(update.amountSpent)} spent
                        </span>
                      )}
                      {update.receiptCount > 0 && (
                        <span className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          {update.receiptCount} receipt
                          {update.receiptCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {update.photoCount > 0 && (
                        <span className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          <ImageIcon className="h-3.5 w-3.5" />
                          {update.photoCount} photo
                          {update.photoCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Mock photo thumbnails */}
                    {update.photoGradients && update.photoGradients.length > 0 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {update.photoGradients.map((grad, gi) => (
                          <div
                            key={gi}
                            className={cn(
                              "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br",
                              grad,
                            )}
                          >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                              <ImageIcon className="h-6 w-6 text-white/70" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
