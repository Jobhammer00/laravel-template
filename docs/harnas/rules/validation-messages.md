# Validation messages

Every message a user can see must be **readable** and in the **language of the
application**. A message is part of the product, not a debug line that happens
to reach the screen.

## Readable

- The message says **what is wrong** and, where it helps, **what to do about
  it**.
- It uses the words from the screen, not from the database. Never a column name
  or a key: not `wanted_delivery_date`, not `lines.0.quantity`, not
  `validation.uuid`.
- A field is named the way it is labelled in the interface.

## In the right language

- Both halves of a validation message get translated: the **rule text** and the
  **attribute name**. Translating only the rule leaves a Dutch sentence with an
  English field in it.
- In Laravel that means every field goes into the `attributes` list of the
  language file, including nested and wildcard keys such as
  `lines.*.quantity`.
- Watch the **rule parameters**. Laravel drops them into the sentence
  untranslated, so `after_or_equal:today` produces "... moet een datum vanaf
  today zijn". Give those rules their own message on the request.
- This applies to every message the user reads, not only server-side
  validation: inline errors, toasts, empty states and confirmation dialogs.

## Checking

- Trigger every rule **once** and read the result. Reading the language file is
  not a check — the gaps are exactly the entries that are missing from it.
- A message that appears in the interface and is not covered by a test is worth
  a test when the wording carries meaning, for instance when it names the
  reason something was refused.
