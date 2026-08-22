// Panel de administración. Flujo: entrar -> conectar el repositorio -> trabajar
// sobre un borrador local -> publicar todo junto en un commit.
//
// Regla de oro: nada de lo que se hace aquí toca la web hasta pulsar Publicar.

import { AUTH, PATHS, IMAGES, REPO } from './config.js';
import { entrar, haySesion, salir } from './auth.js';
import * as gh from './github.js';
import * as store from './store.js';
import { formatearPeso } from './images.js';
import { pedirEncuadre } from './encuadre.js';
import * as modelo from './model.js';
import { h, vaciar, añadirA, icono, aviso } from './ui.js';

const LINEA = { min: -4026, max: 100 };
const raiz = document.getElementById('app');

const estado = {
  pantalla: 'entrar',
  cargando: false,
  error: null,
  borrador: null,      // { characters: [], eras: [] }
  publicado: null,     // instantánea de lo que hay en el repositorio
  libros: [],
  imagenes: {},        // ruta -> { blob, ancho, alto }, pendientes de subir
  originales: {},      // ruta -> fichero tal cual se eligió, para poder reencuadrar sin perder calidad
  reciennPublicadas: {}, // ya subidas: se siguen pintando hasta que Pages reconstruya
  baseCommitSha: null,
  editandoId: null,
  filtros: { texto: '', era: '', estado: '' },
  publicando: false,
  guardadoEn: null,
};

// ---------------------------------------------------------------- utilidades

const librosPorId = () => Object.fromEntries(estado.libros.map(b => [b.id, b]));

function textoRelativo(ts) {
  if (!ts) return '';
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return 'ahora mismo';
  if (s < 60) return `hace ${s} s`;
  const m = Math.round(s / 60);
  return m < 60 ? `hace ${m} min` : `hace ${Math.round(m / 60)} h`;
}

function anyoTexto(y) { return y < 0 ? `${Math.abs(y)} a.e.c.` : `${y} e.c.`; }

function vidaTexto(life) {
  if (!life || typeof life.start !== 'number') return '—';
  return `${life.approx ? '≈ ' : ''}${Math.abs(life.start)} – ${Math.abs(life.end)} ${life.end < 0 ? 'a.e.c.' : 'e.c.'}`;
}

function identificador(nombre, usados) {
  const base = (nombre || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24) || 'tarjeta';
  let id = base, n = 2;
  while (usados.includes(id)) id = `${base}${n++}`;
  return id;
}

/** URL para pintar una imagen: la pendiente de subir, o la ya publicada. */
function urlImagen(ruta) {
  if (!ruta) return null;
  const registro = estado.imagenes[ruta] || estado.reciennPublicadas[ruta];
  if (registro && registro.blob) {
    registro._url = registro._url || URL.createObjectURL(registro.blob);
    return registro._url;
  }
  return ruta;
}

let temporizadorGuardado = null;
function guardarBorrador() {
  estado.guardadoEn = Date.now();
  clearTimeout(temporizadorGuardado);
  temporizadorGuardado = setTimeout(() => {
    store.guardarBorrador(JSON.parse(JSON.stringify(estado.borrador))).catch(e => console.error(e));
  }, 250);
}

const tarjetaPorId = (id) => (estado.borrador.characters || []).find(c => c.id === id);

// ---------------------------------------------------------------- arranque

async function arrancar() {
  if (!haySesion()) return ir('entrar');
  if (!gh.getToken()) return ir('token');
  await cargarDatos();
}

async function cargarDatos() {
  estado.cargando = true; estado.error = null; render();
  try {
    await gh.verificarToken();
    const cabeza = await gh.cabeza();
    const [chars, eras, libros] = await Promise.all([
      gh.leerTexto(PATHS.characters).then(JSON.parse),
      gh.leerTexto(PATHS.eras).then(JSON.parse),
      gh.leerTexto(PATHS.books).then(JSON.parse),
    ]);
    estado.publicado = { characters: chars, eras };
    estado.libros = libros;
    estado.baseCommitSha = cabeza.commitSha;
    await store.guardarPublicado(estado.publicado);
    await store.guardarBaseSha(cabeza.commitSha);

    const guardado = await store.leerBorrador();
    // La primera vez el borrador se siembra con lo publicado: a partir de ahí
    // toda tarjeta es un registro igual, se editen las 18 antiguas o una nueva.
    estado.borrador = guardado || JSON.parse(JSON.stringify(estado.publicado));
    estado.imagenes = await store.listarImagenes();
    estado.cargando = false;
    ir('lista');
  } catch (err) {
    estado.cargando = false;
    estado.error = err.message || String(err);
    if (err.code === 'token-invalido' || err.code === 'no-token' || err.code === 'sin-permiso') {
      return ir('token');
    }
    render();
  }
}

