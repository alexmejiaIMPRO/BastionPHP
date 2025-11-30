Bastion PHP Framework

Version: 0.1.0
Tagline: Prototype fast. Deploy safe. Run pure PHP.

Bastion PHP is a file-based PHP framework for building secure internal tools, dashboards, and APIs using:

Next.js–style filesystem routing and nested layouts

FastAPI/SvelteKit–style endpoints in +server.php

A small QueryBuilder over PDO (ORM-like feel, raw SQL power)

A DV Engine (Data View) to share view state like titles, breadcrumbs, flags

Simple components (server-side and HTMX-powered)

A security-first middleware pipeline (CSP, CSRF, JWT, SameSite, HttpOnly)


Everything is written in vanilla PHP, with PSR-4 autoloading, SQLite by default, and a CLI (bastion) to scaffold, migrate, seed and run the app.


---

1. Philosophy

Bastion is designed for environments where:

You need to ship internal tools quickly.

You cannot afford weak security.

You want full control and full visibility of what runs.


Core principles:

Filesystem = router: no route arrays, no annotations.

Layouts stack automatically: you get Next.js-like layout inheritance in PHP.

Security first, not optional: headers, CSP, CSRF, JWT and guards always run.

Plain PHP: no templating engines, no frontend JS frameworks.

Minimal QueryBuilder: convenient chains, but clearly SQL-based and PDO-backed.

Error transparency: no silent catch-all, stack traces visible in dev.



---

2. Features Overview

File-based routing for pages (page.php) and APIs (+server.php).

Layout system with automatic stacking (layout.php per folder).

DV Engine (Data View) for titles, breadcrumbs and global view data.

Request/Response objects with validation helpers.

QueryBuilder: DB::table()->where()->orderBy()->limit()->get().

Global helpers: view(), e(), auth(), csrf_token(), csrf_field(), logger(), etc.

Components:

Server-side components (pure PHP).

HTMX-based interactive components.


Middleware pipeline:

SecurityHeaders (CSP, X-Frame-Options, etc.)

RateLimit (stub for throttling)

AuthMiddleware (JWT, CSRF)

AdminOnly (guards admin routes)


Authentication system:

JWT access tokens

DB-backed refresh tokens (rotated per use)


