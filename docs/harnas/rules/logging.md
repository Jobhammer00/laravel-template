# Logging

## Sentry logging on operation-critical syncs

For operation-critical syncs, logging is added and **sent to Sentry**, using
Sentry's logging capability.

Log at least:

- **what the sync did**
- **the date of the sync**
- **what succeeded**
- **what came back** from the external system
- **the sync status**

Purpose: we can always trace **when a sync ran and whether it went well**.

### Which syncs count

The test is whether a failure **harms the operation**.

- **Log it**: orders, contact persons, bulk price syncs — anything whose
  failure damages the operation.
- **Do not log it**: a payment-terms table synced once a day as a safety net
  needs no info log.

This is the same line as in `rules/health-checks.md`: what must keep running is
what gets watched.

## Logging inside the application

Sentry is for us. The client needs to see it too.

- Failures are also logged **in the application itself**, so the client can see
  in the portal that a sync went wrong, and **what** went wrong.
