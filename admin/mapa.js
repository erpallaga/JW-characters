// Dibuja los mapas de las tarjetas. Es el mismo código que usa el editor del
// panel y el generador por lotes de tools/, para que un mapa retocado a mano
// salga idéntico al que genera el script.
//
// La proyección es Mercator esférica, la misma que usaban los 18 mapas
// originales: se dedujo midiendo dónde caían Ur, Harán, Atenas y Tarso en
// aquellos PNG y sale con menos de 0,25 px de error. Los colores están
// muestreados de los mismos ficheros.

// El lienzo se define en config.js, junto al recorte de las imágenes subidas a
// mano, para que un mapa dibujado y otro subido tengan el mismo marco.
import { LIENZO } from './config.js';
export { LIENZO };

export const PALETA = {
  mar: '#efe9dd',
  tierra: '#e4dcc8',
  frontera: '#c9bfa8',
  acento: '#b5583a',
  tinta: '#4a4235',
  halo: '#f5f0e6',
};

const ETIQUETA = {
  fuente: peso => `${peso} 21px "Bitstream Charter", Charter, Georgia, "Times New Roman", serif`,
  separacion: 10,   // del centro del punto al inicio del texto
  linea: 6.4,       // de la altura del punto a la línea base del texto
};

// Un recorrido largo se cuenta con muchas paradas, pero nombrarlas todas llena
// la tarjeta de letra. Las que llevan rótulo mantienen el punto de siempre; las
// escalas intermedias van con uno menor, así se ve de un vistazo qué son hitos y
// qué es camino.
const PUNTO = { radio: 5.5, radioMenor: 3.6, halo: 2 };
const RUTA = { grosor: 2.5, trazo: [3, 4.5], curva: 0.12 };

// Zona de la imagen que la tarjeta enseña de verdad: el reverso la recorta con
// background-size:cover en un hueco casi cuadrado, así que de los 909 px de
// ancho solo se ven unos 500 del centro. Todo lo que importe cae aquí dentro.
const SEGURO = { x0: 205, x1: 704, y0: 55, y1: 485 };

const MAX_PX_POR_GRADO = 175;   // no acercarse más que esto (vista tipo Judea)
const MIN_PX_POR_GRADO = 13;    // ni alejarse más allá de la geometría que hay

const rad = g => g * Math.PI / 180;

export function aMercator(lon, lat) {
  return { x: rad(lon), y: -Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2)) };
}

export function deMercator(x, y) {
  return {
    lon: x * 180 / Math.PI,
    lat: (2 * Math.atan(Math.exp(-y)) - Math.PI / 2) * 180 / Math.PI,
  };
}

/**
 * Decide qué trozo del mundo se ve. Devuelve la escala y el centro en
 * coordenadas Mercator; `proyectar` los convierte en píxeles.
 *
 * @param {{lon:number, lat:number, label?:string}[]} lugares
 * @param {{margen?:number, zoom?:number, centro?:{lon:number,lat:number},
 *          medir?:(texto:string)=>number}} opciones
 */