Configuration via config/*.php

Storage folders for DB, logs, files

Migrations (database/migrations/*.sql)

Seeders (database/seeds/*.php)

CLI (./bastion) for run-dev, migrate, seed, scaffolding

Tailwind + BrowserSync + live reload in development (optional).



---

3. Getting Started

3.1 Requirements

PHP 8.1+

Composer

SQLite (or another PDO driver you configure)

Node.js + npm (optional, for Tailwind / BrowserSync dev setup)


3.2 Creating a new app

Run the generator script (your create-bastion-app):

./create-bastion-app my-app
cd my-app
composer install
npm install        # optional: for Tailwind watcher and BrowserSync

Run database migrations and seed data:

./bastion migrate
./bastion seed

Start the dev server:

./bastion run-dev

By default:

PHP dev server: http://127.0.0.1:8000

BrowserSync proxy (if configured): http://127.0.0.1:9876



---

4. Project Structure

A fresh Bastion app looks like this (simplified):

app/
  layout.php              # root layout (HTML shell)
  page.php                # root page for "/"
  Core/
    App.php               # main app runner (container + middlewares + router)
    Container.php         # simple dependency injection container
    Router.php            # file-based router for pages and APIs
    Request.php           # HTTP request abstraction
    Response.php          # HTTP response helpers
    DB.php                # PDO wrapper + QueryBuilder
    Auth.php              # JWT + refresh token auth
    CSRF.php              # CSRF token generation/validation
    DV.php                # DV Engine (Data View)
    Logger.php            # logging to storage/logs/app.log
    Theme.php             # theme helpers (e.g., dark mode)
    helpers.php           # global helper functions
  Middleware/
    SecurityHeaders.php   # CSP, security headers, nonce
    RateLimit.php         # rate limiting stub
    AuthMiddleware.php    # JWT + CSRF enforcement
    AdminOnly.php         # guard for /admin routes
  admin/
    layout.php            # admin module layout
    page.php              # "/admin" dashboard
  login/
    page.php              # "/login" page
  logout/
    page.php              # "/logout" endpoint
  api/
    auth/
      login/+server.php   # POST /api/auth/login
      logout/+server.php  # POST /api/auth/logout
      refresh/+server.php # POST /api/auth/refresh
    users/
      +server.php         # /api/users (list, create)
      [id]/+server.php    # /api/users/{id} (detail, update, delete)
resources/
  views/
    components/           # PHP components
    errors/               # error views (404, 403, 500)
config/
  app.php
  database.php
  security.php
  style.php
database/
  migrations/
  seeds/
public/
  index.php               # front controller
storage/
  db/app.db               # SQLite database
  logs/app.log            # framework logs


---

5. Routing: Pages and APIs

5.1 Page routes (page.php)

Page routes live under app/ with page.php:

URL	File

/	app/page.php
/login	app/login/page.php
/admin	app/admin/page.php


Example app/page.php:

<?php

use App\Core\DV;

DV::set('title', 'Welcome to Bastion');

?>
<section>
  <h1>Home</h1>
  <p>This is the root page.</p>
</section>

You do not output <html>, <head> or <body> here; those come from app/layout.php.

5.2 API routes (+server.php)

API routes live under app/api/... and are defined by a single +server.php file per resource. The file returns an associative array mapping HTTP methods to handler closures.

Example app/api/users/+server.php:

<?php

use App\Core\DB;
use App\Core\Response;
use App\Core\ValidationException;

return [

    'get' => function ($req) {
        $role = $req->input('role'); // query/body both

        $query = DB::table('users')->orderBy('id', 'DESC')->limit(50);

        if ($role) {
            $query = $query->where('role', $role);
        }

        $users = $query->get();
        Response::json($users);
    },

    'post' => function ($req) {
        try {
            $data = $req->validate([
                'email'    => 'required|email',
                'name'     => 'required',
                'password' => 'required|min:8',
            ]);

            $id = DB::table('users')->insert([
                'email'      => $data['email'],
                'name'       => $data['name'],
                'password'   => password_hash($data['password'], PASSWORD_DEFAULT),
                'role'       => 'user',
                'created_at' => time(),
            ]);

            Response::json(['id' => $id], 201);
        } catch (ValidationException $e) {
            Response::json(['errors' => $e->errors], 422);
        }
    },

];

5.3 Dynamic routes ([id])

Dynamic parameters use [name] folders:

URL	File	Param

/api/users/5	app/api/users/[id]/+server.php	id=5


Example app/api/users/[id]/+server.php:

<?php

use App\Core\DB;
use App\Core\Response;

return [

    'get' => function ($req) {
        $id = $req->meta['params']['id'] ?? null;
        if (!$id) {
            Response::json(['error' => 'missing id'], 400);
        }

        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            Response::json(['error' => 'not found'], 404);
        }

        Response::json($user);
    },

    'delete' => function ($req) {
        $id = $req->meta['params']['id'] ?? null;
        if (!$id) {
            Response::json(['error' => 'missing id'], 400);
        }

        DB::table('users')->where('id', $id)->delete();
        Response::json(['deleted' => true]);
    },

];


---

6. Layout System (Next.js-Style)

6.1 Layout stacking rules

When a route is resolved, Bastion collects all layout.php files from the leaf folder up to app/:

/admin → app/admin/layout.php → app/layout.php

/admin/users → app/admin/users/layout.php → app/admin/layout.php → app/layout.php

/settings/security → app/settings/security/layout.php → app/settings/layout.php → app/layout.php


Each layout receives a $content() closure and must call it to render the inner content.

6.2 Example nested layout

app/admin/layout.php:

<?php

?>
<section class="admin-shell">
  <aside class="admin-sidebar">
    <!-- links -->
  </aside>

  <div class="admin-main">
    <?php $content(); ?>
  </div>
</section>

app/admin/users/layout.php:

<?php

?>
<div class="users-shell">
  <h2>Users</h2>
  <?php $content(); ?>
</div>

Then app/admin/users/page.php prints only the page body:

<?php

use App\Core\DV;
use App\Core\DB;

DV::set('title', 'Admin · Users');

$users = DB::table('users')->orderBy('id','DESC')->get();

?>
<ul>
  <?php foreach ($users as $user): ?>
    <li><?= htmlspecialchars($user['email']) ?></li>
  <?php endforeach; ?>
</ul>

The final output is:

app/layout.php shell

wrapping app/admin/layout.php

wrapping app/admin/users/layout.php

wrapping app/admin/users/page.php.



---

7. DV Engine (Data View)

The DV Engine is a tiny layer to share data between pages, layouts, and components without passing arguments everywhere.

7.1 Core API

DV::set(string $key, mixed $value): void;
DV::get(string $key, mixed $default = null): mixed;

7.2 Typical use cases

Page title

Breadcrumbs

Layout flags (e.g. hide sidebar)

Global messages or context


Example:

<?php

use App\Core\DV;

// In a page
DV::set('title', 'Admin · Users');
DV::set('breadcrumbs', ['Admin', 'Users']);

In the root layout:

<?php

use App\Core\DV;

$title       = DV::get('title', $GLOBALS['title'] ?? 'Bastion PHP');
$breadcrumbs = DV::get('breadcrumbs', []);

You can still use $GLOBALS['title'] if you want very simple scripts:

$GLOBALS['title'] = 'Home';

But the recommended pattern is:

DV::set('title', 'Home');
$title = DV::get('title', $GLOBALS['title'] ?? 'Bastion PHP');


---

8. Request and Response

8.1 Request object

Each +server.php handler receives a $req instance with:

$req->method – GET, POST, etc.

$req->path – normalized path (e.g. admin/users).

$req->query – query parameters.

$req->body – parsed request body (form or JSON).

$req->cookies – cookies.

$req->meta['params'] – route parameters ([id] folders).


Helpers:

$req->input('key');      // from body or query
$req->isJson();          // Content-Type is JSON
$req->json();            // decoded JSON array
$req->validate([...]);   // validate data and either return it or throw

8.2 Validation example

<?php

use App\Core\ValidationException;

try {
    $data = $req->validate([
        'email' => 'required|email',
        'name'  => 'required',
    ]);
} catch (ValidationException $e) {
    Response::json(['errors' => $e->errors], 422);
}

8.3 Response helper class

Response::json($data, $status = 200);
Response::html($html, $status = 200);
Response::redirect('/admin');
Response::abort(403, 'Forbidden');


---

9. Database Layer (QueryBuilder)

The DB layer is configured via config/database.php. By default it uses SQLite, but since it is PDO-based, you can change it to MySQL, PostgreSQL, etc.

9.1 Common patterns

// All admins
$admins = DB::table('users')
    ->where('role', 'admin')
    ->orderBy('id', 'DESC')
    ->limit(20)
    ->get();

// One user
$user = DB::table('users')
    ->where('id', 1)
    ->first();

if (!$user) {
    // handle not found
}

// Create
$id = DB::table('users')->insert([
    'name'       => 'New User',
    'email'      => 'user@example.com',
    'password'   => password_hash('secret123', PASSWORD_DEFAULT),
    'role'       => 'user',
    'created_at' => time(),
]);

// Update
DB::table('users')->where('id', $id)->update(['role' => 'admin']);

// Delete
DB::table('users')->where('id', $id)->delete();


---

10. Components

Components live under resources/views/components/ and are small PHP functions that return HTML strings.

10.1 Server-side component (no HTMX)

resources/views/components/UserCard.php:

<?php

function UserCard(array $user): string
{
    $name  = htmlspecialchars($user['name']);
    $email = htmlspecialchars($user['email']);

    return <<<HTML
<article class="card">
  <h3>{$name}</h3>
  <p>{$email}</p>
</article>
HTML;
}

Usage in a page:

<?php

require_once __DIR__ . '/../../../resources/views/components/UserCard.php';

$users = DB::table('users')->limit(10)->get();

foreach ($users as $user) {
    echo UserCard($user);
}

10.2 HTMX component (client-triggered)

resources/views/components/UserRow.php:

<?php

function UserRow(array $user): string
{
    $id    = (int) $user['id'];
    $name  = htmlspecialchars($user['name']);
    $email = htmlspecialchars($user['email']);

    return <<<HTML
<tr id="user-{$id}">
  <td>{$name}</td>
  <td>{$email}</td>
  <td>
    <button
      hx-delete="/api/users/{$id}"
      hx-target="#user-{$id}"
      hx-swap="outerHTML"
    >
      Delete
    </button>
  </td>
</tr>
HTML;
}

In the API endpoint:

<?php

use App\Core\DB;
use App\Core\Response;

require_once __DIR__ . '/../../../resources/views/components/UserRow.php';

return [
    'get' => function ($req) {
        $users = DB::table('users')->orderBy('id', 'DESC')->get();

        if (isset($_SERVER['HTTP_HX_REQUEST'])) {
            ob_start();
            echo "<table><tbody>";
            foreach ($users as $user) {
                echo UserRow($user);
            }
            echo "</tbody></table>";
            $html = ob_get_clean();
            Response::html($html);
        }

        Response::json($users);
    },
];

In the page:

<button
    hx-get="/api/users"
    hx-target="#users-table"
    hx-swap="innerHTML"
>
  Load users
</button>

<div id="users-table"></div>


---

11. Authentication (JWT + Refresh Tokens)

Bastion uses:

An access token (JWT) for short-term authorization.

A refresh token, stored in DB and in a HttpOnly cookie, rotated each time it is used.


11.1 Login example

app/api/auth/login/+server.php:

<?php

use App\Core\Auth;
use App\Core\Response;

return [
    'post' => function ($req) {
        $email = $req->input('email');
        $pass  = $req->input('password');

        $tokens = Auth::attempt($email, $pass);
        if (!$tokens) {
            Response::json(['error' => 'Invalid credentials'], 401);
        }

        $secure = filter_var(getenv('SECURE_COOKIES') ?: 'false', FILTER_VALIDATE_BOOLEAN);

        setcookie('access', $tokens['access'], [
            'expires'  => $tokens['expires'],
            'path'     => '/',
            'secure'   => $secure,
            'httponly' => false,
            'samesite' => 'Lax',
        ]);

        setcookie('refresh', $tokens['refresh'], [
            'expires'  => time() + (int) (getenv('JWT_REFRESH_TTL') ?: 604800),
            'path'     => '/',
            'secure'   => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        Response::redirect('/admin');
    },
];

11.2 Current user helper

$user = auth();
if ($user !== null) {
    // $user['id'], $user['email'], $user['role'] ...
}

11.3 Admin check

if (!Auth::isAdmin()) {
    Response::abort(403, 'Admins only');
}


---

12. Middleware and Security

The middleware pipeline typically looks like this:

SecurityHeaders → RateLimit → AuthMiddleware → AdminOnly → Router → Handler

12.1 SecurityHeaders

Adds:

Content-Security-Policy with a nonce

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

X-XSS-Protection (for older UAs)


Stores a nonce in session (for layouts):

$nonce = $_SESSION['csp_nonce'] ?? base64_encode(random_bytes(16));
$_SESSION['csp_nonce'] = $nonce;

Layouts use this nonce in <script> and <style> tags.

12.2 CSRF

Uses tokens per session:

// add hidden field to forms
<?= csrf_field() ?>

On unsafe methods (POST, PUT, PATCH, DELETE), the CSRF token is checked by AuthMiddleware or CSRF helper.


---

13. CLI (bastion)

The bastion CLI manages your app:

Typical commands:

./bastion run-dev        # start PHP dev server
./bastion migrate        # run .sql migrations
./bastion seed           # run seeders
./bastion key:generate   # generate APP_KEY
./bastion jwt:secret     # generate JWT secret
./bastion make:page name # scaffold a new page
./bastion make:api name  # scaffold a new API endpoint
./bastion make:module name # scaffold a module folder

You can extend it with more commands as the framework evolves.


---

14. Migrations and Seeders

14.1 Migrations

Migrations are raw .sql files under database/migrations.

Example database/migrations/001_create_users.sql:

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at INTEGER NOT NULL
);

Run:

./bastion migrate

14.2 Seeders

Seeders are PHP scripts under database/seeds.

Example database/seeds/UsersSeeder.php:

<?php

use App\Core\DB;

$pdo = DB::getPdo();
$count = (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

if ($count === 0) {
    $stmt = $pdo->prepare("INSERT INTO users (name,email,password,role,created_at) VALUES (?,?,?,?,?)");
    $stmt->execute([
        'Admin',
        'admin@example.com',
        password_hash('admin123', PASSWORD_DEFAULT),
        'admin',
        time(),
    ]);
}

Run:

./bastion seed


---

15. Assets, Tailwind and BrowserSync (Optional)

You can wire Tailwind and BrowserSync in package.json to get:

Tailwind compilation

Live reload proxy on :9876 watching :8000


Example dev scripts (conceptually):

{
  "scripts": {
    "dev:css": "tailwindcss -i ./resources/css/app.css -o ./public/css/app.css --watch",
    "dev:proxy": "browser-sync start --proxy '127.0.0.1:8000' --files 'public'"
  }
}

Then run:

npm run dev:css
npm run dev:proxy
./bastion run-dev


---

16. Titles and Document Head

You can set the page title using DV or $GLOBALS:

Recommended:

DV::set('title', 'Admin · Users');

Also supported:

$GLOBALS['title'] = 'Admin · Users';

In app/layout.php:

$title = DV::get('title', $GLOBALS['title'] ?? 'Bastion PHP');

This ensures your layout always has a title, even if a page is missing DV::set('title', ...).


---

17. Future Additions

Later, this framework documentation and tooling will be extended with:

OpenAPI schema generation for all +server.php endpoints.

Benchmark suite comparing Bastion PHP with Django, FastAPI and Next.js for typical internal tool workloads.

Cache adapters (Redis, Memcached) integrated into the QueryBuilder and Response layer.

WebSocket notifications layer for real-time events.

Migration conflict detection and safe multi-env workflows.

Automated module and component generators in the CLI.

More official component patterns (tables, paginators, filters) ready to use.


For now, the features described above already exist in the current version (0.1.0) and are enough to build real internal applications with a secure, maintainable architecture.