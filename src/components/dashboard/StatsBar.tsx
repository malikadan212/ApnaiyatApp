"use client";

import { motion } from "motion/react";
import { TrendingUp, Users, Clock, Target, ShieldCheck } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import type { TransparencyScore } from "@/utils/healthScore";
import { formatPKR, formatPKRFull, fundedPercent } from "@/utils/format";
import { cn } from "@/lib/utils";

interface Props {
  campaign: Campaign;
  score: TransparencyScore;
}

export default function StatsBar({ campaign, score }: Props) {
  const pct = fundedPercent(campaign.raised, campaign.goal);
  const remaining = Math.max(0, campaign.goal - campaign.raised);

  const stats = [
    {
      icon: TrendingUp,
      label: "Raised",
      value: formatPKR(campaign.raised),
      sub: `of ${formatPKRFull(campaign.goal)}`,
      accent: true,
    },
    {
      icon: Target,
      label: "Funded",
      value: `${pct}%`,
      sub: `${formatPKR(remaining)} remaining`,
      accent: false,
    },
    {
      icon: Users,
      label: "Donors",
      value: campaign.supporters.toLocaleString("en-PK"),
      sub: "supporters",
      accent: false,
    },
    {
      icon: Clock,
      label: "Days Left",
      value: String(campaign.daysLeft),
      sub: campaign.daysLeft <= 3 ? "Almost over!" : "remaining",
      accent: false,
      urgent: campaign.daysLeft <= 3,
    },
    {
      icon: ShieldCheck,
      label: "Transparency",
      value: `${score.score}/100`,
      sub: score.label,
      accent: false,
      scoreColor: score.color,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="rounded-2xl border border-border bg-card px-5 py-4">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-semibold text-foreground">
            {formatPKR(campaign.raised)} raised
          </span>
          <span className="font-bold text-brand">{pct}% funded</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-mid"
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Goal: {formatPKRFull(campaign.goal)} · {formatPKR(remaining)} to go
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border p-4",
              s.accent
                ? "border-brand/20 bg-brand/6"
                : "border-border bg-card",
            )}
          >
            <div className="flex items-center gap-1.5">
              <s.icon
                className={cn(
                  "h-3.5 w-3.5",
                  s.accent
                    ? "text-brand"
                    : s.urgent
                      ? "text-red-500"
                      : "text-muted-foreground",
                )}
              />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </span>
            </div>
            <p
              className={cn(
                "mt-1.5 text-xl font-extrabold leading-none",
                s.accent
                  ? "text-brand"
                  : s.urgent
                    ? "text-red-600"
                    : s.scoreColor
                      ? s.scoreColor
                      : "text-foreground",
              )}
            >
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
