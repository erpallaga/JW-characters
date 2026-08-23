# Jesús (`jesus`)

## Veredicto general
La ficha es doctrinalmente correcta pero **incompleta** en cartografía y vocabulario. El campo `place` omite Belén (nacimiento) y `map.lugares` contiene solo 2 de ~15 lugares verificables donde Jesús estuvo. La redacción cumple con estándares de jw.org excepto por una frase que requiere matiz sobre la responsabilidad en su muerte.

## Campos

### name — OK
- Actual: `Jesús`
- Perspicacia (it-1): JESUCRISTO / JESÚS (nombres equivalentes, ambos correctos)
- Fuente: Perspicacia para comprender las Escrituras, entrada JESUCRISTO — https://wol.jw.org/es/wol/d/r4/lp-s/1200002451

### eraId — OK
- Actual: `evangelios`
- Perspicacia confirma: vida durante época de Escrituras Griegas Cristianas (29–33 e.c. ministerio público)
- Fuente: Perspicacia, entrada JESUCRISTO — https://wol.jw.org/es/wol/d/r4/lp-s/1200002451

### timeframe — OK
- Actual: `~2 a.e.c.–33 e.c.`
- Perspicacia: "Jesús debió nacer en el mes de Etanim (septiembre-octubre) del año 2 a.E.C." y "murió sobre las tres de la tarde de un viernes, día 14, del mes primaveral de Nisán (marzo-abril) del año 33 E.C."
- Fuente: Perspicacia, entrada JESUCRISTO, pág. explicativa sobre cronología — https://wol.jw.org/es/wol/d/r4/lp-s/1200002451

### place — CORREGIR
- Actual: `Nazaret, Galilea y Judea`
- Propuesta: `Belén, Nazaret, Galilea y Judea`
- Justificación: Belén es el lugar de nacimiento de Jesús (Mateo 2:1) y debe ser el primer punto del recorrido. Perspicacia lo señala como profecía cumplida (Miqueas 5:2).
- Fuente: Perspicacia, entrada BELÉN — "dio a luz a Jesús en Belén de Judea" — https://wol.jw.org/es/wol/d/r4/lp-s/1200000694

