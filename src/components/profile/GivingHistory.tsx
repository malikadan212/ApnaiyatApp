"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Repeat,
  Moon,
  Gift,
  Heart,
  User,
} from "lucide-react";
import type { DonationRecord } from "@/lib/mockDonorData";
import { cn } from "@/lib/utils";

const TYPE_STYLE: Record<
  DonationRecord["givingType"],
  { label: string; className: string }
> = {
  Zakat: {
    label: "Zakat",
    className: "bg-brand/10 text-brand",
  },
  Sadaqah: {
    label: "Sadaqah",
    className: "bg-violet-100 text-violet-700",
  },
  General: {
    label: "General",
    className: "bg-secondary text-muted-foreground",
  },
};

const DEDICATE_LABEL: Record<
  NonNullable<DonationRecord["dedication"]>["type"],
  string
> = {
  "in-memory": "In memory of",
  "on-behalf": "On behalf of",
  gift: "Gift for",
};

const DEDICATE_ICON: Record<
  NonNullable<DonationRecord["dedication"]>["type"],
  React.ElementType
> = {
  "in-memory": Heart,
  "on-behalf": User,
  gift: Gift,
};

export default function GivingHistory({
  donations,
}: {
  donations: DonationRecord[];
}) {
  const sorted = [...donations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((d, i) => {
        const typeStyle = TYPE_STYLE[d.givingType];
        const DedIcon = d.dedication
          ? DEDICATE_ICON[d.dedication.type]
          : null;

        return (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            {/* Campaign thumbnail */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
              {d.campaignImage ? (
                <Image
                  src={d.campaignImage}
                  alt={d.campaignTitle}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    d.campaignGradient,
                  )}
                />
              )}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/campaign/${d.campaignId}`}
                  className="group flex items-center gap-1 text-sm font-semibold text-foreground hover:text-brand transition-colors"
                >
                  <span className="line-clamp-1">{d.campaignTitle}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <span className="shrink-0 text-sm font-bold text-foreground tabular-nums">
                  PKR {d.amount.toLocaleString("en-PK")}
                </span>
              </div>

              {/* Badges row */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    typeStyle.className,
                  )}
                >
                  {d.givingType === "Zakat" && (
                    <Moon className="h-3 w-3" />
                  )}
                  {typeStyle.label}
                </span>

                {d.frequency === "monthly" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Repeat className="h-3 w-3" />
                    Monthly
                  </span>
                )}

                {d.dedication && DedIcon && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    <DedIcon className="h-3 w-3" />
                    {DEDICATE_LABEL[d.dedication.type]}{" "}
                    <span className="font-semibold">{d.dedication.name}</span>
                  </span>
                )}
              </div>

              {/* Message */}
              {d.message && (
                <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground italic">
                  &ldquo;{d.message}&rdquo;
                </p>
              )}

              {/* Footer */}
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{d.date}</span>
                <span className="font-mono tracking-tight">{d.receiptNumber}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
