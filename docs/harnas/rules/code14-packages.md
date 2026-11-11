# Code14 packages

Code14 maintains its own packages. **Use them wherever possible** instead of
building an integration from scratch or pulling in a third-party equivalent.

- **`code14/afas-client`** — AFAS integration
- **`code14/exact-online`** — Exact integration
- **`code14/hubspot`** — HubSpot integration

Also always required, listed in `rules/packages.md`:

- **`code14/quality-watch-health`** — the health page

If an integration is needed and a Code14 package exists for it, that package is
the starting point. Check before writing your own client.
