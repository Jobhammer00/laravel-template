# Syncs

Every sync, in every direction, must be re-runnable at any time — including
manually.

## One action per sync

- Each sync has **its own action**, and that single action arranges everything
  for that sync. Example: the order sync is handled by one order-sync action.
- Other code calls into that action. Nothing bypasses it with its own copy of
  the sync logic.
- If a list of syncs has to run at some point, you call the actions of those
  syncs and everything keeps working from those actions.

## A command per sync

- There must **always be a command** that can kick off and force that sync.
- Commands support both **bulk and single**.
- Reason: if a sync went wrong — say the sync of one specific order — it must
  be possible to trigger it manually again.

## Running twice must be safe

- **A sync must always be safe to run twice.** Updating a product, for example,
  can run twice without harm — that is the baseline every sync is built to.
- But some effects must not happen twice: invoicing an invoice, sending a mail.
- For those, the repeat must be **caught**: "this mail has already been sent
  once — are you sure you want to do it again?"
- **Which effects cannot be repeated differs per sync.** Work it out per sync
  and guard the ones that cannot.

### When there is nobody to ask

Most syncs run from the queue or the scheduler, where no one can answer that
question.

- The guarded effect is **blocked** — the run stops rather than repeating it.
- Only an explicit **`--force`** carries it out again.
- A block is visible in the failed jobs and in the client overview, like any
  other failure.

## Create-or-update inside the action

- An action that pushes to an external system does the create-or-update
  decision itself. Example: "update the order to Exact" first checks whether
  the order already exists in Exact — if not, create; if it does, update.
- If the push depends on something that must already exist in the external
  system — a category, for instance — the action first calls an **ensure** for
  that dependency: ensure the category exists in the external system. That
  ensure does its own update-or-create for the category.
- The point: everything runs through a single action that routes the rest.

## Naming

- Singular command for a single record (`SyncItemCommand`), plural for bulk
  (`SyncItemsCommand`).
- Actions are named `<Verb><Subject>Action`.
- Dependency guards are named `Ensure<Subject>ExistsAction`.
- External integrations are grouped per system, under
  `app/Actions/External/<System>/` and `app/Console/Commands/<System>/`.

## Sync overview for the client

Every project gets an overview built and documented for the client, showing:

- **all syncs that can be triggered**, so the client can kick them off manually
- **all syncs that went wrong**, and what went wrong

All of this has to be clear to the client in one overview. See
`rules/logging.md` for what gets logged.

## Reference implementation

`~/Projects/kabelpro` (the Laravel app lives in `api/`) is the example to
follow. Verified there:

- `app/Actions/Orders/EnsurePurchaseOrderExistsAction.php`
- `app/Actions/External/{BusinessCentral,Uniconta,WooCommerce}`
- per-sync commands under `app/Console/Commands/BusinessCentral/`
