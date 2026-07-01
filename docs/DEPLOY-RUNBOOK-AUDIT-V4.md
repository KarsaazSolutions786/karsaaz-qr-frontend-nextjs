# Karsaaz QR — Audit v4 Deploy Runbook

Complete dry-run and production deployment guide for the **www SEO / security audit v4** remediation (frontend Next.js + Laravel backend).

**Branch:** `production_v2` (both repos)  
**Date prepared:** 2026-06-22

---

## 1. What ships in this release

### Frontend (`karsaaz Qr React js/`)

| Area | Changes |
|------|---------|
| SEO / OG | `NEXT_PUBLIC_CANONICAL_URL`, `getCanonicalSiteUrl()`, OG on auth/legal/guest/create |
| Routes | `/register` alias, `/signup` redirect in middleware |
| SSR audit | Login, signup, `/qrcodes/new` static shells + hydration bridges |
| Security | SSRF URL validation (`safe-url.ts`, `qr-schemas.ts`), COOP/CORP headers |
| Auth UX | Unified error messages, email trim, maxlength on SSR forms |
| Performance | Hero `sizes`, lazy chatbot, FAQ JSON-LD |
| Legal | Privacy policy date v2.1 |

### Backend (`qr-code-backend/`)

| Area | Changes |
|------|---------|
| SEO | Remove `localhost:8000` from generator navbar; `FRONTEND_CUSTOM_URL` links |
| Auth | Email trim, unified forgot-password response, login message anti-enumeration |
| SSRF | `SafeUrlValidator` + `UrlRule` blocks private/localhost URLs |

### Deferred (post-deploy)

- **F-18 CAPTCHA** on login/register/forgot — Turnstile exists for chatbot only; needs `CLOUDFLARE_*` keys + backend verify endpoints.

---

## 2. Pre-deploy checklist (local)

### Frontend

```powershell
cd "karsaaz Qr React js"
npm install
npm run type-check
npm run build
```

### Backend

```powershell
cd qr-code-backend
php -l app/Support/Security/SafeUrlValidator.php
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Files to exclude from commit

- `.claude*`, `.claude-flow/`, `.eslintcache`

---

## 3. Production environment variables

### Next.js

| Variable | Production value |
|----------|------------------|
| `NEXT_PUBLIC_API_URL` | `https://api.karsaazqr.com` |
| `NEXT_PUBLIC_APP_URL` | `https://app.karsaazqr.com` |
| `NEXT_PUBLIC_CANONICAL_URL` | `https://www.karsaazqr.com` |

### Laravel

| Variable | Production value |
|----------|------------------|
| `FRONTEND_CUSTOM_URL` | `https://www.karsaazqr.com` |
| `APP_DEBUG` | `false` |
| `FORCE_HTTPS` | `true` |

---

## 4. Deploy order

1. Backend first
2. Frontend second (rebuild for `NEXT_PUBLIC_*`)
3. Purge CDN cache

---

## 5. Post-deploy verification

- [ ] `og:url` on www homepage uses `www.karsaazqr.com`
- [ ] `/register` returns 200
- [ ] `/login` form fields in View Source
- [ ] Generator navbar not `localhost:8000`
- [ ] Security headers present
- [ ] Login/forgot anti-enumeration messages
- [ ] URL QR rejects localhost/private IPs

---

## 6. Commit when ready

Frontend: audit files only, exclude `.claude*`.  
Backend: SafeUrlValidator, UrlRule, AccountController, AccountSecurityManager, header composer, header blade.

See `docs/deployment.md` for Vercel/Docker details.
