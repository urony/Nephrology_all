'use strict';
/* ===== דיאליזה: סימולציה גרפית של המודיאליזה ושל דיאליזה צפקית ===== */
function dialysisSim(box, done) {
  let mode = 'hemo', hr = 0, ph = 0;
  const host = el('<div class="card"></div>'); box.appendChild(host);
  const PH = [
    ['לפני המילוי', 'הצפק בבטן הוא ממברנה טבעית דקה, ומסביבו כלי דם. בחלל הבטן יש צינורית (קתטר) קבועה.'],
    ['שלב 1: מילוי', 'נוזל דיאליזה נקי נכנס לחלל הצפק דרך הצינורית. אין בו אוריאה או אשלגן.'],
    ['שלב 2: השהייה', 'הנוזל נשאר כמה שעות. רעלים (אוריאה, אשלגן) וכן מים עוברים מכלי הדם דרך הצפק אל הנוזל, בדיפוזיה.'],
    ['שלב 3: ניקוז', 'הנוזל המלוכלך מתנקז החוצה ומוחלף בנוזל חדש. אפשר לעשות את זה בידיים כמה פעמים ביום, או במכונה בלילה.']
  ];
  function hemoSvg(p) {
    const N = 16, moved = Math.round(N * p); let bd = '', dd = '';
    for (let i = 0; i < N - moved; i++) bd += `<circle cx="${40 + (i * 61) % 270}" cy="${52 + (i * 17) % 34}" r="4" fill="#7b3fc4"/>`;
    for (let i = 0; i < moved; i++) dd += `<circle cx="${40 + (i * 53) % 270}" cy="${132 + (i * 19) % 34}" r="4" fill="#7b3fc4"/>`;
    return `<svg class="dia-svg" viewBox="0 0 360 230" role="img" aria-label="המחשה של המודיאליזה: אוריאה עוברת מהדם אל נוזל הדיאליזה"><rect x="4" y="4" width="352" height="222" rx="14" fill="#f7fbfe"/>
      <defs><marker id="dar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#c9364d"/></marker><marker id="dar2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#1a77a3"/></marker></defs>
      <text x="180" y="22" class="av-t">הדיאלייזר (בתוך המכונה)</text>
      <rect x="30" y="40" width="300" height="50" rx="10" fill="#fde2e6" stroke="#e08a98"/><rect x="30" y="120" width="300" height="50" rx="10" fill="#dff1fb" stroke="#7fbcdc"/>
      <path d="M30 105 H330" stroke="#5b7b93" stroke-width="3" stroke-dasharray="6 4"/>
      <text x="180" y="112" class="av-s" style="font-weight:800">ממברנה חצי-חדירה</text>
      ${bd}${dd}
      <path d="M44 34 H110" stroke="#c9364d" stroke-width="2" marker-end="url(#dar)"/><text x="70" y="32" class="av-s" fill="#c9364d">דם</text>
      <path d="M316 178 H250" stroke="#1a77a3" stroke-width="2" marker-end="url(#dar2)"/><text x="196" y="182" class="av-s" fill="#1a77a3">נוזל נקי, בכיוון הפוך</text>
      <text x="180" y="205" class="av-s" style="font-weight:800">אוריאה בדם: ${Math.round(100 * (1 - p))}%   ·   בנוזל המנוקז: ${Math.round(100 * p)}%</text>
      <text x="180" y="219" class="av-s">הכדורים הסגולים הם אוריאה ורעלים אחרים</text></svg>`;
  }
  function periSvg(s) {
    const fill = s === 0 ? 0 : s === 3 ? .25 : 1, dirty = s >= 2, fl = Math.round(90 * fill);
    let vs = '', ds = ''; for (let i = 0; i < 8; i++) vs += `<circle cx="${96 + (i * 29) % 170}" cy="${86 + (i % 2) * 5}" r="3.6" fill="#7b3fc4" opacity="${s === 2 ? .4 : 1}"/>`;
    if (dirty) for (let i = 0; i < (s === 2 ? 8 : 4); i++) ds += `<circle cx="${110 + (i * 31) % 150}" cy="${150 + (i * 17) % 40}" r="3.6" fill="#7b3fc4"/>`;
    return `<svg class="dia-svg" viewBox="0 0 360 230" role="img" aria-label="המחשה של דיאליזה צפקית"><rect x="4" y="4" width="352" height="222" rx="14" fill="#f7fbfe"/>
      <path d="M70 70 Q70 40 180 40 Q290 40 290 70 V170 Q290 205 180 205 Q70 205 70 170 Z" fill="#fff6ec" stroke="#d9a977" stroke-width="3"/>
      <text x="180" y="30" class="av-t">בטן: הצפק הוא הממברנה</text>
      <path d="M86 76 H274" stroke="#e08a98" stroke-width="7" stroke-linecap="round" opacity=".7"/>
      <text x="180" y="66" class="av-s">כלי דם (עם אוריאה)</text>${vs}
      <rect x="92" y="${196 - fl}" width="176" height="${fl}" rx="10" fill="${dirty ? '#f3e2a4' : '#cfeaf8'}" opacity=".95"/>${ds}
      <text x="180" y="${fl ? 196 - fl / 2 + 4 : 140}" class="av-s" style="font-weight:800">${fl ? (dirty ? 'נוזל עם רעלים' : 'נוזל נקי') : 'חלל הצפק ריק'}</text>
      <path d="M180 205 V222" stroke="#5b7b93" stroke-width="6"/><text x="196" y="219" class="av-s" text-anchor="start">צינורית קבועה</text></svg>`;
  }
  function draw() {
    host.innerHTML = `<p class="instr">הדיאליזה מחליפה חלק מעבודת הכליה: מוציאה רעלים ונוזלים מהדם. בחרו שיטה והפעילו אותה.</p>
      <div class="row" style="gap:8px;margin-bottom:10px"><button class="btn grow ${mode === 'hemo' ? 'primary' : ''}" data-m="hemo">🩸 המודיאליזה (מכונה)</button><button class="btn grow ${mode === 'peri' ? 'primary' : ''}" data-m="peri">🫃 דיאליזה צפקית (בבטן)</button></div>
      ${mode === 'hemo' ? hemoSvg(0.8 * (1 - Math.exp(-0.75 * hr))) : periSvg(ph)}
      ${mode === 'hemo' ? `<div class="sim"><label>משך הטיפול: <b>${hr}</b> שעות</label><input type="range" id="dh" min="0" max="4" step="0.5" value="${hr}"></div>
        <p class="small">הדם יוצא מהגוף דרך גישה לכלי דם (פיסטולה או צנתר), עובר בדיאלייזר ומוחזר נקי. בדרך כלל ממשיכים כך כשלוש-ארבע שעות, שלוש פעמים בשבוע, במרכז דיאליזה. ככל שהזמן עובר, יותר רעלים עוברים אל הנוזל. גם עודפי נוזלים מוצאים החוצה.</p>`
        : `<div class="row" style="gap:6px;margin:8px 0">${PH.map((x, i) => `<button class="btn small grow ${ph === i ? 'primary' : ''}" data-p="${i}">${i}</button>`).join('')}</div><div class="pg-info"><b>${PH[ph][0]}</b><div>${PH[ph][1]}</div></div>
        <button class="btn block" id="pn" style="margin-top:8px">${ph < 3 ? 'לשלב הבא ←' : 'מההתחלה ↺'}</button>`}
      <div class="explain good" style="margin-top:10px">${mode === 'hemo' ? 'שאלה לחשיבה: למה נוזל הדיאליזה זורם בכיוון הפוך לדם? כדי שתמיד יהיה מפל ריכוזים בין הצדדים, לאורך כל הממברנה.' : 'שימו לב: הסכנה העיקרית היא פריטוניטיס, דלקת בצפק, כי הצינורית חושפת את הבטן לזיהום.'}</div>
      <button class="btn primary block" id="dgo" style="margin-top:12px">המשך לשאלות ←</button>`;
    $$('[data-m]', host).forEach(b => b.onclick = () => { mode = b.dataset.m; draw(); });
    $$('[data-p]', host).forEach(b => b.onclick = () => { ph = +b.dataset.p; draw(); });
    const dh = $('#dh', host); if (dh) dh.oninput = e => { hr = +e.target.value; draw(); };
    const pn = $('#pn', host); if (pn) pn.onclick = () => { ph = (ph + 1) % 4; draw(); };
    $('#dgo', host).onclick = () => done(null);
  }
  draw();
}
