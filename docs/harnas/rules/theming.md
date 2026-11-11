# Theming

- The **CSS custom properties** in the starter kit must always be filled in
  with the client's own values. Never ship the starter kit defaults.
- The custom properties must be reusable from the Vue code — components read
  the variables, they do not hardcode colours, fonts or radii.
- A **theme guide** is supplied per project. It states at least:
  - the client's colour(s)
  - the client's font
  - roundings / border-radius
- Setting up the theme happens **at the start of every project**, and is
  explained at the start of the project.
- Goal: everything is in the client's style immediately, without a later
  restyling pass.
