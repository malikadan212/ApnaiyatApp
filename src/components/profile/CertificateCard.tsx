"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Heart, User, Gift, Printer, Share2, X, Check } from "lucide-react";
import type { DonationRecord } from "@/lib/mockDonorData";
import { cn } from "@/lib/utils";

const DEDICATE_META: Record<
  NonNullable<DonationRecord["dedication"]>["type"],
  { label: string; preposition: string; icon: React.ElementType; color: string }
> = {
  "in-memory": {
    label: "In memory of",
    preposition: "in loving memory of",
    icon: Heart,
    color: "text-rose-600",
  },
  "on-behalf": {
    label: "On behalf of",
    preposition: "on behalf of",
    icon: User,
    color: "text-brand",
  },
  gift: {
    label: "Gift for",
    preposition: "as a gift for",
    icon: Gift,
    color: "text-amber-600",
  },
};

interface CertProps {
  donation: DonationRecord;
  donorName: string;
  onClose?: () => void;
  printMode?: boolean;
}

function Certificate({ donation, donorName, printMode = false }: CertProps) {
  const meta = DEDICATE_META[donation.dedication!.type];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-brand/30 bg-card p-8",
        printMode && "rounded-none border-4 border-[#1b3a2c] p-10",
      )}
    >
      {/* Decorative corner marks */}
      <div className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-brand/30" />
      <div className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-brand/30" />
      <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-brand/30" />
      <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-brand/30" />

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
          <Award className="h-6 w-6 text-brand" />
        </div>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Apnaiyat · Certificate of Giving
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          This is to certify that
        </p>
      </div>

      {/* Donor name */}
      <p className="mt-4 text-center font-heading text-2xl font-extrabold text-foreground">
        {donorName}
      </p>

      {/* Certificate body */}
      <div className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
        gave{" "}
        <span className="font-bold text-foreground">
          PKR {donation.amount.toLocaleString("en-PK")}
        </span>{" "}
        as{" "}
        <span className="font-semibold text-foreground">
          {donation.givingType}
        </span>{" "}
        {meta.preposition}{" "}
        <span className={cn("font-bold", meta.color)}>
          {donation.dedication!.name}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-foreground">
          {donation.campaignTitle}
        </span>
        .
      </div>

      {/* Divider */}
      <div className="mx-auto mt-5 flex w-20 items-center gap-2">
        <div className="h-px flex-1 bg-brand/20" />
        <Icon className={cn("h-4 w-4 shrink-0", meta.color)} />
        <div className="h-px flex-1 bg-brand/20" />
      </div>

      {/* Footer meta */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{donation.date}</span>
        <span className="font-mono">{donation.receiptNumber}</span>
      </div>

      {/* Seal */}
      <div className="mt-5 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/6 px-4 py-1.5">
          <div className="h-2 w-2 rounded-full bg-brand" />
          <span className="text-[11px] font-semibold text-brand">
            Verified by Apnaiyat
          </span>
        </div>
      </div>
    </div>
  );
}

interface TabProps {
  donations: DonationRecord[];
  donorName: string;
}

export default function CertificatesTab({ donations, donorName }: TabProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const activeDonation = donations.find((d) => d.id === open);

  function handlePrint() {
    if (!printRef.current) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Certificate of Giving — Apnaiyat</title>
          <style>
            body { margin: 40px; font-family: Georgia, serif; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  }

  function handleShare(donation: DonationRecord) {
    const meta = DEDICATE_META[donation.dedication!.type];
    const text = `${donorName} gave PKR ${donation.amount.toLocaleString("en-PK")} as ${donation.givingType} ${meta.preposition} ${donation.dedication!.name} to "${donation.campaignTitle}" via Apnaiyat.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-secondary/20 py-16 text-center">
        <Award className="h-8 w-8 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-semibold text-foreground">
          No certificates yet
        </p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
          Dedicate a donation &ldquo;in memory of&rdquo; or &ldquo;on behalf of&rdquo; someone and your
          certificate will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {donations.map((d, i) => {
          const meta = DEDICATE_META[d.dedication!.type];
          const Icon = meta.icon;

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <Icon className={cn("h-5 w-5", meta.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {meta.label}{" "}
                  <span className={meta.color}>{d.dedication!.name}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  PKR {d.amount.toLocaleString("en-PK")} · {d.campaignTitle}
                </p>
                <p className="text-[11px] text-muted-foreground">{d.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(d.id)}
                className="shrink-0 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                View
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Certificate modal */}
      <AnimatePresence>
        {open && activeDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md"
            >
              {/* Modal header */}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Certificate of Giving
                </p>
                <button
                  onClick={() => setOpen(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Certificate
                donation={activeDonation}
                donorName={donorName}
              />

              {/* Hidden print copy */}
              <div className="hidden" ref={printRef}>
                <Certificate
                  donation={activeDonation}
                  donorName={donorName}
                  printMode
                />
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(activeDonation)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-mid"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Copy & Share
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
