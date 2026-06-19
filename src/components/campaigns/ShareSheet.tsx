"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Copy,
  Check,
  Link2,
  MessageCircle,
  Image as ImageIcon,
  ImageOff,
  ExternalLink,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import type { Campaign } from "@/types/campaign";
import { formatPKR, formatPKRFull, fundedPercent } from "@/utils/format";
import { cn } from "@/lib/utils";

const BASE_URL = "https://apnaiyatpk.com";

function getShareUrl(campaignId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/campaign/${campaignId}`;
  }
  return `${BASE_URL}/campaign/${campaignId}`;
}

function buildWhatsAppText(campaign: Campaign, includeImage: boolean, url: string): string {
  const percent = fundedPercent(campaign.raised, campaign.goal);

  const lines = [
    `*${campaign.title}*`,
    ``,
    `Location: ${campaign.location}`,
    `By: ${campaign.organizer}${campaign.verified ? " (Verified)" : ""}`,
    ``,
    campaign.description,
    ``,
    `Raised: *${formatPKRFull(campaign.raised)}* of ${formatPKRFull(campaign.goal)} — *${percent}% funded*`,
    `Only *${campaign.daysLeft} days* left | ${campaign.supporters.toLocaleString()} donors`,
    ``,
    includeImage
      ? `Donate and see the full story here:`
      : `Donate on Apnaiyat:`,
    url,
  ];

  return lines.join("\n");
}

export default function ShareSheet({
  campaign,
  open,
  onClose,
}: {
  campaign: Campaign;
  open: boolean;
  onClose: () => void;
}) {
  const [includeImage, setIncludeImage] = useState(true);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);

  const url = getShareUrl(campaign.id);
  const percent = fundedPercent(campaign.raised, campaign.goal);
  const whatsAppText = buildWhatsAppText(campaign, includeImage, url);

  const copy = async (type: "link" | "message") => {
    const text = type === "link" ? url : whatsAppText;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(whatsAppText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-[2rem] border border-border bg-card p-6 shadow-2xl sm:bottom-6 sm:rounded-[2rem]"
          >
            {/* Handle */}
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-border sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Share this campaign
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image toggle */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  {includeImage ? (
                    <ImageIcon className="h-5 w-5 text-brand" />
                  ) : (
                    <ImageOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Show image preview
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {includeImage
                        ? "Recipients see a full card with image before opening"
                        : "Recipients see text only — no preview card"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIncludeImage((v) => !v)}
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
                    includeImage ? "bg-brand" : "bg-secondary",
                  )}
                >
                  <motion.span
                    animate={{ x: includeImage ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                  />
                </button>
              </div>
              {includeImage && (
                <p className="px-1 text-xs text-muted-foreground">
                  Image previews appear automatically once the app is live on its public domain. The mockup below shows how it will look.
                </p>
              )}
            </div>

            {/* WhatsApp preview mockup */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Preview — how it looks on WhatsApp
              </p>
              <div className="overflow-hidden rounded-2xl border border-border bg-[#e9ddd4]">
                {/* Chat bubble */}
                <div className="p-3">
                  <div className="ml-auto max-w-[85%] overflow-hidden rounded-xl rounded-tr-sm bg-[#dcf8c6] shadow-sm">
                    {includeImage && (
                      <div className="relative flex h-28 items-end overflow-hidden bg-gradient-to-br from-[#1b3a2c] to-[#2d6a4f] p-3">
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-80",
                            campaign.gradient,
                          )}
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative z-10">
                          <p className="text-xs font-semibold text-white/80">
                            apnaiyatpk.com
                          </p>
                          <p className="line-clamp-2 text-sm font-bold leading-tight text-white">
                            {campaign.title}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-2.5">
                      {!includeImage && (
                        <p className="mb-1 text-xs font-semibold text-[#075e54]">
                          apnaiyatpk.com
                        </p>
                      )}

                      <div className="space-y-0.5 text-xs text-[#333]">
                        <p className="font-bold">{campaign.title}</p>
                        <p className="flex items-center gap-1 text-[#666]">
                          <MapPin className="inline h-3 w-3" />
                          {campaign.location}
                        </p>
                        <p className="flex items-center gap-1">
                          {campaign.organizer}
                          {campaign.verified && (
                            <BadgeCheck className="inline h-3 w-3 text-[#075e54]" />
                          )}
                        </p>

                        {/* mini progress */}
                        <div className="my-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#ccc]">
                          <div
                            className="h-full rounded-full bg-[#2d6a4f]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p>
                          <span className="font-semibold">
                            {formatPKR(campaign.raised)}
                          </span>{" "}
                          raised · {percent}% funded
                        </p>
                        <p className="text-[#666]">
                          ⏳ {campaign.daysLeft} days left
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3 transition-colors hover:bg-[#25d366]/10 hover:border-[#25d366]/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366]">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  WhatsApp
                </span>
              </button>

              {/* Copy link */}
              <button
                onClick={() => copy("link")}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3 transition-colors hover:bg-secondary"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                    copied === "link" ? "bg-brand" : "bg-secondary",
                  )}
                >
                  {copied === "link" ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Link2 className="h-5 w-5 text-foreground" />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {copied === "link" ? "Copied!" : "Copy link"}
                </span>
              </button>

              {/* Copy message */}
              <button
                onClick={() => copy("message")}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background p-3 transition-colors hover:bg-secondary"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                    copied === "message" ? "bg-brand" : "bg-secondary",
                  )}
                >
                  {copied === "message" ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Copy className="h-5 w-5 text-foreground" />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {copied === "message" ? "Copied!" : "Copy text"}
                </span>
              </button>
            </div>

            {/* View live link */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground transition-colors hover:text-brand"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {url}
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
