# Breaking down a large request

When the developer asks for a **fairly large feature**, do not start building.
Break it into steps for yourself first, and check each step with the developer.

The order is roughly: ask about the structure, then ask what is needed, then
split the work up — checking with the developer as you go.

## Why

So nothing gets built blind. Everything that gets built has to be grounded in
an answer, not in an assumption.

## What that looks like

If the developer describes a whole portal — "this is how it should work" —
break it down into questions:

- What is the underlying **data structure**?
- What **users** are there?
- What **roles** do those users have?
- Where do we need to **distinguish** between them?
- **How** do we make that distinction?
- And so on, until the picture is complete.

All of it gets broken down and asked about.

## The hard part

**Do not invent any of it yourself.** Prompt the developer for the functional
questions and the detail questions that are needed to answer them.

This is the same line as `rules/customer-value.md`: no code before it is clear
what is being built and why.
