// Acceso al panel. Conviene ser claro sobre qué protege esto: la contraseña
// solo oculta la interfaz — los datos publicados son públicos de todos modos,
// y lo que de verdad autoriza a escribir es el token de GitHub. Sirve para que
// nadie entre sin querer, no para resistir a alguien que lo intente.

import { AUTH } from './config.js';

const SESION = 'jw-admin-sesion';

export async function sha256(texto) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function entrar(usuario, contrasena) {
  const huella = await sha256(contrasena);
  const ok = usuario.trim().toLowerCase() === AUTH.user && huella === AUTH.passwordSha256;
  if (ok) { try { sessionStorage.setItem(SESION, '1'); } catch (e) {} }
  return ok;
}

export function haySesion() {
  try { return sessionStorage.getItem(SESION) === '1'; } catch (e) { return false; }
}

export function salir() {
  try { sessionStorage.removeItem(SESION); } catch (e) {}
}
