# Definition of done

This is the **floor for every project**. A project may add stricter
requirements on top of it; it may never go below it. The per-project delivery
process in `rules/project-start.md` builds on this, it does not replace it.

Nothing is handed back until **everything is green**:

- **Tests pass.**
- **Pint has been run.**
- **PHPStan is clean** at level 8.

All of it has to have actually been run — not assumed.

## Test your own work first

Beyond the tooling: the AI **verifies its own work before handing it back**.

If the feature is supposed to do A, B and C, the question to answer before
returning is: *have I actually tested this, and does it all work?* Not "it
should work" — checked.
