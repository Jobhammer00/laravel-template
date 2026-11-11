# Pipelines

Every project's CI pipeline is assembled from the **Code14 CI components** in
`code14nl/internal/devops/ci-components` on GitLab. Nothing is hand-written.

- **No custom jobs.** A job written by hand in a project's `.gitlab-ci.yml` is
  not maintained by anyone, drifts from the other projects, and has to be
  discovered again by the next person. Include a component instead.
- **Configure through inputs.** Everything a project needs to vary — the image,
  the working directory, paths, flags, the build job to wait for — goes through
  the component's `inputs`, not through overriding the job.
- **A check with no component is a request, not an exception.** If something has
  to run in CI and no component covers it, ask the DevOps team for a component.
  Do not solve it locally in the project; then the next project has the same gap.
- Look before you assume: the group holds far more components than a project
  usually includes. List it before concluding something is missing.

## Why

Components carry their own tests, their own release flow and one set of
defaults. A hand-written job carries none of that, and every project that
copies it inherits the bugs.

## Consequence for the definition of done

A check that only runs in `composer ci:check` on a developer's machine is not
covered. If it belongs in CI, it belongs in a component — see
`rules/definition-of-done.md`.
