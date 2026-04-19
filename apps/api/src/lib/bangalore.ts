export const BANGALORE_PINCODE_RANGES = [
  { start: 560001, end: 560103 }
];

export function isBangalorePincode(pin: string): boolean {
  const n = parseInt(pin, 10);
  if (isNaN(n) || pin.length !== 6) return false;
  return BANGALORE_PINCODE_RANGES.some(r => n >= r.start && n <= r.end);
}

export const PINCODE_TO_AREA: Record<string, string> = {
  '560095': 'Koramangala',
  '560102': 'HSR Layout',
  '560038': 'Indiranagar',
  '560037': 'Marathahalli',
  '560100': 'Electronic City',
  '560011': 'Jayanagar',
  '560066': 'Whitefield',
  '560068': 'BTM Layout',
  '560076': 'Koramangala',
  '560034': 'Malleswaram',
  '560003': 'Basavanagudi',
  '560004': 'Chickpet',
  '560001': 'Gandhinagar',
  '560002': 'Kalasipalya',
  '560005': 'Chamrajpet',
  '560018': 'Shivajinagar',
  '560008': 'Malleshwaram',
  '560010': 'Rajajinagar',
  '560020': 'Yeshwanthpur',
  '560022': 'Peenya',
  '560040': 'Yelahanka',
  '560064': 'Yelahanka New Town',
  '560097': 'Banashankari',
  '560050': 'Rajarajeshwari Nagar',
  '560078': 'JP Nagar',
  '560069': 'Kengeri',
  '560098': 'Uttarahalli',
};
