# Documentation

- Every project gets a **`docs/` folder** holding documentation about the
  application.
- **Decisions are documented.** Not just what was built, but the choice that
  was made.
- The **chat history is registered in the project** as well, inside `docs/`.
- Reason: the context must always be clear to the **next developer or the next
  AI** picking the project up.

## How the chat history is recorded

- Write **both a summary and a redacted transcript**. The summary is the way
  in — what was asked, what was decided, why. The transcript sits next to it as
  the full record: complete, except for what the rule below says must be
  stripped.
- Write it **per completed feature**, not per session and not per message.
- **No sensitive information ever ends up in the documentation or the
  transcripts.** Not API keys, not passwords, not client data, not anything of
  that kind. Strip or redact it before writing the transcript — do not commit
  it and clean it up later.
