/** Formats a number into a compact PKR string, e.g. 875000 -> "PKR 8.75L". */
export function formatPKR(amount: number): string {
  if (amount >= 10_000_000) {
    return `PKR ${(amount / 10_000_000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (amount >= 100_000) {
    return `PKR ${(amount / 100_000).toFixed(2).replace(/\.00$/, "")} L`;
  }
  if (amount >= 1_000) {
    return `PKR ${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/** Full PKR amount with thousands separators, e.g. "PKR 875,000". */
export function formatPKRFull(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/** Percentage of goal reached, clamped to 0-100. */
export function fundedPercent(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}
