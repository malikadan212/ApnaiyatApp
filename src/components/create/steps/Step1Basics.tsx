"use client";

import { Building2, User, Infinity as InfinityIcon, Moon, Repeat } from "lucide-react";
import { CATEGORIES } from "@/constants/campaigns";
import { cn } from "@/lib/utils";
import type { DraftCampaign } from "../CreateCampaignWizard";
import { StepNav } from "../CreateCampaignWizard";

interface Props {
  draft: DraftCampaign;
  onChange: (partial: Partial<DraftCampaign>) => void;
  onNext: () => void;
}

export default function Step1Basics({ draft, onChange, onNext }: Props) {
  const canProceed =
    !!draft.title?.trim() &&
    !!draft.organizer?.trim() &&
    !!draft.category &&
    !!draft.location?.trim() &&
    !!draft.description?.trim();

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground">The basics</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell donors what this campaign is about at a glance.
      </p>

      {/* Campaign type */}
      <div className="mt-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Campaign type
        </label>
        <div className="mt-2 flex gap-3">
          {(["individual", "ngo"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ type: t })}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-all",
                draft.type === t
                  ? "border-brand bg-brand/8 text-brand"
                  : "border-border text-muted-foreground hover:border-brand/50",
              )}
            >
              {t === "ngo" ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {t === "ngo" ? "NGO / Organisation" : "Individual"}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mt-5">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Campaign title <span className="text-brand">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Flood Relief for 50 Families in Sindh"
          value={draft.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={100}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <p className="mt-1 text-right text-[11px] text-muted-foreground">
          {draft.title?.length ?? 0}/100
        </p>
      </div>

      {/* Organizer */}
      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {draft.type === "ngo" ? "Organisation name" : "Your name"}{" "}
          <span className="text-brand">*</span>
        </label>
        <input
          type="text"
          placeholder={
            draft.type === "ngo" ? "e.g. Al-Khidmat Foundation" : "e.g. Ahmed Raza"
          }
          value={draft.organizer ?? ""}
          onChange={(e) => onChange({ organizer: e.target.value })}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* Category + Location row */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Category <span className="text-brand">*</span>
          </label>
          <select
            value={draft.category ?? ""}
            onChange={(e) =>
              onChange({ category: e.target.value as DraftCampaign["category"] })
            }
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="" disabled>
              Select…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Location <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Karachi, Pakistan"
            value={draft.location ?? ""}
            onChange={(e) => onChange({ location: e.target.value })}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      {/* Short description */}
      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Short description <span className="text-brand">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="One or two sentences that tell donors exactly what the funds will do."
          maxLength={160}
          value={draft.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <p className="mt-1 text-right text-[11px] text-muted-foreground">
          {draft.description?.length ?? 0}/160
        </p>
      </div>

      {/* Toggles */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Campaign flags
        </p>

        <Toggle
          icon={<Moon className="h-4 w-4" />}
          label="Zakat-eligible"
          description="Donations to this cause satisfy Zakat (tamleek condition met)"
          checked={!!draft.zakatEligible}
          onChange={(v) => onChange({ zakatEligible: v })}
        />

        <Toggle
          icon={<InfinityIcon className="h-4 w-4" />}
          label="Sadaqah Jariyah"
          description="An ongoing cause whose reward continues after death (well, school, trees…)"
          checked={!!draft.sadaqahJariyah}
          onChange={(v) => onChange({ sadaqahJariyah: v })}
        />

        <Toggle
          icon={<Repeat className="h-4 w-4" />}
          label="Enable monthly giving"
          description="Allow supporters to donate a recurring monthly amount"
          checked={!!draft.recurringEnabled}
          onChange={(v) => onChange({ recurringEnabled: v })}
        />

        {draft.recurringEnabled && (
          <div className="pl-10">
            <input
              type="text"
              placeholder="e.g. PKR 500/month feeds one child for 30 days"
              value={draft.monthlyImpact ?? ""}
              onChange={(e) => onChange({ monthlyImpact: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        )}
      </div>

      <StepNav
        onNext={onNext}
        nextDisabled={!canProceed}
        showBack={false}
        nextLabel="Continue to Story →"
      />
    </div>
  );
}

function Toggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all",
        checked
          ? "border-brand bg-brand/6"
          : "border-border hover:border-brand/40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 shrink-0",
          checked ? "text-brand" : "text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            checked ? "text-brand" : "text-foreground",
          )}
        >
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-secondary",
        )}
      >
        <div
          className={cn(
            "mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </div>
    </button>
  );
}
