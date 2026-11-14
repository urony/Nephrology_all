'use strict';
/* ===== כליה חולה, גוף שלם: סימולציה גרפית. כל הגוף מגיב לירידה בתפקוד הכליה ===== */
const BODY_ORGANS = [
  { k: 'marrow', x: 150, y: 150, ic: '🩸', t: 'מח העצם', sub: 'פחות EPO: פחות כדוריות דם אדומות', thr: 60, msg: 'אנמיה: חולשה, עייפות וחיוורון.' },
  { k: 'bone', x: 150, y: 260, ic: '🦴', t: 'העצמות', sub: 'ויטמין D לא מופעל: סידן יורד', thr: 45, msg: 'מחלת עצם מטבולית ורככת: עצמות חלשות ו-PTH גבוה.' },
  { k: 'bp', x: 150, y: 95, ic: '❤️', t: 'לב וכלי דם', sub: 'רנין עולה ונתרן נצבר', thr: 55, msg: 'יתר לחץ דם.' },
  { k: 'lung', x: 150, y: 120, ic: '🫁', t: 'ריאות', sub: 'פיצוי על חמצת: נשימה מהירה', thr: 35, msg: 'נשימה מהירה, כי הדם חומצי.' },
  { k: 'leg', x: 150, y: 340, ic: '🦵', t: 'רגליים ורקמות', sub: 'נתרן ומים נצברים', thr: 40, msg: 'בצקות בקרסוליים ובפנים.' },
];
function bodySvg(pct) {
  const on = o => pct < o.thr;
  const col = o => on(o) ? '#d9534f' : '#4aa36a';
  const row = (o, i) => `<g transform="translate(215,${48 + i * 62})">
      <rect width="190" height="52" rx="10" fill="${on(o) ? '#fdeaea' : '#eef8f1'}" stroke="${col(o)}" stroke-width="2"/>
      <text x="16" y="32" font-size="22">${o.ic}</text>
      <text x="112" y="22" class="av-s" text-anchor="middle" style="font-weight:800">${o.t}</text>
      <text x="112" y="40" class="av-s" text-anchor="middle" style="font-size:10px">${on(o) ? 'מושפע' : 'תקין'}</text>
      <path d="M0 26 H-${215 - o.x - 20}" stroke="${col(o)}" stroke-width="2" stroke-dasharray="${on(o) ? '0' : '4 4'}" transform="translate(0,0)"/>
    </g>`;
  return `<svg class="dia-svg" viewBox="0 0 420 380" role="img" aria-label="המחשה: איך כל הגוף מושפע מכליה חולה" style="max-width:480px">
    <rect x="3" y="3" width="414" height="374" rx="14" fill="#f7fbfe"/>
    <ellipse cx="110" cy="58" rx="26" ry="28" fill="#f3d3b8" stroke="#b98d68" stroke-width="2"/>
    <path d="M75 92 Q110 78 145 92 L152 215 L138 222 L132 360 L112 362 L110 250 L108 250 L106 362 L86 360 L80 222 L68 215 Z" fill="#f6dcc4" stroke="#b98d68" stroke-width="2"/>
    <ellipse cx="97" cy="188" rx="9" ry="16" fill="${pct < 100 ? '#c96a62' : '#c96a62'}" stroke="#7a2f2a" stroke-width="2" opacity="${0.3 + pct / 143}"/>
    <ellipse cx="123" cy="188" rx="9" ry="16" fill="#c96a62" stroke="#7a2f2a" stroke-width="2" opacity="${0.3 + pct / 143}"/>
    <text x="110" y="214" class="av-s" style="font-size:10px">כליות</text>
    ${BODY_ORGANS.map((o, i) => `<circle cx="110" cy="${[132, 170, 112, 126, 330][i]}" r="9" fill="${col(o)}" opacity=".9"/><path d="M119 ${[132, 170, 112, 126, 330][i]} L215 ${74 + i * 62}" stroke="${col(o)}" stroke-width="1.6" fill="none"/>`).join('')}
    ${BODY_ORGANS.map(row).join('')}
  </svg>`;
}
function bodySim(box, done) {
  let pct = 100; const seen = new Set();
  const host = el('<div class="card"></div>'); box.appendChild(host);
  function draw() {
    const hit = BODY_ORGANS.filter(o => pct < o.thr);
    hit.forEach(o => seen.add(o.k));
    host.innerHTML = `<p class="instr">הזיזו את הסליידר: כמה מיכולת הכליות נשארה? ראו אילו חלקים בגוף נפגעים, ובאיזה סדר.</p>
      <div class="sim"><label>תפקוד הכליות: <b>${pct}%</b></label><input type="range" id="bs" min="5" max="100" step="5" value="${pct}"></div>
      ${bodySvg(pct)}
      <div class="pg-info"><b>${hit.length ? `מה קורה עכשיו (${hit.length} מתוך 5 מערכות)` : 'הכליות מתפקדות היטב'}</b>${hit.length ? hit.map(o => `<div>${o.ic} ${o.msg}</div>`).join('') : '<div>אין עדיין סימנים בגוף. בהמשך, כשהתפקוד יורד, הם יתחילו להופיע.</div>'}</div>
      <p class="small muted">שימו לב: הסימנים לא מופיעים כולם בבת אחת. קודם הגוף מפצה, ורק כשהתפקוד יורד הרבה מופיעים הסימנים. (הסף של כל מערכת כאן להמחשה בלבד.)</p>
      <button class="btn primary block" id="bgo" style="margin-top:12px" ${seen.size < 5 ? 'disabled' : ''}>${seen.size < 5 ? `הורידו את התפקוד עד שכל חמש המערכות נפגעות (${seen.size} מתוך 5)` : 'המשך ←'}</button>`;
    $('#bs', host).oninput = e => { pct = +e.target.value; draw(); };
    $('#bgo', host).onclick = () => done(null);
  }
  draw();
}
