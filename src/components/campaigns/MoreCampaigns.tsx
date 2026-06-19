"use client";

import { motion } from "motion/react";
import type { Campaign } from "@/types/campaign";
import CampaignCard from "./CampaignCard";

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function MoreCampaigns({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          More ways to help
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Other causes that need your support right now.
        </p>
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
