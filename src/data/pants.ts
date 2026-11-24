// One entry per pair, taken from the folder names in the "MADE BY SCOTTEX" Drive folder.
// `cover` / `photos` point to files in /public/images. Pairs without photos show a numbered plate.
// `credit` is who the pair was made for or with. Only set `showCredit: true` once Benjamin says it is OK.

export type Pant = {
  no: string;
  label: string;
  date?: string;
  credit?: string;
  showCredit?: boolean;
  cover?: string;
  // `caption` is the short line shown under the photo in the Work gallery.
  photos?: { src: string; w: number; h: number; alt: string; caption?: string }[];
};

export const pants: Pant[] = [
  // Shown first in the Work gallery. TODO: which pair number is this? Set `no` (and `date`) once known.
  {
    no: '—', label: 'Pant',
    cover: '/images/work-front.webp',
    photos: [
      { src: '/images/work-front.webp', w: 1500, h: 2000, caption: 'Raw indigo - wide straight leg', alt: 'Raw indigo jeans from the front, wide straight leg, contrast topstitching and a single metal button' },
      { src: '/images/work-back.webp', w: 1500, h: 2000, caption: 'Leather patch - freehand pocket embroidery', alt: 'The same jeans from the back: leather patch with the stitched Scottex logo and freehand embroidery on both back pockets' },
    ],
  },
  { no: '01', label: 'Jort', },
  { no: '01', label: 'Pant', date: '10.11.24' },
  { no: '02', label: 'Pant', date: '21.12.24', credit: 'Alberto Gallo' },
  { no: '03', label: 'Pant', date: '25.01.25' },
  { no: '04', label: 'Pant', date: '2025' },
  { no: '05', label: 'Pant', date: '2025' },
  { no: '06', label: 'Pant', date: '2025' },
  { no: '07', label: 'Pant', date: '2025' },
  { no: '08', label: 'Pant', date: '2025' },
  { no: '09', label: 'Pant', date: '2025', credit: 'Zwizler' },
  { no: '10', label: 'Pant', date: '2025', credit: 'Alexander Meisner' },
  { no: '11', label: 'Pant', date: '2025', credit: 'Trade with Kaybe Jewelry' },
  { no: '12', label: 'Pant', date: '2026', credit: 'William Claudiust' },
  { no: '13', label: 'Pant', date: '08.01.26', credit: 'Brandspace Studio' },
  // TODO: which pair numbers are these two? Set `no` once known.
  {
    no: '—', label: 'Pant',
    photos: [
      { src: '/images/work-street.webp', w: 1050, h: 1400, caption: 'Wide leg - worn in', alt: 'Wide-leg jeans worn on the street with a belt buckle and brown leather shoes' },
    ],
  },
  {
    no: '—', label: 'Pant',
    photos: [
      { src: '/images/work-worn-back.webp', w: 1050, h: 1400, caption: 'Leather patch - red pocket stitching', alt: 'Raw indigo jeans worn, from the back: leather patch on the waistband and red freehand stitching on the back pockets' },
    ],
  },
  {
    no: '14', label: 'Pant', credit: 'res-res',
    cover: '/images/pant-14-back.webp',
    photos: [
      { src: '/images/pant-14-back.webp', w: 2000, h: 2000, caption: '14 oz vintage Japanese selvedge', alt: 'Raw indigo jeans from the back, near-black waistband, leather patch and white free-hand embroidery on both back pockets' },
    ],
  },
  // TODO: which pair number is this? Set `no` once known.
  {
    no: '—', label: 'Pant',
    photos: [
      { src: '/images/work-turnups.webp', w: 1500, h: 2000, caption: 'Selvedge turn-ups - white topstitching', alt: 'Wide dark jeans worn on the street, from the back: white topstitched pocket design and deep turn-ups showing the selvedge' },
    ],
  },
  { no: '15', label: 'Pant', date: '19.02.26', credit: 'Dublon' },
  { no: '16', label: 'Pant', date: '21.03.26', credit: 'Schruti' },
  { no: '17', label: 'Pant', date: '19.02.26', credit: 'Karl SABOT' },
  { no: '18', label: 'Pant', date: '20.04.26', credit: 'Kaybe' },
  { no: '19', label: 'Pant', credit: 'Ludvig Ryli' },
  { no: '21', label: 'Pant', credit: 'Mathias' },
  { no: '22', label: 'Shorts', date: '13.07.26', credit: 'YPB' },
  { no: '23', label: 'Shorts', credit: 'KayBe' },
  { no: '24', label: 'Pant', credit: 'Phillip Hededam' },
  { no: '25', label: 'Pant', credit: 'YPB' },
  { no: '26', label: 'Pant', credit: 'Alexander Baekgaard' },
  { no: '27', label: 'Pant', credit: 'Mathias' },
  { no: '—', label: 'Pinstripe' },
  { no: '—', label: '3-panel mailbag', credit: '1960s remake' },
];
