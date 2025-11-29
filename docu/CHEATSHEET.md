# Cheatsheet — Most frequent commands & snippets

## CLI
- Start dev env:
  ```bash
  ./bastion run-dev
  ```
- Production build:
  ```bash
  ./bastion run-build
  ```
- Migrate DB:
  ```bash
  ./bastion migrate
  ```
- Seed DB:
  ```bash
  ./bastion db:seed
  ```
- Generate APP_KEY:
  ```bash
  ./bastion key:generate
  ```

## Quick PHP snippets

- Access request input:
  ```php
  $req = new App\Core\Request();
  $name = $req->input('name');
  ```

- Render a view:
  ```php
  echo App\Core\DV::render('pages/home', ['title'=>'Home']);
  ```

- Use DB:
  ```php
  $users = App\Core\DB::table('users')->where('role','admin')->get();
  ```

- Create user:
  ```php
  $id = App\Models\User::create([
    'email'=>'x@y.com','password'=>'password','name'=>'X'
  ]);
  ```

- Issue tokens:
  ```php
  $tokens = App\Core\Auth::issueTokens($userId);
  ```

---

## Files to inspect for quick setup
- `.env` — environment config
- `config/style.php` — styling mode (Tailwind vs fallback)
- `public/index.php` — middleware registration & front controller
- `bastion` — CLI (dev/build/migrate/seed/serve)
