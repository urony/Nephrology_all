'use strict';
/* ===== חלק ב׳ – אבחון מבדיקות מעבדה (דם, שתן והדמיה) =====
   המטופלים נוצרים אקראית (labgen.js). שלוש רמות: קלאסי, ערכים בגבולות, ובחירת הבדיקה הבאה. */
const PANEL_ITEMS = { chem: ['CREA', 'UREA', 'EGFR', 'NA', 'K', 'HCO3', 'PH'], basic: ['CREA', 'UREA', 'EGFR', 'NA', 'K'], min: ['CA', 'PHOS', 'PTH', 'URIC'], cbc: ['Hb', 'WBC', 'CRP'], gluc: ['GLU'] };
const PANEL_TITLE = { chem: 'כימיה בדם: תפקוד כליות ואלקטרוליטים', basic: 'כימיה בדם: בדיקות בסיס', min: 'מינרלים והורמון הפארא-תירואיד', cbc: 'ספירת דם ו-CRP', gluc: 'גלוקוז בדם', urine: 'בדיקת שתן' };
const PANEL_TUBE = { chem: 'tube_gold', basic: 'tube_gold', min: 'tube_gold', cbc: 'tube_purple', gluc: 'tube_grey', urine: 'cup_urine', us: 'us_probe' };
const TUBE_NAME = { tube_gold: 'צינורית צהובה', tube_purple: 'צינורית סגולה', tube_grey: 'צינורית אפורה', cup_urine: 'כוסית שתן', us_probe: 'חדר הדמיה' };
const TUBE_EMOJI = { tube_gold: '🟡', tube_purple: '🟣', tube_grey: '⚪', cup_urine: '🧪', us_probe: '📡' };
const DIP_LVL = ['שלילי', 'עקבות', '+', '++', '+++'];
const US_TXT = {
  normal: 'שתי הכליות בגודל תקין, ללא הרחבת אגנים (ללא הידרונפרוזיס) וללא אבנים.',
  small: 'שתי הכליות מצומקות וקטנות מהרגיל, עם מבנה לא אחיד.',
  hydro: 'הרחבת אגני הכליה בשתי הכליות (הידרונפרוזיס) ושלפוחית שתן מלאה. הערמונית מוגדלת.',
  stone: 'אבן בשופכן והרחבה קלה של אגן הכליה בצד אחד (הידרונפרוזיס קל).',
};
const INFO = {
  prerenal: { key: ['CREA', 'UREA', 'EGFR', 'USG'], pts: ['קריאטינין ואוריאה גבוהים וקצב הסינון (eGFR) נמוך: הכליה לא מסננת מספיק.', 'שתן מרוכז (משקל סגולי גבוה) ונפח שתן קטן: הצינוריות בריאות ומנסות לחסוך מים.', 'באולטרסאונד הכליות תקינות וללא חסימה: הבעיה היא באספקת הדם אל הכליה (התייבשות, ירידת לחץ דם).'] },
  renal_aki: { key: ['CREA', 'UREA', 'EGFR', 'K', 'PH', 'USG'], pts: ['קריאטינין ואוריאה עולים בחדות, והאשלגן גבוה עם pH נמוך (חמצת).', 'שתן לא מרוכז (משקל סגולי סביב 1.010): הצינוריות הפגועות לא מצליחות לרכז את השתן.', 'הכליות בגודל תקין, בלי חסימה, ובלי אנמיה: הפגיעה חדה ולא כרונית.'] },
  postrenal: { key: ['CREA', 'UREA', 'EGFR', 'K', 'PH'], pts: ['קריאטינין ואוריאה עולים, עם אשלגן גבוה וחמצת.', 'באולטרסאונד: הרחבת אגני הכליה (הידרונפרוזיס). השתן לא מתנקז החוצה.', 'כאן הסיבה היא ערמונית מוגדלת שחוסמת את מוצא השלפוחית (חסימה יכולה לנבוע גם מאבן או מגידול).'] },
  ckd: { key: ['CREA', 'UREA', 'EGFR', 'HCO3', 'Hb', 'CA', 'PHOS', 'PTH'], pts: ['קצב סינון נמוך לאורך זמן, עם אשלגן גבוה וחמצת.', 'אנמיה (חוסר EPO), סידן נמוך, זרחן גבוה ו-PTH גבוה (חוסר ויטמין D פעיל): סימנים לפגיעה ממושכת.', 'כליות מצומקות באולטרסאונד: ממצא ייחודי לאי-ספיקה כרונית.'] },
  diabetic: { key: ['GLU', 'UPCR', 'CREA', 'EGFR'], pts: ['גלוקוז גבוה בדם, וגלוקוז בשתן.', 'חלבון בשתן (יחס חלבון/קריאטינין גבוה): נזק מוקדם לגלומרולוס מסוכרת.', 'קצב הסינון עדיין כמעט תקין: הנזק בשלב מוקדם, ולכן חשוב לאזן.'] },
  cystitis: { key: ['WBC', 'CRP', 'CREA', 'EGFR'], pts: ['בשתן: תאי דם לבנים וניטריט חיובי (חיידקים), לעיתים גם דם.', 'ספירת הדם הלבנה וה-CRP תקינות או כמעט: הדלקת מקומית בשלפוחית.', 'קריאטינין וקצב סינון תקינים: הכליות לא נפגעו.'] },
  pyelo: { key: ['WBC', 'CRP', 'CREA', 'EGFR'], pts: ['בשתן: תאי דם לבנים וניטריט חיובי.', 'ספירת דם לבנה ו-CRP גבוהות: זיהום שמערב את הכליה וגורם לתגובה בכל הגוף.', 'הקריאטינין תקין או כמעט, אבל חשוב לטפל מהר כדי למנוע נזק לכליה.'] },
  stone: { key: ['URIC', 'CA', 'CREA', 'EGFR'], pts: ['דם בשתן (המטוריה) וללא חיידקים (ניטריט שלילי).', 'באולטרסאונד: אבן בשופכן והרחבה קלה של האגן.', 'הקריאטינין תקין כי הכליה השנייה מסננת היטב. חסימה ממושכת או זיהום מסכנות את הכליה.'] },
  di: { key: ['NA', 'USG', 'CREA'], pts: ['נתרן גבוה בדם: איבוד מים בלי איבוד מלח.', 'שתן מדולל מאוד בנפח גדול (משקל סגולי נמוך מאוד): הצינור המאסף לא מקבל אות ADH לספוג מים.', 'קריאטינין תקין: הכליה עצמה בריאה, והבעיה בהורמון ADH.'] },
};
const NEXT_OK = { prerenal: ['urine'], renal_aki: ['urine', 'us'], postrenal: ['us'], ckd: ['us', 'bone'], diabetic: ['sugar', 'urine'], cystitis: ['urine'], pyelo: ['infl', 'urine'], stone: ['us', 'urine'], di: ['urine'] };
const NEXT_OPTS = { urine: 'בדיקת שתן: סטיק, משקל סגולי ונפח שתן', us: 'אולטרסאונד כליות ודרכי השתן', bone: 'המוגלובין, סידן, זרחן ו-PTH', infl: 'ספירת דם לבנה ו-CRP', sugar: 'גלוקוז בדם וחלבון בשתן' };
const NEXT_WHY = {
  urine: 'מבדילה בין שתן מרוכז (פרה-רנלי) ללא מרוכז, וחושפת דם, חלבון, גלוקוז ודלקת.',
  us: 'מראה חסימה והרחבת אגנים, אבנים וגודל הכליות (מצומקות בכרונית).',
  bone: 'מתאימה כשחושדים בפגיעה כלייתית ממושכת: אנמיה ושינויים במינרלים.',
  infl: 'מתאימה כשיש חשד לזיהום עם חום.',
  sugar: 'מתאימה כשיש סוכרת או חשד לפגיעה מוקדמת בגלומרולוס.',
};
const DXOPT_B = k => `${NT[k].ic} ${NT[k].n}`;

