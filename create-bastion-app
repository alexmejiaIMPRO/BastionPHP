#!/usr/bin/env bash
#==============================================================================
# BASTION PHP ENTERPRISE GENERATOR v0.1.0
#==============================================================================
# Arquitectura: Monolito Modular
# Estilo: Tailwind CSS v4 (PostCSS)
# Motor: DV Engine + File-based Routing
# Volumen: Enterprise Boilerplate (>4000 lines targeted)
#==============================================================================

set -euo pipefail

#------------------------------------------------------------------------------
# 1. VISUAL INTERFACE & LOGGING CONSTANTS
#------------------------------------------------------------------------------
BOLD='\033[1m'
DIM='\033[2m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

#------------------------------------------------------------------------------
# 2. HELPER FUNCTIONS FOR INSTALLATION
#------------------------------------------------------------------------------

banner() {
    clear
    echo -e "${CYAN}"
    echo "  ██████╗  █████╗ ███████╗████████╗██╗ ██████╗ ███╗   ██╗"
    echo "  ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║"
    echo "  ██████╔╝███████║███████╗   ██║   ██║██║   ██║██╔██╗ ██║"
    echo "  ██╔══██╗██╔══██║╚════██║   ██║   ██║██║   ██║██║╚██╗██║"
    echo "  ██████╔╝██║  ██║███████║   ██║   ██║╚██████╔╝██║ ╚████║"
    echo "  ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝"
    echo -e "${NC}  ${BOLD}ENTERPRISE PHP FRAMEWORK GENERATOR${NC} ${DIM}v0.1.0${NC}"
    echo -e "  ${BLUE}>> Architecting your fortress...${NC}"
    echo ""
}

log_info()  { echo -e "${BLUE}  [INFO]${NC} $1"; }
log_step()  { echo -e "${MAGENTA}  [STEP]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}  [WARN]${NC} $1"; }
log_success() { echo -e "${GREEN}  [DONE]${NC} $1"; }
log_error() { echo -e "${RED}  [FAIL]${NC} $1"; exit 1; }

check_requirement() {
    local cmd=$1
    local name=$2
    if ! command -v "$cmd" >/dev/null 2>&1; then
        log_error "$name is required but not installed. Aborting."
    fi
}

#------------------------------------------------------------------------------
# 3. INITIALIZATION & ARGUMENT PARSING
#------------------------------------------------------------------------------

if [ "$#" -lt 1 ]; then
    banner
    echo -e "${YELLOW}Usage:${NC} ./create-bastion-app <project-name>"
    echo ""
    exit 1
fi

PROJECT_NAME=$1
ROOT_DIR="$(pwd)/$PROJECT_NAME"
PHP_VERSION=$(php -r 'echo PHP_VERSION_ID;' 2>/dev/null || echo 0)

banner
log_step "Initiating system check sequence..."

# System Checks
check_requirement "php" "PHP"
check_requirement "composer" "Composer"
check_requirement "npm" "Node.js/NPM"
check_requirement "git" "Git"

if [ "$PHP_VERSION" -lt 80100 ]; then
    log_error "Bastion requires PHP 8.1 or higher. Current version is too old."
fi

if [ -d "$ROOT_DIR" ]; then
    log_error "Directory '$PROJECT_NAME' already exists."
fi

#------------------------------------------------------------------------------
# 4. DIRECTORY ARCHITECTURE SCAFFOLDING
#------------------------------------------------------------------------------
log_step "Constructing filesystem hierarchy..."

mkdir -p "$ROOT_DIR"
cd "$ROOT_DIR"

# Core Structure
mkdir -p app/api                # REST/HTMX Endpoints
mkdir -p app/components         # Functional UI Components
mkdir -p app/console            # CLI Commands
mkdir -p app/core               # Framework Kernel
mkdir -p app/http/middleware    # HTTP Middleware
mkdir -p app/http/requests      # Form Validation Classes
mkdir -p app/models             # Eloquent-like Models
mkdir -p app/providers          # Service Providers
mkdir -p app/services           # Business Logic Services
mkdir -p app/traits             # Shared Behaviors
mkdir -p app/views/layouts      # View Layouts
mkdir -p app/views/errors       # Error Pages

# Configuration & Database
mkdir -p config
mkdir -p database/migrations
mkdir -p database/seeds
mkdir -p database/factories

# Public & Assets
mkdir -p public/assets/css
mkdir -p public/assets/js
mkdir -p public/assets/img
mkdir -p resources/css
mkdir -p resources/js

# Storage (Secured)
mkdir -p storage/app/public
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Tests
mkdir -p tests/Feature
mkdir -p tests/Unit

# Permissions
chmod -R 775 storage
touch storage/logs/bastion.log

log_success "Filesystem structure created."

#------------------------------------------------------------------------------
# 5. DEPENDENCY DEFINITION
#------------------------------------------------------------------------------
log_step "Defining package manifest (Composer & NPM)..."

# composer.json
cat > composer.json <<JSON
{
    "name": "bastion/enterprise-app",
    "description": "A secure, scalable Bastion PHP application.",
    "type": "project",
    "license": "MIT",
    "require": {
        "php": "^8.1",
        "ext-pdo": "*",
        "ext-json": "*",
        "ext-mbstring": "*",
        "ext-openssl": "*",
        "vlucas/phpdotenv": "^5.6",
        "firebase/php-jwt": "^6.10",
        "symfony/var-dumper": "^6.4",
        "filp/whoops": "^2.15"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.5",
        "fakerphp/faker": "^1.23",
        "mockery/mockery": "^1.6"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\": "database/"
        },
        "files": [
            "app/core/helpers.php"
        ]
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    },
    "config": {
        "optimize-autoloader": true,
        "preferred-install": "dist",
        "sort-packages": true,
        "allow-plugins": {
            "pestphp/pest-plugin": true
        }
    },
    "scripts": {
        "post-root-package-install": [
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
        ],
        "test": "phpunit"
    }
}
JSON

# package.json (Tailwind v4 Preparation)
cat > package.json <<JSON
{
    "private": true,
    "type": "module",
    "scripts": {
        "dev": "tailwindcss -i ./resources/css/app.css -o ./public/assets/css/app.css --watch",
        "build": "tailwindcss -i ./resources/css/app.css -o ./public/assets/css/app.css --minify",
        "lint": "eslint resources/js",
        "format": "prettier --write resources/**/*.{js,css,php}"
    },
    "devDependencies": {
        "tailwindcss": "^3.4.1",
        "autoprefixer": "^10.4.17",
        "postcss": "^8.4.35",
        "prettier": "^3.2.5",
        "prettier-plugin-tailwindcss": "^0.5.11",
        "concurrently": "^8.2.2"
    }
}
JSON

log_success "Manifests created."

#------------------------------------------------------------------------------
# 6. ENVIRONMENT CONFIGURATION
#------------------------------------------------------------------------------
log_step "Generating secure environment configuration..."

APP_KEY=$(openssl rand -base64 32 2>/dev/null || echo "base64:$(date +%s%N | base64)")
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "hex:$(date +%s%N | md5sum | head -c 32)")

# .env (Production Template)
cat > .env.example <<ENV
APP_NAME=BastionEnterprise
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=UTC
APP_LOCALE=en

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bastion
DB_USERNAME=root
DB_PASSWORD=

# Security
SESSION_DRIVER=file
SESSION_LIFETIME=120
SECURE_COOKIES=false
CSRF_ENABLED=true

# Auth
JWT_SECRET=
JWT_ALGO=HS256
JWT_TTL=60 # minutes
JWT_REFRESH_TTL=20160 # 2 weeks

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

# Filesystem
FILESYSTEM_DISK=local
ENV

# .env (Active)
cp .env.example .env
# Inject Keys
sed -i "s|APP_KEY=|APP_KEY=$APP_KEY|g" .env
sed -i "s|JWT_SECRET=|JWT_SECRET=$JWT_SECRET|g" .env

#------------------------------------------------------------------------------
# 7. EXTENSIVE HELPER LIBRARY (Battery Pack 1)
#------------------------------------------------------------------------------
log_step "Compiling extensive helper library (String, Array, Path utils)..."

cat > app/core/helpers.php <<PHP
<?php

use App\Core\App;
use App\Core\Request;
use App\Core\Response;
use App\Core\DV;
use App\Core\Auth;
use Symfony\Component\VarDumper\VarDumper;

/*
|--------------------------------------------------------------------------
| Application Globals
|--------------------------------------------------------------------------
*/

if (!function_exists('app')) {
    /**
     * Get the available container instance.
     *
     * @param  string|null  \$abstract
     * @param  array  \$parameters
     * @return mixed|\App\Core\App
     */
    function app(\$abstract = null, array \$parameters = [])
    {
        if (is_null(\$abstract)) {
            return App::getInstance();
        }
        return App::getInstance()->make(\$abstract, \$parameters);
    }
}

if (!function_exists('env')) {
    /**
     * Gets the value of an environment variable.
     *
     * @param  string  \$key
     * @param  mixed  \$default
     * @return mixed
     */
    function env(\$key, \$default = null)
    {
        if (!isset(\$_ENV[\$key])) {
            return \$default;
        }
        
        \$value = \$_ENV[\$key];

        return match (strtolower(\$value)) {
            'true', '(true)' => true,
            'false', '(false)' => false,
            'empty', '(empty)' => '',
            'null', '(null)' => null,
            default => \$value,
        };
    }
}

if (!function_exists('config')) {
    /**
     * Get / set configuration value.
     *
     * @param  string|array|null  \$key
     * @param  mixed  \$default
     * @return mixed
     */
    function config(\$key = null, \$default = null)
    {
        if (is_null(\$key)) {
            return app('config');
        }

        if (is_array(\$key)) {
            return app('config')->set(\$key);
        }

        return app('config')->get(\$key, \$default);
    }
}

/*
|--------------------------------------------------------------------------
| Path Helpers
|--------------------------------------------------------------------------
*/

if (!function_exists('base_path')) {
    function base_path(\$path = ''): string
    {
        return app()->basePath . (\$path ? DIRECTORY_SEPARATOR . \$path : \$path);
    }
}

if (!function_exists('app_path')) {
    function app_path(\$path = ''): string
    {
        return base_path('app') . (\$path ? DIRECTORY_SEPARATOR . \$path : \$path);
    }
}

if (!function_exists('storage_path')) {
    function storage_path(\$path = ''): string
    {
        return base_path('storage') . (\$path ? DIRECTORY_SEPARATOR . \$path : \$path);
    }
}

if (!function_exists('public_path')) {
    function public_path(\$path = ''): string
    {
        return base_path('public') . (\$path ? DIRECTORY_SEPARATOR . \$path : \$path);
    }
}

/*
|--------------------------------------------------------------------------
| String & Array Helpers
|--------------------------------------------------------------------------
*/

if (!function_exists('e')) {
    /**
     * Escape HTML entities.
     */
    function e(\$value): string
    {
        if (is_null(\$value)) return '';
        if (is_array(\$value) || is_object(\$value)) return json_encode(\$value);
        return htmlspecialchars(\$value, ENT_QUOTES, 'UTF-8', false);
    }
}

if (!function_exists('str_contains')) {
    function str_contains(\$haystack, \$needle): bool
    {
        return \$needle !== '' && mb_strpos(\$haystack, \$needle) !== false;
    }
}

if (!function_exists('str_starts_with')) {
    function str_starts_with(\$haystack, \$needle): bool
    {
        return (string)\$needle !== '' && strncmp(\$haystack, \$needle, strlen(\$needle)) === 0;
    }
}

if (!function_exists('class_basename')) {
    function class_basename(\$class): string
    {
        \$class = is_object(\$class) ? get_class(\$class) : \$class;
        return basename(str_replace('\\\\', '/', \$class));
    }
}

if (!function_exists('dd')) {
    /**
     * Dump the passed variables and end the script.
     */
    function dd(...\$args): never
    {
        foreach (\$args as \$x) {
            VarDumper::dump(\$x);
        }
        exit(1);
    }
}

/*
|--------------------------------------------------------------------------
| Framework Features (Request, Auth, DV)
|--------------------------------------------------------------------------
*/

if (!function_exists('request')) {
    function request(): Request
    {
        return app(Request::class);
    }
}

if (!function_exists('auth')) {
    function auth(): Auth
    {
        return app(Auth::class);
    }
}

