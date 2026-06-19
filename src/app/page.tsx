import Image from "next/image";
import {
  ShieldCheck,
  HeartHandshake,
  Receipt,
  TrendingUp,
  Calculator,
  ArrowRight,
} from "lucide-react";
import CampaignsExplorer from "@/components/campaigns/CampaignsExplorer";
import { CAMPAIGNS } from "@/constants/campaigns";

const totalRaised = CAMPAIGNS.reduce((sum, c) => sum + c.raised, 0);
const totalDonors = CAMPAIGNS.reduce((sum, c) => sum + c.supporters, 0);
const activeCampaigns = CAMPAIGNS.filter((c) => c.daysLeft > 0).length;

function formatCrore(n: number) {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)} L`;
  return n.toLocaleString("en-PK");
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Top impact ticker ── */}
      <div className="border-b border-white/10 bg-[#1b3a2c]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-brand-mid" />
              <span className="font-semibold text-white">
                PKR {formatCrore(totalRaised)}
              </span>{" "}
              ab tak ikatha hua
            </span>
            <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
            <span>
              <span className="font-semibold text-white">
                {totalDonors.toLocaleString()}
              </span>{" "}
              hamdard donors
            </span>
            <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
            <span>
              <span className="font-semibold text-white">{activeCampaigns}</span>{" "}
              active campaigns
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-brand-mid/40 px-3 py-1 text-xs font-medium text-brand-mid">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-mid opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-mid" />
            </span>
            100% transparent giving
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background image */}
        <Image
          src="/pakistani_volunteers_helping_families_with_compassion_and_dignity.png"
          alt="Pakistani volunteers helping families"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* Left text */}
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              Pakistan ka apna giving platform
            </span>

            <h1 className="mt-5 font-semibold leading-[1.08] text-white">
              <span className="block text-[2.1rem] sm:text-[2.8rem] lg:text-5xl">
                Apna Hissa Ada Karo.
              </span>
              <span className="block text-[1.5rem] text-brand-light sm:text-[1.9rem] lg:text-[2.2rem]">
                Har Rupee Ek Farak Dalta Hai.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
              Apni Zakat aur Sadaqah verified campaigns ko dein, jahan har
              rupee ka hisaab hota hai. Poori amanah. Poori transparency.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: ShieldCheck, label: "Har campaign verified" },
                { icon: HeartHandshake, label: "Proof ke baad release" },
                { icon: Receipt, label: "Poora hisaab, har dafa" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-4"
                >
                  <Icon className="h-4 w-4 text-brand-light sm:h-5 sm:w-5" />
                  <span className="text-[11px] font-medium leading-tight text-white sm:text-xs">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stacked preview cards */}
          <div className="relative hidden h-72 lg:block">
            {CAMPAIGNS.slice(0, 3).map((c, i) => (
              <div
                key={c.id}
                className="absolute w-64 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl"
                style={{
                  top: `${i * 28}px`,
                  left: `${i * 40}px`,
                  zIndex: 3 - i,
                  opacity: 1 - i * 0.15,
                  transform: `rotate(${[-2, 1, 3][i]}deg)`,
                }}
              >
                {/* Campaign image or gradient fallback */}
                <div className="relative h-24 overflow-hidden">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${c.gradient}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-xs font-semibold text-foreground">
                    {c.title}
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{
                        width: `${Math.round((c.raised / c.goal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {Math.round((c.raised / c.goal) * 100)}% funded ·{" "}
                    {c.daysLeft}d left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zakat calculator band ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1b3a2c] px-6 py-8 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-mid/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-light backdrop-blur">
                <Calculator className="h-3.5 w-3.5" />
                Zakat Calculator
              </span>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-white sm:text-3xl">
                Pata nahi kitni Zakat banti hai?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Apni cash, gold, silver aur business ka hisaab lagayein in
                minutes — phir seedha Zakat-eligible verified causes ko dein.
              </p>
            </div>
            <a
              href="#zakat"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-mid px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-light hover:text-[#1b3a2c] active:translate-y-px"
            >
              Calculate my Zakat
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Explorer ── */}
      <div id="campaigns" className="scroll-mt-20 pt-14">
        <CampaignsExplorer />
      </div>
    </div>
  );
}