function ir(pantalla, id = null) {
  estado.pantalla = pantalla;
  estado.editandoId = id;
  render();
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- cabecera

function cabecera({ titulo, volver } = {}) {
  const r = estado.publicado ? modelo.resumen(estado.borrador, estado.publicado) : null;
  const pendientes = r ? r.nuevas.length + r.editadas.length + r.borradas.length +
    (r.erasCambiadas ? 1 : 0) + (r.ordenCambiado ? 1 : 0) : 0;

  return h('div', { class: 'topbar' },
    h('div', { class: 'marca' },
      volver
        ? h('button', { class: 'icono-btn', title: 'Volver', onclick: volver }, icono('atras', 17))
        : h('div', { class: 'marca-icono' }, icono('candado', 15)),
      h('b', {}, titulo || 'Panel de tarjetas'),
      h('span', { class: 'sep' }, '/'),
      h('span', { class: 'amiri' }, 'Personajes de la Biblia'),
    ),
    h('div', { style: 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end' },
      pendientes
        ? h('span', { class: 'chip chip-acento' }, h('span', { class: 'punto' }),
            `${pendientes} ${pendientes === 1 ? 'cambio' : 'cambios'} sin publicar`)
        : h('span', { class: 'chip chip-plano' }, h('span', { class: 'punto punto-gris' }), 'Todo publicado'),
      h('button', {
        class: 'btn btn-primary', disabled: !pendientes,
        onclick: () => abrirPublicar(),
      }, icono('subir', 14), 'Publicar'),
      h('span', { style: 'width:1px;height:22px;background:var(--borde-suave)' }),
      h('button', {
        class: 'btn btn-ghost',
        onclick: () => { salir(); ir('entrar'); },
      }, 'Salir'),
    ),
  );
}

// ---------------------------------------------------------------- entrar

function pantallaEntrar() {
  let error = null;
  const usuario = h('input', { class: 'campo', type: 'text', value: AUTH.user, autocomplete: 'username' });
  const clave = h('input', { class: 'campo', type: 'password', autocomplete: 'current-password' });
  const zonaError = h('div');

  const enviar = async (e) => {
    e.preventDefault();
    if (await entrar(usuario.value, clave.value)) {
      if (!gh.getToken()) return ir('token');
      return cargarDatos();
    }
    error = 'Usuario o contraseña incorrectos.';
    vaciar(zonaError).appendChild(aviso(error, 'error'));
    clave.value = '';
    clave.focus();
  };

  return h('div', { class: 'centro' },
    h('form', { class: 'panel-centro', style: 'max-width:400px', onsubmit: enviar },
      h('div', { style: 'display:flex;flex-direction:column;gap:7px' },
        h('div', { class: 'label', style: 'letter-spacing:0.16em;font-size:11px' }, 'Noche de adoración en familia'),
        h('div', { class: 'amiri', style: 'font-size:27px;font-weight:700;line-height:1.1' }, 'Personajes de la Biblia'),
        h('div', { style: 'display:flex;align-items:center;gap:8px;margin-top:3px;color:var(--acento)' },
          icono('candado', 15),
          h('span', { style: 'font-size:13px;font-weight:700;color:var(--tinta-2)' }, 'Panel de tarjetas')),
      ),
      h('div', { style: 'display:flex;flex-direction:column;gap:14px' },
        h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Usuario'), usuario),
        h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Contraseña'), clave),
      ),
      zonaError,
      h('button', { class: 'btn btn-primary btn-alto', type: 'submit', style: 'width:100%;justify-content:center' }, 'Entrar'),
      aviso('El acceso solo oculta el panel. Lo que autoriza a publicar es el token del repositorio, que se pide una vez tras entrar.'),
      h('div', { style: 'border-top:1px solid var(--borde-suave);padding-top:14px;display:flex;justify-content:center' },
        h('a', { href: './index.html', style: 'font-size:12.5px;font-weight:700;color:var(--tinta-2);display:inline-flex;align-items:center;gap:6px' },
          icono('atras', 14), 'Volver al mazo')),
    ),
  );
}

// ---------------------------------------------------------------- token

function pantallaToken() {
  const campo = h('input', { class: 'campo mono', type: 'password', placeholder: 'github_pat_…' });
  const zona = h('div');
  if (estado.error) zona.appendChild(aviso(estado.error, 'error'));

  const comprobar = async () => {
    const valor = campo.value.trim();
    if (!valor) return;
    vaciar(zona).appendChild(aviso('Comprobando el token…'));
    gh.setToken(valor);
    try {
      await gh.verificarToken();
      estado.error = null;
      await cargarDatos();
    } catch (err) {
      gh.clearToken();
      vaciar(zona).appendChild(aviso(err.message, 'error'));
    }
  };

  const permiso = (texto, ok = true) => h('div', { style: 'display:flex;align-items:center;gap:9px' },
    h('span', { style: `display:inline-flex;flex-shrink:0;color:${ok ? 'var(--acento)' : 'var(--tinta-2)'}` },
      icono(ok ? 'visto' : 'equis', 14)),
    h('span', { style: `font-size:12.5px;${ok ? '' : 'color:var(--tinta-2)'}` , html: texto }));

  return h('div', { class: 'centro' },
    h('div', { class: 'panel-centro' },
      h('div', { style: 'display:flex;align-items:center;gap:11px' },
        h('div', { class: 'marca-icono', style: 'width:38px;height:38px;border-radius:12px' }, icono('llave', 19)),
        h('div', {},
          h('div', { style: 'font-size:16px;font-weight:800;line-height:1.2' }, 'Conectar con el repositorio'),
          h('div', { style: 'font-size:12px;color:var(--tinta-2);margin-top:2px' }, 'Solo una vez. Se guarda en este navegador.')),
      ),
      h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Token de acceso'), campo),
      zona,
      h('div', { style: 'background:var(--hueco);border-radius:13px;padding:15px 16px;display:flex;flex-direction:column;gap:11px' },
        h('div', { class: 'sechd', style: 'margin-bottom:0' }, 'Permisos que necesita'),
        permiso(`Un solo repositorio: <span class="mono" style="font-size:11.5px">${REPO.owner}/${REPO.repo}</span>`),
        permiso('Contenido: lectura y escritura'),
        permiso('Nada más: ni otros repositorios, ni tu cuenta', false),
        h('a', {
          href: 'https://github.com/settings/personal-access-tokens/new', target: '_blank', rel: 'noopener',
          style: 'font-size:12px;font-weight:700;margin-top:2px',
        }, 'Crear el token en GitHub ↗'),
      ),
      aviso('Quien use este navegador podrá publicar en el repositorio. Si prestas el portátil, cierra la sesión del panel.'),
      h('div', { style: 'display:flex;gap:10px' },
        h('button', { class: 'btn btn-primary btn-alto', style: 'flex:1;justify-content:center', onclick: comprobar }, 'Comprobar y guardar'),
        h('button', { class: 'btn btn-alto', onclick: () => { salir(); ir('entrar'); } }, 'Cancelar'),
      ),
    ),
  );
}

// ---------------------------------------------------------------- lista

function chipEstado(tipo) {
  if (tipo === 'nueva') return h('span', { class: 'chip chip-acento' }, h('span', { class: 'punto' }), 'Nueva · sin publicar');
  if (tipo === 'cambios') return h('span', { class: 'chip chip-acento' }, h('span', { class: 'punto' }), 'Con cambios');
  if (tipo === 'oculta') return h('span', { class: 'chip chip-plano' }, h('span', { class: 'punto punto-hueco' }), 'Oculta en el mazo');
  return h('span', { class: 'chip chip-plano' }, h('span', { class: 'punto punto-gris' }), 'Publicada');
}

// El mazo se lee en el orden del array, y ese orden es una decisión: Ester va
// antes que Daniel aunque las fechas digan lo contrario. Una tarjeta nueva se
// coloca sola por sus fechas (ver colocarPorFecha); esto permite mover
// cualquiera a mano, arrastrándola o con las flechas del teclado.

/** Tarjetas que el usuario ha movido a mano: ya no se recolocan por fecha. */
const movidasAMano = new Set();

/** Reordena el array a partir de una lista de ids. Devuelve si algo cambió. */
function aplicarOrden(ids) {
  const lista = estado.borrador.characters || [];
  const porId = Object.fromEntries(lista.map(c => [c.id, c]));
  const ordenadas = ids.map(id => porId[id]).filter(Boolean);
  // Si los ids no cuadran con el borrador, mejor no tocar nada.
  if (ordenadas.length !== lista.length) return false;
  if (ordenadas.every((c, i) => c === lista[i])) return false;
  estado.borrador.characters = ordenadas;
  guardarBorrador();
  return true;
}

function moverTarjeta(id, delta) {
  const ids = (estado.borrador.characters || []).map(c => c.id);
  const i = ids.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= ids.length) return;
  ids.splice(j, 0, ids.splice(i, 1)[0]);
  movidasAMano.add(id);
  aplicarOrden(ids);
  render();
  const agarre = raiz.querySelector(`[data-agarre="${id}"]`);
  if (agarre) agarre.focus();
}

/**
 * Arrastre de una fila. Mientras se arrastra solo se mueve el nodo por el DOM;
 * al soltar, el orden que haya quedado se vuelca en el borrador.
 */
function empezarArrastre(ev, fila, contenedor) {
  if (ev.button !== undefined && ev.button !== 0) return;
  ev.preventDefault();
  fila.classList.add('arrastrando');
  contenedor.classList.add('reordenando');

  // Los eventos van a la ventana y no al asa: al mover la fila de sitio, el
  // navegador la saca y la vuelve a meter en el DOM, y con eso se pierde
  // cualquier captura del puntero sobre ella.
  const mover = (e) => {
    if (e.clientY < 90) window.scrollBy(0, -14);
    else if (e.clientY > window.innerHeight - 90) window.scrollBy(0, 14);

    const destino = [...contenedor.querySelectorAll('.fila')]
      .filter(f => f !== fila)
      .find(f => { const r = f.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; }) || null;
    if (destino !== fila.nextElementSibling) contenedor.insertBefore(fila, destino);
  };

  const soltar = () => {
    window.removeEventListener('pointermove', mover);
    window.removeEventListener('pointerup', soltar);
    window.removeEventListener('pointercancel', soltar);
    fila.classList.remove('arrastrando');
    contenedor.classList.remove('reordenando');
    movidasAMano.add(fila.dataset.id);
    aplicarOrden([...contenedor.querySelectorAll('.fila')].map(f => f.dataset.id));
    render();
  };

  window.addEventListener('pointermove', mover);
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);
}

