"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ExternalLink, LayoutDashboard } from "lucide-react";
import type { Campaign, CampaignUpdate, Milestone } from "@/types/campaign";
import { getTransparencyScore } from "@/utils/healthScore";
import { TransparencyCard } from "@/components/campaigns/TransparencyScore";
import { VerificationLadder } from "@/components/campaigns/VerificationBadge";
import CampaignUpdates from "@/components/campaigns/CampaignUpdates";
import StatsBar from "./StatsBar";
import PostUpdateForm from "./PostUpdateForm";
import MilestonePanel from "./MilestonePanel";

interface Props {
  campaign: Campaign;
}

export default function DashboardShell({ campaign }: Props) {
  const [updates, setUpdates] = useState<CampaignUpdate[]>(
    campaign.updates ?? [],
  );
  const [milestones, setMilestones] = useState<Milestone[]>(
    campaign.milestones ?? [],
  );
  const [toast, setToast] = useState<string | null>(null);

  // Derived campaign — keeps score cards reactive
  const liveCampaign: Campaign = { ...campaign, updates, milestones };
  const score = getTransparencyScore(liveCampaign);

  function handleNewUpdate(update: CampaignUpdate) {
    setUpdates((prev) => [update, ...prev]);
    showToast("Update submitted — pending Apnaiyat review");
  }

  function handleMilestoneToggle(id: string) {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              reached: !m.reached,
              date: !m.reached
                ? new Date().toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : undefined,
            }
          : m,
      ),
    );
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  const statusColor =
    campaign.daysLeft <= 3
      ? "bg-red-100 text-red-700"
      : campaign.daysLeft <= 10
        ? "bg-amber-100 text-amber-700"
        : "bg-brand/10 text-brand";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-2xl bg-[#1b3a2c] px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10">
            <LayoutDashboard className="h-5 w-5 text-brand" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-foreground line-clamp-1">
                {campaign.title}
              </h1>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}
              >
                {campaign.daysLeft} days left
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Campaign runner dashboard · {campaign.organizer}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${score.color} bg-secondary`}
          >
            Score: {score.score}/100 · {score.tier}
          </span>
          <Link
            href={`/campaign/${campaign.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <ExternalLink className="h-4 w-4" />
            View live page
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar campaign={liveCampaign} score={score} />

      {/* 2-col grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left — form + updates */}
        <div className="space-y-6 lg:col-span-2">
          <PostUpdateForm onSubmit={handleNewUpdate} />

          {/* Updates log */}
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-foreground">
                Proof of Use — Updates
              </h2>
              <span className="text-xs text-muted-foreground">
                {updates.filter((u) => u.status === "approved").length} approved
                · {updates.filter((u) => u.status === "pending").length} pending
              </span>
            </div>
            <CampaignUpdates updates={updates} />
          </div>
        </div>

        {/* Right rail — score, verification, milestones */}
        <div className="space-y-6">
          <TransparencyCard campaign={liveCampaign} />
          <VerificationLadder level={campaign.verificationLevel} />
          <MilestonePanel
            milestones={milestones}
            onToggle={handleMilestoneToggle}
          />
        </div>
      </div>
    </div>
  );
}
