'use strict';
/* ===== "גרור את התווית": גוררים שם אל נקודה על איור אנטומי (או לחיצה על התווית ואז על הנקודה) =====
   קואורדינטות הנקודות באחוזים מגודל התמונה (x מהשמאל, y מלמעלה), לכן מתאימות לכל מסך.
   l = שם בעברית, e = שם באנגלית, ha / ea = שמות נוספים שמתקבלים בהקלדה (עברית / אנגלית). */
const LABEL_SETS = {
  nephron: { img: 'anat_nephron', ratio: 1000 / 1500, maxW: 360, title: 'הנפרון', tag: 'nephron_parts', parts: [
    { l: 'פקעית (גלומרולוס)', e: 'Glomerulus', ha: ['גלומרולוס', 'פקעית'], x: 21.5, y: 15.5, d: 'כדור של נימי דם שבו מתבצע הסינון.' },
    { l: 'קופסית באומן', e: "Bowman's capsule", ea: ['bowman capsule', 'bowmans capsule'], x: 12.5, y: 21, d: 'הכוס הדו-שכבתית שעוטפת את הפקעית ואוספת את התסנין.' },
    { l: 'עורקון מביא', e: 'Afferent arteriole', ea: ['afferent'], x: 4.5, y: 12.5, d: 'כלי הדם הרחב שמביא דם אל הפקעית.' },
    { l: 'עורקון מוציא', e: 'Efferent arteriole', ea: ['efferent'], x: 31.5, y: 6, d: 'כלי הדם הצר שיוצא מהפקעית, ומוביל דם אל הנימים הפרי-טובולריים.' },
    { l: 'אבובית מקורבת', e: 'Proximal convoluted tubule (PCT)', ea: ['proximal tubule', 'pct', 'proximal convoluted tubule'], ha: ['צינורית מקורבת', 'אבוב מקורב'], x: 36, y: 22, d: 'הצינורית המפותלת הראשונה, בקליפה: נספגים בה רוב המים והמלחים והגלוקוז.' },
    { l: 'לולאת הנלה', e: 'Loop of Henle', ea: ['henle loop', 'loop of henles', 'henle'], ha: ['לולאת הנלה', 'הנלה'], x: 56.5, y: 92, d: 'צינורית בצורת סיכת שיער שיורדת אל הלשד וחוזרת: יוצרת את מפל הריכוז בלשד.' },
    { l: 'אבובית מרוחקת', e: 'Distal convoluted tubule (DCT)', ea: ['distal tubule', 'dct', 'distal convoluted tubule'], ha: ['צינורית מרוחקת', 'אבוב מרוחק'], x: 68, y: 18.5, d: 'הצינורית המפותלת השנייה, בקליפה: כאן פועלים ADH ואלדוסטרון.' },
    { l: 'צינור מאסף', e: 'Collecting duct', ea: ['collecting tubule'], ha: ['צינורית מאספת', 'צינור מאסף'], x: 91, y: 55, d: 'הצינור הישר שאוסף שתן מכמה נפרונים ומוביל אותו אל האגן.' },
    { l: 'רשת נימים פרי-טובולרית', e: 'Peritubular capillaries', ea: ['peritubular capillary', 'peritubular capillary network'], ha: ['נימים פרי-טובולריים', 'רשת נימים פרי טובולרית', 'נימים פרי טובולריים'], x: 47.2, y: 52, d: 'כלי דם דקים שמקיפים את הצינוריות וקולטים את מה שנספג חזרה.' },
  ] },
  kidney: { img: 'anat_kidney', ratio: 1, maxW: 380, title: 'חתך הכליה', tag: 'kidney_parts', parts: [
    { l: 'קפסולה', e: 'Renal capsule', ea: ['capsule', 'kidney capsule'], ha: ['קופסית הכליה', 'קופסית', 'קפסולת הכליה'], x: 11.5, y: 50, d: 'מעטפת דקה של רקמת חיבור שעוטפת את הכליה.' },
    { l: 'קליפה (Cortex)', e: 'Cortex', ea: ['renal cortex'], ha: ['קליפה', 'קליפת הכליה'], x: 15, y: 35, d: 'השכבה החיצונית של הכליה. בה נמצאים הגופיפים והצינוריות המפותלות.' },
    { l: 'לשד (Medulla)', e: 'Medulla', ea: ['renal medulla', 'renal pyramid', 'pyramid'], ha: ['לשד', 'לשד הכליה', 'פירמידה', 'פירמידה כלייתית'], x: 46.5, y: 78, d: 'החלק הפנימי של הכליה. בנוי מפירמידות בצורת חרוט (לולאות הנלה וצינורות מאספים), וקצה כל פירמידה מנקז שתן אל הגביע.' },
    { l: 'גביע כלייתי', e: 'Calyx', ea: ['renal calyx', 'minor calyx', 'calix'], ha: ['גביע', 'גביעים'], x: 50.5, y: 28.5, d: 'כוסית צהובה שאוספת שתן מקצה הפירמידה ומעבירה אל האגן.' },
    { l: 'אגן הכליה', e: 'Renal pelvis', ea: ['pelvis'], ha: ['אגן'], x: 50, y: 49, d: 'החלל המשפך שאליו מתנקזים הגביעים. ממנו מתחיל השופכן.' },
    { l: 'עורק הכליה', e: 'Renal artery', ha: ['עורק כלייתי'], x: 85, y: 39.5, d: 'כלי הדם האדום שמביא דם עשיר בחמצן לכליה.' },
    { l: 'וריד הכליה', e: 'Renal vein', ha: ['וריד כלייתי'], x: 85, y: 51.5, d: 'כלי הדם הכחול שמוציא דם מהכליה.' },
    { l: 'שופכן', e: 'Ureter', ha: [], x: 69, y: 80, d: 'הצינור הצהוב שמוביל שתן מאגן הכליה אל שלפוחית השתן.' },
  ] },
  urinary: { img: 'anat_urinary', ratio: 800 / 1200, maxW: 330, title: 'מערכת השתן', tag: 'urinary_tract', parts: [
    { l: 'כליה', e: 'Kidney', ha: [], x: 24, y: 33.5, d: 'מסננת את הדם ויוצרת שתן.' },
    { l: 'שופכן', e: 'Ureter', ha: [], x: 34.2, y: 63.5, d: 'צינור שמוביל שתן מהכליה אל השלפוחית.' },
    { l: 'שלפוחית השתן', e: 'Urinary bladder', ea: ['bladder'], ha: ['שלפוחית'], x: 49, y: 77, d: 'שק שרירי שאוגר את השתן.' },
    { l: 'שופכה', e: 'Urethra', ha: [], x: 48.8, y: 94, d: 'הצינור שמוציא את השתן מהשלפוחית אל מחוץ לגוף.' },
    { l: 'אבי העורקים הבטני', e: 'Abdominal aorta', ea: ['aorta'], ha: ['אבי העורקים', 'אאורטה', 'אבי עורקים בטני'], x: 52.5, y: 37, d: 'העורק הגדול (אדום) שמוריד דם מהלב אל הבטן, ומתפצל לעורקי הכליות.' },
    { l: 'וריד חלול תחתון', e: 'Inferior vena cava (IVC)', ea: ['inferior vena cava', 'ivc', 'vena cava'], ha: ['וריד נבוב תחתון', 'וריד חלול תחתון', 'וריד נבוב'], x: 46.7, y: 17, d: 'הווריד הגדול (כחול) שמחזיר דם מהגוף התחתון ומהכליות אל הלב.' },
    { l: 'בלוטת יותרת הכליה', e: 'Adrenal gland', ea: ['adrenal', 'suprarenal gland', 'adrenal glands'], ha: ['יותרת הכליה', 'בלוטת יותרת הכליה', 'בלוטת האדרנל'], x: 67.3, y: 13.5, d: 'בלוטה קטנה (צהובה) שיושבת מעל הכליה. מפרישה אלדוסטרון ועוד הורמונים, ואינה חלק מדרכי השתן.' },
  ] },
};

