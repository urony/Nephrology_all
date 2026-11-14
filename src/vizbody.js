'use strict';
/* ===== כליה חולה, גוף שלם: סימולציה גרפית. כל הגוף מגיב לירידה בתפקוד הכליה ===== */
const BODY_ORGANS = [
  { k: 'marrow', x: 150, y: 150, ix: 24, iy: 72, ic: '🩸', t: 'מח העצם (למשל באגן)', sub: 'פחות EPO: פחות כדוריות דם אדומות', thr: 60, msg: 'אנמיה: חולשה, עייפות וחיוורון.', why: 'הכליה מייצרת פחות אריתרופויטין (EPO), ולכן מח העצם מייצר פחות כדוריות דם אדומות. כדוריות מעטות נושאות פחות חמצן, ומכאן העייפות, החולשה והחיוורון. מח העצם האדום, שבו נוצרות כדוריות הדם, נמצא בעיקר בעצמות השטוחות: האגן, עצם החזה, הצלעות והחוליות.' },
  { k: 'bone', x: 150, y: 260, ix: 79, iy: 88, ic: '🦴', t: 'העצמות', sub: 'ויטמין D לא מופעל: סידן יורד', thr: 45, msg: 'מחלת עצם מטבולית ורככת: עצמות חלשות ו-PTH גבוה.', why: 'הכליה לא מפעילה ויטמין D, ולכן הסידן בדם יורד והזרחן עולה. בגלל זה PTH עולה ומוציא סידן מהעצמות, והעצמות נחלשות.' },
  { k: 'bp', x: 150, y: 95, ix: 54, iy: 27, ic: '❤️', t: 'לב וכלי דם', sub: 'רנין עולה ונתרן נצבר', thr: 55, msg: 'יתר לחץ דם.', why: 'הכליה הפגועה לא מוציאה נתרן ומים, ולכן נפח הדם עולה. בנוסף היא מפרישה רנין שמפעיל את מערכת RAAS ומעלה את לחץ הדם. הלב עובד קשה יותר.' },
  { k: 'lung', x: 150, y: 120, ix: 31, iy: 25, ic: '🫁', t: 'ריאות', sub: 'פיצוי על חמצת: נשימה מהירה', thr: 35, msg: 'נשימה מהירה, כי הדם חומצי.', why: 'הכליה לא מוציאה חומצה, ולכן הדם נעשה חומצי (חמצת). הריאות מפצות בנשימה מהירה שמוציאה פחמן דו-חמצני. אם הנוזלים מצטברים, הם יכולים להצטבר גם בריאות (בצקת ריאות).' },
  { k: 'leg', x: 150, y: 340, ix: 9, iy: 62, ic: '🦵', t: 'רגליים ורקמות', sub: 'נתרן ומים נצברים', thr: 40, msg: 'בצקות בקרסוליים ובפנים.', why: 'הכליה לא מוציאה נתרן ומים, והנוזל מצטבר ברקמות: בקרסוליים, ברגליים ובפנים. לחיצה על העור משאירה שקע.' },
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
/* תצוגה עם האיור האמיתי (art/body_ckd): סימונים ממוספרים על האיברים, וכרטיסים מתחת עם ההסבר "למה" */
function bodyPic(pct) {
  const on = o => pct < o.thr;
  const marks = BODY_ORGANS.map((o, i) => `<span class="bmk ${on(o) ? 'on' : ''}" style="left:${o.ix}%;top:${o.iy}%" title="${o.t}">${i + 1}</span>`).join('');
  const kid = `<span class="bmk kid" style="left:34%;top:53%;opacity:${0.35 + pct / 160}" title="כליות">כליה</span><span class="bmk kid" style="left:66%;top:53%;opacity:${0.35 + pct / 160}" title="כליות">כליה</span>`;
  return `<div class="bodywrap"><img class="zoomable" src="${ART.body_ckd}" alt="גוף האדם: האיברים שמושפעים מכליה חולה">${kid}${marks}</div>`;
}
function bodyCards(pct) {
  return BODY_ORGANS.map((o, i) => { const on = pct < o.thr; return `<div class="bcard ${on ? 'on' : ''}"><div class="bhead"><span class="bn">${i + 1}</span><b>${o.ic} ${o.t}</b><span class="bst">${on ? 'מושפע' : 'תקין'}</span></div>${on ? `<div class="bmsg"><b>${o.msg}</b></div><div class="bwhy small">למה? ${o.why}</div>` : `<div class="small muted">${o.sub}. עדיין תקין.</div>`}</div>`; }).join('');
}
function bodySim(box, done) {
  let pct = 100; const seen = new Set();
  const host = el('<div class="card"></div>'); box.appendChild(host);
  function draw() {
    const hit = BODY_ORGANS.filter(o => pct < o.thr);
    hit.forEach(o => seen.add(o.k));
    host.innerHTML = `<p class="instr">הזיזו את הסליידר: כמה מיכולת הכליות נשארה? ראו אילו חלקים בגוף נפגעים, ובאיזה סדר.</p>
      <div class="sim"><label>תפקוד הכליות: <b>${pct}%</b></label><input type="range" id="bs" min="5" max="100" step="5" value="${pct}"></div>
      ${ART.body_ckd ? bodyPic(pct) : bodySvg(pct)}
      <div class="pg-info"><b>${hit.length ? `מה קורה עכשיו (${hit.length} מתוך 5 מערכות)` : 'הכליות מתפקדות היטב'}</b>${hit.length ? '' : '<div>אין עדיין סימנים בגוף. בהמשך, כשהתפקוד יורד, הם יתחילו להופיע.</div>'}</div>
      <div class="bcards">${bodyCards(pct)}</div>
      <p class="small muted">שימו לב: הסימנים לא מופיעים כולם בבת אחת. קודם הגוף מפצה, ורק כשהתפקוד יורד הרבה מופיעים הסימנים. (הסף של כל מערכת כאן להמחשה בלבד.)</p>
      <button class="btn primary block" id="bgo" style="margin-top:12px" ${seen.size < 5 ? 'disabled' : ''}>${seen.size < 5 ? `הורידו את התפקוד עד שכל חמש המערכות נפגעות (${seen.size} מתוך 5)` : 'המשך ←'}</button>`;
    $('#bs', host).oninput = e => { pct = +e.target.value; draw(); };
    $('#bgo', host).onclick = () => done(null);
  }
  draw();
}
