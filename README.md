# Bastion PHP Framework

**Version:** `0.1.0`  
**Type:** Internal tools framework for secure, fast PHP apps (Next.js-style routing, Django-style admin mindset, FastAPI-style APIs).

Bastion PHP is a **file-based PHP framework** designed to build **internal company tools** (dashboards, CRUD systems, admin panels, APIs) with:

- **File-based routing** (like Next.js)
- **Nested layouts via `layout.php`** (like Next.js `layout.tsx`)
- **Admin mindset** (like Django admin, but you own all the code)
- **API handlers via `+server.php`** (like SvelteKit / FastAPI)
- **Security middlewares** enabled by default
- **JWT auth + refresh tokens**
- **SQLite + QueryBuilder** as a simple ORM-style layer
- **HTMX for interactivity** (no heavy frontend frameworks)

This README explains:

1. How to create and run a Bastion app  
2. What each folder/file does  
3. How routing, layouts, DB, auth, middleware and HTMX work  
4. How to build a **real feature**, step-by-step

---

## Table of Contents

1. [Requirements](#requirements)  
2. [Creating a New Project](#creating-a-new-project)  
3. [Directory Structure Overview](#directory-structure-overview)  
4. [How Routing Works (Pages & APIs)](#how-routing-works-pages--apis)  
5. [Layout System (`layout.php`)](#layout-system-layoutphp)  
6. [Views & Components](#views--components)  
7. [Request, Response & Validation](#request-response--validation)  
8. [Database Layer (DB & QueryBuilder)](#database-layer-db--querybuilder)  
9. [Authentication (JWT + Refresh Tokens)](#authentication-jwt--refresh-tokens)  
10. [Middlewares](#middlewares)  
11. [HTMX Integration](#htmx-integration)  
12. [CLI Commands (`bastion`)](#cli-commands-bastion)  
13. [Step-by-Step Example Feature](#step-by-step-example-feature)  
14. [Troubleshooting & Common Pitfalls](#troubleshooting--common-pitfalls)

---

## Requirements

- PHP **8.1+**
- Composer
- SQLite (or any PDO driver you wire later)
- Node + npm (only if you want Tailwind / BrowserSync dev experience, optional)

---

## Creating a New Project

You generate a new project using the **Bastion app generator script**, e.g.:

```bash
./create-bastion-app my-app
cd my-app

Then install dependencies:

composer install
npm install       # optional, for Tailwind & BrowserSync

Run database migrations and seed default data:

./bastion migrate
./bastion seed

Finally, start the dev server:

./bastion run-dev

By default:

PHP dev server runs at http://127.0.0.1:8000

If you wire BrowserSync in package.json, your proxy UI can run on http://127.0.0.1:9876



---

Directory Structure Overview

After running the generator, the project looks like this (simplified):

my-app/
├── app/
│   ├── layout.php           # Root layout (HTML shell for all pages)
│   ├── page.php             # Root page ("/")
│   ├── Core/
│   │   ├── App.php          # Main application, registers services, runs middlewares + router
│   │   ├── Container.php    # Simple DI container (bind, singleton, resolve)
│   │   ├── Router.php       # File-based router (pages + api, dynamic [param] folders)
│   │   ├── Request.php      # Encapsulates HTTP request data (query, body, headers, cookies)
│   │   ├── Response.php     # Helpers for JSON/HTML/redirect/error responses
│   │   ├── DB.php           # PDO wrapper + QueryBuilder (DB::table(...))
│   │   ├── Logger.php       # Simple file logger (storage/logs/app.log)
│   │   ├── Auth.php         # JWT access + refresh token auth
│   │   ├── CSRF.php         # CSRF token generation & verification
│   │   ├── Theme.php        # Theme utilities (e.g. dark mode)
│   │   └── helpers.php      # Global helper functions (env(), view(), e(), csrf_field(), auth(), logger(), etc.)
│   ├── Middleware/
│   │   ├── SecurityHeaders.php  # CSP + nonce + security headers
│   │   ├── RateLimit.php        # Rate limiting stub (you can implement IP throttling here)
│   │   ├── AuthMiddleware.php   # Checks JWT, applies CSRF for unsafe methods
│   │   └── AdminOnly.php        # Protects /admin routes (requires admin user)
│   ├── admin/
│   │   ├── layout.php       # Admin layout (wraps all /admin pages)
│   │   └── page.php         # Admin dashboard page ("/admin")
│   ├── login/
│   │   └── page.php         # Login form ("/login")
│   ├── logout/
│   │   └── page.php         # Logout action ("/logout")
│   └── api/
│       ├── auth/
│       │   ├── login/+server.php    # POST /api/auth/login
│       │   ├── logout/+server.php   # POST /api/auth/logout
│       │   └── refresh/+server.php  # POST /api/auth/refresh
│       └── users/
│           ├── +server.php          # GET/POST /api/users
│           └── [id]/+server.php     # GET/PUT/DELETE /api/users/{id}
├── config/
│   ├── style.php            # Theme / CSS config
│   └── database.php         # Database connection settings
├── database/
│   ├── migrations/          # .sql files
│   └── seeds/               # PHP seeders
├── public/
│   ├── index.php            # Front controller (bootstraps App)
│   └── css/fallback.css     # Fallback CSS file
└── storage/
    ├── db/app.db            # SQLite DB
    └── logs/app.log         # Log file


---

How Routing Works (Pages & APIs)

Bastion uses file-based routing:

1. Page routes (page.php files)

Every directory under app/ can define a page.php

The URL path is based on the folder structure.


Examples:

URL	File

/	app/page.php
/login	app/login/page.php
/logout	app/logout/page.php
/admin	app/admin/page.php


Basic page example: app/page.php

<?php

use App\Core\DV;

DV::set('title', 'Welcome to Bastion');

?>
<section>
    <h1>Home</h1>
    <p>Hello from Bastion home page.</p>
</section>

> You do not put <html>, <head>, <body> here.
Those come from the layout (layout.php), explained later.




---

2. API routes (+server.php files)

API routes live under app/api/....

Each +server.php returns an array of handlers keyed by HTTP method (get, post, put, delete, etc.).

Example: app/api/users/+server.php

<?php

use App\Core\Response;
use App\Models\User;
use App\Core\ValidationException;

return [
    'get' => function($req) {
        $users = User::all();
        Response::json($users);
    },

    'post' => function($req) {
        try {
            $data = $req->validate([
                'email'    => 'required|email',
                'name'     => 'required',
                'password' => 'required|min:8',
            ]);

            $id = User::create([
                'email'    => $data['email'],
                'name'     => $data['name'],
                'password' => password_hash($data['password'], PASSWORD_DEFAULT),
                'role'     => 'user',
            ]);

            Response::json(['id' => $id, 'message' => 'User created'], 201);
        } catch (ValidationException $e) {
            Response::json(['errors' => $e->errors], 422);
        }
    },
];

URL mapping:

URL	File

/api/users	app/api/users/+server.php
/api/users/10	app/api/users/[id]/+server.php


Dynamic [id] folder example: app/api/users/[id]/+server.php:

<?php

use App\Core\Response;
use App\Models\User;

return [
    'get' => function($req) {
        $id   = $req->meta['params']['id'] ?? null;
        $user = $id ? User::find($id) : null;
        if (!$user) {
            Response::json(['error' => 'Not found'], 404);
        }
        Response::json($user);
    },
];

> The router gives you path parameters in $req->meta['params'].




---

Layout System (layout.php)

Bastion uses a stacked layout system like Next.js:

Root layout: app/layout.php (wraps everything)

Nested layouts: app/admin/layout.php, app/admin/users/layout.php, etc.


Layout resolution order for /admin/users

1. app/admin/users/layout.php (if exists)


2. app/admin/layout.php (if exists)


3. app/layout.php (always the last fallback)



Each layout receives a $content() closure it can call to render nested content.


---

Root layout: app/layout.php

This is the main HTML shell.

<?php
use App\Core\Theme;
$nonce = $_SESSION['csp_nonce'] ?? ($_SESSION['csp_nonce'] = base64_encode(random_bytes(16)));
$title = \App\Core\DV::get('title', 'Bastion PHP');
?>
<!doctype html>
<html lang="en" <?= Theme::applyHtmlAttrs() ?>>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?= e($title) ?></title>

  <!-- Tailwind via CDN (example) -->
  <script nonce="<?= e($nonce) ?>" src="https://cdn.tailwindcss.com"></script>

  <!-- HTMX for interactive components -->
  <script nonce="<?= e($nonce) ?>" src="https://unpkg.com/htmx.org@1.9.10"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <nav>...navbar...</nav>

  <main class="max-w-6xl mx-auto px-4 py-8">
    <?php $content(); ?>
  </main>
</body>
</html>


---

Nested layout: app/admin/layout.php

<?php
$nonce = $_SESSION['csp_nonce'] ?? ($_SESSION['csp_nonce'] = base64_encode(random_bytes(16)));
?>
<section class="space-y-6">
  <header class="flex items-center justify-between mb-4">
    <h1 class="text-3xl font-bold">Admin Panel</h1>
    <span class="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
      Bastion 0.1.0
    </span>
  </header>

  <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
    <div class="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <?php $content(); ?>
    </div>

    <aside class="space-y-3">
      <!-- Sidebar shortcuts -->
      <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
        <h2 class="font-semibold mb-2 text-slate-100">Shortcuts</h2>
        <ul class="space-y-1">
          <li><a href="/admin" class="hover:text-white">Dashboard</a></li>
          <li><a href="/admin/users" class="hover:text-white">Users</a></li>
        </ul>
      </div>
    </aside>
  </div>
</section>

Any page.php in /admin or its subfolders is rendered inside this layout.


---

Views & Components

Views

By default, you compose pages from:

app/.../page.php → main content

app/.../layout.php → wrappers

Optionally resources/views/... if you want separate view files


You can use the view() helper:

<?php
// In some controller or page
echo view('pages.profile', ['name' => 'Sunset']);

(which resolves to resources/views/pages/profile.php).

Components

Simple PHP “components” live under resources/views/components/.

Example: resources/views/components/searchbar.php

<section>
  <input
    hx-get="/api/users"
    hx-trigger="keyup changed delay:400ms"
    hx-target="#user-table"
    placeholder="Search users..."
    type="text"
  >
</section>

You include it in a page or layout like:

<?php include __DIR__.'/../../components/searchbar.php'; ?>


---

Request, Response & Validation

Request (App\Core\Request)

Every handler (page or API) can receive a $req object in APIs and global helpers for pages.

Key methods:

$req->method;        // "GET", "POST", etc.
$req->path;          // "admin/users", "api/users"
$req->query;         // $_GET array
$req->body;          // $_POST array (for form requests)
$req->headers;       // HTTP headers
$req->cookies;       // $_COOKIE
$req->meta;          // extra metadata (like route params)

$req->input('email'); // read from body or query
$req->isJson();       // true if Content-Type: application/json
$req->json();         // parse raw request as JSON and return array

Validation

You can validate input using $req->validate():

$data = $req->validate([
    'email'    => 'required|email',
    'password' => 'required|min:8',
]);

If validation fails:

It throws ValidationException

Status code 422

You can catch it and return structured errors


Example in API:

try {
    $data = $req->validate([
        'email' => 'required|email',
    ]);
} catch (ValidationException $e) {
    Response::json(['errors' => $e->errors], 422);
}

Response (App\Core\Response)

Static helpers:

Response::json($data, $status = 200);           // JSON and exit
Response::html($html, $status = 200);           // HTML and exit
Response::redirect($url, $code = 302);          // Location header and exit
Response::abort($code, $message = '');          // Use error views if present


---

Database Layer (DB & QueryBuilder)

Configuration

config/database.php (simplified):

<?php
return [
  'driver'   => 'sqlite',
  'database' => __DIR__.'/../storage/db.sqlite',
];

The DB class uses PDO internally.

QueryBuilder usage

use App\Core\DB;

// Get multiple
$users = DB::table('users')
    ->where('role', 'admin')
    ->orderBy('id', 'DESC')
    ->limit(10)
    ->get();

// Get first row
$user = DB::table('users')
    ->where('id', 5)
    ->first();

// Insert
$id = DB::table('users')->insert([
    'name'       => 'New User',
    'email'      => 'user@example.com',
    'password'   => password_hash('secret', PASSWORD_DEFAULT),
    'role'       => 'user',
    'created_at' => time(),
]);

// Update
DB::table('users')->where('id', $id)->update([
    'role' => 'admin',
]);

// Delete
DB::table('users')->where('id', $id)->delete();

// Count
$count = DB::table('users')->where('role', 'admin')->count();

Migrations

Migrations are simple .sql files in database/migrations.

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

Seeders

Seeders are PHP files in database/seeds.

Example database/seeds/UsersSeeder.php:

<?php

use App\Core\DB;

$pdo = DB::getPdo();
$exists = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

if ((int)$exists === 0) {
    $stmt = $pdo->prepare(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        'Admin User',
        'admin@example.com',
        password_hash('password', PASSWORD_DEFAULT),
        'admin',
        time(),
    ]);
}

Run seeder:

./bastion seed


---

Authentication (JWT + Refresh Tokens)

Bastion uses:

Access token (JWT) — short-lived; stored in cookie or Authorization header

Refresh token — stored server-side in DB, rotated each use


Login flow

1. User sends email/password to /api/auth/login


2. Auth::attempt() checks password:

If ok → issues tokens (Auth::issueTokens($userId))



3. Access token and refresh token are stored as cookies



Example login handler: app/api/auth/login/+server.php:

<?php

use App\Core\Auth;
use App\Core\Response;

return [
    'post' => function($req) {
        $email    = $req->input('email');
        $password = $req->input('password');

        $tokens = Auth::attempt($email, $password);
        if ($tokens === false) {
            Response::redirect('/login?error=1');
        }

        $secure = filter_var(getenv('SECURE_COOKIES') ?: 'false', FILTER_VALIDATE_BOOLEAN);

        setcookie('access', $tokens['access'], [
            'expires'  => $tokens['expires'],
            'path'     => '/',
            'secure'   => $secure,
            'httponly' => false,  // you may set this true if you don’t need front-end access
            'samesite' => 'Lax',
        ]);

        setcookie('refresh', $tokens['refresh'], [
            'expires'  => time() + (int)(getenv('JWT_REFRESH_TTL') ?: 604800),
            'path'     => '/',
            'secure'   => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        Response::redirect('/admin');
    },
];

Accessing current user

Anywhere in your code:

$user = auth();        // returns user array or null
if ($user && $user['role'] === 'admin') { ... }

Also in middleware, $req->meta['user'] can hold the user.


---

Middlewares

Middlewares are run in a chain before the router handles a request.

Typical pipeline:

SecurityHeaders
→ RateLimit
→ AuthMiddleware
→ (optionally AdminOnly for certain routes)
→ Router
→ Page or API handler

SecurityHeaders

Sets:

CSP with nonce

X-Frame-Options

X-Content-Type-Options

Referrer-Policy


It also stores csp_nonce in the request metadata or session, so layouts can use it.

AuthMiddleware

Reads JWT from cookies / headers

If valid, fetches user from DB and sets auth() and $req->meta['user']

For non-GET methods, also calls CSRF protection


CSRF

Generates tokens with CSRF::token()

Verifies them for POST/PUT/PATCH/DELETE requests


Helpful helpers:

<input type="hidden" name="_csrf" value="<?= e(csrf_token()) ?>">
<?= csrf_field() ?>


---

HTMX Integration

HTMX lets you add AJAX-like behavior without writing JS by hand.

Example use case in admin page: app/admin/page.php:

<button
  hx-get="/api/users"
  hx-target="#user-table"
  hx-swap="innerHTML"
>
  Reload via HTMX
</button>

<div id="user-table">
  <!-- initial loaded table -->
</div>

In the API handler, you can detect HTMX or HTML Accept headers and return HTML instead of JSON:

if (isset($_SERVER['HTTP_HX_REQUEST'])) {
    // Return partial HTML
    ob_start();
    foreach ($users as $u) {
        echo '<div>'.e($u['email']).'</div>';
    }
    $html = ob_get_clean();
    Response::html($html);
} else {
    Response::json($users);
}


---

CLI Commands (bastion)

Use the bastion script in project root:

./bastion

Typical commands:

./bastion run-dev
Starts the PHP dev server (by default on 127.0.0.1:8000).

./bastion migrate
Runs all database/migrations/*.sql files.

./bastion seed
Executes all database/seeds/*.php.


(If your script adds more commands like make:page, build, etc., they will be documented there.)


---

Step-by-Step Example Feature

Here is a quick end-to-end feature you can build to understand the flow:

> “List products in /admin/products with a searchable table, using HTMX.”



1. Create migration for products

Create database/migrations/010_create_products.sql:

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  created_at INTEGER NOT NULL
);

Run:

./bastion migrate

2. Seed some products (optional)

database/seeds/ProductsSeeder.php:

<?php

use App\Core\DB;

$pdo = DB::getPdo();
$exists = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
if ((int)$exists === 0) {
    $stmt = $pdo->prepare("INSERT INTO products (sku, name, price, created_at) VALUES (?,?,?,?)");
    $stmt->execute(['P-001', 'Test Product 1', 9.99, time()]);
    $stmt->execute(['P-002', 'Test Product 2', 19.99, time()]);
}

Run:

./bastion seed

3. Create API endpoint: app/api/products/+server.php

<?php

use App\Core\Response;
use App\Core\DB;

return [
    'get' => function($req) {
        $search = $req->input('q', '');

        $query = DB::table('products')->orderBy('id', 'DESC');

        if ($search !== '') {
            // Simple filter example
            $query = $query->where('name', $search); // You can switch to LIKE later
        }

        $products = $query->get();

        if (isset($_SERVER['HTTP_HX_REQUEST'])) {
            // Return HTML partial for HTMX table
            ob_start();
            ?>
            <table class="w-full text-sm">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($products as $p): ?>
                    <tr>
                        <td><?= e($p['sku']) ?></td>
                        <td><?= e($p['name']) ?></td>
                        <td><?= e(number_format($p['price'], 2)) ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <?php
            $html = ob_get_clean();
            Response::html($html);
        } else {
            Response::json($products);
        }
    },
];

4. Create admin page: app/admin/products/page.php

<?php

use App\Core\DV;

DV::set('title', 'Products');

?>
<section class="space-y-4">
    <h2 class="text-2xl font-bold mb-2">Products</h2>

    <input
        type="text"
        placeholder="Search products..."
        hx-get="/api/products"
        hx-trigger="keyup changed delay:300ms"
        hx-target="#products-table"
        class="w-full max-w-sm px-3 py-2 rounded bg-slate-950 border border-slate-700"
    >

    <div id="products-table" class="mt-4">
        <!-- HTMX will load table here from /api/products -->
        <button
          hx-get="/api/products"
          hx-target="#products-table"
          hx-swap="innerHTML"
          class="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Load Products
        </button>
    </div>
</section>

5. Navigate to /admin/products

Make sure your app/admin/layout.php is in place so that your new page is wrapped inside the admin shell.


---

Troubleshooting & Common Pitfalls

1. 404 on /admin/...

Check: app/admin/page.php exists.

Check: app/admin/layout.php exists (or at least app/layout.php).


2. 404 on /api/...

Check folder: app/api/.../+server.php.

Make sure your file returns an array: return ['get' => function(...) {...}].


3. CSRF errors (403) on POST/PUT/DELETE

Ensure you used <?= csrf_field() ?> in HTML forms.

For JSON requests, send header X-CSRF-TOKEN with csrf_token() value (you can send it from page).


4. JWT invalid or user lost session

Check .env has JWT_SECRET.

Ensure seeds created an admin user with correct password.

Check cookie names match your code (access, refresh).


5. White screen / weird error

In .env, set: APP_DEBUG=true.

You get raw stack trace in browser for easier debugging.



---

If you are a PHP developer coming from Laravel, think of Bastion like this:

app/Core/Router.php ≈ a custom router using the filesystem

app/layout.php ≈ a global layout like a Blade layout

app/.../page.php ≈ your Blade views/controllers merged

+server.php ≈ route/controller for REST endpoints

DB::table() ≈ simplified Query Builder

bastion ≈ tiny custom artisan


Everything is plain PHP, you can open any file and see exactly what runs.

--- 
