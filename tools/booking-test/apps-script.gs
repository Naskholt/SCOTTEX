/**
 * Scottex booking test → Google Sheet.
 * Paste this into Extensions → Apps Script of the Google Sheet, press Run on `setup` once,
 * then Deploy → New deployment → Web app (Execute as: Me · Who has access: Anyone).
 * Copy the /exec URL into bookingTest.sheetUrl in src/data/site.ts.
 *
 * Tabs (setup makes and styles them; running it again keeps every row in Events):
 *   Summary    — the results, all formulas, updates by itself
 *   People     — names and emails (would-book + newsletter). Personal data: don't share this tab.
 *   How to use — notes for the group
 *   Events     — one row per click on the site (raw data)
 * Name and email only arrive with the "keep" event (the visitor pressed "Keep my answer"),
 * and an email with "newsletter" (someone signed up in the hero).
 */
const SHEET_NAME = 'Events';
const SUMMARY_NAME = 'Summary';
const PEOPLE_NAME = 'People';
const GUIDE_NAME = 'How to use';
const SITE = 'https://scottex-ek.netlify.app/';

// A received · B event · C visitor · D step · E day · F time · G matters · H budget · I reason
// J name · K email · L utm_source · M utm_medium · N utm_campaign · O referrer · P device
// Q pieces (what they'd like made) · R note (what they wrote about it)
const COLUMNS = [
  'received', 'event', 'visitor', 'step', 'day', 'time', 'matters', 'budget', 'reason',
  'name', 'email', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'device',
  'pieces', 'note',
];

// Answer options. Keep in sync with bookingTest in src/data/site.ts.
const PIECES = ['Jeans', 'Jorts', 'Jacket', 'Accessories', 'Something else'];
const MATTERS = ['The fit', 'The denim', 'The details', 'That it lasts', 'Made locally', 'The price'];
const BUDGETS = ['Under 2.000 kr', '2.000–3.500 kr', '3.500–5.000 kr', 'Over 5.000 kr'];
const EXIT_REASONS = ['Just looking around', 'The deposit', 'Not the right time', "I'd rather just drop by", 'Something else'];
const STOPPED_BY = ['The deposit', 'Too early for me', "I'd rather just drop by", 'Paying before we meet', 'Something else'];
const STEPS = [['time', '1 · Find a time'], ['about', '2 · Tell me about you'], ['confirm', '3 · Confirm (deposit)']];
// Where links are shared: the ?utm_source= tag and a name for it.
const SOURCES = [
  ['ig', 'Instagram (bio, story, DM)'],
  ['tiktok', 'TikTok'],
  ['qr', 'Printed QR code (poster, flyer, in the shop)'],
  ['class', 'Messenger / class group chat'],
];

// Scottex colours.
const C = {
  ink: '#0b0b0a', bone: '#e8e3d8', ash: '#8c877d', text: '#2b2925',
  rivet: '#b4733a', rivetSoft: '#f6ebe0', band: '#f3f0e8', line: '#e3ded3', white: '#ffffff',
};

// ---------------------------------------------------------------- receiving rows

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

// START FRESH: run this once from the editor (select "startFresh" → Run) to delete every recorded row,
// so all counts go back to 0. The column names in row 1 and all tabs stay. This can't be undone.
function startFresh() {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last > 1) {
    sheet.insertRowAfter(last); // Sheets won't delete every row under a frozen header, so keep one empty row
    sheet.deleteRows(2, last - 1);
  }
  styleEvents_();
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet_(SUMMARY_NAME, 0));
}

// Run from the editor (select "setup" → Run). Makes and styles every tab. Events rows are kept.
function setup() {
  getSheet_();
  styleEvents_();
  buildSummary_();
  buildPeople_();
  buildGuide_();
  // Remove the empty tab a new spreadsheet starts with ("Sheet1", or "Ark 1" in Danish).
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach((sh) => {
    if (/^(Sheet|Ark|Blad)\s?1$/.test(sh.getName()) && sh.getLastRow() === 0 && ss.getNumSheets() > 1) ss.deleteSheet(sh);
  });
  ss.setActiveSheet(sheet_(SUMMARY_NAME, 0));
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    styleEvents_();
  }
  if (!ss.getSheetByName(SUMMARY_NAME)) { buildSummary_(); buildPeople_(); }
  return sheet;
}

