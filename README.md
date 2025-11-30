# Bastion PHP — Enterprise-Grade Internal Tools Framework
**Version: 0.1.0**

Bastion PHP is a **fully file-driven PHP framework** engineered for companies that need to ship **internal applications fast** while maintaining **military-grade security defaults** and **developer control without framework bloat**.

It unifies:
- **Next.js developer ergonomics** (nested layouts + filesystem routing)
- **Django admin mindset** (dashboard + data management UI)
- **FastAPI clarity and middleware pipeline philosophy**
- **HTMX interactivity without client frameworks**
- **Raw PDO-based DB operation chains behaving like a minimal fearless ORM**

---

## 🔥 What Bastion PHP **really** is

Bastion is **not**:
- A UI library
- A micro-framework like Slim or Laravel
- A MVC boilerplate
- A monolithic fullstack tool

Bastion **IS**:
- A PHP runtime that **behaves like a compiler-grade server framework**
- A system where **filesystem structure = actual routing logic**
- A framework where **`layout.php` files are inherited automatically like React/Next**
- A middleware pipeline always executed **before any route handler**
- A secure-by-default authentication system using **JWT + rotated refresh tokens**
- A SQL interface that feels like an **ORM but stays raw PDO under the hood**
- A component rendering system where **components are PHP includes**
- A dev-friendly CLI called **`bastion`** (but extendable like artisan)
- A dark-UI-first internal admin design system (your current visual style)

---

## 🧠 Framework Philosophy

> **"Fast to write. Safe to deploy. Impossible to hide errors."**

| Principle | Meaning |
|---|---|
| Explicit > Magic | No hidden behavior, everything is in files you own |
| Filesystem = Router | No routing arrays, no attributes, no decorators |
| Layout inheritance | Closest `layout.php` wraps child → parent → root |
| Middlewares always run | No request skips security layers |
| No unsafe-inline code | CSP uses dynamic nonces automatically |
| No frontend frameworks | Client interactivity via HTMX, not JS bundlers |
| No email surprises | Developer sees full trace on every failure |
| Security never optional | Auth/CSRF/CSP/Headers run by default |
| No template mixing | PHP includes over Jinja/Jinja-like templating |

---

## 📁 How Your Project Scaffold Looks After Running the Script

my-tool/ ├── app/ │   ├── layout.php          ← ROOT layout (wraps all pages) │   ├── page.php            ← ROOT public home page │   ├── Core/ │   │   ├── Container.php   ← Dependency injection container │   │   ├── App.php         ← Main app runtime │   │   ├── Router.php      ← File-based router using folder resolution │   │   ├── DB.php          ← PDO Facade +QueryBuilder │   │   ├── Auth.php        ← JWT + Refresh rotation │   │   ├── Request.php     ← Unified HTTP Request interface │   │   ├── Response.php    ← HTTP Response helpers │   │   ├── CSRF.php        ← CSRF validation layer │   │   └── Theme.php       ← Dark mode helper resolution │   ├── Middleware/ │   │   ├── SecurityHeaders.php ← CSP and headers │   │   ├── AuthMiddleware.php  ← Validates JWT & CSRF │   │   ├── AdminOnly.php       ← Protect admin pages │   │   └── RateLimit.php       ← Limiting stub ├── resources/ │   ├── css/app.css         ← Tailwind entry point generated for watch │   ├── views/ │   │   ├── errors/         ← 404.php/403.php/500.php │   │   └── components/     ← PHP UI components folder ├── database/ │   ├── migrations/.sql    ← SQL migrations run by CLI │   └── seeds/.php         ← Data seed scripts (users, roles, etc.) ├── public/ │   ├── index.php           ← Front-controller entry point │   └── css/fallback.css    ← fallback style layer └── storage/ ├── db/app.db           ← SQLite WAL database default └── logs/app.log        ← Dev friendly logger

---

## ⚡ Next.js-Like Layout & Routing System (REAL behavior)

Bastion routes are deduced from filesystem structure:

If URL = /admin/users/settings

Router walks: app/ → admin/   (check if admin/layout.php exists) → users/   (check if app/admin/users/layout.php exists) → settings/

Layout stack resolved:

1. app/admin/users/settings/layout.php


2. app/admin/users/layout.php


3. app/admin/layout.php


4. app/layout.php   ← root fallback, always last



Then it loads: page.php from deepest folder

Execution order: Request parsed → Middlewares → Router → stacked layouts → page output inserted

### Example of how a layout looks:

```php
<div class="bg-gray-900 text-white p-6">
  <?php $content(); ?>
</div>
```

