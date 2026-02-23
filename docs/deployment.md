# Deployment Guide

## Prerequisites

- Node.js 18+
- npm 9+
- A Vercel account (or any Node.js hosting platform)
- Access to the Laravel API backend

## Environment Variables

Create a `.env` file based on `.env.example`. Required variables:

| Variable              | Description                       | Example                     |
| --------------------- | --------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL              | `https://api.karsaazqr.com` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL                  | `https://app.karsaazqr.com` |
| `ANALYZE`             | Enable bundle analyzer (optional) | `true`                      |

## Local Development

```bash
npm install
npm run dev        # Start dev server on http://localhost:3000
npm run type-check # Run TypeScript check
npm run lint       # Run ESLint
npm run test       # Run Vitest unit tests
```

## Build & Preview

```bash
npm run build    # Production build (standalone output)
npm start        # Start production server
```

## Vercel Deployment

### Initial Setup

1. Import the repository in the [Vercel dashboard](https://vercel.com/import).
2. Framework Preset: **Next.js** (auto-detected).
3. Build Command: `npm run build`
4. Output Directory: `.next` (default)
5. Install Command: `npm install`

### Environment Variables (Vercel Dashboard)

Add these in **Settings → Environment Variables**:

- `NEXT_PUBLIC_API_URL` — Backend API URL (per environment)
- `NEXT_PUBLIC_APP_URL` — Frontend URL (per environment)

### Branch Deployments

- `main` → Production
- Pull requests → Preview deployments (auto)

### Build Settings

The `next.config.js` is configured with:

- `output: 'standalone'` — Optimized for containerized deployments
- Bundle analyzer available via `ANALYZE=true`
- Security headers (CSP, X-Frame-Options, etc.) applied automatically
- Image optimization for `app.karsaazqr.com` domain

## Docker Deployment

```bash
docker build -t karsaaz-qr-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.karsaazqr.com \
  -e NEXT_PUBLIC_APP_URL=https://app.karsaazqr.com \
  karsaaz-qr-frontend
```

Or use Docker Compose:

```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test authentication flow (login/signup/password reset)
- [ ] Verify API connectivity (QR code creation, listing)
- [ ] Check image optimization is working
- [ ] Confirm security headers via browser DevTools
- [ ] Test payment/subscription flows
- [ ] Verify email delivery (verification, password reset)
