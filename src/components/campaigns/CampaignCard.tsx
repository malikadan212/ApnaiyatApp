"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  MapPin,
  Users,
  Clock,
  Flame,
  TrendingUp,
  ArrowRight,
  Building2,
  User,
  Infinity as InfinityIcon,
  Moon,
} from "lucide-react";
import type { Campaign } from "@/types/campaign";
import { formatPKR, formatPKRFull, fundedPercent } from "@/utils/format";
import { cn } from "@/lib/utils";
import { VerificationBadge } from "./VerificationBadge";
import { TransparencyPill } from "./TransparencyScore";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const percent = fundedPercent(campaign.raised, campaign.goal);
  const isUrgent = campaign.badges.includes("urgent");
  const isTrending = campaign.badges.includes("trending");

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-brand/10"
    >
      <Link href={`/campaign/${campaign.id}`} className="flex flex-1 flex-col">
        {/* Cover */}
        <div className="relative h-44 overflow-hidden">
          {campaign.image ? (
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
                campaign.gradient,
              )}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Top-left: type chip + Sadaqah Jariyah */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
              {campaign.type === "ngo" ? (
                <Building2 className="h-3.5 w-3.5" />
              ) : (
                <User className="h-3.5 w-3.5" />
              )}
              {campaign.type === "ngo" ? "NGO" : "Individual"}
            </div>
            {campaign.sadaqahJariyah && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1b3a2c] px-2.5 py-1 text-[11px] font-semibold text-brand-light shadow">
                <InfinityIcon className="h-3.5 w-3.5" />
                Sadaqah Jariyah
              </span>
            )}
          </div>

          {/* Top-right: transparency score + status badges */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
            <TransparencyPill campaign={campaign} />
            {isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-urgent px-2.5 py-1 text-xs font-semibold text-white shadow">
                <Flame className="h-3.5 w-3.5" />
                Urgent
              </span>
            )}
            {isTrending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand shadow backdrop-blur">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending
              </span>
            )}
          </div>

          {/* Location */}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-medium text-white drop-shadow">
            <MapPin className="h-3.5 w-3.5" />
            {campaign.location}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {campaign.category}
            </span>
            {campaign.zakatEligible && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                <Moon className="h-3 w-3" />
                Zakat-eligible
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
            {campaign.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
            <span>by {campaign.organizer}</span>
            <VerificationBadge level={campaign.verificationLevel} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {campaign.organizerNote}
          </p>

          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {campaign.description}
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-mid"
              />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-foreground">
                {formatPKR(campaign.raised)}
              </span>
              <span className="text-xs font-semibold text-brand">
                {percent}% funded
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatPKRFull(campaign.goal)}
            </p>
          </div>

          {/* Meta */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {campaign.supporters.toLocaleString("en-PK")} donors
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {campaign.daysLeft} days left
            </span>
          </div>

          {/* CTA */}
          <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all group-hover:bg-brand-mid">
            Donate Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
