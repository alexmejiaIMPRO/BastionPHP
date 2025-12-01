# Bastion PHP

> **Bastion PHP** is a security-first, file-based PHP framework designed for fast, modern development inside hostile environments (enterprise, legacy infra, untrusted networks).  
> Think: **Next.js–style routing**, **FastAPI–like endpoints**, **Tailwind + HTMX UI**, and **hardened security** — all in clean, framework-less PHP.

---

## Table of Contents

- [Philosophy](#philosophy)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
  - [Typical CLI Workflow](#typical-cli-workflow)
- [Directory Structure](#directory-structure)
- [Request Lifecycle](#request-lifecycle)
- [Routing & Views](#routing--views)
  - [Hybrid Routing](#hybrid-routing)
  - [UI Pages (`page.php`)](#ui-pages-pagephp)
  - [Layouts (`layout.php`)](#layouts-layoutphp)
  - [Components](#components)
  - [API Endpoints (`+server.php`)](#api-endpoints-serverphp)
  - [Middleware](#middleware)
- [DV Engine (Data View)](#dv-engine-data-view)
- [Helpers Reference](#helpers-reference)
- [Security Protocols](#security-protocols)
  - [XSS Protection with `e()`](#xss-protection-with-e)
  - [CSRF Protection](#csrf-protection)
- [Authentication](#authentication)
- [Database & Migrations](#database--migrations)
- [The Bastion CLI](#the-bastion-cli)
- [Testing (High Level)](#testing-high-level)
- [Roadmap / Ideas](#roadmap--ideas)
- [License](#license)

---

## Philosophy

Bastion is built on three simple ideas:

1. **Security first.**  
   Assume the environment is hostile: untrusted input, legacy proxies, misconfigured servers. Make the secure path the default path.

2. **Fast, file-based development.**  
   Use the filesystem as the router:  
   - `app/page.php` → `/`  
   - `app/dashboard/page.php` → `/dashboard`  
   - `app/api/users/+server.php` → `/api/users`

3. **Zero framework magic.**  
   No huge dependency trees. Just:
   - A small **kernel** (`App`, `Router`, `Request`, `Response`, `DV`, `DB`)
   - Thin **helpers** (`dv()`, `e()`, `csrf_field()`, `auth()`, etc.)
   - A CLI script: `php bastion ...`

Bastion is meant to be **understandable by a mid-level PHP dev** and **configurable by a senior** without losing control of what actually runs in production.

---

## Key Features

- 🗂 **File-based router** (Next.js-style)  
  - `page.php` + `layout.php` per folder  
  - Dynamic segments with `[id]` directories  
  - `+server.php` endpoints for APIs

- ⚙️ **DV Engine (Data View)**  
  - Request-scoped view context via `DV` + `dv()` helper  
  - Pass data from pages to layouts and components without random globals

- 🧩 **Components in plain PHP**  
  - Reusable UI components under `app/components`  
  - Simple `component('Forms.Button', ['text' => 'Save'])` helper

- 🛡️ **Security-first core**  
  - Hardened headers (CSP, X-Frame-Options, X-Content-Type-Options)  
  - HTML escaping via `e()`  
  - CSRF middleware + helpers (`csrf_token()`, `csrf_field()`)  
  - JWT auth, HttpOnly refresh tokens, short-lived access tokens

- 🎨 **Tailwind & HTMX friendly**  
  - Tailwind CSS for styling  
  - HTMX for partial updates and server-driven UX  
  - CSRF integration with HTMX via `X-CSRF-Token`

- 🧪 **Testable architecture**  
  - Thin controllers  
  - Pure PHP services and models  
  - CLI hooks for migrations and seeding

---

## Getting Started

### Requirements

- PHP **8.1+**
- Composer
- SQLite / MySQL / other DB (depending on config)
- Node.js (for Tailwind build, optional but recommended)

### Quickstart

Assuming you have the installer script named `install-bastion.sh`:

~~~bash
# 1. Create project
./install-bastion.sh my-bastion-app

cd my-bastion-app

# 2. Install PHP dependencies
composer install

# 3. Install frontend dependencies (if using Tailwind/JS pipeline)
npm install

# 4. Create .env from template
cp .env.example .env

# 5. Run migrations & seeds (dev)
php bastion migrate
php bastion db:seed

# 6. Start dev server
php bastion serve
~~~

Navigate to:

~~~text
http://127.0.0.1:8000
~~~

You should see the default Bastion landing page.

### Typical CLI Workflow

During development you will usually:

~~~bash
# Apply DB schema changes
php bastion migrate

# Seed dev database
php bastion db:seed

# Start local dev server
php bastion serve

# Scaffold new UI page
php bastion make:page Dashboard/Analytics

# Scaffold new API endpoint
php bastion make:api Users
~~~

---

## Directory Structure

Bastion generates a predictable structure where `app/` is both your **domain layer** and your **file-based router**.

~~~text
app/
  api/                      // REST/HTMX endpoints (+server.php)
  components/               // Reusable UI components
  core/                     // Framework kernel (App, Router, DV, DB, ...)
  http/                     // Controllers, middleware, form requests
  models/                   // Domain models
  providers/                // Service providers
  services/                 // Application services

  views/                    // Global layouts & error pages
    layouts/                // app.php, guest.php, base shells
    errors/                 // 404.php, 500.php, etc.

  layout.php                // Optional root router layout (wraps all routes)
  page.php                  // Root homepage route (/)

  dashboard/                // /dashboard section
    layout.php              // Layout for /dashboard/*
    page.php                // /dashboard

    analytics/              // /dashboard/analytics
      page.php              // /dashboard/analytics page

config/                     // App, database, auth, cache, mail, ...
database/                   // migrations, seeds, factories
public/                     // index.php, assets, web root
resources/                  // Tailwind CSS, JS entrypoints
storage/                    // logs, cache, sessions, compiled views
tests/                      // Unit & feature tests
bastion                     // Bastion CLI entrypoint
composer.json               // PHP dependencies & autoload
package.json                // Frontend tooling & scripts
.env                        // Environment configuration
~~~

> **Layouts by folder:**  
> Any directory under `app/` can include a `layout.php` next to its `page.php`.  
> Bastion automatically composes all matching `layout.php` files from the root `app/layout.php` down to the deepest folder for the current route — very similar to the Next.js App Router.

---

## Request Lifecycle

High-level flow for each incoming request:

1. **Bootstrap**  
   - Load `.env` and configuration  
   - Initialize `App` singleton  
   - Register error/exception handlers  
   - Start session (if needed)  
   - Flush DV engine (`DV::flush()`)

2. **Create Request**  
   - Normalize superglobals into an `App\Core\Request` instance  
   - Extract path, method, headers, cookies, query, body, etc.

3. **Middleware Pipeline**  
   - Apply global middleware (security headers, CSRF, logging)  
   - Apply per-route middleware (auth, role checks, etc.)

4. **Routing**  
   - First, try matching an **API endpoint** (`+server.php` under `app/api`)  
   - If not found, try matching a **UI page** (`page.php` under `app/`)  
   - Resolve dynamic segments (`[id]` directories)

5. **Views & Layouts**  
   - Execute the matching `page.php`, capturing its HTML into `$content`  
   - Resolve all `layout.php` files from `app/` down to the page directory  
   - Wrap `$content` through each layout (outermost to innermost)  
   - Optionally wrap with `app/views/layouts/app.php`

6. **Response**  
   - Send headers and status via `App\Core\Response`  
   - Output final HTML or JSON

---

## Routing & Views

### Hybrid Routing

Bastion uses a hybrid router:

- Under `app/` → **UI routes** (`page.php` + `layout.php`)  
- Under `app/api/` → **API routes** (`+server.php`)  
- Dynamic segments → `[param]` directories

Examples:

~~~text
app/page.php                     → GET /
app/dashboard/page.php           → GET /dashboard
app/dashboard/[id]/page.php      → GET /dashboard/123
app/api/users/+server.php        → /api/users (GET, POST, ...)
app/api/users/[id]/+server.php   → /api/users/123 (GET, DELETE, ...)
~~~

---

### UI Pages (`page.php`)

A `page.php` file represents the final content of a route. It can:

- Read from the `Request` object  
- Query models/services  
- Set DV values (`dv('title', '...')`) for layouts  
- Render HTML

Example: `app/dashboard/page.php`:

~~~php
<?php

// app/dashboard/page.php

dv('title', 'Dashboard · Bastion');

$stats = [
    'users'   => 42,
    'revenue' => 12345,
];

dv('stats', $stats);

?>
<section class="space-y-4">
  <h1 class="text-2xl font-semibold">Dashboard</h1>
  <p class="text-slate-400">Welcome back.</p>

  <div class="grid grid-cols-2 gap-4">
    <div class="rounded-xl bg-slate-900 p-4 border border-slate-800">
      <div class="text-sm text-slate-400">Users</div>
      <div class="text-2xl font-semibold"><?= e($stats['users']) ?></div>
    </div>
    <div class="rounded-xl bg-slate-900 p-4 border border-slate-800">
      <div class="text-sm text-slate-400">Revenue</div>
      <div class="text-2xl font-semibold">$<?= e($stats['revenue']) ?></div>
    </div>
  </div>
</section>
~~~

---

### Layouts (`layout.php`)

Bastion uses a **per-folder layout system**, similar to the Next.js App Router:

- Any directory inside `app/` can define a `layout.php` next to its `page.php`  
- For a given route, Bastion walks from the page directory up to `app/`, collecting `layout.php` files  
- It then wraps the page content with each layout from outermost to innermost

Example tree:

~~~text
app/
  layout.php               // Router root layout (optional)
  page.php                 // "/"

  dashboard/
    layout.php             // Layout for all "/dashboard/*"
    page.php               // "/dashboard"

    analytics/
      page.php             // "/dashboard/analytics"
~~~

For `/dashboard/analytics` the order is:

1. `app/layout.php` (router root layout, if present)  
2. `app/dashboard/layout.php`  
3. `app/dashboard/analytics/page.php` (leaf)

Example layout:

~~~php
<?php
// app/dashboard/layout.php

dv('title', 'Dashboard · ' . dv('title', 'Bastion App'));
?>
<div class="min-h-screen bg-slate-950 text-slate-100">
  <div class="flex">
    <aside class="w-64 border-r border-slate-800 p-4">
      <h1 class="text-lg font-semibold mb-4">Dashboard</h1>
      <nav class="space-y-2 text-sm text-slate-400">
        <a href="/dashboard" class="block hover:text-white">Overview</a>
        <a href="/dashboard/analytics" class="block hover:text-white">Analytics</a>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <?= $content ?>
    </main>
  </div>
</div>
~~~

The global HTML shell typically lives in `app/views/layouts/app.php` (global `<html>`, `<head>`, `<body>`).

---

### Components

Components live under `app/components` and are simple PHP templates. They are rendered via the `component()` helper:

~~~php
<?php
// app/components/Forms/Button.php

/** @var string $text */
/** @var string|null $variant */

$variant = $variant ?? 'primary';

?>
<button
  class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium
         <?= $variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-100' ?>"
>
  <?= e($text) ?>
</button>
~~~

Usage in a page:

~~~php
<?php component('Forms.Button', ['text' => 'Save changes']); ?>
~~~

---

### API Endpoints (`+server.php`)

Any `+server.php` file under `app/api` is treated as an HTTP endpoint:

- The folder path under `app/api` becomes the URL path under `/api`  
- The file returns an **array mapping HTTP methods to handlers** (FastAPI-style)  
- Methods are in lowercase: `'get'`, `'post'`, `'put'`, `'patch'`, `'delete'`, etc.

Example: `app/api/users/+server.php` → `/api/users`:

~~~php
<?php
// app/api/users/+server.php

use App\Core\Request;
use App\Core\Response;
use App\Models\User;
use App\Core\Auth;

return [

    // GET /api/users
    'get' => function (Request $request) {
        if (!Auth::check()) {
            return Response::json(['error' => 'Unauthorized'], 401);
        }

        $users = User::all();
        return Response::json($users);
    },

    // POST /api/users
    'post' => function (Request $request) {
        $data = $request->validate([
            'name'  => 'required|string|min:3',
            'email' => 'required|email',
        ]);

        $user = User::create($data);
        return Response::json($user, 201);
    },

];
~~~

Dynamic segments use `[id]` folders:

~~~text
app/api/
  users/
    +server.php          → /api/users
  users/[id]/
    +server.php          → /api/users/{id}
~~~

Example for `/api/users/{id}`:

~~~php
<?php
// app/api/users/[id]/+server.php

use App\Core\Request;
use App\Core\Response;
use App\Models\User;

return [

    // DELETE /api/users/{id}
    'delete' => function (Request $request) {
        $id = $request->attributes['id'] ?? null;

        if (!$id || !User::find($id)) {
            return Response::json(['error' => 'User not found'], 404);
        }

        User::delete($id);
        return Response::json(null, 204);
    },

];
~~~

If a request method has no handler in the array, Bastion responds with `405 Method Not Allowed`.

---

### Middleware

Middleware are classes under `app/http/Middleware` with a `handle()` method:

~~~php
<?php

namespace App\Http\Middleware;

use App\Core\Request;
use App\Core\Response;

class SecurityHeaders
{
    public static function handle(Request $request, callable $next): Response
    {
        $nonce = base64_encode(random_bytes(16));
        $request->meta['csp_nonce'] = $nonce;

        header("X-Frame-Options: SAMEORIGIN");
        header("X-Content-Type-Options: nosniff");
        header("Referrer-Policy: strict-origin-when-cross-origin");

        header(
            "Content-Security-Policy: " .
            "default-src 'self'; " .
            "script-src 'self' 'nonce-$nonce'; " .
            "style-src 'self' https://cdn.jsdelivr.net; " .
            "img-src 'self' data:; " .
            "connect-src 'self'; " .
            "frame-ancestors 'self';"
        );

        return $next($request);
    }
}
~~~

Middleware are registered in the kernel and applied to every request, or per route where configured.

---

## DV Engine (Data View)

The **DV (Data View) engine** is a request-scoped state container used to pass structured data between `page.php`, `layout.php` files and components, without relying on random globals.

### Core idea

- `DV::set($key, $value)` → store a value for this request  
- `DV::get($key, $default = null)` → read it back (or default)  
- `DV::flash($key, $value)` → store for the **next** request via session (flash messages)  
- `DV::flush()` → reset DV at the beginning of the request, pulling flash data from the session

Simplified implementation:

~~~php
<?php

namespace App\Core;

class DV
{
    protected static array $data = [];
    protected static array $flashed = [];

    public static function flush(): void
    {
        self::$data = [];

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (isset($_SESSION['_dv_flash'])) {
            self::$flashed = $_SESSION['_dv_flash'];
            unset($_SESSION['_dv_flash']);
        }
    }

    public static function set(string $key, mixed $value): void
    {
        self::$data[$key] = $value;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::$data[$key] ?? self::$flashed[$key] ?? $default;
    }

    public static function has(string $key): bool
    {
        return isset(self::$data[$key]) || isset(self::$flashed[$key]);
    }

    public static function flash(string $key, mixed $value): void
    {
        $_SESSION['_dv_flash'][$key] = $value;
    }

    public static function all(): array
    {
        return array_merge(self::$flashed, self::$data);
    }
}
~~~

### The `dv()` helper

To avoid importing `App\Core\DV` in every view, Bastion exposes a global helper:

~~~php
<?php

use App\Core\DV;

/**
 * Data View helper.
 * dv('key', 'value') → set
 * dv('key')          → get
 */
function dv($key, $value = null)
{
    if ($value === null) {
        return DV::get($key);
    }

    DV::set($key, $value);
}
~~~

Equivalences:

- `dv('title', 'Dashboard')` → `DV::set('title', 'Dashboard')`  
- `dv('title')` → `DV::get('title')`  
- If you need a default, use `DV::get('title', 'Fallback')` directly.

### Typical usage

In a **page**:

~~~php
<?php
// app/dashboard/page.php

dv('title', 'Dashboard · Bastion');
dv('breadcrumbs', [
    ['label' => 'Home',      'href' => '/'],
    ['label' => 'Dashboard', 'href' => '/dashboard'],
]);

?>
<div class="space-y-4">
  <h1 class="text-2xl font-semibold">Dashboard</h1>
  <p class="text-slate-400">Welcome back.</p>
</div>
~~~

In a **layout**:

~~~php
<?php
// app/layout.php

$title  = DV::get('title', 'Bastion App');
$crumbs = DV::get('breadcrumbs', []);
?>
<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <title><?= e($title) ?></title>
</head>
<body class="bg-slate-950 text-slate-100">
  <nav class="border-b border-slate-800 px-6 py-3 flex items-center gap-4">
    <a href="/" class="font-semibold">Bastion</a>

    <?php if (!empty($crumbs)): ?>
      <ol class="flex items-center gap-2 text-sm text-slate-400">
        <?php foreach ($crumbs as $crumb): ?>
          <li>
            <a href="<?= e($crumb['href']) ?>" class="hover:text-white">
              <?= e($crumb['label']) ?>
            </a>
          </li>
        <?php endforeach; ?>
      </ol>
    <?php endif; ?>
  </nav>

  <main class="px-6 py-8">
    <?= $content ?>
  </main>
</body>
</html>
~~~

---

## Helpers Reference

Bastion registers a small, focused set of global helpers.

| Helper                           | Description                                                             | Example                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `dv($key, $value = null)`       | Set/get view data in the DV engine                                      | `dv('title', 'Dashboard'); dv('title');`                                |
| `config($key, $default = null)` | Read config value from `config/*.php` using dot notation               | `config('app.name');`                                                   |
| `env($key, $default = null)`    | Read environment variable                                               | `env('APP_ENV', 'production');`                                         |
| `component($name, $props = [])` | Render a component from `app/components`                               | `component('Forms.Button', ['text' => 'Save']);`                        |
| `request()`                     | Get current `Request` instance inside views                             | `request()->path;`                                                      |
| `response()`                    | Shortcut to response helpers (html/json/redirect)                      | `return response()->redirect('/login');`                                |
| `asset($path)`                  | Generate URL for public assets                                         | `<link rel="stylesheet" href="<?= asset('assets/css/app.css') ?>">`    |
| `e($str)`                       | Escape HTML entities (XSS protection)                                  | `echo e($user['email']);`                                               |
| `csrf_token()`                  | Get current CSRF token string                                          | `<meta name="csrf-token" content="<?= csrf_token() ?>">`               |
| `csrf_field()`                  | Render hidden CSRF input for forms                                     | `<?= csrf_field() ?>`                                                   |
| `auth()`                        | Access auth helpers/current user                                       | `if (auth()->check()) echo auth()->user()['email'];`                    |
| `logger()`                      | Log messages to `storage/logs`                                         | `logger()->info('User logged in', ['id' => $userId]);`                  |

You can also add your own helpers in `app/core/helpers.php` and include them from the bootstrap.

---

## Security Protocols

Bastion assumes the environment is hostile.  
It implements a **Defense in Depth** strategy: hardened headers, strict CSRF validation, safe rendering helpers, and a clear token model.

### Security Highlights

- **Native JWT**  
  Zero-dependency implementation using OpenSSL. Handles `HttpOnly` cookies for refresh tokens automatically, while the access token is short-lived and scoped to the current session.

- **CSRF Fortress**  
  Middleware automatically verifies tokens on all state-changing methods (`POST`, `PUT`, `PATCH`, `DELETE`). Integrated with HTMX via a dedicated `X-CSRF-Token` header or hidden form fields.

- **XSS Prevention**  
  The global `e()` helper escapes HTML output, and security middleware sets strict Content Security Policy headers by default to reduce the impact of script injection.

---

### XSS Protection with `e()`

All untrusted data should be escaped before it reaches your HTML. Bastion provides the `e()` helper:

~~~php
<?php
// Somewhere in a page or layout:

$user = auth(); // returns current user or null

if ($user) {
    echo 'Logged in as: ' . e($user['email']);
}
~~~

When using the DV engine:

~~~php
<title><?= e(dv('title', 'Bastion App')) ?></title>
~~~

Always wrap dynamic strings that might contain user input with `e()`, especially in attributes and text nodes.

---

### CSRF Protection

State-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) are protected by a CSRF middleware. If the token is missing or invalid, the middleware rejects the request with a 419/403 response.

#### HTML Forms

Use the `csrf_field()` helper inside forms:

~~~php
<form method="POST" action="/users/create">
    <input type="text" name="name" required>
    <input type="email" name="email" required>

    <!-- CSRF Token -->
    <?= csrf_field() ?>

    <button type="submit">Create User</button>
</form>
~~~

#### HTMX Integration

Expose the token from your base layout and configure HTMX:

~~~php
<!-- In app/views/layouts/app.php -->
<head>
  ...
  <meta name="csrf-token" content="<?= csrf_token() ?>">
</head>
~~~

~~~js
// In app.js or an inline script
document.body.addEventListener('htmx:configRequest', (event) => {
  const tokenMeta = document.querySelector('meta[name="csrf-token"]');
  if (tokenMeta) {
    event.detail.headers['X-CSRF-Token'] = tokenMeta.getAttribute('content');
  }
});
~~~

The middleware accepts the token from either:

- Hidden form field (e.g. `_csrf` via `csrf_field()`)  
- `X-CSRF-Token` header

---

## Authentication

Bastion includes a simple JWT-based auth flow (exact shape depends on your config), typically:

- **Access token**: short-lived, passed in headers or local storage (optional)  
- **Refresh token**: long-lived, stored in an `HttpOnly`, `Secure` cookie  
- **Login**: exchange credentials for tokens  
- **Refresh**: rotate tokens via a refresh endpoint  
- **Logout**: invalidate refresh token and clear cookie

Example snippet to read the authenticated user:

~~~php
<?php

$user = auth(); // helper alias

if ($user) {
    echo 'Logged in as ' . e($user['email']);
} else {
    echo 'Guest';
}
~~~

You can enforce authentication on routes via middleware, e.g. an `AuthMiddleware` that redirects unauthenticated users to `/login`.

---

## Database & Migrations

Bastion uses a simple DB abstraction (or your preferred PDO wrapper) and migrations.

Typical workflow:

~~~bash
# Run migrations
php bastion migrate

# Seed database
php bastion db:seed
~~~

A migration might look like:

~~~php
<?php

use App\Core\Schema;
use App\Core\Blueprint;

return new class {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
~~~

You are free to adapt this layer (swap DB, change schema builder) as long as the CLI commands know how to run your migrations.

---

## The Bastion CLI

The `bastion` executable at project root replaces Artisan for this framework. It is a small PHP script meant to be understandable and hackable.

Common commands:

~~~bash
php bastion serve        # Start local dev server (127.0.0.1:8000)
php bastion migrate      # Run pending migrations
php bastion db:seed      # Seed database with fake/dev data
php bastion make:page    # Scaffold a new UI route directory
php bastion make:api     # Scaffold a new API endpoint
~~~

Example `serve` command (simplified):

~~~php
<?php

class ServeCommand extends Command
{
    public string $signature = 'serve';
    public string $description = 'Start the development server';

    public function handle(array $args): void
    {
        $host = '127.0.0.1';
        $port = $args[0] ?? 8000;

        $this->info("Bastion server started on http://$host:$port");
        $this->info("Press Ctrl+C to stop.");

        passthru("php -S $host:$port -t public");
    }
}
~~~

---

## Testing (High Level)

Bastion is designed so you can test:

- **Pure services/models** with PHPUnit  
- **HTTP layer** using a small HTTP client or built-in test helpers  
- **End-to-end flows** by booting the app and issuing requests against the router

A typical test structure:

~~~text
tests/
  Unit/
    UserServiceTest.php
  Feature/
    Auth/LoginTest.php
    Dashboard/DashboardTest.php
~~~

Example unit test (simplified):

~~~php
<?php

use PHPUnit\Framework\TestCase;
use App\Services\UserService;

class UserServiceTest extends TestCase
{
    public function test_can_create_user()
    {
        $service = new UserService();

        $user = $service->create([
            'name'  => 'Alice',
            'email' => 'alice@example.com',
        ]);

        $this->assertNotNull($user['id']);
        $this->assertSame('Alice', $user['name']);
    }
}
~~~

---

## Roadmap / Ideas

Some ideas that fit well with Bastion’s architecture:

- First-class **observability** (structured logs, trace IDs, correlation IDs)  
- Built-in **rate limiting** per route (e.g. login throttling)  
- Native **WebSockets/real-time** integration for dashboards  
- More generators: `make:middleware`, `make:model`, `make:service`, etc.  
- Optional **admin panel** for internal tools

---

