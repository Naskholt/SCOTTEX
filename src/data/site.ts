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
  phone: '+45 92 10 20 30', // shown as written; the call link uses the digits only
  // Newsletter form in the front fold (always shown). Paste a form endpoint (e.g. Buttondown, Mailchimp, Formspree)
  // to send sign-ups there; while empty, they go to the booking-test Google Sheet as event "newsletter".
  newsletter: '',
};

// Limited offer, shown as a thin bar at the top and under the hero button.
// It hides itself after `until` (end of that day). Set `on: false` to remove it now.
// TODO: confirm with Benjamin: 10% off what exactly, and the last day.
export const offer = {
  on: false,
  text: 'Christmas - 10% off every pair',
  short: 'Christmas - 10% off', // phones
  until: '2026-12-23',
  untilLabel: '23 December',
  untilShort: '23 Dec',
};
export const offerActive = offer.on && new Date() <= new Date(offer.until + 'T23:59:59');

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
  length: '30 min',
  where: 'Nørrebro studio',
  calLink: '',
  steps: [
    { t: 'Find a time', d: 'Pick a day and a time that suits you.' },
    { t: 'Tell me about you', d: 'What matters to you in a pair of jeans, your budget, your name and email.' },
    { t: 'Confirm', d: `A ${site.deposit} deposit holds your time. It is taken off the final price and fully refundable.` },
  ],
};

// Booking TEST (fake-door) on the home page: "Start your pair" opens it. Nothing is booked or paid.
// See tools/booking-test/README.md for the Google Sheet setup.
export const bookingTest = {
  // Google Apps Script web app URL (ends in /exec). Empty = the test still works but records nothing.
  sheetUrl: 'https://script.google.com/macros/s/AKfycbxcgDkXvVmYUA4Ayypj5dPHjnFB7yU0teb30xGv7lnCrL9clJGylRLi8EVxoF6U-z1b/exec',
  school: 'EK',
  // An email people can write to about their data (shown in the privacy note).
  contact: 'Nicolai.askholt@gmail.com',
  times: ['10:00', '12:00', '14:00', '16:00'],
  pieces: ['Jeans', 'Jorts', 'Jacket', 'Accessories', 'Something else'],
  matters: ['The fit', 'The denim', 'The details', 'That it lasts', 'Made locally', 'The price'],
  budget: ['Under 2.000 kr', '2.000–3.500 kr', '3.500–5.000 kr', 'Over 5.000 kr'],
  // Shown if someone closes the booking before confirming.
  exitReasons: ['Just looking around', 'The deposit', 'Not the right time', "I'd rather just drop by", 'Something else'],
  stoppedBy: ['The deposit', 'Too early for me', "I'd rather just drop by", 'Paying before we meet', 'Something else'],
};
