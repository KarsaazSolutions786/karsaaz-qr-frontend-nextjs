---
ID: '011'
TITLE: 'Fix live site SEO canonical URLs'
STAGE: green
DATE_ISO: '2026-06-22'
SURFACE: 'agent'
MODEL: 'claude-4.6-opus-high-thinking'
FEATURE: 'none'
BRANCH: 'production_v2'
USER: 'user'
COMMAND: 'start working on live-site SEO/canonical issues from www.karsaazqr.com HTML'
LABELS: ['seo', 'og-metadata', 'canonical', 'laravel-header']
FILES_YAML:
  - 'karsaaz Qr React js/lib/utils/site-url.ts'
  - 'karsaaz Qr React js/lib/utils/og-metadata.ts'
  - 'karsaaz Qr React js/lib/config/env-config.ts'
  - 'karsaaz Qr React js/app/(auth)/login/page.tsx'
  - 'karsaaz Qr React js/app/(auth)/signup/page.tsx'
  - 'karsaaz Qr React js/app/(auth)/forgot-password/page.tsx'
  - 'karsaaz Qr React js/app/(auth)/reset-password/page.tsx'
  - 'karsaaz Qr React js/components/public/shared/PreviewFooter.tsx'
  - 'karsaaz Qr React js/components/public/shared/PreviewLayout.tsx'
  - 'karsaaz Qr React js/components/public/shared/QRCodeBadge.tsx'
  - 'karsaaz Qr React js/next.config.js'
  - 'karsaaz Qr React js/Dockerfile'
  - 'karsaaz Qr React js/.env.example'
  - 'karsaaz Qr React js/docs/deployment.md'
  - 'qr-code-backend/resources/views/blue/partials/header.blade.php'
  - 'qr-code-backend/app/Support/ViewComposers/WebsiteHeaderComposer.php'
TESTS_YAML:
  - 'npm run type-check (pre-existing test file errors only)'
---

## Prompt

It was discovered directly from the live HTML of www.karsaazqr.com pages, not from any assumption or prior knowledge.

Specifically, these are the exact sources:

1. From the homepage og:image meta tag — when I fetched https://www.karsaazqr.com/, the raw HTML returned:

meta-og:image: https://app.karsaazqr.com/og-default.png
meta-og:url: https://app.karsaazqr.com/
That's what the www server itself is serving in its own HTML head. 2. From www.karsaazqr.com/login — the fetched HTML returned the same:

meta-og:url: https://app.karsaazqr.com/
meta-og:image: https://app.karsaazqr.com/og-default.png 3. From www.karsaazqr.com/terms — the og:url tag read:

meta-og:url: https://app.karsaazqr.com/terms 4. From earlier search results — when I searched site:app.karsaazqr.com to unlock web_fetch permissions, Google returned indexed pages at app.karsaazqr.com/facebookmessenger-qr-code-generator, which I then fetched. That page is what revealed the localhost:8000 hardcoded navbar links.

In summary: Every app.karsaazqr.com finding came from one of:

• Meta tags embedded in www.karsaazqr.com pages pointing there.
• A Google search index result.
• Following those links to verify what they actually return.

## Response

Implemented canonical SEO fixes: added site-url helper and NEXT_PUBLIC_CANONICAL_URL (defaults www when APP_URL is app subdomain), wired generateOGMetadata to all auth pages, replaced hardcoded app.karsaazqr.com in preview CTAs, added og-default.png→svg redirect, updated Dockerfile/deployment docs. Fixed Laravel marketing header that hardcoded localhost:8000 login/register links; WebsiteHeaderComposer now resolves frontend_custom_url or FRONTEND_URL with /login and /signup paths.

## Outcome

Code ready for redeploy. After deploy, verify www HTML shows og:url/og:image on https://www.karsaazqr.com. Set FRONTEND_CUSTOM_URL on Laravel for generator pages to point navbar at Next.js frontend.
