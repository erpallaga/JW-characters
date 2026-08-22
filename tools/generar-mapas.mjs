/**
 * Genera assets/mapa-<id>.png para las tarjetas que tengan especificación de
 * mapa en data/characters.json.
 *
 *   node tools/generar-mapas.mjs                 (solo las que falten)
 *   node tools/generar-mapas.mjs --todas         (rehacerlas todas)
 *   node tools/generar-mapas.mjs abel ana job    (solo esas)
 *
 * Dibuja con el mismo admin/mapa.js que usa el panel, dentro de un Chromium
 * sin ventana, para que el lote y el editor den el mismo píxel. No hace falta
 * instalar nada: sirve el repositorio por HTTP y habla con el navegador por su
 * protocolo de depuración.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));
const CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };

const args = process.argv.slice(2);
const todas = args.includes('--todas');
const pedidas = args.filter(a => !a.startsWith('--'));

const servidor = createServer(async (req, res) => {
  const ruta = join(RAIZ, decodeURIComponent(req.url.split('?')[0]));
  if (!ruta.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
  try {
    const cuerpo = await readFile(ruta);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(ruta)] || 'application/octet-stream' }).end(cuerpo);
  } catch {
    res.writeHead(404).end('no está');
  }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

const perfil = await fs_mkdtemp();
const navegador = spawn(CHROMIUM, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--remote-debugging-port=0', `--user-data-dir=${perfil}`,
  `http://127.0.0.1:${puerto}/tools/render.html`,
], { stdio: ['ignore', 'ignore', 'pipe'] });

const wsUrl = await new Promise((cumplir, fallar) => {
  let buffer = '';
  const t = setTimeout(() => fallar(new Error('Chromium no ha abierto el puerto de depuración')), 30000);
  navegador.stderr.on('data', d => {
    buffer += d;
    const m = buffer.match(/ws:\/\/[^\s]+/);
    if (m) { clearTimeout(t); cumplir(m[0]); }
  });
});

const cdp = await conectar(wsUrl);
const pagina = (await cdp.enviar('Target.getTargets')).targetInfos.find(t => t.type === 'page');
const sesion = (await cdp.enviar('Target.attachToTarget', { targetId: pagina.targetId, flatten: true })).sessionId;

await esperar(cdp, sesion, 'window.listo === true', 30000);
const conMapa = await valor(cdp, sesion, 'JSON.stringify(window.conMapa)');
const ids = pedidas.length ? pedidas : JSON.parse(conMapa);

let hechos = 0, saltados = 0;
for (const id of ids) {
  const destino = join(RAIZ, 'assets', `mapa-${id}.png`);
  if (!todas && !pedidas.length && await existe(destino)) { saltados++; continue; }
  const png = Buffer.from(await valor(cdp, sesion, `window.dibujarPersonaje(${JSON.stringify(id)})`), 'base64');
  await writeFile(destino, png);
  console.log(`  mapa-${id}.png  ${Math.round(png.length / 1024)} KB`);
  hechos++;
}
console.log(`\n${hechos} mapa(s) generado(s)${saltados ? `, ${saltados} ya estaban` : ''}.`);

navegador.kill();
servidor.close();
cdp.cerrar();

// ---------------------------------------------------------------- utilidades

async function fs_mkdtemp() {
  const { mkdtemp } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  return mkdtemp(join(tmpdir(), 'mapas-'));
}

async function existe(ruta) {
  try { await access(ruta); return true; } catch { return false; }
}

function conectar(url) {
  return new Promise((cumplir, fallar) => {
    const ws = new WebSocket(url);
    const pendientes = new Map();
    let siguiente = 0;
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data);
      const p = pendientes.get(msg.id);
      if (!p) return;
      pendientes.delete(msg.id);
      msg.error ? p.fallar(new Error(msg.error.message)) : p.cumplir(msg.result);
    };
    ws.onerror = () => fallar(new Error('no se ha podido hablar con Chromium'));
    ws.onopen = () => cumplir({
      enviar(method, params = {}, sessionId) {
        const id = ++siguiente;
        return new Promise((cumplir, fallar) => {
          pendientes.set(id, { cumplir, fallar });
          ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
        });
      },
      cerrar: () => ws.close(),
    });
  });
}

async function valor(cdp, sesion, expresion) {
  const r = await cdp.enviar('Runtime.evaluate',
    { expression: expresion, returnByValue: true, awaitPromise: true }, sesion);
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'error en la página');
  return r.result.value;
}

async function esperar(cdp, sesion, expresion, ms) {
  const limite = Date.now() + ms;
  for (;;) {
    try { if (await valor(cdp, sesion, expresion)) return; } catch {}
    if (Date.now() > limite) throw new Error(`se ha agotado la espera de: ${expresion}`);
    await new Promise(r => setTimeout(r, 200));
  }
}
