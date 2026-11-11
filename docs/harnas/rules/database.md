# Database

## Design

- The database is **always normalised**, meeting the normalisation standards.
  There is no exception; do not deviate from this.
- **Design for future use, not just for the issue in front of you.** Anything
  involving data must not be shaped purely around "this issue needs solving
  now". Think about how the data will be used later, using whatever context you
  have about the future.
- Example: for anything content-related, think about **multilingualism** up
  front, even when only one language is needed today.
- The question "how could this be used later?" is always relevant when
  designing data.

## Which data to take in

Sometimes the data comes from an external integration — for example a client's
Exact administration is downloaded and that download forms the basis of the
data.

- **Always weigh which data is needed and which is not.**
- Some looking ahead is allowed: if we know we will need suppliers later, take
  them along in the sync now.
- But the starting point stays "this data is genuinely needed". Do **not**
  deliberately pull in large amounts of extra data purely to have the data.
- Synced data must be **relevant**. Irrelevant data causes data pollution, and
  that has to be prevented.

## Changes

- **Never change the database without the developer's approval.** This covers both
  changes to the data itself and changes to the database structure. Nothing is
  adjusted before the developer has said yes.
- This applies **always, including while building** — every migration in a
  fresh project needs approval too, not only changes to a live database.
- Before asking, **state the impact clearly**: briefly say what you are going
  to change, then ask whether the developer agrees.
- Where it helps, add an **ERD** so the impact of the change is genuinely clear
  to the developer.
