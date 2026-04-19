/** Matches backend `apps/api/src/lib/bangalore.ts` — Bangalore urban pincode range. */
export function isBangalorePincode(pin: string): boolean {
  const n = parseInt(pin, 10);
  if (Number.isNaN(n) || pin.length !== 6) return false;
  return n >= 560001 && n <= 560103;
}

/** Optional friendly labels for common pincodes (UX only). */
export const PINCODE_AREA_HINTS: Record<string, string> = {
  '560001': 'Bangalore GPO',
  '560034': 'HSR / Koramangala area',
  '560038': 'Indiranagar',
  '560037': 'Marathahalli',
  '560029': 'JP Nagar / BTM',
  '560041': 'Jayanagar',
  '560100': 'Electronic City',
  '560060': 'Whitefield',
  '560095': 'Koramangala',
  '560102': 'Yelahanka',
};
