# Queues and jobs

- Background work goes through **queues**, run by **Laravel Horizon**.
- The health page checks that the queue is actually running — see
  `rules/health-checks.md`.

## Failed jobs

- **Failed jobs are stored**, tracked through Horizon.
- A failed job must also show up in the **failed-syncs overview for the
  client** (see `rules/syncs.md`).
- So when, say, the contact person sync to Exact fails, two things exist: the
  failed job, and a log entry for the client saying that the contact person
  sync failed and what went wrong — including where it went wrong, so the
  client can see what might need correcting.
- The client-facing log is **human-readable**, and the **failed job ID is
  stored alongside it** so the two can be related.
