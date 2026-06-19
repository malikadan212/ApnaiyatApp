"use client";

import { motion } from "motion/react";
import { Info, ShieldCheck } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import { getTransparencyScore } from "@/utils/healthScore";
import { cn } from "@/lib/utils";

/** A small score ring with the letter grade inside. */
function ScoreRing({
  score,
  ring,
  size = 44,
  stroke = 4,
  grade,
  gradeClass,
}: {
  score: number;
  ring: string;
  size?: number;
  stroke?: number;
  grade: string;
  gradeClass: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-secondary"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-xs font-bold",
          gradeClass,
        )}
      >
        {grade}
      </span>
    </div>
  );
}

/** Compact badge for cards. */
export function TransparencyPill({ campaign }: { campaign: Campaign }) {
  const s = getTransparencyScore(campaign);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow backdrop-blur">
      <ShieldCheck className="h-3.5 w-3.5" style={{ color: s.ring }} />
      <span className="tabular-nums">{s.score}</span>
      <span className={cn("font-bold", s.color)}>{s.tier}</span>
    </span>
  );
}

/** Full breakdown card for the campaign detail page. */
export function TransparencyCard({ campaign }: { campaign: Campaign }) {
  const s = getTransparencyScore(campaign);

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <ScoreRing
          score={s.score}
          ring={s.ring}
          grade={s.tier}
          gradeClass={s.color}
          size={44}
          stroke={4}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-bold text-foreground">Transparency Score</h3>
            <span className="group relative">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="pointer-events-none absolute left-1/2 top-5 z-20 w-48 -translate-x-1/2 rounded-xl bg-foreground px-3 py-2 text-[11px] leading-relaxed text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Based on verified proof activity — not reputation.
              </span>
            </span>
          </div>
          <p className={cn("text-xs font-semibold", s.color)}>
            {s.score}/100 · {s.label}
          </p>
        </div>
      </div>

      {/* Breakdown — single-line rows */}
      <div className="mt-4 space-y-2">
        {s.breakdown.map((item) => {
          const pct = Math.round((item.earned / item.max) * 100);
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-32 shrink-0 text-[11px] text-muted-foreground truncate">
                {item.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: s.ring }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[11px] font-semibold tabular-nums text-foreground">
                {item.earned}/{item.max}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