function pantallaLista() {
  const eras = estado.borrador.eras || [];
  const erasPorId = Object.fromEntries(eras.map(e => [e.id, e]));
  const publicadasPorId = Object.fromEntries((estado.publicado.characters || []).map(c => [c.id, c]));
  const todas = estado.borrador.characters || [];

  const f = estado.filtros;
  const visibles = todas.filter(c => {
    if (f.era && c.eraId !== f.era) return false;
    if (f.estado && modelo.estadoDe(c, publicadasPorId) !== f.estado) return false;
    if (f.texto) {
      const aguja = f.texto.toLowerCase();
      if (!`${c.name} ${c.place || ''}`.toLowerCase().includes(aguja)) return false;
    }
    return true;
  });

  const ocultas = todas.filter(c => c.hidden).length;
  const r = modelo.resumen(estado.borrador, estado.publicado);
  const pendientes = r.nuevas.length + r.editadas.length + r.borradas.length;

  const buscador = h('input', {
    class: 'campo', type: 'search', placeholder: 'Buscar por nombre o lugar', value: f.texto,
    style: 'width:250px', oninput: (e) => { f.texto = e.target.value; render(); },
  });

  // Reordenar solo tiene sentido viendo el mazo entero: con un filtro puesto,
  // «dejar esta fila aquí» no dice dónde va en el orden real.
  const puedeReordenar = !f.texto && !f.era && !f.estado && todas.length > 1;
  const contenedor = h('div', { class: 'lista' });

  const filas = visibles.map(c => {
    const tipo = modelo.estadoDe(c, publicadasPorId);
    const era = erasPorId[c.eraId];
    const url = urlImagen(c.portraitSrc);
    const agarre = h('button', {
      class: 'agarre', type: 'button', disabled: !puedeReordenar, 'data-agarre': c.id,
      title: puedeReordenar
        ? 'Arrastra para mover la tarjeta; con el teclado, ↑ y ↓'
        : 'Quita los filtros para poder reordenar',
      onkeydown: (e) => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        e.preventDefault();
        moverTarjeta(c.id, e.key === 'ArrowUp' ? -1 : 1);
      },
    }, icono('agarre', 15));

    const fila = h('div', { class: `fila${c.hidden ? ' oculta' : ''}`, 'data-id': c.id },
      agarre,
      url
        ? h('img', { class: 'miniatura', src: url, alt: '', loading: 'lazy' })
        : h('div', { class: 'miniatura miniatura-vacia' }, icono('imagen', 15)),
      h('div', { style: 'flex:1;min-width:0' },
        h('div', { class: 'nombre-fila' }, c.name || 'Sin nombre'),
        h('div', { class: 'sub-fila' }, c.place || 'Sin lugar')),
      h('div', { class: 'col-era' }, h('span', { class: 'chip chip-neutro' }, era ? era.label : '— sin era —')),
      h('div', { class: 'col-vida num' }, vidaTexto(c.life)),
      h('div', { class: 'col-estado' }, chipEstado(tipo)),
      h('div', { class: 'col-acciones' },
        h('button', { class: 'icono-btn', title: 'Editar', onclick: () => ir('editor', c.id) }, icono('lapiz')),
        h('button', {
          class: 'icono-btn', title: c.hidden ? 'Volver a mostrar en el mazo' : 'Ocultar del mazo',
          onclick: () => { c.hidden = !c.hidden; if (!c.hidden) delete c.hidden; guardarBorrador(); render(); },
        }, icono(c.hidden ? 'ojo' : 'ojoTachado')),
        h('button', { class: 'icono-btn', title: 'Borrar', onclick: () => borrarTarjeta(c) }, icono('papelera')),
      ),
    );

    if (puedeReordenar) {
      agarre.addEventListener('pointerdown', (ev) => empezarArrastre(ev, fila, contenedor));
    }
    return fila;
  });

  return h('div', {},
    cabecera(),
    h('div', { class: 'contenido', style: 'display:flex;flex-direction:column;gap:16px' },
      h('div', { style: 'display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap' },
        h('div', {},
          h('div', { style: 'font-size:19px;font-weight:800;line-height:1.2' }, 'Tarjetas'),
          h('div', { style: 'font-size:12.5px;color:var(--tinta-2);margin-top:3px' },
            `${todas.length} en el mazo${ocultas ? ` · ${ocultas} oculta${ocultas > 1 ? 's' : ''}` : ''}${pendientes ? ` · ${pendientes} sin publicar` : ''}`)),
        h('div', { class: 'segmentado' },
          h('button', { class: 'activo' }, 'Tarjetas'),
          h('button', { onclick: () => ir('eras') }, 'Eras')),
      ),
      h('div', { style: 'display:flex;align-items:center;gap:10px;flex-wrap:wrap' },
        buscador,
        h('select', {
          class: 'campo', style: 'width:auto', onchange: (e) => { f.era = e.target.value; render(); },
        }, h('option', { value: '' }, 'Todas las eras'),
          ...eras.map(e => h('option', { value: e.id, selected: f.era === e.id }, e.label))),
        h('select', {
          class: 'campo', style: 'width:auto', onchange: (e) => { f.estado = e.target.value; render(); },
        }, h('option', { value: '' }, 'Cualquier estado'),
          ...[['nueva', 'Nuevas'], ['cambios', 'Con cambios'], ['publicada', 'Publicadas'], ['oculta', 'Ocultas']]
            .map(([v, t]) => h('option', { value: v, selected: f.estado === v }, t))),
        h('div', { style: 'flex:1' }),
        h('button', { class: 'btn btn-acento', onclick: nuevaTarjeta }, icono('mas', 15), 'Nueva tarjeta'),
      ),
      añadirA(contenedor,
        h('div', { class: 'fila-cab' },
          h('div', { style: 'width:22px;flex-shrink:0' }),
          h('div', { style: 'width:38px;flex-shrink:0' }),
          h('div', { class: 'label', style: 'flex:1;min-width:0' }, 'Personaje'),
          h('div', { class: 'label col-era' }, 'Era'),
          h('div', { class: 'label col-vida' }, 'Vida'),
          h('div', { class: 'label col-estado' }, 'Estado'),
          h('div', { class: 'col-acciones' })),
        filas.length ? filas : h('div', { class: 'cargando' }, 'Ninguna tarjeta coincide con el filtro.'),
      ),
      h('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap' },
        h('span', { style: 'font-size:12px;color:var(--tinta-2)' },
          `Mostrando ${visibles.length} de ${todas.length}`,
          todas.length > 1
            ? (puedeReordenar
                ? ' · arrastra el asa de una fila para cambiar el orden del mazo'
                : ' · quita los filtros para poder reordenar')
            : ''),
        estado.guardadoEn
          ? h('span', { style: 'display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--tinta-2)' },
              icono('reloj', 14), `Borrador guardado ${textoRelativo(estado.guardadoEn)}`)
          : null),
    ),
  );
}

