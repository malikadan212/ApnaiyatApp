"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Calculator, PlusCircle, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1b3a2c]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-mid/30 text-white ring-1 ring-white/20">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <span className="font-heading text-xl font-semibold text-white">
              Apnaiyat
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 sm:flex">
            <Link href="/" className="transition-colors hover:text-white">
              Discover
            </Link>
            <a
              href="#zakat"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Calculator className="h-3.5 w-3.5" />
              Zakat Calculator
            </a>
            <Link href="/#campaigns" className="transition-colors hover:text-white">
              How it works
            </Link>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <PlusCircle className="h-4 w-4" />
              Start a campaign
            </Link>
            <Link
              href="/profile"
              title="My Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/20 transition-all hover:bg-white/20"
            >
              AR
            </Link>
            <Link
              href="/#campaigns"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-mid px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:text-[#1b3a2c] active:translate-y-px"
            >
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </div>

          {/* Mobile: right-side controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href="#zakat"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Zakat Calculator"
            >
              <Calculator className="h-4 w-4" />
            </a>
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white ring-1 ring-white/20"
            >
              AR
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-[#1b3a2c] px-6 py-6 shadow-2xl sm:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading text-lg font-semibold text-white">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {[
                  { label: "Discover campaigns", href: "/" },
                  { label: "Start a campaign", href: "/create" },
                  { label: "My profile", href: "/profile" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="#zakat"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Zakat Calculator
                </a>
              </div>

              <div className="mt-auto">
                <Link
                  href="/#campaigns"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-mid px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-light hover:text-[#1b3a2c]"
                >
                  <Heart className="h-4 w-4" />
                  Donate now
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