export function encuadrar(lugares, opciones = {}) {
  const margen = opciones.margen ?? 1.35;
  const medir = opciones.medir || (t => t.length * 10);
  const fijo = opciones.centro ? aMercator(opciones.centro.lon, opciones.centro.lat) : null;
  if (!lugares.length) {
    // Sin marcadores no hay nada que encuadrar: manda lo que diga la ficha, y
    // si no dice nada, la vista ancha de siempre.
    const k = (opciones.zoom ? opciones.zoom * 180 / Math.PI : 1048.5);
    return fijo ? { k, cx: fijo.x, cy: fijo.y } : { k, cx: rad(36.27), cy: aMercator(0, 27.71).y };
  }

  const puntos = lugares.map(l => ({ ...aMercator(l.lon, l.lat), label: l.label || '' }));
  const xs = puntos.map(p => p.x), ys = puntos.map(p => p.y);
  const cx = fijo ? fijo.x : (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = fijo ? fijo.y : (Math.min(...ys) + Math.max(...ys)) / 2;
  const anchoSeguro = SEGURO.x1 - SEGURO.x0;
  const altoSeguro = SEGURO.y1 - SEGURO.y0;

  // Un desierto visto de cerca no es más que una mancha: algunas fichas piden
  // a mano cuántos píxeles quieren por grado para que se reconozca el entorno.
  if (opciones.zoom) {
    const k = opciones.zoom * 180 / Math.PI;
    const colaMedia = puntos.reduce((s, p) => s + ETIQUETA.separacion + medir(p.label), 0) / puntos.length;
    return { k, cx: fijo ? cx : cx + (colaMedia / 2) / k, cy };
  }

  // Los puntos ocupan un rectángulo, y encima cada etiqueta añade su ancho por
  // la derecha. La escala es la que hace que todo eso quepa en la zona visible,
  // dejando un respiro alrededor.
  const anchoMerc = Math.max(...xs) - Math.min(...xs);
  const altoMerc = Math.max(...ys) - Math.min(...ys);
  const cola = Math.max(...puntos.map(p => ETIQUETA.separacion + medir(p.label)));
  const respiroX = 40 * margen, respiroY = 30 * margen;

  const porAncho = anchoMerc > 0
    ? Math.max(anchoSeguro - cola - respiroX * 2, 80) / anchoMerc : Infinity;
  const porAlto = altoMerc > 0
    ? Math.max(altoSeguro - respiroY * 2, 80) / altoMerc : Infinity;
  const k = Math.min(porAncho, porAlto, MAX_PX_POR_GRADO * 180 / Math.PI);

  // Como las etiquetas solo crecen hacia la derecha, el conjunto se ve
  // descentrado si no se corre el encuadre media etiqueta.
  return { k: Math.max(k, MIN_PX_POR_GRADO * 180 / Math.PI), cx: fijo ? cx : cx + (cola / 2) / k, cy };
}

export function proyectar(encuadre, lon, lat) {
  const m = aMercator(lon, lat);
  return {
    x: (m.x - encuadre.cx) * encuadre.k + LIENZO.ancho / 2,
    y: (m.y - encuadre.cy) * encuadre.k + LIENZO.alto / 2,
  };
}

/**
 * Pinta el mapa entero.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} geo            {paises, lagos} tal y como salen de data/geo/
 * @param {object} spec           {lugares:[{lon,lat,label}], ruta?, curva?, zoom?, centro?}
 * @param {object} [encuadre]     el de `encuadrar` si ya se calculó
 */
export function dibujar(ctx, geo, spec, encuadre) {
  const lugares = spec.lugares || [];
  const marco = encuadre
    || encuadrar(lugares, { zoom: spec.zoom, centro: spec.centro, medir: t => medirCon(ctx, t) });

  ctx.save();
  ctx.fillStyle = PALETA.mar;
  ctx.fillRect(0, 0, LIENZO.ancho, LIENZO.alto);

  dibujarPiezas(ctx, geo.paises, marco, PALETA.tierra);
  dibujarPiezas(ctx, geo.lagos, marco, PALETA.mar);

  if (spec.ruta && lugares.length > 1) dibujarRuta(ctx, marco, lugares, spec.curva ?? 0);
  for (const l of lugares) dibujarPunto(ctx, marco, l);
  for (const puesta of colocarEtiquetas(ctx, marco, lugares)) dibujarEtiqueta(ctx, puesta);

  ctx.restore();
  return marco;
}

function medirCon(ctx, texto) {
  const previa = ctx.font;
  ctx.font = ETIQUETA.fuente(700);
  const w = ctx.measureText(texto || '').width;
  ctx.font = previa;
  return w;
}

function dibujarPiezas(ctx, capa, marco, relleno) {
  const bbox = capa.bbox;
  ctx.lineWidth = 1;
  ctx.strokeStyle = PALETA.frontera;
  for (const pieza of capa.piezas) {
    for (let i = 0; i < pieza.length; i++) {
      const puntos = aPantalla(pieza[i], marco, bbox);
      // Las islas y los islotes que a esta escala no llegan a verse ensucian
      // más que aportan: los mapas originales tampoco los pintaban.
      if (!puntos || (i === 0 && diminuta(puntos))) break;

      ctx.beginPath();
      ctx.moveTo(puntos[0].x, puntos[0].y);
      for (let j = 1; j < puntos.length; j++) ctx.lineTo(puntos[j].x, puntos[j].y);
      ctx.closePath();
      // El anillo 0 es el contorno; los siguientes son huecos (lagos interiores).
      ctx.fillStyle = i === 0 ? relleno : PALETA.mar;
      ctx.fill();

      // Los tramos que van por el borde del recorte no son costa ni frontera:
      // son el corte de la tijera, y pintarlos deja una raya recta en el mapa.
      ctx.beginPath();
      for (let j = 0; j < puntos.length; j++) {
        const a = puntos[j], b = puntos[(j + 1) % puntos.length];
        if (a.borde && b.borde) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }
  }
}

// Proyecta un anillo tirando los puntos que a esta escala caen encima del
// anterior: al alejarse ahorra miles de segmentos y suaviza la costa.
function aPantalla(anillo, marco, bbox) {
  const salida = [];
  let ant = null;
  for (const [lon, lat] of anillo) {
    const p = proyectar(marco, lon, lat);
    if (ant && Math.abs(p.x - ant.x) < 0.7 && Math.abs(p.y - ant.y) < 0.7) continue;
    p.borde = !!bbox && (Math.abs(lon - bbox[0]) < 1e-6 || Math.abs(lon - bbox[2]) < 1e-6 ||
                         Math.abs(lat - bbox[1]) < 1e-6 || Math.abs(lat - bbox[3]) < 1e-6);
    salida.push(p);
    ant = p;
  }
  return salida.length >= 3 ? salida : null;
}

function diminuta(puntos) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of puntos) {
    if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x;
    if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y;
  }
  return (x1 - x0) < 3.5 && (y1 - y0) < 3.5;
}

