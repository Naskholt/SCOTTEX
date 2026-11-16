/**
 * Scottex booking test → Google Sheet.
 * Paste this into Extensions → Apps Script of the Google Sheet, then Deploy → New deployment → Web app
 * (Execute as: Me · Who has access: Anyone). Copy the /exec URL into bookingTest.sheetUrl in src/data/site.ts.
 *
 * Every event from the booking test on the site becomes one row in the "Events" tab.
 * Name and email only arrive with the "keep" event (the visitor pressed "Keep my answer"),
 * and an email with "newsletter" (someone signed up in the hero).
 */
const SHEET_NAME = 'Events';
const COLUMNS = [
  'received', 'event', 'visitor', 'step', 'day', 'time', 'matters', 'budget', 'reason',
  'name', 'email', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer', 'device',
];

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

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Plain text only, short, and never starting with = + - @ (so nothing runs as a formula in the sheet).
function clean_(v) {
  if (v === undefined || v === null) return '';
  let s = String(v).slice(0, 300);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
