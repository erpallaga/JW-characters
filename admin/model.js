// Qué ha cambiado respecto a lo publicado. Todo el estado que ve el usuario
// —"con cambios", "nueva", el contador de la cabecera, la lista del modal de
// publicación— sale de aquí, comparando el borrador con la instantánea de lo
// que hay en el repositorio.

import { PATHS } from './config.js';

export const CAMPOS = [
  'name', 'eraId', 'timeframe', 'place', 'portraitSrc', 'mapSrc', 'mapPos', 'knownFor', 'hidden',
];

const ETIQUETAS = {
  name: 'nombre', eraId: 'era', timeframe: 'época', place: 'dónde vivió',
  portraitSrc: 'retrato', mapSrc: 'mapa', mapPos: 'punto del mapa',
  knownFor: 'por qué se le conoce', hidden: 'visibilidad',
  life: 'fechas', passages: 'pasajes',
};

const igual = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Campos en los que difieren dos versiones de una misma tarjeta. */
export function diferencias(borrador, publicado) {
  if (!publicado) return null;
  const campos = [...CAMPOS, 'life', 'passages'].filter(k => !igual(borrador[k], publicado[k]));
  return campos.length ? campos : [];
}

/** 'nueva' | 'cambios' | 'oculta' | 'publicada' */
export function estadoDe(tarjeta, publicadasPorId) {
  const previa = publicadasPorId[tarjeta.id];
  if (!previa) return 'nueva';
  const dif = diferencias(tarjeta, previa);
  if (dif.length) return 'cambios';
  return tarjeta.hidden ? 'oculta' : 'publicada';
}

export function resumen(borrador, publicado) {
  const publicadasPorId = Object.fromEntries((publicado.characters || []).map(c => [c.id, c]));
  const borradorPorId = Object.fromEntries((borrador.characters || []).map(c => [c.id, c]));

  const nuevas = [], editadas = [];
  for (const c of borrador.characters || []) {
    const previa = publicadasPorId[c.id];
    if (!previa) nuevas.push(c);
    else if (diferencias(c, previa).length) editadas.push({ tarjeta: c, campos: diferencias(c, previa) });
  }
  const borradas = (publicado.characters || []).filter(c => !borradorPorId[c.id]);
  const erasCambiadas = !igual(borrador.eras, publicado.eras);
  const ordenCambiado = !igual(
    (borrador.characters || []).map(c => c.id),
    (publicado.characters || []).map(c => c.id),
  ) && !nuevas.length && !borradas.length;

  return { nuevas, editadas, borradas, erasCambiadas, ordenCambiado, publicadasPorId };
}

export function hayCambios(r) {
  return !!(r.nuevas.length || r.editadas.length || r.borradas.length || r.erasCambiadas || r.ordenCambiado);
}

export function nombresDeCampos(campos) {
  return campos.map(k => ETIQUETAS[k] || k).join(' · ');
}

/** Mensaje de commit propuesto, editable después por el usuario. */
export function mensajePropuesto(r) {
  const partes = [];
  if (r.nuevas.length) partes.push(`añade a ${lista(r.nuevas.map(c => c.name))}`);
  if (r.editadas.length) partes.push(`actualiza a ${lista(r.editadas.map(e => e.tarjeta.name))}`);
  if (r.borradas.length) partes.push(`quita a ${lista(r.borradas.map(c => c.name))}`);
  if (r.erasCambiadas) partes.push('ajusta las eras');
  if (!partes.length && r.ordenCambiado) partes.push('reordena el mazo');
  const texto = partes.join('; ');
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : 'Actualiza las tarjetas';
}

function lista(nombres) {
  if (nombres.length === 1) return nombres[0];
  if (nombres.length === 2) return `${nombres[0]} y ${nombres[1]}`;
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
}

/**
 * Ficheros a escribir y a borrar en el commit.
 * @param {{characters: any[], eras: any[]}} borrador
 * @param {{characters: any[], eras: any[]}} publicado
 * @param {Record<string, {blob: Blob}>} imagenes  imágenes pendientes, por ruta
 */
export function ficherosDelCommit(borrador, publicado, imagenes) {
  const r = resumen(borrador, publicado);
  const textos = [];

  const charsSinCambios = igual(borrador.characters, publicado.characters);
  if (!charsSinCambios) {
    textos.push({ path: PATHS.characters, texto: JSON.stringify(borrador.characters, null, 2) + '\n' });
  }
  if (r.erasCambiadas) {
    textos.push({ path: PATHS.eras, texto: JSON.stringify(borrador.eras, null, 2) + '\n' });
  }

  // Solo se borra un asset si ninguna tarjeta que se queda lo sigue usando.
  const enUso = new Set();
  for (const c of borrador.characters || []) {
    if (c.portraitSrc) enUso.add(c.portraitSrc);
    if (c.mapSrc) enUso.add(c.mapSrc);
  }
  const borrados = [];
  for (const c of r.borradas) {
    for (const ruta of [c.portraitSrc, c.mapSrc]) {
      if (ruta && !enUso.has(ruta) && !borrados.includes(ruta)) borrados.push(ruta);
    }
  }

  return { textos, imagenes: Object.entries(imagenes || {}), borrados, resumen: r };
}
