// ממיר את האיורים החדשים מתיקיית "איורים לנפרו" ל-WebP בתיקיית art (דורש ffmpeg)
// שימוש: node tools/convert_art.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(root, '..', 'איורים לנפרו');
// [קובץ מקור (תחילית), שם ב-art, רוחב מרבי]
const MAP = [
  ['466648a5', 'aki_post', 760], ['9996fa91', 'aki_renal', 760], ['b2a16d8e', 'aki_pre', 760], ['08e1583a', 'aki_zones', 760],
  ['גיף לנזקי כליה', 'body_ckd', 800],
  ['c9b3fae1', 'us_bladder_prostate', 900], ['bc2a3a39', 'us_stone', 900], ['b2a769dd', 'us_hydro', 900], ['9db6be40', 'us_normal', 900],
  ['us_atrophic', 'us_atrophic', 900], ['us_hydro_mild', 'us_hydro_mild', 900],
  ['29ab22be', 'diur_loop', 760], ['c53f8473', 'diur_dct', 760], ['eac7ea14', 'diur_cd', 760],
  ['eacc5902', 'nephron_real', 760],
];
const files = fs.readdirSync(src);
for (const [pre, name, w] of MAP) {
  const f = files.find(x => x.startsWith(pre));
  if (!f) { console.log('חסר:', pre); continue; }
  const out = path.join(root, 'art', name + '.webp');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(src, f), '-vf', `scale='min(${w},iw)':-2`, '-quality', '82', out]);
  console.log(name, Math.round(fs.statSync(out).size / 1024) + ' KB');
}
