'use strict';
/* ===== מסע טיפת שתן: מהפקעית ועד היציאה מהגוף =====
   מחבר בין הנפרון לדרכי השתן. בכל תחנה בוחרים לאן הטיפה ממשיכה, והצבע של הצינור מראה את ריכוז הנוזל.
   כולל את לולאת הנלה: הזרימה יורדת בזרוע אחת ועולה בזרוע השנייה (זרימה נגדית). */
const PATH_NODES = [
  { n: 'פקעית (גלומרולוס)', en: 'Glomerulus', x: 70, y: 45, o: 300, osm: '300', zone: 'בקליפה, בתחילת הנפרון', d: 'כאן הדם מסונן בלחץ: מים ומומסים קטנים נדחפים החוצה, ותאי דם וחלבונים נשארים בדם. התסנין שנוצר עדיין לא שתן.' },
  { n: 'קופסית באומן', en: "Bowman's capsule", x: 105, y: 72, o: 300, osm: '300', zone: 'בקליפה, עוטפת את הפקעית', d: 'הכוס שאוספת את התסנין ומעבירה אותו אל האבובית. הריכוז כמו בדם.' },
  { n: 'אבובית מקורבת', en: 'Proximal convoluted tubule', x: 150, y: 125, o: 300, osm: '300', zone: 'בקליפה, האבובית המפותלת הראשונה', d: 'נספגים כאן כ-65% מהמים והמלחים וכמעט כל הגלוקוז. הריכוז לא משתנה, כי מים נספגים יחד עם המומסים.' },
  { n: 'לולאת הנלה: הזרוע היורדת', en: 'Descending limb', x: 110, y: 245, o: 800, osm: '300 ← 1200', zone: 'האבובית יורדת אל הלשד', d: 'הזרוע היורדת חדירה למים, והם יוצאים אל הלשד המלוח. ככל שיורדים, הנוזל באבובית מתרכז, עד כ-1200.' },
  { n: 'תחתית הלולאה', en: 'Bottom of the loop', x: 170, y: 335, o: 1200, osm: '1200', zone: 'עמוק בלשד', d: 'הנקודה המרוכזת ביותר. כאן הכיוון מתהפך: הנוזל מתחיל לעלות בחזרה, בזרם נגדי לירידה.' },
  { n: 'לולאת הנלה: הזרוע העולה', en: 'Ascending limb', x: 230, y: 245, o: 600, osm: '1200 ← 100', zone: 'האבובית עולה חזרה אל הקליפה', d: 'הזרוע העולה אטומה למים, אבל מוציאה מלחים (נתרן וכלור) אל הלשד. כך הלשד נשאר מלוח, והנוזל באבובית מתדלל.' },
  { n: 'אבובית מרוחקת', en: 'Distal convoluted tubule', x: 255, y: 115, o: 100, osm: '100', zone: 'בקליפה, האבובית המפותלת השנייה', d: 'כאן הנוזל מדולל. אלדוסטרון מגביר ספיגת נתרן ו-ADH מתחיל להשפיע על ספיגת המים.' },
  { n: 'צינור מאסף', en: 'Collecting duct', x: 305, y: 215, o: 600, osm: '100 עד 1200', zone: 'יורד דרך הלשד אל הפפילה', d: 'עובר דרך הלשד המלוח. עם ADH מים יוצאים אל הלשד והשתן מתרכז. בלי ADH השתן נשאר מדולל.' },
  { n: 'גביע כלייתי', en: 'Calyx', x: 305, y: 368, o: 500, osm: 'שתן', zone: 'בקצה הפירמידה, בפפילה', d: 'כוסית שאוספת את השתן מקצה הפירמידה. מכאן זה כבר שתן ולא משתנה.' },
  { n: 'אגן הכליה', en: 'Renal pelvis', x: 245, y: 410, o: 500, osm: 'שתן', zone: 'בשער הכליה, חלל משפך', d: 'משפך שאוסף שתן מכל הגביעים. ממנו מתחיל השופכן.' },
  { n: 'שופכן', en: 'Ureter', x: 245, y: 460, o: 500, osm: 'שתן', zone: 'צינור שיוצא מהכליה', d: 'צינור שרירי שמניע את השתן בגלי כיווץ, ולא רק בכוח הכבידה, אל השלפוחית.' },
  { n: 'שלפוחית השתן', en: 'Urinary bladder', x: 245, y: 515, o: 500, osm: 'שתן', zone: 'באגן, בסוף השופכנים', d: 'אוגרת את השתן. הדופן נמתחת כשהיא מתמלאת, והריקון נשלט בידי מערכת העצבים והסוגרים.' },
  { n: 'שופכה', en: 'Urethra', x: 245, y: 570, o: 500, osm: 'שתן', zone: 'היציאה מהגוף', d: 'מוציאה את השתן מהגוף. קצרה בנשים וארוכה בגברים, ולכן זיהומים שכיחים יותר בנשים.' },
];
const PATH_SEGS = [
  'M70,45 Q90,45 105,72',
  'M105,72 C112,95 130,95 150,125',
  'M150,125 C190,135 120,170 110,245',
  'M110,245 Q118,322 170,335',
  'M170,335 Q228,328 230,245',
  'M230,245 C235,190 275,180 255,115',
  'M255,115 C310,100 322,160 305,215',
  'M305,215 L305,368',
  'M305,368 Q295,408 245,410',
  'M245,410 L245,460',
  'M245,460 L245,515',
  'M245,515 L245,570',
];
const PATH_H = 610, PATH_VH = 300;
function osmColor(o) { const t = Math.max(0, Math.min(1, (o - 100) / 1100)), a = [105, 190, 235], b = [232, 89, 12]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }

