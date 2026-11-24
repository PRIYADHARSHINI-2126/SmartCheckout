import type { Product } from '../types/checkout';

export const PRODUCTS: Product[] = [
  {
    id: 'pour-over-kettle',
    sku: 'AC-KT-800',
    name: 'Gooseneck Pour-Over Kettle',
    subtitle: 'Matte Obsidian Steel · 800ml',
    description:
      'Precision counterbalanced gooseneck spout engineered for steady, controlled extraction over hand-poured coffee beds.',
    priceCents: 60000,
    imageUrl: '/src/assets/images/kettle_luxury_lifestyle_1795507180068.jpg',
    imageAlt:
      'Matte obsidian gooseneck pour-over kettle with walnut handle on teak serving board beside glass coffee carafe and roasted beans',
  },
  {
    id: 'ceramic-dripper',
    sku: 'AC-DR-02',
    name: 'Fluted Ceramic Dripper',
    subtitle: 'Alabaster Stoneware · Size 02',
    description:
      'Hand-thrown stoneware cone with interior vertical ribs to preserve thermal stability and clean filter drainage.',
    priceCents: 30000,
    imageUrl: '/src/assets/images/dripper_luxury_lifestyle_1795507178989.jpg',
    imageAlt:
      'Fluted cream ceramic pour-over dripper on a sunlit ribbed glass carafe filled with glowing amber coffee and brass spoon',
  },
];

export function formatCurrency(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateOrderReference(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `AC-${randomDigits}`;
}
