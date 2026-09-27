# Svetlana Cakes & Café

Mobile-first, zweisprachige One-Page für das Café in Kassel. Das angegebene GitHub-Repository war leer; deshalb verwendet die Website Vite und natives JavaScript ohne Framework oder Backend.

## Entwicklung

Node.js 22.12+ oder 24 und pnpm verwenden:

```sh
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm preview
```

Browser- und Barrierefreiheitsprüfungen: `pnpm exec playwright install chromium`, danach `pnpm exec playwright test`. Optional kann `BROWSER_PATH` auf eine vorhandene Chromium-/Chrome-Datei zeigen. Geprüft werden 320, 390, 768 und 1440 Pixel, DE/EN einschließlich Persistenz, Formularvalidierung und WhatsApp-Link (ohne Versand), Dialoge, Menü-Tastaturbedienung und automatisierte WCAG-AA-Kriterien. Screenshots liegen nach einem Testlauf in `test-results/`.

`dist/` kann auf einem beliebigen statischen Webhost unter einer eigenen Domain bereitgestellt werden. Es sind keine Umgebungsvariablen erforderlich. Bei Veröffentlichung unter einem Unterpfad muss Vites `base` konfiguriert werden.

## Inhalte und Bilder

- Deutsche Standardinhalte: `index.html`; Englisch und lesbare Menüauswahl: `src/content.js`.
- Die Sprache wird unter `svetlana-language` lokal gespeichert. Bei deaktiviertem Storage funktioniert der Sprachwechsel trotzdem.
- Alle Fotos stammen aus den bereitgestellten JPEG-Dateien. Smartphone-Oberflächen wurden abgeschnitten, die Originalkarte wurde gedreht. Keine Stockfotos und keine generierten Bilder.
- Optimierte WebP-Dateien in zwei Größen sind eingecheckt. `node prepare-assets.cjs /pfad/zu/originalen` reproduziert die Ausschnitte. Die Originale sind dafür notwendig, für Build und Betrieb nicht.
- Die Menüaufnahme ist rechts teilweise abgeschnitten. Deshalb zeigt die Textauswahl ausschließlich eindeutig lesbare Produktnamen; keine transkribierten Preise. Die Originalaufnahme bleibt vergrößerbar. In Englisch wird die unveränderte deutsche Originalkarte ausdrücklich als solche bezeichnet.
- Fonts sind lokal eingebunden; ihre OFL-Lizenzen liegen unter `public/fonts/`. Es werden beim Seitenaufruf keine Google-Fonts-, Karten-, Social- oder Analyse-Dienste geladen.
- Das WhatsApp-Formular verarbeitet Angaben nur im Arbeitsspeicher und öffnet den offiziellen `wa.me`-Link mit URL-kodiertem Text. Es sendet selbst keine Nachricht und speichert keine Formulardaten. Die tatsächliche Übermittlung erfolgt erst in WhatsApp.

## Vor Veröffentlichung ergänzen

Impressum und Datenschutzerklärung sind ausdrücklich als Platzhalter gekennzeichnet. Betreiberangaben und eine zum tatsächlichen Hosting passende Datenschutzerklärung müssen bereitgestellt und geprüft werden. Es sind keine Öffnungszeiten erfunden; die Website verweist dafür auf Instagram. Sobald eine endgültige Domain bekannt ist, können Canonical-URL, absolute Open-Graph-Bild-URL und Sitemap ergänzt werden.

## Bedienung

Die Lightbox bietet native Dialog-Fokusbegrenzung, Escape zum Schließen, Pfeiltasten für die Galerie sowie Vergrößern und Scrollen für die Karte. Die Menüreiter sind mit Pfeiltasten bedienbar. Der dekorative Cursor und Scrollanimationen berücksichtigen Touch und reduzierte Bewegung.
