// El cuadro de encuadre: se arrastra la imagen dentro del marco del mazo y se
// acerca o se aleja hasta que se ve lo que tiene que verse. Lo que sale de
// aquí ya está recortado a la proporción de la tarjeta, así que en el mazo no
// hay nada que ajustar después.

import { IMAGES } from './config.js';
import { h, icono } from './ui.js';
import * as img from './images.js';

const ZOOM_MAX = 4;
const LADO = 360;   // el lado largo del marco, en píxeles de pantalla

const ROTULOS = {
  portrait: { titulo: 'Encuadrar el retrato', marco: 'Así se ve en la tarjeta · vertical 3:4' },
  map: { titulo: 'Encuadrar el mapa', marco: 'Así se ve en el reverso · apaisado 4:3' },
};

/**
 * Abre el cuadro y espera. Resuelve con la imagen ya recortada, o con null si
 * se cancela.
 * @param {File|Blob|string} fuente  fichero recién elegido, o URL de una imagen ya subida
 * @param {'portrait'|'map'} tipo
 * @returns {Promise<{blob: Blob, ancho: number, alto: number}|null>}
 */
export async function pedirEncuadre(fuente, tipo) {
  const imagen = await img.cargarImagen(fuente);
  const rotulos = ROTULOS[tipo] || ROTULOS.portrait;
  const a = img.proporcion(tipo);
  const anchoMarco = a < 1 ? Math.round(LADO * a) : LADO;
  const altoMarco = a < 1 ? LADO : Math.round(LADO / a);

  const vista = { zoom: 1, cx: 0.5, cy: 0.5 };

  const lienzo = h('canvas', {
    width: anchoMarco * (window.devicePixelRatio || 1),
    height: altoMarco * (window.devicePixelRatio || 1),
    style: `width:${anchoMarco}px;height:${altoMarco}px;display:block;cursor:grab;touch-action:none;border-radius:12px`,
  });
  const ctx = lienzo.getContext('2d');
  const zoom = h('input', {
    type: 'range', min: '1', max: String(ZOOM_MAX), step: '0.01', value: '1',
    style: 'flex:1;accent-color:var(--acento);cursor:pointer',
  });
  const detalle = h('span', { class: 'num', style: 'font-size:11.5px;color:var(--tinta-2)' });

  const dibujar = () => {
    const rect = img.rectangulo(imagen, tipo, vista);
    img.pintar(ctx, imagen, rect, lienzo.width, lienzo.height);
    const salida = img.tamañoDeSalida(rect, tipo);
    detalle.textContent = `${salida.ancho} × ${salida.alto} px`
      + (salida.ancho < IMAGES[tipo].maxW ? ' · la imagen no da para más, no se agranda' : '');
  };

  // Arrastrar mueve la ventana por la foto: si llevas el dedo a la derecha,
  // aparece lo que quedaba fuera por la izquierda.
  lienzo.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    lienzo.setPointerCapture(e.pointerId);
    lienzo.style.cursor = 'grabbing';
    const rect = img.rectangulo(imagen, tipo, vista);
    const inicio = { x: e.clientX, y: e.clientY, cx: vista.cx, cy: vista.cy };

    const mover = (ev) => {
      const dx = (ev.clientX - inicio.x) / anchoMarco * (rect.sw / imagen.ancho);
      const dy = (ev.clientY - inicio.y) / altoMarco * (rect.sh / imagen.alto);
      const margenX = rect.sw / imagen.ancho / 2;
      const margenY = rect.sh / imagen.alto / 2;
      vista.cx = Math.max(margenX, Math.min(1 - margenX, inicio.cx - dx));
      vista.cy = Math.max(margenY, Math.min(1 - margenY, inicio.cy - dy));
      dibujar();
    };
    const soltar = () => {
      lienzo.style.cursor = 'grab';
      lienzo.removeEventListener('pointermove', mover);
      lienzo.removeEventListener('pointerup', soltar);
      lienzo.removeEventListener('pointercancel', soltar);
    };
    lienzo.addEventListener('pointermove', mover);
    lienzo.addEventListener('pointerup', soltar);
    lienzo.addEventListener('pointercancel', soltar);
  });

  lienzo.addEventListener('wheel', (e) => {
    e.preventDefault();
    vista.zoom = Math.max(1, Math.min(ZOOM_MAX, vista.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    zoom.value = String(vista.zoom);
    dibujar();
  });

  zoom.addEventListener('input', () => {
    vista.zoom = Number(zoom.value) || 1;
    dibujar();
  });

  return new Promise((resolve) => {
    let terminado = false;
    const cerrar = (resultado) => {
      if (terminado) return;
      terminado = true;
      document.removeEventListener('keydown', alPulsar);
      velo.remove();
      delete document.body.dataset.modal;
      imagen.liberar();
      resolve(resultado);
    };
    const alPulsar = (e) => { if (e.key === 'Escape') cerrar(null); };

    const aceptar = async () => {
      try {
        cerrar(await img.recortar(imagen, tipo, vista));
      } catch (err) {
        cerrar(null);
        alert(`No se ha podido recortar la imagen: ${err.message}`);
      }
    };

    const velo = h('div', { class: 'velo', onclick: (e) => { if (e.target === velo) cerrar(null); } },
      h('div', { class: 'modal', style: 'max-width:460px' },
        h('div', { style: 'display:flex;align-items:center;gap:11px' },
          h('div', { class: 'marca-icono', style: 'width:36px;height:36px;border-radius:12px' }, icono('imagen', 18)),
          h('div', {},
            h('div', { style: 'font-size:16px;font-weight:800;line-height:1.2' }, rotulos.titulo),
            h('div', { style: 'font-size:12px;color:var(--tinta-2);margin-top:2px' }, rotulos.marco))),

        h('div', { style: 'display:flex;justify-content:center' },
          h('div', { class: 'marco-encuadre', style: `width:${anchoMarco}px;height:${altoMarco}px` }, lienzo)),

        h('div', { style: 'display:flex;align-items:center;gap:12px' },
          h('span', { style: 'display:inline-flex;color:var(--tinta-2)' }, icono('lupa', 15)),
          zoom, detalle),

        h('div', { style: 'font-size:11.5px;color:var(--tinta-2);line-height:1.45' },
          'Arrastra la imagen para elegir qué se ve y usa la barra para acercarla. '
          + 'Se guarda ya recortada, así que en el mazo se verá exactamente esto.'),

        h('div', { style: 'display:flex;gap:10px;justify-content:flex-end' },
          h('button', { class: 'btn btn-alto', onclick: () => cerrar(null) }, 'Cancelar'),
          h('button', { class: 'btn btn-primary btn-alto', onclick: aceptar }, 'Usar este encuadre')),
      ));

    document.body.appendChild(velo);
    document.body.dataset.modal = '1';
    document.addEventListener('keydown', alPulsar);
    dibujar();
  });
}
