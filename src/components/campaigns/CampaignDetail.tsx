"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Users,
  Clock,
  Flame,
  TrendingUp,
  Building2,
  User,
  Share2,
  Heart,
  ShieldCheck,
  Lock,
  Receipt,
  CheckCircle2,
  X,
  Target,
  Smartphone,
  Banknote,
  ChevronRight,
  Wallet,
  Circle,
  Repeat,
  Gift,
  MessageCircle,
  Award,
  Infinity as InfinityIcon,
  Moon,
} from "lucide-react";
import ShareSheet from "./ShareSheet";
import CampaignUpdates from "./CampaignUpdates";
import { VerificationLadder } from "./VerificationBadge";
import { TransparencyCard } from "./TransparencyScore";
import type { Campaign, Donor } from "@/types/campaign";
import { formatPKR, formatPKRFull, fundedPercent } from "@/utils/format";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [1_000, 2_500, 5_000, 10_000, 25_000, 50_000];

const AMOUNT_IMPACT: Record<number, string> = {
  1_000:  "Provides a meal for a family",
  2_500:  "Buys medicine for one week",
  5_000:  "Funds emergency supplies",
  10_000: "Sponsors a child for a month",
  25_000: "Covers 3 families for a week",
  50_000: "Major contribution — life changing",
};

type GivingType = "Zakat" | "Sadaqah" | "General";
const GIVING_TYPES: GivingType[] = ["Zakat", "Sadaqah", "General"];

type PayMethod = "easypaisa" | "jazzcash" | "bank";
const PAY_METHODS: { key: PayMethod; label: string; icon: string }[] = [
  { key: "easypaisa", label: "Easypaisa", icon: "EP" },
  { key: "jazzcash",  label: "JazzCash",  icon: "JC" },
  { key: "bank",      label: "Bank Transfer", icon: "🏦" },
];

type DedicateType = "in-memory" | "on-behalf" | "gift";
const DEDICATE_TYPES: { key: DedicateType; label: string; prefix: string }[] = [
  { key: "in-memory", label: "In memory of", prefix: "In loving memory of" },
  { key: "on-behalf", label: "On behalf of", prefix: "On behalf of" },
  { key: "gift",      label: "As a gift for", prefix: "A gift for" },
];

const protectionSteps = [
  {
    icon: ShieldCheck,
    title: "Verified & Validated",
    description:
      "Passed KYC, document checks and anti-fraud screening before going live.",
  },
  {
    icon: Lock,
    title: "Milestone Protected",
    description:
      "Funds are released to the campaign runner only after they submit verified proof of spending.",
  },
  {
    icon: Receipt,
    title: "Fully Transparent",
    description:
      "Live ledger, digital receipts and downloadable reports for every rupee.",
  },
];

