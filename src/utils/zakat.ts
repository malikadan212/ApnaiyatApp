/**
 * Zakat calculation helpers.
 *
 * Zakat is due at 2.5% of qualifying wealth held for one lunar year, provided
 * the total exceeds the Nisab threshold. Nisab is the value of either 87.48g
 * of gold or 612.36g of silver — scholars commonly advise using the silver
 * Nisab so that more wealth becomes zakatable and more of the poor benefit.
 */

export const ZAKAT_RATE = 0.025;

export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;

/** Default per-gram market rates in PKR (editable by the user in the UI). */
export const DEFAULT_GOLD_RATE = 25_500;
export const DEFAULT_SILVER_RATE = 310;

export interface ZakatAssets {
  cash: number;
  bank: number;
  goldGrams: number;
  silverGrams: number;
  businessAssets: number;
  receivables: number;
  liabilities: number;
}

export interface ZakatRates {
  goldRate: number;
  silverRate: number;
}

export interface ZakatResult {
  goldValue: number;
  silverValue: number;
  grossAssets: number;
  netZakatable: number;
  nisabThreshold: number;
  meetsNisab: boolean;
  zakatDue: number;
}

export const EMPTY_ASSETS: ZakatAssets = {
  cash: 0,
  bank: 0,
  goldGrams: 0,
  silverGrams: 0,
  businessAssets: 0,
  receivables: 0,
  liabilities: 0,
};

export function computeZakat(
  assets: ZakatAssets,
  rates: ZakatRates,
): ZakatResult {
  const goldValue = assets.goldGrams * rates.goldRate;
  const silverValue = assets.silverGrams * rates.silverRate;

  const grossAssets =
    assets.cash +
    assets.bank +
    goldValue +
    silverValue +
    assets.businessAssets +
    assets.receivables;

  const netZakatable = Math.max(0, grossAssets - assets.liabilities);

  // Silver Nisab is the lower threshold — preferred so more wealth qualifies.
  const nisabThreshold = SILVER_NISAB_GRAMS * rates.silverRate;
  const meetsNisab = netZakatable >= nisabThreshold;

  const zakatDue = meetsNisab ? netZakatable * ZAKAT_RATE : 0;

  return {
    goldValue,
    silverValue,
    grossAssets,
    netZakatable,
    nisabThreshold,
    meetsNisab,
    zakatDue,
  };
}
