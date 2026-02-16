# Karsaaz QR - Next.js Frontend Migration

This document summarizes the complete migration of the legacy `qr-code-frontend` (Lit/Vite) to a modern **Next.js 14 (App Router)** application. The project achieves high-fidelity feature parity, replicating complex business logic, design systems, and API integrations.

## 🚀 Key Features Implemented

### 1. **Advanced QR Code Engine**
- **Hybrid Preview System**:
  - **Backend-Driven**: Leverages the existing `/api/qrcodes/preview` endpoint for generating high-quality SVGs.
  - **Client-Side Stickers**: Implemented `CanvasTextRenderer` to overlay dynamic text (e.g., "Scan Me", Coupons) in real-time.
  - **Smart Sticky Preview**: The preview card intelligently follows the user's scroll on desktop for a seamless design experience.
- **Multi-Tab Designer**:
  - **Modules & Finders**: Full support for 15+ module shapes and 9 finder styles.
  - **Frame Shapes**: Over 60+ outlined frames (Circle, Cloud, Shopping Cart, etc.) with custom colors.
  - **Advanced Stickers**: Logic for complex stickers like **Coupons** (3-line text), **Healthcare** (heart/frame colors), and **Review Collectors** (platform logos).
  - **Logo Management**: Support for custom uploads and preset social media logos.
  - **Gradients**: Linear and Radial gradient support for QR fills.

### 2. **Authentication & Security**
- **Dual-Storage Auth**: Implemented a robust `useAuthStore` (Zustand) that syncs with `js-cookie` to handle middleware redirection and client-side state.
- **Admin Impersonation ("Act As")**: Ported the critical feature allowing admins to log in as any user without knowing their password, persisting the admin session.
- **Security Audit**: Replicated legacy protections including `iframe-detector` (clickjacking protection) and basic DevTools discouragement.

### 3. **Business & Monetization**
- **Billing System**: Full integration with Stripe via `BillingService`.
- **Checkout Flow**: Rebuilt the multi-step checkout process supporting Stripe, Account Credits, and Free Plans.
- **Subscription Enforcement**: `useSubscription` hook gates features (e.g., dynamic QRs, analytics) based on the user's active plan.

### 4. **CRM & Support Integration**
- **Support Dashboard**: Dedicated interface for managing support tickets with status and priority tracking.
- **Referral System**: Dashboard for tracking commissions and requesting withdrawals.
- **CRM Client**: Specialized `crm-client.ts` for communicating with the external CRM API.

### 5. **Admin & System Tools**
- **User Management**: Full CRUD for users with role assignment and plan management.
- **System Status**: Real-time dashboard showing server load, DB connection, and a live log viewer.
- **Settings Manager**: UI for configuring SMTP, Storage (S3/Wasabi), and general site settings.

## 🏗️ Technical Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **State Management**: Zustand (Persist middleware)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (Lazy loaded for performance)
- **Icons**: Lucide React

## 📂 Project Structure

```
nextjs-frontend/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── (auth)/          # Login, Register, Forgot Password
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   └── (public)/        # Landing, Pricing
│   ├── components/
│   │   ├── qr/              # QR Engine (Designer, Preview, Builder)
│   │   │   ├── designer/    # Sub-components (Fill, Module, Logo...)
│   │   │   └── biolinks/    # Biolink specific designer
│   │   ├── ui/              # Shadcn UI primitives
│   │   └── layout/          # Sidebar, Header, ThemeToggle
│   ├── hooks/               # Custom hooks (useQRDesign, useAuth)
│   ├── lib/                 # Utilities (api-client, crm-client)
│   ├── services/            # API Service layer (auth, qr, billing)
│   └── store/               # Global state (auth, config)
```

## 🏃‍♂️ How to Run

1.  **Install Dependencies**:
    ```bash
    cd nextjs-frontend
    npm install
    ```

2.  **Environment Setup**:
    Ensure `.env.local` is configured with the correct backend URL:
    ```env
    NEXT_PUBLIC_API_URL=http://192.168.100.17:8000/api
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## ✅ Status

The migration is **100% Complete**. All critical paths, including the complex QR creation wizard, payment flows, and admin tools, have been verified against the legacy system's logic.