// ---------------------------------------------------------------- helpers

// Get (or make) a tab and put it at position `index` (0 = first).
function sheet_(name, index) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(name);
  if (!s) s = ss.insertSheet(name);
  ss.setActiveSheet(s);
  ss.moveActiveSheet(Math.min(index, ss.getNumSheets() - 1) + 1);
  return s;
}

// Wipe a tab's content and formatting (used for the tabs that are only formulas or notes).
function reset_(s) {
  s.getRange(1, 1, s.getMaxRows(), s.getMaxColumns()).breakApart();
  s.clear();
  s.getBandings().forEach((b) => b.remove());
  s.setHiddenGridlines(true);
  s.setFrozenRows(0);
  s.getRange(1, 1, s.getMaxRows(), s.getMaxColumns()).setFontFamily('Arial').setFontColor(C.text).setVerticalAlignment('middle');
}

// Black title bar across the top, with a grey line under it.
function title_(s, lastCol, text, sub) {
  s.getRange(1, 1, 1, lastCol).setBackground(C.ink);
  s.getRange(1, 2, 1, lastCol - 1).merge().setValue(text)
    .setFontColor(C.bone).setFontSize(18).setFontWeight('bold');
  s.setRowHeight(1, 52);
  const r = s.getRange(2, 2, 1, lastCol - 1).merge();
  if (String(sub).charAt(0) === '=') r.setFormula(sub); else r.setValue(sub);
  r.setFontColor(C.ash).setFontStyle('italic');
  s.setRowHeight(2, 30);
  s.setColumnWidth(1, 18);
}

// Black section bar.
function section_(s, row, col, width, text) {
  s.getRange(row, col, 1, width).merge().setValue(text.toUpperCase())
    .setBackground(C.ink).setFontColor(C.bone).setFontWeight('bold').setFontSize(10);
  s.setRowHeight(row, 30);
}

// Light table header row.
function th_(s, row, col, labels) {
  s.getRange(row, col, 1, labels.length).setValues([labels])
    .setBackground(C.band).setFontWeight('bold').setFontSize(10).setFontColor(C.text);
}

// Thin lines between table rows.
function lines_(s, row, col, nRows, nCols) {
  s.getRange(row, col, nRows, nCols)
    .setBorder(null, null, true, null, null, true, C.line, SpreadsheetApp.BorderStyle.SOLID);
}

// ---------------------------------------------------------------- Summary

