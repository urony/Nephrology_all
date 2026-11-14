'use strict';
/* ===== המחשה גרפית ל-ADH: אוסמולריות בפלזמה, היפותלמוס, הפרשת ADH, תעלות מים בצינור המאסף ושתן ===== */
function adhSvg(adh, osm, vol, conc) {
  const col = (t) => { const a = [200, 232, 250], b = [236, 190, 40]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; };
  const solutes = 5 + Math.round((osm - 275) * 0.9), nCh = Math.round(adh * 6), nAdh = Math.round(adh * 7), nW = Math.round(adh * 5);
  let dots = ''; for (let i = 0; i < solutes; i++) dots += `<circle cx="${18 + (i * 37) % 148}" cy="${196 + (i * 53) % 24}" r="3.2" fill="#8059bd"/>`;
  let ad = ''; for (let i = 0; i < nAdh; i++) { const t = (i + 1) / (nAdh + 1); ad += `<circle cx="${(96 + (238 - 96) * t).toFixed(0)}" cy="${(98 + (172 - 98) * t).toFixed(0)}" r="4" fill="#7b3fc4" stroke="#fff" stroke-width="1"><animate attributeName="opacity" values="1;.3;1" dur="${(1.2 + i * 0.15).toFixed(2)}s" repeatCount="indefinite"/></circle>`; }
  let ch = ''; for (let i = 0; i < 6; i++) { const y = 150 + i * 20, on = i < nCh; ch += `<rect x="283" y="${y}" width="8" height="10" rx="2" fill="${on ? '#169bcb' : '#c9d3dc'}"/>`; if (on) ch += `<path d="M262 ${y + 5} H306" stroke="#169bcb" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#adhar)"><animate attributeName="stroke-dashoffset" values="14;0" dur="1s" repeatCount="indefinite"/></path>`; }
  let wd = ''; for (let i = 0; i < 6; i++) wd += `<circle cx="${262 + (i % 2) * 12}" cy="${158 + i * 17}" r="3.4" fill="#169bcb" opacity="${i < nW + 1 ? 1 : .35}"/>`;
  const cupH = Math.round(16 + 36 * (vol - 0.6) / 6), cupY = 292 - cupH, t = (conc - 100) / 1100;
  return `<svg class="adh-svg" viewBox="0 0 360 310" role="img" aria-label="המחשה: אוסמולריות, ADH, תעלות מים בצינור המאסף ונפח השתן">
    <defs><marker id="adhar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#169bcb"/></marker></defs>
    <rect x="4" y="4" width="352" height="302" rx="14" fill="#f7fbfe"/>
    <rect x="10" y="12" width="150" height="104" rx="30" fill="#efe9f8" stroke="#b9a5dc"/>
    <text x="85" y="28" class="av-t">מוח</text>
    <circle cx="52" cy="62" r="${14 + adh * 6}" fill="rgba(123,63,196,${(.15 + adh * .6).toFixed(2)})" stroke="#7b3fc4"/><text x="52" y="66" class="av-t">היפו</text>
    <text x="52" y="94" class="av-s">היפותלמוס:</text><text x="52" y="104" class="av-s">אוסמורצפטורים</text>
    <circle cx="96" cy="98" r="9" fill="#d9c6f2" stroke="#7b3fc4"/><text x="128" y="94" class="av-s">יותרת מוח</text><text x="128" y="104" class="av-s">אחורית</text>
    ${ad}
    <rect x="10" y="184" width="164" height="46" rx="23" fill="#fde2e6" stroke="#e08a98"/>${dots}
    <text x="92" y="246" class="av-s"><tspan font-weight="800">אוסמולריות פלזמה: ${osm}</tspan></text><text x="92" y="258" class="av-s">${osm > 295 ? 'גבוהה: הדם "מרוכז"' : osm < 285 ? 'נמוכה: הדם "מדולל"' : 'תקינה'}</text>
    <path d="M92 116 V184" stroke="#b9a5dc" stroke-width="2" stroke-dasharray="3 3"/>
    <text x="92" y="150" class="av-s" transform="rotate(-90 92 150)" style="display:none"></text>
    <rect x="248" y="138" width="40" height="132" rx="6" fill="${col(t)}" stroke="#5b7b93" stroke-width="2"/>
    <rect x="296" y="138" width="40" height="132" rx="6" fill="#fde2e6" stroke="#e08a98"/>
    ${ch}${wd}
    <text x="268" y="130" class="av-s">צינור מאסף</text><text x="316" y="130" class="av-s">דם</text>
    <text x="316" y="206" class="av-s" style="font-weight:800">${adh > .66 ? 'מים חוזרים לדם' : adh < .25 ? 'כמעט אין ספיגה' : 'ספיגה חלקית'}</text>
    <path d="M268 270 V282" stroke="#5b7b93" stroke-width="6"/>
    <rect x="248" y="${cupY}" width="40" height="${cupH}" fill="${col(t)}"/><path d="M246 278 V296 H290 V278" fill="none" stroke="#5b7b93" stroke-width="2"/>
    <text x="214" y="290" class="av-s" style="font-weight:800" text-anchor="end">שתן: ${vol} ל׳ ביממה</text>
  </svg>`;
}