function nuevaTarjeta() {
  const usados = estado.borrador.characters.map(c => c.id);
  const id = identificador('nueva', usados);
  estado.borrador.characters.push({ id, name: '', mapPos: '50% 50%', passages: [] });
  guardarBorrador();
  ir('editor', id);
}

async function borrarTarjeta(c) {
  const publicada = (estado.publicado.characters || []).some(x => x.id === c.id);
  const texto = publicada
    ? `Borrar «${c.name || c.id}» del mazo. Al publicar desaparecerá de la web, junto con su retrato y su mapa. ¿Seguro?`
    : `Descartar «${c.name || c.id}». Todavía no se ha publicado, así que se pierde sin más. ¿Seguro?`;
  if (!confirm(texto)) return;
  estado.borrador.characters = estado.borrador.characters.filter(x => x.id !== c.id);
  for (const ruta of [c.portraitSrc, c.mapSrc]) {
    if (ruta && estado.imagenes[ruta]) { await store.borrarImagen(ruta); delete estado.imagenes[ruta]; }
  }
  guardarBorrador();
  render();
}

// ---------------------------------------------------------------- editor

/**
 * Mientras una tarjeta no se ha publicado, su identificador sigue al nombre:
 * así el retrato acaba en portrait-ana.jpg y no en portrait-nueva.jpg. Una vez
 * publicada el identificador se congela, porque ya hay ficheros con ese nombre
 * en el repositorio y renombrarlos sería otro problema.
 */
function renombrar(c) {
  const otros = estado.borrador.characters.filter(x => x !== c).map(x => x.id);
  const nuevoId = identificador(c.name, otros);
  if (nuevoId === c.id) return;
  const anterior = c.id;
  c.id = nuevoId;
  for (const campo of ['portraitSrc', 'mapSrc']) {
    const ruta = c[campo];
    if (!ruta) continue;
    const destino = ruta.replace(`-${anterior}.`, `-${nuevoId}.`);
    if (destino === ruta) continue;
    const registro = estado.imagenes[ruta];
    if (registro) {
      delete estado.imagenes[ruta];
      estado.imagenes[destino] = registro;
      store.borrarImagen(ruta);
      store.guardarImagen(destino, { blob: registro.blob, ancho: registro.ancho, alto: registro.alto });
    }
    c[campo] = destino;
  }
  estado.editandoId = nuevoId;
}

function pantallaEditor() {
  const c = tarjetaPorId(estado.editandoId);
  if (!c) { ir('lista'); return h('div'); }
  const publicada = (estado.publicado.characters || []).find(x => x.id === c.id);
  const previa = h('div', { class: 'editor-previa' });
  const pintarPrevia = () => { vaciar(previa); previa.appendChild(vistaPrevia(c)); };

  const cambiar = (campo, valor) => {
    if (valor === '' || valor == null) delete c[campo]; else c[campo] = valor;
    if (campo === 'name' && !publicada) renombrar(c);
    guardarBorrador();
    pintarPrevia();
    actualizarCabecera();
  };

  const texto = (campo, atributos = {}) => h('input', {
    class: 'campo', type: 'text', value: c[campo] || '', ...atributos,
    oninput: (e) => cambiar(campo, e.target.value),
  });

  // --- identidad
  const bloqueIdentidad = h('div', { class: 'tarjeta-panel' },
    h('div', { class: 'sechd' }, 'Identidad'),
    h('div', { class: 'rejilla-2' },
      h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Nombre'),
        texto('name', { placeholder: 'Ana' })),
      h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Identificador'),
        h('input', { class: 'campo mono', value: c.id, readOnly: true, title: 'Se usa en el nombre de los ficheros de imagen' })),
      h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Era'),
        h('select', { class: 'campo', onchange: (e) => cambiar('eraId', e.target.value) },
          h('option', { value: '', selected: !c.eraId }, '— elige una era —'),
          ...estado.borrador.eras.map(e => h('option', { value: e.id, selected: c.eraId === e.id }, e.label)))),
      h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Época (texto de la tarjeta)'),
        texto('timeframe', { placeholder: '~1100 a.e.c.' })),
      h('label', { class: 'campo-grupo span-2' }, h('span', { class: 'label' }, 'Dónde vivió'),
        texto('place', { placeholder: 'Ramá y Siló' })),
    ),
  );

  // --- por qué se le conoce
  const contador = h('span', { style: 'font-size:11px;color:var(--tinta-2)' });
  const actualizarContador = () => {
    const n = (c.knownFor || '').length;
    contador.textContent = `${n} caracteres${n > 900 ? ' · quizá no quepa en el reverso' : ''}`;
  };
  actualizarContador();
  const bloqueTexto = h('div', { class: 'tarjeta-panel' },
    h('div', { style: 'display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:14px' },
      h('span', { class: 'sechd', style: 'margin-bottom:0' }, 'Por qué se le conoce'), contador),
    h('textarea', {
      class: 'campo', value: c.knownFor || '', placeholder: 'Qué conviene recordar de este personaje…',
      oninput: (e) => { cambiar('knownFor', e.target.value); actualizarContador(); },
    }),
  );

  // --- línea de tiempo
  const bloqueLinea = bloqueDeLinea(c, cambiar, pintarPrevia);

  // --- imágenes
  const bloqueImagenes = h('div', { class: 'tarjeta-panel' },
    h('div', { class: 'sechd' }, 'Imágenes'),
    h('div', { class: 'rejilla-2' },
      campoImagen(c, 'portrait', pintarPrevia),
      campoImagen(c, 'map', pintarPrevia)),
  );

  // --- pasajes
  const bloquePasajes = bloqueDePasajes(c, pintarPrevia);

  const descartar = async () => {
    if (!publicada) {
      if (!confirm('Esta tarjeta no se ha publicado nunca. Descartarla la borra del todo. ¿Seguro?')) return;
      estado.borrador.characters = estado.borrador.characters.filter(x => x.id !== c.id);
      guardarBorrador();
      return ir('lista');
    }
    if (!confirm(`Devolver «${c.name}» a como está publicada, perdiendo los cambios del borrador. ¿Seguro?`)) return;
    const i = estado.borrador.characters.findIndex(x => x.id === c.id);
    estado.borrador.characters[i] = JSON.parse(JSON.stringify(publicada));
    for (const ruta of [c.portraitSrc, c.mapSrc]) {
      if (ruta && estado.imagenes[ruta]) { await store.borrarImagen(ruta); delete estado.imagenes[ruta]; }
    }
    guardarBorrador();
    ir('editor', c.id);
  };

  pintarPrevia();

  return h('div', {},
    cabecera({ titulo: c.name || 'Tarjeta nueva', volver: () => ir('lista') }),
    h('div', { class: 'contenido' },
      h('div', { class: 'editor' },
        h('div', { class: 'editor-form' },
          bloqueIdentidad, bloqueTexto, bloqueLinea, bloqueImagenes, bloquePasajes,
          h('div', { style: 'display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap' },
            h('button', { class: 'btn btn-alto', onclick: descartar }, 'Descartar cambios'),
            h('button', { class: 'btn btn-primary btn-alto', onclick: () => ir('lista') }, 'Guardar y volver')),
        ),
        previa,
      ),
    ),
  );
}