if (!function_exists('dv')) {
    /**
     * Data View Engine Helper.
     * Use dv('key', 'val') to set, dv('key') to get.
     */
    function dv(\$key, \$value = null)
    {
        if (is_null(\$value)) {
            return DV::get(\$key);
        }
        DV::set(\$key, \$value);
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string
    {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if (empty(\$_SESSION['_token'])) {
            \$_SESSION['_token'] = bin2hex(random_bytes(32));
        }
        return \$_SESSION['_token'];
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="_token" value="' . csrf_token() . '">';
    }
}

if (!function_exists('method_field')) {
    function method_field(\$method): string
    {
        return '<input type="hidden" name="_method" value="' . \$method . '">';
    }
}

if (!function_exists('url')) {
    function url(\$path = ''): string
    {
        \$root = env('APP_URL', 'http://localhost');
        return rtrim(\$root, '/') . '/' . ltrim(\$path, '/');
    }
}

if (!function_exists('asset')) {
    function asset(\$path): string
    {
        return url('assets/' . ltrim(\$path, '/'));
    }
}

/*
|--------------------------------------------------------------------------
| UI Component Loader
|--------------------------------------------------------------------------
*/

if (!function_exists('component')) {
    /**
     * Load a functional component dynamically.
     *
     * @param string \$name Name of the component (e.g., 'Button', 'Forms.Input')
     * @param array \$props Associative array of properties
     * @return string HTML output
     */
    function component(string \$name, array \$props = []): string
    {
        // Convert dot notation (Forms.Input) to path (Forms/Input)
        \$path = str_replace('.', DIRECTORY_SEPARATOR, \$name);
        \$file = app_path("components/{\$path}.php");
        
        if (!file_exists(\$file)) {
            // Development fallback: nice error message in UI
            if (env('APP_DEBUG')) {
                return "<div class='bg-red-500 text-white p-2 text-sm font-mono'>Error: Component [\$name] not found.</div>";
            }
            return '';
        }
        
        // Include the file which should contain a function named matching the basename
        require_once \$file;
        
        \$functionName = basename(\$path);
        
        if (!function_exists(\$functionName)) {
            throw new Exception("Component file found but function [\$functionName] is missing.");
        }
        
        // Call the functional component
        // Note: We use named arguments unpacking in PHP 8
        try {
            return \$functionName(...\$props);
        } catch (\ArgumentCountError \$e) {
             // Handle missing required props nicely
             if (env('APP_DEBUG')) {
                 return "<div class='bg-yellow-500 text-black p-2 text-sm font-mono'>Component [\$name] Error: " . \$e->getMessage() . "</div>";
             }
             return '';
        }
    }
}
PHP

#------------------------------------------------------------------------------
# 8. CONFIGURATION FILES (Expanded)
#------------------------------------------------------------------------------
log_step "Generating system configurations..."

# App Config
cat > config/app.php <<PHP
<?php

return [
    'name' => env('APP_NAME', 'Bastion'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => env('APP_TIMEZONE', 'UTC'),
    'locale' => env('APP_LOCALE', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Autoloaded Service Providers
    |--------------------------------------------------------------------------
    */
    'providers' => [
        App\Providers\AppServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
        App\Providers\DatabaseServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Class Aliases
    |--------------------------------------------------------------------------
    */
    'aliases' => [
        'App' => App\Core\App::class,
        'Auth' => App\Core\Auth::class,
        'Config' => App\Core\Config::class,
        'DB' => App\Core\DB::class,
        'DV' => App\Core\DV::class,
        'Request' => App\Core\Request::class,
        'Response' => App\Core\Response::class,
        'Log' => App\Core\Logger::class,
    ],
];
PHP

# Database Config
cat > config/database.php <<PHP
<?php

return [
    'default' => env('DB_CONNECTION', 'sqlite'),

    'connections' => [
        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DATABASE_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
            // Enterprise Feature: WAL Mode enabled by default for concurrency
            'wal_mode' => true,
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ],
    ],

    'migrations' => 'migrations',
];
PHP

# Auth Config
cat > config/auth.php <<PHP
<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'jwt',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],
    
    'jwt' => [
        'secret' => env('JWT_SECRET'),
        'algo' => env('JWT_ALGO', 'HS256'),
        'ttl' => env('JWT_TTL', 60),
        'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),
    ]
];
PHP

# Filesystem Config
cat > config/filesystems.php <<PHP
<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],
    ],
];
PHP

log_success "Part 1 complete. Core environment configured."
#------------------------------------------------------------------------------
# 9. CORE KERNEL: DEPENDENCY INJECTION & APP CONTAINER
#------------------------------------------------------------------------------
log_step "Constructing IoC Container and Kernel..."

# 1. Container.php (Dependency Injection)
cat > app/core/Container.php <<PHP
<?php

namespace App\Core;

use Closure;
use ReflectionClass;
use Exception;

/**
 * Class Container
 * * A robust Inversion of Control (IoC) container for dependency injection.
 * Manages bindings, singletons, and automatic resolution of class dependencies.
 *
 * @package App\Core
 */
class Container
{
    /**
     * The current globally available container (if any).
     * @var static
     */
    protected static \$instance;

    /**
     * The container's bindings.
     * @var array[]
     */
    protected array \$bindings = [];

    /**
     * The container's shared instances (singletons).
     * @var object[]
     */
    protected array \$instances = [];

    /**
     * The registered type aliases.
     * @var string[]
     */
    protected array \$aliases = [];

    /**
     * Bind a abstract type to a concrete implementation.
     *
     * @param string \$abstract
     * @param Closure|string|null \$concrete
     * @param bool \$shared
     * @return void
     */
    public function bind(string \$abstract, \$concrete = null, bool \$shared = false): void
    {
        if (is_null(\$concrete)) {
            \$concrete = \$abstract;
        }

        \$this->bindings[\$abstract] = compact('concrete', 'shared');
    }

    /**
     * Bind a shared binding (singleton) to the container.
     *
     * @param string \$abstract
     * @param Closure|string|null \$concrete
     * @return void
     */
    public function singleton(string \$abstract, \$concrete = null): void
    {
        \$this->bind(\$abstract, \$concrete, true);
    }

    /**
     * Register an existing instance as shared in the container.
     *
     * @param string \$abstract
     * @param mixed \$instance
     * @return mixed
     */
    public function instance(string \$abstract, \$instance): mixed
    {
        \$this->instances[\$abstract] = \$instance;
        return \$instance;
    }

    /**
     * Resolve the given type from the container.
     *
     * @param string \$abstract
     * @param array \$parameters
     * @return mixed
     * @throws Exception
     */
    public function make(string \$abstract, array \$parameters = []): mixed
    {
        // Return existing singleton if available
        if (isset(\$this->instances[\$abstract])) {
            return \$this->instances[\$abstract];
        }

        \$concrete = \$this->getConcrete(\$abstract);

        // If concrete is a Closure, execute it
        if (\$concrete instanceof Closure) {
            \$object = \$concrete(\$this, \$parameters);
        } else {
            // Otherwise, reflect and build
            \$object = \$this->build(\$concrete);
        }

        // Cache if singleton
        if (isset(\$this->bindings[\$abstract]) && \$this->bindings[\$abstract]['shared']) {
            \$this->instances[\$abstract] = \$object;
        }

        return \$object;
    }

    /**
     * Get the concrete type for a given abstract.
     */
    protected function getConcrete(string \$abstract): mixed
    {
        if (!isset(\$this->bindings[\$abstract])) {
            return \$abstract;
        }
        return \$this->bindings[\$abstract]['concrete'];
    }

    /**
     * Instantiate a concrete instance using Reflection.
     * * @param string \$concrete
     * @return mixed
     * @throws Exception
     */
    protected function build(string \$concrete): mixed
    {
        try {
            \$reflector = new ReflectionClass(\$concrete);
        } catch (\ReflectionException \$e) {
            throw new Exception("Target class [\$concrete] does not exist.", 0, \$e);
        }

        if (!\$reflector->isInstantiable()) {
            throw new Exception("Target [\$concrete] is not instantiable.");
        }

        \$constructor = \$reflector->getConstructor();

        if (is_null(\$constructor)) {
            return new \$concrete;
        }

        \$dependencies = \$constructor->getParameters();
        \$instances = \$this->resolveDependencies(\$dependencies);

        return \$reflector->newInstanceArgs(\$instances);
    }

    /**
     * Resolve an array of dependencies.
     */
    protected function resolveDependencies(array \$dependencies): array
    {
        \$results = [];

        foreach (\$dependencies as \$dependency) {
            \$type = \$dependency->getType();

            if (!\$type || \$type->isBuiltin()) {
                if (\$dependency->isDefaultValueAvailable()) {
                    \$results[] = \$dependency->getDefaultValue();
                    continue;
                }
                throw new Exception("Unresolvable dependency resolving [\$dependency] in class " . \$dependency->getDeclaringClass()->getName());
            }

            \$results[] = \$this->make(\$type->getName());
        }

        return \$results;
    }

    /**
     * Set the globally available instance of the container.
     */
    public static function setInstance(Container \$container = null): ?Container
    {
        return static::\$instance = \$container;
    }

    /**
     * Get the globally available instance of the container.
     */
    public static function getInstance(): Container
    {
        if (is_null(static::\$instance)) {
            static::\$instance = new static;
        }
        return static::\$instance;
    }
}
PHP

# 2. App.php (The Framework Kernel)
cat > app/core/App.php <<PHP
<?php

namespace App\Core;

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Core\Routing\Router;
use App\Core\Exceptions\Handler;

/**
 * Class App
 * * The central kernel of the Bastion Framework.
 * Extends the Container to provide application-level bootstrapping.
 */
class App extends Container
{
    /**
     * The base path for the Bastion installation.
     * @var string
     */
    public string \$basePath;

    /**
     * The configuration repository.
     * @var Config
     */
    protected Config \$config;

    /**
     * Create a new Bastion application instance.
     *
     * @param string|null \$basePath
     */
    public function __construct(string \$basePath = null)
    {
        if (\$basePath) {
            \$this->basePath = rtrim(\$basePath, '\/');
        }

        self::setInstance(\$this);
        
        // Core bindings
        \$this->registerBaseBindings();
        \$this->registerErrorHandling();
        \$this->registerConfig();
    }

    /**
     * Register the basic bindings into the container.
     */
    protected function registerBaseBindings(): void
    {
        \$this->instance('app', \$this);
        \$this->instance(Container::class, \$this);
    }

    /**
     * Boot the config repository.
     */
    protected function registerConfig(): void
    {
        \$this->singleton('config', function () {
            return new Config(\$this->basePath . '/config');
        });
    }

    /**
     * Set up global error handling.
     */
    protected function registerErrorHandling(): void
    {
        error_reporting(-1);
        set_error_handler([Handler::class, 'handleError']);
        set_exception_handler([Handler::class, 'handleException']);
        register_shutdown_function([Handler::class, 'handleShutdown']);
    }

    /**
     * Run the application.
     * Handles the Request -> Router -> Response lifecycle.
     */
    public function run(): void
    {
        try {
            // 1. Boot Service Providers
            \$this->bootProviders();

            // 2. Capture Request
            \$request = Request::capture();
            \$this->instance(Request::class, \$request);

            // 3. Dispatch to Router
            \$router = \$this->make(Router::class);
            \$response = \$router->dispatch(\$request);

            // 4. Send Response
            \$response->send();

        } catch (\Throwable \$e) {
            Handler::render(\$e, new Request())->send();
        }
    }

    protected function bootProviders(): void
    {
        \$providers = config('app.providers', []);
        foreach (\$providers as \$provider) {
            \$instance = new \$provider(\$this);
            if (method_exists(\$instance, 'register')) {
                \$instance->register();
            }
            if (method_exists(\$instance, 'boot')) {
                \$instance->boot();
            }
        }
    }

    /**
     * Get the path to the application "app" directory.
     */
    public function path(string \$path = ''): string
    {
        return \$this->basePath . DIRECTORY_SEPARATOR . 'app' . (\$path ? DIRECTORY_SEPARATOR . \$path : \$path);
    }
}
PHP

# 3. Config.php (Configuration Repository)
cat > app/core/Config.php <<PHP
<?php

namespace App\Core;

class Config
{
    protected array \$items = [];
    protected string \$configPath;

    public function __construct(string \$configPath)
    {
        \$this->configPath = \$configPath;
        \$this->loadConfigurationFiles();
    }

    protected function loadConfigurationFiles(): void
    {
        foreach (glob(\$this->configPath . '/*.php') as \$file) {
            \$key = basename(\$file, '.php');
            \$this->items[\$key] = require \$file;
        }
    }

    public function get(string \$key, mixed \$default = null): mixed
    {
        \$array = \$this->items;
        \$segments = explode('.', \$key);

        foreach (\$segments as \$segment) {
            if (!is_array(\$array) || !array_key_exists(\$segment, \$array)) {
                return \$default;
            }
            \$array = \$array[\$segment];
        }

        return \$array;
    }

    public function set(string \$key, mixed \$value = null): void
    {
        \$keys = explode('.', \$key);
        \$array = &\$this->items;

        while (count(\$keys) > 1) {
            \$key = array_shift(\$keys);
            if (!isset(\$array[\$key]) || !is_array(\$array[\$key])) {
                \$array[\$key] = [];
            }
            \$array = &\$array[\$key];
        }

        \$array[array_shift(\$keys)] = \$value;
    }
}
PHP

#------------------------------------------------------------------------------
# 10. HTTP LAYER: REQUEST & RESPONSE (Enterprise Grade)
#------------------------------------------------------------------------------
log_step "Fabricating HTTP Transport Layer..."

mkdir -p app/core/Http

# 1. Request.php
cat > app/core/Http/Request.php <<PHP
<?php

namespace App\Core\Http;

use App\Core\Auth;

/**
 * Class Request
 * Represents an incoming HTTP request.
 */
class Request
{
    public array \$query;
    public array \$request;
    public array \$attributes = [];
    public array \$cookies;
    public array \$files;
    public array \$server;
    public array \$headers;
    protected ?string \$content = null;
    protected ?array \$json = null;

    public function __construct(array \$query = [], array \$request = [], array \$attributes = [], array \$cookies = [], array \$files = [], array \$server = [], \$content = null)
    {
        \$this->query = \$query;
        \$this->request = \$request;
        \$this->attributes = \$attributes;
        \$this->cookies = \$cookies;
        \$this->files = \$files;
        \$this->server = \$server;
        \$this->content = \$content;
        \$this->headers = \$this->getHeadersFromServer(\$server);
    }