function buildSummary_() {
  const s = sheet_(SUMMARY_NAME, 0);
  reset_(s);
  s.setTabColor(C.rivet);
  const E = SHEET_NAME + '!';
  // COUNTUNIQUEIFS gives a true 0 when nothing matches (COUNTUNIQUE(FILTER()) would count the "no match" error as 1).
  const uniq = (ev) => `=COUNTUNIQUEIFS(${E}C2:C, ${E}B2:B, "${ev}")`;
  const count = (ev) => `=COUNTIF(${E}B2:B, "${ev}")`;
  const share = (r, of) => `=IF($C$${of}=0, "", C${r}/$C$${of})`;

  // Column grid: A margin · B-D left block · E gap · F-H right block.
  s.setColumnWidth(2, 330); s.setColumnWidth(3, 90); s.setColumnWidth(4, 150);
  s.setColumnWidth(5, 36);
  s.setColumnWidth(6, 260); s.setColumnWidth(7, 90); s.setColumnWidth(8, 90);

  title_(s, 8, 'SCOTTEX · Booking test results',
    `=IF(COUNTA(${E}B2:B)=0, "No visits yet. This tab fills in by itself.", "Updates by itself · last activity "&TEXT(MAX(${E}A2:A), "d mmm yyyy, hh:mm"))`);

  // Key numbers.
  const OPEN = 11, DETAILS = 13, PAY = 14; // rows in the funnel table below
  s.getRange(4, 2, 2, 3).setBackground(C.band);
  s.getRange(4, 6, 2, 3).setBackground(C.rivetSoft);
  s.getRange(4, 2).setValue('VISITORS');
  s.getRange(5, 2).setFormula(uniq('view'));
  s.getRange(4, 3, 1, 2).merge().setValue('PRESSED "START YOUR PAIR"');
  s.getRange(5, 3, 1, 2).merge().setFormula(uniq('open'));
  s.getRange(4, 6).setValue('WOULD PAY THE 250 KR DEPOSIT');
  s.getRange(5, 6).setFormula(`=IF(C${OPEN}=0, "–", C${PAY}/C${OPEN})`).setNumberFormat('0%').setFontColor(C.rivet);
  s.getRange(4, 7, 1, 2).merge().setValue('NEWSLETTER');
  s.getRange(5, 7, 1, 2).merge().setFormula(count('newsletter'));
  s.getRange(4, 2, 1, 7).setFontSize(9).setFontColor(C.ash).setFontWeight('bold').setVerticalAlignment('bottom');
  s.getRange(5, 2, 1, 7).setFontSize(24).setFontWeight('bold').setHorizontalAlignment('left').setVerticalAlignment('top');
  s.getRange(5, 6).setFontColor(C.rivet);
  s.setRowHeight(4, 26); s.setRowHeight(5, 46);

  // Left · Funnel.
  section_(s, 7, 2, 3, 'Funnel · unique visitors');
  th_(s, 8, 2, ['Step', 'People', 'Of "Start your pair"']);
  const funnel = [
    ['Visited the site', uniq('view')],
    ['Signed up for the newsletter', count('newsletter')],
    ['Pressed "Start your pair"', uniq('open')],
    ['Picked a day and time', uniq('time_picked')],
    ['Answered budget + what matters', uniq('details_done')],
    ['Pressed "Pay 250 kr deposit"  ← willing to pay', uniq('pay_click')],
    ['Kept their answer (left name + email)', uniq('keep')],
    ['Deleted their details', uniq('declined')],
    ['Pressed "Not now" on the deposit step', uniq('not_now')],
    ['Tried to close before confirming', uniq('exit_prompt')],
    ['   …then pressed "Continue booking"', uniq('exit_continue')],
    ['   …then pressed "Leave anyway"', uniq('exit_leave')],
  ];
  funnel.forEach(([label, f], i) => {
    const r = 9 + i;
    s.getRange(r, 2).setValue(label);
    s.getRange(r, 3).setFormula(f);
    if (i >= 3) s.getRange(r, 4).setFormula(share(r, OPEN));
  });
  lines_(s, 9, 2, funnel.length, 3);
  s.getRange(PAY, 2, 1, 3).setBackground(C.rivetSoft).setFontWeight('bold').setFontColor(C.rivet);

  // Left · What matters.
  section_(s, 23, 2, 3, 'What matters to them · pick any');
  th_(s, 24, 2, ['Answer', 'People', 'Of those who answered']);
  MATTERS.forEach((m, i) => {
    const r = 25 + i;
    s.getRange(r, 2).setValue(m);
    s.getRange(r, 3).setFormula(`=COUNTIFS(${E}B2:B, "details_done", ${E}G2:G, "*${m}*")`);
    s.getRange(r, 4).setFormula(share(r, DETAILS));
  });
  lines_(s, 25, 2, MATTERS.length, 3);

  // Left · Budget.
  section_(s, 33, 2, 3, 'Budget for one pair');
  th_(s, 34, 2, ['Budget', 'People', 'Of those who answered']);
  BUDGETS.forEach((b, i) => {
    const r = 35 + i;
    s.getRange(r, 2).setValue(b);
    s.getRange(r, 3).setFormula(`=COUNTIFS(${E}B2:B, "details_done", ${E}H2:H, "${b}")`);
    s.getRange(r, 4).setFormula(share(r, DETAILS));
  });
  lines_(s, 35, 2, BUDGETS.length, 3);

  // Left · What they'd like made.
  section_(s, 41, 2, 3, "What they'd like made · pick any");
  th_(s, 42, 2, ['Piece', 'People', 'Of those who answered']);
  PIECES.forEach((p, i) => {
    const r = 43 + i;
    s.getRange(r, 2).setValue(p);
    s.getRange(r, 3).setFormula(`=COUNTIFS(${E}B2:B, "details_done", ${E}Q2:Q, "*${p}*")`);
    s.getRange(r, 4).setFormula(share(r, DETAILS));
  });
  lines_(s, 43, 2, PIECES.length, 3);
  s.getRange(43, 3, PIECES.length, 2).setHorizontalAlignment('center');
  s.getRange(43, 4, PIECES.length, 1).setNumberFormat('0%');

  // Right · Why they tried to leave ("Before you go" pop-up).
  section_(s, 7, 6, 3, 'Why they tried to leave · "Before you go"');
  th_(s, 8, 6, ['Reason', 'Stayed', 'Left']);
  [...EXIT_REASONS, '(no reason picked)'].forEach((reason, i) => {
    const r = 9 + i;
    const crit = reason.charAt(0) === '(' ? '""' : `"${reason.replace(/"/g, '""')}"`;
    s.getRange(r, 6).setValue(reason);
    s.getRange(r, 7).setFormula(`=COUNTIFS(${E}B2:B, "exit_continue", ${E}I2:I, ${crit})`);
    s.getRange(r, 8).setFormula(`=COUNTIFS(${E}B2:B, "exit_leave", ${E}I2:I, ${crit})`);
  });
  lines_(s, 9, 6, EXIT_REASONS.length + 1, 3);

  // Right · What stopped them after "Not now".
  section_(s, 17, 6, 3, 'What stopped them · after "Not now"');
  th_(s, 18, 6, ['Reason', 'People', '']);
  STOPPED_BY.forEach((reason, i) => {
    const r = 19 + i;
    s.getRange(r, 6).setValue(reason);
    s.getRange(r, 7).setFormula(`=COUNTIFS(${E}B2:B, "reason", ${E}I2:I, "${reason.replace(/"/g, '""')}")`);
  });
  lines_(s, 19, 6, STOPPED_BY.length, 3);

  // Right · Step where they left.
  section_(s, 26, 6, 3, 'Step where they left');
  th_(s, 27, 6, ['Step', 'Left there', '']);
  STEPS.forEach(([step, label], i) => {
    const r = 28 + i;
    s.getRange(r, 6).setValue(label);
    s.getRange(r, 7).setFormula(`=COUNTIFS(${E}B2:B, "exit_leave", ${E}D2:D, "${step}")`);
  });
  lines_(s, 28, 6, STEPS.length, 3);

  // Right · Where visitors came from (the ?utm_source= tag on the shared link). Every channel is always listed.
  section_(s, 33, 6, 3, 'Where visitors came from');
  th_(s, 34, 6, ['Channel', 'Visits', 'On a phone']);
  const src = [...SOURCES.map(([tag, name]) => [name, `"${tag}"`]), ['No tag (typed the address)', '""'], ['Tests (delete these)', '"test"']];
  src.forEach(([name, crit], i) => {
    const r = 35 + i;
    s.getRange(r, 6).setValue(name);
    s.getRange(r, 7).setFormula(`=COUNTIFS(${E}B2:B, "view", ${E}L2:L, ${crit})`);
    s.getRange(r, 8).setFormula(`=COUNTIFS(${E}B2:B, "view", ${E}L2:L, ${crit}, ${E}P2:P, "phone")`);
  });
  const other = 35 + src.length;
  s.getRange(other, 6).setValue('Other tags');
  s.getRange(other, 7).setFormula(`=COUNTIF(${E}B2:B, "view") - SUM(G35:G${other - 1})`);
  s.getRange(other, 8).setFormula(`=COUNTIFS(${E}B2:B, "view", ${E}P2:P, "phone") - SUM(H35:H${other - 1})`);
  s.getRange(other - 1, 6, 1, 3).setFontColor(C.ash);
  lines_(s, 35, 6, src.length + 1, 3);

  // Full width · the link to share for each channel.
  const L0 = Math.max(other, 43 + PIECES.length - 1) + 3;
  section_(s, L0, 2, 7, 'Links to share · one per channel');
  th_(s, L0 + 1, 2, ['Channel', 'Link', '', '', '', '', '']);
  s.getRange(L0 + 1, 3, 1, 6).merge();
  SOURCES.forEach(([tag, name], i) => {
    const r = L0 + 2 + i;
    s.getRange(r, 2).setValue(name);
    s.getRange(r, 3, 1, 6).merge().setValue(SITE + '?utm_source=' + tag).setFontFamily('Roboto Mono').setFontSize(10);
  });
  const any = L0 + 2 + SOURCES.length;
  s.getRange(any, 2).setValue('Anything else');
  s.getRange(any, 3, 1, 6).merge().setValue(SITE + '?utm_source=yourword   (one word, no spaces)')
    .setFontFamily('Roboto Mono').setFontSize(10).setFontColor(C.ash);
  lines_(s, L0 + 2, 2, SOURCES.length + 1, 7);

  // Full width · what people wrote in "Tell me what you're looking for".
  const W0 = any + 3;
  section_(s, W0, 2, 7, "What they're looking for · in their own words");
  s.getRange(W0 + 1, 2).setFormula(`=IFERROR(QUERY(${E}A2:R, "select A, Q, H, R where B = 'details_done' and R <> '' order by A desc label A 'When', Q 'Made', H 'Budget', R 'What they wrote'", 0), "Nothing written yet")`);
  s.getRange(W0 + 1, 2, 1, 7).setBackground(C.band).setFontWeight('bold').setFontSize(10);
  s.getRange(W0 + 2, 2, 200, 1).setNumberFormat('d mmm, hh:mm');
  lines_(s, W0 + 2, 2, 30, 7);

  // Counts are plain whole numbers (never shown as %).
  s.getRange(5, 2, 1, 7).setNumberFormat('0');
  s.getRange(5, 6).setNumberFormat('0%');
  s.getRange(9, 3, 40, 1).setNumberFormat('0');
  s.getRange(9, 7, 40, 2).setNumberFormat('0');

  // Numbers: centred; shares as %.
  [[9, 3, 34], [9, 7, 36]].forEach(([r, c, n]) => s.getRange(r, c, n, 2).setHorizontalAlignment('center'));
  s.getRange(9, 4, 30, 1).setNumberFormat('0%');
  s.getRange(8, 3, 1, 2).setHorizontalAlignment('center');
  s.getRange(4, 2, 2, 7).setHorizontalAlignment('left');
}

