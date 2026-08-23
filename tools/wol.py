#!/usr/bin/env python3
"""Consulta la Biblioteca en Línea Watchtower desde la terminal.

  wol.py buscar "Listra"          busca y lista los resultados con su URL
  wol.py leer <url-o-docid>       imprime el artículo en texto limpio
  wol.py biblia "Hch 16:1-3"      imprime los versículos

Sin trucos: descarga la página y le quita el HTML. Si algo falla, lo dice.
"""
import html
import re
import subprocess
import sys
import urllib.parse

BASE = "https://wol.jw.org"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"


def traer(url):
    r = subprocess.run(
        ["curl", "-sS", "-L", "--compressed", "--max-time", "60", "-A", UA, url],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        sys.exit(f"ERROR de red al pedir {url}\n{r.stderr.strip()}")
    if len(r.stdout) < 500:
        sys.exit(f"ERROR: {url} devolvió una página vacía o un bloqueo")
    return r.stdout


def limpiar(fragmento):
    t = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", fragmento)
    t = re.sub(r"(?i)</(p|div|li|h[1-6]|tr)>", "\n", t)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t ]+", " ", t)
    t = re.sub(r"\n\s*\n+", "\n\n", t)
    return t.strip()


def cuerpo(pagina):
    m = re.search(r"(?is)<article.*?</article>", pagina)
    if m:
        return m.group(0)
    m = re.search(r'(?is)<div[^>]+id="content".*?</div>\s*</div>', pagina)
    return m.group(0) if m else pagina


def titulo(pagina):
    m = re.search(r"(?is)<title>(.*?)</title>", pagina)
    return html.unescape(m.group(1)).strip() if m else "(sin título)"


def buscar(consulta):
    url = f"{BASE}/es/wol/s/r4/lp-s?q={urllib.parse.quote(consulta)}&p=par&r=occ"
    pagina = traer(url)
    vistos, salida = set(), []
    for m in re.finditer(
        r'(?is)<a[^>]+href="(/es/wol/d/r4/lp-s/(\d+)[^"]*)"[^>]*>(.*?)</a>', pagina
    ):
        href, docid, texto = m.group(1), m.group(2), limpiar(m.group(3))
        if docid in vistos or not texto:
            continue
        vistos.add(docid)
        salida.append(f"{docid}  {texto[:110]}\n        {BASE}{html.unescape(href).split('?')[0]}")
        if len(salida) >= 15:
            break
    if not salida:
        print(f"Sin resultados para «{consulta}». Prueba otra grafía.")
    print(f"Búsqueda: {consulta}\n" + "\n".join(salida))


def leer(ref):
    url = ref if ref.startswith("http") else f"{BASE}/es/wol/d/r4/lp-s/{ref}"
    pagina = traer(url)
    print(f"# {titulo(pagina)}\n{url}\n")
    print(limpiar(cuerpo(pagina)))


def biblia(cita):
    url = f"{BASE}/es/wol/l/r4/lp-s?q={urllib.parse.quote(cita)}"
    pagina = traer(url)
    print(f"# {cita}\n{url}\n")
    print(limpiar(cuerpo(pagina)))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    orden, arg = sys.argv[1], " ".join(sys.argv[2:])
    {"buscar": buscar, "leer": leer, "biblia": biblia}.get(orden, lambda a: sys.exit(__doc__))(arg)
