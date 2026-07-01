---
ID: '012'
TITLE: 'Audit v4 www remediation batch'
STAGE: green
DATE_ISO: '2026-06-22'
SURFACE: 'agent'
MODEL: 'claude-4.6-opus-high-thinking'
FEATURE: 'none'
BRANCH: 'production_v2'
USER: 'user'
COMMAND: 'read KarsaazQR_Audit_www_v4.docx and start working accordingly in detail'
LABELS: ['audit', 'seo', 'ssr', 'register', 'security-headers']
FILES_YAML:
  - 'karsaaz Qr React js/app/(auth)/register/page.tsx'
  - 'karsaaz Qr React js/components/features/auth/SignupFormStatic.tsx'
  - 'karsaaz Qr React js/app/(dashboard)/qrcodes/new/page.tsx'
  - 'karsaaz Qr React js/app/(dashboard)/qrcodes/new/QRCodesNewStatic.tsx'
  - 'karsaaz Qr React js/app/guest/create/page.tsx'
  - 'karsaaz Qr React js/components/landing/FAQStatic.tsx'
  - 'karsaaz Qr React js/middleware.ts'
  - 'karsaaz Qr React js/next.config.js'
  - 'karsaaz Qr React js/app/(landing)/*/layout.tsx'
TESTS_YAML:
  - 'npm run type-check (pre-existing test errors only)'
---

## Prompt

read this and start working accordingly in detail

C:\Dev\karsaaz qr\Bugs\KarsaazQR_Audit_www_v4.docx

## Response

Read audit v4 (29 findings, 8 critical). Implemented immediate frontend remediations: /register route with SSR form, signup SSR scaffold, qrcodes/new and guest/create OG metadata + SSR scaffolds, FAQ JSON-LD, COOP/CORP security headers, legal page canonical metadata layouts, main-content landmarks. Prior session already fixed login SSR, cookie consent, og canonical URLs, Laravel localhost navbar.

## Outcome

Code ready for deploy with NEXT_PUBLIC_CANONICAL_URL=https://www.karsaazqr.com. Remaining: DevOps header propagation via Cloudflare/Nginx, CAPTCHA (F-18), hero image sizes (F-22), privacy policy date update (content).
