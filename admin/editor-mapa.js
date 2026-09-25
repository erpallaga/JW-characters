// Editor de mapas del panel: se eligen los lugares y sale el PNG.
//
// Dibuja con el mismo admin/mapa.js que el generador por lotes de tools/, así
// que un mapa retocado aquí sale igual que si se hubiera generado por consola.

import { h, vaciar, icono } from './ui.js';
import { dibujar, resolverLugares, LIENZO } from './mapa.js';
import { aPngIndexado } from './png.js';

let datos = null;

async function cargarDatos() {
  if (datos) return datos;
  const [paises, lagos, lugares] = await Promise.all(
    ['data/geo/paises.json', 'data/geo/lagos.json', 'data/lugares.json']
      .map(u => fetch(u).then(r => {
        if (!r.ok) throw new Error(`no se ha podido cargar ${u}`);
        return r.json();
      })));
  datos = { geo: { paises, lagos }, lugares };
  return datos;
}

/**
 * Abre el editor y resuelve cuando se acepta o se cancela.
 *
 * @param {object} personaje  la tarjeta del borrador
 * @returns {Promise<{spec: object, blob: Blob, ancho: number, alto: number}|null>}
 */
export async function abrirEditorDeMapa(personaje) {
  const { geo, lugares: nomenclator } = await cargarDatos();

  // Copia de trabajo: si se cancela, la tarjeta no se entera de nada.
  const spec = JSON.parse(JSON.stringify(personaje.map || { lugares: [] }));
  spec.lugares = spec.lugares || [];

  const lienzo = h('canvas', {
    width: LIENZO.ancho, height: LIENZO.alto,
    style: 'display:block;width:100%;height:auto',
  });
  const ctx = lienzo.getContext('2d');

  const listaLugares = h('div', { style: 'display:flex;flex-direction:column;gap:6px' });
  const aviso = h('div', { style: 'font-size:11.5px;color:var(--tinta-2)' });

  const repintar = () => {
    let resueltos;
    try {
      resueltos = resolverLugares(spec, nomenclator);
    } catch (err) {
      aviso.textContent = err.message;
      return;
    }
    // Sin encuadre calculado aparte: dibujar() mide las etiquetas con la misma
    // letra con que las pinta, igual que el generador por lotes.
    const marco = dibujar(ctx, geo,
      { lugares: resueltos, ruta: !!spec.ruta, curva: spec.curva, zoom: spec.zoom, centro: spec.centro });
    aviso.textContent = resueltos.length
      ? `${resueltos.length} lugar${resueltos.length > 1 ? 'es' : ''} · ${Math.round(LIENZO.ancho / (marco.k * Math.PI / 180))}° de ancho`
      : 'Sin lugares: saldrá solo el mapa de fondo, sin marcadores.';
    pintarLista();
  };

  // Con `etiquetas`, solo los lugares que nombra salen rotulados; los demás
  // quedan como punto menor. Sin ella se rotulan todos. Un lugar puesto a mano
  // no tiene id y va siempre rotulado.
  const idDe = entrada => (typeof entrada === 'string' ? entrada : entrada.id);
  const rotulado = entrada => {
    const id = idDe(entrada);
    return !id || !spec.etiquetas || spec.etiquetas.includes(id);
  };
  const alternarRotulo = entrada => {
    const id = idDe(entrada);
    if (!id) return;
    if (!spec.etiquetas) spec.etiquetas = [...new Set(spec.lugares.map(idDe).filter(Boolean))];
    spec.etiquetas = spec.etiquetas.includes(id)
      ? spec.etiquetas.filter(x => x !== id)
      : [...spec.etiquetas, id];
    repintar();
  };
  // Quitar un lugar no puede dejar su id en `etiquetas`: tools/comprobar-mapas
  // lo da por error, porque pide un rótulo para algo que no está en el mapa.
  const limpiarEtiquetas = () => {
    if (!spec.etiquetas) return;
    const presentes = new Set(spec.lugares.map(idDe).filter(Boolean));
    spec.etiquetas = spec.etiquetas.filter(id => presentes.has(id));
  };

  const pintarLista = () => {
    vaciar(listaLugares);
    if (!spec.lugares.length) {
      listaLugares.appendChild(h('div', { style: 'font-size:12.5px;color:var(--tinta-2);padding:2px 0' },
        'Todavía no hay lugares.'));
      return;
    }
    spec.lugares.forEach((entrada, i) => {
      const nombre = typeof entrada === 'string'
        ? (nomenclator.find(l => l.id === entrada) || {}).label || entrada
        : entrada.label || entrada.id;
      listaLugares.appendChild(h('div', {
        style: 'display:flex;align-items:center;gap:8px;border:1px solid var(--borde);border-radius:10px;padding:6px 8px',
      },
        h('span', { style: 'flex:1;font-size:12.5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, nombre),
        h('label', {
          style: 'display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--tinta-2);flex-shrink:0',
          title: idDe(entrada) ? 'Escribir el nombre en el mapa, o dejarlo como punto menor'
                               : 'Un lugar puesto a mano lleva siempre su nombre',
        },
          h('input', {
            type: 'checkbox', checked: rotulado(entrada), disabled: !idDe(entrada),
            onchange: () => alternarRotulo(entrada),
          }),
          'nombre'),
        h('button', {
          class: 'icono-btn', title: 'Subir', disabled: i === 0,
          onclick: () => { mover(i, -1); },
        }, '↑'),
        h('button', {
          class: 'icono-btn', title: 'Bajar', disabled: i === spec.lugares.length - 1,
          onclick: () => { mover(i, 1); },
        }, '↓'),
        h('button', {
          class: 'icono-btn', title: 'Quitar',
          onclick: () => { spec.lugares.splice(i, 1); limpiarEtiquetas(); repintar(); },
        }, icono('equis', 13))));
    });
  };

  const mover = (i, paso) => {
    const [x] = spec.lugares.splice(i, 1);
    spec.lugares.splice(i + paso, 0, x);
    repintar();
  };

  const selector = h('select', { class: 'campo' },
    h('option', { value: '' }, 'Añadir un lugar…'),
    ...nomenclator.map(l => h('option', { value: l.id }, l.label)),
    h('option', { value: '__otro' }, 'Otro lugar (a mano)…'));

  selector.addEventListener('change', () => {
    const v = selector.value;
    selector.value = '';
    if (!v) return;
    if (v === '__otro') { manual.hidden = false; return; }
    spec.lugares.push(v);
    // Un lugar recién añadido sale con su nombre; se puede dejar en punto después.
    if (spec.etiquetas && !spec.etiquetas.includes(v)) spec.etiquetas.push(v);
    repintar();
  });

  const mNombre = h('input', { class: 'campo', placeholder: 'Nombre' });
  const mLat = h('input', { class: 'campo', placeholder: 'Latitud', inputmode: 'decimal' });
  const mLon = h('input', { class: 'campo', placeholder: 'Longitud', inputmode: 'decimal' });
  const manual = h('div', { hidden: true, style: 'display:flex;gap:6px;align-items:center;margin-top:6px' },
    mNombre, mLat, mLon,
    h('button', {
      class: 'btn btn-bajo',
      onclick: () => {
        const lat = parseFloat(mLat.value), lon = parseFloat(mLon.value);
        if (!mNombre.value.trim() || !isFinite(lat) || !isFinite(lon)) {
          aviso.textContent = 'Para un lugar a mano hacen falta nombre, latitud y longitud.';
          return;
        }
        spec.lugares.push({ label: mNombre.value.trim(), lat, lon });
        mNombre.value = mLat.value = mLon.value = '';
        manual.hidden = true;
        repintar();
      },
    }, 'Añadir'));

  const ruta = h('input', { type: 'checkbox', checked: !!spec.ruta });
  ruta.addEventListener('change', () => { spec.ruta = ruta.checked; repintar(); });

  const zoomAuto = h('input', { type: 'checkbox', checked: !spec.zoom });
  const zoom = h('input', {
    type: 'range', min: 13, max: 175, step: 1, value: spec.zoom || 60,
    style: 'flex:1', disabled: !spec.zoom,
  });
  zoomAuto.addEventListener('change', () => {
    zoom.disabled = zoomAuto.checked;
    spec.zoom = zoomAuto.checked ? undefined : Number(zoom.value);
    repintar();
  });
  zoom.addEventListener('input', () => { spec.zoom = Number(zoom.value); repintar(); });

  return new Promise(resolver => {
    let terminado = false;
    const cerrar = respuesta => {
      if (terminado) return;
      terminado = true;
      document.removeEventListener('keydown', alPulsar);
      velo.remove();
      delete document.body.dataset.modal;
      resolver(respuesta);
    };
    // Escape cierra como Cancelar. Sin esto, el Escape general del panel
    // quitaba el cuadro de la pantalla pero dejaba esta promesa sin resolver.
    const alPulsar = e => { if (e.key === 'Escape') cerrar(null); };

    const aceptar = async () => {
      try {
        const bytes = await aPngIndexado(ctx);
        cerrar({
          spec: { ...spec, lugares: spec.lugares },
          blob: new Blob([bytes], { type: 'image/png' }),
          ancho: LIENZO.ancho,
          alto: LIENZO.alto,
        });
      } catch (err) {
        aviso.textContent = `No se ha podido guardar el mapa: ${err.message}`;
      }
    };

    const velo = h('div', { class: 'velo', onclick: e => { if (e.target === velo) cerrar(null); } },
      h('div', { class: 'modal', style: 'max-width:620px' },
        h('div', { style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px' },
          h('div', {},
            h('div', { style: 'font-size:16px;font-weight:800;line-height:1.2' }, 'Generar el mapa'),
            h('div', { style: 'font-size:12px;color:var(--tinta-2);margin-top:2px' },
              `Para «${personaje.name || personaje.id}»`)),
          h('button', { class: 'icono-btn', onclick: () => cerrar(null) }, icono('equis', 16))),

        // La tarjeta recorta el mapa: la franja clara marca lo que se verá.
        h('div', { style: 'position:relative;border:1px solid var(--borde);border-radius:12px;overflow:hidden' },
          lienzo,
          h('div', {
            style: 'position:absolute;inset:0;pointer-events:none;' +
              'background:linear-gradient(90deg, rgba(40,25,10,.28) 0 22.5%, transparent 22.5% 77.5%, rgba(40,25,10,.28) 77.5% 100%)',
            title: 'Las bandas oscuras quedan fuera de la tarjeta',
          })),

        h('div', { class: 'campo-grupo' },
          h('span', { class: 'label' }, 'Lugares · en el orden del viaje'),
          listaLugares, selector, manual),

        h('div', { style: 'display:flex;gap:18px;flex-wrap:wrap;align-items:center' },
          h('label', { style: 'display:flex;align-items:center;gap:7px;font-size:12.5px' },
            ruta, 'Unirlos con la línea del viaje'),
          h('label', { style: 'display:flex;align-items:center;gap:7px;font-size:12.5px;flex:1;min-width:220px' },
            zoomAuto, 'Encuadre automático', zoom)),

        aviso,

        h('div', { style: 'display:flex;gap:10px;justify-content:flex-end' },
          h('button', { class: 'btn btn-alto', onclick: () => cerrar(null) }, 'Cancelar'),
          h('button', { class: 'btn btn-primary btn-alto', onclick: aceptar }, 'Usar este mapa'))));

    document.body.appendChild(velo);
    document.body.dataset.modal = '1';
    document.addEventListener('keydown', alPulsar);
    repintar();
  });
}
