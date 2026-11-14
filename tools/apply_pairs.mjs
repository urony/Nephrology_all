// מחליף ניסוחי תשובות במשחקים: node tools/apply_pairs.mjs pairs.json
// pairs.json = [["טקסט ישן","טקסט חדש"], ...]. מחליף רק בתוך OK('...') / NO('...') / t:'...'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const pairs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const files = fs.readdirSync(root).filter(f => f.endsWith('.js'));
const src = Object.fromEntries(files.map(f => [f, fs.readFileSync(path.join(root, f), 'utf8')]));
let miss = 0;
for (const [o, n] of pairs) {
  let cnt = 0;
  for (const f of files) {
    for (const pre of ["OK('", "NO('", "t: '", "O('"]) {
      const a = pre + o + "'", b = pre + n.replace(/'/g, "\\'") + "'";
      if (src[f].includes(a)) { cnt += src[f].split(a).length - 1; src[f] = src[f].split(a).join(b); }
    }
  }
  if (!cnt) { miss++; console.log('לא נמצא:', o); }
}
for (const f of files) fs.writeFileSync(path.join(root, f), src[f]);
console.log('הוחלפו', pairs.length - miss, 'מתוך', pairs.length);