// El viaje se traza como una curva suave que pasa por todos los lugares, sin
// picos en las escalas intermedias — como en los mapas originales. Con solo dos
// lugares queda una recta, salvo que la ficha pida un arco con `curva`.
function dibujarRuta(ctx, marco, lugares, curva) {
  const p = lugares.map(l => proyectar(marco, l.lon, l.lat));
  ctx.save();
  ctx.strokeStyle = PALETA.acento;
  ctx.lineWidth = RUTA.grosor;
  ctx.setLineDash(RUTA.trazo);
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);

  if (p.length === 2 && curva) {
    const dx = p[1].x - p[0].x, dy = p[1].y - p[0].y;
    ctx.quadraticCurveTo((p[0].x + p[1].x) / 2 + dy * curva,
                         (p[0].y + p[1].y) / 2 - dx * curva, p[1].x, p[1].y);
  } else {
    // Catmull-Rom pasado a curvas de Bézier, que es lo que entiende el lienzo.
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], d = p[Math.min(p.length - 1, i + 2)];
      ctx.bezierCurveTo(b.x + (c.x - a.x) / 6, b.y + (c.y - a.y) / 6,
                        c.x - (d.x - b.x) / 6, c.y - (d.y - b.y) / 6, c.x, c.y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function dibujarPunto(ctx, marco, lugar) {
  const p = proyectar(marco, lugar.lon, lugar.lat);
  const radio = lugar.label ? PUNTO.radio : PUNTO.radioMenor;
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, radio + PUNTO.halo, 0, Math.PI * 2);
  ctx.fillStyle = PALETA.halo;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p.x, p.y, radio, 0, Math.PI * 2);
  ctx.fillStyle = PALETA.acento;
  ctx.fill();
  ctx.restore();
}

function dibujarEtiqueta(ctx, { texto, x, base }) {
  ctx.save();
  ctx.font = ETIQUETA.fuente(700);
  ctx.textBaseline = 'alphabetic';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PALETA.halo;
  ctx.strokeText(texto, x, base);
  ctx.fillStyle = PALETA.tinta;
  ctx.fillText(texto, x, base);
  ctx.restore();
}

