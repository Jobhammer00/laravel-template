# Besluiten

| # | Besluit | Reden | Datum |
|---|---------|-------|-------|
| B1 | **Een scherm uit Route14 wordt overgenomen, niet nagebouwd.** De template heeft de hulpbestanden van de prototype-kit op het pad dat Route14 ze heeft (`lib/reveal.ts`, `lib/assets.ts`, `lib/stock.ts`, `components/BrandAsset.vue`, `components/motion/*.vue`, `css/motion.css`, geïmporteerd in `app.css`), en `laravel-vue-i18n` voor de teksten uit `lang/nl`. ESLint en Prettier slaan de kitbestanden over, zoals `components/ui`. | De bouwer neemt de code van een prototypescherm als pagina over; zijn imports wijzen dan meteen naar bestaande bestanden. Route14 is de bron en de export schrijft ze zoals ze zijn, dus de eigen linters van de template mogen ze niet anders willen (Route14 `B219`, #379). | 19-11-2026 |
