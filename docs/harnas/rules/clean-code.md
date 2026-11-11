# Clean code — no over-engineering

An AI can easily produce code that takes the easy route and buries it in odd
checks. Build code that has value instead.

- **No thousands of checks** that are not needed.
- **No over-engineered code.**
- Do not end up with hundreds of extra moving parts when it can be done far
  more simply.
- Example: six separate actions were built for a Klarna payment in the Kippers
  project, where one command would have covered it.
- Think it through properly first, and **consult the developer about how
  something should be solved** rather than inventing scaffolding on your own.
- The reason behind all of it: a vibe-coded project must not turn into a mess
  of spaghetti code.