### life — OK con nota
- Actual: `start: -2, end: 33` (sin `approx`)
- Perspicacia confirma: nacimiento "debió" ser ~2 a.e.c. (término aproximado explícito) y muerte 33 e.c. (fecha exacta en cronología oficial)
- Mejora sugerida: Marcar `approx: true` para la fecha de inicio si la ficha lo permite, reflejando la naturaleza estimada del nacimiento
- Fuente: Perspicacia, entrada JESUCRISTO — https://wol.jw.org/es/wol/d/r4/lp-s/1200002451

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Nacido en Belén y criado en Nazaret | OK | Perspicacia BELÉN: "dio a luz a Jesús en Belén de Judea"; Perspicacia NAZARET: "José y María residían en Nazaret...Más tarde, después de su regreso de Egipto, de nuevo fijaron su residencia en Nazaret" — https://wol.jw.org/es/wol/d/r4/lp-s/1200000694, https://wol.jw.org/es/wol/d/r4/lp-s/1200003190 | — |
| comenzó su ministerio público alrededor de los 30 años tras ser bautizado por Juan | OK | Perspicacia: "se bautizó hacia la misma época del año 29 E.C." (cuando tendría ~30 años); Lucas 3:23 en NWT confirma "comenzó como a treinta años de edad" — https://wol.jw.org/es/wol/d/r4/lp-s/1200002451 | — |
| Recorrió Galilea y Judea enseñando sobre el Reino de Dios mediante parábolas | OK | Perspicacia CAPERNAUM: "Fue posiblemente...donde Jesús...predicó en la sinagoga"; múltiples referencias a enseñanza en ambas regiones — https://wol.jw.org/es/wol/d/r4/lp-s/1200000882 | — |
| realizó numerosos milagros que incluían sanar enfermos y resucitar muertos | OK | Perspicacia CAPERNAUM: "ejecutó...su primer milagro [en Caná]...sanó a un paralítico...curó a dos ciegos y a un mudo endemoniado"; Juan 11:38-44 resurrección de Lázaro — https://wol.jw.org/es/wol/d/r4/lp-s/1200000882 | — |
| Fue ejecutado en un madero por instigación de líderes religiosos | CORREGIR | Perspicacia: "se fijó a Jesucristo en el madero" (por romanos bajo presión de líderes judíos, pero ejecución es responsabilidad romana); Mateo 27:11-26 muestra a Pilatos pronunciando sentencia final — https://wol.jw.org/es/wol/d/r4/lp-s/1200001738 | Propuesta: "Fue ejecutado en un madero. Los líderes religiosos lo entregaron a los romanos, quienes ejecutaron la sentencia." Esto respeta tanto la responsabilidad judaica en instigar como la romana en ejecutar. |
| sus discípulos lo vieron con vida después de su resurrección, hecho que dio origen a la congregación cristiana | OK | Lucas 24:36-43 relata apariciones post-resurrección; Hechos 1:6 indica que los discípulos recibieron instrucciones luego durante 40 días; Hechos 2 relata formación de congregación — https://wol.jw.org/es/wol/l/r4/lp-s?q=Lucas%2024 | — |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Belén | Mateo 2:1 | A unos 9 km al SSO del monte del Templo; altitud ~780 m | 35.2039 | 31.9454 | alta | `belen` |
| 2 | Egipto | Mateo 2:13-15 | Región nororiental; destino de huida tras nacimiento | 29.5 | 25.5 | baja | — |
| 3 | Nazaret | Lucas 4:16 | Montañas bajas al N del valle de Jezreel; medio camino entre mar de Galilea y Mediterráneo | 35.2978 | 32.7021 | alta | `nazaret` |
| 4 | Jordán (bautismo) | Mateo 3:13-17 | Río que corre N-S, tradición: cerca Jericó; lugar donde Juan bautizaba | 35.4675 | 31.8750 | media | `jordan` |
| 5 | Desierto de Judea | Mateo 4:1-11 | Región árida al E de Jerusalén y Jordán | 35.4 | 31.8 | media | `desierto-sinai` |
| 6 | Caná | Juan 2:1-11 | Khirbet Kana, ~13 km al N de Nazaret, sobre colina en límites llanura Asoquis | 35.3267 | 32.8750 | alta | — |
| 7 | Capernaúm | Mateo 4:13 | Tell Hum (Kefar Nahum), orilla noroccidental mar de Galilea, ~4 km NE de Khan Minyeh | 35.5627 | 32.8856 | alta | — |
| 8 | Samaria (Sicar) | Juan 4:5-26 | Askar, ~1 km de pozo de Jacob; centro-norte Palestina | 35.2847 | 32.2053 | media | `samaria` |
| 9 | Tiro | Mateo 15:21 | Puerto fenicio, costa mediterránea, actual Líbano | 35.1264 | 33.2737 | media | `tiro` |
| 10 | Sidón | Marcos 7:31 | Puerto fenicio al N de Tiro, costa mediterránea | 35.3667 | 33.6261 | media | `sidon` |
| 11 | Cesarea de Filipo | Mateo 16:13 | Panion (Banias), pie monte Hermón, fuente del Jordán | 35.7964 | 33.2544 | alta | — |
| 12 | Jericó | Lucas 18:35-19:10 | Tulul Abu el-ʽAlayiq, ~250 m bajo nivel del mar, valle del Jordán | 35.4458 | 31.8675 | alta | `jerico` |
| 13 | Betania | Juan 11:1 | el-ʽAzariyeh, 2.5 km al ESE monte del Templo, ladera oriental monte de los Olivos | 35.2622 | 31.7714 | alta | `betania` |
| 14 | Monte de los Olivos | Lucas 22:39 | Monte al E de Jerusalén, donde discípulos se congregaban | 35.2526 | 31.7779 | alta | — |
| 15 | Getsemaní | Mateo 26:39 | Jardín al pie monte de los Olivos, bifurcación carretera lado occidental | 35.2542 | 31.7741 | media | — |
| 16 | Gólgota | Mateo 27:33 | Afueras Jerusalén (norte), lugar de ejecución; tradición: iglesia Santo Sepulcro | 35.2290 | 31.7386 | media | — |
| 17 | Emaús | Lucas 24:13 | Viejo al-Qubeibeh, ~11 km NO Jerusalén; o Abu Dis ~3 km E | 35.1928 | 31.8433 | baja | — |

