---
ID: '016'
TITLE: 'Fix PHP 8.5 deprecations and LAN CSP'
STAGE: green
DATE_ISO: '2026-07-02'
SURFACE: 'agent'
MODEL: 'claude-sonnet-5'
FEATURE: 'none'
BRANCH: 'none (no git)'
USER: 'user'
COMMAND: 'fix PHP 8.5 startup deprecations + juniors blocked:csp over LAN'
LABELS: ['php-8.5', 'pdo', 'csp', 'cors', 'team-dev']
FILES_YAML:
  - 'qr-code-backend/config/database.php'
  - 'qr-code-backend/app/Http/Middleware/SecurityHeaders.php'
  - 'karsaaz Qr React js/next.config.js'
TESTS_YAML:
  - 'php -l on both changed PHP files: clean'
  - 'php artisan config:clear + boot: zero deprecation output'
  - 'php artisan tinker DB::select: connection works with new constants'
  - 'node eval of next.config headers(): connect-src includes http: with NEXT_PUBLIC_ALLOW_LAN=true'
---

## Prompt

there is a fucked up situation

this is my backend C:\Dev\karsaaz qr\qr-code-backend

i have installed 8.5 php version but when starting it this is the error [php artisan serve output showing repeated "PHP Deprecated: Constant PDO::MYSQL_ATTR_SSL_CA is deprecated since 8.5, use Pdo\Mysql::ATTR_SSL_CA instead in config\database.php on line 85" plus the same for MYSQL_ATTR_USE_BUFFERED_QUERY (line 89) and MYSQL_ATTR_INIT_COMMAND (line 90), interleaved with request logs and Stripe notices]

we have to fix this completelly

secounly when i am giving my ip to my juniors and thay are accesing the backend via running the frontend locally it is giving server internet error (blocked:csp) error fix both of them

## Response

1. config/database.php: PHP 8.4 moved MySQL PDO constants to Pdo\Mysql; resolved conditionally via class*exists(\Pdo\Mysql::class) with fallback to PDO::MYSQL_ATTR*\* for older PHP. Deprecation output was also leaking into HTTP response bodies under artisan serve (the "server internal error").
2. next.config.js buildConnectSrc(): http:/https:/ws:/wss: now also allowed when NEXT_PUBLIC_ALLOW_LAN=true, so production builds (npm run build && npm start) pointing at a LAN backend IP are no longer blocked:csp. Backend CORS already allowed 192.168.x/10.x in non-production.
3. SecurityHeaders.php: replaced env('CORS_ALLOWED_ORIGINS') with config('cors.allowed_origins') per project rule (env() is null after config:cache).

## Outcome

Backend boots with zero deprecations; DB verified via tinker. connect-src verified to include http: with the new flag. User must add NEXT_PUBLIC_ALLOW_LAN=true to .env.team.example / junior .env manually (agent blocked from writing .env files).
