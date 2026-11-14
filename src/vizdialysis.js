'use strict';
/* ===== דיאליזה: סימולציה מונפשת של המודיאליזה ושל דיאליזה צפקית =====
   אפשר להפעיל אנימציה אוטומטית, או לעבור צעד אחר צעד בלחיצות. הנקודות הסגולות הן אוריאה ורעלים אחרים. */
function dialysisSim(box, done) {
  let mode = 'hemo', hr = 0, ph = 0, timer = null, prev = { fill: 0, vess: 12 };
  const host = el('<div class="card"></div>'); box.appendChild(host);
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const PH = [
    ['לפני המילוי', 'הצפק בבטן הוא ממברנה טבעית דקה, ומסביבו כלי דם עם אוריאה ואשלגן. בחלל הבטן יש צינורית (קתטר) קבועה. חלל הצפק ריק.'],
    ['שלב 1: מילוי', 'נוזל דיאליזה נקי נכנס לחלל הצפק דרך הצינורית. אין בו אוריאה או אשלגן.'],
    ['שלב 2: השהייה', 'הנוזל נשאר כמה שעות. רעלים (אוריאה, אשלגן) וגם מים עוברים מכלי הדם דרך הצפק אל הנוזל, בדיפוזיה: בכלי הדם יש פחות רעלים, ובנוזל יותר.'],
    ['שלב 3: ניקוז', 'הנוזל עם הרעלים מתנקז החוצה אל שקית, וחלל הצפק מתרוקן. בכלי הדם נשארו הרבה פחות רעלים מאשר בהתחלה. אחר כך ממלאים נוזל נקי מחדש: בידיים כמה פעמים ביום, או במכונה בלילה.'],
  ];
  const dot = (x, y, col, dur, from, to, off) => `<circle cy="${y}" r="4.2" fill="${col}"><animate attributeName="cx" values="${from};${to}" dur="${dur}s" begin="-${off}s" repeatCount="indefinite"/></circle>`;
  function hemoSvg(p, running) {
    const N = 16, inBlood = Math.round(N * (1 - p)), inDial = Math.round(N * p);
    let bd = '', dd = '', ar = '';
    for (let i = 0; i < inBlood; i++) bd += dot(0, 58 + (i * 13) % 30, '#7b3fc4', 7, 30, 330, (i * 0.45) % 7);
    for (let i = 0; i < inDial; i++) dd += dot(0, 122 + (i * 11) % 30, '#7b3fc4', 7, 330, 30, (i * 0.5) % 7);
    if (p > 0 || running) for (let x = 60; x <= 300; x += 48) ar += `<path d="M${x} 90 V122" stroke="#7b3fc4" stroke-width="2.4" marker-end="url(#dar3)"><animate attributeName="opacity" values="0;1;0" dur="1.6s" begin="${(x % 5) * 0.2}s" repeatCount="indefinite"/></path>`;
    return `<svg class="dia-svg" viewBox="0 0 360 250" role="img" aria-label="המחשה של המודיאליזה: אוריאה עוברת מהדם אל נוזל הדיאליזה דרך ממברנה"><rect x="4" y="4" width="352" height="242" rx="14" fill="#f7fbfe"/>
      <defs><marker id="dar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#c9364d"/></marker><marker id="dar2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#1a77a3"/></marker><marker id="dar3" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto"><path d="M0 0 L6 0 L3 6 z" fill="#7b3fc4"/></marker></defs>
      <text x="180" y="20" class="av-t">הדיאלייזר (בתוך המכונה)</text>
      <rect x="24" y="36" width="312" height="62" rx="14" fill="#fde2e6" stroke="#e08a98" stroke-width="2.5"/>
      <rect x="24" y="116" width="312" height="62" rx="14" fill="#dff1fb" stroke="#7fbcdc" stroke-width="2.5"/>
      <path d="M24 107 H336" stroke="#5b7b93" stroke-width="3" stroke-dasharray="6 4"/>
      <text x="180" y="111" class="av-s" style="font-weight:800;font-size:10px">ממברנה חצי-חדירה</text>
      <text x="180" y="52" class="av-s" fill="#c9364d" style="font-weight:800;font-size:11px">כלי הדם: הדם זורם בכיוון אחד</text>
      <text x="180" y="172" class="av-s" fill="#1a77a3" style="font-weight:800;font-size:11px">נוזל הדיאליזה זורם בכיוון ההפוך</text>
      ${bd}${dd}${ar}
      <path d="M8 67 H24" stroke="#c9364d" stroke-width="3" marker-end="url(#dar)"/><path d="M352 147 H336" stroke="#1a77a3" stroke-width="3" marker-end="url(#dar2)"/>
      <text x="180" y="200" class="av-s" style="font-weight:800">אוריאה בדם: ${Math.round(100 * (1 - p))}%   ·   בנוזל המנוקז: ${Math.round(100 * p)}%</text>
      <text x="180" y="216" class="av-s">הכדורים הסגולים הם אוריאה ורעלים אחרים. החצים: מעבר מהדם אל הנוזל.</text>
      <text x="180" y="232" class="av-s" style="font-size:9.5px">בנוסף, לחץ על הממברנה (אולטרה-פילטרציה) מוציא עודפי נוזלים מהדם.</text></svg>`;
  }
  function periSvg(s) {
    const fillTo = s === 0 || s === 3 ? 0 : 1, fh = 92, vessTo = s >= 2 ? 5 : 12, dirty = s === 2;
    const y0 = 192 - Math.round(fh * prev.fill), y1 = 192 - Math.round(fh * fillTo), h0 = Math.round(fh * prev.fill), h1 = Math.round(fh * fillTo);
    let vs = '', ds = '', ar = '';
    for (let i = 0; i < vessTo; i++) vs += dot(0, 72 + (i % 3) * 5, '#7b3fc4', 8, 100, 262, (i * 0.7) % 8);
    if (s === 2) {
      for (let i = 0; i < 7; i++) ds += `<circle cx="${112 + i * 22}" r="4" fill="#7b3fc4"><animate attributeName="cy" values="92;150" dur="3s" begin="-${(i * 0.43).toFixed(2)}s" repeatCount="indefinite"/></circle>`;
      for (let i = 0; i < 4; i++) ar += `<path d="M${120 + i * 40} 96 V128" stroke="#7b3fc4" stroke-width="2.4" marker-end="url(#dar3)" opacity=".7"/>`;
    }
    const bag = s === 3 ? `<g><rect x="150" y="226" width="60" height="22" rx="8" fill="#f3e2a4" stroke="#c9a640"/><text x="180" y="241" class="av-s" style="font-size:9.5px">שקית ניקוז: נוזל עם רעלים</text>${[0, 1, 2, 3].map(i => `<circle cx="${160 + i * 14}" cy="${236 + (i % 2) * 4}" r="3" fill="#7b3fc4"/>`).join('')}</g>` : '';
    const stream = s === 3 ? '<path d="M180 202 V226" stroke="#e5c35a" stroke-width="5"><animate attributeName="stroke-dasharray" values="0 24;24 0;0 24" dur="1.6s" repeatCount="indefinite"/></path>' : '<path d="M180 202 V222" stroke="#5b7b93" stroke-width="5"/>';
    return `<svg class="dia-svg" viewBox="0 0 360 252" role="img" aria-label="המחשה של דיאליזה צפקית"><rect x="4" y="4" width="352" height="244" rx="14" fill="#f7fbfe"/>
      <defs><marker id="dar3" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto"><path d="M0 0 L6 0 L3 6 z" fill="#7b3fc4"/></marker></defs>
      <path d="M62 66 Q62 36 180 36 Q298 36 298 66 V172 Q298 204 180 204 Q62 204 62 172 Z" fill="#fff6ec" stroke="#d9a977" stroke-width="3"/>
      <text x="180" y="28" class="av-t">חלל הבטן: הצפק הוא הממברנה</text>
      <rect x="78" y="58" width="204" height="30" rx="15" fill="#fde2e6" stroke="#e08a98" stroke-width="2"/>
      <text x="180" y="52" class="av-s" style="font-weight:800;font-size:10px">כלי דם (עם אוריאה ואשלגן)</text>${vs}
      <rect x="86" y="${y0}" width="188" height="${h0}" rx="10" fill="${dirty ? '#f3e2a4' : '#cfeaf8'}" stroke="${dirty ? '#c9a640' : '#7fbcdc'}" opacity=".95"><animate attributeName="y" from="${y0}" to="${y1}" dur="1.4s" fill="freeze"/><animate attributeName="height" from="${h0}" to="${h1}" dur="1.4s" fill="freeze"/></rect>
      ${ds}${ar}
      <text x="180" y="${fillTo ? 176 : 150}" class="av-s" style="font-weight:800">${fillTo ? (dirty ? 'נוזל דיאליזה + רעלים שעברו מהדם' : 'נוזל דיאליזה נקי') : 'חלל הצפק ריק'}</text>
      ${stream}<text x="196" y="216" class="av-s" text-anchor="start" style="font-size:9.5px">צינורית קבועה</text>${bag}
      <text x="180" y="244" class="av-s" style="font-size:9.5px">בכלי הדם עכשיו: ${s >= 2 ? 'פחות רעלים' : 'הרבה רעלים'} · בהתחלה: 12 נקודות</text></svg>`;
  }
  function draw() {
    const p = 0.8 * (1 - Math.exp(-0.75 * hr)), playing = !!timer;
    host.innerHTML = `<p class="instr">הדיאליזה מחליפה חלק מעבודת הכליה: מוציאה רעלים ונוזלים מהדם. בחרו שיטה, ואז לחצו על "הפעלה" לאנימציה, או התקדמו צעד אחר צעד.</p>
      <div class="row" style="gap:8px;margin-bottom:10px"><button class="btn grow ${mode === 'hemo' ? 'primary' : ''}" data-m="hemo">🩸 המודיאליזה (מכונה)</button><button class="btn grow ${mode === 'peri' ? 'primary' : ''}" data-m="peri">🫃 דיאליזה צפקית (בבטן)</button></div>
      ${mode === 'hemo' ? hemoSvg(p, playing) : periSvg(ph)}
      ${mode === 'hemo' ? `<div class="sim"><label>משך הטיפול: <b>${hr}</b> שעות</label><input type="range" id="dh" min="0" max="4" step="0.5" value="${hr}"></div>
        <div class="row" style="gap:8px;margin:8px 0"><button class="btn primary grow" id="dplay">${playing ? '⏸ עצירה' : (hr >= 4 ? '↺ מההתחלה' : '▶ הפעלה')}</button><button class="btn grow" id="dstep">שעה הבאה ⏭</button></div>
        <p class="small">הדם יוצא מהגוף דרך גישה לכלי דם (פיסטולה או צנתר), עובר בדיאלייזר ומוחזר נקי. בדרך כלל ממשיכים כך כשלוש-ארבע שעות, שלוש פעמים בשבוע, במרכז דיאליזה. ככל שהזמן עובר, יותר רעלים עוברים אל הנוזל. גם עודפי נוזלים מוצאים החוצה.</p>`
        : `<div class="row" style="gap:6px;margin:8px 0">${PH.map((x, i) => `<button class="btn small grow ${ph === i ? 'primary' : ''}" data-p="${i}">${i}</button>`).join('')}</div><div class="pg-info"><b>${PH[ph][0]}</b><div>${PH[ph][1]}</div></div>
        <div class="row" style="gap:8px;margin-top:8px"><button class="btn primary grow" id="dplay">${playing ? '⏸ עצירה' : '▶ הפעלה אוטומטית'}</button><button class="btn grow" id="pn">${ph < 3 ? 'לשלב הבא ⏭' : 'מההתחלה ↺'}</button></div>`}
      <div class="explain good" style="margin-top:10px">${mode === 'hemo' ? 'שאלה לחשיבה: למה נוזל הדיאליזה זורם בכיוון הפוך לדם? כדי שתמיד יהיה מפל ריכוזים בין הצדדים, לאורך כל הממברנה.' : 'שימו לב: הסכנה העיקרית היא פריטוניטיס, דלקת בצפק, כי הצינורית חושפת את הבטן לזיהום.'}</div>
      <button class="btn primary block" id="dgo" style="margin-top:12px">המשך לשאלות ←</button>`;
    prev = { fill: ph === 1 || ph === 2 ? 1 : 0, vess: ph >= 2 ? 5 : 12 };
    $$('[data-m]', host).forEach(b => b.onclick = () => { stop(); mode = b.dataset.m; draw(); });
    $$('[data-p]', host).forEach(b => b.onclick = () => { stop(); setPh(+b.dataset.p); });
    const dh = $('#dh', host); if (dh) dh.oninput = e => { stop(); hr = +e.target.value; draw(); };
    const pn = $('#pn', host); if (pn) pn.onclick = () => { stop(); setPh((ph + 1) % 4); };
    const st = $('#dstep', host); if (st) st.onclick = () => { stop(); hr = Math.min(4, Math.floor(hr) + 1); draw(); };
    const pl = $('#dplay', host); if (pl) pl.onclick = () => {
      if (timer) { stop(); draw(); return; }
      if (mode === 'hemo') { if (hr >= 4) hr = 0; timer = setInterval(() => { if (!document.body.contains(host)) { stop(); return; } hr = Math.min(4, +(hr + .5).toFixed(1)); if (hr >= 4) stop(); draw(); }, 900); }
      else { if (ph >= 3) ph = 0; timer = setInterval(() => { if (!document.body.contains(host)) { stop(); return; } if (ph >= 3) { stop(); draw(); return; } setPh(ph + 1, true); }, 3200); }
      draw();
    };
    $('#dgo', host).onclick = () => { stop(); done(null); };
  }
  /* מעבר שלב בדיאליזה צפקית: prev נשמר כדי שהמילוי והריקון יונפשו */
  function setPh(n, keepTimer) { const pf = ph === 1 || ph === 2 ? 1 : 0; prev = { fill: pf, vess: 12 }; ph = n; if (!keepTimer) stop(); draw(); }
  draw();
}