**Nota sobre Egipto**: Mateo 2:13-15 registra la huida a Egipto pero sin especificación de ubicación dentro del país. Por completud del relato evangelio se incluye, pero la ubicación exacta es especulativa.

### Selección (máx. 15)
`["belen", "nazaret", "jordan", "cana", "capernaum", "samaria", "cesarea-filipo", "jerico", "betania", "monte-olivos", "getsemani", "golgotha"]` + Desierto de Judea + Emaús = 14 lugares

— ruta: **sí** — zoom: **no hace falta** (dispersión geográfica amplia: desde Tiro-Sidón al N hasta Jericó-Betania al S; permite seguimiento de itinerario completo)

Justificación: Se excluyen Tiro y Sidón (viaje lateral corto, objetivo menor) y Egipto (falta de datos geográficos), pero se incluyen todos los puntos de ruptura histórica en el evangelio: nacimiento (Belén), crianza (Nazaret), bautismo (Jordán), primer milagro (Caná), centro ministerial (Capernaum), encuentro samaritano (Sicar), confesión de Pedro (Cesarea Filipo), últimos milagros (Jericó), amistad (Betania), enseñanza final (Monte Olivos), oración previa captura (Getsemaní), muerte (Gólgota), aparición post-resurrección (Emaús). El desierto de Judea (tentación) es simbólicamente crucial como transición entre bautismo y ministerio.

### Lugares nuevos para `lugares.json`
```json
[
  {
    "id": "caná",
    "label": "Caná",
    "lon": 35.3267,
    "lat": 32.8750
  },
  {
    "id": "capernaúm",
    "label": "Capernaúm",
    "lon": 35.5627,
    "lat": 32.8856
  },
  {
    "id": "sicar",
    "label": "Sicar",
    "lon": 35.2847,
    "lat": 32.2053
  },
  {
    "id": "sidón",
    "label": "Sidón",
    "lon": 35.3667,
    "lat": 33.6261
  },
  {
    "id": "cesarea-filipo",
    "label": "Cesarea de Filipo",
    "lon": 35.7964,
    "lat": 33.2544
  },
  {
    "id": "monte-olivos",
    "label": "Monte de los Olivos",
    "lon": 35.2526,
    "lat": 31.7779
  },
  {
    "id": "getsemani",
    "label": "Getsemaní",
    "lon": 35.2542,
    "lat": 31.7741
  },
  {
    "id": "golgotha",
    "label": "Gólgota",
    "lon": 35.2290,
    "lat": 31.7386
  },
  {
    "id": "emaús",
    "label": "Emaús",
    "lon": 35.1928,
    "lat": 31.8433
  }
]
```

## No verificado
- **Egipto (Mateo 2:13-15)**: Perspicacia confirma la huida a Egipto pero no especifica región ni ubicación. Asumido como Bajo Egipto (delta), pero sin fuente explícita de Perspicacia.
- **Desierto de Judea (Mateo 4:1-11)**: Perspicacia no proporciona entrada específica DESIERTO DE JUDEA. Ubicación estimada basada en geografía regional (entre Jordán y Jerusalén), pero sin descripciones de Perspicacia.
- **Emaús (Lucas 24:13)**: Perspicacia (it-1 entrada EMAÚS) indica "11 km NO de Jerusalén" pero menciona dos ubicaciones posibles con baja confianza arqueológica. La identificación no es definitiva.
- **Coordenadas para Sicar, Sidón, Cesarea Filipo**: Extraídas de Perspicacia y referencias, pero algunas carecen de GPS precisas en el artículo original. Se usaron estándares cartográficos de jw.org.
