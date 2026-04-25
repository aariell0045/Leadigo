/**
 * 1) פתחו גיליון Google חדש.
 * 2) תפריט: הרחבות → Google Apps Script.
 * 3) הדביקו את כל הקובץ הזה, שמרו.
 * 4) פרוס → אפליקציית אינטרנט: הרץ: אני, "מי יכול לגשת": כל אחד (או כל אחד עם המשתמש).
 * 5) העתיקו את ה-URL (נגמר ב-/exec) ל-js/main.js → GOOGLE_SHEETS_WEBAPP_URL
 *
 * בדקו: שליחה מהטופס, ושהשורה נוספה בגיליון הראשון.
 */
function doPost(e) {
  var sheet;
  try {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  } catch (err) {
    return jsonOut_({ ok: false, error: "no_spreadsheet" });
  }

  if (!sheet.getRange(1, 1).getValue()) {
    sheet
      .getRange(1, 1, 1, 7)
      .setValues([["תאריך", "שם", "טלפון", "אימייל", "שם עסק", "מיקוד", "הערה"]]);
  }

  var p = e.parameter || {};
  var row = [
    new Date(),
    p.name || "",
    p.phone || "",
    p.email || "",
    p.business || "",
    p.focus || "",
    p.note || "",
  ];
  sheet.appendRow(row);
  return jsonOut_({ ok: true });
}

function doGet() {
  return jsonOut_({ ok: true, message: "use_post" });
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