/* מצבי משחק */
const LABEL_MODES = [
  { k: 'he', t: 'בעברית', d: 'גוררים שמות בעברית אל האיור', ic: 'א' },
  { k: 'en', t: 'באנגלית', d: 'גוררים שמות באנגלית אל האיור', ic: 'A' },
  { k: 'mix', t: 'אקראי', d: 'חלק מהשמות בעברית וחלק באנגלית, בכל פעם אחרת', ic: '🎲' },
  { k: 'type-he', t: 'הפוך: כתבו בעברית', d: 'הנקודות ממוספרות, ואתם כותבים את שם המבנה בעברית', ic: '✍️' },
  { k: 'type-en', t: 'הפוך: כתבו באנגלית', d: 'הנקודות ממוספרות, ואתם כותבים את שם המבנה באנגלית', ic: '⌨️' },
];

/* נרמול טקסט להשוואה בהקלדה */
function labelNorm(s, he) {
  s = String(s).toLowerCase().replace(/[֑-ׇ]/g, '').replace(/[׳'`"״’.,\-–_()\/]/g, ' ').replace(/\s+/g, ' ').trim();
  if (he) s = s.replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ').replace(/(^| )ה(?=\S)/g, '$1');
  return s.replace(/ /g, '');
}
function labelAccepts(p, lang) {
  if (lang === 'en') {
    const base = [p.e, ...(p.ea || [])];
    base.slice().forEach(x => { const m = x.replace(/\s*\(.*?\)\s*/g, ' ').trim(); if (m) base.push(m); const ins = x.match(/\(([^)]*)\)/); if (ins) base.push(ins[1]); });
    return base.map(x => labelNorm(x, false));
  }
  const base = [p.l, ...(p.ha || [])];
  base.slice().forEach(x => { const m = x.replace(/\s*\(.*?\)\s*/g, ' ').trim(); if (m) base.push(m); const ins = x.match(/\(([^)]*)\)/); if (ins) base.push(ins[1]); });
  return base.map(x => labelNorm(x, true));
}

