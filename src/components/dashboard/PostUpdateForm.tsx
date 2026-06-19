"use client";

import { useState } from "react";
import { Plus, Minus, Send, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignUpdate } from "@/types/campaign";

interface Props {
  onSubmit: (update: CampaignUpdate) => void;
}

const PHOTO_GRADIENTS = [
  { label: "Forest", value: "from-emerald-500 via-teal-600 to-cyan-700" },
  { label: "Sunset", value: "from-orange-400 via-rose-500 to-pink-600" },
  { label: "Ocean", value: "from-blue-400 via-cyan-500 to-teal-600" },
  { label: "Earth", value: "from-amber-500 via-orange-600 to-red-700" },
  { label: "Dusk", value: "from-violet-500 via-purple-600 to-indigo-700" },
  { label: "Sand", value: "from-yellow-400 via-amber-500 to-orange-600" },
  { label: "Pine", value: "from-green-500 via-emerald-600 to-teal-700" },
  { label: "Dawn", value: "from-rose-400 via-pink-500 to-fuchsia-600" },
  { label: "Slate", value: "from-slate-500 via-gray-600 to-zinc-700" },
  { label: "Jade", value: "from-teal-400 via-green-500 to-emerald-600" },
];

const EMPTY = {
  title: "",
  description: "",
  amountSpent: "",
  receiptCount: 0,
  photoCount: 0,
  photoGradients: [] as string[],
};

function Stepper({
  value,
  onChange,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-l-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-5 text-center text-sm font-bold tabular-nums text-foreground">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function PostUpdateForm({ onSubmit }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = form.title.trim().length > 3 && form.description.trim().length > 10;

  function set<K extends keyof typeof EMPTY>(key: K, val: (typeof EMPTY)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function toggleGradient(g: string) {
    set(
      "photoGradients",
      form.photoGradients.includes(g)
        ? form.photoGradients.filter((x) => x !== g)
        : [...form.photoGradients, g],
    );
  }

  function handleSubmit() {
    if (!canSubmit) return;

    const update: CampaignUpdate = {
      id: `u-${Date.now()}`,
      date: new Date().toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      title: form.title.trim(),
      description: form.description.trim(),
      amountSpent: form.amountSpent
        ? parseInt(form.amountSpent.replace(/,/g, ""), 10) || undefined
        : undefined,
      receiptCount: form.receiptCount,
      photoCount: form.photoCount,
      status: "pending",
      photoGradients: form.photoGradients,
    };

    onSubmit(update);
    setForm(EMPTY);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
          <Send className="h-4 w-4 text-brand" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Post a proof update</h2>
          <p className="text-xs text-muted-foreground">
            Each verified update boosts your Transparency Score
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Update title <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Ration packs delivered to all 50 families"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            maxLength={100}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Description <span className="text-brand">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe what was done and how the funds were spent…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* Amount + counts row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Amount spent
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                PKR
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={form.amountSpent}
                onChange={(e) =>
                  set(
                    "amountSpent",
                    e.target.value.replace(/[^0-9,]/g, ""),
                  )
                }
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Receipts
            </label>
            <Stepper
              value={form.receiptCount}
              onChange={(v) => set("receiptCount", v)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              Photos
            </label>
            <Stepper
              value={form.photoCount}
              onChange={(v) => set("photoCount", v)}
            />
          </div>
        </div>

        {/* Photo gradient picker */}
        {form.photoCount > 0 && (
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Mock photo thumbnails
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Select colour placeholders for your {form.photoCount} photo
              {form.photoCount > 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {PHOTO_GRADIENTS.map((g) => {
                const selected = form.photoGradients.includes(g.value);
                return (
                  <button
                    key={g.value}
                    type="button"
                    title={g.label}
                    onClick={() => toggleGradient(g.value)}
                    className={cn(
                      "relative h-10 w-14 overflow-hidden rounded-lg border-2 transition-all",
                      selected
                        ? "border-brand scale-105"
                        : "border-transparent hover:border-brand/40",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        g.value,
                      )}
                    />
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit row */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {submitted ? (
            <span className="text-sm font-semibold text-brand">
              Submitted — pending Apnaiyat review
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Update will appear as &ldquo;Under Review&rdquo; until approved
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Submit update
          </button>
        </div>
      </div>
    </div>
  );
}
