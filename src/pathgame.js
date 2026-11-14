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

function pathGame(root, onDone) {
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
