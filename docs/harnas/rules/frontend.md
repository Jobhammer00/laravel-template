# Frontend

## Reuse

- Reuse as much as possible **from shadcn** — that first of all.
- Beyond that, build components so they can be **reused as widely as
  possible**.
- Reason: clients should keep seeing **recognisable components**, so they
  immediately know how something works.
- Consequence: one component per concept, used everywhere. Example: a stock
  label that appears in several places is the same component everywhere. Add
  functionality once — say, clicking it opens a modal — and it applies
  everywhere at once, and the client can use it everywhere.

## The limit on reuse

- A reusable component must **not fill up with if-statements** to the point
  where it is no longer usable in different places.
- Reuse has to be achieved in a way that keeps the component genuinely
  reusable, not by branching inside it.
- **The mechanism is chosen per case** — slots, variant props, composition, or
  something else. There is no fixed rule; pick what fits the component. The
  constraint above still holds whatever you pick.