You never write full HTML inside pages. The layout wraps it automatically.


---

🗄 Database Facade (Minimal, raw, chainable ORM feel)

You interact with DB using chains:

$users = DB::table('users')->where('role','admin')->limit(10)->orderBy('id','DESC')->get();

Supported methods include:

Method	Description

DB::table(name)	selects table and returns QueryBuilder
where(column,value)	adds bind-safe where clause
orWhere(column,value)	optional expansion
limit(n)	adds SQL LIMIT
offset(n)	adds SQL OFFSET
orderBy(col,dir)	adds SQL ORDER BY
get()	executes SQL, returns array results
first()	returns 1 result or null
insert(data)	inserts row, returns inserted ID
update(data)	updates matched rows, returns bool
delete()	deletes matched rows
count()	returns COUNT of matched rows


Powered 100% by PDO and SQLite WAL concurrency by default.


---

👤 Auth System (JWT Access + Rotated Refresh Tokens)

[
  'access'  => 'eyJ...'  ← JWT access token
  'refresh' => 'abcd1234:ef567...' ← rotated refreshed token pair
  'expires' => 1732912341
]

Developer helpers:

auth();                  // Returns current user or null
Auth::check($req);       // Populates request->meta user
Auth::isAdmin();         // Boolean admin check
Auth::attempt(email,pass)// Issues tokens
Auth::issueTokens(userId)// Create JWT + Refresh
Auth::validate(token)    // validates JWT
Auth::validateRefreshToken(refreshCookieValue) → int user ID or null

Refresh tokens auto-delete after use (rotation).


---

🔐 Security Middlewares (Always wrapped before routing)

Pipeline runs:

SecurityHeaders → RateLimit → AuthMiddleware → AdminOnly → Router → Route Handler

SecurityHeaders.php injects CSP nonces like:

$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$nonce'");

This middleware is never skipped.


---

🧰 DV View Rendering (App\Core\DV)

Singleton rendering class for passing view data:

DV::set('title','Admin Users');
echo view('pages.admin.users', ['users'=>$users]);

Features:

Capability	Meaning

Global data store	Share keys across renders
Singleton	Same instance used globally
Extract support	auto expose variables into scope
Dot-path include resolution	pages.admin.users → resources/views/pages/admin/users.php
Partial rendering	Inject only HTML when HTMX triggered
Full error visibility	No silent template failures



---

🎨 Theme System (Dark first, system detect)

Defined in config/style.php:

return [
  'theme' => getenv('THEME_MODE') ?: 'system'
];

The helper can apply html <html class="dark"> attributes or detect system mode.


---

💥 HTMX Components (Native interactivity without JS frameworks)

Examples:

<button hx-get="/api/users" hx-target="#result" hx-swap="innerHTML">Load</button>
<input hx-get="/api/users/search" hx-trigger="keyup changed delay:400ms" hx-target="#result"/>

CSP nonce injected into htmx script tags so inline CSS enhancements don’t break CSP.


---

⚡ CLI Utilities

Commands your generator creates:

Command	Function

./bastion run-dev	Starts PHP dev server on :8000
./bastion migrate	Runs SQL files from database/migrations
./bastion seed	Run seed scripts
./bastion key:generate	Generates APP_KEY
./bastion jwt:secret	New JWT secret
./bastion make:page name	Scaffolds page.php + inheritable parent layouts
./bastion make:api name	Makes an api folder with +server.php
./bastion make:module name	Scaffold module folder
./bastion build	Minifies Tailwind/css


CLI is fearless: errors are always printed in terminal or browser.


---

🧪 Development Testing Strategy

Right after generation you should test in development, not at the end:

✔ Break router intentionally → full stacktrace shows in browser if APP_DEBUG=true
✔ Invalid CSRF → rejects properly via JSON abort or 403 redirect
✔ Invalid JWT → returns null and no global side-effects

You can test APIs like:

curl -X POST localhost:8000/api/auth/login -d '{"email":"admin@example.com","password":"admin123"}' -H "Content-Type:application/json"

or test DB table existence:

sqlite3 storage/db/app.db ".tables"


---

✅ Summary

Bastion PHP is a truly file-driven, secure-by-default, middleware-first, internal-app framework that gives you:

✅ Filesystem routing like Next.js

✅ Layout inheritance & stacking

✅ Middleware pipeline always first

✅ HTMX interactive UI components

✅ Raw PDO → Query chains ORM-feel ergonomics

✅ JWT Access + rotated refresh tokens

✅ CLI for pages, APIs, modules, migrations and seeds

✅ Fully inspectable development behavior

✅ Dark-UI-first internal dashboard design

