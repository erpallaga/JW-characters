// Reducción de imágenes en el propio navegador, antes de subirlas. Sin esto,
// una foto de 6 MB recién sacada del móvil se quedaría para siempre en el
// historial del repositorio y ralentizaría la carga del mazo en el teléfono.

import { IMAGES } from './config.js';

/**
 * @param {File|Blob} archivo
 * @param {'portrait'|'map'} tipo
 * @returns {Promise<{blob: Blob, ancho: number, alto: number, anchoOriginal: number, altoOriginal: number}>}
 */
export async function reducir(archivo, tipo) {
  const limites = IMAGES[tipo];
  if (!limites) throw new Error(`tipo de imagen desconocido: ${tipo}`);

  const bitmap = await cargar(archivo);
  const escala = Math.min(1, limites.maxW / bitmap.width, limites.maxH / bitmap.height);
  const ancho = Math.max(1, Math.round(bitmap.width * escala));
  const alto = Math.max(1, Math.round(bitmap.height * escala));

  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  // Fondo claro: un PNG con transparencia sobre JPEG saldría negro.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ancho, alto);
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  if (bitmap.close) bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    lienzo.toBlob(b => (b ? resolve(b) : reject(new Error('no se ha podido comprimir la imagen'))),
      limites.mime, limites.quality);
  });

  return { blob, ancho, alto, anchoOriginal: bitmap.width, altoOriginal: bitmap.height };
}

function cargar(archivo) {
  if (typeof createImageBitmap === 'function') return createImageBitmap(archivo);
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('no se ha podido leer la imagen')); };
    img.src = url;
  });
}

export function formatearPeso(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
