# CHANGELOG

This file summarizes the most important changes introduced by the recent update (migration from v2.x to the current integrated generator and v3 style).

## [Unreleased] — migration summary (breaking / noteworthy changes)
- CLI consolidation
  - The canonical CLI is now `./bastion`. The older `artisan` file may be present for compatibility but is deprecated. Update CI and developer docs to call `./bastion`.
  - Action required: replace `php artisan ...` with `./bastion ...`.

- Generator size & templates
  - The generator script (`create-php-app.sh`) was compacted. The generator no longer inlines very large demo HTML; instead it scaffolds concise templates and separate files. For teams that relied on verbose embedded demo content, re-enable via `--full` option (to be added) or copy the long templates from previous repo snapshot.

- Restored features
  - Migrations/Seeders: restored; seeders create demo/admin accounts (change seed credentials before production).
  - Admin panel: basic admin pages and an API handler were restored.
  - Security Middleware: SecurityHeaders, CSRF, RateLimit, AdminOnly restored.
  - Logger, Response, enhanced Request: restored to provide consistent helpers.

- Defaults & security
  - `.env` generation produces secure random `APP_KEY` and `JWT_SECRET` by default.
  - Default `SECURE_COOKIES=false` for local dev; set to `true` for production with HTTPS.

## Migration notes (for maintainers)
- Update scripts and CI to use `./bastion` commands.
- Verify any custom modules referencing `artisan`.
- Confirm file permissions for `storage/` and `storage/db/app.db`.

## Deprecated
- Inline giant demo templates in the generator script are deprecated. Use separate template files under `resources/` for maintainability.
