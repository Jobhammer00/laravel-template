# Documentatie

Dit project is gemaakt uit de CODE14 Laravel-template (via Route14 of met
"Use this template" op GitHub). Lees eerst het harnas: `docs/harnas/CLAUDE.md`.

- `besluiten.md`: elk besluit met de reden en de datum.
- `openstaand.md`: open vragen.

## Wat er vanaf dag één in zit

- Laravel 13 met de Vue + Inertia-starterkit (Fortify, Wayfinder, TypeScript, Tailwind 4).
- Inloggen, wachtwoord vergeten, 2FA en passkeys via Fortify. Registratie staat uit: een admin nodigt gebruikers uit.
- Rollen en rechten met `spatie/laravel-permission`. Rechten staan als enum in `app/Enums/Permission.php`, rollen in `app/Enums/Role.php`. Admin krijgt altijd alle rechten. Een rol is een sjabloon: per gebruiker mag je afwijken.
- Horizon, Sentry, `spatie/laravel-data`, `spatie/laravel-activitylog` en de healthpagina (`code14/quality-watch-health`, met Oh Dear).
- Pest, Pint en PHPStan op level 8 (Larastan). Vitest, ESLint en Prettier voor de frontend.
- shadcn-vue-componenten in `resources/js/components/ui`. Dezelfde set als de prototype-kit van Route14, dus schermen uit Route14 werken hier zonder ombouw.

## Thema

`resources/css/theme.css` bevat alleen de tokens van het design system: de shadcn-kleuren, `--radius`, `--shadow`, `success`/`warning`/`info`, de sidebar, `--font-sans`/`--font-display` en de typeschaal (`--type-<naam>-size|leading|weight|tracking|font`). `app.css` vertaalt die naar Tailwind en leidt er de afgeleide kleuren uit af.
Route14 vervangt `theme.css` per project met het design system van de klant (als PR). De waarden die er nu in staan zijn neutrale plaatshouders: nooit zo opleveren (`docs/harnas/rules/theming.md`).

## Nog per project te doen

- Thema (zie hierboven) en `APP_NAME`.
- Eigen rollen en rechten in de enums. `PermissionSeeder` maakt ze bij elke deploy aan.
- Healthchecks voor elke externe koppeling (`app/Providers/HealthServiceProvider.php`).
- Deploy en omgevingen: niet in de template, want dat verschilt per klant.
- CI: zet de secret `COMPOSER_AUTH` (GitLab-token voor de `code14/*`-packages) in de repo.
