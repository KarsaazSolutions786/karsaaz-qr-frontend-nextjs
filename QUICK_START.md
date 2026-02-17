# Quick Start Guide - Next.js Migration

> Get up and running with the migration in 30 minutes

---

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Git
- Code editor (VS Code recommended)

---

## Step 1: Initialize Project (5 min)

```bash
# Navigate to project directory
cd "C:\Dev\karsaaz qr\karsaaz Qr React js"

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"

# Install dependencies
pnpm install

# Install additional packages
pnpm add @tanstack/react-query @tanstack/react-query-devtools
pnpm add axios zod react-hook-form @hookform/resolvers/zod
pnpm add sonner  # Toast notifications
pnpm add lucide-react  # Icons

# Dev dependencies
pnpm add -D @types/node
```

---

## Step 2: Set Up shadcn/ui (5 min)

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Install common components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
```

---

## Step 3: Create Folder Structure (2 min)

```bash
# Create directories
mkdir -p src/lib/api/hooks
mkdir -p src/lib/api/endpoints
mkdir -p src/lib/auth
mkdir -p src/lib/utils
mkdir -p src/lib/validations
mkdir -p src/types
mkdir -p src/config
mkdir -p src/components/layouts
mkdir -p src/components/modules
mkdir -p src/components/forms
mkdir -p src/app/(auth)
mkdir -p src/app/(dashboard)
```

---

## Step 4: Environment Variables (2 min)

Create `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Karsaaz QR
NEXT_PUBLIC_APP_URL=http://localhost:3001

# OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth (if using)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001
```

---

## Step 5: Create Core Files (10 min)

### API Client (`src/lib/api/client.ts`)

```typescript
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### React Query Provider (`src/app/providers.tsx`)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Karsaaz QR',
  description: 'QR Code Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Auth Utilities (`src/lib/auth/index.ts`)

```typescript
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

export function removeToken(): void {
  localStorage.removeItem('token')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
```

---

## Step 6: Create First Page (5 min)

### Login Page (`src/app/(auth)/login/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api/client'
import { setToken } from '@/lib/auth'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await apiClient.post('/auth/login', { email, password })
      setToken(data.token)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login to Karsaaz QR</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Dashboard Page (`src/app/(dashboard)/dashboard/page.tsx`)

```typescript
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome to Karsaaz QR Dashboard
      </p>
    </div>
  )
}
```

---

## Step 7: Run Development Server (1 min)

```bash
pnpm dev
```

Visit: http://localhost:3000

---

## Next Steps

1. ✅ **Verify setup works** - Can you see the login page?
2. 📖 **Read MIGRATION_PLAN.md** - Understand the full migration strategy
3. 🔧 **Start with auth** - Implement full authentication flow
4. 📋 **Follow checklist** - Use MIGRATION_CHECKLIST.md to track progress
5. 💬 **Ask questions** - Document blockers and decisions

---

## Common Issues

### Issue: Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
pnpm dev -p 3001
```

### Issue: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

### Issue: TypeScript errors
```bash
# Check tsconfig.json is correct
# Restart TS server in VS Code: Cmd+Shift+P > "Restart TS Server"
```

---

## Useful Commands

```bash
# Development
pnpm dev                  # Start dev server
pnpm build               # Build for production
pnpm start               # Start production server
pnpm lint                # Run ESLint

# Component management
npx shadcn-ui@latest add [component-name]

# Type checking
pnpm tsc --noEmit        # Check types without building
```

---

## Resources

- 📚 [Next.js Docs](https://nextjs.org/docs)
- 📚 [React Query Docs](https://tanstack.com/query/latest)
- 📚 [Tailwind Docs](https://tailwindcss.com/docs)
- 📚 [shadcn/ui Docs](https://ui.shadcn.com)
- 📋 [Migration Plan](./MIGRATION_PLAN.md)
- ✅ [Checklist](./MIGRATION_CHECKLIST.md)

---

**You're ready to start! 🚀**