/* ===== המחשה חיה לרצף הרנין-אנגיוטנסין-אלדוסטרון: מפעילים ירידת לחץ ותרופת ACE ורואים מה נדלק ===== */
function raasSim(box, done) {
  let drop = false, acei = false;
  const host = el('<div class="card"></div>'); box.appendChild(host);
  function draw() {
    const on = drop, blocked = drop && acei, full = drop && !acei;
    const bp = !drop ? 100 : blocked ? 70 : 92;
    const node = (ic, t, d, st, extra = '') => `<div class="rs-node ${st}"><span class="rs-ic">${ic}</span><div><b>${t}</b><div class="small">${d}</div>${extra}</div></div>`;
    const arrow = (act) => `<div class="rs-arrow ${act ? 'act' : ''}">▼</div>`;
    host.innerHTML = `<p class="instr">לחצו על "הלחץ בדם יורד" וראו איך הרצף נדלק. אחר כך הוסיפו מעכב ACE וראו איפה הוא חוסם.</p>
      <div class="row" style="gap:8px;margin-bottom:10px"><button class="btn grow ${drop ? 'primary' : ''}" id="rs-d">${drop ? '✅' : '🩸'} הלחץ בדם יורד</button><button class="btn grow ${acei ? 'primary' : ''}" id="rs-a">${acei ? '✅' : '💊'} מעכב ACE</button></div>
      <div class="rs-flow">
        ${node('🩸', 'לחץ או נפח הדם יורדים', 'דימום, התייבשות או מלח מועט', on ? 'on' : 'off')}${arrow(on)}
        ${node('🫘', 'הכליה משחררת רנין', 'התאים הג׳וקסטגלומרולריים מזהים את הירידה', on ? 'on' : 'off')}${arrow(on)}
        ${node('🧬', 'רנין חותך אנגיוטנסינוגן מהכבד', 'נוצר אנגיוטנסין I (עדיין חלש)', on ? 'on' : 'off')}${arrow(on)}
        ${node('🫁', 'האנזים ACE (בעיקר בריאות)', 'הופך אנגיוטנסין I ל-II', blocked ? 'block' : on ? 'on' : 'off', blocked ? '<div class="rs-x">⛔ מעכב ACE חוסם כאן</div>' : '')}${arrow(full)}
        ${node('⚡', 'אנגיוטנסין II', 'כיווץ כלי דם, גירוי אלדוסטרון, גירוי ADH וצמא', full ? 'on' : 'off')}${arrow(full)}
        <div class="rs-split ${full ? 'on' : 'off'}"><div>🧂<b>אלדוסטרון</b><span class="small">ספיגת נתרן ומים, הפרשת אשלגן</span></div><div>🥤<b>ADH וצמא</b><span class="small">ספיגת מים ושתייה</span></div><div>🫀<b>כיווץ כלי דם</b><span class="small">התנגדות גבוהה יותר</span></div></div>${arrow(full)}
        ${node('📈', 'לחץ הדם עולה בחזרה', full ? 'הרצף הצליח להחזיר את הלחץ' : blocked ? 'הרצף נחסם, ולכן הלחץ נשאר נמוך' : 'אין ירידה בלחץ, ולכן הרצף לא פעיל', full ? 'on' : 'off')}
      </div>
      <div class="pg-conc" style="margin:10px 0"><span class="small">לחץ הדם</span><div class="bar"><i style="width:${bp}%;background:${bp > 85 ? 'var(--good)' : bp > 75 ? 'var(--gold)' : 'var(--bad)'}"></i></div><b class="small">${bp}%</b></div>
      <p class="small">${!drop ? 'כרגע הלחץ תקין, והרצף רגוע.' : blocked ? 'הרנין עולה, אבל בלי ACE לא נוצר אנגיוטנסין II. לכן יש פחות כיווץ ופחות אלדוסטרון, והלחץ יורד. זה בדיוק מה שרוצים אצל חולה עם יתר לחץ דם.' : 'כל השלבים פעילים. אנגיוטנסין II הוא הכוכב של הרצף: הוא פועל בשלוש דרכים בו זמנית.'}</p>
      <button class="btn primary block" id="rs-go" style="margin-top:10px">המשך ←</button>`;
    $('#rs-d', host).onclick = () => { drop = !drop; draw(); };
    $('#rs-a', host).onclick = () => { acei = !acei; draw(); };
    $('#rs-go', host).onclick = () => done(null);
  }
  draw();
}