function makePatientB(type, edge) { const p = genNeph(type, Math.random, { edge }); p.sid = 1000 + Math.floor(Math.random() * 9000); return p; }
function patientLineB(p) { return `${p.sex === 'F' ? 'אישה' : 'גבר'} בת/בן ${p.age}`.replace('בת/בן', p.sex === 'F' ? 'בת' : 'בן') + ` · תלונה: ${p.complaint}`; }
function resetLabNote() { _labNoteShown = false; }
function panelCard(p, kind, bodyHTML, title) {
  const tb = PANEL_TUBE[kind], img = ART[tb] ? `<img src="${ART[tb]}" alt="">` : `<span style="font-size:1.6rem">${TUBE_EMOJI[tb]}</span>`;
  p.sid = p.sid || (1000 + Math.floor(Math.random() * 9000));
  return `<div class="card flat labform"><div class="lf-head">${img}<div><h3 style="margin:0">${title || PANEL_TITLE[kind]}</h3><div class="small muted">🏥 מעבדה מרכזית · ${TUBE_NAME[tb]} · דגימה ${p.sid}</div></div></div>${bodyHTML}</div>`;
}
const chemCard = (p, kind, hl = []) => panelCard(p, kind, labRows(PANEL_ITEMS[kind], p.vals, p.sex, hl));
function urineBody(p, hl = []) {
  const d = p.dip, row = (n, v, bad) => `<tr class="${bad ? 'abnH' : ''}"><td>${n}</td><td class="v ${bad ? 'H' : ''}">${v}</td></tr>`;
  return labRows(['USG', 'UPCR'], p.vals, p.sex, hl) +
    `<table class="lab"><thead><tr><th>סטיק שתן</th><th>תוצאה</th></tr></thead><tbody>${row('תאי דם לבנים (לויקוציטים)', DIP_LVL[d.leuk], d.leuk >= 2)}${row('ניטריט', d.nit ? 'חיובי' : 'שלילי', d.nit)}${row('דם', DIP_LVL[d.blood], d.blood >= 2)}${row('חלבון', DIP_LVL[d.prot], d.prot >= 2)}${row('גלוקוז', DIP_LVL[d.glu], d.glu >= 2)}</tbody></table>` +
    `<p class="small" style="margin:8px 0 0">נפח שתן ב-24 שעות: <b>${p.uvol}</b> מ"ל ${p.uvol < 400 ? '(<b>אוליגוריה</b>: מתחת ל-400 מ"ל ליום)' : p.uvol > 3000 ? '(<b>שתן מרובה</b>)' : ''}</p>`;
}
const urineCard = (p, hl) => panelCard(p, 'urine', urineBody(p, hl));
const usCard = p => panelCard(p, 'us', `<p style="margin:0">${US_TXT[p.us]}</p>`, 'אולטרסאונד כליות ודרכי השתן');
function allPanels(p, hl = []) { resetLabNote(); return chemCard(p, 'chem', hl) + chemCard(p, 'min', hl) + chemCard(p, 'cbc', hl) + chemCard(p, 'gluc', hl) + urineCard(p, hl) + usCard(p); }

