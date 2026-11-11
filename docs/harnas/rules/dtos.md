# DTOs

- **Always use a DTO for data**, both when fetching data from an API and when
  sending data to an API. No raw arrays crossing those boundaries.
- Use the Laravel DTO package for this: **`spatie/laravel-data`**.
- **Every field is validated** in the DTO. The point is that we never suddenly
  get a string where an int is expected, or the other way round. That has to be
  right every time.