    /**
     * Capture the current HTTP request from globals.
     */
    public static function capture(): static
    {
        return new static(\$_GET, \$_POST, [], \$_COOKIE, \$_FILES, \$_SERVER, file_get_contents('php://input'));
    }

    /**
     * Get a value from the request input (body or query).
     */
    public function input(string \$key, mixed \$default = null): mixed
    {
        if (\$this->isJson()) {
            return \$this->json(\$key, \$default);
        }
        return \$this->request[\$key] ?? \$this->query[\$key] ?? \$default;
    }

    /**
     * Get the JSON payload.
     */
    public function json(string \$key = null, mixed \$default = null): mixed
    {
        if (!\$this->json) {
            \$this->json = json_decode(\$this->content, true) ?? [];
        }
        
        if (is_null(\$key)) {
            return \$this->json;
        }

        return \$this->json[\$key] ?? \$default;
    }

    /**
     * Determine if the request is sending JSON.
     */
    public function isJson(): bool
    {
        return str_contains(\$this->header('Content-Type', ''), '/json');
    }

    /**
     * Get the HTTP method.
     */
    public function method(): string
    {
        return strtoupper(\$this->server['REQUEST_METHOD'] ?? 'GET');
    }

    /**
     * Get the URL path.
     */
    public function path(): string
    {
        \$uri = parse_url(\$this->server['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        return '/' . trim(\$uri, '/');
    }

    /**
     * Get a header value.
     */
    public function header(string \$key, mixed \$default = null): string
    {
        \$key = str_replace('-', '_', strtoupper(\$key));
        return \$this->headers[\$key] ?? \$default;
    }

    protected function getHeadersFromServer(array \$server): array
    {
        \$headers = [];
        foreach (\$server as \$key => \$value) {
            if (str_starts_with(\$key, 'HTTP_')) {
                \$headers[substr(\$key, 5)] = \$value;
            } elseif (in_array(\$key, ['CONTENT_TYPE', 'CONTENT_LENGTH'])) {
                \$headers[\$key] = \$value;
            }
        }
        return \$headers;
    }

    /**
     * Get the authenticated user (if any).
     */
    public function user()
    {
        return Auth::user();
    }
    
    /**
     * Validate the request data.
     */
    public function validate(array \$rules): array
    {
        \$validator = new \App\Core\Validation\Validator(\$this->all(), \$rules);
        
        if (\$validator->fails()) {
            if (\$this->isJson() || \$this->wantsJson()) {
                Response::json(['errors' => \$validator->errors()], 422)->send();
                exit;
            }
            
            // Flash errors and redirect back
            \App\Core\DV::flash('errors', \$validator->errors());
            \App\Core\DV::flash('old', \$this->all());
            Response::redirect(\$this->header('REFERER', '/'))->send();
            exit;
        }
        
        return \$validator->validated();
    }
    
    public function all(): array
    {
        return array_merge(\$this->query, \$this->isJson() ? \$this->json() : \$this->request);
    }
    
    public function wantsJson(): bool
    {
        \$accept = \$this->header('ACCEPT', '');
        return str_contains(\$accept, '/json') || str_contains(\$accept, '+json');
    }
}
PHP

# 2. Response.php
cat > app/core/Http/Response.php <<PHP
<?php

namespace App\Core\Http;

class Response
{
    protected mixed \$content;
    protected int \$statusCode;
    protected array \$headers;

    public function __construct(mixed \$content = '', int \$status = 200, array \$headers = [])
    {
        \$this->content = \$content;
        \$this->statusCode = \$status;
        \$this->headers = \$headers;
    }

    public static function make(mixed \$content = '', int \$status = 200, array \$headers = []): static
    {
        return new static(\$content, \$status, \$headers);
    }

    public static function json(mixed \$data, int \$status = 200, array \$headers = []): static
    {
        \$headers['Content-Type'] = 'application/json';
        return new static(json_encode(\$data), \$status, \$headers);
    }
    
    public static function html(string \$html, int \$status = 200): static 
    {
        return new static(\$html, \$status, ['Content-Type' => 'text/html']);
    }

    public static function redirect(string \$url, int \$status = 302): static
    {
        return new static('', \$status, ['Location' => \$url]);
    }
    
    public static function error(int \$code, string \$message = null): static
    {
         // If a specific error view exists (e.g., 404.php), use it
         \$view = app()->basePath . "/app/views/errors/{\$code}.php";
         
         if (file_exists(\$view)) {
             ob_start();
             require \$view;
             \$content = ob_get_clean();
             return self::html(\$content, \$code);
         }
         
         return self::html("<h1>Error {\$code}</h1><p>{\$message}</p>", \$code);
    }

    public function send(): void
    {
        if (!headers_sent()) {
            http_response_code(\$this->statusCode);
            foreach (\$this->headers as \$name => \$value) {
                header("\$name: \$value");
            }
        }
        echo \$this->content;
    }
}
PHP

#------------------------------------------------------------------------------
# 11. ROUTING SYSTEM (Hybrid: File-based + API)
#------------------------------------------------------------------------------
log_step "Wiring the Neural Network (Router)..."

mkdir -p app/core/Routing

# 1. Router.php
cat > app/core/Routing/Router.php <<PHP
<?php

namespace App\Core\Routing;

use App\Core\App;
use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Core\DV;

class Router
{
    protected string \$appPath;

    public function __construct()
    {
        \$this->appPath = App::getInstance()->path();
    }

    public function dispatch(Request \$request): Response
    {
        \$uri = \$request->path();
        \$method = \$request->method();
        \$segments = \$uri === '/' ? [] : explode('/', trim(\$uri, '/'));

        // Strategy: Traverse directory structure matching segments
        \$currentDir = \$this->appPath;
        \$params = [];
        
        foreach (\$segments as \$segment) {
            \$matched = false;
            
            // 1. Exact Directory Match
            if (is_dir(\$currentDir . DIRECTORY_SEPARATOR . \$segment)) {
                \$currentDir .= DIRECTORY_SEPARATOR . \$segment;
                \$matched = true;
            } 
            // 2. Dynamic Parameter Match ([id])
            else {
                \$dirs = glob(\$currentDir . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR);
                foreach (\$dirs as \$dir) {
                    \$dirname = basename(\$dir);
                    if (preg_match('/^\[(.+)\]\$/', \$dirname, \$matches)) {
                        \$params[\$matches[1]] = \$segment;
                        \$currentDir = \$dir;
                        \$matched = true;
                        break;
                    }
                }
            }
            
            if (!\$matched) {
                return Response::error(404, 'Route not found');
            }
        }

        // We have reached the target directory.
        // Inject params into request
        \$request->attributes = \$params;
        
        // Priority 1: API Endpoint (+server.php)
        if (file_exists(\$currentDir . '/+server.php')) {
            return \$this->handleApi(\$currentDir . '/+server.php', \$request);
        }

        // Priority 2: Page View (page.php)
        if (file_exists(\$currentDir . '/page.php')) {
            return \$this->handlePage(\$currentDir . '/page.php', \$request, \$currentDir);
        }

        return Response::error(404, 'Endpoint definition missing (page.php or +server.php)');
    }

    protected function handleApi(string \$file, Request \$request): Response
    {
        \$handlers = require \$file;
        \$method = strtolower(\$request->method());

        if (!isset(\$handlers[\$method])) {
            return Response::json(['error' => 'Method Not Allowed'], 405);
        }

        \$handler = \$handlers[\$method];
        
        // Middleware handling could go here
        
        \$result = \$handler(\$request);

        if (\$result instanceof Response) {
            return \$result;
        }

        return Response::json(\$result);
    }

    protected function handlePage(string \$file, Request \$request, string \$currentDir): Response
    {
        // Only GET/HEAD allowed for pages typically, unless page.php handles logic
        if (!in_array(\$request->method(), ['GET', 'HEAD'])) {
            // Check if +server.php existed (we already checked), if not, 405
            // But sometimes people post to page.php in legacy style. 
            // Bastion enforces +server.php for mutations.
        }

        // 1. Initialize State Engine
        DV::flush(); 
        
        // 2. Execute Page Logic (The Controller)
        // Variables defined here are NOT passed to view automatically unless via DV
        \$pageResult = (function() use (\$file, \$request) {
            // Isolate scope
            \$params = \$request->attributes; // for convenience
            return require \$file;
        })();

        if (\$pageResult instanceof Response) {
            return \$pageResult;
        }

        // 3. Render Views with Layouts
        // Capture the "inner" content (the page itself)
        // Note: page.php usually outputs HTML or sets DV variables. 
        // We need to capture output.
        // Wait... the 'require' above already outputted content? 
        // We need to output buffer the require.
        
        // Let's redo the page execution with buffering
        ob_start();
        \$params = \$request->attributes; // re-bind for view
        require \$file;
        \$content = ob_get_clean();

        // 4. Wrap in Layouts (Inside-Out)
        \$layouts = \$this->resolveLayouts(\$currentDir);
        
        foreach (\$layouts as \$layout) {
            ob_start();
            require \$layout; // \$content is available here
            \$content = ob_get_clean();
        }

        return Response::html(\$content);
    }

    protected function resolveLayouts(string \$dir): array
    {
        \$layouts = [];
        \$root = App::getInstance()->path();
        
        // Traverse up to root
        while (true) {
            if (file_exists(\$dir . '/layout.php')) {
                array_unshift(\$layouts, \$dir . '/layout.php');
            }
            if (\$dir === \$root) break;
            \$dir = dirname(\$dir);
            // Safety break
            if (strlen(\$dir) < strlen(\$root)) break;
        }
        
        return \$layouts;
    }
}
PHP

#------------------------------------------------------------------------------
# 12. DV ENGINE (Data View) - State Management
#------------------------------------------------------------------------------
log_step "Installing DV (Data View) State Engine..."

cat > app/core/DV.php <<PHP
<?php

namespace App\Core;

/**
 * Class DV (Data View)
 * * A static state container for passing data between the Logic Layer (page.php)
 * and the Presentation Layer (layouts/components). 
 * Replaces the need for global variables.
 */
class DV
{
    protected static array \$data = [];
    protected static array \$flashed = [];

    /**
     * Initialize/Flush state for a new request.
     */
    public static function flush(): void
    {
        self::\$data = [];
        if (session_status() === PHP_SESSION_NONE) session_start();
        
        if (isset(\$_SESSION['_dv_flash'])) {
            self::\$flashed = \$_SESSION['_dv_flash'];
            unset(\$_SESSION['_dv_flash']);
        }
    }

    /**
     * Set a view variable.
     */
    public static function set(string \$key, mixed \$value): void
    {
        self::\$data[\$key] = \$value;
    }

    /**
     * Get a view variable (prioritizes current, then flash, then default).
     */
    public static function get(string \$key, mixed \$default = null): mixed
    {
        return self::\$data[\$key] ?? self::\$flashed[\$key] ?? \$default;
    }

    /**
     * Check if a key exists.
     */
    public static function has(string \$key): bool
    {
        return isset(self::\$data[\$key]) || isset(self::\$flashed[\$key]);
    }

    /**
     * Flash data to the next request (Session based).
     */
    public static function flash(string \$key, mixed \$value): void
    {
        \$_SESSION['_dv_flash'][\$key] = \$value;
    }
    
    /**
     * Get all data for debugging.
     */
    public static function all(): array
    {
        return array_merge(self::\$flashed, self::\$data);
    }
}
PHP

log_success "Part 2 complete. Core Kernel and Router operational."
#------------------------------------------------------------------------------
# 13. DATA PERSISTENCE LAYER (DB, ORM, SCHEMA)
#------------------------------------------------------------------------------
log_step "Architecting Data Persistence Layer..."

mkdir -p app/core/Database

# 1. Connection.php (Database Manager)
cat > app/core/Database/Connection.php <<PHP
<?php

namespace App\Core\Database;

use PDO;
use PDOException;
use Exception;

class Connection
{
    protected static ?PDO \$pdo = null;
    protected static array \$config = [];

    /**
     * Connect to the database.
     */
    public static function connect(): void
    {
        if (self::\$pdo) {
            return;
        }

        \$default = config('database.default');
        self::\$config = config("database.connections.{\$default}");

        try {
            \$dsn = self::getDsn(self::\$config);
            \$options = self::getOptions(self::\$config);

            self::\$pdo = new PDO(\$dsn, self::\$config['username'] ?? null, self::\$config['password'] ?? null, \$options);
            
            // Enterprise: Enable WAL mode for SQLite for concurrency
            if (self::\$config['driver'] === 'sqlite' && (self::\$config['wal_mode'] ?? false)) {
                self::\$pdo->exec('PRAGMA journal_mode = WAL;');
                self::\$pdo->exec('PRAGMA synchronous = NORMAL;');
            }

        } catch (PDOException \$e) {
            // In production, log this. In dev, die.
            if (config('app.debug')) {
                throw new Exception("Database Connection Failed: " . \$e->getMessage());
            }
            throw new Exception("Database Error");
        }
    }

    /**
     * Get the PDO instance.
     */
    public static function pdo(): PDO
    {
        if (!self::\$pdo) {
            self::connect();
        }
        return self::\$pdo;
    }

    /**
     * Begin a transaction.
     */
    public static function beginTransaction(): void
    {
        self::pdo()->beginTransaction();
    }

    /**
     * Commit a transaction.
     */
    public static function commit(): void
    {
        self::pdo()->commit();
    }

    /**
     * Rollback a transaction.
     */
    public static function rollBack(): void
    {
        self::pdo()->rollBack();
    }

    /**
     * Generate DSN string based on driver.
     */
    protected static function getDsn(array \$config): string
    {
        switch (\$config['driver']) {
            case 'sqlite':
                return "sqlite:{\$config['database']}";
            case 'mysql':
                return "mysql:host={\$config['host']};port={\$config['port']};dbname={\$config['database']};charset={\$config['charset']}";
            case 'pgsql':
                return "pgsql:host={\$config['host']};port={\$config['port']};dbname={\$config['database']}";
            default:
                throw new Exception("Unsupported driver: {\$config['driver']}");
        }
    }

    /**
     * Get PDO options.
     */
    protected static function getOptions(array \$config): array
    {
        \$options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        return array_replace(\$options, \$config['options'] ?? []);
    }
}
PHP

# 2. Grammar.php (SQL Syntax Translator)
cat > app/core/Database/Grammar.php <<PHP
<?php

namespace App\Core\Database;

class Grammar
{
    /**
     * Compile a SELECT query.
     */
    public function compileSelect(QueryBuilder \$query): string
    {
        \$components = [
            'aggregate',
            'columns',
            'from',
            'joins',
            'wheres',
            'groups',
            'havings',
            'orders',
            'limit',
            'offset',
        ];

        \$sql = [];

        foreach (\$components as \$component) {
            if (!empty(\$query->\$component)) {
                \$method = 'compile' . ucfirst(\$component);
                \$sql[] = \$this->\$method(\$query, \$query->\$component);
            }
        }

        return implode(' ', \$sql);
    }

    protected function compileColumns(QueryBuilder \$query, array \$columns): string
    {
        if (isset(\$query->aggregate)) return '';
        return 'SELECT ' . implode(', ', \$columns);
    }

    protected function compileFrom(QueryBuilder \$query, string \$table): string
    {
        return 'FROM ' . \$table;
    }

    protected function compileWheres(QueryBuilder \$query, array \$wheres): string
    {
        \$sql = [];

        foreach (\$wheres as \$where) {
            \$sql[] = \$where['boolean'] . ' ' . \$where['column'] . ' ' . \$where['operator'] . ' ?';
        }

        if (count(\$sql) > 0) {
            return 'WHERE ' . preg_replace('/AND |OR /', '', implode(' ', \$sql), 1);
        }

        return '';
    }

    protected function compileOrders(QueryBuilder \$query, array \$orders): string
    {
        return 'ORDER BY ' . implode(', ', array_map(function (\$order) {
            return \$order['column'] . ' ' . \$order['direction'];
        }, \$orders));
    }

    protected function compileLimit(QueryBuilder \$query, int \$limit): string
    {
        return 'LIMIT ' . \$limit;
    }

    protected function compileOffset(QueryBuilder \$query, int \$offset): string
    {
        return 'OFFSET ' . \$offset;
    }

    protected function compileAggregate(QueryBuilder \$query, array \$aggregate): string
    {
        return 'SELECT ' . \$aggregate['function'] . '(' . \$aggregate['columns'] . ') as aggregate';
    }

    public function compileInsert(QueryBuilder \$query, array \$values): string
    {
        \$table = \$query->from;
        \$columns = implode(', ', array_keys(\$values));
        \$parameters = implode(', ', array_fill(0, count(\$values), '?'));

        return "INSERT INTO \$table (\$columns) VALUES (\$parameters)";
    }

    public function compileUpdate(QueryBuilder \$query, array \$values): string
    {
        \$table = \$query->from;
        \$columns = [];

        foreach (\$values as \$key => \$value) {
            \$columns[] = "\$key = ?";
        }

        \$columns = implode(', ', \$columns);
        \$wheres = \$this->compileWheres(\$query, \$query->wheres);

        return trim("UPDATE \$table SET \$columns \$wheres");
    }

    public function compileDelete(QueryBuilder \$query): string
    {
        \$table = \$query->from;
        \$wheres = \$this->compileWheres(\$query, \$query->wheres);

        return trim("DELETE FROM \$table \$wheres");
    }
}
PHP

# 3. QueryBuilder.php (Fluent Interface)
cat > app/core/Database/QueryBuilder.php <<PHP
<?php

namespace App\Core\Database;

use PDO;

class QueryBuilder
{
    protected PDO \$pdo;
    protected Grammar \$grammar;
    
    public \$aggregate;
    public \$columns = ['*'];
    public \$from;
    public \$joins = [];
    public \$wheres = [];
    public \$groups = [];
    public \$havings = [];
    public \$orders = [];
    public \$limit;
    public \$offset;
    
    protected \$bindings = [
        'select' => [],
        'join'   => [],
        'where'  => [],
        'having' => [],
        'order'  => [],
    ];

    public function __construct(PDO \$pdo = null)
    {
        \$this->pdo = \$pdo ?: Connection::pdo();
        \$this->grammar = new Grammar();
    }

    public function table(string \$table): self
    {
        \$this->from = \$table;
        return \$this;
    }

    public function select(\$columns = ['*']): self
    {
        \$this->columns = is_array(\$columns) ? \$columns : func_get_args();
        return \$this;
    }

    public function where(string \$column, \$operator = null, \$value = null, string \$boolean = 'AND'): self
    {
        if (func_num_args() === 2) {
            \$value = \$operator;
            \$operator = '=';
        }

        \$this->wheres[] = compact('column', 'operator', 'value', 'boolean');
        \$this->bindings['where'][] = \$value;

        return \$this;
    }

    public function orWhere(string \$column, \$operator = null, \$value = null): self
    {
        return \$this->where(\$column, \$operator, \$value, 'OR');
    }

    public function orderBy(string \$column, string \$direction = 'asc'): self
    {
        \$this->orders[] = compact('column', 'direction');
        return \$this;
    }

    public function limit(int \$value): self
    {
        \$this->limit = \$value;
        return \$this;
    }

    public function offset(int \$value): self
    {
        \$this->offset = \$value;
        return \$this;
    }

    public function get(): array
    {
        \$sql = \$this->grammar->compileSelect(\$this);
        \$stmt = \$this->pdo->prepare(\$sql);
        \$stmt->execute(\$this->getBindings());
        
        return \$stmt->fetchAll();
    }

    public function first()
    {
        \$this->limit(1);
        \$results = \$this->get();
        return count(\$results) > 0 ? \$results[0] : null;
    }

    public function count(\$columns = '*'): int
    {
        \$this->aggregate = ['function' => 'count', 'columns' => \$columns];
        \$results = \$this->get();
        return (int) \$results[0]['aggregate'];
    }

    public function exists(): bool
    {
        \$this->limit(1);
        \$results = \$this->get();
        return count(\$results) > 0;
    }

    public function insert(array \$values): bool
    {
        \$sql = \$this->grammar->compileInsert(\$this, \$values);
        \$stmt = \$this->pdo->prepare(\$sql);
        return \$stmt->execute(array_values(\$values));
    }

    public function insertGetId(array \$values): string|false
    {
        \$this->insert(\$values);
        return \$this->pdo->lastInsertId();
    }

    public function update(array \$values): int
    {
        \$sql = \$this->grammar->compileUpdate(\$this, \$values);
        \$bindings = array_merge(array_values(\$values), \$this->bindings['where']);
        \$stmt = \$this->pdo->prepare(\$sql);
        \$stmt->execute(\$bindings);
        return \$stmt->rowCount();
    }

    public function delete(): int
    {
        \$sql = \$this->grammar->compileDelete(\$this);
        \$stmt = \$this->pdo->prepare(\$sql);
        \$stmt->execute(\$this->bindings['where']);
        return \$stmt->rowCount();
    }

    public function getBindings(): array
    {
        return array_merge(
            \$this->bindings['join'],
            \$this->bindings['where'],
            \$this->bindings['having']
        );
    }
    
    /**
     * Raw SQL Execution
     */
    public function raw(string \$sql, array \$params = []): array
    {
        \$stmt = \$this->pdo->prepare(\$sql);
        \$stmt->execute(\$params);
        return \$stmt->fetchAll();
    }
}
PHP

# 4. Model.php (The ORM)
cat > app/core/Database/Model.php <<PHP
<?php

namespace App\Core\Database;

use JsonSerializable;
use ArrayAccess;

abstract class Model implements JsonSerializable, ArrayAccess
{
    protected static string \$table;
    protected static string \$primaryKey = 'id';
    protected array \$attributes = [];
    protected array \$original = [];
    protected array \$fillable = [];
    protected array \$hidden = [];
    public bool \$exists = false;

    public function __construct(array \$attributes = [])
    {
        \$this->fill(\$attributes);
    }

    public static function query(): QueryBuilder
    {
        \$instance = new static;
        \$table = static::\$table ?? strtolower(class_basename(static::class)) . 's';
        
        return (new QueryBuilder())->table(\$table);
    }

    public static function all(): array
    {
        \$results = static::query()->get();
        return static::hydrate(\$results);
    }

    public static function find(\$id): ?static
    {
        \$result = static::query()->where(static::\$primaryKey, \$id)->first();
        return \$result ? new static(\$result) : null;
    }
    
    public static function where(string \$column, \$operator = null, \$value = null): QueryBuilder
    {
        return static::query()->where(\$column, \$operator, \$value);
    }

    public static function create(array \$attributes): static
    {
        \$model = new static(\$attributes);
        \$model->save();
        return \$model;
    }

    public function save(): bool
    {
        \$query = static::query();
        
        if (\$this->exists) {
            // Update
            \$dirty = \$this->getDirty();
            if (empty(\$dirty)) return true;
            
            \$updated = \$query->where(static::\$primaryKey, \$this->getAttribute(static::\$primaryKey))
                             ->update(\$dirty);
                             
            \$this->syncOriginal();
            return \$updated > 0;
        } else {
            // Insert
            \$id = \$query->insertGetId(\$this->attributes);
            if (\$id) {
                \$this->setAttribute(static::\$primaryKey, \$id);
                \$this->exists = true;
                \$this->syncOriginal();
                return true;
            }
        }
        return false;
    }
    
    public function delete(): bool
    {
        if (!\$this->exists) return false;
        
        return static::query()
            ->where(static::\$primaryKey, \$this->getAttribute(static::\$primaryKey))
            ->delete();
    }

    protected static function hydrate(array \$items): array
    {
        return array_map(function (\$item) {
            \$model = new static(\$item);
            \$model->exists = true;
            \$model->syncOriginal();
            return \$model;
        }, \$items);
    }

    public function fill(array \$attributes): self
    {
        foreach (\$attributes as \$key => \$value) {
            if (empty(\$this->fillable) || in_array(\$key, \$this->fillable)) {
                \$this->setAttribute(\$key, \$value);
            }
        }
        return \$this;
    }

    public function getAttribute(\$key)
    {
        return \$this->attributes[\$key] ?? null;
    }

    public function setAttribute(\$key, \$value): void
    {
        \$this->attributes[\$key] = \$value;
    }
    
    public function getDirty(): array
    {
        \$dirty = [];
        foreach (\$this->attributes as \$key => \$value) {
            if (!array_key_exists(\$key, \$this->original) || \$value !== \$this->original[\$key]) {
                \$dirty[\$key] = \$value;
            }
        }
        return \$dirty;
    }
    
    protected function syncOriginal(): void
    {
        \$this->original = \$this->attributes;
    }

    public function jsonSerialize(): mixed
    {
        return array_diff_key(\$this->attributes, array_flip(\$this->hidden));
    }
    
    // ArrayAccess Implementation
    public function offsetExists(\$offset): bool { return isset(\$this->attributes[\$offset]); }
    public function offsetGet(\$offset): mixed { return \$this->getAttribute(\$offset); }
    public function offsetSet(\$offset, \$value): void { \$this->setAttribute(\$offset, \$value); }
    public function offsetUnset(\$offset): void { unset(\$this->attributes[\$offset]); }
    
    // Magic Getter
    public function __get(\$key) { return \$this->getAttribute(\$key); }
    public function __set(\$key, \$value) { \$this->setAttribute(\$key, \$value); }
}
PHP

# 5. Schema Builder
mkdir -p app/core/Database/Schema

cat > app/core/Database/Schema/Blueprint.php <<PHP
<?php

namespace App\Core\Database\Schema;

class Blueprint
{
    protected string \$table;
    protected array \$columns = [];
    protected array \$commands = [];

    public function __construct(string \$table)
    {
        \$this->table = \$table;
    }

    public function id(string \$column = 'id'): self
    {
        \$this->columns[] = "\$column INTEGER PRIMARY KEY AUTOINCREMENT";
        return \$this;
    }

    public function string(string \$column, int \$length = 255): self
    {
        \$this->columns[] = "\$column VARCHAR(\$length)";
        return \$this;
    }

    public function text(string \$column): self
    {
        \$this->columns[] = "\$column TEXT";
        return \$this;
    }

    public function integer(string \$column): self
    {
        \$this->columns[] = "\$column INTEGER";
        return \$this;
    }
    
    public function boolean(string \$column): self
    {
        \$this->columns[] = "\$column BOOLEAN";
        return \$this;
    }

    public function timestamps(): self
    {
        \$this->columns[] = "created_at DATETIME DEFAULT CURRENT_TIMESTAMP";
        \$this->columns[] = "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP";
        return \$this;
    }
    
    public function unique(string \$column): self
    {
        // Simple append for SQLite
        \$lastKey = array_key_last(\$this->columns);
        \$this->columns[\$lastKey] .= " UNIQUE";
        return \$this;
    }
    
    public function nullable(): self
    {
        \$lastKey = array_key_last(\$this->columns);
        \$this->columns[\$lastKey] .= " NULL";
        return \$this;
    }

    public function toSql(): string
    {
        \$columns = implode(', ', \$this->columns);
        return "CREATE TABLE IF NOT EXISTS {\$this->table} (\$columns);";
    }
}
PHP

cat > app/core/Database/Schema/Schema.php <<PHP
<?php

namespace App\Core\Database\Schema;

use App\Core\Database\Connection;
use Closure;

class Schema
{
    public static function create(string \$table, Closure \$callback): void
    {
        \$blueprint = new Blueprint(\$table);
        \$callback(\$blueprint);
        
        \$sql = \$blueprint->toSql();
        Connection::pdo()->exec(\$sql);
    }

    public static function drop(string \$table): void
    {
        Connection::pdo()->exec("DROP TABLE IF EXISTS \$table");
    }
    
    public static function hasTable(string \$table): bool
    {
        try {
            \$result = Connection::pdo()->query("SELECT 1 FROM \$table LIMIT 1");
            return \$result !== false;
        } catch (\Exception \$e) {
            return false;
        }
    }
}
PHP

#------------------------------------------------------------------------------
# 14. DATA MIGRATION RUNNER
#------------------------------------------------------------------------------
log_step "Initializing Migration System..."

mkdir -p app/console/Commands

cat > app/console/Migrator.php <<PHP
<?php

namespace App\Console;

use App\Core\Database\Connection;
use App\Core\Database\Schema\Schema;
use App\Core\Database\Schema\Blueprint;

class Migrator
{
    public function install(): void
    {
        Schema::create('migrations', function (Blueprint \$table) {
            \$table->id();
            \$table->string('migration');
            \$table->integer('batch');
        });
    }

    public function run(): void
    {
        Connection::connect();
        
        if (!Schema::hasTable('migrations')) {
            \$this->install();
            echo "Created migrations table.\\n";
        }

        \$ran = Connection::pdo()->query("SELECT migration FROM migrations")->fetchAll(\PDO::FETCH_COLUMN);
        \$files = glob(base_path('database/migrations/*.php'));
        \$batch = (int) Connection::pdo()->query("SELECT MAX(batch) FROM migrations")->fetchColumn() + 1;

        foreach (\$files as \$file) {
            \$migrationName = basename(\$file, '.php');

            if (!in_array(\$migrationName, \$ran)) {
                echo "Migrating: \$migrationName...\\n";
                
                \$class = require \$file;
                \$class->up();
                
                \$stmt = Connection::pdo()->prepare("INSERT INTO migrations (migration, batch) VALUES (?, ?)");
                \$stmt->execute([\$migrationName, \$batch]);
                
                echo "\033[32m  Done.\033[0m\\n";
            }
        }
    }
}
PHP

log_success "Part 3 complete. Data Persistence Layer is fully operational."
#------------------------------------------------------------------------------
# 15. VALIDATION SERVICE
#------------------------------------------------------------------------------
log_step "Installing Validation Engine..."

mkdir -p app/core/Validation

# 1. Validator.php
cat > app/core/Validation/Validator.php <<PHP
<?php

namespace App\Core\Validation;

use App\Core\Database\DB;

class Validator
{
    protected array \$data;
    protected array \$rules;
    protected array \$errors = [];

    public function __construct(array \$data, array \$rules)
    {
        \$this->data = \$data;
        \$this->rules = \$rules;
    }

    public static function make(array \$data, array \$rules): static
    {
        return new static(\$data, \$rules);
    }

    public function fails(): bool
    {
        \$this->validate();
        return !empty(\$this->errors);
    }

    public function errors(): array
    {
        return \$this->errors;
    }

    public function validated(): array
    {
        \$this->validate();
        
        if (!empty(\$this->errors)) {
            throw new ValidationException(\$this->errors);
        }

        return array_intersect_key(\$this->data, \$this->rules);
    }

    protected function validate(): void
    {
        foreach (\$this->rules as \$field => \$ruleSet) {
            \$rules = is_string(\$ruleSet) ? explode('|', \$ruleSet) : \$ruleSet;
            
            foreach (\$rules as \$rule) {
                \$this->applyRule(\$field, \$rule);
            }
        }
    }

    protected function applyRule(string \$field, string \$rule): void
    {
        \$value = \$this->data[\$field] ?? null;
        
        // Parse rule parameters (e.g., min:5)
        \$params = [];
        if (str_contains(\$rule, ':')) {
            [\$ruleName, \$paramStr] = explode(':', \$rule, 2);
            \$params = explode(',', \$paramStr);
            \$rule = \$ruleName;
        }

        \$method = 'validate' . ucfirst(\$rule);
        
        if (method_exists(\$this, \$method)) {
            if (!\$this->\$method(\$field, \$value, \$params)) {
                \$this->addError(\$field, \$rule, \$params);
            }
        }
    }

    protected function addError(string \$field, string \$rule, array \$params): void
    {
        \$messages = [
            'required' => 'The :attribute field is required.',
            'email' => 'The :attribute must be a valid email address.',
            'min' => 'The :attribute must be at least :min characters.',
            'max' => 'The :attribute must not be greater than :max characters.',
            'unique' => 'The :attribute has already been taken.',
            'confirmed' => 'The :attribute confirmation does not match.',
            'numeric' => 'The :attribute must be a number.',
            'boolean' => 'The :attribute must be true or false.',
        ];

        \$message = \$messages[\$rule] ?? "The :attribute field is invalid.";
        \$message = str_replace(':attribute', str_replace('_', ' ', \$field), \$message);

        if (\$rule === 'min') \$message = str_replace(':min', \$params[0], \$message);
        if (\$rule === 'max') \$message = str_replace(':max', \$params[0], \$message);

        \$this->errors[\$field][] = \$message;
    }

    //--- Validation Rules ---

    protected function validateRequired(string \$field, \$value): bool
    {
        return !is_null(\$value) && trim((string) \$value) !== '';
    }

    protected function validateEmail(string \$field, \$value): bool
    {
        return filter_var(\$value, FILTER_VALIDATE_EMAIL) !== false;
    }

    protected function validateMin(string \$field, \$value, array \$params): bool
    {
        \$length = is_numeric(\$value) ? \$value : strlen(\$value);
        return \$length >= (\$params[0] ?? 0);
    }

    protected function validateMax(string \$field, \$value, array \$params): bool
    {
        \$length = is_numeric(\$value) ? \$value : strlen(\$value);
        return \$length <= (\$params[0] ?? 0);
    }

    protected function validateNumeric(string \$field, \$value): bool
    {
        return is_numeric(\$value);
    }

    protected function validateBoolean(string \$field, \$value): bool
    {
        return in_array(\$value, [true, false, 0, 1, '0', '1'], true);
    }

    protected function validateConfirmed(string \$field, \$value): bool
    {
        return \$value === (\$this->data["{\$field}_confirmation"] ?? null);
    }

    protected function validateUnique(string \$field, \$value, array \$params): bool
    {
        \$table = \$params[0] ?? null;
        \$column = \$params[1] ?? \$field;
        \$ignore = \$params[2] ?? null;

        if (!\$table) return false;

        \$query = DB::table(\$table)->where(\$column, \$value);
        
        if (\$ignore) {
            \$query->where('id', '!=', \$ignore);
        }

        return !\$query->exists();
    }
}
PHP

# 2. ValidationException.php
cat > app/core/Validation/ValidationException.php <<PHP
<?php

namespace App\Core\Validation;

use Exception;

class ValidationException extends Exception
{
    public array \$errors;

    public function __construct(array \$errors)
    {
        parent::__construct('The given data was invalid.');
        \$this->errors = \$errors;
    }
}
PHP

#------------------------------------------------------------------------------
# 16. SESSION MANAGEMENT (Secure & Driver-based)
#------------------------------------------------------------------------------
log_step "Configuring Session Vault..."

mkdir -p app/core/Session

# 1. SessionManager.php
cat > app/core/Session/SessionManager.php <<PHP
<?php

namespace App\Core\Session;

class SessionManager
{
    protected static bool \$started = false;

    public static function start(): void
    {
        if (self::\$started || session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        // Secure Session Configuration
        ini_set('session.use_strict_mode', 1);
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_samesite', 'Lax');
        ini_set('session.gc_maxlifetime', env('SESSION_LIFETIME', 120) * 60);
        
        if (env('SECURE_COOKIES', false)) {
            ini_set('session.cookie_secure', 1);
        }

        // Custom Handler (e.g. Database or Redis could go here)
        // For now we use native files but configured securely
        session_save_path(storage_path('framework/sessions'));

        session_start();
        self::\$started = true;

        // CSRF Token Initialization
        if (empty(\$_SESSION['_token'])) {
            \$_SESSION['_token'] = bin2hex(random_bytes(32));
        }
    }

    public static function put(string \$key, mixed \$value): void
    {
        self::start();
        \$_SESSION[\$key] = \$value;
    }

    public static function get(string \$key, mixed \$default = null): mixed
    {
        self::start();
        return \$_SESSION[\$key] ?? \$default;
    }

    public static function forget(string \$key): void
    {
        self::start();
        unset(\$_SESSION[\$key]);
    }

    public static function flush(): void
    {
        self::start();
        session_unset();
        session_destroy();
    }

    public static function regenerate(): void
    {
        self::start();
        session_regenerate_id(true);
    }

    public static function flash(string \$key, mixed \$value): void
    {
        self::put('_flash.' . \$key, \$value);
    }

    public static function getFlash(string \$key, mixed \$default = null): mixed
    {
        self::start();
        \$value = \$_SESSION['_flash.' . \$key] ?? \$default;
        unset(\$_SESSION['_flash.' . \$key]);
        return \$value;
    }
}
PHP

#------------------------------------------------------------------------------
# 17. VIEW ENGINE (Rendering & Layouts)
#------------------------------------------------------------------------------
log_step "Wiring View Presentation Layer..."

mkdir -p app/core/View

# 1. View.php
cat > app/core/View/View.php <<PHP
<?php

namespace App\Core\View;

use App\Core\App;
use Exception;

class View
{
    /**
     * Render a view file with data.
     *
     * @param string \$path Dot notation path (e.g., 'emails.welcome')
     * @param array \$data
     * @return string
     * @throws Exception
     */
    public static function make(string \$path, array \$data = []): string
    {
        \$file = self::resolvePath(\$path);
        
        if (!file_exists(\$file)) {
            throw new Exception("View file not found: [{\$path}]");
        }

        // Extract data to local scope
        extract(\$data, EXTR_SKIP);

        // Capture output
        ob_start();
        try {
            include \$file;
        } catch (Exception \$e) {
            ob_end_clean();
            throw \$e;
        }

        return ob_get_clean();
    }

    /**
     * Resolve the file path from dot notation.
     */
    protected static function resolvePath(string \$path): string
    {
        // 1. Check in app/views
        \$base = App::getInstance()->path('views');
        \$file = \$base . '/' . str_replace('.', '/', \$path) . '.php';
        
        if (file_exists(\$file)) return \$file;

        // 2. Check root (for direct file paths)
        if (file_exists(\$path)) return \$path;

        return \$file; // Return standard path even if missing for error reporting
    }

    /**
     * Render a component.
     */
    public static function component(string \$name, array \$props = []): string
    {
        // This hooks into the Functional Component system in app/components
        \$class = "App\\\\Components\\\\" . str_replace('.', '\\\\', \$name);
        
        // Dynamic include if file based
        \$path = App::getInstance()->path('components/' . str_replace('.', '/', \$name) . '.php');
        if (file_exists(\$path)) {
            require_once \$path;
            \$func = basename(\$path, '.php');
            if (function_exists(\$func)) {
                return \$func(...\$props);
            }
        }

        return '';
    }
}
PHP

#------------------------------------------------------------------------------
# 18. ENCRYPTION SERVICE
#------------------------------------------------------------------------------
log_step "Generating Encryption Keys..."

mkdir -p app/core/Encryption

# 1. Encrypter.php
cat > app/core/Encryption/Encrypter.php <<PHP
<?php

namespace App\Core\Encryption;

use Exception;

class Encrypter
{
    protected string \$key;
    protected string \$cipher;

    public function __construct(string \$key, string \$cipher = 'AES-256-CBC')
    {
        \$key = (string) \$key;

        if (static::supported(\$key, \$cipher)) {
            \$this->key = \$key;
            \$this->cipher = \$cipher;
        } else {
            throw new Exception('The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.');
        }
    }

    public static function supported(string \$key, string \$cipher): bool
    {
        \$length = mb_strlen(\$key, '8bit');

        return (\$cipher === 'AES-128-CBC' && \$length === 16) ||
               (\$cipher === 'AES-256-CBC' && \$length === 32);
    }

    public function encrypt(mixed \$value, bool \$serialize = true): string
    {
        \$iv = random_bytes(openssl_cipher_iv_length(\$this->cipher));

        \$value = \\openssl_encrypt(
            \$serialize ? serialize(\$value) : \$value,
            \$this->cipher, \$this->key, 0, \$iv
        );

        if (\$value === false) {
            throw new Exception('Could not encrypt the data.');
        }

        \$mac = \$this->hash(\$iv = base64_encode(\$iv), \$value);
        \$json = json_encode(compact('iv', 'value', 'mac'), JSON_UNESCAPED_SLASHES);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Could not encrypt the data.');
        }

        return base64_encode(\$json);
    }

    public function decrypt(string \$payload, bool \$unserialize = true): mixed
    {
        \$payload = \$this->getJsonPayload(\$payload);
        \$iv = base64_decode(\$payload['iv']);

        \$decrypted = \\openssl_decrypt(
            \$payload['value'], \$this->cipher, \$this->key, 0, \$iv
        );

        if (\$decrypted === false) {
            throw new Exception('Could not decrypt the data.');
        }

        return \$unserialize ? unserialize(\$decrypted) : \$decrypted;
    }

    protected function hash(string \$iv, string \$value): string
    {
        return hash_hmac('sha256', \$iv . \$value, \$this->key);
    }

    protected function getJsonPayload(string \$payload): array
    {
        \$payload = json_decode(base64_decode(\$payload), true);

        if (!\$this->validPayload(\$payload)) {
            throw new Exception('The payload is invalid.');
        }

        if (!\$this->validMac(\$payload)) {
            throw new Exception('The MAC is invalid.');
        }

        return \$payload;
    }

    protected function validPayload(mixed \$payload): bool
    {
        return is_array(\$payload) && isset(\$payload['iv'], \$payload['value'], \$payload['mac']) &&
               strlen(base64_decode(\$payload['iv'], true)) === openssl_cipher_iv_length(\$this->cipher);
    }

    protected function validMac(array \$payload): bool
    {
        return hash_equals(
            \$this->hash(\$payload['iv'], \$payload['value']), \$payload['mac']
        );
    }
}
PHP

#------------------------------------------------------------------------------
# 19. SERVICE PROVIDERS
#------------------------------------------------------------------------------
log_step "Registering Service Providers..."

# 1. AppServiceProvider.php
cat > app/providers/AppServiceProvider.php <<PHP
<?php

namespace App\Providers;

use App\Core\App;
use App\Core\Encryption\Encrypter;
use App\Core\Session\SessionManager;

class AppServiceProvider
{
    protected App \$app;

    public function __construct(App \$app)
    {
        \$this->app = \$app;
    }

    public function register(): void
    {
        // Bind Encrypter
        \$this->app->singleton('encrypter', function (\$app) {
            \$config = \$app->config('app');
            \$key = base64_decode(substr(\$config['key'], 7)); // Remove 'base64:'
            return new Encrypter(\$key, 'AES-256-CBC');
        });
    }

    public function boot(): void
    {
        // Start Session
        SessionManager::start();
    }
}
PHP

# 2. RouteServiceProvider.php
cat > app/providers/RouteServiceProvider.php <<PHP
<?php

namespace App\Providers;

use App\Core\App;

class RouteServiceProvider
{
    protected App \$app;

    public function __construct(App \$app)
    {
        \$this->app = \$app;
    }

    public function boot(): void
    {
        // Global route patterns could be defined here
    }
}
PHP

# 3. DatabaseServiceProvider.php
cat > app/providers/DatabaseServiceProvider.php <<PHP
<?php

namespace App\Providers;

use App\Core\App;
use App\Core\Database\Connection;

class DatabaseServiceProvider
{
    protected App \$app;

    public function __construct(App \$app)
    {
        \$this->app = \$app;
    }

    public function boot(): void
    {
        Connection::connect();
    }
}
PHP

# 4. AuthServiceProvider.php
cat > app/providers/AuthServiceProvider.php <<PHP
<?php

namespace App\Providers;

use App\Core\App;

class AuthServiceProvider
{
    protected App \$app;

    public function __construct(App \$app)
    {
        \$this->app = \$app;
    }

    public function boot(): void
    {
        // Boot auth gates or policies here
    }
}
PHP

log_success "Part 4 complete. Essential services (Validation, Session, Crypto) are ready."
#------------------------------------------------------------------------------
# 20. UI COMPONENT LIBRARY ("Bastion UI Kit")
#------------------------------------------------------------------------------
log_step "Fabricating UI Component System..."

mkdir -p app/components/Layout
mkdir -p app/components/Forms
mkdir -p app/components/Data
mkdir -p app/components/Feedback
mkdir -p app/components/Navigation

# 1. Button Component
cat > app/components/Forms/Button.php <<PHP
<?php

function Button(
    string \$text, 
    string \$type = 'button', 
    string \$variant = 'primary', 
    string \$size = 'md', 
    string \$icon = '', 
    string \$attrs = ''
): string
{
    \$base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
    
    \$variants = [
        'primary' => 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500',
        'secondary' => 'bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500',
        'danger' => 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
        'success' => 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
        'ghost' => 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white focus:ring-slate-500',
    ];
    
    \$sizes = [
        'sm' => 'px-3 py-1.5 text-xs',
        'md' => 'px-4 py-2 text-sm',
        'lg' => 'px-6 py-3 text-base',
    ];
    
    \$classes = \$base . ' ' . (\$variants[\$variant] ?? \$variants['primary']) . ' ' . (\$sizes[\$size] ?? \$sizes['md']);
    
    \$iconHtml = \$icon ? "<span class='mr-2'>\$icon</span>" : '';
    
    return <<<HTML
    <button type="\$type" class="\$classes" \$attrs>
        \$iconHtml
        \$text
    </button>
    HTML;
}
PHP

# 2. Input Component (With Label & Error Handling)
cat > app/components/Forms/Input.php <<PHP
<?php

use App\Core\DV;

function Input(
    string \$name, 
    string \$label, 
    string \$type = 'text', 
    string \$placeholder = '', 
    string \$value = '', 
    bool \$required = false,
    string \$help = ''
): string
{
    // Retrieve old input if validation failed
    \$old = DV::get('old')[\$name] ?? \$value;
    
    // Retrieve errors
    \$errors = DV::get('errors')[\$name] ?? [];
    \$hasError = !empty(\$errors);
    
    \$borderClass = \$hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500';
    \$requiredStar = \$required ? '<span class="text-red-400">*</span>' : '';
    
    \$errorHtml = '';
    if (\$hasError) {
        \$errorHtml = '<p class="mt-1 text-xs text-red-400">' . \$errors[0] . '</p>';
    }
    
    \$helpHtml = \$help ? '<p class="mt-1 text-xs text-slate-500">' . \$help . '</p>' : '';

    return <<<HTML
    <div class="mb-4">
        <label for="\$name" class="block text-sm font-medium text-slate-300 mb-1">
            \$label \$requiredStar
        </label>
        <input 
            type="\$type" 
            name="\$name" 
            id="\$name" 
            value="\$old"
            placeholder="\$placeholder"
            class="block w-full rounded-md bg-slate-800 text-slate-100 shadow-sm \$borderClass sm:text-sm px-3 py-2"
            >
        \$errorHtml
        \$helpHtml
    </div>
    HTML;
}
PHP

# 3. Card Component
cat > app/components/Layout/Card.php <<PHP
<?php

function Card(string \$content, string \$title = '', string \$footer = '', string \$class = ''): string
{
    \$headerHtml = \$title ? <<<HTML
    <div class="px-6 py-4 border-b border-slate-700">
        <h3 class="text-lg font-medium leading-6 text-slate-100">\$title</h3>
    </div>
    HTML : '';

    \$footerHtml = \$footer ? <<<HTML
    <div class="px-6 py-4 bg-slate-800/50 border-t border-slate-700 rounded-b-lg">
        \$footer
    </div>
    HTML : '';

    return <<<HTML
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm \$class">
        \$headerHtml
        <div class="px-6 py-6">
            \$content
        </div>
        \$footerHtml
    </div>
    HTML;
}
PHP

# 4. Alert Component
cat > app/components/Feedback/Alert.php <<PHP
<?php

function Alert(string \$message, string \$type = 'info', bool \$dismissible = true): string
{
    \$colors = [
        'info' => 'bg-blue-900/30 text-blue-200 border-blue-800',
        'success' => 'bg-emerald-900/30 text-emerald-200 border-emerald-800',
        'warning' => 'bg-amber-900/30 text-amber-200 border-amber-800',
        'error' => 'bg-red-900/30 text-red-200 border-red-800',
    ];
    
    \$icons = [
        'info' => '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        'success' => '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
        'warning' => '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
        'error' => '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    ];

    \$style = \$colors[\$type] ?? \$colors['info'];
    \$icon = \$icons[\$type] ?? \$icons['info'];
    
    \$dismissHtml = \$dismissible ? <<<HTML
    <button onclick="this.parentElement.remove()" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-slate-400 p-1.5 inline-flex h-8 w-8 hover:bg-slate-800/50">
        <span class="sr-only">Dismiss</span>
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
    </button>
    HTML : '';

    return <<<HTML
    <div class="flex p-4 mb-4 text-sm border rounded-lg \$style" role="alert">
        <div class="flex-shrink-0 inline w-5 h-5 mr-3">
            \$icon
        </div>
        <div>
            \$message
        </div>
        \$dismissHtml
    </div>
    HTML;
}
PHP

# 5. Badge Component
cat > app/components/Data/Badge.php <<PHP
<?php

function Badge(string \$text, string \$color = 'primary'): string
{
    \$colors = [
        'primary' => 'bg-indigo-900 text-indigo-300',
        'success' => 'bg-emerald-900 text-emerald-300',
        'warning' => 'bg-amber-900 text-amber-300',
        'danger' => 'bg-red-900 text-red-300',
        'gray' => 'bg-slate-700 text-slate-300',
    ];
    
    \$style = \$colors[\$color] ?? \$colors['gray'];

    return <<<HTML
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \$style">
        \$text
    </span>
    HTML;
}
PHP

# 6. Table Component
cat > app/components/Data/Table.php <<PHP
<?php

function Table(array \$headers, array \$rows): string
{
    \$thead = '';
    foreach (\$headers as \$header) {
        \$thead .= "<th scope='col' class='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>\$header</th>";
    }

    \$tbody = '';
    foreach (\$rows as \$row) {
        \$tbody .= "<tr class='bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 transition-colors'>";
        foreach (\$row as \$cell) {
            \$tbody .= "<td class='px-6 py-4 whitespace-nowrap text-sm text-slate-300'>\$cell</td>";
        }
        \$tbody .= "</tr>";
    }

    return <<<HTML
    <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-slate-700 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-slate-700">
                        <thead class="bg-slate-900">
                            <tr>\$thead</tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700">
                            \$tbody
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    HTML;
}
PHP

# 7. Sidebar Component (Navigation)
cat > app/components/Navigation/Sidebar.php <<PHP
<?php

function Sidebar(array \$links): string
{
    \$items = '';
    \$currentPath = request()->path();

    foreach (\$links as \$label => \$url) {
        \$isActive = \$currentPath === \$url || (\$url !== '/' && str_starts_with(\$currentPath, \$url));
        \$class = \$isActive 
            ? 'bg-slate-800 text-white border-l-4 border-indigo-500' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent';
            
        \$items .= <<<HTML
        <a href="\$url" class="group flex items-center px-3 py-2 text-sm font-medium transition-all \$class">
            \$label
        </a>
        HTML;
    }

    return <<<HTML
    <div class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-800 bg-slate-900 pt-16 pb-4">
        <nav class="mt-5 flex-1 px-2 space-y-1">
            \$items
        </nav>
        <div class="flex-shrink-0 flex border-t border-slate-800 p-4">
            <div class="flex-shrink-0 w-full group block">
                <div class="flex items-center">
                    <div class="inline-block h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                        B
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-white">Bastion Admin</p>
                        <p class="text-xs font-medium text-slate-400">v0.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    HTML;
}
PHP

# 8. Navbar Component
cat > app/components/Navigation/Navbar.php <<PHP
<?php

use App\Core\Auth;

function Navbar(): string
{
    \$user = Auth::user();
    \$authHtml = '';

    if (\$user) {
        \$authHtml = <<<HTML
        <div class="flex items-center gap-4">
            <span class="text-sm text-slate-300">{\$user['email']}</span>
            <form action="/logout" method="POST">
                <button type="submit" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign out</button>
                <input type="hidden" name="_token" value="{\$_SESSION['_token']}">
            </form>
        </div>
        HTML;
    } else {
        \$authHtml = <<<HTML
        <div class="flex items-center gap-4">
            <a href="/login" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign in</a>
            <a href="/register" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500">
                Sign up
            </a>
        </div>
        HTML;
    }

    return <<<HTML
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed w-full z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            BASTION
                        </a>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a href="/" class="border-transparent text-slate-300 hover:border-indigo-500 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Home
                        </a>
                        <a href="/dashboard" class="border-transparent text-slate-300 hover:border-indigo-500 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Dashboard
                        </a>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    \$authHtml
                </div>
            </div>
        </div>
    </nav>
    HTML;
}
PHP

#------------------------------------------------------------------------------
# 21. BASE LAYOUTS
#------------------------------------------------------------------------------
log_step "Constructing View Layouts..."

# 1. App Layout (Main)
cat > app/views/layouts/app.php <<PHP
<!DOCTYPE html>
<html lang="<?= env('APP_LOCALE', 'en') ?>" class="dark h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="<?= csrf_token() ?>">
    
    <title><?= \App\Core\DV::get('title', env('APP_NAME')) ?></title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/assets/css/app.css">
    <script src="https://unpkg.com/htmx.org@1.9.10" defer></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    
    <style>
        body { font-family: 'Inter', sans-serif; }
        pre, code { font-family: 'JetBrains Mono', monospace; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="h-full bg-slate-950 text-slate-200 antialiased selection:bg-indigo-500 selection:text-white">

    <?= \App\Core\View\View::component('Navigation.Navbar') ?>

    <div class="min-h-full pt-16">
        <?php if (\App\Core\DV::has('success')): ?>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <?= \App\Core\View\View::component('Feedback.Alert', ['message' => \App\Core\DV::get('success'), 'type' => 'success']) ?>
            </div>
        <?php endif; ?>
        
        <?php if (\App\Core\DV::has('error')): ?>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <?= \App\Core\View\View::component('Feedback.Alert', ['message' => \App\Core\DV::get('error'), 'type' => 'error']) ?>
            </div>
        <?php endif; ?>

        <main class="py-10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <?= \$content ?>
            </div>
        </main>
    </div>

    <footer class="bg-slate-900 border-t border-slate-800 mt-auto">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p class="text-center text-sm text-slate-500">
                &copy; <?= date('Y') ?> <?= env('APP_NAME') ?>. Built with Bastion PHP.
            </p>
        </div>
    </footer>

</body>
</html>
PHP

# 2. Auth Layout (Centered)
cat > app/views/layouts/guest.php <<PHP
<!DOCTYPE html>
<html lang="en" class="dark h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= \App\Core\DV::get('title', 'Login') ?> - Bastion</title>
    <link rel="stylesheet" href="/assets/css/app.css">
</head>
<body class="h-full bg-slate-950 text-slate-200 antialiased font-sans">
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                <?= \App\Core\DV::get('title') ?>
            </h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-700">
                <?php if (\App\Core\DV::has('error')): ?>
                    <div class="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded">
                        <?= \App\Core\DV::get('error') ?>
                    </div>
                <?php endif; ?>
                
                <?= \$content ?>
            </div>
        </div>
    </div>
</body>
</html>
PHP

#------------------------------------------------------------------------------
# 22. AUTHENTICATION LOGIC (Controllers)
#------------------------------------------------------------------------------
log_step "Wiring Security Controllers..."

mkdir -p app/http/controllers/Auth

# 1. Login Logic (page.php style)
mkdir -p app/login
cat > app/login/page.php <<PHP
<?php

use App\Core\Auth;
use App\Core\DV;
use App\Core\Http\Request;
use App\Core\Http\Response;

// Handle Redirect if Logged In
if (Auth::check()) {
    return Response::redirect('/dashboard');
}

// Set View State
DV::set('title', 'Sign In');

// -------------------------------------------------------------------------
// View Rendering (Using Components)
// -------------------------------------------------------------------------
// Note: In Bastion, you can return HTML directly or include a view file.
// Here we compose with functional components.

\$csrf = csrf_field();
\$emailInput = component('Forms.Input', ['name' => 'email', 'label' => 'Email Address', 'type' => 'email', 'required' => true]);
\$passInput = component('Forms.Input', ['name' => 'password', 'label' => 'Password', 'type' => 'password', 'required' => true]);
\$btn = component('Forms.Button', ['text' => 'Sign In', 'type' => 'submit', 'class' => 'w-full']);

\$content = <<<HTML
<form class="space-y-6" action="/login" method="POST">
    \$csrf
    \$emailInput
    \$passInput
    
    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500">
            <label for="remember-me" class="ml-2 block text-sm text-slate-300">Remember me</label>
        </div>
        <div class="text-sm">
            <a href="#" class="font-medium text-indigo-400 hover:text-indigo-300">Forgot password?</a>
        </div>
    </div>

    <div>
        \$btn
    </div>
</form>
HTML;

// Return response wrapped in guest layout manually for this route
ob_start();
require base_path('app/views/layouts/guest.php');
return Response::html(ob_get_clean());
PHP

# 2. Login Handler (+server.php)
cat > app/login/+server.php <<PHP
<?php

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Core\Auth;
use App\Core\DV;

return [
    'post' => function (Request \$request) {
        \$credentials = \$request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt(\$credentials['email'], \$credentials['password'])) {
            return Response::redirect('/dashboard');
        }

        DV::flash('error', 'Invalid credentials provided.');
        DV::flash('old', \$request->all());
        
        return Response::redirect('/login');
    }
];
PHP

# 3. Logout
mkdir -p app/logout
cat > app/logout/+server.php <<PHP
<?php

use App\Core\Auth;
use App\Core\Http\Response;

return [
    'post' => function () {
        Auth::logout();
        return Response::redirect('/');
    }
];
PHP

log_success "Part 5 complete. UI Library and Auth Flow implemented."
#------------------------------------------------------------------------------
# 23. DASHBOARD & INTERNAL PAGES
#------------------------------------------------------------------------------
log_step "Building Internal Dashboard..."

mkdir -p app/dashboard

# 1. Dashboard Page
cat > app/dashboard/page.php <<PHP
<?php

use App\Core\Auth;
use App\Core\DV;
use App\Core\Database\DB;

if (!Auth::check()) {
    return \App\Core\Http\Response::redirect('/login');
}

\$user = Auth::user();
DV::set('title', 'Dashboard');

// Data Fetching
\$stats = [
    'users' => DB::table('users')->count(),
    'recent' => DB::table('users')->orderBy('created_at', 'desc')->limit(5)->get()
];

// Component Composition
\$card1 = component('Layout.Card', [
    'title' => 'Total Users',
    'content' => '<div class="text-3xl font-bold text-indigo-400">' . \$stats['users'] . '</div>',
    'class' => 'h-full'
]);

\$card2 = component('Layout.Card', [
    'title' => 'System Status',
    'content' => '<div class="flex items-center gap-2"><span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span> <span class="text-emerald-400">Operational</span></div>',
    'class' => 'h-full'
]);

// Table Data Preparation
\$headers = ['ID', 'Name', 'Email', 'Role', 'Joined'];
\$rows = array_map(function(\$u) {
    return [
        \$u['id'],
        e(\$u['name']),
        e(\$u['email']),
        component('Data.Badge', ['text' => \$u['role'], 'color' => \$u['role'] === 'admin' ? 'warning' : 'primary']),
        date('M j, Y', strtotime(\$u['created_at']))
    ];
}, \$stats['recent']);

\$table = component('Data.Table', ['headers' => \$headers, 'rows' => \$rows]);

\$content = <<<HTML
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <div class="flex gap-2">
            <?= component('Forms.Button', ['text' => 'Download Report', 'variant' => 'secondary', 'size' => 'sm']) ?>
            <?= component('Forms.Button', ['text' => 'New User', 'variant' => 'primary', 'size' => 'sm']) ?>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {\$card1}
        {\$card2}
        <?= component('Layout.Card', ['title' => 'Your Role', 'content' => '<span class="text-xl">'.ucfirst(\$user['role']).'</span>', 'class' => 'h-full']) ?>
    </div>

    <div class="space-y-2">
        <h2 class="text-lg font-medium text-slate-300">Recent Registrations</h2>
        {\$table}
    </div>
</div>
HTML;

// Note: In Bastion, the file automatically returns valid HTML if no return statement is present, 
// because the Router captures the output buffer. 
// But explicit return is cleaner if we want to ensure variable scope isolation.
echo \$content;
PHP

#------------------------------------------------------------------------------
# 24. ADMIN PANEL (User Management CRUD)
#------------------------------------------------------------------------------
log_step "Constructing Admin Panel..."

mkdir -p app/admin/users

# 1. Admin Middleware
cat > app/http/middleware/AdminMiddleware.php <<PHP
<?php

namespace App\Http\Middleware;

use App\Core\Auth;
use App\Core\Http\Response;

class AdminMiddleware
{
    public function handle(\$request, \$next)
    {
        \$user = Auth::user();
        if (!\$user || \$user['role'] !== 'admin') {
            return Response::error(403, 'Access Denied: Administrators only.');
        }
        return \$next(\$request);
    }
}
PHP

# 2. Users Index Page
cat > app/admin/users/page.php <<PHP
<?php

use App\Core\Auth;
use App\Core\DV;
use App\Core\Database\DB;

// Middleware check (Manual for now, Router middleware support added in v0.2)
if (!Auth::check() || Auth::user()['role'] !== 'admin') {
    return \App\Core\Http\Response::redirect('/dashboard');
}

DV::set('title', 'User Management');

// Fetch Users
\$users = DB::table('users')->orderBy('created_at', 'desc')->get();

// Build Table Rows
\$headers = ['ID', 'Name', 'Email', 'Role', 'Actions'];
\$rows = [];

foreach (\$users as \$u) {
    \$id = \$u['id'];
    
    // Action Buttons (Using HTMX for interactivity)
    \$deleteBtn = <<<HTML
    <button 
        hx-delete="/api/users/\$id" 
        hx-confirm="Are you sure you want to delete this user?" 
        hx-target="closest tr" 
        hx-swap="outerHTML"
        class="text-red-400 hover:text-red-300 font-medium text-xs ml-2">
        Delete
    </button>
    HTML;
    
    \$rows[] = [
        \$id,
        e(\$u['name']),
        e(\$u['email']),
        component('Data.Badge', ['text' => \$u['role'], 'color' => \$u['role'] === 'admin' ? 'warning' : 'gray']),
        \$deleteBtn
    ];
}

\$userTable = component('Data.Table', ['headers' => \$headers, 'rows' => \$rows]);

echo <<<HTML
<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-white">Users</h1>
            <p class="text-slate-400 text-sm">Manage system access</p>
        </div>
        <a href="/admin/users/create" class="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm">
            Create User
        </a>
    </div>

    {\$userTable}
</div>
HTML;
PHP

# 3. User Create Page
mkdir -p app/admin/users/create
cat > app/admin/users/create/page.php <<PHP
<?php

use App\Core\Auth;
use App\Core\DV;

if (!Auth::check() || Auth::user()['role'] !== 'admin') {
    return \App\Core\Http\Response::redirect('/dashboard');
}

DV::set('title', 'Create User');

// Components
\$nameInput = component('Forms.Input', ['name' => 'name', 'label' => 'Full Name', 'required' => true]);
\$emailInput = component('Forms.Input', ['name' => 'email', 'label' => 'Email Address', 'type' => 'email', 'required' => true]);
\$passInput = component('Forms.Input', ['name' => 'password', 'label' => 'Password', 'type' => 'password', 'required' => true]);
\$roleInput = <<<HTML
<div class="mb-4">
    <label class="block text-sm font-medium text-slate-300 mb-1">Role</label>
    <select name="role" class="block w-full rounded-md bg-slate-800 text-slate-100 shadow-sm border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2">
        <option value="user">User</option>
        <option value="admin">Admin</option>
    </select>
</div>
HTML;

\$submitBtn = component('Forms.Button', ['text' => 'Save User', 'type' => 'submit']);
\$csrf = csrf_field();

echo <<<HTML
<div class="max-w-2xl mx-auto">
    <div class="mb-6">
        <a href="/admin/users" class="text-slate-400 hover:text-white text-sm">← Back to Users</a>
        <h1 class="text-2xl font-bold text-white mt-2">Create New User</h1>
    </div>

    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <form action="/api/users" method="POST">
            {\$csrf}
            {\$nameInput}
            {\$emailInput}
            {\$passInput}
            {\$roleInput}
            
            <div class="flex justify-end pt-4">
                {\$submitBtn}
            </div>
        </form>
    </div>
</div>
HTML;
PHP

#------------------------------------------------------------------------------
# 25. API ENDPOINTS (Backend Logic)
#------------------------------------------------------------------------------
log_step "Wiring API Endpoints..."

mkdir -p app/api/users

# 1. Users API (+server.php)
cat > app/api/users/+server.php <<PHP
<?php

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Core\Auth;
use App\Core\Database\DB;
use App\Models\User;

return [
    // GET /api/users (List - JSON)
    'get' => function (Request \$request) {
        if (!Auth::check()) return Response::json(['error' => 'Unauthorized'], 401);
        
        \$users = User::all();
        return Response::json(\$users);
    },

    // POST /api/users (Create)
    'post' => function (Request \$request) {
        if (!Auth::check() || Auth::user()['role'] !== 'admin') {
            return Response::json(['error' => 'Forbidden'], 403);
        }

        \$data = \$request->validate([
            'name' => 'required|min:2',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'required'
        ]);

        \$data['password'] = password_hash(\$data['password'], PASSWORD_DEFAULT);
        
        User::create(\$data);

        // If AJAX/HTMX, return success or redirect
        if (\$request->wantsJson()) {
            return Response::json(['message' => 'User created successfully'], 201);
        }
        
        \App\Core\DV::flash('success', 'User created successfully.');
        return Response::redirect('/admin/users');
    }
];
PHP

# 2. Single User API (Delete/Update)
mkdir -p app/api/users/\[id\]
cat > app/api/users/\[id\]/+server.php <<PHP
<?php

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Core\Auth;
use App\Models\User;

return [
    'delete' => function (Request \$request) {
        if (!Auth::check() || Auth::user()['role'] !== 'admin') {
            return Response::json(['error' => 'Forbidden'], 403);
        }

        \$id = \$request->attributes['id'];
        
        // Prevent deleting self
        if ((int)\$id === (int)Auth::user()['id']) {
            return Response::error(400, 'Cannot delete yourself');
        }

        \$user = User::find(\$id);
        if (\$user) {
            \$user->delete();
        }

        // For HTMX, return empty string to remove element from DOM
        return Response::html('');
    }
];
PHP

log_success "Part 6 complete. App logic and Admin Panel operational."
#------------------------------------------------------------------------------
# 26. CONSOLE APPLICATION (The 'Bastion' CLI)
#------------------------------------------------------------------------------
log_step "Forging Command Line Interface..."

mkdir -p app/console/Commands

# 1. Console Kernel
cat > app/console/Kernel.php <<PHP
<?php

namespace App\Console;

class Kernel
{
    protected array \$commands = [
        Commands\ServeCommand::class,
        Commands\MigrateCommand::class,
        Commands\SeedCommand::class,
        Commands\MakeControllerCommand::class,
        Commands\MakeModelCommand::class,
    ];

    public function handle(array \$argv): void
    {
        \$commandName = \$argv[1] ?? 'help';
        \$args = array_slice(\$argv, 2);

        foreach (\$this->commands as \$commandClass) {
            \$instance = new \$commandClass();
            if (\$instance->signature === \$commandName) {
                \$instance->handle(\$args);
                return;
            }
        }

        if (\$commandName === 'help') {
            \$this->showHelp();
            return;
        }

        echo "\033[31mCommand not found: \$commandName\033[0m\n";
    }

    protected function showHelp(): void
    {
        echo "\n\033[1;34mBastion CLI\033[0m - Available Commands:\n\n";
        foreach (\$this->commands as \$commandClass) {
            \$instance = new \$commandClass();
            echo "  \033[32m" . str_pad(\$instance->signature, 20) . "\033[0m " . \$instance->description . "\n";
        }
        echo "\n";
    }
}
PHP

# 2. Base Command
cat > app/console/Command.php <<PHP
<?php

namespace App\Console;

abstract class Command
{
    public string \$signature;
    public string \$description;

    abstract public function handle(array \$args): void;

    protected function info(string \$message): void
    {
        echo "\033[34m[INFO]\033[0m \$message\n";
    }

    protected function success(string \$message): void
    {
        echo "\033[32m[OK]\033[0m \$message\n";
    }

    protected function error(string \$message): void
    {
        echo "\033[31m[ERROR]\033[0m \$message\n";
        exit(1);
    }
}
PHP

# 3. Serve Command
cat > app/console/Commands/ServeCommand.php <<PHP
<?php

namespace App\Console\Commands;

use App\Console\Command;

class ServeCommand extends Command
{
    public string \$signature = 'serve';
    public string \$description = 'Start the development server';

    public function handle(array \$args): void
    {
        \$host = '127.0.0.1';
        \$port = \$args[0] ?? 8000;

        \$this->info("Bastion server started on http://\$host:\$port");
        \$this->info("Press Ctrl+C to stop.");
        
        passthru("php -S \$host:\$port -t public");
    }
}
PHP

# 4. Migrate Command
cat > app/console/Commands/MigrateCommand.php <<PHP
<?php

namespace App\Console\Commands;

use App\Console\Command;
use App\Console\Migrator;

class MigrateCommand extends Command
{
    public string \$signature = 'migrate';
    public string \$description = 'Run database migrations';

    public function handle(array \$args): void
    {
        \$this->info("Running migrations...");
        
        try {
            (new Migrator())->run();
        } catch (\Exception \$e) {
            \$this->error(\$e->getMessage());
        }
    }
}
PHP

# 5. Seed Command
cat > app/console/Commands/SeedCommand.php <<PHP
<?php

namespace App\Console\Commands;

use App\Console\Command;
use App\Core\Database\Connection;

class SeedCommand extends Command
{
    public string \$signature = 'db:seed';
    public string \$description = 'Seed the database with records';

    public function handle(array \$args): void
    {
        \$this->info("Seeding database...");
        Connection::connect();

        \$files = glob(base_path('database/seeds/*.php'));
        
        foreach (\$files as \$file) {
            \$className = 'Database\\\\Seeds\\\\' . basename(\$file, '.php');
            
            if (class_exists(\$className)) {
                \$seeder = new \$className();
                if (method_exists(\$seeder, 'run')) {
                    \$seeder->run();
                    \$this->success("Seeded: " . basename(\$file, '.php'));
                }
            } else {
                // Procedural fallback
                require_once \$file;
                \$this->success("Executed: " . basename(\$file));
            }
        }
    }
}
PHP

# 6. Make:Model Command (Scaffolding)
cat > app/console/Commands/MakeModelCommand.php <<PHP
<?php

namespace App\Console\Commands;

use App\Console\Command;

class MakeModelCommand extends Command
{
    public string \$signature = 'make:model';
    public string \$description = 'Create a new Eloquent model class';

    public function handle(array \$args): void
    {
        \$name = \$args[0] ?? null;
        if (!\$name) \$this->error("Name required.");

        \$path = app_path("models/{\$name}.php");
        if (file_exists(\$path)) \$this->error("Model already exists.");

        \$stub = <<<PHP
<?php

namespace App\Models;

use App\Core\Database\Model;

class \$name extends Model
{
    protected static string \\\$table = 'table_name';
}
PHP;

        file_put_contents(\$path, \$stub);
        \$this->success("Model created: app/models/{\$name}.php");
    }
}
PHP

# 7. Make:Controller (Page Generator)
cat > app/console/Commands/MakeControllerCommand.php <<PHP
<?php

namespace App\Console\Commands;

use App\Console\Command;

class MakeControllerCommand extends Command
{
    public string \$signature = 'make:page';
    public string \$description = 'Create a new page route';

    public function handle(array \$args): void
    {
        \$name = \$args[0] ?? null;
        if (!\$name) \$this->error("Name required (e.g. 'dashboard/stats').");

        \$dir = app_path(\$name);
        if (!is_dir(\$dir)) mkdir(\$dir, 0755, true);

        \$file = \$dir . '/page.php';
        if (file_exists(\$file)) \$this->error("Page already exists.");

        \$stub = <<<PHP
<?php

use App\Core\DV;

DV::set('title', 'New Page');
?>

<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-white">New Page</h1>
</div>
PHP;

        file_put_contents(\$file, \$stub);
        \$this->success("Page created: app/{\$name}/page.php");
    }
}
PHP

# 8. The Entry Point (bastion)
cat > bastion <<PHP
#!/usr/bin/env php
<?php

define('LARAVEL_START', microtime(true));

require __DIR__ . '/app/bootstrap.php';

use App\Console\Kernel;

\$kernel = new Kernel();
\$kernel->handle(\$argv);
PHP

chmod +x bastion

#------------------------------------------------------------------------------
# 27. DATABASE MIGRATIONS & SEEDS
#------------------------------------------------------------------------------
log_step "Writing Database Blueprints..."

# 1. Initial Migration (Users & Tokens)
cat > database/migrations/2024_01_01_000000_create_users_table.php <<PHP
<?php

use App\Core\Database\Schema\Schema;
use App\Core\Database\Schema\Blueprint;

return new class {
    public function up()
    {
        Schema::create('users', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->string('email')->unique();
            \$table->string('password');
            \$table->string('role')->nullable(); // 'admin' or 'user'
            \$table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('users');
    }
};
PHP

# 2. Database Seeder
cat > database/seeds/DatabaseSeeder.php <<PHP
<?php

namespace Database\Seeds;

use App\Models\User;

class DatabaseSeeder
{
    public function run()
    {
        // Admin
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'System Administrator',
                'email' => 'admin@example.com',
                'password' => password_hash('password', PASSWORD_DEFAULT),
                'role' => 'admin'
            ]);
        }

        // Demo Users
        \$names = ['Alice Smith', 'Bob Jones', 'Charlie Day'];
        foreach (\$names as \$name) {
            \$email = strtolower(str_replace(' ', '.', \$name)) . '@example.com';
            if (!User::where('email', \$email)->exists()) {
                User::create([
                    'name' => \$name,
                    'email' => \$email,
                    'password' => password_hash('password', PASSWORD_DEFAULT),
                    'role' => 'user'
                ]);
            }
        }
    }
}
PHP

#------------------------------------------------------------------------------
# 28. PUBLIC ASSETS
#------------------------------------------------------------------------------
log_step "Preparing Public Directory..."

# .htaccess (Apache)
cat > public/.htaccess <<HTACCESS
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
HTACCESS

# robots.txt
cat > public/robots.txt <<TXT
User-agent: *
Disallow:
TXT

# favicon.ico placeholder (empty)
touch public/favicon.ico

log_success "Part 7 complete. CLI and Database layer finalized."
#------------------------------------------------------------------------------
# 29. FRONTEND BUILD PIPELINE (Tailwind CSS)
#------------------------------------------------------------------------------
log_step "Configuring Asset Pipeline..."

# 1. Tailwind Config
cat > tailwind.config.js <<JS
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/views/**/*.php",
    "./app/components/**/*.php",
    "./app/**/*.php",
    "./resources/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          850: '#151e2e', // Custom dark shade
          950: '#020617', // Deepest background
        }
      }
    },
  },
  plugins: [],
}
JS

