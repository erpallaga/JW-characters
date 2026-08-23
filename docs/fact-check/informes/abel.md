# Abel (`abel`)

## Veredicto general
Error crítico en cronología: el end de life está 800 años mal. Perspicacia sitúa la muerte de Abel poco antes del nacimiento de Set (3896 a.e.c.), pero la ficha dice end: -3096. El resto del contenido (name, knownFor, passages) está verificado y correcto.

## Campos

### name — OK
- Actual: `Abel`
- Perspicacia (it-1): "ABEL (Abel). 1. (Posiblemente: Exhalación; Vanidad.) Segundo hijo de Adán y Eva"
- Fuente: https://wol.jw.org/es/wol/d/r4/lp-s/1200000018

### eraId — OK
- Actual: `origenes`
- Correcta: orígenes, antes del diluvio
- Fuente: https://wol.jw.org/es/wol/d/r4/lp-s/1200000018

### timeframe — OK
- Actual: `Antes del diluvio`
- Abel murió en época antediluviana, mucho antes del diluvio (2370 a.e.c.)
- Fuente: https://wol.jw.org/es/wol/d/r4/lp-s/1200000018

### place — OK
- Actual: `La tierra habitada antes del diluvio`
- Perspicacia no especifica ubicación geográfica para Abel
- Fuente: https://wol.jw.org/es/wol/d/r4/lp-s/1200000018

### life — CORREGIR
- Actual: `start: -3896, end: -3096, approx: true`
- **PROBLEMA CRÍTICO**: El end es incorrecto. Está 800 años mal.
- Perspicacia: "Puesto que Set nació cuando Adán tenía ciento treinta años, seguramente poco después de la muerte de Abel, es posible que este tuviera tantos como cien años al tiempo de su martirio."
- Cálculo: Adán nació 4026 a.e.c. (cronología JW estándar). Set nació cuando Adán tenía 130 años = 4026 - 130 = 3896 a.e.c. Abel murió poco antes, así murió ~3896 a.e.c. Si tenía ~100 años, nació ~3996 a.e.c.
- **Propuesta**: `start: approx -3996 (or -4000), end: approx -3896, approx: true`
- Fuente: Perspicacia (it-1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018

### passages — OK
- Actual: Génesis 4:1-12, Hebreos 11:4, Mateo 23:35
- Génesis 4:1-12: Abel nace, es pastor, ofrece sacrificio, Caín lo mata ✓
- Hebreos 11:4: "Por fe Abel ofreció a Dios un sacrificio de mayor valor" ✓
- Mateo 23:35: "el justo Abel" ✓
- Fuente: https://wol.jw.org/es/wol/l/r4/lp-s?q=Génesis%204%3A1-12, https://wol.jw.org/es/wol/l/r4/lp-s?q=Mateo%2023%3A35

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Segundo hijo de Adán y Eva | OK | Perspicacia: "segundo hijo de Adán y Eva, y hermano menor del primogénito, Caín" (it-1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018 | — |
| Pastor de ovejas | OK | Perspicacia: "Llegó a ser pastor de ovejas" (it-1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018 | — |
| Ofreció a Dios lo mejor de su rebaño con fe | OK | Perspicacia: "Abel, de los primogénitos de sus rebaños" y "apóstol Pablo cita a Abel como el primer hombre de fe" (it-1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018 | — |
| Su sacrificio fue aceptado | OK | Perspicacia: "Dios aprobó la ofrenda de Abel" (it-1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018 | — |
| Es el primer hombre justo en morir | DUDOSO | Perspicacia llama a Abel "el primer hombre de fe" no explícitamente "el primer hombre justo en morir", aunque Mateo 23:35 lo llama "el justo Abel". La ficha implica que fue el primero de su categoría en morir, lo que no es una afirmación problemática pero sí sutilmente diferente de lo que Perspicacia enfatiza (fe). | Podría decir "el primer hombre de fe en morir" para alinearse exactamente con Perspicacia. |
| Hermano Caín lo mató por envidia | OK | Perspicacia: "asesinó con premeditación a su hermano Abel" y contexto de "actitud de corazón de Caín era mala" (it-1) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018 | — |
| Jesús lo llamó "justo" | OK | Mateo 23:35: "el justo Abel" — https://wol.jw.org/es/wol/l/r4/lp-s?q=Mateo%2023%3A35 | — |
| Pablo incluyó su nombre entre los grandes ejemplos de fe | OK | Perspicacia: "Pablo cita a Abel como el primer hombre de fe" (it-1) y Hebreos 11:4, 12:1 — https://wol.jw.org/es/wol/d/r4/lp-s/1200000018 | — |

## Mapa

### Recorrido completo
Ningún lugar específico mencionado en Perspicacia. Abel vivió en la tierra, fue pastor, fue asesinado por su hermano, pero no hay referencia explícita a ubicación geográfica.

### Selección (máx. 15)
`[]` — ruta: no — zoom: no hace falta

Justificación: No hay lugares de referencia explícita en el relato bíblico o Perspicacia para Abel. Vivió antediluvianamente en la tierra con Adán y Eva, pero sin ubicación identificable.

### Lugares nuevos para `lugares.json`
Ninguno. Abel no tiene referencias a lugares específicos situables en el texto bíblico.

## No verificado
1. **Duración exacta de la vida de Abel**: Perspicacia dice "es posible que este tuviera tantos como cien años" pero usa "posible", no es una cifra exacta. El cálculo aproximado de nacimiento (~3996 a.e.c.) es inferencial, aunque la muerte (~3896 a.e.c.) está bien situada "poco después" del nacimiento de Set.