// Belén y Jerusalén están a diez kilómetros: por muy cerca que se mire, sus dos
// etiquetas se pisan. Cada una se prueba en varias posiciones alrededor de su
// punto y se queda con la primera que no choque con nada ya colocado.
function colocarEtiquetas(ctx, marco, lugares) {
  const previa = ctx.font;
  ctx.font = ETIQUETA.fuente(700);

  const conEtiqueta = lugares.filter(l => l.label);
  const puntos = lugares.map(l => proyectar(marco, l.lon, l.lat));
  const ocupado = puntos.map(p => caja(p.x - 8, p.y - 8, 16, 16));
  const puestas = [];

  for (const lugar of conEtiqueta) {
    const p = proyectar(marco, lugar.lon, lugar.lat);
    const w = ctx.measureText(lugar.label).width;
    const s = ETIQUETA.separacion;
    const candidatos = [];
    // Primero pegada al punto, y si ahí no cabe se va apartando. En un mapa con
    // muchas paradas las cuatro posiciones de siempre se agotan enseguida. El
    // salto se queda corto a propósito: una etiqueta que huye demasiado deja de
    // señalar a su punto, y entonces confunde más que un solape pequeño.
    for (const salto of [0, 11, 22]) {
      candidatos.push(
        [p.x + s + salto, p.y + ETIQUETA.linea],
        [p.x - s - w - salto, p.y + ETIQUETA.linea],
        [p.x + s + salto * 0.6, p.y - 9 - salto],
        [p.x + s + salto * 0.6, p.y + 22 + salto],
        [p.x - s - w - salto * 0.6, p.y - 9 - salto],
        [p.x - s - w - salto * 0.6, p.y + 22 + salto],
        [p.x - w / 2, p.y - 12 - salto],
        [p.x - w / 2, p.y + 25 + salto],
      );
    }

    const marca = ([x, base]) => caja(x - 2, base - 17, w + 4, 22);
    const solape = c => ocupado.reduce((s2, o) => s2 + area(o, marca(c)), 0);
    // Si ninguna posición queda limpia, gana la que menos tape: forzar siempre
    // la primera es lo que dejaba dos nombres impresos uno encima del otro.
    let elegido = candidatos.find(c => solape(c) === 0);
    if (!elegido) elegido = candidatos.reduce((a, b) => (solape(b) < solape(a) ? b : a));

    ocupado.push(marca(elegido));
    puestas.push({ texto: lugar.label, x: elegido[0], base: elegido[1] });
  }

  ctx.font = previa;
  return puestas;
}

const caja = (x, y, w, h) => ({ x0: x, y0: y, x1: x + w, y1: y + h });
const chocan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const area = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0))
                     * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

/**
 * Resuelve la especificación de una tarjeta contra el nomenclátor.
 * Acepta ids de data/lugares.json, y también {lon, lat, label} sueltos.
 *
 * Si la ficha trae `etiquetas`, solo esos lugares salen con su nombre escrito;
 * los demás quedan como punto. El ancho de las etiquetas es lo que decide cuánto
 * se puede acercar el encuadre (véase `encuadrar`), así que rotular solo los
 * hitos es lo que permite que un recorrido largo quepa entero. Sin `etiquetas`,
 * se rotulan todos, que es como se dibujaron las primeras tarjetas.
 */
export function resolverLugares(spec, nomenclator) {
  const porId = Object.fromEntries(nomenclator.map(l => [l.id, l]));
  const rotula = spec?.etiquetas ? new Set(spec.etiquetas) : null;
  const conNombre = (id, label) => (!rotula || (id && rotula.has(id)) ? label : '');

  return (spec?.lugares || []).map(entrada => {
    if (typeof entrada === 'string') {
      const l = porId[entrada];
      if (!l) throw new Error(`lugar desconocido en el nomenclátor: ${entrada}`);
      return { lon: l.lon, lat: l.lat, label: conNombre(entrada, l.label) };
    }
    const base = entrada.id ? porId[entrada.id] : null;
    if (entrada.id && !base) throw new Error(`lugar desconocido en el nomenclátor: ${entrada.id}`);
    return {
      lon: entrada.lon ?? base.lon,
      lat: entrada.lat ?? base.lat,
      label: conNombre(entrada.id, entrada.label ?? base?.label ?? ''),
    };
  });
}