function bloqueDeLinea(c, cambiar, pintarPrevia) {
  const life = c.life || {};
  const barra = h('div', { class: 'via' });
  const rotulo = h('div', { style: 'font-size:10.5px;font-weight:700;color:var(--acento);text-align:center' });

  const pintarBarra = () => {
    vaciar(barra);
    const l = c.life;
    if (l && typeof l.start === 'number' && typeof l.end === 'number') {
      const span = LINEA.max - LINEA.min;
      const izq = Math.max(0, Math.min(100, ((l.start - LINEA.min) / span) * 100));
      const ancho = Math.max(1.2, Math.min(100 - izq, ((l.end - l.start) / span) * 100));
      barra.appendChild(h('div', { class: 'via-tramo', style: `left:${izq.toFixed(1)}%;width:${ancho.toFixed(1)}%` }));
      rotulo.textContent = vidaTexto(l);
    } else {
      rotulo.textContent = 'Sin fechas: no aparecerá en la línea de tiempo';
    }
  };

  const escribirVida = () => {
    const s = parseInt(inicio.value, 10), e = parseInt(fin.value, 10);
    if (Number.isNaN(s) || Number.isNaN(e)) { delete c.life; }
    else {
      c.life = { start: eraInicio.value === 'aec' ? -Math.abs(s) : Math.abs(s),
                 end: eraFin.value === 'aec' ? -Math.abs(e) : Math.abs(e) };
      if (aprox.checked) c.life.approx = true;
      colocarPorFecha(c);
    }
    guardarBorrador(); pintarBarra(); pintarPrevia();
  };

  const inicio = h('input', { class: 'campo num', type: 'number', style: 'width:92px',
    value: typeof life.start === 'number' ? Math.abs(life.start) : '', oninput: escribirVida });
  const fin = h('input', { class: 'campo num', type: 'number', style: 'width:92px',
    value: typeof life.end === 'number' ? Math.abs(life.end) : '', oninput: escribirVida });
  const eraInicio = h('select', { class: 'campo', style: 'width:auto', onchange: escribirVida },
    h('option', { value: 'aec', selected: !(life.start > 0) }, 'a.e.c.'),
    h('option', { value: 'ec', selected: life.start > 0 }, 'e.c.'));
  const eraFin = h('select', { class: 'campo', style: 'width:auto', onchange: escribirVida },
    h('option', { value: 'aec', selected: !(life.end > 0) }, 'a.e.c.'),
    h('option', { value: 'ec', selected: life.end > 0 }, 'e.c.'));
  const aprox = h('input', { type: 'checkbox', checked: !!life.approx, onchange: escribirVida,
    style: 'width:17px;height:17px;accent-color:var(--acento);cursor:pointer' });

  pintarBarra();

  return h('div', { class: 'tarjeta-panel' },
    h('div', { class: 'sechd' }, 'Línea de tiempo'),
    h('div', { style: 'display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap' },
      h('div', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Desde'),
        h('div', { style: 'display:flex;gap:7px' }, inicio, eraInicio)),
      h('div', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Hasta'),
        h('div', { style: 'display:flex;gap:7px' }, fin, eraFin)),
      h('label', { style: 'display:flex;align-items:center;gap:9px;height:36px;cursor:pointer' },
        aprox, h('span', { style: 'font-size:13px' }, 'Fechas aproximadas')),
    ),
    h('div', { style: 'font-size:11.5px;color:var(--tinta-2);margin-top:10px' },
      'Con las fechas puestas, una tarjeta nueva se coloca sola en su sitio del mazo. El orden se puede cambiar luego desde la lista.'),
    h('div', { style: 'margin-top:18px;padding:14px 16px 12px;background:var(--hueco);border-radius:12px' },
      barra,
      h('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:7px;font-size:10.5px;color:var(--tinta-2)' },
        h('span', { class: 'num' }, anyoTexto(LINEA.min)), rotulo, h('span', { class: 'num' }, anyoTexto(LINEA.max))),
    ),
  );
}

/**
 * Coloca una tarjeta NUEVA donde le toca por sus fechas, en vez de dejarla
 * siempre la última. No reordena el resto: el mazo no está estrictamente
 * ordenado por fecha (Ester va antes que Daniel) y esas decisiones se
 * respetan. Una tarjeta ya publicada, o una que se haya movido a mano desde
 * la lista, no se mueve nunca.
 */
function colocarPorFecha(c) {
  const publicada = (estado.publicado.characters || []).some(x => x.id === c.id);
  if (publicada || movidasAMano.has(c.id) || !c.life || typeof c.life.start !== 'number') return;
  const lista = estado.borrador.characters;
  const i = lista.indexOf(c);
  if (i < 0) return;
  lista.splice(i, 1);
  const destino = lista.findIndex(x => x.life && typeof x.life.start === 'number' && x.life.start > c.life.start);
  lista.splice(destino < 0 ? lista.length : destino, 0, c);
}

function campoImagen(c, tipo, pintarPrevia) {
  const esRetrato = tipo === 'portrait';
  const campo = esRetrato ? 'portraitSrc' : 'mapSrc';
  const zona = h('div', { style: 'display:flex;gap:12px;min-height:128px' });
  const entrada = h('input', { type: 'file', accept: 'image/*', style: 'display:none' });

  const pintar = () => {
    vaciar(zona);
    const ruta = c[campo];
    const url = urlImagen(ruta);
    const pendiente = ruta ? estado.imagenes[ruta] : null;
    const marco = esRetrato
      ? 'width:96px;height:128px'
      : 'width:128px;height:96px;align-self:flex-start';

    zona.appendChild(url
      ? h('img', { src: url, alt: '', style: `${marco};object-fit:cover;border-radius:12px;border:1px solid var(--borde);flex-shrink:0` })
      : h('div', { style: `${marco};border-radius:12px;border:1px dashed var(--borde);background:var(--hueco);color:var(--tinta-2);display:flex;align-items:center;justify-content:center;flex-shrink:0` },
          icono('imagen', 18)));

    zona.appendChild(h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;gap:10px' },
      h('div', {},
        h('div', { class: 'mono', style: 'font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' },
          ruta ? ruta.replace('assets/', '') : 'sin imagen'),
        h('div', { style: 'font-size:11.5px;color:var(--tinta-2);margin-top:3px' },
          pendiente ? `${pendiente.ancho} × ${pendiente.alto} · ${formatearPeso(pendiente.blob.size)} · sin publicar`
                    : (ruta ? 'ya publicada' : `se recorta y se reduce a ${IMAGES[tipo].maxW} × ${IMAGES[tipo].maxH} px al subirla`)),
        !esRetrato && ruta ? h('div', { style: 'font-size:11px;color:var(--acento);font-weight:700;margin-top:5px' },
          `Punto del mapa: ${c.mapPos || '50% 50%'}`) : null,
      ),
      h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' },
        h('button', { class: 'btn btn-bajo', onclick: () => entrada.click() }, ruta ? 'Reemplazar' : 'Subir'),
        ruta ? h('button', { class: 'btn btn-bajo', onclick: () => reencuadrar() }, 'Reencuadrar') : null,
        ruta ? h('button', { class: 'btn btn-bajo', onclick: () => quitar() }, 'Quitar') : null,
      ),
    ));
  };

  const quitar = async () => {
    const ruta = c[campo];
    if (ruta && estado.imagenes[ruta]) { await store.borrarImagen(ruta); delete estado.imagenes[ruta]; }
    delete estado.originales[ruta];
    delete c[campo];
    guardarBorrador(); pintar(); pintarPrevia(); actualizarCabecera();
  };

  const guardar = async (recorte, original) => {
    const ruta = `${PATHS.assets}/${esRetrato ? 'portrait' : 'mapa'}-${c.id}.${IMAGES[tipo].ext}`;
    const anterior = estado.imagenes[ruta];
    if (anterior && anterior._url) URL.revokeObjectURL(anterior._url);
    await store.guardarImagen(ruta, recorte);
    estado.imagenes[ruta] = recorte;
    if (original) estado.originales[ruta] = original;
    c[campo] = ruta;
    // Ya viene recortada a la proporción de la tarjeta: no hay que desplazarla.
    if (!esRetrato) c.mapPos = '50% 50%';
    guardarBorrador(); pintar(); pintarPrevia(); actualizarCabecera();
  };

  entrada.addEventListener('change', async () => {
    const archivo = entrada.files && entrada.files[0];
    if (!archivo) return;
    entrada.value = '';
    try {
      const recorte = await pedirEncuadre(archivo, tipo);
      if (recorte) await guardar(recorte, archivo);
    } catch (err) {
      alert(`No se ha podido preparar la imagen: ${err.message}`);
    }
  });

  const reencuadrar = async () => {
    const ruta = c[campo];
    if (!ruta) return;
    try {
      // El original de esta sesión permite recortar sin perder calidad; si la
      // imagen viene de una publicación anterior, se recorta lo que hay en la web.
      const pendiente = estado.imagenes[ruta];
      const fuente = estado.originales[ruta] || (pendiente && pendiente.blob) || urlImagen(ruta);
      const recorte = await pedirEncuadre(fuente, tipo);
      if (recorte) await guardar(recorte, estado.originales[ruta]);
    } catch (err) {
      alert(`No se ha podido reencuadrar la imagen: ${err.message}`);
    }
  };

  pintar();
  return h('div', { class: 'campo-grupo' },
    h('span', { class: 'label' }, esRetrato ? 'Retrato · vertical 3:4' : 'Mapa · apaisado 4:3'),
    zona, entrada);
}