function feedbackDxB(p, chosen) {
  const right = chosen === p.type, info = INFO[p.type];
  let h = `<div class="explain ${right ? 'good' : 'bad'}">${right ? '✅ נכון! ' : `🤔 לא בדיוק. זו ${NT[p.type].n}. `}`;
  if (!right) h += `<br><b>${NT[chosen].s}</b> מאופיינת ב: ${KEYF[chosen].t}.`;
  h += `<br><b>מה מצביע על כך כאן:</b></div><div class="card flat" style="padding:10px;margin-top:8px">${(resetLabNote(), labRows(info.key, p.vals, p.sex, info.key))}<ul style="padding-inline-start:20px;margin:10px 0 0">${info.pts.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  return h;
}
function keyFindQ(p) {
  const others = shuffle(NTYPES.filter(k => k !== p.type && !KEYF[k].ok(p))).slice(0, 3);
  return { q: 'איזה ממצא הכריע לטובת האבחנה?', tag: 'diag_key', options: [{ t: KEYF[p.type].t, ok: true }].concat(others.map(k => ({ t: KEYF[k].t, ok: false, why: `זה הממצא האופייני ל${NT[k].s}, ולא מה שרואים כאן.` }))) };
}

/* מריץ סבב מטופלים: mode 1|2|3 */
function runLabRounds(root, ctx, mode, types) {
  const edge = mode === 2; let i = 0; const scores = types.map(() => null), pats = [];
  const sumScore = () => scores.reduce((a, b) => a + (b || 0), 0);
  const host = el('<div></div>'); root.appendChild(host);
  function patientRound() {
    if (i >= types.length) {
      const per = scores.filter(x => x != null && x >= .999).length, rk = diagRank(per, types.length); ctx.rank = rk;
      const extra = `<div class="card"><table class="lab"><thead><tr><th>מטופל</th><th>אבחנה</th><th>ניקוד</th></tr></thead><tbody>${types.map((t, k) => `<tr><td>${k + 1}</td><td>${NT[t].ic} ${NT[t].s}</td><td class="v">${Math.round(100 * (scores[k] || 0))}%</td></tr>`).join('')}</tbody></table><button class="btn block" id="sharebtn" style="margin-top:12px">📤 שליחת התוצאות למורה</button></div>`;
      ctx.finish(Math.round(100 * sumScore() / types.length), rankCard(rk, per, types.length) + extra);
      const sb = $('#sharebtn', root); if (sb) sb.onclick = shareResultsModal; return;
    }
    const type = types[i], p = pats[i] || (pats[i] = makePatientB(type, edge)); host.innerHTML = '';
    const answeredN = scores.filter(x => x != null).length;
    const head = el(`<div><div class="row sp small muted"><span>מטופל ${i + 1} מתוך ${types.length}</span><span>⭐ ${Math.round(sumScore() * 10) / 10}</span></div><div class="bar" style="margin:8px 0"><i style="width:${100 * answeredN / types.length}%"></i></div></div>`);
    head.appendChild(jumpBar(types.length, i, scores.map(x => x != null), j => { i = j; patientRound(); window.scrollTo(0, 0); }));
    const who = el(`<div class="card"><div class="patient-head"><div class="avatar">${p.sex === 'F' ? '👩' : '👨'}</div><div><h3 style="margin:0">תוצאות בדיקות</h3><div class="muted">${patientLineB(p)}</div></div></div></div>`);
    host.append(head, who);
    if (IS_TEACHER) who.insertAdjacentHTML('beforeend', `<div class="tnote"><b>מפתח:</b> ${NT[type].n}. ${INFO[type].pts[0]}</div>`);
    const labs = el('<div></div>'); host.appendChild(labs);
    const q = el('<div class="card"></div>'); host.appendChild(q);
    const fb = el('<div></div>'); host.appendChild(fb);
    const finish = pts => {
      if (scores[i] == null) scores[i] = pts;
      const left = types.map((_, k) => k).filter(k => scores[k] == null), nxt = left.find(k => k > i), last = left.length === 0;
      const sm = el(`<div class="card" style="margin-top:12px"><div class="row sp"><b>${pts >= .999 ? 'מטופל מושלם! 🌟' : 'סיימתם את המטופל'}</b><span>${Math.round(pts * 100)}%</span></div>${pts >= .999 ? expertCard('great') : ''}<button class="btn primary block" id="nx" style="margin-top:10px">${last ? 'לסיכום 🏁' : 'המטופל הבא ←'}</button></div>`);
      fb.appendChild(sm); sm.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      $('#nx', sm).onclick = () => { i = last ? types.length : (nxt != null ? nxt : left[0]); patientRound(); window.scrollTo(0, 0); };
    };
    /* שאלת האבחנה, ואז הממצא המכריע. w = משקל האבחנה, wk = משקל הממצא, base = נקודות שכבר נצברו */
    function dxStep(box, label, w, wk, base) {
      const opts = NTYPES.map(k => ({ t: DXOPT_B(k), ok: k === p.type, tag: NT[k].tag, _k: k }));
      mcq(box, { q: label, tag: NT[p.type].tag, options: opts, onDone: (ok, o) => {
        fb.innerHTML = feedbackDxB(p, o._k);
        if (ok) {
          const q2 = el('<div class="card" style="margin-top:10px"></div>'); fb.appendChild(q2);
          mcq(q2, { ...keyFindQ(p), onDone: ok2 => finish(base + w + wk * (ok2 ? 1 : 0)) });
        } else finish(base);
      } });
    }
    if (mode === 1) {
      labs.innerHTML = allPanels(p);
      mcq(q, { q: 'שלב 1: לפי הקריאטינין וה-eGFR, האם הסינון בכליות פגוע?', tag: 'gfr', options: [
        { t: 'כן, הסינון ירוד (eGFR מתחת ל-60)', ok: p.vals.EGFR < 60, why: `eGFR ${p.vals.EGFR} (תקין מעל 90). הקריאטינין עולה כשהסינון יורד.` },
        { t: 'לא, הסינון תקין או כמעט תקין (eGFR 60 ומעלה)', ok: p.vals.EGFR >= 60, why: `eGFR ${p.vals.EGFR}.` }],
        onDone: () => { const box = el('<div style="margin-top:14px"></div>'); q.appendChild(box); dxStep(box, 'שלב 2: מהי האבחנה?', .7, .3, 0); } });
    } else if (mode === 2) {
      labs.innerHTML = allPanels(p);
      q.insertAdjacentHTML('afterbegin', '<div class="explain" style="margin-bottom:12px">⚠️ רמת קושי מתקדמת: הערכים קרובים לגבולות. קראו את כל הדפוס ואל תסתמכו על מדד אחד: לעיתים השתן או האולטרסאונד הם שמכריעים.</div>');
      dxStep(q, 'מהי האבחנה?', .7, .3, 0);
    } else {
      resetLabNote(); labs.innerHTML = chemCard(p, 'basic');
      const ok = NEXT_OK[type];
      mcq(q, { q: 'מה הבדיקה הבאה שתבקשו: זו שתקדם הכי הרבה את האבחנה?', tag: 'next_test', options: Object.keys(NEXT_OPTS).map(k => ({ t: NEXT_OPTS[k], ok: ok.includes(k), why: NEXT_WHY[k], _k: k })), onDone: (okN, o) => {
        const best = ok[0];
        const show = k => k === 'urine' ? urineCard(p, ['USG']) : k === 'us' ? usCard(p) : k === 'bone' ? (resetLabNote(), panelCard(p, 'min', labRows(['Hb', 'CA', 'PHOS', 'PTH'], p.vals, p.sex), 'המוגלובין, סידן, זרחן ו-PTH')) : k === 'infl' ? (resetLabNote(), panelCard(p, 'cbc', labRows(['WBC', 'CRP'], p.vals, p.sex), 'ספירת דם לבנה ו-CRP')) : (resetLabNote(), panelCard(p, 'gluc', labRows(['GLU', 'UPCR'], p.vals, p.sex), 'גלוקוז בדם וחלבון בשתן'));
        let rev = okN ? '' : `<div class="explain bad">הבדיקה שתועיל הכי הרבה כאן: <b>${NEXT_OPTS[best]}</b></div>`;
        rev += show(o._k); if (!okN) rev += show(best);
        labs.insertAdjacentHTML('beforeend', rev);
        const q2 = el('<div class="card" style="margin-top:10px"></div>'); host.insertBefore(q2, fb);
        dxStep(q2, 'ועכשיו: מהי האבחנה?', .6, .2, okN ? .2 : 0);
      } });
    }
  }
  patientRound();
}
function labTypes(n = 8) { return shuffle(shuffle(NTYPES).slice(0, n)); }
registerGame({ id: 'b_l1', part: 'B', learned: [
    'קריאטינין ואוריאה גבוהים עם eGFR נמוך מצביעים על ירידה בסינון הכלייתי.',
    'משקל סגולי גבוה בשתן מצביע על כליה שמרכזת (פרה-רנלי), ומשקל סגולי נמוך סביב 1.010 על צינוריות פגועות או כליה כרונית.',
    'אולטרסאונד מבדיל בין חסימה (הרחבת אגנים), כרונית (כליות מצומקות) ופגיעה חריפה בלי חסימה.',
  ], icon: '🧪', title: 'רמה 1: הבדיקות מול העיניים', desc: 'כל הבדיקות, ממצאים קלאסיים, ואולטרסאונד. 8 מטופלים.',
  teacherNote: 'כל מטופל נוצר אקראית מ-9 אבחנות. שלב 1: האם הסינון פגוע (eGFR מתחת ל-60). שלב 2: האבחנה. שלב 3: הממצא המכריע. הערכים להמחשה, והם משתנים בין מעבדות.',
  mount(root, ctx) { root.insertAdjacentHTML('afterbegin', say('קיבלתי תוצאות בדיקות דם ושתן… ועכשיו אתם הרופאים. התחילו מהקריאטינין וה-eGFR: האם הכליות מסננות?', 'think')); runLabRounds(root, ctx, 1, labTypes(8)); } });
registerGame({ id: 'b_l2', part: 'B', learned: [
    'ערכים בגבול דורשים קריאת דפוס שלם ולא מדד בודד.',
    'פרה-רנלי מול רנלי: שתן מרוכז מצביע על פרה-רנלי, שתן לא מרוכז על נזק לצינוריות.',
    'דלקת בשלפוחית מול דלקת באגן הכליה: ספירת דם לבנה ו-CRP גבוהות מצביעות על מעורבות הכליה.',
  ], icon: '⚖️', title: 'רמה 2: ערכים בגבולות', desc: 'דפוסים גבוליים וקשים יותר. 8 מטופלים.',
  teacherNote: 'ערכי קצה: eGFR מעט מתחת ל-60, משקל סגולי בין 1.020 ל-1.025, ספירת דם לבנה על הגבול. תמיד יש ממצא אחד שמכריע (שתן, אולטרסאונד או CRP).',
  mount(root, ctx) { root.insertAdjacentHTML('afterbegin', say('עכשיו זה לא כל כך ברור… הערכים בגבול. קראו את כל הדפוס ואל תסתמכו על מדד אחד.', 'wink')); runLabRounds(root, ctx, 2, labTypes(8)); } });
registerGame({ id: 'b_l3', part: 'B', learned: [
    'רופא טוב לא מזמין הכול: הוא בוחר את הבדיקה שמקדמת את האבחנה לפי התלונה והבדיקות הראשונות.',
    'חשד לחסימה מוביל לאולטרסאונד, חשד לפרה-רנלי או לזיהום מוביל לבדיקת שתן, וחשד לסוכרת מוביל לגלוקוז וחלבון בשתן.',
    'חשד לאי-ספיקה כרונית מוביל להמוגלובין ולמינרלים (סידן, זרחן, PTH) ולאולטרסאונד.',
  ], icon: '🧭', title: 'רמה 3: מה הבדיקה הבאה?', desc: 'מקבלים בדיקות בסיס ותלונה: בחרו את הבדיקה הבאה ואז אבחנו. 7 מטופלים.',
  teacherNote: 'מכל מטופל מוצגות רק בדיקות הבסיס. לכל אבחנה מוגדרת רשימת בדיקות שמקדמות אותה (יכולות להיות כמה). אחרי הבחירה נחשף הסבר ותוצאת הבדיקה, ואז האבחנה.',
  mount(root, ctx) { root.insertAdjacentHTML('afterbegin', say('רופא טוב לא מזמין הכול: הוא מזמין חכם. התחילו מהבדיקות הראשונות והתלונה, ובחרו את הצעד הבא.', 'happy')); runLabRounds(root, ctx, 3, labTypes(7)); } });

/* ===== צד מורה: חלק ב׳ ===== */
function teacherLabView(g, body) {
  const mode = { b_l1: 1, b_l2: 2, b_l3: 3 }[g.id] || 1, edge = mode === 2, n = mode === 3 ? 7 : 8;
  const types = labTypes(n), pats = []; let cur = 0;
  const host = el('<div></div>'); body.appendChild(host);
  function render() {
    host.innerHTML = '';
    host.appendChild(jumpBar(types.length, cur, [], j => { cur = j; render(); window.scrollTo(0, 0); }));
    const type = types[cur], p = pats[cur] || (pats[cur] = makePatientB(type, edge)), info = INFO[type], nx = NEXT_OK[type];
    resetLabNote();
    let h = `<div class="card"><div class="patient-head"><div class="avatar">${p.sex === 'F' ? '👩' : '👨'}</div><div><h3 style="margin:0">מטופל ${cur + 1} מתוך ${types.length}: ${NT[type].s}</h3><div class="muted">${patientLineB(p)}</div></div></div></div>`;
    h += mode === 3 ? chemCard(p, 'basic') + `<div class="card flat" style="padding:12px;margin-top:8px"><div class="q">הבדיקה הבאה הנכונה</div>${nx.map(k => `<div class="explain good" style="margin:6px 0">✅ <b>${NEXT_OPTS[k]}</b><div class="small">${NEXT_WHY[k]}</div></div>`).join('')}</div>` : '';
    if (mode !== 3) h += allPanels(p, info.key);
    if (mode === 1) h += `<div class="card flat" style="padding:12px;margin-top:8px"><div class="q">שלב 1: האם הסינון פגוע?</div><div class="explain good" style="margin:6px 0">✅ <b>${p.vals.EGFR < 60 ? 'כן, eGFR מתחת ל-60' : 'לא, eGFR 60 ומעלה'}</b><div class="small">eGFR ${p.vals.EGFR}</div></div></div>`;
    h += `<div class="card flat" style="padding:12px;margin-top:8px"><div class="q">האבחנה</div><div class="explain good" style="margin:6px 0">✅ <b>${DXOPT_B(type)}</b></div><b class="small">הממצא המכריע:</b> ${KEYF[type].t}<ul class="small" style="padding-inline-start:20px;margin:8px 0 0">${info.pts.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    h += `<button class="btn block" id="newp" style="margin-top:10px">🔄 מטופל חדש במקום זה</button>`;
    host.insertAdjacentHTML('beforeend', h);
    $('#newp', host).onclick = () => { pats[cur] = null; render(); };
  }
  render();
}
function keyPartB() {
  const r = mulberry32(2026);
  let h = `<h2>🧪 חלק ב׳: אבחון מבדיקות מעבדה</h2><p class="small muted">המטופלים נוצרים אקראית בכל פעם, ולכן אין רשימת תשובות קבועה. להלן כל אחת מ-9 האבחנות, הדפוס שלה ומטופל לדוגמה. בבדיקת תקינות על 2,000 מטופלים לכל אבחנה (קלאסי וגבולי) האבחנה היחידה העולה מהערכים הייתה תמיד הנכונה. הערכים להמחשה והם משתנים בין מעבדות.</p>`;
  NTYPES.forEach(t => {
    const p = genNeph(t, r, {}); p.sid = 4242; resetLabNote();
    h += `<div class="card"><h3>${NT[t].ic} ${NT[t].n}</h3><p class="small"><b>הממצא המכריע:</b> ${KEYF[t].t}</p><ul class="small">${INFO[t].pts.map(x => `<li>${x}</li>`).join('')}</ul><p class="small muted">בדיקות מקדמות (רמה 3): ${NEXT_OK[t].map(k => NEXT_OPTS[k]).join(' או ')}</p><details><summary class="small"><b>מטופל לדוגמה</b></summary>${labRows(INFO[t].key, p.vals, p.sex, INFO[t].key)}<p class="small">${p.sex === 'F' ? 'אישה' : 'גבר'} בת/בן ${p.age} · ${p.complaint}</p></details></div>`;
  });
  return h;
}
