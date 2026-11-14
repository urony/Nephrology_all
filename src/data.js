'use strict';
/* ===== מדדי מעבדה, תגיות נושא ועזרים (נפרולוגיה) =====
   הטווחים הם טווחי מעבדה מקובלים להמחשה. הם משתנים בין מעבדות.
   BOOK_RANGE: ערכי "בבחינה", כפי שמופיעים בספר המגמה. */
const LAB = {
  CREA: { n: 'קריאטינין (Creatinine)', u: 'mg/dL', d: 1, r: { M: [0.7, 1.3], F: [0.6, 1.1] } },
  UREA: { n: 'אוריאה / שתנן (Urea)', u: 'mg/dL', d: 0, r: [15, 45] },
  EGFR: { n: 'קצב סינון משוער (eGFR)', u: 'mL/min/1.73m²', d: 0, r: [90, 130] },
  K: { n: 'אשלגן (K⁺)', u: 'mmol/L', d: 1, r: [3.5, 5.1] },
  NA: { n: 'נתרן (Na⁺)', u: 'mmol/L', d: 0, r: [135, 145] },
  HCO3: { n: 'ביקרבונט (HCO₃⁻)', u: 'mmol/L', d: 0, r: [22, 29] },
  PH: { n: 'pH בדם', u: '', d: 2, r: [7.35, 7.45] },
  CA: { n: 'סידן (Ca)', u: 'mg/dL', d: 1, r: [8.6, 10.2] },
  PHOS: { n: 'זרחן (Phosphate)', u: 'mg/dL', d: 1, r: [2.5, 4.5] },
  PTH: { n: 'הורמון פארא-תירואיד (PTH)', u: 'pg/mL', d: 0, r: [15, 65] },
  URIC: { n: 'חומצה אורית (Uric acid)', u: 'mg/dL', d: 1, r: { M: [3.5, 7.2], F: [2.6, 6.0] } },
  Hb: { n: 'המוגלובין (Hb)', u: 'g/dL', d: 1, r: { M: [13.5, 17.5], F: [12, 16] } },
  WBC: { n: 'תאי דם לבנים (WBC)', u: 'K/µL', d: 1, r: [4, 11] },
  CRP: { n: 'CRP', u: 'mg/L', d: 0, r: [0, 5] },
  GLU: { n: 'גלוקוז בדם', u: 'mg/dL', d: 0, r: [70, 100] },
  /* שתן: תוצאות כמותיות. בדיקת סטיק משתמשת בסימונים איכותיים (ראו URINE_DIP) */
  UPCR: { n: 'יחס חלבון לקריאטינין בשתן', u: 'mg/g', d: 0, r: [0, 150] },
  USG: { n: 'משקל סגולי של השתן', u: '', d: 3, r: [1.005, 1.030] },
};
const BOOK_RANGE = { CREA: { M: [0, 1.2], F: [0, 1.2] } };
const LAB_HELP = {
  CREA: 'תוצר פירוק של קריאטין בשרירים. מסונן בגלומרולוס וכמעט לא נספג חזרה, ולכן עלייתו בדם מעידה על ירידה בסינון. תלוי גם במסת השריר. בספר: ערך תקין עד 1.2 mg/dL.',
  UREA: 'תוצר פירוק של חלבונים (נוצר בכבד). כמחצית ממנו נספגת חזרה באופן פסיבי. עולה באי-ספיקת כליות, אך גם בהתייבשות ובצריכת חלבון גבוהה, ולכן פחות ספציפי מקריאטינין.',
  EGFR: 'הערכה של קצב הסינון הגלומרולרי (GFR) מתוך הקריאטינין, הגיל והמין. כאן מחושב בנוסחה מקובלת (CKD-EPI). משמש לקביעת שלב אי-ספיקת הכליות הכרונית.',
  K: 'האשלגן מופרש בעיקר בכליה (באבובית הדיסטלית ובמאספת, תחת השפעת אלדוסטרון). באי-ספיקה עולה (היפרקלמיה) ועלול לגרום להפרעות קצב.',
  NA: 'נתרן קובע את אוסמולריות הפלזמה. שינויים בו קשורים למאזן המים (ADH) ולמאזן הנתרן (אלדוסטרון).',
  HCO3: 'הביקרבונט הוא המאגר העיקרי של הדם. הכליה ממחזרת ומייצרת אותו. באי-ספיקה כרונית יורד, ונוצרת חמצת מטבולית.',
  PH: 'חומציות הדם. הכליה מפרישה יוני מימן ומווסתת ביקרבונט. pH נמוך = חמצת.',
  CA: 'משק הסידן תלוי ב-PTH ובוויטמין D, שמופעל בכליה. באי-ספיקה כרונית הסידן נוטה לרדת.',
  PHOS: 'הזרחן מופרש בכליה. באי-ספיקה כרונית הוא מצטבר ועולה.',
  PTH: 'עולה באי-ספיקה כרונית כתגובה לירידה בסידן ועלייה בזרחן (היפרפארא-תירואידיזם משני). חלק ממחלת העצם המטבולית.',
  URIC: 'תוצר פירוק של חומצות גרעין. עלייתו קשורה לאבני חומצה אורית ולשיגדון.',
  Hb: 'אנמיה כלייתית: הכליה החולה מייצרת פחות אריתרופויטין (EPO).',
  WBC: 'עולה בזיהום חיידקי, למשל בדלקת אגן הכליה.',
  CRP: 'סמן דלקת. עולה בזיהום חיידקי.',
  GLU: 'סוכרת לא מאוזנת פוגעת בכליות לאורך שנים (נפרופתיה סוכרתית).',
  UPCR: 'יחס חלבון לקריאטינין בשתן. מזהה הפרשת חלבון מוגברת כסימן מוקדם לנזק כלייתי.',
  USG: 'כמה השתן מרוכז. בהתייבשות הוא גבוה, ובאי-ספיקה כרונית הכליה מאבדת את יכולת הריכוז.',
};
let _labNoteShown = false;
const labNote = () => { if (_labNoteShown) return ''; _labNoteShown = true; return '<div class="small muted" style="margin:0 0 6px">הטווחים מייצגים ערכים מקובלים להמחשה. התוצאות והטווחים יכולים להשתנות ממעבדה למעבדה. בבחינה משתמשים בערכי הספר: קריאטינין תקין עד 1.2 mg/dL. הטווח מוצג בסוגריים. לחצו על ? להסבר על הבדיקה.</div>'; };
const labQ = (k, cols) => `<button class="qm" type="button" aria-label="הסבר על הבדיקה" aria-expanded="false">?</button>`;
const labHelpRow = (k, cols) => `<tr class="hrow" hidden><td colspan="${cols}">${LAB_HELP[k] || ''}</td></tr>`;
function labRange(k, sex) { const r = LAB[k].r; return Array.isArray(r) ? r : r[sex]; }
function labFlag(k, v, sex) { const [lo, hi] = labRange(k, sex); return v < lo ? 'L' : v > hi ? 'H' : ''; }
function labGauge(k, v, sex) {
  const [lo, hi] = labRange(k, sex), sp = hi - lo, mn = lo === 0 ? 0 : lo - sp * 0.9, mx = hi + sp * 0.9 + (lo === 0 ? sp * 0.5 : 0), W = mx - mn;
  const pc = x => Math.max(2, Math.min(98, 100 * (x - mn) / W)), f = labFlag(k, v, sex);
  return '<div class="lg" style="direction:ltr;position:relative;height:8px;border-radius:4px;background:#f3cfcf;margin-top:4px;min-width:70px" aria-hidden="true"><i style="position:absolute;top:0;bottom:0;left:' + (100 * (lo - mn) / W) + '%;width:' + (100 * sp / W) + '%;background:#bfe5c9"></i><b style="position:absolute;top:-3px;width:12px;height:14px;margin-left:-6px;border-radius:6px;border:2px solid #fff;box-sizing:border-box;left:' + pc(v) + '%;background:' + (f ? '#d9534f' : '#2f8f55') + '"></b></div>';
}
function labFmt(k, v) { return Number(v).toFixed(LAB[k].d); }
function labRows(keys, vals, sex, hl = []) {
  const bk = (k, sx) => BOOK_RANGE[k] && BOOK_RANGE[k][sx] ? `<br><span class="small" style="color:var(--teal)">בבחינה: עד ${BOOK_RANGE[k][sx][1]}</span>` : '';
  return labNote() + `<table class="lab"><thead><tr><th>בדיקה</th><th>תוצאה</th><th>טווח</th></tr></thead><tbody>${keys.map(k => {
    if (vals[k] == null) return ''; const f = labFlag(k, vals[k], sex), [lo, hi] = labRange(k, sex);
    return `<tr class="${hl.includes(k) ? 'hl' : ''} ${f ? 'abn' + f : ''}"><td>${LAB[k].n} ${labQ(k)}</td><td class="v ${f}">${labFmt(k, vals[k])} <span class="muted small">${LAB[k].u}</span></td><td class="r">(${lo}–${hi})${bk(k, sex)}${labGauge(k, vals[k], sex)}</td></tr>${labHelpRow(k, 3)}`;
  }).join('')}</tbody></table>`;
}

