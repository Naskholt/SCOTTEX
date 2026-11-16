# Booking test (fake-door) — setup

The test is on the home page itself — share the normal link, e.g. `https://<your-site>/?utm_source=ig`.

"Start your pair" (in the hero and in Book) opens a booking panel: find a time → tell me about you → confirm (250 kr).
Pressing **Pay** shows an honest reveal: nothing was booked or paid, it's a test by our student group at EK.
Visitors then choose **Keep my answer** or **Delete my details**. "Not now" asks what stopped them.

## 1. Make the Google Sheet (5–10 min)

1. Go to [sheets.new](https://sheets.new) (signed in to the Google account the group will use). Name it "Scottex booking test".
2. **Extensions → Apps Script**. Delete what's there, paste everything from `apps-script.gs`, and press **Save** (💾).
3. In the bar at the top, pick the function **`setup`** and press **Run**.
   Google asks for permission: **Review permissions** → pick your account → **Advanced** →
   **Go to … (unsafe)** → **Allow**. (It says "unsafe" because you wrote the script yourself; it only touches this sheet.)
   Back in the sheet you now have four tabs: **Summary**, **People**, **How to use** and **Events**.
4. **Deploy → New deployment** → the gear ⚙ → **Web app**.
   - Description: anything, e.g. "v1"
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy**, and copy the **Web app URL** (ends in `/exec`).
5. Open that URL in a browser: it should say "Scottex booking test is listening."
6. Paste the URL into `bookingTest.sheetUrl` in `src/data/site.ts`, and fill in `bookingTest.contact`
   (an email people can write to about their data). Rebuild and deploy.

If you change the script later: **Deploy → Manage deployments → ✏️ edit → Version: New version → Deploy**, or the old code keeps running.
To rebuild or restyle the tabs (e.g. after changing the answer options), run `setup` again; the Events rows are kept.

### The Summary tab

Updates by itself. It shows:
- **Funnel**: unique visitors who visited → signed up → pressed "Start your pair" → picked a time → answered → pressed Pay
  (willing to put down the deposit) → kept their answer, with the share at each step.
- **Budget** and **What matters to them**.
- **Why they tried to leave** (the "Before you go" pop-up), split by who stayed and who left.
- **What stopped them** after "Not now", and **the step where they left**.
- **Where visitors came from** (the `?utm_source=` tag) and phone/computer.
The **People** tab lists the **newsletter emails** and the people who **kept their answer** (name, email, day, time, budget).
It's personal data: don't share that tab.

## 2. What gets recorded

One row per event in the **Events** tab:

| event | when |
| --- | --- |
| `view` | someone opens the site |
| `open` | they press "Start your pair" |
| `time_picked` | they picked a day and time and pressed Next |
| `details_done` | they answered the two questions and pressed Next (answers only, no name/email) |
| `pay_click` | they pressed "Pay 250 kr deposit" ← the key number |
| `keep` | they chose "Keep my answer" — the **only** row with name and email |
| `declined` | they chose "Delete my details" (no name/email was ever sent) |
| `not_now` | they pressed "Not now" on the confirm step |
| `reason` | what stopped them (after "Not now") |
| `exit_prompt` | they tried to close before confirming → the "Before you go" pop-up opened (`step` says where) |
| `exit_continue` | they pressed "Continue booking" in that pop-up (`reason` = what they picked, if anything) |
| `exit_leave` | they pressed "Leave anyway" (`reason` = what they picked, if anything) |
| `close` | they closed the panel (`step` says where) |
| `newsletter` | someone signed up in the hero's "News on new fabrics" field (has their email) |

Each visit has a random `visitor` id (kept in memory only, no cookies), so you can follow one person's path,
including a newsletter sign-up in the same visit.
`utm_source` etc. come from the link you share — use a different tag per channel, e.g.
`/?utm_source=ig`, `/?utm_source=tiktok`, `/?utm_source=qr`.

**Conversion:** `pay_click` visitors ÷ `open` visitors = share who would pay the deposit.

While `sheetUrl` is empty, nothing is sent; the events are printed in the browser console instead (handy for trying it).

## 3. When the project ends

Delete the sheet (the privacy note promises this), and remove `<BookingTest />` from `src/pages/index.astro` and
`src/components/BookingTest.astro` if the test is no longer needed.
