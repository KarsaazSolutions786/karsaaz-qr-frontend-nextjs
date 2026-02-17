# API Base URL Configuration Fixed

## Issue
The Next.js app was using the wrong API base URL, causing API calls to fail.

## Root Cause
- **Original Lit Frontend** uses: `http://127.0.0.1:8000` + `/api` = `http://127.0.0.1:8000/api`
- **Laravel Backend** runs on port `8000` (not 8002)
- **Next.js app** was misconfigured with `http://localhost:8002/api`

## Changes Made

### 1. Updated `.env.local`
```env
# OLD (WRONG)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8002/api

# NEW (CORRECT)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

### 2. Updated `.env.example`
```env
# Updated to match the correct configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=991623785443-cemsf621c6g87ss76k1ons3qi2e06gpq.apps.googleusercontent.com
```

### 3. Updated `lib/api/client.ts`
```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api',
  // ...
})
```

## Verification

### Original Frontend (Lit) Configuration:
- **File**: `qr-code-frontend/index.html`
- **Config**: `window.CONFIG['app.url'] = 'http://127.0.0.1:8000'`
- **API calls**: Append `/api` → `http://127.0.0.1:8000/api/...`

### Laravel Backend Configuration:
- **File**: `qr-code-backend/.env`
- **Config**: `APP_URL="http://localhost:8000"`
- **Port**: 8000

### Next.js Frontend Configuration (Fixed):
- **File**: `.env.local`
- **Base URL**: `http://127.0.0.1:8000/api`
- **Example call**: `/auth/login` → `http://127.0.0.1:8000/api/auth/login`

## Testing

### Start Backend:
```bash
cd "C:\Dev\karsaaz qr\qr-code-backend"
php artisan serve
# Starts on http://127.0.0.1:8000
```

### Start Frontend:
```bash
cd "C:\Dev\karsaaz qr\karsaaz Qr React js"
npm run dev
# Dev server starts on http://localhost:3001
```

### Expected API Calls:
- Login: `POST http://127.0.0.1:8000/api/auth/login`
- Current User: `GET http://127.0.0.1:8000/api/auth/user`
- QR Codes: `GET http://127.0.0.1:8000/api/qrcodes`
- Plans: `GET http://127.0.0.1:8000/api/plans`

## Key Differences from Original

| Aspect | Original (Lit) | New (Next.js) |
|--------|---------------|---------------|
| Base URL | `127.0.0.1` | `127.0.0.1` ✅ |
| Port | `8000` | `8000` ✅ |
| Path | `/api` | `/api` ✅ |
| Google Client ID | Real ID | Real ID ✅ |
| Cookies | `withCredentials: true` | `withCredentials: true` ✅ |

## Notes
- Using `127.0.0.1` instead of `localhost` avoids potential DNS resolution issues
- Port `8000` is Laravel's default `php artisan serve` port
- Google OAuth Client ID is now the real production ID from the original frontend
- All API endpoints append to `/api` base path
