# Jacob (`jacob`)

## Veredicto general

La ficha tiene la estructura básica correcta pero incurre en errores cronológicos graves: el timeframe está fuera ~40 años, y el recorrido geográfico está incompleto (solo 2 lugares vs. los 9 que menciona Perspicacia). Se necesitan correcciones en fechas y expansión exhaustiva de lugares.

## Campos

### name — OK
- Actual: `Jacob`
- Fuente: «JACOB» — Perspicacia it-2 (1200002279)

### eraId — OK
- Actual: `patriarcas`
- Fuente: Perspicacia it-2

### timeframe — CORREGIR
- Actual: `~1900 a.e.c.`
- Propuesta: `~1858–1711 a.e.c.`
- Fuente: «Los padres de Jacob llevaban veinte años casados cuando les nacieron gemelos, sus únicos hijos, en 1858 a. E.C.» y «Finalmente, en 1711 a. E.C., Jacob murió a la edad de ciento cuarenta y siete años» — Perspicacia it-2, 1200002279

### place — OK
- Actual: `Canaán y Padán-aram`
- Fuente: «Jacob tenía setenta y siete años cuando dejó Beer-seba para ir a la tierra de sus antepasados, donde pasó los siguientes veinte años de su vida.» — Perspicacia it-2

### life — OK
- Actual: `start: -1858, end: -1711`
- Fuente: «1858 a. E.C.» (nacimiento) y «1711 a. E.C.» (muerte) — Perspicacia it-2, 1200002279

### passages — OK
- Actual: Génesis 28, 32
- Verificación: Génesis 28:11-19 (el sueño en Betel), Génesis 32:22-32 (cambio de nombre en Peniel) — correctos

## knownFor
| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Hijo menor de Isaac y Rebeca | OK | Gé 25:22-26 | — |
| Recibió primogenitura después de Esaú la despreciara | OK | Gé 25:29-34 | — |
| Obtuvo bendición paternal | OK | Gé 27:1-29 | — |
| Trabajó veinte años para Labán | OK | Gé 31:41 | — |
| Forma una gran familia en Padán-aram | OK | Gé 29:30–30:24 (12 hijos) | — |
| Tras luchar con ángel, recibió nombre Israel | OK | Gé 32:22-28 | — |
| Sus doce hijos fueron cabezas de las doce tribus | OK | Perspicacia | — |

## Mapa

### Recorrido completo
| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Beer-seba | Gé 28:10 | Ciudad en la región desértica del Négueb meridional | 34.7750 | 31.2508 | alta | beerseba |
| 2 | Betel (Luz) | Gé 28:11-19 | Ruinas en Beitín, a 17 Km. al N. de Jerusalén, serranía rocosa a ~900 m.s.n.m. | 35.2087 | 31.9453 | alta | — |
| 3 | Harán | Gé 29:1-4, 31:41 | En Padán-aram (Mesopotamia superior), a ~560 Km. al NO. de Canaán | 39.0308 | 36.8642 | alta | haran |
| 4 | Mahanaim | Gé 32:1-2 | Al E. del Jordán, al N. del Jaboq; Tell edh-Dhahab el-Gharbi según identificación moderna, a ~12 Km. al E. del Jordán | 32.2500 | 31.8500 | media | — |
| 5 | Peniel (Penuel) | Gé 32:25-31 | Cercano al vado de Jaboq, donde Jacob contendió con ángel | 32.2167 | 31.8667 | media | — |
| 6 | Sucot | Gé 33:17 | Tell Deir ʽAlla, a ~5 Km. al E. del río Jordán, ligeramente al N. del Jaboq | 32.3667 | 31.9167 | alta | — |
| 7 | Siquem | Gé 33:18-20, 35:1-4 | Tell Balata, a ~48 Km. al N. de Jerusalén, en valle entre Guerizim y Ebal | 35.2300 | 32.2100 | alta | — |
| 8 | Betel | Gé 35:1-15 | Idem lugar 2: regresa ~30 años después para construir altar | 35.2087 | 31.9453 | alta | — |
| 9 | Hebrón | Gé 35:27 | Ciudad principal en la región montañosa de Judá, donde vivía su padre Isaac | 35.2092 | 31.5326 | alta | hebron |
| 10 | Gosén | Gé 46:28–47:10 | Región en delta oriental del Nilo, 1728 a.e.c.; «lo mejor de la tierra de Egipto» | 31.3333 | 30.5333 | media | — |

### Selección (máx. 15)
`["beerseba", "betel", "haran", "mahanaim", "peniel", "sucot", "siquem", "hebron", "gosen"]`

— ruta: sí — zoom: no hace falta

Justificación: Recorrido lineal y trazable desde Beer-seba (partida) pasando por Betel, luego la gran distancia a Harán (20 años), regreso con encuentro de ángeles (Mahanaim y Peniel), asentamientos en Canaán (Sucot, Siquem, Betel nuevamente), y finalmente Hebrón (centro patriarcal) y Gosén (muerte en Egipto). Los 10 lugares cubren toda la trayectoria vital de Jacob con citas explícitas.

### Lugares nuevos para `lugares.json`
```json
[
  {"id": "betel", "label": "Betel", "lon": 35.2087, "lat": 31.9453},
  {"id": "mahanaim", "label": "Mahanaim", "lon": 32.2500, "lat": 31.8500},
  {"id": "peniel", "label": "Peniel", "lon": 32.2167, "lat": 31.8667},
  {"id": "sucot", "label": "Sucot", "lon": 32.3667, "lat": 31.9167},
  {"id": "siquem", "label": "Siquem", "lon": 35.2300, "lat": 32.2100},
  {"id": "gosen", "label": "Gosén", "lon": 31.3333, "lat": 30.5333}
]
```

## No verificado
- Identificación moderna exacta de Mahanaim: Perspicacia ofrece dos candidatos (Khirbet Mahneh y Tell edh-Dhahab el-Gharbi). He usado la segunda por ser preferida por Aharoni, pero la ubicación es aproximada.
- Ubicación exacta de Gosén: Perspicacia indica incertidumbre («ubicación exacta es incierta») y sugiere proximidad a Wadi Tumilat; las coordenadas son aproximadas al delta oriental.
