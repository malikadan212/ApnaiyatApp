import type { Metadata } from "next";
import CreateCampaignWizard from "@/components/create/CreateCampaignWizard";

export const metadata: Metadata = {
  title: "Start a Campaign — Apnaiyat",
  description:
    "Launch a verified fundraising campaign on Apnaiyat. Raise funds for flood relief, education, healthcare and more — with full transparency and proof-gated fund releases.",
};

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-background">
      <CreateCampaignWizard />
    </main>
  );
}
