# 02 — Guides & Common Workflows

This guide contains several realistic developer workflows with runnable examples.

---

## 1) Create a route and page

- File-based routing maps `app/.../page.php` to a URL.

Example:
Create `app/blog/page.php`
```php
<?php
$title = 'Blog';
$posts = [
  ['title' => 'Hello', 'body' => 'Welcome']
];
?>
<h1><?= e($title) ?></h1>
<?php foreach ($posts as $p): ?>
  <article>
    <h2><?= e($p['title']) ?></h2>
    <p><?= e($p['body']) ?></p>
  </article>
<?php endforeach; ?>
```
Open: `/blog`

When to use:
- Use file-based routes for all standard pages — simple, no route registration required.

---

## 2) Add an API endpoint (+server.php)

Place `+server.php` next to page folders to provide JSON endpoints.

Example: `app/api/ping/+server.php`
```php
<?php
return [
  'get' => function($req) {
    header('Content-Type: application/json');
    echo json_encode(['pong' => true]);
  }
];
```
When to use:
- Use for API endpoints, HTMX handlers, and AJAX backends.

Security:
- For API endpoints, prefer token-based auth and CORS as needed. CSRF is skipped automatically for JSON by default.

---

## 3) Register a service into the DI container

- Create `app/Services/EmailService.php` and register it as singleton.

Example:
```php
<?php
namespace App\Services;
class EmailService {
  public function send(string $to, string $subject, string $body): bool {
    // integrate mailer
    return true;
  }
}
```

Register:
```php
// in app/Core/App::registerCoreServices (or in bootstrap)
$app->singleton(App\Services\EmailService::class, fn() => new App\Services\EmailService());
```

Resolve:
```php
$svc = App\Core\App::getInstance()->resolve(App\Services\EmailService::class);
$svc->send('user@example.com','Hello','Welcome');
```

When to use:
- Use DI for stateful resources (DB connections, mailers), and to enable testability.

---

## 4) Protect an admin route

- Use `AdminOnly` middleware when the request path is under `/admin` (the generator registers this automatically in `public/index.php`).

Route-level enforcement example:
```php
// in a +server.php you can still call:
\App\Middleware\AdminOnly::handle($req, function($req) {
    // protected code
});
```

---

## 5) Debugging & Logging

- Use `logger()` helper:
```php
logger()->info('User action', ['user_id' => 1]);
```

- For debugging output: avoid printing sensitive data; use `dd()` in dev only (if present).

---

## 6) Migrations & Seeders

- Migrations live in `database/migrations/` and are executed in alphabetical order by the CLI.

Create migration example `database/migrations/004_create_posts_table.php`:
```php
<?php
use App\Core\DB;
$pdo = DB::pdo();
$pdo->exec("
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT,
  created_at INTEGER NOT NULL
)");
echo "✓ Created posts table\n";
```

Run:
```bash
./bastion migrate
```

Seeders example (append in `database/seeds/`), then:
```bash
./bastion db:seed
```

---

## 7) Troubleshooting

- `DB locked` -> ensure WAL is enabled and file perms allow write for PHP user.
- `CSS not updated` -> ensure `npm install` completed and run `./bastion run-build`.
- `JWT failures` -> set `JWT_SECRET` in .env and restart services.
