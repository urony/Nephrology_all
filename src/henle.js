'use strict';
/* ===== לולאת הנלה: מנגנון הזרם הנגדי, הלשד המלוח, והזרימה ההפוכה בשתי הזרועות ===== */
function henleSvg(S) {
  const pump = !S.diu, medMax = pump ? 1200 : 500, ascEnd = pump ? 100 : 400, urOsm = S.adh ? medMax : (pump ? 100 : 350);
  const c = osmColor;
  const arr = (x, y, dx, col, n, lbl) => Array.from({ length: n }, (_, i) => `<path d="M${x} ${y + i * 38} h${dx}" stroke="${col}" stroke-width="2.5" marker-end="url(#hm${col === '#169bcb' ? 'w' : 's'})"><animate attributeName="opacity" values=".3;1;.3" dur="${(1.1 + i * .2).toFixed(1)}s" repeatCount="indefinite"/></path>`).join('') + (lbl ? `<text x="${x + dx / 2}" y="${y - 6}" class="av-s" fill="${col}" style="font-weight:800">${lbl}</text>` : '');
  const bands = [0, 1, 2, 3, 4].map(i => { const v = 300 + (medMax - 300) * (i + .5) / 5; return `<rect x="0" y="${90 + i * 36}" width="360" height="36" fill="${c(v)}" opacity=".35"/>`; }).join('');
  return `<svg class="dia-svg" viewBox="0 0 360 300" role="img" aria-label="המחשה של לולאת הנלה: הזרוע היורדת, הזרוע העולה והצינור המאסף ושיפוע הריכוז בלשד">
    <defs><marker id="hmw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#169bcb"/></marker><marker id="hms" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#e08a1e"/></marker>
      <linearGradient id="hgd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c(300)}"/><stop offset="1" stop-color="${c(medMax)}"/></linearGradient>
      <linearGradient id="hga" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c(medMax)}"/><stop offset="1" stop-color="${c(ascEnd)}"/></linearGradient>
      <linearGradient id="hgc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c(ascEnd)}"/><stop offset="1" stop-color="${c(urOsm)}"/></linearGradient></defs>
    <rect x="4" y="4" width="352" height="292" rx="14" fill="#fdf6ef"/><rect x="0" y="86" width="360" height="190" fill="#f9e6d6" opacity=".6"/>${bands}
    <text x="10" y="22" class="av-s" text-anchor="start" style="font-weight:800">קליפה</text><text x="10" y="100" class="av-s" text-anchor="start" style="font-weight:800">לשד (פנימי = מלוח יותר)</text>
    <text x="10" y="270" class="av-s" text-anchor="start">${medMax}</text><text x="10" y="116" class="av-s" text-anchor="start">300</text>
    <path d="M110 40 V240 Q150 275 190 240 V40" fill="none" stroke="#7a8a97" stroke-width="22" stroke-linecap="round"/>
    <path d="M110 40 V240" fill="none" stroke="url(#hgd)" stroke-width="14"/><path d="M190 240 V40" fill="none" stroke="url(#hga)" stroke-width="14"/>
    <path d="M110 240 Q150 270 190 240" fill="none" stroke="${c(medMax)}" stroke-width="14"/>
    <path d="M262 40 V250" fill="none" stroke="#7a8a97" stroke-width="22" stroke-linecap="round"/><path d="M262 40 V250" fill="none" stroke="url(#hgc)" stroke-width="14"/>
    <text x="110" y="32" class="av-s" style="font-weight:800">⬇ יורדת</text><text x="190" y="32" class="av-s" style="font-weight:800">⬆ עולה</text><text x="262" y="32" class="av-s" style="font-weight:800">⬇ צינור מאסף</text>
    ${arr(76, 120, -26, '#169bcb', pump ? 4 : 2, '')}${arr(124, 120, -0, '#169bcb', 0, '')}
    <text x="48" y="108" class="av-s" fill="#1a77a3" style="font-weight:800">מים יוצאים</text>
    ${arr(197, 118, 28, '#e08a1e', pump ? 4 : 0, '')}<text x="224" y="108" class="av-s" fill="#b86a0a" style="font-weight:800">${pump ? 'מלחים יוצאים' : 'משאבה חסומה'}</text>
    ${arr(270, 130, 24, '#169bcb', S.adh ? 4 : 0, '')}<text x="316" y="118" class="av-s" fill="#1a77a3" style="font-weight:800">${S.adh ? 'מים יוצאים (ADH)' : 'בלי ADH: אטום'}</text>
    <text x="180" y="290" class="av-s" style="font-weight:800">שתן: ${urOsm} mOsm/L</text>
  </svg>`;
}
/* סימולטור מכפיל הזרם הנגדי של אורי (קובץ עצמאי) מוטמע במסגרת, עם גובה אוטומטי. כולל תרגול משלו */
function henleLabStage(box, done) {
  const host = el('<div class="card" style="padding:8px"></div>'); box.appendChild(host);
  host.innerHTML = '<p class="instr">מכפיל הזרם הנגדי: גלו איך נוצר מפל הריכוזים בלשד הכליה, נסו את הפקדים, ותרגלו את מה שלמדתם בסימולטור עצמו.</p>';
  const fr = document.createElement('iframe'); fr.className = 'gfr-frame'; fr.title = 'סימולטור מכפיל הזרם הנגדי בלולאת הנלה'; fr.setAttribute('scrolling', 'no'); fr.srcdoc = HENLE_LAB; host.appendChild(fr);
  const fit = () => { try { const d = fr.contentDocument; if (d && d.documentElement) fr.style.height = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight) + 'px'; } catch (e) { } };
  fr.onload = () => { fit(); try { new ResizeObserver(fit).observe(fr.contentDocument.body); } catch (e) { setInterval(fit, 700); } };
  const go = el('<button class="btn primary block" style="margin-top:10px">המשך להתאמה ושאלות ←</button>'); host.appendChild(go); go.onclick = () => done(null);
}
function henleSim(box, done) {
  const S = { adh: true, diu: false }, seen = new Set();
  const host = el('<div class="card"></div>'); box.appendChild(host);
  function draw() {
    const pump = !S.diu, urOsm = S.adh ? (pump ? 1200 : 500) : (pump ? 100 : 350);
    const vol = S.adh ? (pump ? 'מעט' : 'בינוני') : (pump ? 'הרבה' : 'הרבה מאוד');
    host.innerHTML = `<p class="instr">לולאת הנלה היא מעין צינור בצורת U. שימו לב: בזרוע אחת הנוזל יורד ובשנייה הוא עולה (זרימה נגדית). נסו את המתגים וראו מה קורה ללשד ולשתן.</p>
      ${henleSvg(S)}
      <div class="row" style="gap:8px;margin:10px 0"><button class="btn grow ${S.adh ? 'primary' : ''}" id="hs-a">${S.adh ? '✅' : '⬜'} יש ADH</button><button class="btn grow ${S.diu ? 'primary' : ''}" id="hs-d">${S.diu ? '✅' : '⬜'} משתן לולאה (למשל פוסיד)</button></div>
      <div class="out"><div><b>${urOsm}</b><span>ריכוז השתן (mOsm/L)</span></div><div><b>${vol}</b><span>נפח השתן</span></div></div>
      <div class="pg-info"><div>${S.diu ? 'משתן לולאה חוסם את משאבת הנתרן בזרוע העולה. בלי המשאבה המלחים לא יוצאים, הלשד לא נעשה מלוח, ואין מה שימשוך מים החוצה. לכן יוצא הרבה שתן.' : S.adh ? 'הזרוע היורדת חדירה למים: הם יוצאים אל הלשד המלוח והנוזל מתרכז. בזרוע העולה, שאטומה למים, המלחים יוצאים והנוזל מתדלל. המלחים האלה מחזקים את הלשד המלוח, וזה מאפשר ל-ADH לרכז את השתן בצינור המאסף.' : 'בלי ADH הצינור המאסף אטום למים, אז הלשד המלוח לא יכול למשוך מים החוצה. השתן נשאר מדולל ורב, אף על פי שהלשד מלוח.'}</div></div>
      <button class="btn primary block" id="hs-go" style="margin-top:12px" ${seen.size < 3 ? 'disabled' : ''}>${seen.size < 3 ? `לחצו על שני המתגים כדי להמשיך (${seen.size} מתוך 3)` : 'המשך ←'}</button>`;
    seen.add('base'); $('#hs-a', host).onclick = () => { S.adh = !S.adh; seen.add('a'); draw(); };
    $('#hs-d', host).onclick = () => { S.diu = !S.diu; seen.add('d'); draw(); };
    $('#hs-go', host).onclick = () => done(null);
  }
  draw();
}

