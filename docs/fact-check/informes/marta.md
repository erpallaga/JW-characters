# Marta (`marta`)

## Veredicto general
La ficha es **doctrinalmente correcta** en todos sus elementos verificables. Los campos están bien soportados por Perspicacia. Las únicas limitaciones son que `timeframe` es demasiado específico y `map.lugares` incluye Jerusalén sin verificación explícita de que Marta estuviera allí.

## Campos

### name — OK
- Actual: `Marta`
- Perspicacia (it-1): MARTA
- Fuente: Perspicacia para comprender las Escrituras, entrada MARTA — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917

### eraId — OK
- Actual: `evangelios`
- Perspicacia confirma: vida durante ministerio de Jesús (29–33 e.c.)
- Fuente: Perspicacia, entrada MARTA — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917

### timeframe — DUDOSO
- Actual: `~30 e.c.`
- Perspicacia: Referencias a Marta abarcan el período del ministerio de Jesús (29-33 e.c.) y al menos hasta después de la resurrección de Lázaro. No proporciona fecha específica de nacimiento ni muerte.
- Propuesta: `29–~40 e.c.` (aproximado)
- Justificación: Marta estaba activa durante el ministerio de Jesús (29-33 e.c.); fue testigo de la resurrección de Lázaro (~32 e.c.); se presume vivió en Jerusalén/Betania al menos hasta después de Pentecostés, pero Perspicacia "guarda silencio sobre los últimos años de la vida de Marta y cuándo y en qué circunstancias murió."
- Fuente: Perspicacia, entrada MARTA — "Las Escrituras guardan silencio sobre los últimos años de la vida de Marta y cuándo y en qué circunstancias murió" — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917

### place — OK
- Actual: `Betania, cerca de Jerusalén`
- Perspicacia BETANIA: "Pueblo situado 'como a tres kilómetros' de Jerusalén"
- Perspicacia MARTA: "Mujer judía de Betania, hermana de Lázaro y de María"
- Fuente: Perspicacia, entradas MARTA y BETANIA — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917, https://wol.jw.org/es/wol/d/r4/lp-s/1200000670

### life — DUDOSO
- Actual: `start: -10, end: 45, approx: true`
- Perspicacia: No proporciona fechas de nacimiento ni muerte de Marta. Las estimaciones (-10 a 45 e.c.) son razonables dentro de los parámetros de la vida palestina del primer siglo, pero **no están respaldadas por Perspicacia**.
- Propuesta: Mantener `approx: true` pero marcar como DUDOSO. Si es necesario rango, usar solo las fechas verificadas: start: 29 (primeras referencias), end: 33 (último registro durante ministerio), ambas con `approx: true`.
- Fuente: Perspicacia, entrada MARTA — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Amiga cercana de Jesús, hermana de María y Lázaro | OK | Perspicacia MARTA: "Mujer judía de Betania, hermana de Lázaro y de María...Le unían a estos tres hermanos lazos afectivos, pues se dice específicamente: 'Ahora bien, Jesús amaba a Marta y a su hermana y a Lázaro'" (Jn 11:5) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917 | — |
| Mujer activa y hospitalaria que recibía a Jesús en su casa | OK | Perspicacia MARTA: "Cristo visitaba a menudo su casa cuando estaba en las inmediaciones de Jerusalén"; Lucas 10:38 "lo recibió en la casa"; Juan 12:2 "Marta estaba sirviendo" — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917 | — |
| Tras la muerte de Lázaro expresó una fe notable: "sé que resucitarás a mi hermano en el último día" | CORREGIR (redacción) | Perspicacia cita exactamente: "Yo sé que se levantará en la resurrección en el último día" (Juan 11:24); NWT lee: "Yo sé que se levantará en la resurrección, en el último día" — https://wol.jw.org/es/wol/l/r4/lp-s?q=Juan%2011%3A24 | Propuesta: "Tras la muerte de Lázaro expresó fe en la resurrección: 'Yo sé que se levantará en la resurrección, en el último día'" (cita directa). O bien, paráfrasis: "expresó fe en que su hermano sería resucitado en el último día." Nota: La ficha dice "resucitarás a mi hermano" (Jesús como sujeto), pero Juan registra que Marta se refiere a la resurrección general en el último día, no específicamente a Jesús resucitando a Lázaro en ese momento (lo que ocurrió poco después por intervención directa de Jesús). |
| Jesús la corrigió con cariño cuando estaba ansiosa por las tareas domésticas | OK | Perspicacia MARTA: "Cristo...con bondad la reprendió: 'Marta, Marta, estás inquieta y turbada en cuanto a muchas cosas'"; Lucas 10:41-42 — https://wol.jw.org/es/wol/d/r4/lp-s/1200002917 | — |
| mostrando que ella aceptaba bien el consejo | DUDOSO | Perspicacia MARTA: Registro post-corrección muestra a Marta "sirviendo" nuevamente en Juan 12:2, lo que puede indicar continuidad en su naturaleza servicial, no necesariamente aceptación de la reprensión. No hay texto explícito que afirme que Marta "aceptó bien el consejo." | Propuesta sugerida: "mostrando que ella valoraba el consejo espiritual" O eliminar esta frase si no hay confirmación de cambio de comportamiento. Lucas 10:41-42 presenta el incidente como enseñanza de Jesús, pero no registra cambio inmediato de Marta. |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Betania | Lucas 10:38, Juan 11:1 | el-ʽAzariyeh, 2.5 km al ESE monte del Templo, ladera oriental monte de los Olivos, "como a tres kilómetros" de Jerusalén | 35.2622 | 31.7714 | alta | `betania` |

**Nota**: Marta es mencionada exclusivamente en relación con Betania y su casa. No hay registro de que acompañara a Jesús a Jerusalén, Getsemaní, o a eventos del ministerio en Galilea. Lucas 10:38 registra una "cierta aldea" (identificada por Perspicacia como Betania); Juan 11 y 12 ubican todos los eventos en Betania o camino de Betania a Jerusalén.

### Selección (máx. 15)
`["betania"]`

— ruta: **no** — zoom: **no hace falta** (un solo lugar)

Justificación: El recorrido de Marta se limita a un único lugar documentado (Betania). Aunque Jerusalén está implícita en las referencias ("cerca de Jerusalén"), no hay pasaje que registre explícitamente que Marta estuviera en Jerusalén. Los eventos con Jesús ocurren en su casa o en caminos cercanos a Betania (Juan 11:20 "Marta salió a su encuentro", sugiriendo un encuentro en el camino a Betania, pero en contexto de su hogar).

### Lugares nuevos para `lugares.json`
Ninguno. Betania ya existe en nomenclátor con id `betania`.

## No verificado
- **Rango exacto de vida de Marta (dates -10 a 45 e.c.)**: Perspicacia no proporciona estas fechas. El rango es estimación razonable pero sin base en publicaciones de jw.org. La única información concreta es que estuvo viva durante el ministerio de Jesús (~29-33 e.c.).
- **Significado de "aceptaba bien el consejo"**: Perspicacia no proporciona confirmación explícita de que Marta cambió su comportamiento tras la corrección de Jesús. Está documentado su rol continuo en hospitalidad (Juan 12:2 "Marta estaba sirviendo"), pero no si esto representa aceptación de la enseñanza sobre prioridades espirituales.
