// Ayudas mínimas de construcción de DOM. Sin framework, igual que el resto del
// proyecto: no hay build, así que no hay JSX ni plantillas compiladas.

export function h(tag, attrs, ...hijos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'estilo') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k in el) el[k] = v;
    else el.setAttribute(k, v);
  }
  añadir(el, hijos);
  return el;
}

function añadir(el, hijos) {
  for (const hijo of hijos.flat(Infinity)) {
    if (hijo == null || hijo === false) continue;
    el.appendChild(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
  }
}

/** Añade hijos a un elemento que ya existe, con las mismas reglas que h(). */
export function añadirA(el, ...hijos) { añadir(el, hijos); return el; }

export function vaciar(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

const TRAZOS = {
  candado: '<rect x="4" y="10" width="16" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  llave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9"/><path d="M17.5 5.5l2.5 2.5"/>',
  lapiz: '<path d="M12 20h8"/><path d="M16.4 4.1a1.9 1.9 0 0 1 2.7 2.7L7.6 18.3 4 19l.7-3.6Z"/>',
  papelera: '<path d="M4 6.5h16"/><path d="M9 6.5V4.5h6v2"/><path d="M18.2 6.5 17.3 20H6.7L5.8 6.5"/><path d="M10.2 10.5v5.5M13.8 10.5v5.5"/>',
  ojo: '<path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7Z"/><circle cx="12" cy="12" r="2.6"/>',
  ojoTachado: '<path d="M3 3l18 18"/><path d="M10.6 5.1A9.6 9.6 0 0 1 12 5c5 0 9 4.5 9 7a12 12 0 0 1-2.2 3.2"/><path d="M6.6 6.6C4 8.2 3 10.6 3 12c0 2.5 4 7 9 7 1.6 0 3-.4 4.2-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  lupa: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
  mas: '<path d="M12 5.5v13M5.5 12h13"/>',
  equis: '<path d="M6 6l12 12M18 6L6 18"/>',
  subir: '<path d="M12 19V6"/><path d="M6 11l6-6 6 6"/>',
  visto: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  alerta: '<path d="M12 3.5l8.5 15.5H3.5z"/><path d="M12 10v4"/><path d="M12 16.6h.01"/>',
  atras: '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
  imagen: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l4.5-3.5 3 2.2 3.5-2.7 5 4"/>',
  recargar: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/>',
  commit: '<circle cx="12" cy="12" r="3.4"/><path d="M3 12h5.2M15.8 12H21"/>',
  agarre: '<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>',
};

/** Iconos dibujados, nunca emoji: escalan y toman el color del contexto. */
export function icono(nombre, tam = 15) {
  const relleno = nombre === 'agarre';
  const svg = `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" ${
    relleno ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'
  }>${TRAZOS[nombre] || ''}</svg>`;
  return h('span', { class: 'ico', style: 'display:inline-flex', html: svg });
}

export function aviso(texto, tipo = 'info') {
  return h('div', { class: `aviso${tipo === 'error' ? ' aviso-error' : ''}` },
    icono(tipo === 'error' ? 'alerta' : 'info', 14),
    h('span', {}, texto));
}
