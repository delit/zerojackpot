# ZeroJackpot

En interaktiv Eurojackpot-simulator inspirerad av Svenska Spel, byggd med vanilla JavaScript.

## Beskrivning

ZeroJackpot låter dig välja eller slumpa fram egna lottorader och sedan simulera tusentals dragningar för att se hur ofta du skulle vinna och hur mycket det skulle kosta dig.

## Funktioner

- Välj 5 huvudnummer (1-50) och 2 stjärnnummer (1-12)
- Slumpa fram kompletta rader
- Simulera 100, 1 000, 10 000, 100 000, 1 000 000 eller 10 000 000 dragningar
- Se detaljerad vinstfördelning enligt Eurojackpots regler
- Beräkna total kostnad och nettovinst
- Jämför med investering i indexfond (7% årlig avkastning)
- Responsiv design för mobil och desktop
- Visuell progress-indikator
- Framhävning av bästa resultat

## Teknisk stack

- HTML5
- CSS3 (responsiv design)
- Vanilla JavaScript (ES6+)
- Ingen backend - ren frontend

## Installation

1. Klona eller ladda ner projektet
2. Kör en **lokal webbserver** (i18n laddar `i18n/*.json` via `fetch` – `file://` fungerar oftast inte), t.ex. `npx serve .` eller VS Code Live Server
3. Öppna sidan via `http://localhost:...`

## Språk (i18n)

- Språkfiler: `i18n/sv.json`, `en.json`, `de.json`, `es.json` (samma nyckelstruktur).
- Förvalt språk följer webbläsaren; valet sparas i `localStorage` (`zerojackpot-lang`). Språk väljs längst ned i footern: klicka på **aktuell flagga** eller hovra över den för att se alla språk (🇸🇪 🇬🇧 🇩🇪 🇪🇸).
- **Svenska:** SEK, radpris 25. **Engelska/tyska/spanska:** EUR, radpris 2,50 (ungefärligt), prisnivåer härledda från SEK med fast kurs i `js/logic.js`.
- Logik: `js/i18n.js` (laddning, `data-i18n`, meta/JSON-LD), `js/logic.js` (valuta & `Intl`), `js/jakten.js` (live-sidan).
- Uppdatera översättningar: redigera JSON-filerna. För att återgenerera en/de/es från strukturen kan du använda `node scripts/build-i18n-en-de-es.js` (skriver över `en.json`, `de.json`, `es.json`).

## Användning

1. Välj 5 huvudnummer och 2 stjärnnummer genom att klicka på cirklarna
2. Eller använd "Slumpa rad" för att få en slumpmässig rad
3. Välj hur många dragningar du vill simulera (100, 1 000, 10 000, 100 000, 1 000 000 eller 10 000 000)
4. Se resultaten och beräkningarna

## Vinstplan

Baserad på Eurojackpots officiella vinstplan:

| Kategori | Rätt | Genomsnittlig vinst |
|----------|------|---------------------|
| 1 | 5+2 | 400 000 000 kr (Jackpot) |
| 2 | 5+1 | 2 000 000 kr |
| 3 | 5+0 | 400 000 kr |
| 4 | 4+2 | 16 000 kr |
| 5 | 4+1 | 900 kr |
| 6 | 3+2 | 500 kr |
| 7 | 4+0 | 400 kr |
| 8 | 2+2 | 175 kr |
| 9 | 3+1 | 150 kr |
| 10 | 3+0 | 120 kr |
| 11 | 1+2 | 90 kr |
| 12 | 2+1 | 65 kr |

## Ansvarsfullt spelande

Denna simulator är endast för underhållning och utbildning. Den visar sannolikheten i lotterispel.

Spela ansvarsfullt: https://www.stodlinjen.se

## Licens

Projektet är fritt att använda för personligt bruk.
