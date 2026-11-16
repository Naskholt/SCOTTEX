/**
 * Scottex booking test → Google Sheet.
 * Paste this into Extensions → Apps Script of the Google Sheet, press Run on `setup` once,
 * then Deploy → New deployment → Web app (Execute as: Me · Who has access: Anyone).
 * Copy the /exec URL into bookingTest.sheetUrl in src/data/site.ts.
 *
 * Every event from the site becomes one row in the "Events" tab.
 * The "Summary" tab adds it all up with formulas, so it updates by itself.
 * Name and email only arrive with the "keep" event (the visitor pressed "Keep my answer"),
 * and an email with "newsletter" (someone signed up in the hero).
 */
const SHEET_NAME = 'Events';
const SUMMARY_NAME = 'Summary';
// A received · B event · C visitor · D step · E day · F time · G matters · H budget · I reason
// J name · K email · L utm_source · M utm_medium · N utm_campaign · O referrer · P device
const COLUMNS = [
  'received', 'event', 'visitor', 'step', 'day', 'time', 'matters', 'budget', 'reason',
  'name', 'email', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'device',
];
// Keep in sync with bookingTest.matters in src/data/site.ts.
const MATTERS = ['The fit', 'The denim', 'The details', 'That it lasts', 'Made locally', 'The price'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();
    const row = COLUMNS.map((c) => (c === 'received' ? new Date() : clean_(data[c])));
    sheet.appendRow(row);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// Opening the /exec URL in a browser shows this, so you can check the deployment works.
function doGet() {
  return ContentService.createTextOutput('Scottex booking test is listening.');
}

// Run once from the editor (select "setup" → Run). Makes both tabs and asks for permission.
function setup() {
  getSheet_();
  buildSummary_();
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  if (!ss.getSheetByName(SUMMARY_NAME)) buildSummary_();
  return sheet;
}

// The Summary tab: only formulas, so it always reflects the Events tab.
function buildSummary_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SUMMARY_NAME);
  if (s) s.clear(); else s = ss.insertSheet(SUMMARY_NAME, 0);
  const E = SHEET_NAME + '!';
  const uniq = (ev) => `=IFERROR(COUNTUNIQUE(FILTER(${E}C2:C, ${E}B2:B="${ev}")), 0)`;
  const rows = (ev) => `=COUNTIF(${E}B2:B, "${ev}")`;
  const q = (sql) => `=IFERROR(QUERY(${E}A2:P, "${sql}", 0), "Nothing yet")`;
  const head = (r, c, text) => s.getRange(r, c).setValue(text).setFontWeight('bold').setFontSize(12);

  // 1. Funnel: unique visitors at each step, and the share of those who opened the booking.
  head(1, 1, 'Funnel (unique visitors)');
  s.getRange(2, 1, 1, 3).setValues([['Step', 'People', 'Of those who pressed Start your pair']]).setFontWeight('bold');
  const funnel = [
    ['Visited the site', uniq('view')],
    ['Signed up for the newsletter', rows('newsletter')],
    ['Pressed "Start your pair"', uniq('open')],
    ['Picked a day and time', uniq('time_picked')],
    ['Answered budget + what matters', uniq('details_done')],
    ['Pressed "Pay 250 kr deposit"  ← willing to pay', uniq('pay_click')],
    ['Kept their answer (left name + email)', uniq('keep')],
    ['Deleted their details', uniq('declined')],
    ['Pressed "Not now" on the deposit step', uniq('not_now')],
    ['Tried to close before confirming (got "Before you go")', uniq('exit_prompt')],
    ['…then pressed "Continue booking"', uniq('exit_continue')],
    ['…then pressed "Leave anyway"', uniq('exit_leave')],
  ];
  funnel.forEach(([label, f], i) => {
    const r = 3 + i;
    s.getRange(r, 1).setValue(label);
    s.getRange(r, 2).setFormula(f);
    if (i >= 3) s.getRange(r, 3).setFormula(`=IF($B$5=0, "", B${r}/$B$5)`).setNumberFormat('0%');
  });

  // 2. Budget.
  head(17, 1, 'Budget (from "Tell me about you")');
  s.getRange(18, 1).setFormula(q("select H, count(C) where B = 'details_done' and H <> '' group by H order by count(C) desc label H 'Budget', count(C) 'People'"));

  // 3. What matters (people can pick several, so each option is counted on its own).
  head(26, 1, 'What matters to them (pick any)');
  s.getRange(27, 1, 1, 2).setValues([['Answer', 'People']]).setFontWeight('bold');
  MATTERS.forEach((m, i) => {
    s.getRange(28 + i, 1).setValue(m);
    s.getRange(28 + i, 2).setFormula(`=COUNTIFS(${E}B2:B, "details_done", ${E}G2:G, "*${m}*")`);
  });

  // 4. Why people closed the booking: the "Before you go" pop-up, split by stayed / left.
  head(36, 1, 'Why they tried to leave ("Before you go" pop-up)');
  s.getRange(37, 1).setFormula(q("select I, count(C) where (B = 'exit_leave' or B = 'exit_continue') and I <> '' group by I pivot B label I 'Reason'"));

  // 5. What stopped them after "Not now".
  head(45, 1, 'What stopped them (after "Not now")');
  s.getRange(46, 1).setFormula(q("select I, count(C) where B = 'reason' and I <> '' group by I order by count(C) desc label I 'Reason', count(C) 'People'"));

  // 6. At which step people left the booking.
  head(54, 1, 'Step where they left');
  s.getRange(55, 1).setFormula(q("select D, count(C) where B = 'exit_leave' or B = 'close' group by D label D 'Step', count(C) 'Times'"));

  // 7. Where visitors came from (the ?utm_source= tag on the link you shared) and their device.
  head(62, 1, 'Where visitors came from');
  s.getRange(63, 1).setFormula(q("select L, P, count(C) where B = 'view' group by L, P label L 'Source (empty = direct)', P 'Device', count(C) 'Visits'"));

  // Lists on the right: newsletter emails and the people who kept their booking answer.
  head(1, 6, 'Newsletter sign-ups');
  s.getRange(2, 6).setFormula(q("select A, K where B = 'newsletter' order by A desc label A 'When', K 'Email'"));
  head(1, 9, 'Kept their answer (would book)');
  s.getRange(2, 9).setFormula(q("select A, J, K, E, F, H, G where B = 'keep' order by A desc label A 'When', J 'Name', K 'Email', E 'Day', F 'Time', H 'Budget', G 'What matters'"));

  s.setColumnWidth(1, 380);
  s.setColumnWidths(2, 2, 120);
  s.setColumnWidth(3, 230);
  s.setFrozenRows(0);
}

// Plain text only, short, and never starting with = + - @ (so nothing runs as a formula in the sheet).
function clean_(v) {
  if (v === undefined || v === null) return '';
  let s = String(v).slice(0, 300);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
