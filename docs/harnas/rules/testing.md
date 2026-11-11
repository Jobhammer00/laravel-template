# Testing

- **Everything is tested.** Code is not delivered untested.
- Tests are written with **Pest**.

## What must be covered

- **Feature tests**
- **Unit tests**
- **Syncs** — the sync actions and their commands
- **External clients**

## External clients

- For external clients, **fakers must be created** as well. The client layer is
  tested against those fakes, not against the live external system.
