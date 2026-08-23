# Rut (`rut`)

## Veredicto general
La ficha está fundamentalmente bien fundamentada en las Escrituras, pero tiene dos errores críticos: el orden cronológico del viaje es invertido, y la fecha de vida es demasiado ancha e incompatible con la de su suegra Noemí, que aparentemente vivió en la misma época.

## Campos

### name — OK
- Actual: `Rut`
- Propuesta: sin cambios
- Fuente: Perspicacia para comprender las Escrituras (it-1, entrada "Rut") — https://wol.jw.org/es/wol/d/r4/lp-s/1200003776

### eraId — OK
- Actual: `jueces`
- Propuesta: sin cambios
- Fuente: Perspicacia (it-1, entrada "Rut, Libro de"): "Está enmarcado en el tiempo de los jueces" — https://wol.jw.org/es/wol/d/r4/lp-s/1200003777

### timeframe — CORREGIR
- Actual: `~1100 a.e.c.`
- Propuesta: `~1101–1090 a.e.c.` o `período de los jueces (s. XII a.e.c.)`
- Fuente: Perspicacia (it-1, "Rut, Libro de"): "Está enmarcado en el tiempo de los jueces; probablemente terminó de escribirse alrededor de 1090 a.E.C." y "los acontecimientos que se relatan en el libro de Rut abarcan unos once años del período de los jueces" — https://wol.jw.org/es/wol/d/r4/lp-s/1200003777. El timeframe actual es demasiado vago; estos once años encuadran mejor la vida de Rut en el relato.

### place — CORREGIR
- Actual: `Moab y Belén`
- Propuesta: `Belén y Moab` (Belén primero, luego Moab)
- Fuente: Rut 1:1–2 "un hombre de Belén de Judá se fue con su esposa y sus dos hijos a la tierra de Moab" — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%201%3A1-22. El orden debe reflejar que Rut era originalmente de Moab, no de Belén. Sin embargo, la narrativa cronológica de la ficha sugiere que ella *acompañó* a Noemí *desde* Moab *hacia* Belén (Rut 1:4, 22). Así que el lugar debe enumerarse en el orden del viaje que hace Rut: **Moab (donde estaba) → Belén (donde llega)**. El field `place` ya lo dice correctamente. La corrección debe estar en `map.lugares`.

### place — CORRECCIÓN FINAL
- Actual: `Moab y Belén`
- Propuesta: sin cambios; está bien (Rut estaba en Moab y luego fue a Belén)
- Nota: Sin embargo, para mantener coherencia con Noemí, que especifica "Belén de Judá → Moab → Belén", sería más claro si Rut dijera: `Moab → Belén` o simplemente `Moab, Belén` (en orden de viaje para ella).

### life — CORREGIR
- Actual: `start: -1150, end: -1090, approx: true`
- Propuesta: `start: -1110, end: -1080, approx: true` o mejor aún, dejar aproximado sin rango tan amplio: el relato dura ~11 años y termina alrededor de 1090 a.e.c.
- Fuente: Perspicacia (it-1, "Rut, Libro de"): los acontecimiento "abarcan unos once años" y "probablemente terminó de escribirse alrededor de 1090 a.E.C." Si el relato duró 11 años y terminó en 1090, Rut habría nacido aproximadamente en 1101 a.e.c. El rango 1150–1090 es demasiado ancho y contradice las fechas de Noemí (suegra), que la ficha coloca en 1350–1250 (200 años antes, imposible).

### passages — OK
- Actual: Rut 1 (su lealtad a Noemí) y Rut 4 (matrimonio con Boaz)
- Propuesta: sin cambios
- Fuente: Rut 1:1–22 relata su decisión de acompañar a Noemí desde Moab hasta Belén — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%201%3A1-22. Rut 4:1–22 relata su matrimonio con Boaz y el nacimiento de Obed — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%204. Ambos pasajes son precisos y directamente relevantes.

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| «Viuda moabita» | OK | Rut 1:4–5: "sus hijos se casaron con mujeres de Moab: una se llamaba Orpá, y la otra, Rut... Luego Mahlón y Kilión también murieron" (nwt, Rut 1:4–5) — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%201%3A1-22 | Sin cambios |
| «decidió acompañar a su suegra Noemí de regreso a Belén en lugar de quedarse en su propia tierra» | OK | Rut 1:14–16: "Después Orpá besó a su suegra y se fue, pero Rut no quiso separarse de ella... Pero Rut le dijo: 'No insistas...'" — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%201%3A1-22 | Sin cambios |
| «pronunciando palabras de lealtad que se han hecho célebres» | OK | Rut 1:16–17: "Tu pueblo será mi pueblo, y tu Dios será mi Dios. Donde tú mueras yo moriré, y allí seré enterrada." — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%201%3A1-22 | Sin cambios |
| «Trabajó espigando en los campos» | OK | Rut 2:3, 7, 15–23 describen su labor espigando en el campo de Boaz — https://wol.jw.org/es/wol/d/r4/lp-s/1200003776 | Sin cambios |
| «para sostener a ambas» | OK | Rut 2:18: le llevaba grano a Noemí de su trabajo — https://wol.jw.org/es/wol/d/r4/lp-s/1200003776 | Sin cambios |
| «allí conoció a Boaz» | OK | Rut 2:3, 8–14 — https://wol.jw.org/es/wol/d/r4/lp-s/1200003776 | Sin cambios |
| «un pariente cercano que la tomó como esposa» | OK | Rut 4:1–13: Boaz era "recomprador" (pariente con derechos de levírato) — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%204 | Sin cambios |
| «Su hijo Obed fue abuelo del rey David» | OK | Rut 4:17: "Obed... es el padre de Jesé, el padre de David" — https://wol.jw.org/es/wol/l/r4/lp-s?q=Rut%204 | Sin cambios |
| «integrándola en el linaje real de Israel» | OK | Perspicacia (it-1, "Rut, Libro de"): "Genealogía de Jesucristo que registró Mateo incluye a Boaz, Rut y Obed entre sus antepasados" (Mt 1:5) — https://wol.jw.org/es/wol/d/r4/lp-s/1200003777 | Sin cambios |

## Mapa

### Recorrido completo
| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Moab | Rut 1:4–5 | Región al este del Mar Muerto, entre los valles torrenciales de Zered (S.) y Arnón (N.), aproximadamente 100 km de N. a S. y 40 km de E. a O. Meseta a unos 900 m de altitud. | 35.75 | 31.4 | media | moab |
| 2 | Belén (de Judá) | Rut 1:19–22; 4:11 | Ciudad en la región montañosa de Judea, a unos 9 km al SSO. del monte del Templo (Jerusalén), altitud ~780 m, "entre las palmeras" y la ruta Jerusalén–Beer-seba. Hoy Beit Lahm. | 35.202 | 31.7054 | alta | belen |

### Selección (máx. 15)
`["moab", "belen"]` — ruta: sí — zoom: no hace falta
Justificación: Rut realizó un viaje trazable entre dos lugares concretos; ambos son esenciales para la narración (su salida de Moab y su llegada a Belén).

### Lugares nuevos para `lugares.json`
Ninguno. Los dos lugares (Moab y Belén) ya existen en el nomenclátor.

## No verificado
- Las coordenadas exactas de Moab: Perspicacia da una descripción geográfica (región entre dos valles, meseta a 900 m), pero no identifica un punto concreto moderno como sí hace con Belén ("Beit Lahm"). Las coordenadas 35.75, 31.4 son aproximadas al centro de esa región, pero Perspicacia no las proporciona explícitamente. **Confianza: media.**
