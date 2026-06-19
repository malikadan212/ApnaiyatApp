import Link from "next/link";
import { Heart } from "lucide-react";

const linkGroups = [
  {
    title: "Platform",
    links: [
      { label: "Discover causes", href: "/" },
      { label: "Start a campaign", href: "/create" },
      { label: "How it works", href: "/#campaigns" },
      { label: "Verified NGOs", href: "/#campaigns" },
    ],
  },
  {
    title: "Giving",
    links: [
      { label: "Donate Zakat", href: "/#campaigns" },
      { label: "Donate Sadaqah", href: "/#campaigns" },
      { label: "Monthly giving", href: "/#campaigns" },
      { label: "Corporate giving", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Transparency", href: "#" },
      { label: "Contact", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "#1b3a2c" }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
                <Heart className="h-4 w-4 fill-current" />
              </span>
              <span className="font-heading text-xl font-semibold text-white">
                Apnaiyat
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/55">
              Pakistan ka apna giving platform. 100% transparent, proof-verified
              fund releases, verified causes.
            </p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white">
                {group.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-sm text-white/40">
            &copy; {new Date().getFullYear()} Apnaiyat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