function labelGame(root, set, mode, onDone) {
  const P = set.parts, n = P.length, typed = mode.startsWith('type');
  const lang = P.map(() => mode === 'en' ? 'en' : mode === 'he' ? 'he' : mode === 'type-en' ? 'en' : mode === 'type-he' ? 'he' : (Math.random() < 0.5 ? 'en' : 'he'));
  const nm = i => lang[i] === 'en' ? P[i].e : P[i].l;
  let sel = null, wrong = 0, openDot = null; const placed = new Set(), tries = {};
  const host = el('<div class="card lgame"></div>'); root.appendChild(host);
  const imgHtml = ART[set.img] ? `<img src="${ART[set.img]}" alt="${set.title}" draggable="false">` : `<div class="lg-fallback" style="aspect-ratio:${set.ratio}">האיור לא נטען. אפשר לשחק גם בלי: הנקודות מסמנות מקומות בתרשים.</div>`;
  const instr = typed ? `לחצו על נקודה ממוספרת, וכתבו את שם המבנה ${mode === 'type-en' ? 'באנגלית' : 'בעברית'}.` : 'גררו כל שם אל הנקודה המתאימה על האיור, או לחצו על שם ואז על הנקודה.';
  host.innerHTML = `<p class="instr">${instr}</p>
    <div class="lg-wrap" style="max-width:${set.maxW}px">${imgHtml}${P.map((p, i) => `<button class="lg-dot ${typed ? 'num' : ''}" data-d="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="נקודה ${i + 1}">${typed ? i + 1 : ''}</button>`).join('')}</div>
    <div id="lg-type" class="lg-type" hidden></div>
    <div id="lg-fb" class="lg-fb" aria-live="polite"></div>
    <div class="lg-pool" id="lg-pool" ${typed ? 'hidden' : ''}>${shuffle(P.map((p, i) => i)).map(i => `<button class="lg-chip ${lang[i] === 'en' ? 'en' : ''}" data-c="${i}" ${lang[i] === 'en' ? 'dir="ltr"' : ''}>${nm(i)}</button>`).join('')}</div>
    <div class="lg-legend" id="lg-legend"></div><div id="lg-end"></div>`;
  const fb = $('#lg-fb', host), pool = $('#lg-pool', host), legend = $('#lg-legend', host), tbox = $('#lg-type', host);
  const dotEl = i => $(`.lg-dot[data-d="${i}"]`, host), chipEl = i => $(`.lg-chip[data-c="${i}"]`, host);
  const say2 = (cls, html) => { fb.className = 'lg-fb explain ' + cls; fb.innerHTML = html; };
  function both(i) { return `<b>${P[i].l}</b> <span dir="ltr" class="lg-en">(${P[i].e})</span>`; }
  function finishDot(c, ok) {
    placed.add(c);
    const dot = dotEl(c); dot.classList.remove('hot', 'pick'); dot.classList.add(ok ? 'ok' : 'revealed'); if (!typed) dot.textContent = placed.size; dot.disabled = true;
    legend.insertAdjacentHTML('beforeend', `<div class="lg-row"><b class="lg-num">${typed ? c + 1 : placed.size}</b><div>${both(c)}<div class="small muted">${P[c].d}</div></div></div>`);
    if (placed.size === n) {
      tbox.hidden = true;
      const pct = Math.max(0, Math.round(100 * (n - wrong) / n));
      $('#lg-end', host).innerHTML = `<div class="explain ${wrong ? 'bad' : 'good'}" style="margin-top:10px">${wrong ? `סיימתם. ${wrong} טעויות, ועכשיו אפשר לעבור על ההסברים למעלה.` : '🎉 מושלם, בלי טעויות!'}</div><button class="btn primary block" id="lg-next" style="margin-top:10px">המשך ←</button>`;
      $('#lg-next', host).onclick = () => onDone(pct);
      $('#lg-next', host).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
  function attempt(c, d) {
    if (placed.has(c) || placed.has(d)) return;
    if (c === d) {
      Snd.play('ok'); chipEl(c) && chipEl(c).remove(); sel = null; finishDot(c, true);
      say2('good', `✅ נכון! ${both(c)}: ${P[c].d}`);
    } else {
      wrong++; Store.mistake(set.tag); Snd.play('no');
      const dot = dotEl(d); dot.classList.remove('shake'); void dot.offsetWidth; dot.classList.add('shake');
      say2('bad', `🤔 לא מתאים. ${both(c)}: ${P[c].d} נסו נקודה אחרת.`);
    }
  }
  function select(c) { sel = (sel === c) ? null : c; $$('.lg-chip', host).forEach(b => b.classList.toggle('pick', +b.dataset.c === sel)); }
  /* מצב הקלדה */
  function openType(d) {
    openDot = d; $$('.lg-dot', host).forEach(x => x.classList.toggle('pick', +x.dataset.d === d));
    const he = mode === 'type-he';
    tbox.hidden = false;
    tbox.innerHTML = `<div class="lg-q"><b>נקודה ${d + 1}:</b> איך קוראים למבנה הזה ${he ? 'בעברית' : 'באנגלית'}?</div><div class="row"><input type="text" id="lg-in" ${he ? '' : 'dir="ltr"'} autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${he ? 'כתבו כאן שם בעברית' : 'type the name in English'}"><button class="btn primary" id="lg-ok">בדיקה</button></div>`;
    const inp = $('#lg-in', host); setTimeout(() => inp.focus({ preventScroll: true }), 30);
    const go = () => checkType(d, inp.value);
    $('#lg-ok', host).onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
  }
  function checkType(d, val) {
    const he = mode === 'type-he', v = labelNorm(val, he);
    if (!v) { say2('', 'כתבו שם ואז לחצו "בדיקה".'); return; }
    const acc = labelAccepts(P[d], he ? 'he' : 'en');
    if (acc.includes(v)) { Snd.play('ok'); tbox.hidden = true; openDot = null; finishDot(d, true); say2('good', `✅ נכון! ${both(d)}: ${P[d].d}`); return; }
    tries[d] = (tries[d] || 0) + 1; wrong++; Store.mistake(set.tag); Snd.play('no');
    if (tries[d] < 2) { const w = nm(d); say2('bad', `🤔 לא בדיוק. רמז: השם מתחיל ב-<b dir="${he ? 'rtl' : 'ltr'}">${w.trim()[0]}</b> ויש בו ${w.split(/\s+/).length} מילים. נסו שוב.`); }
    else { tbox.hidden = true; openDot = null; finishDot(d, false); say2('bad', `זה היה: ${both(d)}. ${P[d].d} (נספרה טעות.)`); }
  }
  host.addEventListener('click', e => {
    if (host._skipClick) { host._skipClick = false; return; }
    const ch = e.target.closest('.lg-chip'), dt = e.target.closest('.lg-dot');
    if (ch) { select(+ch.dataset.c); return; }
    if (typed) { if (dt && !dt.disabled) openType(+dt.dataset.d); return; }
    if (dt && sel != null) attempt(sel, +dt.dataset.d);
    else if (dt && !dt.disabled) say2('', 'בחרו קודם שם מהרשימה, או גררו אותו אל הנקודה.');
  });
  /* גרירה במגע/עכבר */
  pool.addEventListener('pointerdown', e => {
    const ch = e.target.closest('.lg-chip'); if (!ch) return;
    const c = +ch.dataset.c, sx = e.clientX, sy = e.clientY; let ghost = null, moved = false;
    try { ch.setPointerCapture(e.pointerId); } catch (_) { }
    const mv = ev => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 7) return;
      if (!moved) { moved = true; ghost = el(`<div class="lg-ghost">${nm(c)}</div>`); document.body.appendChild(ghost); ch.classList.add('drag'); }
      ghost.style.left = ev.clientX + 'px'; ghost.style.top = (ev.clientY - 28) + 'px';
      const t = near(ev.clientX, ev.clientY); $$('.lg-dot', host).forEach(d => d.classList.toggle('hot', d === t));
    };
    const up = ev => {
      ch.removeEventListener('pointermove', mv); ch.removeEventListener('pointerup', up); ch.removeEventListener('pointercancel', up);
      if (!moved) return;
      host._skipClick = true; setTimeout(() => host._skipClick = false, 50);
      ghost.remove(); ch.classList.remove('drag'); $$('.lg-dot', host).forEach(d => d.classList.remove('hot'));
      const t = ev.type === 'pointerup' ? near(ev.clientX, ev.clientY) : null;
      if (t) attempt(c, +t.dataset.d); else if (ev.type === 'pointerup') say2('', 'שחררו את השם ממש על אחת הנקודות.');
    };
    ch.addEventListener('pointermove', mv); ch.addEventListener('pointerup', up); ch.addEventListener('pointercancel', up);
  });
  function near(x, y) {
    let best = null, bd = 34;
    $$('.lg-dot:not(:disabled)', host).forEach(d => { const r = d.getBoundingClientRect(), dd = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)); if (dd < bd) { bd = dd; best = d; } });
    return best;
  }
}

