# 03 — Configuration

This document lists environment variables and configuration files produced by the generator and how to use them.

## Primary config files

- `config/style.php` — controls global styling system (Tailwind vs fallback).
  - Keys:
    - `useTailwind`: bool — enable Tailwind.
    - `tailwindMode`: 'cdn'|'build' — CDN for dev, build for production.
    - `fallbackCss`: string — path to fallback CSS.

- `config/app.php` (if present) — app-level metadata (name, env, port).

## Environment variables (.env)

Default example produced by the generator:

```
APP_NAME="Bastion App"
APP_ENV=local
APP_KEY=<base64>
APP_URL=http://localhost:9876

DB_CONNECTION=sqlite
DB_PATH=storage/db/app.db

JWT_SECRET=<base64>
JWT_ACCESS_EXP=900
JWT_REFRESH_EXP=604800

CSRF_ENABLED=true
SECURE_COOKIES=false

LOG_LEVEL=debug
LOG_FILE=storage/logs/app.log
```

### Important variables (explain what each controls)

- `APP_NAME` — display name for UI and logging.
- `APP_ENV` — `local|production`. Controls error reporting and some security defaults.
- `APP_KEY` — cryptographic key used by some framework features; rotate using `./bastion key:generate`.
- `APP_URL` — used for building absolute URLs.
- `DB_CONNECTION` — `sqlite`, `mysql`, `pgsql`. Switch and set DB_* accordingly.
- `DB_PATH` — SQLite file path.
- `JWT_SECRET` — secret for signing JWT tokens. Must be a secure random string in production.
- `JWT_ACCESS_EXP` — seconds for access token expiration.
- `JWT_REFRESH_EXP` — seconds for refresh token expiration.
- `CSRF_ENABLED` — enable/disable CSRF verification.
- `SECURE_COOKIES` — when true cookies are created with the Secure flag (requires HTTPS).
- `LOG_LEVEL` / `LOG_FILE` — control logging.

---

## Tailwind build config

- `package.json` includes dev scripts:
  - `dev` => `./bastion run-dev`
  - `build` => `./bastion run-build`

- For production: `./bastion run-build` generates `public/css/app.css`.

---

## Recommended production values

- `APP_ENV=production`
- `APP_DEBUG=false`
- `SECURE_COOKIES=true`
- Use MySQL/Postgres for `DB_CONNECTION` in production.
- Ensure `APP_KEY` and `JWT_SECRET` are unpredictable and different for each environment.
