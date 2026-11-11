# Health checks

The health page from the Code14 health package shows cards. What those cards
must cover:

- **Every external system is checked.** Not a selection — all of them.
- **Every connection method gets its own check.** If an external application is
  reached in more than one way, each way is checked separately. Examples:
  Business Central has a normal API *and* a custom API — both are checked. An
  application reached over XML *and* over FTP — both are checked.
- **Every new external application or new external link always gets its own
  health check.** This is not optional and not deferred.
- **Every instance gets its own check.** Example: a client with multiple Exact
  administrations gets a check per administration, testing whether that
  administration is reachable.
- **Critical operational processes are checked too**, not just external
  connections. Examples: is the queue actually running; a scheduled job that
  must always run gets its own card.
- The rule behind all of the above: everything operational and everything that
  is core business must keep working. Anything that must keep working is
  checked.
- When a check fails, the alert reaches us through the **standard Oh Dear
  integration**. Routing of that alert — channel, recipients, escalation — is
  configured inside Oh Dear, not in the project. The project's only job is to
  expose the check correctly.
