'use strict';
/* ===== חלק א׳: חזרה על מה שטעיתי + בחינה מסכמת (נבנים מהשאלות של שאר משחקי חלק א׳) ===== */
let _quizPool = null;
const isMeta = id => id === 'a_review' || id === 'a_exam' || id.startsWith('a_mix');
function quizPool(sec) {
  if (!sec && _quizPool) return _quizPool;
  const list = GAMES.filter(g => g.part === 'A' && !isMeta(g.id) && (!sec || g.sec === sec));
  const out = [], seen = new Set();
  collectKey(list).forEach(d => d.q.forEach(it => {
    if (!it || !it.options || it.options.length < 2 || it.options.filter(o => o.ok).length !== 1 || !it.q) return;
    if (seen.has(it.q)) return; seen.add(it.q); out.push(it);
  }));
  if (!sec) _quizPool = out; return out;
}

registerGame({
  id: 'a_review', part: 'A', sec: 'review', icon: '🔁', title: 'חזרה על מה שטעיתי', desc: 'חידון קצר שנבנה מהנושאים שבהם טעיתם',
  teacherNote: 'המשחק בוחר שאלות מהנושאים שהתלמיד טעה בהם הכי הרבה (לפי רישום הטעויות במכשיר שלו). אם עוד אין טעויות, מוצגות שאלות מעורבות.',
  learned: ['חזרה ממוקדת על הנקודות החלשות חוסכת זמן לימוד.', 'כל טעות היא מידע: היא מראה בדיוק איפה צריך לחזק.'],
  mount(root, ctx) {
    const pool = quizPool(), ptags = new Set(pool.map(q => q.tag)), mis = Object.entries(Store.d.mistakes).sort((a, b) => b[1] - a[1]).map(x => x[0]).filter(k => ptags.has(k)), top = mis.slice(0, 4);
    let items = shuffle(pool.filter(q => top.includes(q.tag))).slice(0, 8);
    if (items.length < 5) items = items.concat(shuffle(pool.filter(q => !items.includes(q))).slice(0, 6 - items.length));
    const msg = top.length ? `לפי הטעויות שלכם, נחזור על: <b>${top.map(k => TAGS[k] || k).join(', ')}</b>.` : 'עוד אין לכם טעויות רשומות (או שאתם פשוט מצוינים). הנה שאלות מעורבות לחזרה.';
    root.insertAdjacentHTML('afterbegin', say(msg, 'think'));
    runQuiz(root, ctx, items);
  },
});

registerGame({
  id: 'a_exam', part: 'A', sec: 'review', icon: '📝', title: 'מיני בחינה מסכמת', desc: 'עשר שאלות מעורבות מכל משחקי החלק. ציון, דירוג ותעודה',
  teacherNote: 'בחינה קצרה של 10 שאלות שנבחרות אקראית מכל שאלות חלק א׳. בסיום, תלמיד שציונו 70 ומעלה יכול להוריד תעודה.',
  learned: ['שאלות מכל נושאי החלק מראות מה כבר יושב ומה עדיין דורש חיזוק.', 'מי שציונו נמוך כדאי שישחק שוב את המשחק של הנושא וישוב לבחינה.'],
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('בחינה מסכמת! עשר שאלות מכל הנושאים. בהצלחה!', 'wink'));
    runQuiz(root, ctx, shuffle(quizPool()).slice(0, 10));
  },
});

/* תרגול רב-ברירה מעורב: לפי נושא, או מכל חלק א׳. אפשר לשלוח לתלמידים קישור ישיר, למשל #/g/a_mix_all */
const MIXES = [
  { id: 'a_mix_basics', sec: 'basics', icon: '🎯', title: 'תרגול מעורב: הבסיס', desc: 'שאלות רב-ברירה מעורבות על מבנה הכליה, הנפרון וסינון', n: 10 },
  { id: 'a_mix_balance', sec: 'balance', icon: '🎯', title: 'תרגול מעורב: ויסות ואיזון', desc: 'שאלות רב-ברירה מעורבות על ADH, RAAS, חומצה-בסיס והורמונים', n: 10 },
  { id: 'a_mix_disease', sec: 'disease', icon: '🎯', title: 'תרגול מעורב: מחלות וטיפולים', desc: 'שאלות רב-ברירה מעורבות על אי-ספיקה, אבנים, זיהומים ודיאליזה', n: 10 },
  { id: 'a_mix_all', sec: 'review', icon: '🎲', title: 'תרגול מעורב: הכול ביחד', desc: 'עשרים שאלות מעורבות מכל נושאי חלק א׳, בלי לדעת מראש מאיזה נושא', n: 20 },
];
MIXES.forEach(m => registerGame({
  id: m.id, part: 'A', sec: m.sec, icon: m.icon, title: m.title, desc: m.desc,
  teacherNote: 'חידון רב-ברירה שנבנה אקראית מכל השאלות של הנושא, בסדר שונה בכל כניסה. לתרגול חוזר ולשליחה לתלמידים בקישור ישיר.',
  learned: ['תרגול מעורב מחזק זיכרון לטווח ארוך יותר מתרגול נושא אחרי נושא.', 'שאלות בסדר לא צפוי מראות מה באמת יושב.'],
  mount(root, ctx) {
    root.insertAdjacentHTML('afterbegin', say('שאלות מעורבות, בלי לדעת מראש מאיזה נושא. הסדר והתשובות מתערבבים בכל פעם.', 'wink'));
    const pool = m.id === 'a_mix_all' ? quizPool() : quizPool(m.sec);
    runQuiz(root, ctx, shuffle(pool).slice(0, m.n));
  },
}));
