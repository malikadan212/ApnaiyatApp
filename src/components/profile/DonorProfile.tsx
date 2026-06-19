"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Repeat, Award, TrendingUp, Users, Calendar } from "lucide-react";
import {
  MOCK_DONOR,
  MOCK_DONATIONS,
  MOCK_RECURRING,
  type RecurringPledge,
} from "@/lib/mockDonorData";
import { cn } from "@/lib/utils";
import GivingHistory from "./GivingHistory";
import RecurringDonations from "./RecurringDonations";
import CertificatesTab from "./CertificateCard";

type Tab = "history" | "recurring" | "certificates";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "history", label: "Giving History", icon: Heart },
  { key: "recurring", label: "Recurring", icon: Repeat },
  { key: "certificates", label: "Certificates", icon: Award },
];

export default function DonorProfile() {
  const [tab, setTab] = useState<Tab>("history");
  const [tabDir, setTabDir] = useState(1);
  // Lifted here so impact bar stays in sync with pause/cancel actions
  const [pledges, setPledges] = useState<RecurringPledge[]>(MOCK_RECURRING);

  const totalGiven = MOCK_DONATIONS.reduce((s, d) => s + d.amount, 0);
  const uniqueCampaigns = new Set(MOCK_DONATIONS.map((d) => d.campaignId)).size;
  const activePledges = pledges.filter((r) => !r.paused).length;
  const certificates = MOCK_DONATIONS.filter((d) => d.dedication).length;

  function switchTab(next: Tab) {
    const order: Tab[] = ["history", "recurring", "certificates"];
    setTabDir(order.indexOf(next) > order.indexOf(tab) ? 1 : -1);
    setTab(next);
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-5"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-mid text-xl font-extrabold text-white shadow-lg">
          {MOCK_DONOR.initials}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {MOCK_DONOR.name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Member since {MOCK_DONOR.joinedDate}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 fill-brand text-brand" />
              Giving since 2025
            </span>
          </div>
        </div>
      </motion.div>

      {/* Impact bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          {
            icon: TrendingUp,
            label: "Total given",
            value: `PKR ${(totalGiven / 1000).toFixed(0)}k`,
            accent: true,
          },
          {
            icon: Users,
            label: "Campaigns",
            value: String(uniqueCampaigns),
            accent: false,
          },
          {
            icon: Repeat,
            label: "Monthly pledges",
            value: String(activePledges),
            accent: false,
          },
          {
            icon: Award,
            label: "Certificates",
            value: String(certificates),
            accent: false,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border p-4",
              s.accent
                ? "border-brand/20 bg-brand/6"
                : "border-border bg-card",
            )}
          >
            <s.icon
              className={cn(
                "h-4 w-4",
                s.accent ? "text-brand" : "text-muted-foreground",
              )}
            />
            <p
              className={cn(
                "mt-2 text-xl font-extrabold leading-none",
                s.accent ? "text-brand" : "text-foreground",
              )}
            >
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Tab bar */}
      <div className="mt-8 flex gap-1 rounded-2xl border border-border bg-secondary/40 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all",
              tab === t.key
                ? "bg-card text-brand shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
            {t.key === "recurring" && activePledges > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {activePledges}
              </span>
            )}
            {t.key === "certificates" && certificates > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {certificates}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={tabDir}>
          <motion.div
            key={tab}
            custom={tabDir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: "easeInOut" }}
          >
            {tab === "history" && <GivingHistory donations={MOCK_DONATIONS} />}
            {tab === "recurring" && (
              <RecurringDonations pledges={pledges} setPledges={setPledges} />
            )}
            {tab === "certificates" && (
              <CertificatesTab
                donations={MOCK_DONATIONS.filter((d) => d.dedication)}
                donorName={MOCK_DONOR.name}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