function bloqueDePasajes(c, pintarPrevia) {
  const libros = librosPorId();
  const lista = h('div', { style: 'display:flex;flex-direction:column;gap:9px' });
  const urlEjemplo = h('span', { class: 'mono', style: 'font-size:10.5px;color:var(--tinta-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap' });

  const pintar = () => {
    vaciar(lista);
    (c.passages || []).forEach((p, i) => lista.appendChild(filaPasaje(p, i)));
    const ultimo = (c.passages || [])[0];
    const libro = ultimo && libros[ultimo.book];
    urlEjemplo.textContent = libro ? `jw.org/es/biblioteca/biblia/nwt/libros/${libro.slug}/${ultimo.chapter}/` : '';
    if (!c.passages || !c.passages.length) {
      lista.appendChild(h('div', { style: 'font-size:12.5px;color:var(--tinta-2)' }, 'Todavía no hay pasajes.'));
    }
  };

  const filaPasaje = (p, i) => {
    const etiquetaAutomatica = (pp) => {
      const b = libros[pp.book];
      return b ? `${b.name} ${pp.chapter}` : '';
    };
    const rotulo = h('input', { class: 'campo rotulo', type: 'text', value: p.label || '',
      placeholder: 'Texto visible en la tarjeta',
      oninput: (e) => { p.label = e.target.value; guardarBorrador(); pintarPrevia(); } });

    const sincronizarRotulo = (anterior) => {
      // Solo se reescribe el rótulo si el usuario no lo ha personalizado.
      if (!p.label || p.label === anterior) { p.label = etiquetaAutomatica(p); rotulo.value = p.label; }
    };
    const cap = h('input', { class: 'campo cap num', type: 'number', min: 1, value: p.chapter || 1,
      oninput: (e) => {
        const antes = etiquetaAutomatica(p);
        const b = libros[p.book];
        let n = parseInt(e.target.value, 10);
        if (Number.isNaN(n) || n < 1) n = 1;
        if (b && n > b.chapters) { n = b.chapters; e.target.value = n; }
        p.chapter = n;
        sincronizarRotulo(antes);
        guardarBorrador(); pintar(); pintarPrevia();
      } });

    return h('div', { class: 'fila-pasaje' },
      h('span', { style: 'display:inline-flex;color:var(--borde);flex-shrink:0' }, icono('agarre', 15)),
      h('select', { class: 'campo', onchange: (e) => {
        const antes = etiquetaAutomatica(p);
        p.book = e.target.value;
        const b = libros[p.book];
        if (b && p.chapter > b.chapters) { p.chapter = b.chapters; cap.value = b.chapters; }
        sincronizarRotulo(antes);
        guardarBorrador(); pintar(); pintarPrevia();
      } }, ...estado.libros.map(b => h('option', { value: b.id, selected: p.book === b.id }, b.name))),
      cap, rotulo,
      h('button', { class: 'icono-btn', title: 'Quitar pasaje', onclick: () => {
        c.passages.splice(i, 1); guardarBorrador(); pintar(); pintarPrevia();
      } }, icono('equis')),
    );
  };

  const añadir = () => {
    c.passages = c.passages || [];
    const primero = estado.libros[0];
    c.passages.push({ book: primero.id, chapter: 1, label: `${primero.name} 1` });
    guardarBorrador(); pintar(); pintarPrevia();
  };

  pintar();
  return h('div', { class: 'tarjeta-panel' },
    h('div', { style: 'display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:14px' },
      h('span', { class: 'sechd', style: 'margin-bottom:0' }, 'Aparece en'),
      h('span', { style: 'font-size:11px;color:var(--tinta-2)' }, 'El enlace a jw.org se construye solo')),
    lista,
    h('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:13px;flex-wrap:wrap' },
      h('button', { class: 'btn btn-punteado', onclick: añadir }, icono('mas', 14), 'Añadir pasaje'),
      urlEjemplo),
  );
}

function vistaPrevia(c) {
  const libros = librosPorId();
  const era = (estado.borrador.eras || []).find(e => e.id === c.eraId);
  const urlMapa = urlImagen(c.mapSrc);
  const [px, py] = (c.mapPos || '50% 50%').split(' ');

  const linea = h('div', { class: 'previa-linea' });
  const via = h('div', { class: 'via' });
  if (c.life && typeof c.life.start === 'number') {
    const span = LINEA.max - LINEA.min;
    const izq = Math.max(0, Math.min(100, ((c.life.start - LINEA.min) / span) * 100));
    const ancho = Math.max(1.2, Math.min(100 - izq, ((c.life.end - c.life.start) / span) * 100));
    via.appendChild(h('div', { class: 'via-tramo', style: `left:${izq.toFixed(1)}%;width:${ancho.toFixed(1)}%` }));
  }
  linea.append(via,
    h('div', { style: 'font-size:10.5px;font-weight:700;color:var(--acento);text-align:center' },
      c.life ? `Vivió hacia ${vidaTexto(c.life).replace('≈ ', '')}` : 'Sin fechas'),
    h('div', { style: 'display:flex;justify-content:space-between;font-size:9.5px;color:var(--tinta-2)' },
      h('span', {}, anyoTexto(LINEA.min)), h('span', {}, anyoTexto(LINEA.max))));

  const seccion = (rotulo, cuerpo) => h('div', {},
    h('div', { class: 'previa-rotulo' }, rotulo),
    h('div', { class: 'previa-texto' }, cuerpo));

  return h('div', { style: 'display:flex;flex-direction:column;gap:12px' },
    h('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:10px' },
      h('span', { class: 'label' }, 'Vista previa · reverso'),
      era ? h('span', { class: 'chip chip-neutro' }, era.label) : null),
    h('div', { class: 'previa-tarjeta' },
      h('div', { class: 'previa-nombre' }, c.name || 'Sin nombre'),
      urlMapa
        ? h('div', { class: 'previa-mapa' },
            h('img', { src: urlMapa, alt: '' }),
            h('span', { class: 'previa-punto', style: `left:${px};top:${py}` }))
        : h('div', { class: 'previa-mapa', style: 'display:flex;align-items:center;justify-content:center;color:var(--tinta-2);font-size:11px' }, 'sin mapa'),
      seccion('Dónde vivió', c.place || '—'),
      seccion('Por qué se le conoce', c.knownFor || '—'),
      h('div', {},
        h('div', { class: 'previa-rotulo' }, 'Aparece en'),
        h('div', { style: 'display:flex;flex-direction:column;gap:6px;margin-top:6px' },
          ...(c.passages || []).map(p => h('span', { class: 'previa-pasaje' },
            `${p.label || (libros[p.book] ? `${libros[p.book].name} ${p.chapter}` : '')} ↗`)))),
      linea,
    ),
    aviso('Así queda en el mazo. Sigue siendo un borrador en este navegador hasta que pulses Publicar.'),
  );
}