// ---------------------------------------------------------------- People (personal data)

function buildPeople_() {
  const s = sheet_(PEOPLE_NAME, 1);
  reset_(s);
  s.setTabColor(C.ink);
  const E = SHEET_NAME + '!';
  // A margin · B-J would book · K gap · L-M newsletter
  [[2, 120], [3, 140], [4, 210], [5, 100], [6, 60], [7, 150], [8, 120], [9, 200], [10, 320], [11, 36], [12, 120], [13, 230]]
    .forEach(([c, w]) => s.setColumnWidth(c, w));
  title_(s, 13, 'SCOTTEX · People', 'Real names and emails. Don\'t share this tab, and delete the sheet when the project ends.');

  section_(s, 4, 2, 9, 'Would book · kept their answer');
  s.getRange(5, 2).setFormula(`=IFERROR(QUERY(${E}A2:R, "select A, J, K, E, F, Q, H, G, R where B = 'keep' order by A desc label A 'When', J 'Name', K 'Email', E 'Day', F 'Time', Q 'Made', H 'Budget', G 'What matters', R 'What they wrote'", 0), "Nobody yet")`);
  s.getRange(5, 2, 1, 9).setBackground(C.band).setFontWeight('bold').setFontSize(10);
  s.getRange(6, 2, 300, 1).setNumberFormat('d mmm, hh:mm');
  s.getRange(6, 10, 300, 1).setWrap(true);
  lines_(s, 6, 2, 40, 9);

  section_(s, 4, 12, 2, 'Newsletter sign-ups');
  s.getRange(5, 12).setFormula(`=IFERROR(QUERY(${E}A2:R, "select A, K where B = 'newsletter' order by A desc label A 'When', K 'Email'", 0), "Nobody yet")`);
  s.getRange(5, 12, 1, 2).setBackground(C.band).setFontWeight('bold').setFontSize(10);
  s.getRange(6, 12, 300, 1).setNumberFormat('d mmm, hh:mm');
  lines_(s, 6, 12, 40, 2);
}

