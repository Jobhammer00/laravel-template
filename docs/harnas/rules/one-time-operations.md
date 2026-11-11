# One-time operations

## When they are needed

When you add something that existing rows do not have yet, the existing data
has to be straightened out. Example: orders have no Exact status; an
`exact_status` is added at order level; on the next deploy that status must be
fetched for every order already in the database.

- Handle that with a **one-time operation**, using
  **`timokoerber/laravel-one-time-operations`**.
- Example: a new field is added to all products from Exact. At deploy, one sync
  has to run once that fetches and fills that data for everything already in
  the database. That belongs in a one-time operation.
- These run **automatically** at deploy. A back-fill that has to happen because
  of the data is never left to someone remembering to run it by hand.
- This does not conflict with syncs being manually triggerable
  (`rules/syncs.md`). Manual triggering exists for **disaster scenarios** —
  something went wrong and has to be re-run. One-time operations exist for
  **data that must be filled once**, and those are automatic.

## Ask the developer first

- Adding a one-time operation is **checked with the developer first** — there
  may be nothing live yet, in which case it is not needed.
- So whenever data is being changed, or data has to be back-filled alongside a
  migration: ask the developer whether a one-time operation should be added.
- When asking, also state **what the impact is and why it is needed**.
