# Required Composer packages

These are installed in every project, not per case:

- **Laravel Horizon** — background tasks / queues.
- **`code14/quality-watch-health`** — our own health package, built on top of
  the Laravel Health package. Provides a general health page.
- **Oh Dear** — no separate package. The integration ships with
  `spatie/laravel-health`, which registers an Oh Dear endpoint; configure it
  through `oh_dear_endpoint` in `config/health.php` and
  `OH_DEAR_HEALTH_CHECK_SECRET`. Used for uptime and for reading the health
  package's checks.
- **Sentry** (`sentry/sentry-laravel`) — always imported, for errors.
- **`spatie/laravel-data`** — DTOs, see `rules/dtos.md`.

## Installed only when needed

- **`timokoerber/laravel-one-time-operations`** — pulled in when a one-time
  operation is actually needed, not by default. See
  `rules/one-time-operations.md`.
