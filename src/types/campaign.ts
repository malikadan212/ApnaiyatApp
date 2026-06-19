export type CampaignType = "ngo" | "individual";

export type CampaignCategory =
  | "Flood Relief"
  | "Education"
  | "Healthcare"
  | "Food & Nutrition"
  | "Orphan Care"
  | "Shelter"
  | "Emergency Aid"
  | "Water & Sanitation"
  | "Mosque & Madrassah"
  | "Environment";

export type CampaignBadge = "urgent" | "trending" | "verified";

/**
 * Trust tiers shown on every campaign. Donors self-select by how much
 * verification they need before giving.
 */
export type VerificationLevel = "unverified" | "cnic" | "ngo";

export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  /** Amount spent at this update (optional — some updates are informational) */
  amountSpent?: number;
  receiptCount: number;
  photoCount: number;
  status: "approved" | "pending";
  /** Tailwind gradient classes for mock proof photo thumbnails */
  photoGradients?: string[];
}

export interface Milestone {
  id: string;
  label: string;
  note?: string;
  /** Funds released when this milestone was reached */
  amountReleased?: number;
  reached: boolean;
  date?: string;
}

export interface Campaign {
  id: string;
  type: CampaignType;
  title: string;
  /** NGO/organization name OR the individual's name */
  organizer: string;
  /** Short note shown under the organizer name */
  organizerNote: string;
  verified: boolean;
  /** Tiered trust level: unverified → CNIC verified → registered NGO */
  verificationLevel: VerificationLevel;
  badges: CampaignBadge[];
  category: CampaignCategory;
  location: string;
  description: string;
  /** Whether donations to this cause can be paid from Zakat (tamleek satisfied) */
  zakatEligible: boolean;
  /** Ongoing/continuing charity whose reward flows even after death */
  sadaqahJariyah?: boolean;
  /** Supports recurring monthly giving */
  recurringEnabled?: boolean;
  /** What a sensible monthly contribution achieves (shown for recurring) */
  monthlyImpact?: string;
  /** Long-form story shown on the campaign detail page (array of paragraphs) */
  story: string[];
  /** Public image path (under /public). When null, the gradient is used as a colored placeholder. */
  image: string | null;
  /** Gradient classes used as a stand-in / placeholder for the campaign image */
  gradient: string;
  raised: number;
  goal: number;
  supporters: number;
  daysLeft: number;
  /** Proof-of-use updates posted by the campaign runner, reviewed by Apnaiyat */
  updates?: CampaignUpdate[];
  /** Milestone-based fund release schedule */
  milestones?: Milestone[];
}

export interface Donor {
  name: string;
  amount: number;
  timeAgo: string;
  message?: string;
  anonymous?: boolean;
}
