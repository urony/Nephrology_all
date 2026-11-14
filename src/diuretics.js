'use strict';
/* ===== תרופות משתנות (סעיף 5.2 בתוכנית): איפה כל משתן פועל בנפרון, ומה הוא עושה ===== */
const DIU = [
  { k: 'loop', t: 'משתני לולאה (כמו פוסיד)', seg: 'asc', site: 'הזרוע העולה של לולאת הנלה', short: 'הזרוע העולה', how: 'חוסמים את המשאבה שמוציאה מלחים מהזרוע העולה. בלי המלחים בלשד אין מפל ריכוזים, והמים לא נספגים חזרה.', power: 'חזק מאוד', pv: 95, kal: 'האשלגן בדם עלול לרדת', use: 'בצקת ריאות, אי-ספיקת לב, בצקות', pill: '#d9534f' },
  { k: 'thz', t: 'משתני תיאזיד', seg: 'dct', site: 'האבובית המרוחקת', short: 'האבובית המרוחקת', how: 'חוסמים ספיגה של נתרן וכלור באבובית המרוחקת, ולכן יוצאים יותר מלחים ומים בשתן.', power: 'בינוני', pv: 50, kal: 'האשלגן בדם עלול לרדת', use: 'יתר לחץ דם', pill: '#e08a1e' },
  { k: 'ksp', t: 'משתנים אוגרי אשלגן', seg: 'cd', site: 'הצינור המאסף', short: 'הצינור המאסף', how: 'חוסמים את הפעולה של אלדוסטרון (או את תעלות הנתרן) בצינור המאסף. נתרן יוצא, ואשלגן נשאר בגוף.', power: 'חלש', pv: 20, kal: 'האשלגן בדם עלול לעלות', use: 'מונעים ירידת אשלגן, בשילוב עם משתן אחר', pill: '#2f8f55' },
];
function diuSvg(D) {
  const seg = (id, d, w = 12) => `<path d="${d}" fill="none" stroke="${D && D.seg === id ? '#d9534f' : '#8fb4cc'}" stroke-width="${D && D.seg === id ? w + 6 : w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const hit = id => D && D.seg === id;
  return `<svg class="dia-svg" viewBox="0 0 360 290" role="img" aria-label="המחשה: איפה כל משתן פועל בנפרון">
    <rect x="3" y="3" width="354" height="284" rx="14" fill="#f7fbfe"/>
    <circle cx="48" cy="50" r="22" fill="#fde2e6" stroke="#c9364d" stroke-width="2"/><text x="48" y="54" class="av-s" style="font-size:10px">פקעית</text>
    ${seg('pct', 'M70 50 L84 38 L98 62 L112 38 L126 62 L140 50')}
    <text x="105" y="26" class="av-s" style="font-size:10px">אבובית מקורבת</text>
    ${seg('asc', 'M200 215 V84')}${seg('desc', 'M140 50 V215 Q170 262 200 215')}
    <text x="140" y="276" class="av-s" style="font-size:10px">לולאת הנלה</text>
    ${seg('dct', 'M200 84 L214 70 L228 94 L242 70 L256 94 L270 82')}
    <text x="235" y="58" class="av-s" style="font-size:10px">אבובית מרוחקת</text>
    ${seg('cd', 'M300 70 V250')}<text x="318" y="160" class="av-s" style="font-size:10px" transform="rotate(90 318 160)">צינור מאסף</text>
    <path d="M270 82 H300" stroke="#8fb4cc" stroke-width="12" fill="none" stroke-linecap="round"/>
    <text x="300" y="270" class="av-s" style="font-size:10px">שתן</text>
    ${D ? `<g><rect x="12" y="104" width="112" height="46" rx="8" fill="#fff" stroke="#d9534f" stroke-width="1.8"/><text x="68" y="122" class="av-s" style="font-weight:800;font-size:11px;fill:#a3302c">חסימה כאן</text><text x="68" y="138" class="av-s" style="font-size:10px">${D.short}</text></g>` : ''}
    ${hit('asc') ? '<text x="200" y="160" font-size="22" text-anchor="middle">✖</text>' : hit('dct') ? '<text x="242" y="110" font-size="22" text-anchor="middle">✖</text>' : hit('cd') ? '<text x="300" y="160" font-size="22" text-anchor="middle">✖</text>' : ''}
  </svg>`;
}
/* איור אמיתי (art/diur_*) עם הדגשת הקטע שבו המשתן פועל; אם חסר, הסכמה הישנה */
const DIU_ART = { asc: 'diur_loop', dct: 'diur_dct', cd: 'diur_cd' };
function diuPic(D) {
  const k = D && DIU_ART[D.seg];
  if (k && ART[k]) return `<figure class="fig" style="margin:0"><img class="zoomable" src="${ART[k]}" alt="${D.site}" style="width:100%;max-width:340px;display:block;margin:0 auto;border-radius:14px"><figcaption class="small muted" style="text-align:center">הקטע המודגש: ${D.site} · לחיצה להגדלה</figcaption></figure>`;
  if (!D && ART.nephron_real) return `<figure class="fig" style="margin:0"><img class="zoomable" src="${ART.nephron_real}" alt="נפרון" style="width:100%;max-width:300px;display:block;margin:0 auto;border-radius:14px;opacity:.9"></figure>`;
  return diuSvg(D);
}
function diuSim(box, done) {
  let cur = -1; const seen = new Set();
  const host = el('<div class="card"></div>'); box.appendChild(host);
  function draw() {
    const D = DIU[cur];
    host.innerHTML = `<p class="instr">בחרו משתן וראו איפה בנפרון הוא פועל ומה קורה בגוף.</p>
      <div class="col" style="gap:6px;margin-bottom:8px">${DIU.map((d, i) => `<button class="btn block ${cur === i ? 'primary' : ''}" data-s="${i}" style="text-align:start">${d.t}</button>`).join('')}</div>
      ${diuPic(D)}
      ${D ? `<div class="pg-info"><b>${D.t}</b><div>${D.how}</div></div>
      <div class="pg-conc" style="margin:8px 0"><span class="small">כמות השתן</span><div class="bar"><i style="width:${D.pv}%;background:${D.pill}"></i></div><b class="small">${D.power}</b></div>
      <div class="diu-facts"><div class="fact"><span class="fl">🧂 מה קורה לרמת האשלגן בדם?</span><b>${D.kal}</b></div><div class="fact"><span class="fl">👥 למי התרופה מתאימה?</span><b>${D.use}</b></div></div>` : '<div class="explain">בחרו משתן מהרשימה.</div>'}
      <button class="btn primary block" id="dgo" style="margin-top:12px" ${seen.size < 3 ? 'disabled' : ''}>${seen.size < 3 ? `נסו את כל שלושת הסוגים (${seen.size} מתוך 3)` : 'המשך ←'}</button>`;
    $$('[data-s]', host).forEach(b => b.onclick = () => { cur = +b.dataset.s; seen.add(cur); draw(); });
    $('#dgo', host).onclick = () => done(null);
  }
  draw();
}
registerGame({
  id: 'a_diuretics', part: 'A', sec: 'disease', icon: '💊', title: 'משתנים: איפה כל תרופה פועלת', desc: 'משתני לולאה, תיאזיד ואוגרי אשלגן',
  learned: [
    'משתנים מגבירים את כמות השתן, בכך שהם מונעים מהכליה לספוג חזרה מלחים, ואחריהם גם מים.',
    'משתני לולאה (כמו פוסיד) פועלים בזרוע העולה של לולאת הנלה והם החזקים ביותר. משתני תיאזיד פועלים באבובית המרוחקת ומתונים יותר.',
    'משתנים אוגרי אשלגן פועלים בצינור המאסף ושומרים אשלגן. משתני לולאה ותיאזיד עלולים להוריד את האשלגן בדם.'
  ],
  teacherNote: 'סעיף 5.2 בתוכנית: "תרופות משתנות: משתני לולאה (כגון פוסיד), משתני תיאזיד, ומשתנים אוגרי אשלגן", והתלמיד יכיר את מנגנוני הפעילות. הספר הרשמי כמעט לא מפרט, ולכן התוכן כאן הוא ידע כללי (רמת בגרות, בלי שמות מולקולות). שלב 1 סימולציה, שלב 2 התאמה, שלב 3 שאלות.',
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('לתרופה משתנה יש כתובת בנפרון. בואו נראה איפה כל סוג פועל, ולמה זה משנה.', 'think'));
    runStages(root, ctx, [
      { title: 'איפה זה פועל?', run: diuSim },
      { title: 'התאמה', run: (box, done) => matchGame(box, { tag: 'diuretics', leftTitle: 'סוג התרופה', rightTitle: 'איפה ומה היא עושה', pairs: [
        ['משתני לולאה (פוסיד)', 'הזרוע העולה בלשד: ההשפעה החזקה ביותר'],
        ['משתני תיאזיד', 'אבובית מרוחקת: השפעה בינונית'],
        ['משתנים אוגרי אשלגן', 'צינור מאסף: השפעה חלשה, בלי איבוד מינרל חשוב ללב'],
        ['ירידה באשלגן בדם', 'תופעת לוואי של שתי הקבוצות הראשונות (ולא של האחרונה)'],
      ], onDone: done }) },
      { title: 'שאלות', run: runQuizStage([
        Q('איפה פועלים משתני לולאה (כמו פוסיד)?', 'diuretics', [OK('בזרוע העולה של לולאת הנלה, וחוסמים העברת מלחים', 'שם המלחים יוצאים מהנוזל ויוצרים את מפל הריכוזים בלשד. בלי זה המים לא נספגים.'), NO('באבובית המקורבת, וחוסמים ספיגה של גלוקוז', 'משתני לולאה אינם פועלים באבובית המקורבת.'), NO('בצינור המאסף, וחוסמים את הפעולה של אלדוסטרון', 'זה המקום של משתנים אוגרי אשלגן.'), NO('בגלומרולוס, וחוסמים את סינון הדם בפקעית', 'המשתנים אינם עוצרים את הסינון, אלא את הספיגה החוזרת.')]),
        Q('באיזה חלק של הנפרון פועלים משתני תיאזיד?', 'diuretics', [OK('באבובית המרוחקת, וחוסמים ספיגה של נתרן וכלור', 'שם נספגים נתרן וכלור, ובלעדיהם יוצאים בשתן יותר מלחים ומים.'), NO('בלולאת הנלה, וחוסמים את משאבת המלחים', 'זה המקום של משתני לולאה.'), NO('בצינור המאסף, וחוסמים את פעולת אלדוסטרון', 'זה המקום של משתנים אוגרי אשלגן.'), NO('באבובית המקורבת, וחוסמים ספיגה של גלוקוז', 'משתני תיאזיד אינם פועלים שם.')]),
        Q('מה קורה לאשלגן בדם בטיפול במשתני לולאה או תיאזיד?', 'diuretics', [OK('הוא עלול לרדת, כי יותר אשלגן יוצא בשתן', 'משתנים אלה מגדילים את איבוד האשלגן, ולכן עוקבים אחרי רמתו בדם.'), NO('הוא עולה תמיד, כי הכליה מפסיקה להפריש אותו', 'ההפך: האשלגן מופרש יותר.'), NO('הוא לא משתנה, כי הכליה אינה מפרישה אשלגן', 'הכליה מפרישה אשלגן, בעיקר תחת השפעת אלדוסטרון.'), NO('הוא עולה, כי נפח הדם יורד ומרכז את האשלגן', 'ירידת נפח הדם אינה הסיבה: האיבוד בשתן הוא העיקר.')]),
        Q('מתי משתן אוגר אשלגן עלול להיות מסוכן?', 'diuretics', [OK('באי-ספיקת כליות, כי האשלגן בדם עלול לעלות מאוד', 'הכליה החולה לא מפרישה אשלגן, והתרופה מחמירה זאת. עלייה באשלגן מסכנת את הלב.'), NO('כשהמטופל שותה הרבה מים, כי השתן מדולל מדי', 'שתיית מים אינה מסכנת בגלל התרופה.'), NO('כשלחץ הדם גבוה, כי הלחץ עלול לעלות עוד יותר', 'התרופה מורידה לחץ דם ולא מעלה.'), NO('תמיד, כי הוא עוצר את סינון הדם בגלומרולוס', 'התרופה אינה עוצרת את הסינון.')]),
        Q('לחולה בבצקת ריאות חמורה צריך להוציא נוזלים מהר. איזה משתן מתאים?', 'diuretics', [OK('משתן לולאה, כי הוא החזק ביותר', 'משתני לולאה מוציאים הרבה שתן מהר, וזה מה שדרוש בבצקת ריאות.'), NO('משתן תיאזיד, כי הוא החזק ביותר', 'משתני תיאזיד מתונים יותר, ומתאימים בעיקר ליתר לחץ דם.'), NO('משתן אוגר אשלגן, כי הוא הכי מהיר', 'הוא החלש מבין השלושה.'), NO('אף משתן, כי הנוזל בריאות אינו קשור לכליה', 'הוצאת נוזלים בעזרת הכליה היא הטיפול.')]),
      ]) },
    ]);
  },
});