registerGame({
  id: 'a_label', part: 'A', sec: 'basics', icon: '🏷️', title: 'גרור את התווית', desc: 'שמות המבנים בעברית ובאנגלית על איורי נפרון, כליה ודרכי השתן',
  learned: [
    'בנפרון: הפקעית וקופסית באומן בקליפה, עורקון מביא ומוציא, אבובית מקורבת, לולאת הנלה, אבובית מרוחקת וצינור מאסף, ורשת נימים סביב הצינוריות.',
    'בכליה: קפסולה, קליפה, לשד (בנוי מפירמידות), גביעים, אגן הכליה, עורק ווריד הכליה והשופכן.',
    'בדרכי השתן: כליה, שופכן, שלפוחית השתן ושופכה. אבי העורקים והווריד החלול התחתון הם כלי הדם הראשיים, ויותרת הכליה יושבת מעל הכליה.',
    'כל מבנה נלמד גם בשמו האנגלי, כמו בספרות הרפואית.'
  ],
  teacherNote: 'שלושה איורים ללא תוויות. חמישה מצבי משחק: עברית, אנגלית, אקראי (עברית ואנגלית בערבוב), והפוך (הנקודות ממוספרות והתלמיד מקליד את השם בעברית או באנגלית). בהקלדה מתקבלים גם שמות נרדפים ונוסחים נפוצים, וניתנים שני ניסיונות לכל נקודה. הלשד והפירמידות אוחדו לתווית אחת: "לשד (Medulla)".',
  teacherView() {
    return '<div class="card"><b>פתרון: מה מסומן בכל איור</b>' + Object.values(LABEL_SETS).map(s => `<div style="margin-top:8px"><b>${s.title}</b><ol style="margin:4px 0 0;padding-inline-start:20px">${s.parts.map(p => `<li>${p.l} <span dir="ltr">(${p.e})</span>: ${p.d}</li>`).join('')}</ol></div>`).join('') + '</div>';
  },
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('כמה שמות כבר מכירים? בחרו איך לשחק: בעברית, באנגלית, בערבוב, או להקליד את השם בעצמכם.', 'happy'));
    const pick = el(`<div class="card"><p class="instr">איך תרצו לשחק?</p><div class="col">${LABEL_MODES.map(m => `<button class="btn block lg-mode" data-m="${m.k}"><span style="font-size:1.4rem">${m.ic}</span> <b>${m.t}</b><span class="small muted" style="display:block;font-weight:500">${m.d}</span></button>`).join('')}</div></div>`);
    root.appendChild(pick);
    pick.onclick = e => {
      const b = e.target.closest('[data-m]'); if (!b) return;
      const mode = b.dataset.m; pick.remove();
      runStages(root, ctx, ['nephron', 'kidney', 'urinary'].map(k => ({ title: LABEL_SETS[k].title, run: (box, done) => labelGame(box, LABEL_SETS[k], mode, done) })));
    };
  },
});
