export interface DonationRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignImage: string | null;
  campaignGradient: string;
  amount: number;
  givingType: "Zakat" | "Sadaqah" | "General";
  frequency: "once" | "monthly";
  date: string;
  dedication?: {
    type: "in-memory" | "on-behalf" | "gift";
    name: string;
  };
  message?: string;
  receiptNumber: string;
}

export interface RecurringPledge {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignGradient: string;
  amountPerMonth: number;
  givingType: "Zakat" | "Sadaqah" | "General";
  nextPaymentDate: string;
  paused: boolean;
  startedDate: string;
}

export const MOCK_DONOR = {
  name: "Ahmed Raza",
  initials: "AR",
  joinedDate: "March 2025",
  phone: "+92 300 1234567",
};

export const MOCK_DONATIONS: DonationRecord[] = [
  {
    id: "don-001",
    campaignId: "ayaan-heart-surgery",
    campaignTitle: "Help Baby Ayaan Get His Heart Surgery",
    campaignImage: "/campaigns/ayaan.jpg",
    campaignGradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    amount: 10_000,
    givingType: "Sadaqah",
    frequency: "once",
    date: "Jun 14, 2026",
    dedication: {
      type: "in-memory",
      name: "Ammi Jan",
    },
    message: "May Allah grant little Ayaan a full recovery. Ameen.",
    receiptNumber: "APY-2026-00841",
  },
  {
    id: "don-002",
    campaignId: "school-fees-thar",
    campaignTitle: "Send 120 Girls Back to School in Thar",
    campaignImage: "/campaigns/thar-school.jpg",
    campaignGradient: "from-amber-400 via-orange-500 to-red-600",
    amount: 5_000,
    givingType: "Zakat",
    frequency: "once",
    date: "Jun 10, 2026",
    receiptNumber: "APY-2026-00802",
  },
  {
    id: "don-003",
    campaignId: "orphan-care-quetta",
    campaignTitle: "Sponsor Meals for 200 Orphans in Quetta",
    campaignImage: null,
    campaignGradient: "from-violet-500 via-purple-600 to-indigo-700",
    amount: 2_000,
    givingType: "Sadaqah",
    frequency: "monthly",
    date: "Jun 1, 2026",
    receiptNumber: "APY-2026-00751",
  },
  {
    id: "don-004",
    campaignId: "flood-relief-sindh",
    campaignTitle: "Flood Relief for 50 Families in Sindh",
    campaignImage: "/campaigns/flood-relief.jpg",
    campaignGradient: "from-emerald-500 via-teal-600 to-cyan-700",
    amount: 25_000,
    givingType: "Zakat",
    frequency: "once",
    date: "May 22, 2026",
    dedication: {
      type: "on-behalf",
      name: "Abu Jan",
    },
    message: "Donated Zakat on behalf of my father. JazakAllah.",
    receiptNumber: "APY-2026-00698",
  },
  {
    id: "don-005",
    campaignId: "hifz-sponsorship",
    campaignTitle: "Sponsor a Hifz Student for a Year",
    campaignImage: null,
    campaignGradient: "from-emerald-500 via-green-600 to-teal-700",
    amount: 5_000,
    givingType: "Sadaqah",
    frequency: "monthly",
    date: "May 15, 2026",
    dedication: {
      type: "gift",
      name: "Dada Ji",
    },
    receiptNumber: "APY-2026-00661",
  },
  {
    id: "don-006",
    campaignId: "cancer-treatment-bilal",
    campaignTitle: "Help Bilal Beat Blood Cancer",
    campaignImage: null,
    campaignGradient: "from-red-400 via-rose-500 to-pink-600",
    amount: 3_000,
    givingType: "General",
    frequency: "once",
    date: "Apr 30, 2026",
    message: "Stay strong Bilal bhai, you've got this.",
    receiptNumber: "APY-2026-00589",
  },
  {
    id: "don-007",
    campaignId: "winter-blankets",
    campaignTitle: "5,000 Winter Blankets for the Homeless",
    campaignImage: null,
    campaignGradient: "from-cyan-400 via-sky-500 to-blue-600",
    amount: 7_500,
    givingType: "Sadaqah",
    frequency: "once",
    date: "Apr 12, 2026",
    receiptNumber: "APY-2026-00502",
  },
];

export const MOCK_RECURRING: RecurringPledge[] = [
  {
    id: "rec-001",
    campaignId: "orphan-care-quetta",
    campaignTitle: "Sponsor Meals for 200 Orphans in Quetta",
    campaignGradient: "from-violet-500 via-purple-600 to-indigo-700",
    amountPerMonth: 2_000,
    givingType: "Sadaqah",
    nextPaymentDate: "Jul 1, 2026",
    paused: false,
    startedDate: "Jun 1, 2026",
  },
  {
    id: "rec-002",
    campaignId: "hifz-sponsorship",
    campaignTitle: "Sponsor a Hifz Student for a Year",
    campaignGradient: "from-emerald-500 via-green-600 to-teal-700",
    amountPerMonth: 5_000,
    givingType: "Sadaqah",
    nextPaymentDate: "Jul 15, 2026",
    paused: false,
    startedDate: "May 15, 2026",
  },
];
