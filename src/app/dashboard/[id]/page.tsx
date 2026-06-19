import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CAMPAIGNS, getCampaign } from "@/constants/campaigns";
import DashboardShell from "@/components/dashboard/DashboardShell";

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) return { title: "Campaign not found — Apnaiyat" };
  return {
    title: `Manage: ${campaign.title} — Apnaiyat`,
    description: "Campaign runner dashboard — post updates, upload proof, and track milestone releases.",
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  return (
    <main className="min-h-screen bg-background">
      <DashboardShell campaign={campaign} />
    </main>
  );
}