// ---------------------------------------------------------------- How to use

function buildGuide_() {
  const g = sheet_(GUIDE_NAME, 2);
  reset_(g);
  g.setTabColor(C.ash);
  g.setColumnWidth(2, 300);
  g.setColumnWidth(3, 600);
  title_(g, 3, 'SCOTTEX · How to use this sheet', 'Notes for the group.');

  const note = (row, text) => g.getRange(row, 2, 1, 2).merge().setValue(text).setWrap(true).setFontColor(C.text);
  const pairs = (row, list) => {
    g.getRange(row, 2, list.length, 2).setValues(list).setWrap(true).setVerticalAlignment('top');
    g.getRange(row, 2, list.length, 1).setFontWeight('bold');
    lines_(g, row, 2, list.length, 2);
  };

  section_(g, 4, 2, 2, '1 · Share a different link for each place');
  note(5, 'Everyone lands on the same site. The part after ?utm_source= is a label that gets saved, so the Summary tab can show where visitors came from. The same links are at the bottom of the Summary tab.');
  g.setRowHeight(5, 44);
  th_(g, 6, 2, ['Where you share it', 'Link to use']);
  const links = [
    ...SOURCES.map(([tag, name]) => [name, SITE + '?utm_source=' + tag]),
    ['Anything else', SITE + '?utm_source=yourword   (one word, no spaces)'],
  ];
  g.getRange(7, 2, links.length, 2).setValues(links);
  g.getRange(7, 3, links.length, 1).setFontFamily('Roboto Mono').setFontSize(10);
  lines_(g, 7, 2, links.length, 2);

  section_(g, 13, 2, 2, '2 · Delete test rows before sharing');
  note(14, 'Test visits are counted like real ones. Rows with "test" in the utm_source column are tests.');
  pairs(15, [
    ['How', 'Events tab → click the first test row number → hold Shift → click the last → right-click → Delete rows.'],
    ['Never delete', 'Row 1 in Events (the column names). The other tabs need it.'],
    ['Start from 0', 'Extensions → Apps Script → pick "startFresh" → Run. Deletes every row in Events (can\'t be undone).'],
  ]);
  g.getRange(16, 2, 1, 2).setFontColor(C.rivet);

  section_(g, 19, 2, 2, '3 · Reading the results');
  pairs(20, [
    ['Summary', 'Updates by itself. Funnel, what matters, budget, what they\'d like made, why people left, where they came from, and what people wrote.'],
    ['Key number', '"Would pay the 250 kr deposit" at the top = people who pressed Pay ÷ people who pressed "Start your pair".'],
    ['People', 'Names and emails of people who would book, and newsletter sign-ups. Personal data: don\'t share it.'],
    ['Events', 'One row per click. The visitor column lets you follow one person through their visit.'],
  ]);

  section_(g, 25, 2, 2, '4 · When the project ends');
  note(26, 'Delete this sheet. The privacy note on the site promises it.');

  g.getRange(5, 2, 22, 2).setVerticalAlignment('middle');
  [7, 8, 9, 10, 11, 15, 16, 17, 20, 21, 22, 23].forEach((r) => g.setRowHeight(r, 30));
}