// ---------------------------------------------------------------- eras

function pantallaEras() {
  const eras = estado.borrador.eras || [];
  const uso = {};
  for (const c of estado.borrador.characters || []) uso[c.eraId] = (uso[c.eraId] || 0) + 1;

  const mover = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= eras.length) return;
    [eras[i], eras[j]] = [eras[j], eras[i]];
    guardarBorrador(); render();
  };

  const filas = eras.map((e, i) => h('div', { class: 'fila' },
    h('span', { style: 'display:inline-flex;color:var(--borde);flex-shrink:0' }, icono('agarre', 15)),
    h('span', { class: 'num', style: 'width:22px;flex-shrink:0;font-size:11.5px;font-weight:700;color:var(--tinta-2)' }, i + 1),
    h('input', { class: 'campo', style: 'flex:1;min-width:0;font-weight:700', value: e.label,
      oninput: (ev) => { e.label = ev.target.value; guardarBorrador(); } }),
    h('input', { class: 'campo', style: 'width:200px;flex-shrink:0', value: e.range,
      oninput: (ev) => { e.range = ev.target.value; guardarBorrador(); } }),
    h('div', { style: 'width:104px;flex-shrink:0' },
      h('span', { class: 'chip chip-neutro' }, `${uso[e.id] || 0} ${uso[e.id] === 1 ? 'tarjeta' : 'tarjetas'}`)),
    h('div', { style: 'width:96px;flex-shrink:0;display:flex;gap:2px;justify-content:flex-end' },
      h('button', { class: 'icono-btn', title: 'Subir', disabled: i === 0, onclick: () => mover(i, -1) },
        h('span', { style: 'display:inline-flex;transform:rotate(90deg)' }, icono('atras', 15))),
      h('button', { class: 'icono-btn', title: 'Bajar', disabled: i === eras.length - 1, onclick: () => mover(i, 1) },
        h('span', { style: 'display:inline-flex;transform:rotate(-90deg)' }, icono('atras', 15))),
      h('button', {
        class: 'icono-btn', disabled: !!uso[e.id],
        title: uso[e.id] ? 'Tiene tarjetas: muévelas antes a otra era' : 'Borrar era',
        onclick: () => { if (!uso[e.id]) { estado.borrador.eras = eras.filter(x => x.id !== e.id); guardarBorrador(); render(); } },
      }, icono('papelera'))),
  ));

  const nombreNuevo = h('input', { class: 'campo', placeholder: 'Profetas menores' });
  const rangoNuevo = h('input', { class: 'campo', placeholder: '~840–450 a.e.c.' });
  const añadir = () => {
    const label = nombreNuevo.value.trim();
    if (!label) { nombreNuevo.focus(); return; }
    const id = identificador(label, eras.map(e => e.id));
    eras.push({ id, label, range: rangoNuevo.value.trim() });
    guardarBorrador(); render();
  };

  return h('div', {},
    cabecera(),
    h('div', { class: 'contenido', style: 'display:flex;flex-direction:column;gap:16px' },
      h('div', { style: 'display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap' },
        h('div', {},
          h('div', { style: 'font-size:19px;font-weight:800;line-height:1.2' }, 'Eras'),
          h('div', { style: 'font-size:12.5px;color:var(--tinta-2);margin-top:3px' },
            'Ordenan el mazo y los filtros de la cabecera.')),
        h('div', { class: 'segmentado' },
          h('button', { onclick: () => ir('lista') }, 'Tarjetas'),
          h('button', { class: 'activo' }, 'Eras')),
      ),
      h('div', { class: 'lista' }, filas),
      h('div', { style: 'background:var(--superficie);border:1px dashed var(--acento);border-radius:16px;padding:18px 20px;display:flex;flex-direction:column;gap:14px' },
        h('div', { class: 'sechd', style: 'margin-bottom:0' }, 'Nueva era'),
        h('div', { style: 'display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap' },
          h('label', { class: 'campo-grupo', style: 'flex:1;min-width:180px' }, h('span', { class: 'label' }, 'Nombre'), nombreNuevo),
          h('label', { class: 'campo-grupo', style: 'width:220px' }, h('span', { class: 'label' }, 'Rango que se muestra'), rangoNuevo),
          h('button', { class: 'btn btn-primary', style: 'height:36px', onclick: añadir }, 'Añadir'))),
      aviso('Una era con tarjetas no se puede borrar. Mueve antes esas tarjetas a otra era.'),
    ),
  );
}

// ---------------------------------------------------------------- publicar

