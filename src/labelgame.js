'use strict';
/* ===== "גרור את התווית": גוררים שם אל נקודה על איור אנטומי (או לחיצה על התווית ואז על הנקודה) =====
   קואורדינטות הנקודות באחוזים מגודל התמונה (x מהשמאל, y מלמעלה), לכן מתאימות לכל מסך. */
const LABEL_SETS = {
  nephron: { img: 'anat_nephron', ratio: 1000 / 1500, maxW: 360, title: 'הנפרון', tag: 'nephron_parts', parts: [
    { l: 'פקעית (גלומרולוס)', x: 21.5, y: 15.5, d: 'כדור של נימי דם שבו מתבצע הסינון.' },
    { l: 'קופסית באומן', x: 12.5, y: 21, d: 'הכוס הדו-שכבתית שעוטפת את הפקעית ואוספת את התסנין.' },
    { l: 'עורקון מביא', x: 4.5, y: 12.5, d: 'כלי הדם הרחב שמביא דם אל הפקעית.' },
    { l: 'עורקון מוציא', x: 31.5, y: 6, d: 'כלי הדם הצר שיוצא מהפקעית, ומוביל דם אל הנימים הפרי-טובולריים.' },
    { l: 'אבובית מקורבת', x: 36, y: 22, d: 'הצינורית המפותלת הראשונה, בקליפה: נספגים בה רוב המים והמלחים והגלוקוז.' },
    { l: 'לולאת הנלה', x: 56.5, y: 92, d: 'צינורית בצורת סיכת שיער שיורדת אל הלשד וחוזרת: יוצרת את מפל הריכוז בלשד.' },
    { l: 'אבובית מרוחקת', x: 68, y: 18.5, d: 'הצינורית המפותלת השנייה, בקליפה: כאן פועלים ADH ואלדוסטרון.' },
    { l: 'צינור מאסף', x: 91, y: 55, d: 'הצינור הישר שאוסף שתן מכמה נפרונים ומוביל אותו אל האגן.' },
    { l: 'רשת נימים פרי-טובולרית', x: 47.2, y: 52, d: 'כלי דם דקים שמקיפים את הצינוריות וקולטים את מה שנספג חזרה.' },
  ] },
  kidney: { img: 'anat_kidney', ratio: 1, maxW: 380, title: 'חתך הכליה', tag: 'kidney_parts', parts: [
    { l: 'קפסולה', x: 11.5, y: 50, d: 'מעטפת דקה של רקמת חיבור שעוטפת את הכליה.' },
    { l: 'קליפה (Cortex)', x: 15, y: 35, d: 'השכבה החיצונית של הכליה. בה נמצאים הגופיפים והצינוריות המפותלות.' },
    { l: 'לשד (Medulla)', x: 52, y: 14, d: 'החלק הפנימי של הכליה, בנוי מפירמידות (לולאות הנלה וצינורות מאספים).' },
    { l: 'פירמידה כלייתית', x: 46.5, y: 78, d: 'יחידה בצורת חרוט בלשד. קצה הפירמידה מנקז שתן אל הגביע.' },
    { l: 'גביע כלייתי', x: 50.5, y: 28.5, d: 'כוסית צהובה שאוספת שתן מקצה הפירמידה ומעבירה אל האגן.' },
    { l: 'אגן הכליה', x: 50, y: 49, d: 'החלל המשפך שאליו מתנקזים הגביעים. ממנו מתחיל השופכן.' },
    { l: 'עורק הכליה', x: 85, y: 39.5, d: 'כלי הדם האדום שמביא דם עשיר בחמצן לכליה.' },
    { l: 'וריד הכליה', x: 85, y: 51.5, d: 'כלי הדם הכחול שמוציא דם מהכליה.' },
    { l: 'שופכן', x: 69, y: 80, d: 'הצינור הצהוב שמוביל שתן מאגן הכליה אל שלפוחית השתן.' },
  ] },
  urinary: { img: 'anat_urinary', ratio: 800 / 1200, maxW: 330, title: 'מערכת השתן', tag: 'urinary_tract', parts: [
    { l: 'כליה', x: 24, y: 33.5, d: 'מסננת את הדם ויוצרת שתן.' },
    { l: 'שופכן', x: 34.2, y: 63.5, d: 'צינור שמוביל שתן מהכליה אל השלפוחית.' },
    { l: 'שלפוחית השתן', x: 49, y: 77, d: 'שק שרירי שאוגר את השתן.' },
    { l: 'שופכה', x: 48.8, y: 94, d: 'הצינור שמוציא את השתן מהשלפוחית אל מחוץ לגוף.' },
    { l: 'אבי העורקים הבטני', x: 52.5, y: 37, d: 'העורק הגדול (אדום) שמוריד דם מהלב אל הבטן, ומתפצל לעורקי הכליות.' },
    { l: 'וריד חלול תחתון', x: 46.7, y: 17, d: 'הווריד הגדול (כחול) שמחזיר דם מהגוף התחתון ומהכליות אל הלב.' },
    { l: 'בלוטת יותרת הכליה', x: 67.3, y: 13.5, d: 'בלוטה קטנה (צהובה) שיושבת מעל הכליה. מפרישה אלדוסטרון ועוד הורמונים, ואינה חלק מדרכי השתן.' },
  ] },
};

