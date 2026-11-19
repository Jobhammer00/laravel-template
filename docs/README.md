# Documentatie

Dit project is gemaakt uit de CODE14 Laravel-template (via Route14 of met
"Use this template" op GitHub). Lees eerst het harnas: `docs/harnas/CLAUDE.md`.

- `besluiten.md`: elk besluit met de reden en de datum.
- `openstaand.md`: open vragen.

## Wat er vanaf dag één in zit

- Laravel 13 met de Vue + Inertia-starterkit (Fortify, Wayfinder, TypeScript, Tailwind 4).
- Inloggen, wachtwoord vergeten, 2FA en passkeys via Fortify. Registratie staat uit: een admin nodigt gebruikers uit.
- Rollen en rechten met `spatie/laravel-permission`. Rechten staan als enum in `app/Enums/Permission.php`, rollen in `app/Enums/Role.php`. Admin krijgt altijd alle rechten. Een rol is een sjabloon: per gebruiker mag je afwijken.
- Horizon, Sentry, `spatie/laravel-data`, `spatie/laravel-activitylog` en de healthpagina (`spatie/laravel-health` op `/health`, alleen ingelogd, met Oh Dear).
- Pest, Pint en PHPStan op level 8 (Larastan). Vitest, ESLint en Prettier voor de frontend.
- shadcn-vue-componenten in `resources/js/components/ui`. Dezelfde set als de prototype-kit van Route14, dus schermen uit Route14 werken hier zonder ombouw.
- De hulpbestanden van de prototype-kit van Route14, op hetzelfde pad als daar: `v-reveal` en `useScrollProgress` (`resources/js/lib/reveal.ts`, de looks in `resources/css/motion.css`), `SplitText`, `Marquee`, `Parallax` en `CountUp` (`resources/js/components/motion/`), `BrandAsset` en `asset()` (de assets van het design system in `public/images/design`) en `stock` (stockfoto's in `public/images/stock`). Route14 is de bron: de design-system-export overschrijft ze, dus pas ze daar aan, niet hier. Daarom slaan ESLint en Prettier ze over.
- Teksten via `laravel-vue-i18n`: `trans('<bestand>.<sleutel>')` in Vue leest `lang/nl/<bestand>.php`, dezelfde teksten als de backend. Een scherm uit Route14 krijgt zijn teksten zo.

## Thema

`resources/css/theme.css` bevat alleen de tokens van het design system: de shadcn-kleuren, `--radius`, `--shadow`, `success`/`warning`/`info`, de sidebar, `--font-sans`/`--font-display` en de typeschaal (`--type-<naam>-size|leading|weight|tracking|font`). `app.css` vertaalt die naar Tailwind en leidt er de afgeleide kleuren uit af.
Route14 vervangt `theme.css` per project met het design system van de klant (als PR). De waarden die er nu in staan zijn neutrale plaatshouders: nooit zo opleveren (`docs/harnas/rules/theming.md`).

## Nog per project te doen

- Thema (zie hierboven) en `APP_NAME`.
- Eigen rollen en rechten in de enums. `PermissionSeeder` maakt ze bij elke deploy aan.
- Healthchecks voor elke externe koppeling (`app/Providers/HealthServiceProvider.php`).
- Deploy en omgevingen: niet in de template, want dat verschilt per klant.
