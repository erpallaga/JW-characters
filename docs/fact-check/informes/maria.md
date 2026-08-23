# María (`maria`)

## Veredicto general

**Lo que está bien:** La era es correcta. El nombre, aunque genérico, es aceptable en el contexto (Perspicacia la llama «María, la madre de Jesús»). El vocabulario de knownFor es correcto («madero de tormento», «resurrección»).

**Lo que está mal:** Las fechas de vida carecen completamente de apoyo en Perspicacia o la Biblia. El año de inicio (-22 a.e.c.) no aparece en ninguna publicación; Perspicacia solo dice «a principios del año 2 a.E.C.» para el anuncio del ángel. El año de fin (55 e.c.) es completamente inventado; la última referencia bíblica a María es en Hechos 1:14 (después de la ascensión, 33 e.c.). El lugar es gravemente incompleto: solo incluye Nazaret y Belén, cuando Perspicacia menciona explícitamente Serranía de Judea, Jerusalén (múltiples viajes), Caná, Capernaúm y Egipto.

## Campos

### name — CORREGIR
- Actual: `María`
- Perspicacia la designa específicamente como: «María, la madre de Jesús» o «María, la madre de Jesús» (entrada 1200002918).
- Propuesta: `María, madre de Jesús` o `María (madre de Jesús)` para distinguirla de otras Marías en la Biblia (Magdalena, hermana de Marta, etc.).
- Fuente: it-1, entrada "María", sección 1 (1200002918) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002918

### eraId — OK
- Actual: `evangelios`
- Contexto correcto: vivió durante la época de Jesús (años alrededor de su nacimiento hasta después de la resurrección en 33 e.c.).

### timeframe — CORREGIR
- Actual: `~22 a.e.c.–55 e.c.`
- **Fecha de inicio (-22 a.e.c.):** No aparece en Perspicacia. La publicación dice: «A principios del año 2 a. E.C., Dios envió al ángel Gabriel a María» para anunciar que concebiría. No especifica cuándo nació María.
- **Fecha de fin (55 e.c.):** No aparece en Perspicacia. La última referencia bíblica a María es en Hechos 1:13-14, poco después de la ascensión de Jesús (33 e.c.): «Los once apóstoles, María y otros discípulos estaban reunidos en un 'aposento de arriba', y 'todos estos persistían de común acuerdo en oración'». Perspicacia no proporciona fecha de muerte.
- Propuesta: `~2 a.e.c.–33+ e.c.` (aprox.) — basado en la última referencia bíblica conocida.
- **Nota sobre la ficha:** Las fechas -22 a.e.c. y 55 e.c. no tienen justificación documental y deben ser reemplazadas.
- Fuente: it-1, entrada "María, la madre de Jesús" (1200002918); Hechos 1:13-14 (última mención bíblica)

### place — CORREGIR (MUY INCOMPLETO)
- Actual: `Nazaret y Belén`
- Perspicacia enumera: «[María] fue a visitarla [Elisabet, en la] **serranía de Judá**» (Lu 1:56), «José tomó a María... y la llevó en un agotador viaje... hasta **Belén**» (Lu 2:1-7), «ella y su esposo llevaron al niño al **templo de Jerusalén**» (Lu 2:21-24), «Aunque la Ley no requería que las mujeres asistieran... a la Pascua, María solía acompañar a José... en el largo y difícil viaje... hasta **Jerusalén**» (años 12+ e.c., aprox.), «Cuando faltó el vino en una boda en **Caná de Galilea**» (Jn 2:1-4), «Jesús viajó de Caná a **Capernaum** junto con su madre» (Jn 2:12), «un ángel... le ordenó que huyese con Jesús a **Egipto**» (Mt 2:1-18), «María estaba junto al **madero de tormento** cuando fijaron a Jesús» (Jn 19:26-27).
- Propuesta: `Nazaret, Serranía de Judea, Belén, Jerusalén, Caná, Capernaúm, Egipto`
- Fuente: it-1, entrada "María, la madre de Jesús" (1200002918) — https://wol.jw.org/es/wol/d/r4/lp-s/1200002918

### life.start — DUDOSO
- Actual: `-22` (año 22 a.e.c.)
- Perspicacia: «A principios del año 2 a. E.C., Dios envió al ángel Gabriel a María» — pero **no especifica cuándo nació María**. La tradición (no bíblica) sugiere que pudo tener unos 12-14 años cuando recibió el anuncio, pero Perspicacia no lo confirma.
- Propuesta: El campo debería ser `DUDOSO` porque Perspicacia no da la fecha de nacimiento de María. Si debe estimarse un año de nacimiento aproximado, sería alrededor de 14-16 a.e.c. (si tenía ~13-15 años en 2 a.e.c.), pero esto es especulación.
- approx: `true` (es muy aproximado, si acaso)
- Fuente: it-1, entrada "María, la madre de Jesús" — sin precisión de nacimiento

