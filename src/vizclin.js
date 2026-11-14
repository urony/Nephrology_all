'use strict';
/* ===== איורים סכמטיים לחלקים ב׳ ו-ג׳: אולטרסאונד כליות ואק"ג ===== */
/* תמונות אולטרסאונד סכמטיות-ריאליסטיות (art/us_*); אם חסרות, חוזרים לסכמה הישנה */
function usImg(src, cap) { return `<figure class="fig" style="margin:6px 0"><img class="zoomable" loading="lazy" src="${src}" alt="${esc(cap)}" style="width:100%;border-radius:12px;background:#000"><figcaption class="small muted" style="text-align:center">${esc(cap)} · לחיצה להגדלה</figcaption></figure>`; }
function usSvg(kind) {
  const M = { normal: [['us_normal', 'כליה תקינה']], small: [['us_atrophic', 'כליה מצומקת וקטנה, בהירה, ליד כבד גדול להשוואה']], hydro: [['us_hydro', 'הרחבת האגן והכוסיות (הידרונפרוזיס): הנוזל נראה שחור'], ['us_bladder_prostate', 'שלפוחית מלאה (שחורה) וערמונית מוגדלת מתחתיה']], stone: [['us_hydro_mild', 'הרחבה קלה של האגן בצד אחד'], ['us_stone', 'לדוגמה: אבן נראית כנקודה לבנה בהירה עם צל כהה מתחתיה']] }[kind];
  if (M && M.every(m => ART[m[0]])) return M.map(m => usImg(ART[m[0]], m[1])).join('');
  return usSvgOld(kind);
}
function usSvgOld(kind) {
  const kid = (cx, sc, col, pelvis, dark) => `<g transform="translate(${cx},70) scale(${sc})">
      <path d="M-26 -42 C-48 -38 -52 8 -40 34 C-30 56 8 56 20 34 C34 8 26 -40 -26 -42 Z" fill="${col}" stroke="${dark}" stroke-width="2.2"/>
      <ellipse cx="-4" cy="0" rx="${pelvis.rx}" ry="${pelvis.ry}" fill="${pelvis.fill}" stroke="${pelvis.stroke}" stroke-width="1.6"/></g>`;
  const norm = { rx: 7, ry: 11, fill: '#f2c9a6', stroke: '#c99066' }, hyd = { rx: 17, ry: 24, fill: '#a9d8f0', stroke: '#5aa6cc' }, mild = { rx: 11, ry: 16, fill: '#bfe0f2', stroke: '#5aa6cc' };
  const S = {
    normal: kid(95, 1, '#d98d80', norm, '#8a4a40') + kid(265, 1, '#d98d80', norm, '#8a4a40'),
    small: kid(95, .62, '#a9665c', norm, '#6b3a32') + kid(265, .62, '#a9665c', norm, '#6b3a32'),
    hydro: kid(95, 1, '#d98d80', hyd, '#8a4a40') + kid(265, 1, '#d98d80', hyd, '#8a4a40'),
    stone: kid(95, 1, '#d98d80', norm, '#8a4a40') + kid(265, 1, '#d98d80', mild, '#8a4a40') + '<path d="M268 120 Q268 150 262 170" stroke="#e6b94c" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="263" cy="158" r="7" fill="#6b5a4a" stroke="#fff" stroke-width="2"/><text x="285" y="162" class="av-s" style="font-weight:800;font-size:10px" text-anchor="start">אבן</text>',
  };
  const cap = { normal: 'כליות תקינות', small: 'כליות מצומקות', hydro: 'אגנים מורחבים', stone: 'אבן בשופכן' }[kind] || '';
  return `<svg class="dia-svg" viewBox="0 0 360 190" role="img" aria-label="איור סכמטי של אולטרסאונד כליות: ${cap}" style="max-width:380px">
    <rect x="3" y="3" width="354" height="184" rx="12" fill="#1c2733"/>
    <g opacity=".95">${S[kind] || S.normal}</g>
    <text x="180" y="182" class="av-s" style="fill:#cfe3f3;font-size:10px">איור סכמטי: ${cap}</text>
  </svg>`;
}
function ecgSvg(level) {
  const base = 60, beat = t => {
    const q = level === 'wide' ? 'l6 5 l10 -40 l10 48 l6 -13' : 'l3 5 l5 -40 l5 48 l3 -13';
    const tw = level === 'normal' ? 'h12 q10 -16 20 0 h8' : (level === 'wide' ? 'h10 l6 -42 l6 42 h8' : 'h14 l5 -42 l5 42 h8');
    return `h8 q5 -9 10 0 h8 ${q} ${tw}`;
  };
  const path = 'M4 ' + base + ' ' + [0, 1, 2, 3].map(beat).join(' ');
  const cap = level === 'normal' ? 'א.ק.ג תקין' : level === 'wide' ? 'גלי T גבוהים וחדים, ו-QRS רחב' : 'גלי T גבוהים וחדים';
  return `<svg class="dia-svg" viewBox="0 0 360 110" role="img" aria-label="איור סכמטי של א.ק.ג: ${cap}" style="max-width:380px">
    <rect x="3" y="3" width="354" height="104" rx="10" fill="#fff6f6" stroke="#f0c9c9"/>
    ${Array.from({ length: 18 }, (_, i) => `<path d="M${4 + i * 20} 8 V102" stroke="#f3d6d6" stroke-width="1"/>`).join('')}${Array.from({ length: 5 }, (_, i) => `<path d="M4 ${10 + i * 20} H356" stroke="#f3d6d6" stroke-width="1"/>`).join('')}
    <path d="${path}" fill="none" stroke="${level === 'normal' ? '#2f8f55' : '#d9534f'}" stroke-width="2.2" stroke-linejoin="round"/>
    <text x="180" y="102" class="av-s" style="font-size:10px">איור סכמטי: ${cap}</text>
  </svg>`;
}
