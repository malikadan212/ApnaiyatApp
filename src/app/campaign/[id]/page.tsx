import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CAMPAIGNS, getCampaign, getDonors } from "@/constants/campaigns";
import CampaignDetail from "@/components/campaigns/CampaignDetail";
import MoreCampaigns from "@/components/campaigns/MoreCampaigns";

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ id: c.id }));
}

const BASE_URL = "https://apnaiyatpk.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) return { title: "Campaign not found — Apnaiyat" };

  const url = `${BASE_URL}/campaign/${campaign.id}`;
  const title = `${campaign.title} — Apnaiyat`;
  const description = `${campaign.description} Help ${campaign.organizer} reach their goal on Apnaiyat — Pakistan's most transparent giving platform.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Apnaiyat",
      type: "website",
      locale: "en_PK",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      // WhatsApp uses og: tags but also respects these
      "og:url": url,
    },
  };
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);

  if (!campaign) notFound();

  const donors = getDonors(campaign.id, 4);
  const related = CAMPAIGNS.filter(
    (c) => c.id !== campaign.id && c.type === campaign.type,
  ).slice(0, 3);

  return (
    <>
      <CampaignDetail campaign={campaign} donors={donors} />
      {related.length > 0 && <MoreCampaigns campaigns={related} />}
    </>
  );
}
