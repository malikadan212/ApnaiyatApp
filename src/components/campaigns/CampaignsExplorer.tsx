"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Building2,
  User,
  Sparkles,
  ChevronDown,
  Check,
  ArrowUpDown,
  X,
  Infinity as InfinityIcon,
} from "lucide-react";
import type { CampaignCategory } from "@/types/campaign";
import { CAMPAIGNS, CATEGORIES } from "@/constants/campaigns";
import { fundedPercent } from "@/utils/format";
import { cn } from "@/lib/utils";
import CampaignCard from "./CampaignCard";

type SortKey = "urgent" | "newest" | "trending" | "most-funded";
type ViewMode = "ngo" | "individual" | "jariyah";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "urgent", label: "Most Urgent" },
  { key: "trending", label: "Trending" },
  { key: "most-funded", label: "Most Funded" },
  { key: "newest", label: "Ending Soon" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "All": "✦",
  "Flood Relief": "🌊",
  "Education": "📚",
  "Healthcare": "🏥",
  "Food & Nutrition": "🍱",
  "Orphan Care": "🤲",
  "Shelter": "🏠",
  "Emergency Aid": "🚨",
  "Water & Sanitation": "💧",
  "Mosque & Madrassah": "🕌",
  "Environment": "🌱",
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function CampaignsExplorer() {
  const [type, setType] = useState<ViewMode>("ngo");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CampaignCategory | "All">("All");
  const [sort, setSort] = useState<SortKey>("urgent");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const ngoCount = useMemo(() => CAMPAIGNS.filter((c) => c.type === "ngo").length, []);
  const individualCount = useMemo(() => CAMPAIGNS.filter((c) => c.type === "individual").length, []);
  const jariyahCount = useMemo(() => CAMPAIGNS.filter((c) => c.sadaqahJariyah).length, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    let list =
      type === "jariyah"
        ? CAMPAIGNS.filter((c) => c.sadaqahJariyah)
        : CAMPAIGNS.filter((c) => c.type === type);
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "urgent":
        sorted.sort(
          (a, b) =>
            Number(b.badges.includes("urgent")) - Number(a.badges.includes("urgent")) ||
            a.daysLeft - b.daysLeft,
        );
        break;
      case "trending":
        sorted.sort((a, b) => b.supporters - a.supporters);
        break;
      case "most-funded":
        sorted.sort((a, b) => fundedPercent(b.raised, b.goal) - fundedPercent(a.raised, a.goal));
        break;
      case "newest":
        sorted.sort((a, b) => a.daysLeft - b.daysLeft);
        break;
    }
    return sorted;
  }, [type, category, query, sort]);

  const currentSort = SORTS.find((s) => s.key === sort)!;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* Type toggle */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <ToggleButton
            active={type === "ngo"}
            onClick={() => setType("ngo")}
            icon={<Building2 className="h-4 w-4" />}
            title="NGO Campaigns"
            subtitle={`${ngoCount} verified orgs`}
          />
          <ToggleButton
            active={type === "individual"}
            onClick={() => setType("individual")}
            icon={<User className="h-4 w-4" />}
            title="Individual Causes"
            subtitle={`${individualCount} personal stories`}
          />
          <ToggleButton
            active={type === "jariyah"}
            onClick={() => setType("jariyah")}
            icon={<InfinityIcon className="h-4 w-4" />}
            title="Sadaqah Jariyah"
            subtitle={`${jariyahCount} ongoing rewards`}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 mt-8">
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search causes, cities, organizers..."
              className="h-12 w-full rounded-2xl border border-border bg-card/90 pl-11 pr-10 text-sm shadow-sm outline-none backdrop-blur-md transition-all placeholder:text-muted-foreground/60 focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category dropdown */}
          <div ref={categoryRef} className="relative shrink-0">
            <button
              onClick={() => { setCategoryOpen((v) => !v); setSortOpen(false); }}
              className={cn(
                "flex h-12 items-center gap-2 rounded-2xl border bg-card/90 px-4 text-sm font-medium shadow-sm backdrop-blur-md transition-all",
                categoryOpen
                  ? "border-brand-mid ring-2 ring-brand-mid/20 text-brand"
                  : "border-border text-foreground hover:border-brand-mid/50",
              )}
            >
              <span className="text-base leading-none">{CATEGORY_ICONS[category]}</span>
              <span className="hidden sm:inline">{category}</span>
              <motion.span
                animate={{ rotate: categoryOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.span>
            </button>

            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
                >
                  <div className="p-1.5">
                    <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Campaign type
                    </p>
                    {(["All", ...CATEGORIES] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setCategoryOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          category === cat
                            ? "bg-brand text-primary-foreground"
                            : "text-foreground hover:bg-secondary",
                        )}
                      >
                        <span className="text-base leading-none w-5 text-center">{CATEGORY_ICONS[cat]}</span>
                        <span className="flex-1 font-medium">{cat}</span>
                        {category === cat && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort dropdown */}
          <div ref={sortRef} className="relative shrink-0">
            <button
              onClick={() => { setSortOpen((v) => !v); setCategoryOpen(false); }}
              className={cn(
                "flex h-12 items-center gap-2 rounded-2xl border bg-card/90 px-4 text-sm font-medium shadow-sm backdrop-blur-md transition-all",
                sortOpen
                  ? "border-brand-mid ring-2 ring-brand-mid/20 text-brand"
                  : "border-border text-foreground hover:border-brand-mid/50",
              )}
            >
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">{currentSort.label}</span>
              <motion.span
                animate={{ rotate: sortOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.span>
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 z-50 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
                >
                  <div className="p-1.5">
                    <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Sort by
                    </p>
                    {SORTS.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => { setSort(s.key); setSortOpen(false); }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                          sort === s.key
                            ? "bg-brand text-primary-foreground"
                            : "text-foreground hover:bg-secondary",
                        )}
                      >
                        {s.label}
                        {sort === s.key && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Active filters strip */}
        <AnimatePresence>
          {(category !== "All" || query) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex flex-wrap items-center gap-2 overflow-hidden"
            >
              <span className="text-xs text-muted-foreground">Filters:</span>
              {category !== "All" && (
                <button
                  onClick={() => setCategory("All")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                >
                  {CATEGORY_ICONS[category]} {category}
                  <X className="h-3 w-3" />
                </button>
              )}
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                >
                  &ldquo;{query}&rdquo;
                  <X className="h-3 w-3" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
        {type === "ngo"
          ? "NGO"
          : type === "individual"
            ? "individual"
            : "Sadaqah Jariyah"}{" "}
        {filtered.length === 1 ? "campaign" : "campaigns"}
      </p>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${category}-${sort}-${query}`}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0"
        >
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Sparkles className="h-6 w-6 text-brand" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try adjusting your search or switching category.
          </p>
          <button
            onClick={() => { setCategory("All"); setQuery(""); }}
            className="mt-4 text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function ToggleButton({
  active, onClick, icon, title, subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors sm:px-6",
        active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
        <motion.span
          layoutId="type-toggle"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute inset-0 rounded-xl bg-brand"
        />
      )}
      <span className="relative flex items-center gap-2.5">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", active ? "bg-white/20" : "bg-secondary")}>
          {icon}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{title}</span>
          <span className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {subtitle}
          </span>
        </span>
      </span>
    </button>
  );
}
