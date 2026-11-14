'use strict';
/* ===== איפה הבעיה? פרה-רנלי, רנלי, פוסט-רנלי: סימולציה גרפית שמראה איך כל אחד פוגע בכליה ===== */
const AKI_SC = [
  { k: 'ok', t: '✅ כליה תקינה', cause: 'זרימת דם תקינה, נפרונים תקינים, ודרך פתוחה לשתן.', gfr: 100, urine: 'נפח תקין', us: 'כליה בגודל תקין, בלי הרחבה', fix: '' },
  { k: 'pre', t: '1️⃣ פרה-רנלי: לפני הכליה', cause: 'למשל התייבשות, דימום או אי-ספיקת לב: מגיע פחות דם אל הכליה.', gfr: 40, urine: 'מעט ומרוכז, כי הכליה עדיין תקינה ומשמרת מים', us: 'כליות תקינות', fix: 'אם מחזירים נוזלים או משפרים את הזרימה, הכליה חוזרת לעבוד.' },
  { k: 'ren', t: '2️⃣ רנלי: בכליה עצמה', cause: 'למשל נמק צינוריתי (ATN) או רעילות של תרופה: הנפרונים נפגעים.', gfr: 25, urine: 'לא מרוכז: האבוביות הפגועות לא יכולות לרכז', us: 'גודל תקין, ולפעמים כליה מוגדלת מעט', fix: 'צריך זמן להחלמה. לא מספיק להחזיר נוזלים.' },
  { k: 'post', t: '3️⃣ פוסט-רנלי: אחרי הכליה', cause: 'למשל אבן, ערמונית מוגדלת או גידול: השתן לא יכול לצאת.', gfr: 35, urine: 'מעט מאוד או כלום', us: 'הידרונפרוזיס: אגן הכליה מורחב', fix: 'אם מסירים את החסימה, הכליה מחלימה.' },
];
/* איורים אמיתיים (art/aki_*); אם חסרים, חוזרים לסכמה הישנה */
const AKI_IMG = { ok: 'body_ckd', pre: 'aki_pre', ren: 'aki_renal', post: 'aki_post' };
const AKI_CAP = { ok: 'כליה תקינה: דם זורם, הנפרונים בריאים והשתן יוצא.', pre: 'לפני הכליה: עורקי הכליה צרים וחיוורים, מגיע מעט דם.', ren: 'בכליה עצמה: הכליות נפוחות ודלקתיות.', post: 'אחרי הכליה: אבן בשופכן, ומעליה השופכן והאגן מורחבים.' };
function akiSvg(k) {
  const key = { ok: 'body_ckd', pre: 'aki_pre', ren: 'aki_renal', post: 'aki_post' }[k];
  if (key && ART[key]) return `<figure class="fig" style="margin:0"><img class="zoomable" loading="lazy" src="${ART[key]}" alt="${AKI_CAP[k]}" style="width:100%;max-width:340px;display:block;margin:0 auto;border-radius:14px"><figcaption class="small muted" style="text-align:center">${AKI_CAP[k]} · לחיצה להגדלה</figcaption></figure>`;
  return akiSvgOld(k);
}
function akiSvgOld(k) {
  const pre = k === 'pre', ren = k === 'ren', post = k === 'post';
  const art = pre ? 3 : 9, kcol = ren ? '#a24a4a' : '#c96a62';
  const spots = ren ? [[170, 120, 7], [200, 140, 8], [160, 160, 6], [195, 175, 7], [175, 195, 6]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#5b2323"/>`).join('') : '';
  return `<svg class="dia-svg" viewBox="0 0 360 300" role="img" aria-label="המחשה: איפה הבעיה פוגעת בכליה">
    <rect x="4" y="4" width="352" height="292" rx="14" fill="#f7fbfe"/>
    <rect x="30" y="20" width="60" height="34" rx="10" fill="#fde2e6" stroke="#e08a98"/><text x="60" y="41" class="av-s">לב ודם</text>
    <path d="M90 37 H150 Q165 37 168 75" fill="none" stroke="${pre ? '#e7a3ac' : '#c9364d'}" stroke-width="${art}" stroke-linecap="round"/>
    <text x="120" y="30" class="av-s" style="font-weight:800">${pre ? 'זרימה חלשה' : 'זרימת דם'}</text>
    ${pre ? '<text x="120" y="56" class="av-s">פחות דם מגיע</text>' : ''}
    <path d="M170 80 C130 80 120 130 130 175 C140 220 190 235 215 205 C245 170 235 110 200 85 Z" fill="${kcol}" stroke="#7a2f2a" stroke-width="2"/>${spots}
    ${post ? '<ellipse cx="185" cy="150" rx="26" ry="38" fill="#a9d8f0" stroke="#5aa6cc" stroke-width="2"/><text x="185" y="154" class="av-s" style="font-weight:800">אגן מורחב</text>' : '<ellipse cx="185" cy="150" rx="14" ry="22" fill="#f2c9a6" stroke="#c99066"/>'}
    <text x="115" y="150" class="av-s" text-anchor="end">כליה</text>
    <path d="M190 185 Q200 225 215 255" fill="none" stroke="#e6b94c" stroke-width="${post ? 9 : 5}" stroke-linecap="round"/>
    ${post ? '<circle cx="207" cy="238" r="8" fill="#6b5a4a" stroke="#fff" stroke-width="2"/><text x="250" y="242" class="av-s" style="font-weight:800" text-anchor="start">אבן</text>' : ''}
    <ellipse cx="228" cy="275" rx="26" ry="14" fill="${post ? '#f4efdc' : '#f3e2a4'}" stroke="#c9a74c"/><text x="228" y="278" class="av-s">שלפוחית</text>
    <text x="300" y="150" class="av-s" style="display:none"></text>
  </svg>`;
}
function akiSim(box, done) {
  let sc = 0; const seen = new Set([0]);
  const host = el('<div class="card"></div>'); box.appendChild(host);
  function draw() {
    const S = AKI_SC[sc];
    host.innerHTML = `<p class="instr">בחרו איפה הבעיה, וראו איך הכליה מגיבה: כמה היא מסננת, כמה שתן יוצא, ומה רואים באולטרסאונד.</p>
      <div class="col" style="gap:6px;margin-bottom:8px">${AKI_SC.map((s, i) => `<button class="btn block ${sc === i ? 'primary' : ''}" data-s="${i}" style="text-align:start">${s.t}</button>`).join('')}</div>
      ${akiSvg(S.k)}
      <div class="pg-info"><b>${S.t}</b><div>${S.cause}</div></div>
      <div class="pg-conc" style="margin:8px 0"><span class="small">קצב סינון (GFR)</span><div class="bar"><i style="width:${S.gfr}%;background:${S.gfr > 70 ? 'var(--good)' : S.gfr > 35 ? 'var(--gold)' : 'var(--bad)'}"></i></div><b class="small">${S.gfr}%</b></div>
      <div class="out"><div><b style="font-size:.95rem">${S.urine}</b><span>השתן</span></div><div><b style="font-size:.95rem">${S.us}</b><span>אולטרסאונד</span></div></div>
      ${S.fix ? `<div class="explain good">${S.fix}</div>` : ''}
      <button class="btn primary block" id="ago" style="margin-top:12px" ${seen.size < 4 ? 'disabled' : ''}>${seen.size < 4 ? `נסו את כל המצבים (${seen.size - 1} מתוך 3)` : 'המשך ←'}</button>`;
    $$('[data-s]', host).forEach(b => b.onclick = () => { sc = +b.dataset.s; seen.add(sc); draw(); });
    $('#ago', host).onclick = () => done(null);
  }
  draw();
}
