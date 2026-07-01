---
ID: '013'
TITLE: 'Audit v4 remaining findings batch'
STAGE: green
DATE_ISO: '2026-06-22'
SURFACE: 'agent'
MODEL: 'claude-4.6-opus-high-thinking'
FEATURE: 'none'
BRANCH: 'production_v2'
USER: 'user'
COMMAND: 'proceed with them to will be deploye this together'
LABELS: ['audit', 'ssrf', 'enumeration', 'performance']
FILES_YAML:
  - 'karsaaz Qr React js/lib/utils/safe-url.ts'
  - 'karsaaz Qr React js/lib/validations/qr-schemas.ts'
  - 'karsaaz Qr React js/lib/validations/auth.ts'
  - 'karsaaz Qr React js/components/landing/HowItWorks.tsx'
  - 'karsaaz Qr React js/components/landing/Hero.tsx'
  - 'karsaaz Qr React js/app/(landing)/page.tsx'
  - 'karsaaz Qr React js/components/features/auth/LoginForm.tsx'
  - 'karsaaz Qr React js/app/(landing)/privacy-policy/page.tsx'
  - 'qr-code-backend/app/Support/Security/SafeUrlValidator.php'
  - 'qr-code-backend/app/Rules/UrlRule.php'
  - 'qr-code-backend/app/Http/Controllers/AccountController.php'
  - 'qr-code-backend/app/Support/Security/AccountSecurityManager.php'
TESTS_YAML:
  - 'npm run type-check (pre-existing test file errors only)'
---

## Prompt

proceed with them to will be deploye this together

## Response

Completed remaining audit v4 items for joint deploy: SSRF blocking (SafeUrlValidator + UrlRule + frontend qr-schemas), unified login/forgot-password messages (anti-enumeration), email trim server/client, hero image sizes, lazy chatbot, privacy policy date, reset token expiry UX, input maxlength on SSR forms.

## Outcome

Ready to deploy with prior batch. F-18 CAPTCHA still needs CLOUDFLARE_SITE_KEY + CLOUDFLARE_SECRET_KEY in production env.
