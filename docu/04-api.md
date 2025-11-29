# 04 — API Overview

This document explains the top-level framework APIs: routing model, DI container, view engine, DB API, Auth, and helpers.

---

## Routing (file-based)

- Routes are defined by filesystem structure under `app/`.
- Any `page.php` becomes a route. Nested folders map to path segments.
- Dynamic segments use `[param]` folder names (e.g. `app/users/[id]/page.php`).
- API endpoints use `+server.php`. The file should return an array keyed by HTTP method (`get`, `post`, `put`, `delete`) with callable handlers that receive the `$req` argument.

Example `+server.php`:
```php
return [
  'get' => function($req){
    header('Content-Type: application/json');
    echo json_encode(['ok'=>true]);
  }
];
```

When to use:
- Use pages for HTML responses and `+server.php` for JSON/HTMX endpoints.

---

## Container & App

- `App\Core\Container` — simple DI container with `bind` and `singleton`.
  - `bind(string $key, callable $resolver)`
  - `singleton(string $key, callable $resolver)`
  - `resolve(string $key): mixed`

- `App\Core\App` — application class extending Container.
  - Registers core services (DB, Auth, Logger).
  - `use(callable $middleware)` register middleware in order.
  - `run()` bootstraps Request and executes middleware + router dispatch.

When to use:
- Register services in App during bootstrap for central access. Resolve via `App::getInstance()->resolve()`.

---

## View Engine — DV (Data View)

- `App\Core\DV::set($key,$value)` and `DV::render($path, $data = [])`.
- Renders `resources/views/<path>.php` OR accepts a full file path.
- Use `view()` helper which delegates to DV.

Security:
- Escape content with `e()` helper before outputting untrusted data.

---

## DB — PDO facade & QueryBuilder

- `App\Core\DB::pdo()` — returns a PDO instance. For SQLite default uses WAL mode.
- `App\Core\DB::table('users')` — returns a QueryBuilder instance with:
  - `where(string $col, mixed $val): self`
  - `limit(int): self`
  - `offset(int): self`
  - `get(): array`
  - `first(): ?array`
  - `insert(array $data): int`

When to use:
- Use QueryBuilder for simple CRUD; use raw PDO for complex queries and joins.

---

## Auth — JWT

- `App\Core\Auth::issueTokens($userId): array` — returns access & refresh tokens and expiry.
- `Auth::validate($token)` — verifies JWT signature and returns decoded payload or null.
- `Auth::validateRefreshToken($token)` — checks refresh token record and returns user id or null.
- `Auth::loadUser` — middleware that sets `$GLOBALS['auth_user']` and `$req->meta['user']`.
- `Auth::requireAuth($req, $next)` — enforces authenticated access.

Security notes:
- Refresh tokens are stored in `refresh_tokens` table; refresh token validators are hashed.
- Store long-lived refresh tokens in HttpOnly cookies.

---

## Helpers

- `env($key, $default = null)` — environment lookup.
- `e($value)` — HTML escaping (ENT_QUOTES, UTF-8).
- `logger()` — returns `App\Core\Logger` instance.
- `view()` — shorthand for DV::render.
- `config($key, $default)` — loads config files from `config/`.

---

## Middleware

- `App\Middleware\SecurityHeaders::handle($req, $next)` — sets CSP, security headers, and a per-request CSP nonce at `$req->meta['csp_nonce']`.
- `App\Core\CSRF::verify($req, $next)` — verifies CSRF tokens for non-JSON state-changing requests.
- `App\Middleware\RateLimit::limit($max,$minutes)` — returns middleware to rate limit requests.
- `App\Middleware\AdminOnly::handle` — denies non-admin users.

When to use:
- Register SecurityHeaders and CSRF globally. Use AdminOnly for /admin routes.

---

## CLI: bastion

- `./bastion run-dev` — runs PHP dev server, Tailwind watch, BrowserSync.
- `./bastion run-build` — builds production CSS.
- `./bastion migrate` — runs migrations
- `./bastion db:seed` — runs seeders
- `./bastion serve [host] [port]` — runs `php -S`
- `./bastion key:generate` — generate and write APP_KEY to `.env`.

Use this CLI for day-to-day development. The older `artisan` is optional backup.
