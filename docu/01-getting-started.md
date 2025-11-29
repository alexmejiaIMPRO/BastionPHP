# 01 — Getting Started

This file explains how to create a new Bastion PHP project, install dependencies, run migrations and seeders, and run a local development server. The instructions assume PHP 8.x.

---

## Quick start (minimum steps)

1. Generate a new project:
```bash
bash create-php-app.sh my-app
```

2. Change directory:
```bash
cd my-app
```

3. Install dependencies (if the generator didn't):
```bash
composer install
npm install
```

4. Prepare database:
```bash
./bastion migrate
./bastion db:seed
```

5. Start development environment (live reload):
```bash
./bastion run-dev
# open http://localhost:9876
```

---

## What the generator created

Key files and folders you will find:
- `app/` — application sources, file-based routes (`page.php` files), `core` classes and `middleware`.
- `public/` — web root with `index.php` front controller.
- `config/` — configuration; `config/style.php` controls global styling.
- `database/migrations/` and `database/seeds/` — migration and seeder scripts.
- `storage/` — `db/` (SQLite), `logs/`, `cache/`.
- `bastion` — primary CLI for dev/build/migrate/seed/serve/key generation.

---

## Environment (.env)

The generator creates a `.env` file with secure defaults. Key variables:

- `APP_NAME` — application display name.
- `APP_ENV` — `local` or `production`.
- `APP_KEY` — application secret (base64). Use `./bastion key:generate`.
- `APP_URL` — base URL for local development.
- `DB_CONNECTION` — `sqlite` (default), `mysql`, or `pgsql`.
- `DB_PATH` — path to SQLite file.
- `JWT_SECRET` — secret used to sign JWTs.
- `JWT_ACCESS_EXP` — access token TTL (seconds).
- `JWT_REFRESH_EXP` — refresh token TTL (seconds).
- `CSRF_ENABLED` — `true`/`false`.
- `SECURE_COOKIES` — `true`/`false` (requires HTTPS).
- `LOG_LEVEL` — `debug|info|warning|error`
- `LOG_FILE` — path to log file.

If you deploy to production, ensure you:
- Set `APP_ENV=production` and `APP_DEBUG=false`.
- Regenerate `APP_KEY` and `JWT_SECRET`.
- Use a production DB (MySQL/Postgres) and update DB_* env vars.
- Set `SECURE_COOKIES=true` and serve over HTTPS.

---

## First page example

Create `app/about/page.php`:
```php
<?php
$title = 'About';
?>
<h1><?= e($title) ?></h1>
<p>Welcome to Bastion PHP.</p>
```

Visit: `http://localhost:9876/about`

---

## Useful commands

- `./bastion run-dev` — development environment (PHP server + Tailwind watch + BrowserSync).
- `./bastion run-build` — build CSS for production.
- `./bastion migrate` — run DB migrations.
- `./bastion db:seed` — run DB seeders (creates admin/demo user).
- `./bastion key:generate` — generate a new APP_KEY and write to `.env`.

---

## Security note

Do not commit `.env` to source control. Always change `APP_KEY` and `JWT_SECRET` before production. Use HTTPS when `SECURE_COOKIES=true`.
