# Ezequías (`ezequias`)

## Veredicto general
El timeframe y place son correctos, pero **hay un error grave en life.start y life.end**: la ficha marca -762 a -697, cuando deberían ser aproximadamente -770 a -717 según Perspicacia (reinó 745-717 a.e.c., comenzó a los 25 años). Falta también Lakís, lugar explícitamente mencionado con Senaquerib.

## Campos

### name — OK
- Actual: `Ezequías`
- Fuente: Perspicacia (it-1, entrada "Ezequías", núm. 1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002011

### eraId — OK
- Actual: `reino_dividido`
- Fuente: Ezequías reinó sobre el reino de Judá durante el período del reino dividido (it-1, Ezequías) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002011

### timeframe — OK
- Actual: `Reinó 745–717 a.e.c.`
- Fuente: Perspicacia: "Rey de Judá que gobernó de 745 a 717 a. E.C." (it-1, Ezequías) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002011

### place — OK
- Actual: `Jerusalén, Judá`
- Fuente: Perspicacia menciona que su ministerio se centró en Jerusalén y el templo (it-1, Ezequías) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002011

### life.start / life.end — CORREGIR
- Actual: `start: -762, end: -697, approx: true`
- Fuente: Perspicacia: "Rey de Judá que gobernó de 745 a 717 a. E.C." y "Ezequías ascendió al trono de Judá... a la edad de veinticinco años" (it-1, Ezequías) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002011
- **Cálculo**: Si reinó de 745-717 a.e.c. y comenzó a los 25 años, nació aproximadamente en 770 a.e.c. (-770) y murió en 717 a.e.c. (-717).
- **Propuesta**: `start: -770, end: -717, approx: true`

### passages — OK
- `2 Reyes 18–20 (reinado e invasión asiria)`: Perspicacia cita estos capítulos como registro del reinado ✓
- `2 Crónicas 29–32 (restauración)`: Perspicacia cita estos capítulos para la limpieza del templo ✓
- `Isaías 36–39`: Perspicacia menciona estos capítulos paralelos como parte del registro de Ezequías ✓

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Rey de Judá que "hizo lo recto a ojos de Jehová" | OK | 2 Reyes 18:3 (TNM); Perspicacia (it-1, Ezequías) | |
| Restauró la adoración pura limpiando el templo | OK | 2 Crónicas 29:1-36 (TNM); Perspicacia (it-1, Ezequías) | |
| Celebró la primera Pascua en décadas | OK | 2 Crónicas 30:1-27 (TNM); Perspicacia (it-1, Ezequías) | |
| Enfrentó la invasión asiria de Senaquerib | OK | 2 Reyes 18–19 (TNM); Perspicacia (it-1, Ezequías) | |
| Fortificó Jerusalén | OK | 2 Crónicas 32:1-8 (TNM); Perspicacia (it-1, Ezequías) | |
| Condujo el agua mediante el famoso túnel (que aún existe) | OK | 2 Reyes 20:20; 2 Crónicas 32:30 (TNM); Perspicacia describe "el acueducto de Ezequías... desde el pozo de Guihón... hasta el estanque de Siloam... Los arqueólogos encontraron una inscripción..." (it-1, Ezequías) | |
| Oró con confianza | OK | 2 Reyes 19:14-19 (TNM); Perspicacia (it-1, Ezequías) | |
| Esa noche el ángel de Jehová derrotó a 185.000 soldados asirios | OK | 2 Reyes 19:35 (TNM); 2 Crónicas 32:21 (TNM); Perspicacia (it-1, Ezequías) | |
| También fue sanado milagrosamente de enfermedad mortal | OK | 2 Reyes 20:1-11 (TNM); Perspicacia cita la enfermedad y la sanación milagrosa (it-1, Ezequías) | |

## Mapa

### Recorrido completo
| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Jerusalén | 2 Reyes 18:17; 19:1 | Capital de Judá, centro del reinado y las campañas militares | 35.2137 | 31.7683 | alta | jerusalen |
| 2 | Lakís | 2 Reyes 18:14 | Ciudad fortificada de Judá en la Sefelá, a unos 24 km al O. de Hebrón. Sitio de la invasión de Senaquerib; ubicación: Tell ed-Duweir (Perspicacia) | 34.93 | 31.42 | alta | — |
| 3 | Guihón (pozo) | 2 Reyes 20:20; 2 Crónicas 32:30 | Fuente oriental en Jerusalén; origen del acueducto de Ezequías, al E. de la Ciudad de David (Perspicacia) | 35.232 | 31.768 | alta | — |
| 4 | Siloam (estanque) | 2 Reyes 20:20; 2 Crónicas 32:30 | Estanque en el valle de Tiropeón, al O. de la Ciudad de David; destino del acueducto de Ezequías (Perspicacia) | 35.228 | 31.763 | alta | — |

### Selección (máx. 15)
`["jerusalen", "lakis", "guihon", "siloam"]` — ruta: no — zoom: media

Justificación: Los cuatro lugares clave narran la historia de Ezequías: su capital Jerusalén, el punto de la invasión de Senaquerib en Lakís, y las dos características del acueducto (pozo de Guihón → estanque de Siloam) que demuestran su ingenio estratégico. Guihón y Siloam pueden tratarse como un único complejo infraestructural o separados según el mapa del proyecto.

### Lugares nuevos para `lugares.json`
```json
[
  {"id": "lakis", "label": "Lakís", "lon": 34.93, "lat": 31.42},
  {"id": "guihon", "label": "Guihón (pozo)", "lon": 35.232, "lat": 31.768},
  {"id": "siloam", "label": "Siloam (estanque)", "lon": 35.228, "lat": 31.763}
]
```

## No verificado
Nada no verificado tras consulta de Perspicacia. El error en life.start/end se debe a un cálculo inadecuado: los -762 y -697 no se corresponden con el reinado documentado ni con la edad de acceso al trono.