function pathGameOld(root, onDone) {
  const N = PATH_NODES.length; let cur = 0, wrong = 0, clean = 0, hadWrong = false, busy = false;
  const host = el('<div class="card"></div>'); root.appendChild(host);
  host.innerHTML = `<p class="instr">הטיפה נולדה בפקעית. בכל תחנה בחרו לאן היא ממשיכה. שימו לב לצבע הצינור: כחול הוא נוזל מדולל, וכתום הוא נוזל מרוכז.</p>
    <div id="pg-panel"></div>
    <svg class="pg-svg" id="pg-svg" viewBox="0 0 360 ${PATH_VH}" role="img" aria-label="מסלול טיפת שתן מהפקעית אל השופכה">
      <defs><linearGradient id="pgmed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3d0"/><stop offset="1" stop-color="#f0a77f"/></linearGradient></defs>
      <rect x="0" y="0" width="360" height="190" fill="#fdf0e2"/><rect x="0" y="190" width="360" height="170" fill="url(#pgmed)"/><rect x="0" y="360" width="360" height="${PATH_H - 360}" fill="#eef4fa"/>
      <text x="8" y="16" class="pg-t">קליפה</text><text x="8" y="206" class="pg-t">לשד: ככל שיורדים, הלשד מלוח יותר</text><text x="8" y="350" class="pg-t pg-t2">1200</text><text x="8" y="222" class="pg-t pg-t2">300</text><text x="8" y="378" class="pg-t">אגן הכליה ודרכי השתן</text>
      ${PATH_SEGS.map((d, i) => `<path d="${d}" class="pg-tube ${i >= 8 ? 'wide' : ''}"/>`).join('')}
      ${PATH_SEGS.map((d, i) => `<path d="${d}" class="pg-fill ${i >= 8 ? 'wide' : ''}" data-s="${i}"/>`).join('')}
      ${PATH_NODES.map((p, i) => `<g class="pg-node" data-n="${i}" style="opacity:${i === 0 ? 1 : 0}"><circle cx="${p.x}" cy="${p.y}" r="5"/><text x="${p.x + (p.x > 200 ? -9 : 9)}" y="${p.y + 4}" text-anchor="${p.x > 200 ? 'end' : 'start'}">${p.n.replace('לולאת הנלה: ', '')}</text></g>`).join('')}
      <g id="pg-drop" transform="translate(70,45)"><circle r="11" fill="#f6c343" stroke="#fff" stroke-width="3"/><ellipse cx="-3" cy="-4" rx="3" ry="2" fill="#fff" opacity=".8"/></g>
    </svg>`;
  const svg = $('#pg-svg', host), panel = $('#pg-panel', host), drop = $('#pg-drop', host);
  $$('.pg-fill', host).forEach(p => { try { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; } catch (e) { } });
  const camY = y => Math.max(0, Math.min(PATH_H - PATH_VH, y - PATH_VH / 2));
  function setView(y) { svg.setAttribute('viewBox', `0 ${camY(y).toFixed(1)} 360 ${PATH_VH}`); }
  function moveTo(i, cb) {
    const seg = $(`.pg-fill[data-s="${i - 1}"]`, host), L = seg.getTotalLength();
    seg.style.stroke = osmColor(PATH_NODES[i].o); const t0 = performance.now(), D = 1100, fy = PATH_NODES[i - 1].y, ty = PATH_NODES[i].y;
    busy = true;
    (function f(now) {
      const t = Math.min(1, (now - t0) / D), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, pt = seg.getPointAtLength(L * e);
      drop.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`); seg.style.strokeDashoffset = L * (1 - e); setView(fy + (ty - fy) * e);
      if (t < 1) requestAnimationFrame(f); else { busy = false; $(`.pg-node[data-n="${i}"]`, host).style.opacity = 1; cb && cb(); }
    })(t0);
  }
  function meterHtml(o) { return `<div class="pg-conc"><span class="small">ריכוז הנוזל</span><div class="bar"><i style="width:${Math.round(100 * (o - 100) / 1100)}%;background:${osmColor(o)}"></i></div></div>`; }
  function infoHtml(p) { return `<div class="pg-info"><b>${p.n}</b> <span class="lg-en" dir="ltr">(${p.en})</span><div>${p.d}</div>${p.osm !== 'שתן' ? `<div class="small"><b>ריכוז: ${p.osm}</b> mOsm/L</div>` : ''}${meterHtml(p.o)}</div>`; }
  function render(msg, cls) {
    const p = PATH_NODES[cur];
    if (cur === N - 1) {
      const pct = Math.max(0, Math.round(100 * clean / (N - 1)));
      panel.innerHTML = `${infoHtml(p)}<div class="explain good">🎉 הטיפה יצאה מהגוף! ${wrong ? `היו ${wrong} טעויות בדרך.` : 'בלי אף טעות.'}</div><button class="btn primary block" id="pg-go" style="margin-top:10px">המשך ←</button>`;
      $('#pg-go', panel).onclick = () => onDone(pct); return;
    }
    const nxt = PATH_NODES[cur + 1], others = shuffle(PATH_NODES.map((_, i) => i).filter(i => i !== cur && i !== cur + 1)).slice(0, 2);
    const opts = shuffle([cur + 1, ...others]);
    panel.innerHTML = `${cur === 0 ? '' : infoHtml(p)}${msg ? `<div class="explain ${cls}">${msg}</div>` : ''}<div class="q" style="margin:8px 0">הטיפה נמצאת ב<b>${p.n}</b>. לאן היא ממשיכה?</div>
      <div class="col">${opts.map(i => `<button class="btn block pg-opt ${IS_TEACHER && i === cur + 1 ? 't-ok' : ''}" data-i="${i}"><b>${PATH_NODES[i].n}</b></button>`).join('')}</div>`;
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('.pg-opt'); if (!b || busy) return;
    const i = +b.dataset.i, nxt = PATH_NODES[cur + 1];
    if (i === cur + 1) {
      if (!hadWrong) clean++; hadWrong = false; Snd.play('ok'); panel.innerHTML = '<div class="explain good">✅ נכון! הטיפה בדרך...</div>';
      moveTo(cur + 1, () => { cur++; render(); const top = host.getBoundingClientRect().top; if (top < 0) host.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
    } else {
      wrong++; hadWrong = true; Store.mistake('urinary_tract'); Snd.play('no'); b.disabled = true; b.classList.add('no');
      const c = PATH_NODES[i], when = i < cur ? 'כבר עברנו שם: הזרימה בנפרון ובדרכי השתן היא בכיוון אחד בלבד.' : 'זה מגיע בהמשך הדרך, לא מיד אחרי התחנה הזו.';
      const fb = `🤔 לא עכשיו. <b>${c.n}</b>: ${c.d} ${when}<br>רמז לתחנה הבאה: ${nxt.zone}.`;
      let box = $('.pg-fb', panel); if (!box) { box = el('<div class="pg-fb"></div>'); panel.appendChild(box); }
      box.innerHTML = `<div class="explain bad">${fb}</div>`;
    }
  });
  render();
}

/* ===== גרסה עם איורים אמיתיים: הטיפה נעה על התמונות (נפרון, כליה, מערכת השתן) לפי מסלול שנצבע בריכוז הנוזל ===== */
const PATH_IMG = {
  neph: { key: 'nephron_real', w: 760, h: 1140, sw: 15, fs: 30 },
  kid: { key: 'anat_kidney', w: 1000, h: 1000, sw: 20, fs: 38 },
  uri: { key: 'anat_urinary', w: 800, h: 1200, sw: 18, fs: 34 },
};
/* מיקום כל תחנה על האיור שלה (פיקסלים של התמונה) */
const PATH_POS = [
  ['neph', 180, 262], ['neph', 118, 330], ['neph', 352, 285], ['neph', 326, 720], ['neph', 365, 1018], ['neph', 431, 720], ['neph', 560, 203], ['neph', 662, 640],
  ['kid', 505, 285], ['kid', 500, 490], ['uri', 274, 762], ['uri', 392, 924], ['uri', 390, 1128],
];
/* מסלול הטיפה בין תחנה לתחנה: i = בין תחנה i לתחנה i+1. swap = מעבר לתמונה אחרת */
const PATH_LINES = [
  { pts: [[180, 262], [150, 310], [118, 330]] },
  { pts: [[118, 330], [160, 385], [210, 415], [260, 440], [310, 440], [345, 405], [358, 340], [352, 285]] },
  { pts: [[352, 285], [380, 305], [392, 370], [380, 430], [335, 458], [328, 520], [326, 720]] },
  { pts: [[326, 720], [328, 900], [340, 990], [365, 1018]] },
  { pts: [[365, 1018], [410, 1005], [430, 900], [431, 720]] },
  { pts: [[431, 720], [432, 520], [445, 470], [478, 400], [485, 365], [555, 358], [598, 322], [610, 258], [585, 212], [560, 203]] },
  { pts: [[560, 203], [520, 207], [488, 238], [520, 285], [585, 292], [635, 305], [662, 330], [662, 640]] },
  { swap: true, pts: [[505, 285]] },
  { pts: [[505, 285], [502, 400], [500, 490]] },
  { swap: true, pts: [[274, 762]] },
  { pts: [[274, 762], [300, 860], [392, 924]] },
  { pts: [[392, 924], [390, 1010], [390, 1128]] },
];
function pathGameReal(root, onDone) {
  const N = PATH_NODES.length; let cur = 0, wrong = 0, clean = 0, hadWrong = false, busy = false, im = 'neph';
  const host = el('<div class="card"></div>'); root.appendChild(host);
  host.innerHTML = `<p class="instr">הטיפה נולדה בפקעית. בכל תחנה בחרו לאן היא ממשיכה. שימו לב לצבע השביל שהיא משאירה: כחול הוא נוזל מדולל, וכתום הוא נוזל מרוכז.</p>
    <div class="pgreal" id="pgr"><img id="pgr-img" alt="איור אנטומי: מסלול הטיפה"><svg id="pgr-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg></div>
    <div id="pg-panel" style="margin-top:12px"></div>`;
  const panel = $('#pg-panel', host), wrap = $('#pgr', host), img = $('#pgr-img', host), svg = $('#pgr-svg', host);
  const NS = 'http://www.w3.org/2000/svg';
  let trail, dots, drop, lab;
  function setImg(k) {
    im = k; const c = PATH_IMG[k];
    img.src = ART[c.key]; wrap.style.aspectRatio = c.w + ' / ' + c.h; wrap.style.width = `min(100%, ${(52 * c.w / c.h).toFixed(1)}vh)`; svg.setAttribute('viewBox', `0 0 ${c.w} ${c.h}`);
    svg.innerHTML = '<g id="pgr-trail"></g><g id="pgr-dots"></g><g id="pgr-drop"><circle r="22" fill="#f6c343" stroke="#fff" stroke-width="6"/><ellipse cx="-7" cy="-9" rx="7" ry="4.5" fill="#fff" opacity=".85"/></g><g id="pgr-lab"></g>';
    trail = svg.querySelector('#pgr-trail'); dots = svg.querySelector('#pgr-dots'); drop = svg.querySelector('#pgr-drop'); lab = svg.querySelector('#pgr-lab');
    drop.setAttribute('transform', 'translate(-100,-100)');
  }
  const posOf = i => PATH_POS[i];
  /* מציירת את השביל והנקודות של כל התחנות שכבר עברנו, באיור הנוכחי */
  function redrawVisited(upTo) {
    trail.innerHTML = ''; dots.innerHTML = '';
    const c = PATH_IMG[im];
    for (let i = 0; i < upTo; i++) {
      const L = PATH_LINES[i], sameIm = posOf(i + 1)[0] === im;
      if (!L.swap && sameIm && posOf(i)[0] === im) { const pl = document.createElementNS(NS, 'polyline'); pl.setAttribute('points', L.pts.map(p => p.join(',')).join(' ')); pl.setAttribute('class', 'pgr-trail'); pl.style.stroke = osmColor(PATH_NODES[i + 1].o); pl.style.strokeWidth = c.sw; trail.appendChild(pl); }
    }
    for (let i = 0; i <= upTo; i++) if (posOf(i)[0] === im) { const d = document.createElementNS(NS, 'circle'); d.setAttribute('cx', posOf(i)[1]); d.setAttribute('cy', posOf(i)[2]); d.setAttribute('r', c.sw * 0.6); d.setAttribute('class', 'pgr-dot'); dots.appendChild(d); }
  }
  function placeLabel(i) {
    const c = PATH_IMG[im], p = posOf(i), name = PATH_NODES[i].n.replace('לולאת הנלה: ', ''), w = name.length * c.fs * 0.56 + 28, h = c.fs + 18;
    const left = p[1] > c.w / 2, x = left ? p[1] - 34 - w : p[1] + 34, y = Math.max(8, Math.min(c.h - h - 8, p[2] - h / 2));
    lab.innerHTML = `<rect x="${Math.max(6, Math.min(c.w - w - 6, x))}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" class="pgr-lbbg"/><text x="${Math.max(6, Math.min(c.w - w - 6, x)) + w / 2}" y="${y + h / 2 + c.fs * 0.34}" text-anchor="middle" class="pgr-lbt" style="font-size:${c.fs}px">${name}</text>`;
  }
  function putDrop(i) { const p = posOf(i); drop.setAttribute('transform', `translate(${p[1]},${p[2]})`); }
  function lenOf(pts) { let L = 0; for (let k = 1; k < pts.length; k++) L += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); return L; }
  function pointAt(pts, d) { for (let k = 1; k < pts.length; k++) { const s = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); if (d <= s || k === pts.length - 1) { const t = s ? Math.min(1, d / s) : 1; return [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * t, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * t, k, t]; } d -= s; } return pts[pts.length - 1]; }
  function moveTo(i, cb) {
    const L = PATH_LINES[i - 1]; busy = true; lab.innerHTML = '';
    if (L.swap) {
      wrap.classList.add('fade');
      setTimeout(() => { setImg(posOf(i)[0]); redrawVisited(i); putDrop(i); wrap.classList.remove('fade'); setTimeout(() => { busy = false; placeLabel(i); cb && cb(); }, 450); }, 450);
      return;
    }
    const c = PATH_IMG[im], pts = L.pts, total = lenOf(pts), pl = document.createElementNS(NS, 'polyline');
    pl.setAttribute('class', 'pgr-trail'); pl.style.stroke = osmColor(PATH_NODES[i].o); pl.style.strokeWidth = c.sw; trail.appendChild(pl);
    const t0 = performance.now(), D = Math.max(1100, Math.min(2600, total * 2.4));
    (function f(now) {
      const t = Math.min(1, (now - t0) / D), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, d = total * e, pt = pointAt(pts, d);
      drop.setAttribute('transform', `translate(${pt[0].toFixed(1)},${pt[1].toFixed(1)})`);
      const done = pts.slice(0, pt[2]); done.push([pt[0], pt[1]]); pl.setAttribute('points', done.map(p => p.join(',')).join(' '));
      if (t < 1) requestAnimationFrame(f); else { busy = false; const dd = document.createElementNS(NS, 'circle'); dd.setAttribute('cx', posOf(i)[1]); dd.setAttribute('cy', posOf(i)[2]); dd.setAttribute('r', c.sw * 0.6); dd.setAttribute('class', 'pgr-dot'); dots.appendChild(dd); placeLabel(i); cb && cb(); }
    })(t0);
  }
  function meterHtml(o) { return `<div class="pg-conc"><span class="small">ריכוז הנוזל</span><div class="bar"><i style="width:${Math.round(100 * (o - 100) / 1100)}%;background:${osmColor(o)}"></i></div></div>`; }
  function infoHtml(p) { return `<div class="pg-info"><b>${p.n}</b> <span class="lg-en" dir="ltr">(${p.en})</span><div>${p.d}</div>${p.osm !== 'שתן' ? `<div class="small"><b>ריכוז: ${p.osm}</b> mOsm/L</div>` : ''}${meterHtml(p.o)}</div>`; }
  function render(msg, cls) {
    const p = PATH_NODES[cur];
    if (cur === N - 1) {
      const pct = Math.max(0, Math.round(100 * clean / (N - 1)));
      panel.innerHTML = `${infoHtml(p)}<div class="explain good">🎉 הטיפה יצאה מהגוף! ${wrong ? `היו ${wrong} טעויות בדרך.` : 'בלי אף טעות.'}</div><button class="btn primary block" id="pg-go" style="margin-top:10px">המשך ←</button>`;
      $('#pg-go', panel).onclick = () => onDone(pct); return;
    }
    const nxt = PATH_NODES[cur + 1], others = shuffle(PATH_NODES.map((_, i) => i).filter(i => i !== cur && i !== cur + 1)).slice(0, 2);
    const opts = shuffle([cur + 1, ...others]);
    panel.innerHTML = `${cur === 0 ? '' : infoHtml(p)}${msg ? `<div class="explain ${cls}">${msg}</div>` : ''}<div class="q" style="margin:8px 0">הטיפה נמצאת ב<b>${p.n}</b>. לאן היא ממשיכה?</div>
      <div class="col">${opts.map(i => `<button class="btn block pg-opt ${IS_TEACHER && i === cur + 1 ? 't-ok' : ''}" data-i="${i}"><b>${PATH_NODES[i].n}</b></button>`).join('')}</div>`;
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('.pg-opt'); if (!b || busy) return;
    const i = +b.dataset.i, nxt = PATH_NODES[cur + 1];
    if (i === cur + 1) {
      if (!hadWrong) clean++; hadWrong = false; Snd.play('ok'); panel.innerHTML = '<div class="explain good">✅ נכון! הטיפה בדרך...</div>';
      moveTo(cur + 1, () => { cur++; render(); const top = host.getBoundingClientRect().top; if (top < 0) host.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
    } else {
      wrong++; hadWrong = true; Store.mistake('urinary_tract'); Snd.play('no'); b.disabled = true; b.classList.add('no');
      const c = PATH_NODES[i], when = i < cur ? 'כבר עברנו שם: הזרימה בנפרון ובדרכי השתן היא בכיוון אחד בלבד.' : 'זה מגיע בהמשך הדרך, לא מיד אחרי התחנה הזו.';
      const fb = `🤔 לא עכשיו. <b>${c.n}</b>: ${c.d} ${when}<br>רמז לתחנה הבאה: ${nxt.zone}.`;
      let box = $('.pg-fb', panel); if (!box) { box = el('<div class="pg-fb"></div>'); panel.appendChild(box); }
      box.innerHTML = `<div class="explain bad">${fb}</div>`;
    }
  });
  setImg('neph'); redrawVisited(0); putDrop(0); placeLabel(0);
  render();
}

/* אם חסרים האיורים האמיתיים, חוזרים לסכמה הישנה */
function pathGame(root, onDone) { return (ART.nephron_real && ART.anat_kidney && ART.anat_urinary) ? pathGameReal(root, onDone) : pathGameOld(root, onDone); }
