# About this harness

Notes about maintaining the harness itself. This file is **not** a rule file
for projects and is not imported by `CLAUDE.md`.

## How this harness is maintained

- Rules are dictated by the owner. The AI does not invent rules.
- The AI may propose rules, but a proposal is always labelled as a proposal and
  is only recorded after explicit approval.
- Anything unclear or half-stated is asked back, not filled in.
- Source of truth lives in `~/Projects/harnas` and is copied into each new
  project.
- Rules are split into topic files under `rules/`, imported by `CLAUDE.md`.
  Every split is reported.
- `stubs/` holds starting config files that a new project copies. They were
  written fresh for this harness, not copied from an existing project.

## Proposals — not yet approved

Written down by the AI, not dictated. Nothing here is a rule until approved.

_(none)_

## Open questions

- How does this harness actually get into a new project? Copy, symlink, a
  composer package, a script? `stubs/` says "copy them into a new project"
  without saying what the rest of the setup looks like. To be worked out.

## Decided against

- The other `code14/*` packages found in existing projects — `addresses`,
  `auditable`, `channable`, `code-style14`, `dbe`, `laravel-ag-grid`, `mirito`,
  `parcel-pro`, `prismic`, `puik`, `svod`, `twente`, `uploaded-file-storage` —
  do **not** belong in the harness. Including `code-style14`, so
  `stubs/pint.json` stays as the code style baseline.
