// Everything Benjamin or nic may need to change lives here.
// Facts come from the Scottex project summary (Group 6, Nov 2026). Don't add facts that aren't confirmed.

export const site = {
  name: 'SCOTTEX',
  maker: 'Benjamin',
  since: 2023,
  pairsMade: 27,
  hoursPerPair: 18,
  price: '2.500 kr',
  deposit: '250 kr',
  address: 'Nørrebrogade 235, st.',
  city: '2200 København N',
  entrance: 'Enter through the shop SABOT',
  hours: 'Weekdays 10–17',
  // TODO: fill in real handles / email before launch.
  instagram: '', // e.g. 'https://www.instagram.com/scottex'
  tiktok: '',
  email: '',
};

// Cal.com: create the three event types, then paste the links (the part after cal.com/).
// While a link is empty, the card shows "Booking opens soon" and links to Instagram/email instead.
export const booking = [
  {
    id: 'fitting',
    title: 'Fitting at the studio',
    length: '60 min',
    where: 'Nørrebro studio',
    text: 'Come by the studio. We take your measurements, talk fit and style, and look at fabric together.',
    calLink: '', // e.g. 'scottex/fitting'
  },
  {
    id: 'call',
    title: 'Consultation call',
    length: '20 min',
    where: 'Phone or video',
    text: 'Not ready to visit yet? A short call about what you want and how the process works.',
    calLink: '', // e.g. 'scottex/call'
  },
  {
    id: 'reserve',
    title: 'Reserve a pair',
    length: '250 kr deposit',
    where: 'Fully refundable',
    text: 'Hold your place in the queue with a refundable 250 kr deposit. We book your fitting right after.',
    calLink: '', // e.g. 'scottex/reserve' (Cal.com event with the Stripe app turned on)
    primary: true,
  },
];
