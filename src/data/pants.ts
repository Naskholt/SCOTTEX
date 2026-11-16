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
  photos?: { src: string; w: number; h: number; alt: string }[];
};

export const pants: Pant[] = [
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
  {
    no: '14', label: 'Pant', date: '08.01.26', credit: 'res-res',
    cover: '/images/pant-14-back.webp',
    photos: [
      { src: '/images/pant-14-back.webp', w: 2000, h: 2000, alt: 'Raw indigo jeans from the back, near-black waistband, leather patch and white free-hand embroidery on both back pockets' },
      { src: '/images/pant-14-pocket.webp', w: 2000, h: 800, alt: 'Close-up of a back pocket: copper topstitching and a white free-hand embroidered line of loops' },
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
