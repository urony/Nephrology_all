// בדיקת תקינות למחולל המעבדה: לכל אבחנה, N מטופלים בשני מצבים (קלאסי וגבולי).
// בודקים: (1) המסווג מחזיר את האבחנה הנכונה, (2) ה-eGFR המוצג עקבי לקריאטינין, (3) הממצא המכריע
// נכון רק לאבחנה שלו (כדי שבשאלת "מה הממצא שהכריע" לא יהיו שתי תשובות נכונות).
// הרצה:  node tools/validate_labs.mjs [N]     (ברירת מחדל 2000)
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = +process.argv[2] || 2000;
const ctx = { URLSearchParams, Math, JSON, Object, Array, Date, Number, String, Set, Map, Promise, Error, location: { search: '', hash: '' }, document: { addEventListener() { }, head: { appendChild() { } }, body: { appendChild() { }, classList: { toggle() { } } }, documentElement: { dataset: {} }, createElement() { return { content: {}, style: {} }; } }, window: {}, localStorage: { getItem() { return null; }, setItem() { } }, navigator: {}, console };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['core.js', 'data.js', 'labgen.js']) {
  const src = fs.readFileSync(path.join(root, 'src', f), 'utf8');
  vm.runInContext(src + '\n;' + (f === 'labgen.js' ? 'this.__x={NTYPES,NT,genNeph,classifyNeph,KEYF,mulberry32,calcEgfr};' : ''), ctx, { filename: f });
}
const { NTYPES, NT, genNeph, classifyNeph, KEYF, mulberry32, calcEgfr } = ctx.__x;
let bad = 0; const rows = [];
for (const mode of [false, true]) {
  const r = mulberry32(mode ? 777 : 123);
  for (const t of NTYPES) {
    let ok = 0, egfrBad = 0, keyBad = 0, uniq = 0; const miss = {};
    for (let i = 0; i < N; i++) {
      const p = genNeph(t, r, { edge: mode });
      const c = classifyNeph(p); if (c === t) ok++; else miss[c] = (miss[c] || 0) + 1;
      if (calcEgfr(p.vals.CREA, p.age, p.sex) !== p.vals.EGFR) egfrBad++;
      if (!KEYF[t].ok(p)) keyBad++;
      const others = NTYPES.filter(o => o !== t && KEYF[o].ok(p)).length; if (others === 0) uniq++;
    }
    rows.push({ מצב: mode ? 'גבולי' : 'קלאסי', אבחנה: t, מטופלים: N, 'סיווג נכון': (100 * ok / N).toFixed(2) + '%', 'eGFR לא עקבי': egfrBad, 'ממצא מכריע שגוי': keyBad, 'ממצא ייחודי': (100 * uniq / N).toFixed(2) + '%', טעויות: JSON.stringify(miss) });
    if (ok !== N || egfrBad || keyBad || uniq !== N) bad++;
  }
}
console.table(rows);
console.log(bad ? `נמצאו ${bad} שורות עם בעיה` : `הכול תקין: ${N} מטופלים × ${NTYPES.length} אבחנות × 2 מצבים`);
process.exit(bad ? 1 : 0);