// ---------------------------------------------------------------- Events (raw data, never cleared)

function styleEvents_() {
  const s = sheet_(SHEET_NAME, 3);
  s.setTabColor('#cfcac0');
  s.setFrozenRows(1);
  s.getBandings().forEach((b) => b.remove());

  // Only keep the rows in use (plus one), so the tab doesn't look endless. New visits add rows by themselves.
  const keep = Math.max(s.getLastRow() + 1, 2);
  if (s.getMaxRows() > keep) s.deleteRows(keep + 1, s.getMaxRows() - keep);
  if (s.getMaxColumns() > COLUMNS.length) s.deleteColumns(COLUMNS.length + 1, s.getMaxColumns() - COLUMNS.length);
  if (s.getMaxColumns() < COLUMNS.length) s.insertColumnsAfter(s.getMaxColumns(), COLUMNS.length - s.getMaxColumns());

  // Header.
  s.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS])
    .setBackground(C.ink).setFontColor(C.bone).setFontWeight('bold');
  s.setRowHeight(1, 30);

  // Shading on every other row, and readable dates. Open-ended ranges, so new rows get it too.
  const body = s.getRange('A2:R');
  s.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($B2<>"", ISEVEN(ROW()))')
      .setBackground(C.band).setRanges([body]).build(),
  ]);
  s.getRange('A2:A').setNumberFormat('d mmm yyyy, hh:mm:ss');

  const widths = { received: 160, event: 120, visitor: 140, step: 80, day: 100, time: 60, matters: 220, budget: 120,
    reason: 180, name: 120, email: 200, utm_source: 100, utm_medium: 100, utm_campaign: 110, referrer: 200, device: 80, pieces: 160, note: 320 };
  COLUMNS.forEach((c, i) => s.setColumnWidth(i + 1, widths[c]));
}

// Plain text only, short, and never starting with = + - @ (so nothing runs as a formula in the sheet).
function clean_(v) {
  if (v === undefined || v === null) return '';
  let s = String(v).slice(0, 600);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
