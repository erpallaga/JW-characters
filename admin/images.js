// Recorte y reducción de imágenes en el propio navegador, antes de subirlas.
//
// Dos motivos. Uno, el peso: sin esto, una foto de 6 MB recién sacada del móvil
// se quedaría para siempre en el historial del repositorio. Dos, el encuadre:
// el mazo enseña los retratos en 3:4 y los mapas en 4:3, y una foto que no
// venga así la recorta el navegador por el centro, que es justo donde no suele
// estar lo que interesa. Aquí se decide el recorte y lo que se sube ya está
// encuadrado.

import { IMAGES } from './config.js';

/** Proporción (ancho/alto) a la que el mazo enseña este tipo de imagen. */
export const proporcion = (tipo) => IMAGES[tipo].maxW / IMAGES[tipo].maxH;

/**
 * @param {File|Blob|string} fuente  fichero, o URL de una imagen ya publicada
 * @returns {Promise<{fuente: CanvasImageSource, ancho: number, alto: number, liberar: () => void}>}
 */
export async function cargarImagen(fuente) {
  const blob = typeof fuente === 'string' ? await descargar(fuente) : fuente;
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob);
    return {
      fuente: bitmap, ancho: bitmap.width, alto: bitmap.height,
      liberar: () => { if (bitmap.close) bitmap.close(); },
    };
  }
  const url = URL.createObjectURL(blob);
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('no se ha podido leer la imagen'));
    el.src = url;
  });
  return {
    fuente: img, ancho: img.naturalWidth, alto: img.naturalHeight,
    liberar: () => URL.revokeObjectURL(url),
  };
}

async function descargar(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`no se ha podido leer la imagen (${res.status})`);
  return res.blob();
}

/** El recorte más grande con la proporción del mazo que cabe en la imagen. */
export function recorteMaximo(ancho, alto, tipo) {
  const a = proporcion(tipo);
  return ancho / alto > a ? { sw: alto * a, sh: alto } : { sw: ancho, sh: ancho / a };
}

/**
 * El trozo del original que se ve, para un encuadre dado.
 * @param {{zoom: number, cx: number, cy: number}} vista
 *        zoom 1 = todo lo que cabe; cx/cy = centro del recorte, de 0 a 1.
 */
export function rectangulo(imagen, tipo, vista) {
  const max = recorteMaximo(imagen.ancho, imagen.alto, tipo);
  const sw = max.sw / vista.zoom;
  const sh = max.sh / vista.zoom;
  return {
    sx: Math.max(0, Math.min(imagen.ancho - sw, vista.cx * imagen.ancho - sw / 2)),
    sy: Math.max(0, Math.min(imagen.alto - sh, vista.cy * imagen.alto - sh / 2)),
    sw, sh,
  };
}

/** Tamaño del fichero que saldría de este encuadre. Nunca se agranda. */
export function tamañoDeSalida(rect, tipo) {
  const ancho = Math.max(1, Math.min(IMAGES[tipo].maxW, Math.round(rect.sw)));
  return { ancho, alto: Math.max(1, Math.round(ancho / proporcion(tipo))) };
}

export function pintar(ctx, imagen, rect, ancho, alto) {
  ctx.imageSmoothingQuality = 'high';
  // Fondo claro: un PNG con transparencia sobre JPEG saldría negro.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ancho, alto);
  ctx.drawImage(imagen.fuente, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, ancho, alto);
}

/** Recorta de verdad y devuelve el JPEG que se va a subir. */
export async function recortar(imagen, tipo, vista) {
  const limites = IMAGES[tipo];
  if (!limites) throw new Error(`tipo de imagen desconocido: ${tipo}`);
  const rect = rectangulo(imagen, tipo, vista);
  const { ancho, alto } = tamañoDeSalida(rect, tipo);

  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  pintar(lienzo.getContext('2d'), imagen, rect, ancho, alto);

  const blob = await new Promise((resolve, reject) => {
    lienzo.toBlob(b => (b ? resolve(b) : reject(new Error('no se ha podido comprimir la imagen'))),
      limites.mime, limites.quality);
  });
  return { blob, ancho, alto };
}

export function formatearPeso(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