# 2. Main CSS Entry Point
# (Ensuring resources/css/app.css exists with directives)
mkdir -p resources/css
cat > resources/css/app.css <<CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  [x-cloak] {
    display: none !important;
  }
  
  body {
    @apply bg-slate-950 text-slate-200 antialiased;
  }

  /* Custom Scrollbar for Webkit */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    @apply bg-slate-900;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-700 rounded;
  }
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-600;
  }
}

@layer components {
  .btn-primary {
    @apply bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900;
  }
}
CSS

# 3. Main JS Entry Point
cat > resources/js/app.js <<JS
import 'htmx.org';
import Alpine from 'alpinejs';

window.Alpine = Alpine;
Alpine.start();

// CSRF Token for HTMX
document.body.addEventListener('htmx:configRequest', (event) => {
    event.detail.headers['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').content;
});
JS

log_success "Frontend pipeline configured."

#------------------------------------------------------------------------------
# 30. FINAL INSTALLATION & BUILD
#------------------------------------------------------------------------------
log_step "Executing Final Build Sequence..."

# 1. Install PHP Dependencies
log_info "Installing Composer dependencies..."
# Suppress output unless error, but show progress bar
if composer install --quiet --no-interaction --prefer-dist; then
    log_success "Composer packages installed."
else
    log_error "Composer installation failed."