function labelGame(root, set, onDone) {
  const P = set.parts, n = P.length;
  let sel = null, wrong = 0; const placed = new Set();
  const host = el('<div class="card lgame"></div>'); root.appendChild(host);
  const imgHtml = ART[set.img] ? `<img src="${ART[set.img]}" alt="${set.title}" draggable="false">` : `<div class="lg-fallback" style="aspect-ratio:${set.ratio}">האיור לא נטען. אפשר לשחק גם בלי: הנקודות מסמנות מקומות בתרשים.</div>`;
  host.innerHTML = `<p class="muted small" style="margin:0 0 6px">גררו כל שם אל הנקודה המתאימה על האיור (או לחצו על שם ואז על נקודה).</p>
    <div class="lg-wrap" style="max-width:${set.maxW}px">${imgHtml}${P.map((p, i) => `<button class="lg-dot" data-d="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="נקודה ${i + 1}"></button>`).join('')}</div>
    <div id="lg-fb" class="lg-fb" aria-live="polite"></div>
    <div class="lg-pool" id="lg-pool">${shuffle(P.map((p, i) => i)).map(i => `<button class="lg-chip" data-c="${i}">${P[i].l}</button>`).join('')}</div>
    <div class="lg-legend" id="lg-legend"></div>`;
  const fb = $('#lg-fb', host), pool = $('#lg-pool', host), legend = $('#lg-legend', host);
  const dotEl = i => $(`.lg-dot[data-d="${i}"]`, host), chipEl = i => $(`.lg-chip[data-c="${i}"]`, host);
  const say2 = (cls, html) => { fb.className = 'lg-fb explain ' + cls; fb.innerHTML = html; };
  function attempt(c, d) {
    if (placed.has(c) || placed.has(d)) return;
    if (c === d) {
      placed.add(c); Snd.play('ok');
      const dot = dotEl(d); dot.classList.add('ok'); dot.textContent = placed.size; dot.disabled = true;
      chipEl(c).remove(); sel = null;
      legend.insertAdjacentHTML('beforeend', `<div class="lg-row"><b class="lg-num">${placed.size}</b><div><b>${P[c].l}</b><div class="small muted">${P[c].d}</div></div></div>`);
      say2('good', `✅ נכון! <b>${P[c].l}</b>: ${P[c].d}`);
      if (placed.size === n) { setTimeout(() => onDone(Math.max(0, Math.round(100 * (n - wrong) / n))), 900); }
    } else {
      wrong++; Store.mistake(set.tag); Snd.play('no');
      const dot = dotEl(d); dot.classList.remove('shake'); void dot.offsetWidth; dot.classList.add('shake');
      let extra = '';
      if (P[c].l.startsWith('לשד') || P[c].l.startsWith('פירמידה')) extra = ' (הלשד בנוי מפירמידות, אבל כאן מסומן מקום אחר.)';
      say2('bad', `🤔 לא מתאים. <b>${P[c].l}</b>: ${P[c].d}${extra} נסו נקודה אחרת.`);
    }
  }
  function select(c) { sel = (sel === c) ? null : c; $$('.lg-chip', host).forEach(b => b.classList.toggle('pick', +b.dataset.c === sel)); }
  host.addEventListener('click', e => {
    if (host._skipClick) { host._skipClick = false; return; }
    const ch = e.target.closest('.lg-chip'), dt = e.target.closest('.lg-dot');
    if (ch) { select(+ch.dataset.c); return; }
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
      if (!moved) { moved = true; ghost = el(`<div class="lg-ghost">${P[c].l}</div>`); document.body.appendChild(ghost); ch.classList.add('drag'); }
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
  id: 'a_label', part: 'A', sec: 'basics', icon: '🏷️', title: 'גרור את התווית', desc: 'שמות המבנים על איורי נפרון, כליה ודרכי השתן',
  learned: [
    'בנפרון: הפקעית וקופסית באומן בקליפה, עורקון מביא ומוציא, אבובית מקורבת, לולאת הנלה, אבובית מרוחקת וצינור מאסף, ורשת נימים סביב הצינוריות.',
    'בכליה: קפסולה, קליפה, לשד עם פירמידות, גביעים, אגן הכליה, עורק ווריד הכליה והשופכן.',
    'בדרכי השתן: כליה, שופכן, שלפוחית השתן ושופכה. אבי העורקים והווריד החלול התחתון הם כלי הדם הראשיים, ויותרת הכליה יושבת מעל הכליה.'
  ],
  teacherNote: 'שלושה איורים ללא תוויות, ושמות המבנים מגיעים מהקוד. אפשר לגרור או ללחוץ על שם ואז על נקודה. בציון נספרות טעויות. לשד ופירמידה חופפים אנטומית (הלשד בנוי מפירמידות), ולכן יש הסבר מיוחד לבלבול ביניהם.',
  teacherView() {
    return '<div class="card"><b>פתרון: מה מסומן בכל איור</b>' + Object.values(LABEL_SETS).map(s => `<div style="margin-top:8px"><b>${s.title}</b><ol style="margin:4px 0 0;padding-inline-start:20px">${s.parts.map(p => `<li>${p.l}: ${p.d}</li>`).join('')}</ol></div>`).join('') + '</div>';
  },
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('כמה שמות כבר מכירים? גררו כל שם אל המקום שלו באיור. אם קשה לגרור, לחצו על שם ואז על הנקודה.', 'happy'));
    runStages(root, ctx, ['nephron', 'kidney', 'urinary'].map(k => ({ title: LABEL_SETS[k].title, run: (box, done) => labelGame(box, LABEL_SETS[k], done) })));
  },
});