/* eGFR בנוסחת CKD-EPI 2021 (ללא גזע), להמחשה */
function calcEgfr(crea, age, sex) {
  const k = sex === 'F' ? 0.7 : 0.9, a = sex === 'F' ? -0.241 : -0.302;
  const v = 142 * Math.pow(Math.min(crea / k, 1), a) * Math.pow(Math.max(crea / k, 1), -1.2) * Math.pow(0.9938, age) * (sex === 'F' ? 1.012 : 1);
  return Math.round(v);
}
/* שלבי אי-ספיקת כליות כרונית לפי eGFR (תוצאת eGFR נמשכת 3 חודשים לפחות) */
function ckdStage(egfr) {
  return egfr >= 90 ? 'G1' : egfr >= 60 ? 'G2' : egfr >= 45 ? 'G3a' : egfr >= 30 ? 'G3b' : egfr >= 15 ? 'G4' : 'G5';
}

const TAGS = {
  urinary_tract: 'מבנה דרכי השתן', kidney_anat: 'אנטומיה של הכליה', nephron_parts: 'חלקי הנפרון', nephron_journey: 'מסע לאורך הנפרון',
  filtration: 'סינון בגלומרולוס', fil_vs_reab: 'סינון, ספיגה חוזרת והפרשה', adh: 'ADH ומאזן מים', raas: 'מערכת RAAS', adh_raas: 'ADH ו-RAAS יחד',
  acid_base: 'איזון חומצה-בסיס', epo_vitd: 'EPO וויטמין D', gfr: 'GFR וקריאטינין', aki_ckd: 'אי-ספיקה חריפה מול כרונית', aki_types: 'פרה-רנלי, רנלי, פוסט-רנלי',
  dialysis: 'דיאליזה', transplant: 'השתלת כליה', stones: 'אבני כליה', uti: 'זיהומים בדרכי השתן', drugs: 'תרופות ונזק כלייתי', diuretics: 'תרופות משתנות', diet: 'תזונה במחלות כליה',
  complications: 'סיבוכים סיסטמיים', cause: 'זיהוי הסיבה', treatment: 'בחירת טיפול', urgent: 'זיהוי מצב חירום', next_test: 'בחירת הבדיקה הבאה', diag_key: 'זיהוי הממצא המכריע', er_tests: 'בחירת בדיקות בחדר מיון',
};