### life.end — DUDOSO
- Actual: `55` (año 55 e.c.)
- Perspicacia: «La última referencia bíblica a María muestra que era una mujer creyente y devota... Los once apóstoles, María y otros discípulos estaban reunidos en un 'aposento de arriba'» (Hechos 1:13-14, poco después de la ascensión, mayo 33 e.c.). **No hay fecha de muerte en las publicaciones.**
- Propuesta: Cambiar a `33+` (desconocido; última mención bíblica después de 33 e.c., pero sin precisión). O marcar como `DUDOSO` porque no hay base documental para 55 e.c.
- approx: `true`
- Fuente: it-1, entrada "María, la madre de Jesús" (1200002918); Hechos 1:13-14

### passages — INCOMPLETO
- Actual: Lucas 1, Juan 19
- Perspicacia enumera además: Mateo 1 (genealogía, concepción virginal), Mateo 2:1-23 (nacimiento, Belén, Egipto, retorno), Lucas 2:1-52 (presentación en el templo, viaje a Jerusalén a los 12 años), Juan 2:1-11 (boda en Caná), Juan 2:12 (viaje a Capernaúm), Juan 19:25-27 (junto a la ejecución).
- Propuesta: Mantener Lucas 1 y Juan 19 como principales, pero considerar añadir Mateo 2 (Belén, Egipto), Juan 2:1-12 (Caná, Capernaúm) para completar el recorrido geográfico.
- Fuente: it-1, entrada "María, la madre de Jesús" (1200002918)

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| "Joven de Nazaret" | OK | Lucas 1:26; it-1 p. 429 | Perspicacia: «Dios envió al ángel Gabriel a María, una muchacha virgen del pueblo de Nazaret» |
| "comprometida con José" | OK | Lucas 1:26-27; it-1 p. 429 | Perspicacia: «María, que en aquel tiempo solo estaba comprometida con José» |
| "recibió la visita del ángel Gabriel" | OK | Lucas 1:26-38; it-1 p. 429 | Perspicacia: «'Buenos días, altamente favorecida, Jehová está contigo', fue el sorprendente saludo del ángel» |
| "que le anunció que sería la madre del Hijo de Dios" | OK | Lucas 1:32-35; it-1 p. 429 | Perspicacia: «Cuando le dijo que concebiría y daría a luz un hijo llamado Jesús» |
| "Aceptó ese papel con humildad a pesar de las dificultades sociales" | OK | Lucas 1:38; it-1 p. 429 | Perspicacia: «Emocionada con la perspectiva, pero con la debida modestia y humildad, ella contestó: '¡Mira! ¡La esclava de Jehová! Efectúese conmigo según tu declaración'» |
| "Acompañó a Jesús a lo largo de su vida" | OK | Múltiples pasajes | Perspicacia enumera su presencia en Belén, viajes a Jerusalén, boda en Caná, etc. |
| "incluida su muerte en el madero" | OK | Juan 19:25-27; it-1 p. 433 | Perspicacia: «María estaba junto al madero de tormento cuando fijaron a Jesús» |
| "estuvo presente entre los primeros discípulos reunidos en Jerusalén" | OK | Hechos 1:13-14; it-1 p. 434 | Perspicacia: «La última referencia bíblica a María muestra que era una mujer creyente y devota... Los once apóstoles, María y otros discípulos estaban reunidos en un 'aposento de arriba'» |
| "después de la resurrección" | OK | Hechos 1:13-14; it-1 p. 434 | Perspicacia: Esta reunión ocurrió después de la resurrección de Jesús (33 e.c.) y la ascensión |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Nazaret | Lu 1:26 | «María, una muchacha virgen del pueblo de Nazaret» — ciudad en la región de Galilea | 35.2978 | 32.7021 | alta | nazaret |
| 2 | Serranía de Judea | Lu 1:39-45, 56 | «A fin de fortalecer aún más su fe... a María se le informó... María fue a visitarla [a Elisabet]... Tras pasar unos tres meses con Elisabet en la serranía de Judá, María volvió a Nazaret» — región montañosa al sur, donde vivía Elisabet | 35.2500 | 31.9500 | media | — |
| 3 | Belén | Mt 2:1-7; Lu 2:1-7 | «José tomó a María... y la llevó en un agotador viaje de 110 Km. desde su casa de Nazaret... hasta Belén... el niño nació... en las condiciones más humildes» — según el decreto de censo | 35.2020 | 31.7054 | alta | belen |
| 4 | Jerusalén (Templo) | Lu 2:22-35 | «ella y su esposo llevaron al niño al templo de Jerusalén para presentar la ofrenda prescrita» — presentación de Jesús, circuncisión | 35.2385 | 31.7683 | alta | jerusalen |
| 5 | Egipto | Mt 2:13-15 | «un ángel le advirtió a José de la trama urdida por Herodes... le ordenó que huyese con Jesús a Egipto» — huida para proteger al niño | 30.5000 | 26.0000 | media | egipto |
| 6 | Jerusalén (Viajes anuales) | Lu 2:41 | «Aunque la Ley no requería que las mujeres asistieran a la celebración anual de la Pascua, María solía acompañar a José año tras año en el largo y difícil viaje... hasta Jerusalén» — múltiples viajes a lo largo de la infancia y juventud de Jesús | 35.2385 | 31.7683 | alta | jerusalen |
| 7 | Caná | Jn 2:1-11 | «Cuando faltó el vino en una boda en Caná de Galilea y María le dijo a Jesús: 'No tienen vino'» — primer milagro público de Jesús | 35.3100 | 32.7650 | alta | — |
| 8 | Capernaúm | Jn 2:12 | «Después, Jesús viajó de Caná a Capernaum junto con su madre, sus hermanos y sus discípulos, y se quedó en esta ciudad unos cuantos días» — inicio del ministerio de Jesús | 35.5700 | 32.8800 | alta | — |
| 9 | Jerusalén (Templo, a los 12 años de Jesús) | Lu 2:41-51 | «[María, a los viajes anuales de Pascua]... En uno de esos viajes, alrededor del año 12 E.C., después que la familia había salido de Jerusalén... descubrieron que faltaba Jesús... lo hallaron en el templo» | 35.2385 | 31.7683 | alta | jerusalen |
| 10 | Madero de tormento (Gólgota) | Jn 19:25-27 | «María estaba junto al madero de tormento cuando fijaron a Jesús» — lugar de la ejecución en Jerusalén | 35.2290 | 31.7774 | alta | jerusalen |
| 11 | Aposento de arriba (Jerusalén) | Hch 1:13-14 | «Los once apóstoles, María y otros discípulos estaban reunidos en un 'aposento de arriba', y 'todos estos persistían de común acuerdo en oración'» — después de la ascensión (33 e.c.) | 35.2385 | 31.7683 | alta | jerusalen |

