import { BadgeCheck, ShieldCheck, ShieldQuestion, CheckCircle2, Circle } from "lucide-react";
import type { VerificationLevel } from "@/types/campaign";
import { cn } from "@/lib/utils";

interface LevelMeta {
  label: string;
  short: string;
  description: string;
  /** Bullet-point checks that were completed at this tier */
  checks: string[];
  icon: typeof BadgeCheck;
  className: string;
  iconClassName: string;
}

export const VERIFICATION_META: Record<VerificationLevel, LevelMeta> = {
  ngo: {
    label: "Registered NGO",
    short: "NGO Verified",
    description:
      "Registered non-profit fully verified by Apnaiyat.",
    checks: [
      "SECP / trust registration certificate",
      "Active bank account confirmed",
      "Physical office address on file",
      "Authorized signatory CNIC verified",
    ],
    icon: ShieldCheck,
    className: "bg-brand/10 text-brand ring-1 ring-brand/20",
    iconClassName: "text-brand",
  },
  cnic: {
    label: "CNIC Verified",
    short: "CNIC Verified",
    description:
      "Individual identity confirmed by Apnaiyat.",
    checks: [
      "CNIC verified against NADRA records",
      "Live selfie matched to CNIC photo",
      "Supporting documents reviewed",
    ],
    icon: BadgeCheck,
    className: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/20",
    iconClassName: "text-sky-600",
  },
  unverified: {
    label: "Not Yet Verified",
    short: "Unverified",
    description:
      "This organiser has not completed identity verification yet.",
    checks: [
      "CNIC verification — pending",
      "Document review — pending",
    ],
    icon: ShieldQuestion,
    className: "bg-muted text-muted-foreground ring-1 ring-border",
    iconClassName: "text-muted-foreground",
  },
};

/** Compact pill — used on cards and inline next to organiser names. */
export function VerificationBadge({
  level,
  className,
}: {
  level: VerificationLevel;
  className?: string;
}) {
  const meta = VERIFICATION_META[level];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        meta.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.short}
    </span>
  );
}

const TIER_ORDER: VerificationLevel[] = ["unverified", "cnic", "ngo"];

const TIER_LABELS: Record<VerificationLevel, string> = {
  unverified: "No verification",
  cnic: "CNIC Verified",
  ngo: "Registered NGO",
};

/** The tier ladder shown on the campaign detail page. */
export function VerificationLadder({ level }: { level: VerificationLevel }) {
  const activeIndex = TIER_ORDER.indexOf(level);
  const activeMeta = VERIFICATION_META[level];
  const ActiveIcon = activeMeta.icon;

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            activeMeta.className,
          )}
        >
          <ActiveIcon className={cn("h-4 w-4", activeMeta.iconClassName)} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">{activeMeta.label}</h3>
          <p className="text-xs text-muted-foreground">{activeMeta.description}</p>
        </div>
      </div>

      {/* Checks */}
      <ul className="mt-3 space-y-1.5">
        {activeMeta.checks.map((check) => {
          const isPending = check.endsWith("— pending");
          return (
            <li key={check} className="flex items-center gap-2">
              {isPending ? (
                <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" />
              )}
              <span className={cn("text-xs", isPending ? "text-muted-foreground/50" : "text-foreground")}>
                {check}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Tier stepper */}
      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center gap-0">
          {TIER_ORDER.map((lvl, i) => {
            const reached = i <= activeIndex;
            const isActive = i === activeIndex;
            const TierIcon = VERIFICATION_META[lvl].icon;
            return (
              <div key={lvl} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-center">
                  {i > 0 && <div className={cn("h-0.5 flex-1", reached ? "bg-brand" : "bg-secondary")} />}
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isActive ? "border-brand bg-brand text-primary-foreground"
                      : reached ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-secondary text-muted-foreground",
                  )}>
                    <TierIcon className="h-3 w-3" />
                  </div>
                  {i < TIER_ORDER.length - 1 && <div className={cn("h-0.5 flex-1", i < activeIndex ? "bg-brand" : "bg-secondary")} />}
                </div>
                <span className={cn(
                  "text-center text-[10px] font-medium leading-tight",
                  isActive ? "text-brand" : reached ? "text-foreground" : "text-muted-foreground",
                )}>
                  {TIER_LABELS[lvl]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
