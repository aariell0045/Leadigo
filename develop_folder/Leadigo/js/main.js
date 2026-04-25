(function () {
  var y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ===== Google Sheets: אחרי שתיצור גיליון + Apps Script, הדבק כאן את כתובת ה־Web App (מסתיימת ב־/exec) ===== */
  var GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyfB7EfKsum0SJslxvr3m_5Odne63V9nGIWAuuDeOkqIfz85sbzo33OpYslmPKCL3SL0Q/exec";

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

    if (!GOOGLE_SHEETS_WEBAPP_URL) {
      status.textContent =
        "הטופס מוכן לחיבור לגוגל-שיט. פתחו את js/main.js והדביקו ב־GOOGLE_SHEETS_WEBAPP_URL את הכתובת מהפריסה (ראו הערות בקובץ google-apps-script.gs).";
      status.style.color = "#b45309";
      return;
    }

    var fd = new FormData(form);
    var note = (fd.get("note") && String(fd.get("note"))) || "";
    var params = new URLSearchParams();
    params.set("name", (fd.get("name") && String(fd.get("name")).trim()) || "");
    params.set("phone", (fd.get("phone") && String(fd.get("phone")).trim()) || "");
    params.set("email", (fd.get("email") && String(fd.get("email")).trim()) || "");
    params.set("business", (fd.get("business") && String(fd.get("business")).trim()) || "");
    params.set("focus", (fd.get("focus") && String(fd.get("focus"))) || "");
    params.set("note", note.replace(/\r?\n/g, " ").trim());

    var fallback = document.getElementById("form-fallback-tel");
    if (fallback) {
      fallback.hidden = true;
    }

    status.textContent = "שולח…";
    status.style.color = "#0f766e";
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    /* GAS לרוב אינו מחזיר CORS; no-cors הוא הדפוס המקובל ללידים לגיליון */
    fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: "POST",
      body: params,
      mode: "no-cors",
    })
      .then(function () {
        status.textContent = "התקבל — נחזור אליכם בהקדם.";
        status.style.color = "#0f766e";
        form.reset();
      })
      .catch(function () {
        status.textContent = "השליחה נכשלה (רשת/חסימה). נסו שוב, או התקשרו לטלפון.";
        status.style.color = "#b91c1c";
        if (fallback) {
          fallback.hidden = false;
        }
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  });
})();

/*
  ——— חיבור לגוגל שיט (פעם אחת) ———
  1) צרו Google Sheet (גיליון) חדש.
  2) בתפריט: הרחבות → Apps Script. הדביקו את הקוד מ־google-apps-script.gs (בשורש הפרויקט).
  3) שמרו, ואז: פרוס → התקנות חדשות. סוג: אפליקציית אינטרנט. הרץ: אני, גישה: כל אחד. העתיקו את כתובת ה־URL.
  4) הדביקו את הכתובת במשתנה GOOGLE_SHEETS_WEBAPP_URL למעלה בקובץ זה, והעלו שוב ל־Vercel.
  5) שלחו טופס בדיקה וצפו בשורה חדשה בגיליון.

  אם מופעת שגיית CORS בדפדפן: בדקו שזו כתובת /exec, ושהפריסה "כל אחד" יכולה לפנות. לעיתים יש redirect מ־/dev — השתמשו בכתובת הסופית מהחלון "פרסום".
*/