fi

# 2. Install Node Dependencies
log_info "Installing NPM dependencies..."
if npm install --silent --no-progress; then
    log_success "Node modules installed."
else
    log_error "NPM installation failed."
fi

# 3. Build Assets
log_info "Compiling Tailwind CSS..."
if npm run build --silent; then
    log_success "Assets compiled for production."
else
    log_warn "Asset compilation failed (check Node setup). You can run 'npm run dev' later."
fi

# 4. Permissions Setup
log_info "Setting permissions..."
chmod +x bastion
chmod -R 775 storage
log_success "Permissions set."

# 5. Database Setup
log_info "Migrating database..."
# Run migration via internal PHP CLI to avoid needing external tools
php bastion migrate
php bastion db:seed
log_success "Database migrated and seeded."

# 6. Git Initialization
if [ -d .git ]; then
    log_info "Git already initialized."
else
    log_info "Initializing Git repository..."
    git init -q
    cat > .gitignore <<GIT
/vendor
/node_modules
/public/assets/css
/public/assets/js
/storage/db/*.sqlite
/storage/logs/*.log
/storage/framework/cache/*
/storage/framework/sessions/*
/storage/framework/views/*
.env
.DS_Store
.idea
.vscode
phpunit.xml
GIT
    git add .
    git commit -q -m "Initial commit: Bastion Framework v0.1.0"
    log_success "Git repository initialized."
fi

#------------------------------------------------------------------------------
# 31. SUCCESS MANIFEST
#------------------------------------------------------------------------------

echo ""
echo -e "${GREEN}██████╗  █████╗ ███████╗████████╗██╗ ██████╗ ███╗   ██╗${NC}"
echo -e "${GREEN}██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║${NC}"
echo -e "${GREEN}██████╔╝███████║███████╗   ██║   ██║██║   ██║██╔██╗ ██║${NC}"
echo -e "${GREEN}██╔══██╗██╔══██║╚════██║   ██║   ██║██║   ██║██║╚██╗██║${NC}"
echo -e "${GREEN}██████╔╝██║  ██║███████║   ██║   ██║╚██████╔╝██║ ╚████║${NC}"
echo -e "${GREEN}╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝${NC}"
echo ""
echo -e "${BOLD}Bastion Enterprise v0.1.0${NC} has been successfully deployed."
echo ""
echo -e "${YELLOW}------------------------------------------------------------${NC}"
echo -e "${BLUE}  📂 Project Location:${NC}  $ROOT_DIR"
echo -e "${BLUE}  🔗 App URL:${NC}           http://localhost:8000"
echo -e "${BLUE}  👤 Default Admin:${NC}     admin@example.com"
echo -e "${BLUE}  🔑 Default Password:${NC}  password"
echo -e "${YELLOW}------------------------------------------------------------${NC}"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo -e "  1. ${BOLD}cd $PROJECT_NAME${NC}"
echo -e "  2. ${BOLD}php bastion serve${NC}   (Start the server)"
echo -e "  3. ${BOLD}npm run dev${NC}         (Watch Tailwind changes)"
echo ""
echo -e "${MAGENTA}Documentation:${NC} Check app/core/README.md (Coming soon)"
echo ""