export default function CampaignDetail({
  campaign,
  donors,
}: {
  campaign: Campaign;
  donors: Donor[];
}) {
  const percent = fundedPercent(campaign.raised, campaign.goal);
  const remaining = Math.max(0, campaign.goal - campaign.raised);
  const isUrgent = campaign.badges.includes("urgent");
  const isTrending = campaign.badges.includes("trending");

  const releasedAmount =
    campaign.milestones
      ?.filter((m) => m.reached)
      .reduce((sum, m) => sum + (m.amountReleased ?? 0), 0) ?? 0;
  const fundsHeld = Math.max(0, campaign.raised - releasedAmount);

  const [selected, setSelected] = useState<number>(PRESET_AMOUNTS[1]);
  const [custom, setCustom] = useState<string>("");
  const [givingType, setGivingType] = useState<GivingType>("Sadaqah");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [donorName, setDonorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("easypaisa");
  const [dedicate, setDedicate] = useState(false);
  const [dedicateType, setDedicateType] = useState<DedicateType>("in-memory");
  const [dedicateName, setDedicateName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [donated, setDonated] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  const dedicatePrefix = DEDICATE_TYPES.find((d) => d.key === dedicateType)!.prefix;

  const amount = custom ? Number(custom) || 0 : selected;
  const impact = AMOUNT_IMPACT[selected] ?? "Every rupee is verified and tracked";

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPct = scrollable > 0 ? window.scrollY / scrollable : 0;
      const pastTop = scrolledPct >= 0.1;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 240;
      setBarVisible(pastTop && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="overflow-x-hidden pb-28">
      {/* ───────────── Cinematic full-bleed hero ───────────── */}
      <section className="relative h-[68vh] min-h-[460px] w-full overflow-hidden">
        {campaign.image ? (
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div
            className={cn("absolute inset-0 bg-gradient-to-br", campaign.gradient)}
          />
        )}
        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* top bar */}
        <div className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="flex gap-2">
              {isUrgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-urgent px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  <Flame className="h-3.5 w-3.5" />
                  Urgent
                </span>
              )}
              {isTrending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand shadow-lg backdrop-blur">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Trending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8 lg:pb-36">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {campaign.type === "ngo" ? (
                    <Building2 className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                  {campaign.type === "ngo" ? "NGO Campaign" : "Individual Cause"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {campaign.category}
                </span>
                {campaign.sadaqahJariyah && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-light/90 px-3 py-1 text-xs font-semibold text-[#1b3a2c]">
                    <InfinityIcon className="h-3.5 w-3.5" />
                    Sadaqah Jariyah
                  </span>
                )}
                {campaign.zakatEligible && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <Moon className="h-3.5 w-3.5" />
                    Zakat-eligible
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-medium text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  {campaign.location}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                {campaign.title}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                  {campaign.type === "ngo" ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    {campaign.organizer}
                    {campaign.verified && (
                      <BadgeCheck className="h-4 w-4 text-brand-light" />
                    )}
                  </div>
                  <p className="text-xs text-white/70">{campaign.organizerNote}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────── Overlapping stats slab ───────────── */}
      <div className="mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:-mt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-black/10 sm:p-8"
        >
          <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[1.4fr_auto_1fr]">
            {/* Big raised number + progress band */}
            <div>
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {formatPKR(campaign.raised)}
                </span>
                <span className="pb-1.5 text-sm font-medium text-muted-foreground">
                  raised of {formatPKRFull(campaign.goal)}
                </span>
              </div>

              <div className="relative mt-5 h-4 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="relative h-full rounded-full bg-gradient-to-r from-brand to-brand-mid"
                >
                  <span className="absolute inset-0 animate-pulse bg-white/10" />
                </motion.div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-brand">{percent}% funded</span>
                <span className="font-medium text-muted-foreground">
                  {formatPKRFull(remaining)} to go
                </span>
              </div>
            </div>

            {/* divider */}
            <div className="hidden h-20 w-px bg-border lg:block" />

            {/* stat pills + CTA */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  icon={<Users className="h-4 w-4 text-brand" />}
                  value={campaign.supporters.toLocaleString("en-PK")}
                  label="Donors"
                />
                <StatTile
                  icon={<Clock className="h-4 w-4 text-brand" />}
                  value={String(campaign.daysLeft)}
                  label="Days left"
                />
              </div>
              <button
                onClick={() => setSheetOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/25 transition-all hover:bg-brand-mid hover:shadow-brand/40 active:translate-y-px"
              >
                <Heart className="h-4 w-4 fill-current" />
                Donate Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ───────────── Trust row ───────────── */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0"><TransparencyCard campaign={campaign} /></div>
          <div className="min-w-0"><VerificationLadder level={campaign.verificationLevel} /></div>
          {campaign.milestones && campaign.milestones.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brand" />
                <h3 className="text-sm font-bold text-foreground">Fund Tracker</h3>
              </div>

              {/* Mini bar */}
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-brand to-brand-mid transition-all duration-700"
                  style={{ width: `${campaign.raised > 0 ? Math.round((releasedAmount / campaign.raised) * 100) : 0}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {campaign.raised > 0 ? Math.round((releasedAmount / campaign.raised) * 100) : 0}% released against verified proof
              </p>

              {/* Milestones stepper */}
              <ol className="relative mt-4 space-y-3 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {campaign.milestones.map((m) => (
                  <li key={m.id} className="relative flex gap-3">
                    <div className={cn(
                      "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      m.reached ? "bg-brand text-primary-foreground" : "border-2 border-border bg-card text-muted-foreground",
                    )}>
                      {m.reached ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-xs font-semibold leading-snug", m.reached ? "text-foreground" : "text-muted-foreground")}>
                        {m.label}
                      </p>
                      {m.reached && m.amountReleased != null && (
                        <p className="text-[10px] text-brand">{formatPKRFull(m.amountReleased)} released{m.date ? ` · ${m.date}` : ""}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* ───────────── Editorial body ───────────── */}
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Side rail — comes FIRST on mobile so donate is reachable without scrolling */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-w-0 order-first lg:order-last lg:col-span-5 xl:col-span-4"
          >
            {/* Goal card */}
            <div className="rounded-3xl border border-border bg-gradient-to-br from-brand to-brand-mid p-6 text-primary-foreground">
              <Target className="h-7 w-7" />
              <p className="mt-3 text-sm text-primary-foreground/80">Our goal</p>
              <p className="text-3xl font-extrabold">
                {formatPKRFull(campaign.goal)}
              </p>
              <p className="mt-2 text-sm text-primary-foreground/90">
                {formatPKR(campaign.raised)} raised so far from{" "}
                {campaign.supporters.toLocaleString("en-PK")} kind donors.
              </p>
              <button
                onClick={() => setSheetOpen(true)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand transition-transform hover:scale-[1.02] active:scale-100"
              >
                <Heart className="h-4 w-4 fill-current" />
                Contribute
              </button>
            </div>

            {/* Protection stepper */}
            <div className="mt-6 rounded-3xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold text-foreground">
                How your donation is protected
              </h3>
              <ol className="relative mt-5 space-y-6 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {protectionSteps.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="relative flex gap-4">
                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {title}
                      </h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <button
                onClick={() => setShareOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Share2 className="h-4 w-4" />
                Share this campaign
              </button>

              <Link
                href={`/dashboard/${campaign.id}`}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/6 px-4 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
              >
                <ChevronRight className="h-4 w-4" />
                Manage this campaign
              </Link>
            </div>

            {/* Recent Supporters */}
            <div className="mt-6 rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Recent Supporters
                </h3>
                <span className="text-xs text-muted-foreground">
                  {campaign.supporters.toLocaleString("en-PK")} total
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {donors.map((donor, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-mid text-xs font-bold text-primary-foreground">
                      {donor.anonymous ? "?" : donor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {donor.anonymous ? "Anonymous" : donor.name}
                        </span>
                        <span className="shrink-0 text-xs font-bold text-brand">
                          {formatPKR(donor.amount)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {donor.timeAgo}
                      </span>
                      {donor.message && (
                        <p className="mt-1 text-xs italic text-muted-foreground">
                          &ldquo;{donor.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Story — comes second on mobile, first on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="min-w-0 lg:col-span-7 xl:col-span-8"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              The Story
            </span>
            <div className="mt-4 space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
              {campaign.story.map((para, i) => (
                <p
                  key={i}
                  className={cn(
                    i === 0 &&
                      "sm:first-letter:float-left sm:first-letter:mr-3 sm:first-letter:text-7xl sm:first-letter:font-extrabold sm:first-letter:leading-[0.8] sm:first-letter:text-brand",
                  )}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Proof of Use updates */}
            <CampaignUpdates updates={campaign.updates} />
          </motion.div>
        </div>
      </div>

      {/* ───────────── Sticky bottom action bar ───────────── */}
      <motion.div
        animate={{ y: barVisible ? 0 : 140, opacity: barVisible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-40"
      >
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="h-1 w-full bg-secondary">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-mid"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {formatPKR(campaign.raised)}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {percent}% funded
                  </span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {campaign.daysLeft} days left · {formatPKRFull(remaining)} to go
                </p>
              </div>
              <button
                onClick={() => setSheetOpen(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/25 transition-all hover:bg-brand-mid active:translate-y-px sm:px-8"
              >
                <Heart className="h-4 w-4 fill-current" />
                Donate
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────── Donation sheet ───────────── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-[2rem] border border-border bg-card shadow-2xl sm:bottom-4 sm:rounded-[2rem]"
            >
              {/* Drag handle */}
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-border sm:hidden" />

              {/* Scrollable content */}
              <div className="max-h-[90vh] overflow-y-auto p-6 pb-8">
                <button
                  onClick={() => setSheetOpen(false)}
                  className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>

                {donated ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10"
                    >
                      <CheckCircle2 className="h-10 w-10 text-brand" />
                    </motion.div>
                    <h3 className="mt-4 text-2xl font-bold text-foreground">JazakAllah Khair!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your{" "}
                      <span className="font-semibold text-brand">{givingType}</span> of{" "}
                      <span className="font-bold text-foreground">{formatPKRFull(amount)}</span>
                      {frequency === "monthly" && <span className="font-semibold text-brand"> every month</span>}{" "}
                      {!anonymous && donorName && `from ${donorName} `}
                      has been received for{" "}
                      <span className="font-semibold text-foreground">{campaign.title}</span>.
                    </p>

                    {/* Dedication certificate */}
                    {dedicate && dedicateName && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="relative mt-5 w-full overflow-hidden rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-[#1b3a2c] to-brand p-5 text-center text-white"
                      >
                        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
                        <Award className="mx-auto h-7 w-7 text-brand-light" />
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                          Certificate of Giving
                        </p>
                        <p className="mt-2 font-heading text-lg font-semibold text-white">
                          {dedicatePrefix} {dedicateName}
                        </p>
                        <p className="mt-1 text-xs text-white/80">
                          A {givingType} of {formatPKRFull(amount)} was given to{" "}
                          {campaign.title}
                        </p>
                        <p className="mt-3 text-[10px] text-white/50">
                          Apnaiyat · {new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </motion.div>
                    )}

                    {/* Summary card */}
                    <div className="mt-5 w-full rounded-2xl border border-border bg-secondary/50 p-4 text-left text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-foreground">
                          {formatPKRFull(amount)}{frequency === "monthly" ? " / month" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-semibold text-foreground">{givingType}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Via</span>
                        <span className="font-semibold text-foreground">{PAY_METHODS.find(p => p.key === payMethod)?.label}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Donor</span>
                        <span className="font-semibold text-foreground">{anonymous ? "Anonymous" : donorName || "You"}</span>
                      </div>
                    </div>

                    {/* WhatsApp confirmation */}
                    {whatsappOptIn && whatsapp && (
                      <div className="mt-3 flex w-full items-center gap-2.5 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/5 p-3 text-left">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25d366]">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Your receipt &amp; future updates will be sent to{" "}
                          <span className="font-semibold text-foreground">{whatsapp}</span>
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex w-full flex-col gap-2">
                      <button
                        onClick={() => { setDonated(false); setSheetOpen(false); setTimeout(() => setShareOpen(true), 200); }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-mid"
                      >
                        <Share2 className="h-4 w-4" />
                        Share this campaign
                      </button>
                      <button
                        onClick={() => { setDonated(false); setSheetOpen(false); }}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="pr-8">
                      <h3 className="text-xl font-bold text-foreground">Make a donation</h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{campaign.title}</p>
                    </div>

                    {/* Mini progress */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-mid" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-brand">{percent}% funded</span>
                    </div>

                    {/* Giving type */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Giving as</p>
                      <div className="grid grid-cols-3 gap-2">
                        {GIVING_TYPES.map((g) => (
                          <button
                            key={g}
                            onClick={() => setGivingType(g)}
                            className={cn(
                              "rounded-xl border py-2.5 text-sm font-semibold transition-all",
                              givingType === g
                                ? "border-brand bg-brand text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-brand-mid",
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Frequency */}
                    {campaign.recurringEnabled && (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Frequency</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setFrequency("once")}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all",
                              frequency === "once"
                                ? "border-brand bg-brand text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-brand-mid",
                            )}
                          >
                            <Heart className="h-4 w-4" />
                            One-time
                          </button>
                          <button
                            onClick={() => setFrequency("monthly")}
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all",
                              frequency === "monthly"
                                ? "border-brand bg-brand text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-brand-mid",
                            )}
                          >
                            <Repeat className="h-4 w-4" />
                            Monthly
                          </button>
                        </div>
                        {frequency === "monthly" && campaign.monthlyImpact && (
                          <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-brand/8 px-3 py-2 text-xs text-brand">
                            <Repeat className="h-3.5 w-3.5 shrink-0" />
                            {campaign.monthlyImpact}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Amount */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Amount</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            onClick={() => { setSelected(amt); setCustom(""); }}
                            className={cn(
                              "flex flex-col items-center rounded-xl border px-2 py-2.5 transition-all",
                              !custom && selected === amt
                                ? "border-brand bg-brand text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-brand-mid",
                            )}
                          >
                            <span className="text-sm font-bold">{formatPKR(amt)}</span>
                            <span className={cn("mt-0.5 text-[10px] leading-tight text-center", !custom && selected === amt ? "text-primary-foreground/70" : "text-muted-foreground")}>
                              {AMOUNT_IMPACT[amt]}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="relative mt-3">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">PKR</span>
                        <input
                          type="number"
                          min={0}
                          value={custom}
                          onChange={(e) => setCustom(e.target.value)}
                          placeholder="Custom amount"
                          className="h-11 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30"
                        />
                      </div>

                      {/* Impact line */}
                      {!custom && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-brand">
                          <Heart className="h-3 w-3 fill-current" />
                          {impact}
                        </p>
                      )}
                    </div>

                    {/* Donor info */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your details</p>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        disabled={anonymous}
                        placeholder="Your name (optional)"
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30 disabled:opacity-40"
                      />
                      <button
                        onClick={() => setAnonymous((v) => !v)}
                        className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                          anonymous ? "border-brand bg-brand text-white" : "border-border",
                        )}>
                          {anonymous && <X className="h-3 w-3" />}
                        </span>
                        Donate anonymously
                      </button>
                    </div>

                    {/* Message */}
                    <div className="mt-4">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        placeholder="Leave a message of support (optional)"
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30"
                      />
                    </div>

                    {/* Dedicate this gift */}
                    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                      <button
                        onClick={() => setDedicate((v) => !v)}
                        className="flex w-full items-center justify-between gap-2 bg-background px-4 py-3 text-left"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Gift className="h-4 w-4 text-brand" />
                          Dedicate this gift
                        </span>
                        <span className={cn(
                          "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors",
                          dedicate ? "justify-end bg-brand" : "justify-start bg-secondary",
                        )}>
                          <span className="h-4 w-4 rounded-full bg-white shadow" />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {dedicate && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 border-t border-border bg-secondary/30 p-4">
                              <div className="grid grid-cols-3 gap-2">
                                {DEDICATE_TYPES.map((d) => (
                                  <button
                                    key={d.key}
                                    onClick={() => setDedicateType(d.key)}
                                    className={cn(
                                      "rounded-lg border px-1 py-2 text-[11px] font-semibold leading-tight transition-all",
                                      dedicateType === d.key
                                        ? "border-brand bg-brand text-primary-foreground"
                                        : "border-border bg-background text-foreground hover:border-brand-mid",
                                    )}
                                  >
                                    {d.label}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                value={dedicateName}
                                onChange={(e) => setDedicateName(e.target.value)}
                                placeholder="Name of the person"
                                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/30"
                              />
                              <p className="text-[11px] text-muted-foreground">
                                We&apos;ll create a beautiful certificate you can
                                share with them or keep as a memory.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Payment method */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pay via</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PAY_METHODS.map((m) => (
                          <button
                            key={m.key}
                            onClick={() => setPayMethod(m.key)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-all",
                              payMethod === m.key
                                ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                                : "border-border bg-background hover:border-brand-mid/50",
                            )}
                          >
                            <span className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold",
                              m.key === "easypaisa" ? "bg-[#00B050] text-white" :
                              m.key === "jazzcash"  ? "bg-[#ED1C24] text-white" :
                              "bg-secondary text-foreground text-lg",
                            )}>
                              {m.key === "bank" ? <Banknote className="h-4 w-4" /> : m.key === "easypaisa" ? <Smartphone className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                            </span>
                            <span className={cn("text-[11px] font-semibold", payMethod === m.key ? "text-brand" : "text-foreground")}>
                              {m.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp updates */}
                    <div className="mt-5 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/5 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25d366]">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              Updates on WhatsApp
                            </p>
                            <button
                              onClick={() => setWhatsappOptIn((v) => !v)}
                              className={cn(
                                "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors",
                                whatsappOptIn ? "justify-end bg-[#25d366]" : "justify-start bg-secondary",
                              )}
                            >
                              <span className="h-4 w-4 rounded-full bg-white shadow" />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Get your receipt &amp; proof-of-use updates straight to your WhatsApp.
                          </p>
                          <AnimatePresence initial={false}>
                            {whatsappOptIn && (
                              <motion.input
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="03XX XXXXXXX"
                                className="h-10 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-[#25d366] focus:ring-2 focus:ring-[#25d366]/20"
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="mt-5 rounded-2xl bg-secondary/60 px-4 py-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{frequency === "monthly" ? "Monthly total" : "Total"}</span>
                        <span className="text-lg font-bold text-foreground">
                          {amount > 0 ? formatPKRFull(amount) : "—"}
                          {frequency === "monthly" && amount > 0 && <span className="text-xs font-medium text-muted-foreground">/mo</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{givingType} · {anonymous ? "Anonymous" : donorName || "You"}</span>
                        <span className="flex items-center gap-1"><ChevronRight className="h-3 w-3" />{PAY_METHODS.find(p => p.key === payMethod)?.label}</span>
                      </div>
                      {dedicate && dedicateName && (
                        <p className="mt-1.5 flex items-center gap-1.5 border-t border-border pt-1.5 text-xs text-brand">
                          <Gift className="h-3 w-3" />
                          {dedicatePrefix} {dedicateName}
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => amount > 0 && setDonated(true)}
                      disabled={amount <= 0}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-brand-mid active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {frequency === "monthly" ? <Repeat className="h-4 w-4" /> : <Heart className="h-4 w-4 fill-current" />}
                      {frequency === "monthly"
                        ? `Give ${amount > 0 ? formatPKRFull(amount) : ""} / month`
                        : `Donate ${amount > 0 ? formatPKRFull(amount) : "Now"}`}
                    </button>

                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Secure • Proof-gated release • Tax-deductible receipt
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Share sheet */}
      <ShareSheet
        campaign={campaign}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-lg font-bold text-foreground">
        {icon}
        {value}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
