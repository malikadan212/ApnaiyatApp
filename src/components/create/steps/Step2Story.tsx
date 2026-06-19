"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DraftCampaign } from "../CreateCampaignWizard";
import { StepNav } from "../CreateCampaignWizard";

interface Props {
  draft: DraftCampaign;
  onChange: (partial: Partial<DraftCampaign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const STORY_HINTS = [
  "What happened, and why does it matter?",
  "Who will benefit — and how?",
  "How will the money be spent?",
  "What does success look like?",
  "A personal message to your donors.",
];

export default function Step2Story({ draft, onChange, onNext, onBack }: Props) {
  const paragraphs: string[] = draft.story?.length ? draft.story : [""];

  function updateParagraph(index: number, value: string) {
    const updated = [...paragraphs];
    updated[index] = value;
    onChange({ story: updated });
  }

  function addParagraph() {
    if (paragraphs.length >= 5) return;
    onChange({ story: [...paragraphs, ""] });
  }

  function removeParagraph(index: number) {
    if (paragraphs.length <= 1) return;
    const updated = paragraphs.filter((_, i) => i !== index);
    onChange({ story: updated });
  }

  const filledCount = paragraphs.filter((p) => p.trim().length > 0).length;
  const canProceed = filledCount >= 1 && paragraphs[0].trim().length > 20;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground">Tell your story</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Write in your own words. Honest, specific stories raise more. You can
        split it into up to 5 paragraphs.
      </p>

      {/* Tip strip */}
      <div className="mt-5 rounded-2xl bg-brand/6 border border-brand/15 p-4">
        <p className="text-xs font-semibold text-brand">
          What makes a great campaign story?
        </p>
        <ul className="mt-2 space-y-1">
          {STORY_HINTS.map((hint) => (
            <li
              key={hint}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <span className="mt-px text-brand">·</span>
              {hint}
            </li>
          ))}
        </ul>
      </div>

      {/* Paragraph inputs */}
      <div className="mt-6 space-y-3">
        {paragraphs.map((para, i) => (
          <div key={i} className="group relative">
            <div className="flex items-start gap-2">
              <GripVertical className="mt-3 h-4 w-4 shrink-0 text-muted-foreground/30" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Paragraph {i + 1}
                  </span>
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(i)}
                      className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  placeholder={`Paragraph ${i + 1}${i === 0 ? " — start with the most important thing" : "…"}`}
                  value={para}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  className={cn(
                    "w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors",
                    para.trim().length > 0
                      ? "border-brand/40 focus:border-brand"
                      : "border-border focus:border-brand",
                  )}
                />
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  {para.length} chars
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add paragraph */}
      {paragraphs.length < 5 && (
        <button
          type="button"
          onClick={addParagraph}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-brand/40 px-4 py-2.5 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand/6"
        >
          <Plus className="h-4 w-4" />
          Add paragraph
        </button>
      )}

      {/* Word count guidance */}
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filledCount} of {paragraphs.length} paragraph
          {paragraphs.length !== 1 ? "s" : ""} written
        </span>
        <span
          className={cn(
            "font-semibold",
            canProceed ? "text-brand" : "text-muted-foreground",
          )}
        >
          {canProceed ? "Looking good!" : "Write at least one paragraph to continue"}
        </span>
      </div>

      <StepNav
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!canProceed}
        nextLabel="Continue to Goal →"
      />
    </div>
  );
}
