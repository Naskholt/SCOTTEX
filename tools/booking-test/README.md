# Booking test (fake-door) — setup

The test lives at **`/test`** on the site (e.g. `https://<your-site>/test?utm_source=ig`).
The real home page `/` is not affected, and `/test` is hidden from search engines.

On `/test`, "Start your pair" opens a booking panel: find a time → tell me about you → confirm (250 kr).
Pressing **Pay** shows an honest reveal: nothing was booked or paid, it's a test by our student group at EK.
Visitors then choose **Keep my answer** or **Delete my details**. "Not now" asks what stopped them.

## 1. Make the Google Sheet (5 min)

1. Create a new Google Sheet, e.g. "Scottex booking test".
2. **Extensions → Apps Script**. Delete what's there and paste everything from `apps-script.gs`. Save.
3. **Deploy → New deployment** → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, allow the permissions, and copy the **Web app URL** (ends in `/exec`).
4. Open that URL in a browser: it should say "Scottex booking test is listening."
5. Paste the URL into `bookingTest.sheetUrl` in `src/data/site.ts`, and fill in `bookingTest.contact`
   (an email people can write to about their data). Rebuild and deploy.

If you change the script later: **Deploy → Manage deployments → edit → New version**, or the old code keeps running.

## 2. What gets recorded

One row per event in the **Events** tab:

| event | when |
| --- | --- |
| `view` | someone opens the /test page |
| `open` | they press "Start your pair" |
| `time_picked` | they picked a day and time and pressed Next |
| `details_done` | they answered the two questions and pressed Next (answers only, no name/email) |
| `pay_click` | they pressed "Pay 250 kr deposit" ← the key number |
| `keep` | they chose "Keep my answer" — the **only** row with name and email |
| `declined` | they chose "Delete my details" (no name/email was ever sent) |
| `not_now` | they pressed "Not now" on the confirm step |
| `reason` | what stopped them (after "Not now") |
| `close` | they closed the panel (`step` says where) |

Each visit has a random `visitor` id (kept in memory only, no cookies), so you can follow one person's path.
`utm_source` etc. come from the link you share — use a different tag per channel, e.g.
`/test?utm_source=ig`, `/test?utm_source=tiktok`, `/test?utm_source=qr`.

**Conversion:** `pay_click` visitors ÷ `open` visitors = share who would pay the deposit.

While `sheetUrl` is empty, nothing is sent; the events are printed in the browser console instead (handy for trying it).

## 3. When the project ends

Delete the sheet (the privacy note promises this), and remove `src/pages/test.astro` and
`src/components/BookingTest.astro` if the test is no longer needed.
