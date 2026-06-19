"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pencil,
  CheckCircle2,
  Heart,
  ShieldCheck,
  BadgeCheck,
  Phone,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DraftCampaign } from "../CreateCampaignWizard";

interface Props {
  draft: DraftCampaign;
  onBack: () => void;
  onEdit: (step: number) => void;
}

const NEXT_STEPS = [
  {
    icon: ShieldCheck,
    title: "Identity check",
    body: "We&apos;ll verify your CNIC or NGO registration within 1–2 business days.",
  },
  {
    icon: BadgeCheck,
    title: "Campaign review",
    body: "Our team reviews the story, goal and milestones for accuracy and completeness.",
  },
  {
    icon: Phone,
    title: "WhatsApp confirmation",
    body: "You&apos;ll receive a WhatsApp message once your campaign is live and accepting donations.",
  },
];

function FieldRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-foreground">{value}</div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
    </div>
  );
}

export default function Step5Review({ draft, onBack, onEdit }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const goal = draft.goal ?? 0;
  const goalFormatted =
    goal >= 100_000
      ? `PKR ${(goal / 100_000).toFixed(goal % 100_000 === 0 ? 0 : 1)}L`
      : goal >= 1_000
        ? `PKR ${(goal / 1_000).toFixed(goal % 1_000 === 0 ? 0 : 1)}k`
        : `PKR ${goal.toLocaleString("en-PK")}`;

  if (submitted) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-card p-8 text-center"
        >
          {/* Tick */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
            <CheckCircle2 className="h-8 w-8 text-brand" />
          </div>

          <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
            Submitted for review
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              &ldquo;{draft.title}&rdquo;
            </span>{" "}
            is in our review queue. Here&apos;s what happens next:
          </p>

          {/* Next steps */}
          <div className="mt-7 space-y-4 text-left">
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/8">
                  <s.icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {s.title}
                  </p>
                  <p
                    className="text-xs text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: s.body }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Verification tiers note */}
          <div className="mt-7 rounded-2xl border border-brand/15 bg-brand/4 p-4 text-left">
            <p className="text-xs font-semibold text-brand">
              Your verification tier affects donor trust
            </p>
            <div className="mt-3 flex items-center gap-0">
              {(
                [
                  ["Unverified", false],
                  ["CNIC Verified", false],
                  ["NGO Registered", false],
                ] as [string, boolean][]
              ).map(([tier], i, arr) => (
                <div key={tier} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className="h-0.5 flex-1 bg-secondary" />
                    )}
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border bg-secondary text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="h-0.5 flex-1 bg-secondary" />
                    )}
                  </div>
                  <span className="mt-1 text-center text-[10px] font-medium text-muted-foreground">
                    {tier}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Submit your CNIC or NGO registration certificate after approval to
              unlock higher trust tiers.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Browse campaigns
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-mid"
            >
              <Heart className="h-4 w-4" />
              Go to homepage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-5">
      {/* Campaign card mini-preview */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        {/* Cover preview */}
        <div className="relative h-40">
          {draft.imagePreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.imagePreviewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                draft.gradient,
              )}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-bold text-white leading-snug line-clamp-2">
              {draft.title || "Your campaign title"}
            </p>
            <p className="mt-0.5 text-xs text-white/70">
              by {draft.organizer || "—"} · {draft.location || "—"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-4 pb-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-brand to-brand-mid" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm font-bold text-foreground">PKR 0</span>
            <span className="text-xs font-semibold text-brand">0% funded</span>
          </div>
          <p className="text-xs text-muted-foreground">of {goalFormatted}</p>
        </div>
      </div>

      {/* Field summary */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground">Review your campaign</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Check everything before submitting for Apnaiyat review.
        </p>

        <div className="mt-4">
          <FieldRow
            label="Type"
            value={
              <span className="capitalize">
                {draft.type === "ngo" ? "NGO / Organisation" : "Individual"}
              </span>
            }
            onEdit={() => onEdit(0)}
          />
          <FieldRow
            label="Title"
            value={draft.title || <span className="text-muted-foreground">—</span>}
            onEdit={() => onEdit(0)}
          />
          <FieldRow
            label="Organiser"
            value={draft.organizer || <span className="text-muted-foreground">—</span>}
            onEdit={() => onEdit(0)}
          />
          <FieldRow
            label="Category · Location"
            value={
              <span>
                {draft.category || "—"} · {draft.location || "—"}
              </span>
            }
            onEdit={() => onEdit(0)}
          />
          <FieldRow
            label="Description"
            value={
              draft.description || (
                <span className="text-muted-foreground">—</span>
              )
            }
            onEdit={() => onEdit(0)}
          />

          <FieldRow
            label="Story"
            value={
              (draft.story?.filter((p) => p.trim()).length ?? 0) > 0 ? (
                <span>
                  {draft.story!.filter((p) => p.trim()).length} paragraph
                  {draft.story!.filter((p) => p.trim()).length !== 1 ? "s" : ""}{" "}
                  written
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )
            }
            onEdit={() => onEdit(1)}
          />

          <FieldRow
            label="Goal · Duration"
            value={
              <span>
                {goalFormatted} · {draft.daysLeft ?? "—"} days
              </span>
            }
            onEdit={() => onEdit(2)}
          />
          <FieldRow
            label="Milestones"
            value={
              (draft.milestones?.length ?? 0) > 0 ? (
                <span>
                  {draft.milestones!.length} milestone
                  {draft.milestones!.length !== 1 ? "s" : ""} defined
                </span>
              ) : (
                <span className="text-muted-foreground">None (optional)</span>
              )
            }
            onEdit={() => onEdit(2)}
          />

          <FieldRow
            label="Campaign flags"
            value={
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {draft.zakatEligible && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                    Zakat-eligible
                  </span>
                )}
                {draft.sadaqahJariyah && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                    Sadaqah Jariyah
                  </span>
                )}
                {draft.recurringEnabled && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                    Monthly giving
                  </span>
                )}
                {!draft.zakatEligible &&
                  !draft.sadaqahJariyah &&
                  !draft.recurringEnabled && (
                    <span className="text-muted-foreground">None</span>
                  )}
              </div>
            }
            onEdit={() => onEdit(0)}
          />

          <FieldRow
            label="Media"
            value={
              draft.imagePreviewUrl ? (
                "Photo uploaded"
              ) : (
                <span>
                  Using colour theme —{" "}
                  <span className="text-brand">
                    {draft.gradient?.split(" ")[0].replace("from-", "") ??
                      "default"}
                  </span>
                </span>
              )
            }
            onEdit={() => onEdit(3)}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="rounded-3xl border border-brand/20 bg-brand/4 p-5">
        <p className="text-sm font-semibold text-foreground">
          Ready to submit?
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your campaign will be reviewed by the Apnaiyat team before going
          live. This usually takes 1–2 business days.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-mid active:translate-y-px"
          >
            <Heart className="h-4 w-4" />
            Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}
