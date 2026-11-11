# Code style and static analysis

- **Laravel Pint** is used for formatting.
- **PHPStan** (through Larastan) is used for static analysis, with **level 8 as
  the baseline**. Do not lower the level to make errors go away.
- Starting configs live in `stubs/pint.json` and `stubs/phpstan.neon`. Copy
  them into a new project.
