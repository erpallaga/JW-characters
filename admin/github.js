// Cliente mínimo de la API de GitHub. Publica con la Git Data API para que
// cada publicación sea UN solo commit, aunque lleve varios JSON y varias
// imágenes: blobs -> árbol -> commit -> mover la rama.

import { REPO } from './config.js';

const API = 'https://api.github.com';
const TOKEN_KEY = 'jw-admin-token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || null; } catch (e) { return null; }
}
export function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
}
export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
}

async function api(path, { method = 'GET', body, raw = false } = {}) {
  const token = getToken();
  if (!token) throw new GitHubError('Falta el token de GitHub.', 'no-token');
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detalle = '';
    try { detalle = (await res.json()).message || ''; } catch (e) {}
    throw new GitHubError(mensajeHumano(res.status, detalle), codigo(res.status), res.status);
  }
  return raw ? res.text() : res.json();
}

export class GitHubError extends Error {
  constructor(message, code, status) { super(message); this.code = code; this.status = status; }
}

function codigo(status) {
  if (status === 401) return 'token-invalido';
  if (status === 403) return 'sin-permiso';
  if (status === 404) return 'no-encontrado';
  if (status === 409 || status === 422) return 'conflicto';
  return 'error';
}

function mensajeHumano(status, detalle) {
  if (status === 401) return 'El token no vale o ha caducado. Vuelve a conectarlo.';
  if (status === 403) return 'El token no tiene permiso de escritura sobre este repositorio.';
  if (status === 404) return 'No se encuentra el repositorio o el token no lo alcanza.';
  if (status === 409 || status === 422) return `GitHub ha rechazado el cambio: ${detalle}`;
  return `GitHub ha respondido ${status}${detalle ? `: ${detalle}` : ''}.`;
}

const base = `/repos/${REPO.owner}/${REPO.repo}`;

/** Comprueba que el token existe, alcanza el repositorio y puede escribir. */
export async function verificarToken() {
  const repo = await api(base);
  if (!repo.permissions || !repo.permissions.push) {
    throw new GitHubError('El token llega al repositorio pero no puede escribir en él.', 'sin-permiso');
  }
  return { nombre: repo.full_name, privado: repo.private };
}

/** Punta actual de la rama: commit y árbol. */
export async function cabeza() {
  const ref = await api(`${base}/git/ref/heads/${REPO.branch}`);
  const commit = await api(`${base}/git/commits/${ref.object.sha}`);
  return { commitSha: ref.object.sha, treeSha: commit.tree.sha, fecha: commit.committer && commit.committer.date };
}

/** Lee un fichero de texto del repositorio, tal cual está publicado. */
export async function leerTexto(path) {
  return api(`${base}/contents/${path}?ref=${REPO.branch}`, { raw: true });
}

/**
 * Publica un lote de cambios como un único commit.
 * @param {{mensaje: string, escrituras: Array<{path: string, base64: string}>,
 *          borrados: string[], baseCommitSha: string}} cambios
 */
export async function publicar({ mensaje, escrituras = [], borrados = [], baseCommitSha }) {
  const actual = await cabeza();
  if (baseCommitSha && actual.commitSha !== baseCommitSha) {
    throw new GitHubError(
      'El repositorio ha cambiado desde que abriste el panel. Recarga para traer lo último antes de publicar.',
      'desincronizado',
    );
  }

  const blobs = [];
  for (const { path, base64 } of escrituras) {
    const blob = await api(`${base}/git/blobs`, {
      method: 'POST',
      body: { content: base64, encoding: 'base64' },
    });
    blobs.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  // sha: null en un árbol equivale a borrar la ruta.
  const arbol = [...blobs, ...borrados.map(path => ({ path, mode: '100644', type: 'blob', sha: null }))];
  if (!arbol.length) throw new GitHubError('No hay nada que publicar.', 'vacio');

  const nuevoArbol = await api(`${base}/git/trees`, {
    method: 'POST',
    body: { base_tree: actual.treeSha, tree: arbol },
  });
  const commit = await api(`${base}/git/commits`, {
    method: 'POST',
    body: { message: mensaje, tree: nuevoArbol.sha, parents: [actual.commitSha] },
  });
  await api(`${base}/git/refs/heads/${REPO.branch}`, {
    method: 'PATCH',
    body: { sha: commit.sha },
  });
  return { commitSha: commit.sha, ficheros: escrituras.length + borrados.length };
}

// --- utilidades de codificación -------------------------------------------

export function textoABase64(texto) {
  const bytes = new TextEncoder().encode(texto);
  let bin = '';
  const CHUNK = 0x8000; // trocear evita reventar la pila con ficheros grandes
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export async function blobABase64(blob) {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < buf.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, buf.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}