### Selección (máx. 15)

`["nazaret", "belen", "jerusalen", "egipto", "nuevo:caná", "nuevo:capernaúm", "nuevo:serranía-judea"]`

**ruta:** Sí (María hizo un viaje hacia Judea, luego retorno a Nazaret, viajes recurrentes a Jerusalén, viajes con Jesús a Caná y Capernaúm, pero no un itinerario lineal único)

**zoom:** `0.7` (los lugares están dispersos entre Galilea y Judea, con concentración en Jerusalén; un zoom muy cercano perdería la perspectiva geográfica)

**Justificación:** Los siete lugares representan los puntos clave del relato: Nazaret (hogar), Serranía de Judea (encuentro con Elisabet), Belén (nacimiento de Jesús), Egipto (huida), Jerusalén (templo y viajes recurrentes, muerte de Jesús), Caná (primer milagro), Capernaúm (inicio del ministerio de Jesús). El recorrido no es una ruta lineal sino una serie de desplazamientos y retornos.

### Lugares nuevos para `lugares.json`

```json
[
  {
    "id": "caná",
    "label": "Caná de Galilea",
    "lon": 35.3100,
    "lat": 32.7650
  },
  {
    "id": "capernaúm",
    "label": "Capernaúm",
    "lon": 35.5700,
    "lat": 32.8800
  },
  {
    "id": "serranía-judea",
    "label": "Serranía de Judea",
    "lon": 35.2500,
    "lat": 31.9500
  }
]
```

## No verificado

- **Año de nacimiento de María (-22 a.e.c.):** No aparece en Perspicacia. La única referencia temporal es «a principios del año 2 a.E.C.» para el anuncio del ángel, pero no se especifica su edad entonces ni cuándo nació.
- **Año de muerte de María (55 e.c.):** No aparece en ninguna publicación. La última referencia bíblica es Hechos 1:13-14 (poco después de la ascensión, 33 e.c.). Perspicacia no proporciona fecha de muerte.
- **Viajes a Caná y Capernaúm:** Aunque están en la Biblia (Juan 2:1-12), Perspicacia no los describe en la entrada «María» de forma detallada; se deducen del relato evangélico.
- **"Acompañó a Jesús a lo largo de su vida":** Esta frase es una generalización; Perspicacia especifica ubicaciones concretas (Belén, Jerusalén, Caná, Capernaúm, madero), pero no todos los momentos del ministerio de Jesús.
