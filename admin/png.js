// Guarda un lienzo como PNG de paleta.
//
// El PNG que da `canvas.toBlob` es de color verdadero y pesa cuatro veces más
// de lo necesario: un mapa son cuatro manchas planas y unas letras, no una
// fotografía. Los 18 mapas originales venían indexados y rondaban los 10 KB,
// y estos hacen lo mismo. Vale igual en el navegador y en Node, porque los dos
// traen CompressionStream, que comprime justo en el formato que el PNG espera.

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{maxColores?: number}} [opciones]
 * @returns {Promise<Uint8Array>}
 */
export async function aPngIndexado(ctx, opciones = {}) {
  const maxColores = opciones.maxColores ?? 128;
  const { data, width, height } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  const cuenta = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const clave = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    cuenta.set(clave, (cuenta.get(clave) || 0) + 1);
  }
  const paleta = [...cuenta.entries()].sort((a, b) => b[1] - a[1]).slice(0, maxColores).map(e => e[0]);
  const rgb = paleta.map(c => [(c >> 16) & 255, (c >> 8) & 255, c & 255]);

  // Los colores planos entran directos por la tabla; solo los bordes suavizados
  // obligan a buscar el más parecido, y el resultado se guarda para el siguiente.
  const dondeVa = new Map(paleta.map((c, i) => [c, i]));
  const indices = new Uint8Array(width * height);
  for (let p = 0, i = 0; i < data.length; i += 4, p++) {
    const clave = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    let idx = dondeVa.get(clave);
    if (idx === undefined) {
      let mejor = 0, dist = Infinity;
      for (let j = 0; j < rgb.length; j++) {
        const d = (rgb[j][0] - data[i]) ** 2 + (rgb[j][1] - data[i + 1]) ** 2 + (rgb[j][2] - data[i + 2]) ** 2;
        if (d < dist) { dist = d; mejor = j; }
      }
      idx = mejor;
      dondeVa.set(clave, idx);
    }
    indices[p] = idx;
  }

  // Cada línea del PNG va precedida de su filtro; «0» es dejarla tal cual, que
  // en dibujos de manchas planas comprime igual de bien y es más simple.
  const crudo = new Uint8Array((width + 1) * height);
  for (let y = 0; y < height; y++) {
    crudo[y * (width + 1)] = 0;
    crudo.set(indices.subarray(y * width, (y + 1) * width), y * (width + 1) + 1);
  }

  const ihdr = new Uint8Array(13);
  const vista = new DataView(ihdr.buffer);
  vista.setUint32(0, width);
  vista.setUint32(4, height);
  ihdr[8] = 8;   // bits por muestra
  ihdr[9] = 3;   // color indexado

  return unir([
    Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', ihdr),
    trozo('PLTE', Uint8Array.from(rgb.flat())),
    trozo('IDAT', await desinflar(crudo)),
    trozo('IEND', new Uint8Array(0)),
  ]);
}

async function desinflar(bytes) {
  const flujo = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(flujo).arrayBuffer());
}

function trozo(tipo, datos) {
  const nombre = Uint8Array.from([...tipo].map(c => c.charCodeAt(0)));
  const cuerpo = unir([nombre, datos]);
  const salida = new Uint8Array(8 + datos.length + 4);
  const vista = new DataView(salida.buffer);
  vista.setUint32(0, datos.length);
  salida.set(cuerpo, 4);
  vista.setUint32(4 + cuerpo.length, crc32(cuerpo) >>> 0);
  return salida;
}

function unir(trozos) {
  const total = trozos.reduce((s, t) => s + t.length, 0);
  const salida = new Uint8Array(total);
  let n = 0;
  for (const t of trozos) { salida.set(t, n); n += t.length; }
  return salida;
}

const TABLA_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(bytes) {
  let c = -1;
  for (let i = 0; i < bytes.length; i++) c = TABLA_CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}