registerGame({
  id: 'a_henle', part: 'A', sec: 'basics', icon: '🔃', title: 'לולאת הנלה: הזרם הנגדי', desc: 'למה הנוזל יורד בצד אחד ועולה בצד השני, ומה זה עושה ללשד',
  learned: [
    'הזרוע היורדת של לולאת הנלה חדירה למים ואינה מוציאה מלחים: המים יוצאים אל הלשד והנוזל מתרכז.',
    'הזרוע העולה אטומה למים ומוציאה מלחים בעזרת משאבה: הנוזל מתדלל, והלשד נעשה מלוח.',
    'הזרימה בשתי הזרועות הפוכה (זרם נגדי). כך נוצר שיפוע ריכוז בלשד, שמאפשר ל-ADH לרכז את השתן בצינור המאסף.',
    'משתני לולאה (כמו פוסיד) חוסמים את המשאבה בזרוע העולה, ולכן השתן רב ומדולל.'
  ],
  teacherNote: 'המשחק מתמקד בנקודה שמבלבלת הרבה תלמידים: הזרימה בשתי הזרועות הפוכה, ולכל זרוע תכונות שונות. הערכים (300 עד 1200 mOsm/L) הם ערכים מקובלים להמחשה. משתנים נלמדים בהקשר של סעיף הטיפול התרופתי.',
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('הלולאה היא חלק בנפרון שכולם מתבלבלים בו: למה הנוזל יורד, מסתובב ועולה? בואו נראה.', 'think'));
    runStages(root, ctx, [
      { title: 'הלולאה בפעולה', run: henleSim },
      { title: 'מכפיל הזרם הנגדי', run: henleLabStage },
      { title: 'התאמה', run: (box, done) => matchGame(box, { tag: 'henle', leftTitle: 'חלק', rightTitle: 'תכונה', pairs: [
        ['זרוע יורדת', 'חדירה למים, והם יוצאים אל הלשד'], ['זרוע עולה', 'אטומה למים, ומוציאה מלחים'], ['לשד כלייתי', 'מלוח יותר ככל שיורדים לעומק'], ['צינור מאסף', 'מים יוצאים ממנו רק בנוכחות ADH'],
      ], onDone: done }) },
      { title: 'שאלות', run: runQuizStage([
        Q('מה הכיוון של הזרימה בשתי הזרועות של לולאת הנלה?', 'henle', [OK('בזרוע אחת הנוזל יורד, ובשנייה הוא עולה', 'זה הזרם הנגדי: הנוזל נכנס בזרוע היורדת, מסתובב בתחתית ועולה בזרוע העולה.'), NO('בשתי הזרועות הנוזל יורד אל הלשד', 'הנוזל חייב לצאת מהלולאה, ולכן הוא חוזר ועולה.'), NO('בשתי הזרועות הנוזל עולה לקליפה', 'הנוזל נכנס ללולאה מהאבובית המקורבת ויורד תחילה.'), NO('הזרימה משתנה בכל שעה', 'הכיוון קבוע.')]),
        Q('איזו זרוע חדירה למים?', 'henle', [OK('הזרוע היורדת', 'המים יוצאים ממנה אל הלשד המלוח, והנוזל בתוכה מתרכז.'), NO('הזרוע העולה', 'הזרוע העולה אטומה למים, אבל מוציאה מלחים.'), NO('שתי הזרועות במידה שווה', 'לכל זרוע תכונות אחרות.'), NO('אף זרוע, המים נספגים רק באבובית המקורבת', 'רוב המים נספגים שם, אבל גם בזרוע היורדת מים יוצאים.')]),
        Q('מה קורה לריכוז הנוזל כשהוא עולה בזרוע העולה?', 'henle', [OK('הוא יורד, כי מלחים יוצאים והמים נשארים', 'הנוזל מתדלל, והמלחים שיצאו מחזקים את הלשד המלוח.'), NO('הוא עולה, כי המים יוצאים', 'המים יוצאים בזרוע היורדת, לא בעולה.'), NO('הוא נשאר זהה לאורך כל הלולאה', 'הריכוז משתנה: עולה בירידה ויורד בעלייה.'), NO('הוא הופך לשתן סופי', 'השתן הסופי נקבע רק בצינור המאסף.')]),
        Q('מדוע משתן לולאה (למשל פוסיד) גורם להרבה שתן?', 'henle', [OK('הוא חוסם יציאת מלחים בזרוע העולה', 'בלי מלחים שיוצאים, הלשד לא נעשה מלוח. אין מה שימשוך מים החוצה, והשתן רב.'), NO('הוא מגביר את ADH ומעלה את ספיגת המים', 'ADH היה מקטין את כמות השתן.'), NO('הוא חוסם את הסינון בפקעית ובקופסית באומן', 'הוא פועל על לולאת הנלה ולא על הפקעית.'), NO('הוא פותח תעלות מים בזרוע העולה של הלולאה', 'הזרוע העולה נשארת אטומה למים.')]),
      ]) },
    ]);
  },
});
