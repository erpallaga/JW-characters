"""Recorta Natural Earth 50m al ambito biblico y lo deja en data/geo/.

El resultado ya esta en el repositorio: esto solo hace falta si alguna vez hay
que ampliar la zona que cubren los mapas o afinar el detalle de las costas.
Los dos ficheros de partida no se guardan aqui porque pesan 4 MB; se bajan de
naturalearthdata.com (dominio publico, sin atribucion obligatoria):

    base=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
    curl -o ne50.geojson    $base/ne_50m_admin_0_countries.geojson
    curl -o lakes50.geojson $base/ne_50m_lakes.geojson
    python3 tools/preparar-geo.py .        # la carpeta donde esten los dos

TOL y DEC deciden cuanto se simplifica: al maximo acercamiento que usan las
tarjetas (unos 175 px por grado) 0,003 grados es medio pixel, o sea que la
costa no pierde nada que se llegue a ver.
"""
import json, sys, math

# El limite norte llega a 56 porque el viaje de Pablo, visto entero, sube por
# encima de los 52 grados: con el recorte anterior la tarjeta ensenaba una
# franja de lienzo vacio por arriba.
BBOX = (-2.0, 5.0, 68.0, 56.0)   # lon_min, lat_min, lon_max, lat_max
TOL = 0.003                       # simplificacion Douglas-Peucker, en grados
DEC = 4                           # decimales que se conservan

def clip_ring(ring, bbox):
    """Sutherland-Hodgman contra la caja."""
    lon0, lat0, lon1, lat1 = bbox
    def dentro(p, borde):
        if borde == 0: return p[0] >= lon0
        if borde == 1: return p[0] <= lon1
        if borde == 2: return p[1] >= lat0
        return p[1] <= lat1
    def corte(a, b, borde):
        if borde in (0, 1):
            x = lon0 if borde == 0 else lon1
            t = (x - a[0]) / (b[0] - a[0])
            return [x, a[1] + t * (b[1] - a[1])]
        y = lat0 if borde == 2 else lat1
        t = (y - a[1]) / (b[1] - a[1])
        return [a[0] + t * (b[0] - a[0]), y]
    salida = ring
    for borde in range(4):
        entrada, salida = salida, []
        if not entrada: return []
        prev = entrada[-1]
        for cur in entrada:
            if dentro(cur, borde):
                if not dentro(prev, borde): salida.append(corte(prev, cur, borde))
                salida.append(cur)
            elif dentro(prev, borde):
                salida.append(corte(prev, cur, borde))
            prev = cur
    return salida

def simplificar(pts, tol):
    if len(pts) < 3: return pts
    dmax, idx = 0.0, 0
    a, b = pts[0], pts[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    norm = math.hypot(dx, dy)
    for i in range(1, len(pts) - 1):
        p = pts[i]
        d = abs(dx * (a[1] - p[1]) - (a[0] - p[0]) * dy) / norm if norm else math.hypot(p[0]-a[0], p[1]-a[1])
        if d > dmax: dmax, idx = d, i
    if dmax > tol:
        return simplificar(pts[:idx+1], tol)[:-1] + simplificar(pts[idx:], tol)
    return [a, b]

def redondear(pts):
    out, prev = [], None
    for x, y in pts:
        p = [round(x, DEC), round(y, DEC)]
        if p != prev: out.append(p); prev = p
    return out

def procesar(geojson, area_minima):
    piezas = []
    for feat in geojson['features']:
        geom = feat.get('geometry') or {}
        polys = geom.get('coordinates') or []
        if geom.get('type') == 'Polygon': polys = [polys]
        elif geom.get('type') != 'MultiPolygon': continue
        for poly in polys:
            anillos = []
            for i, ring in enumerate(poly):
                ring = [[p[0], p[1]] for p in ring]
                recortado = clip_ring(ring, BBOX)
                if len(recortado) < 4: continue
                simple = redondear(simplificar(recortado, TOL))
                if len(simple) < 4: continue
                area = abs(sum(simple[j][0]*simple[j-1][1] - simple[j-1][0]*simple[j][1]
                               for j in range(len(simple)))) / 2
                if i == 0 and area < area_minima: break
                if area < area_minima: continue
                anillos.append(simple)
            if anillos: piezas.append(anillos)
    return piezas

def main():
    origen = sys.argv[1] if len(sys.argv) > 1 else '.'
    paises = procesar(json.load(open(f'{origen}/ne50.geojson')), 0.0008)
    lagos  = procesar(json.load(open(f'{origen}/lakes50.geojson')), 0.02)
    for nombre, piezas in (('paises', paises), ('lagos', lagos)):
        ruta = f'data/geo/{nombre}.json'
        with open(ruta, 'w') as f:
            # La caja viaja con la geometría: el renderizador la necesita para no
            # pintar como frontera el corte recto del recorte.
            json.dump({'bbox': list(BBOX), 'piezas': piezas}, f, separators=(',', ':'))
        puntos = sum(len(r) for p in piezas for r in p)
        import os
        print(f'{ruta}: {len(piezas)} piezas, {puntos} puntos, {os.path.getsize(ruta)/1024:.0f} KB')

main()
