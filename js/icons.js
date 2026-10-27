// Icônes au trait (24 × 24), dessinées en SVG. « filled » remplit les formes fermées,
// pour montrer l'onglet actif.

const P = {
  book: ['M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z', 'M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z'],
  repeat: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
  star: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'],
  sliders: ['M20 7h-9', 'M14 17H5', 'C17 17 3', 'C7 7 3'],
  volume: ['M11 5 6 9H2v6h4l5 4z', 'M15.54 8.46a5 5 0 0 1 0 7.07', 'M19.07 4.93a10 10 0 0 1 0 14.14'],
  mute: ['M11 5 6 9H2v6h4l5 4z', 'M22 9l-6 6', 'M16 9l6 6'],
  message: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  back: ['M19 12H5', 'M12 19l-7-7 7-7'],
  chevron: ['M9 18l6-6-6-6'],
  lock: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  check: ['M20 6 9 17l-5-5'],
  x: ['M18 6 6 18', 'M6 6l12 12'],
  play: ['M6 3l14 9-14 9z'],
  pause: ['M6 4h4v16H6z', 'M14 4h4v16h-4z'],
  prev: ['M19 20 9 12l10-8z', 'M5 19V5'],
  next: ['M5 4l10 8-10 8z', 'M19 5v14'],
  mic: ['M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z', 'M19 10v1a7 7 0 0 1-14 0v-1', 'M12 18v4'],
  stop: ['M7 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z'],
  flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'],
  headphones: ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z', 'M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'],
  flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'],
  backspace: ['M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z', 'M18 9l-6 6', 'M12 9l6 6'],
};

// Formes fermées que l'on remplit quand l'icône est active.
const FILLABLE = new Set(['book', 'star', 'message', 'flame', 'play', 'pause', 'phone', 'volume', 'mute', 'stop', 'mic']);

export function ic(name, { filled = false, size = 24, cls = '' } = {}) {
  const parts = P[name] || [];
  const fill = filled && FILLABLE.has(name);
  const body = parts.map((d, i) => {
    if (d.startsWith('C')) {
      const [cx, cy, r] = d.slice(1).trim().split(' ');
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${filled ? 'currentColor' : 'none'}"/>`;
    }
    // Seule la première forme (le contour principal) se remplit.
    return `<path d="${d}" fill="${fill && i === 0 ? 'currentColor' : 'none'}"/>`;
  }).join('');
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="${filled ? 2 : 1.6}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

// Petits dessins au trait pour les écrans de fin.
export function drawing(kind) {
  const open = '<svg class="drawing" viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  if (kind === 'laurel') {
    // Couronne de laurier : des feuilles posées le long de deux arcs.
    const leaves = [];
    for (let side = -1; side <= 1; side += 2) {
      for (let k = 0; k < 7; k++) {
        const a = (200 + k * 22) * Math.PI / 180;
        const x = 80 + side * Math.cos(a) * -46;
        const y = 64 + Math.sin(a) * -46;
        const rot = side * (k * 22 + 20);
        leaves.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="11" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
      }
    }
    return `${open}${leaves.join('')}<path d="M80 110v-6"/><path d="M66 64l10 10 20-22"/></svg>`;
  }
  if (kind === 'path') {
    return `${open}<path d="M20 100h120"/><path d="M30 100l30-46 18 24 14-18 38 40"/><path d="M92 60v-22l16 6-16 6"/>
      <path d="M40 112c20-6 30-14 44-12s30 8 46 4" stroke-dasharray="3 5"/></svg>`;
  }
  // Livre ouvert, avec quelques traits de lumière.
  return `${open}<path d="M80 40c-14-8-34-10-50-6v58c16-4 36-2 50 6"/><path d="M80 40c14-8 34-10 50-6v58c-16-4-36-2-50 6"/><path d="M80 40v58"/>
    <path d="M44 52h22M44 62h22M44 72h18M94 52h22M94 62h22M94 72h18"/>
    <path d="M80 26v-10M62 30l-6-8M98 30l6-8"/></svg>`;
}
