import type { Metadata } from "next";
import DonorProfile from "@/components/profile/DonorProfile";

export const metadata: Metadata = {
  title: "My Profile — Apnaiyat",
  description:
    "Your giving history, recurring donations, and certificates of giving on Apnaiyat.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <DonorProfile />
    </main>
  );
}
