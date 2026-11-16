// Everything Benjamin or nic may need to change lives here.
// Facts come from the Scottex project summary (Group 6, Nov 2026). Don't add facts that aren't confirmed.

export const site = {
  name: 'SCOTTEX',
  maker: 'Benjamin',
  since: 2023,
  hoursPerPair: 18,
  price: '2.500 kr',
  deposit: '250 kr',
  address: 'Nørrebrogade 237, st.',
  city: '2200 København N',
  entrance: 'Enter through the shop SABOT',
  hours: 'Weekdays 10–17',
  // TODO: fill in real handles / email before launch.
  instagram: 'https://www.instagram.com/scottex___/',
  tiktok: '',
  email: '',
  // Newsletter form in the front fold. Paste a form endpoint (e.g. Buttondown, Mailchimp, Formspree) to show it.
  newsletter: '',
};

// Booking: ONE Cal.com event, "Fitting at the studio". The visitor:
//   1. finds a date and time
//   2. answers the booking questions (set these in Cal.com → the event → Advanced → Booking questions):
//      what matters to them in a pair of jeans, their budget, name and email (name + email are built in)
//   3. pays the deposit (Cal.com → Apps → Stripe, then turn on payment in the event and set 250 DKK).
//      Refunds are done by hand in Stripe.
// Paste the link (the part after cal.com/, e.g. 'scottex/fitting'). While it is empty, the button asks on Instagram instead.
export const booking = {
  id: 'fitting',
  title: 'Fitting at the studio',
  length: '60 min',
  where: 'Nørrebro studio',
  calLink: '',
  steps: [
    { t: 'Find a time', d: 'Pick a day and a time that suits you.' },
    { t: 'Tell me about you', d: 'What matters to you in a pair of jeans, your budget, your name and email.' },
    { t: 'Confirm', d: `A ${site.deposit} deposit holds your time. It is fully refundable.` },
  ],
};