function abrirPublicar() {
  const r = modelo.resumen(estado.borrador, estado.publicado);
  if (!modelo.hayCambios(r)) return;

  const sinNombre = (estado.borrador.characters || []).filter(c => !c.name || !c.name.trim());
  const erasValidas = new Set((estado.borrador.eras || []).map(e => e.id));
  const sinEra = (estado.borrador.characters || []).filter(c => !erasValidas.has(c.eraId));
  const mensaje = h('input', { class: 'campo mono', value: modelo.mensajePropuesto(r), style: 'height:auto;padding:9px 12px' });
  const zona = h('div');

  const linea = (etiqueta, tarjeta, detalle, acento = true) => h('div', {
    style: 'display:flex;align-items:center;gap:12px;background:var(--campo);padding:11px 14px',
  },
    h('span', {
      class: `chip ${acento ? 'chip-acento' : 'chip-neutro'}`,
      style: 'width:82px;flex-shrink:0;justify-content:center;font-size:10.5px;font-weight:800;letter-spacing:0.04em',
    }, etiqueta),
    h('div', { style: 'flex:1;min-width:0' },
      h('div', { style: 'font-size:13.5px;font-weight:700' }, tarjeta),
      h('div', { style: 'font-size:11.5px;color:var(--tinta-2);margin-top:1px' }, detalle)));

  const lineas = [
    ...r.nuevas.map(c => linea('NUEVA', c.name || c.id, 'Tarjeta nueva')),
    ...r.editadas.map(e => linea(e.tarjeta.hidden ? 'OCULTA' : 'EDITADA', e.tarjeta.name || e.tarjeta.id,
      modelo.nombresDeCampos(e.campos), !e.tarjeta.hidden)),
    ...r.borradas.map(c => linea('BORRADA', c.name || c.id, 'Desaparece del mazo', false)),
    ...(r.erasCambiadas ? [linea('ERAS', 'Lista de eras', 'Nombres, rangos u orden')] : []),
    ...(r.ordenCambiado && !r.nuevas.length ? [linea('ORDEN', 'Mazo', 'Cambia el orden de las tarjetas')] : []),
  ];

  const nImagenes = Object.keys(estado.imagenes).length;
  const peso = Object.values(estado.imagenes).reduce((n, x) => n + (x.blob ? x.blob.size : 0), 0);

  const publicar = async () => {
    if (estado.publicando) return;
    estado.publicando = true;
    vaciar(zona).appendChild(aviso('Publicando… no cierres la pestaña.'));
    try {
      const { textos, imagenes, borrados } = modelo.ficherosDelCommit(estado.borrador, estado.publicado, estado.imagenes);
      const escrituras = [
        ...textos.map(t => ({ path: t.path, base64: gh.textoABase64(t.texto) })),
      ];
      for (const [ruta, registro] of imagenes) {
        escrituras.push({ path: ruta, base64: await gh.blobABase64(registro.blob) });
      }
      const res = await gh.publicar({
        mensaje: mensaje.value.trim() || 'Actualiza las tarjetas',
        escrituras, borrados, baseCommitSha: estado.baseCommitSha,
      });
      // Lo publicado pasa a ser el borrador, y las imágenes dejan de estar pendientes.
      estado.publicado = JSON.parse(JSON.stringify(estado.borrador));
      estado.baseCommitSha = res.commitSha;
      // No se revocan las URL: durante el minuto que tarda la reconstrucción,
      // el fichero todavía no existe en la web y la miniatura saldría rota.
      Object.assign(estado.reciennPublicadas, estado.imagenes);
      await store.vaciarImagenes();
      estado.imagenes = {};
      await store.guardarPublicado(estado.publicado);
      await store.guardarBaseSha(res.commitSha);
      estado.publicando = false;
      cerrarModal();
      render();
      mostrarBanda(`Publicado. GitHub Pages tarda alrededor de un minuto en reconstruir.`);
    } catch (err) {
      estado.publicando = false;
      vaciar(zona).appendChild(aviso(err.message, 'error'));
    }
  };

  const modal = h('div', { class: 'velo', onclick: (e) => { if (e.target === modal) cerrarModal(); } },
    h('div', { class: 'modal' },
      h('div', { style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px' },
        h('div', { style: 'display:flex;align-items:center;gap:11px' },
          h('div', { class: 'marca-icono', style: 'width:36px;height:36px;border-radius:12px' }, icono('subir', 18)),
          h('div', {},
            h('div', { style: 'font-size:16px;font-weight:800;line-height:1.2' }, 'Publicar cambios'),
            h('div', { style: 'font-size:12px;color:var(--tinta-2);margin-top:2px' },
              h('span', {}, 'Un solo commit en '), h('span', { class: 'mono', style: 'font-size:11px' }, REPO.branch)))),
        h('button', { class: 'icono-btn', onclick: cerrarModal }, icono('equis', 16))),

      sinNombre.length ? aviso(`${sinNombre.length} tarjeta${sinNombre.length > 1 ? 's' : ''} sin nombre. Se publicará${sinNombre.length > 1 ? 'n' : ''} igual, pero saldrá${sinNombre.length > 1 ? 'n' : ''} en blanco en el mazo.`, 'error') : null,
      sinEra.length ? aviso(`Sin era: ${sinEra.map(c => c.name || c.id).join(', ')}. No aparecerá${sinEra.length > 1 ? 'n' : ''} en los filtros ni en la línea de tiempo.`, 'error') : null,

      h('div', { style: 'display:flex;flex-direction:column;gap:11px' },
        h('span', { class: 'label' }, `Se van a publicar ${lineas.length} ${lineas.length === 1 ? 'cambio' : 'cambios'}`),
        h('div', { style: 'display:flex;flex-direction:column;gap:1px;background:var(--borde-suave);border:1px solid var(--borde);border-radius:13px;overflow:hidden' }, ...lineas),
        h('div', { style: 'display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--tinta-2)' },
          icono('commit', 13),
          `1 archivo de datos${nImagenes ? ` · ${nImagenes} ${nImagenes === 1 ? 'imagen' : 'imágenes'} · ${formatearPeso(peso)}, ya reducidas` : ''}`)),

      h('label', { class: 'campo-grupo' }, h('span', { class: 'label' }, 'Mensaje del commit'), mensaje),
      zona,
      aviso('GitHub Pages tarda alrededor de un minuto en reconstruir. Hasta entonces la web sigue mostrando la versión anterior.'),
      h('div', { style: 'display:flex;gap:10px;justify-content:flex-end' },
        h('button', { class: 'btn btn-alto', onclick: cerrarModal }, 'Cancelar'),
        h('button', { class: 'btn btn-primary btn-alto', onclick: publicar },
          `Publicar ${lineas.length === 1 ? 'el cambio' : `los ${lineas.length} cambios`}`)),
    ));

  document.body.appendChild(modal);
  document.body.dataset.modal = '1';
}

function cerrarModal() {
  document.querySelectorAll('.velo').forEach(v => v.remove());
  delete document.body.dataset.modal;
}

function mostrarBanda(texto) {
  const banda = h('div', {
    style: 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;background:var(--tinta);color:oklch(0.97 0.01 80);padding:12px 20px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:var(--sombra-alta)',
  }, texto);
  document.body.appendChild(banda);
  setTimeout(() => banda.remove(), 6000);
}

// ---------------------------------------------------------------- render

function actualizarCabecera() {
  const vieja = raiz.querySelector('.topbar');
  if (!vieja) return;
  const titulo = estado.pantalla === 'editor' && tarjetaPorId(estado.editandoId)
    ? (tarjetaPorId(estado.editandoId).name || 'Tarjeta nueva') : undefined;
  const volver = estado.pantalla === 'editor' ? () => ir('lista') : undefined;
  vieja.replaceWith(cabecera({ titulo, volver }));
}

function render() {
  vaciar(raiz);
  if (estado.cargando) { raiz.appendChild(h('div', { class: 'cargando' }, 'Leyendo el repositorio…')); return; }
  if (estado.pantalla === 'entrar') return void raiz.appendChild(pantallaEntrar());
  if (estado.pantalla === 'token') return void raiz.appendChild(pantallaToken());
  if (!estado.borrador) {
    raiz.appendChild(h('div', { class: 'cargando' },
      estado.error ? `No se han podido leer los datos: ${estado.error}` : 'Cargando…'));
    return;
  }
  if (estado.pantalla === 'editor') return void raiz.appendChild(pantallaEditor());
  if (estado.pantalla === 'eras') return void raiz.appendChild(pantallaEras());
  raiz.appendChild(pantallaLista());
}

// refresca el "guardado hace…" sin volver a montar la pantalla
setInterval(() => {
  if (estado.pantalla === 'lista' && estado.guardadoEn) {
    const el = [...raiz.querySelectorAll('span')].find(s => s.textContent.startsWith('Borrador guardado'));
    if (el) el.lastChild.textContent = ` Borrador guardado ${textoRelativo(estado.guardadoEn)}`;
  }
}, 15000);

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });

arrancar();
