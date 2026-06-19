import type { Campaign } from "@/types/campaign";

/**
 * Apnaiyat "Transparency Score" — a 0-100 rating of how accountable a campaign
 * is, based on verified proof activity rather than reputation alone. This
 * creates accountability pressure: campaigns that keep posting receipts and
 * hitting milestones score higher and earn donor trust.
 */

export type ScoreTier = "A+" | "A" | "B" | "C" | "New";

export interface ScoreBreakdownItem {
  label: string;
  earned: number;
  max: number;
}

export interface TransparencyScore {
  score: number;
  tier: ScoreTier;
  label: string;
  /** Tailwind text/bg classes keyed to the tier */
  color: string;
  ring: string;
  breakdown: ScoreBreakdownItem[];
}

const VERIFICATION_POINTS: Record<Campaign["verificationLevel"], number> = {
  ngo: 30,
  cnic: 20,
  unverified: 8,
};

function tierFor(score: number): {
  tier: ScoreTier;
  label: string;
  color: string;
  ring: string;
} {
  if (score >= 90)
    return { tier: "A+", label: "Exceptional", color: "text-brand", ring: "#2d6a4f" };
  if (score >= 80)
    return { tier: "A", label: "Excellent", color: "text-brand", ring: "#2d6a4f" };
  if (score >= 70)
    return { tier: "B", label: "Strong", color: "text-brand-mid", ring: "#52b788" };
  if (score >= 55)
    return { tier: "C", label: "Fair", color: "text-amber-600", ring: "#d97706" };
  return { tier: "New", label: "Building trust", color: "text-muted-foreground", ring: "#9ca3af" };
}

export function getTransparencyScore(campaign: Campaign): TransparencyScore {
  const updates = campaign.updates ?? [];
  const approved = updates.filter((u) => u.status === "approved");
  const milestones = campaign.milestones ?? [];

  // 1. Verification (max 30)
  const verification = VERIFICATION_POINTS[campaign.verificationLevel];

  // 2. Approved proof updates (max 36) — 12 points each
  const updatesPts = Math.min(36, approved.length * 12);

  // 3. Receipts on approved updates (max 12) — 2 points each
  const receiptTotal = approved.reduce((sum, u) => sum + u.receiptCount, 0);
  const receiptsPts = Math.min(12, receiptTotal * 2);

  // 4. Milestones reached (max 12)
  const milestonePts =
    milestones.length > 0
      ? Math.round(
          (milestones.filter((m) => m.reached).length / milestones.length) * 12,
        )
      : 0;

  // 5. Media & story baseline (max 10)
  const baselinePts = (campaign.image ? 6 : 0) + (campaign.story.length > 0 ? 4 : 0);

  const score = Math.min(
    100,
    verification + updatesPts + receiptsPts + milestonePts + baselinePts,
  );

  const { tier, label, color, ring } = tierFor(score);

  return {
    score,
    tier,
    label,
    color,
    ring,
    breakdown: [
      { label: "Identity verification", earned: verification, max: 30 },
      { label: "Proof-of-use updates", earned: updatesPts, max: 36 },
      { label: "Receipts uploaded", earned: receiptsPts, max: 12 },
      { label: "Milestones reached", earned: milestonePts, max: 12 },
      { label: "Story & media", earned: baselinePts, max: 10 },
    ],
  };
}
