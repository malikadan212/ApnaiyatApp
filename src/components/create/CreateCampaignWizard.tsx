"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import type { Campaign } from "@/types/campaign";
import Step1Basics from "./steps/Step1Basics";
import Step2Story from "./steps/Step2Story";
import Step3Goal from "./steps/Step3Goal";
import Step4Media from "./steps/Step4Media";
import Step5Review from "./steps/Step5Review";

export type DraftCampaign = Partial<Campaign> & {
  /** Object URL from local file upload — used for preview only */
  imagePreviewUrl?: string;
};

const STEPS = [
  { label: "Basics" },
  { label: "Story" },
  { label: "Goal" },
  { label: "Media" },
  { label: "Review" },
];

export default function CreateCampaignWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<DraftCampaign>({
    type: "individual",
    verificationLevel: "unverified",
    zakatEligible: false,
    sadaqahJariyah: false,
    recurringEnabled: false,
    badges: [],
    raised: 0,
    supporters: 0,
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    image: null,
  });

  function onChange(partial: Partial<DraftCampaign>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function goTo(index: number) {
    setDirection(index > step ? 1 : -1);
    setStep(index);
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Start a Campaign
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your cause with Pakistan. Every rupee tracked, every milestone
          verified.
        </p>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => i < step && goTo(i)}
            className="flex flex-1 flex-col items-center gap-1.5 group"
            disabled={i >= step}
          >
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-brand"
                animate={{ width: i < step ? "100%" : i === step ? "60%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                i <= step ? "text-brand" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {step === 0 && (
              <Step1Basics draft={draft} onChange={onChange} onNext={goNext} />
            )}
            {step === 1 && (
              <Step2Story
                draft={draft}
                onChange={onChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 2 && (
              <Step3Goal
                draft={draft}
                onChange={onChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <Step4Media
                draft={draft}
                onChange={onChange}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 4 && (
              <Step5Review draft={draft} onBack={goBack} onEdit={goTo} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Reusable nav row used inside each step */
export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  showBack = true,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-mid disabled:cursor-not-allowed disabled:opacity-40"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
