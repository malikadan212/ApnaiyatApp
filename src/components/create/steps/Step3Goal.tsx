"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DraftCampaign } from "../CreateCampaignWizard";
import { StepNav } from "../CreateCampaignWizard";
import type { Milestone } from "@/types/campaign";

interface Props {
  draft: DraftCampaign;
  onChange: (partial: Partial<DraftCampaign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_GOALS = [50_000, 100_000, 250_000, 500_000, 1_000_000];

function formatPKRInput(val: number) {
  if (!val) return "";
  return val.toLocaleString("en-PK");
}

function parsePKR(str: string) {
  return parseInt(str.replace(/[^0-9]/g, ""), 10) || 0;
}

export default function Step3Goal({ draft, onChange, onNext, onBack }: Props) {
  const goal = draft.goal ?? 0;
  const daysLeft = draft.daysLeft ?? 30;
  const milestones: Milestone[] = draft.milestones ?? [];

  const [rawGoal, setRawGoal] = useState(goal > 0 ? formatPKRInput(goal) : "");
  const [newMilestoneLabel, setNewMilestoneLabel] = useState("");
  const [newMilestoneAmount, setNewMilestoneAmount] = useState("");

  function setGoal(val: number) {
    onChange({ goal: val });
    setRawGoal(formatPKRInput(val));
  }

  function handleGoalInput(raw: string) {
    setRawGoal(raw.replace(/[^0-9,]/g, ""));
    const parsed = parsePKR(raw);
    if (parsed >= 0) onChange({ goal: parsed });
  }

  function handleGoalBlur() {
    setRawGoal(formatPKRInput(goal));
  }

  function addMilestone() {
    if (!newMilestoneLabel.trim() || milestones.length >= 4) return;
    const m: Milestone = {
      id: `m-${Date.now()}`,
      label: newMilestoneLabel.trim(),
      amountReleased: parsePKR(newMilestoneAmount) || undefined,
      reached: false,
    };
    onChange({ milestones: [...milestones, m] });
    setNewMilestoneLabel("");
    setNewMilestoneAmount("");
  }

  function removeMilestone(id: string) {
    onChange({ milestones: milestones.filter((m) => m.id !== id) });
  }

  const canProceed = goal >= 10_000 && daysLeft >= 7;

  // Fund tracker preview
  const totalAllocated = milestones.reduce(
    (s, m) => s + (m.amountReleased ?? 0),
    0,
  );
  const allocationPct = goal > 0 ? Math.min((totalAllocated / goal) * 100, 100) : 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground">Goal & milestones</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Set your funding target, campaign length, and proof-gated milestones.
      </p>

      {/* Goal input */}
      <div className="mt-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Fundraising goal (PKR) <span className="text-brand">*</span>
        </label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            PKR
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={rawGoal}
            onChange={(e) => handleGoalInput(e.target.value)}
            onBlur={handleGoalBlur}
            className="w-full rounded-xl border border-border bg-background py-3 pl-14 pr-4 text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* Preset chips */}
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESET_GOALS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setGoal(p)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                goal === p
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted-foreground hover:border-brand/50",
              )}
            >
              {p >= 100_000 ? `${p / 100_000}L` : `${p / 1_000}k`}
            </button>
          ))}
        </div>
      </div>

      {/* Duration slider */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Campaign duration
          </label>
          <span className="text-sm font-bold text-brand">{daysLeft} days</span>
        </div>
        <input
          type="range"
          min={7}
          max={90}
          step={1}
          value={daysLeft}
          onChange={(e) => onChange({ daysLeft: Number(e.target.value) })}
          className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-brand"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>7 days</span>
          <span>90 days</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Milestones
            </label>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Funds are released only after each milestone is verified (up to 4)
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {milestones.length}/4
          </span>
        </div>

        {/* Existing milestones */}
        {milestones.length > 0 && (
          <ol className="mt-3 space-y-2">
            {milestones.map((m, i) => (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {m.label}
                  </p>
                  {m.amountReleased != null && m.amountReleased > 0 && (
                    <p className="text-[11px] text-brand">
                      PKR {m.amountReleased.toLocaleString("en-PK")} to release
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(m.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ol>
        )}

        {/* Add milestone row */}
        {milestones.length < 4 && (
          <div className="mt-3 rounded-xl border border-dashed border-brand/30 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Milestone label (e.g. Purchase materials)"
                value={newMilestoneLabel}
                onChange={(e) => setNewMilestoneLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="PKR amount"
                value={newMilestoneAmount}
                onChange={(e) =>
                  setNewMilestoneAmount(e.target.value.replace(/[^0-9]/g, ""))
                }
                onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none"
              />
              <button
                type="button"
                onClick={addMilestone}
                disabled={!newMilestoneLabel.trim()}
                className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-brand-mid transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live fund tracker preview */}
      {goal > 0 && milestones.length > 0 && (
        <div className="mt-6 rounded-2xl border border-brand/15 bg-brand/4 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand">
            Fund tracker preview
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-mid transition-all duration-500"
              style={{ width: `${allocationPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            PKR {totalAllocated.toLocaleString("en-PK")} allocated across{" "}
            {milestones.length} milestone
            {milestones.length !== 1 ? "s" : ""}
            {goal > 0 && ` · ${Math.round(allocationPct)}% of goal`}
          </p>
          <ol className="mt-3 space-y-1.5">
            {milestones.map((m, i) => (
              <li key={m.id} className="flex items-center gap-2 text-xs">
                <Circle className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                <span className="flex-1 text-foreground">{m.label}</span>
                {m.amountReleased != null && m.amountReleased > 0 && (
                  <span className="font-semibold text-brand">
                    PKR {m.amountReleased.toLocaleString("en-PK")}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {!canProceed && goal > 0 && goal < 10_000 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Minimum goal is PKR 10,000
        </p>
      )}

      <StepNav
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!canProceed}
        nextLabel="Continue to Media →"
      />
    </div>
  );
}
