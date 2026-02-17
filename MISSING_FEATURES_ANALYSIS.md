# Next.js Frontend - Missing Features Analysis

Based on a comparison between the `ROUTES_AND_PAGES_DOCUMENTATION.md` (legacy Lit/Vite app) and the current `nextjs-frontend` codebase, the following routes, pages, and features are missing or incomplete.

## 1. Authentication & Account
| Feature | Status | Notes |
|---|---|---|
| `/account/email-verified` | ❌ Missing | Success landing page after OTP verification. Currently redirects to login. |
| `/account/upgrade` | ❌ Missing | Dedicated upgrade page supporting custom code injection points. |
| `/account/piecex-demo` | ❌ Missing | Route for demo activation and redirect logic. |
| `/account/customer-authenticator` | ❌ Missing | Embeddable multi-step auth widget for inline checkout. |
| `SMS OTP (Firebase)` | ⚠️ Partial | UI for SMS OTP login in `(auth)/login` may not be fully implemented to match legacy. |

## 2. QR Code & Bulk Operations
| Feature | Status | Notes |
|---|---|---|
| `/dashboard/bulk-operations` | ❌ Missing | Next.js has `qrcodes/bulk-create`, but lacks the dedicated tabbed manager for history, re-running, and instance management. |
| **Bulk PNG Export** | ❌ Missing | Logic to zip and download all QR images from a bulk operation instance. |
| **QR Code Templates** | ⚠️ Partial | UI for browsing/filtering public vs private templates in a gallery view (`/dashboard/qrcode-templates`). |

## 3. Checkout & Payment
| Feature | Status | Notes |
|---|---|---|
| `/checkout-account-credit` | ❌ Missing | Specific checkout flow for the "Account Credit" billing mode. |
| `/account-credit-cart` | ❌ Missing | Shopping cart view for purchasing individual QR code credits. |
| `/payment/thankyou` | ❌ Missing | Refined "Thank You" page with PRO features highlights. |
| `/payment/invalid` | ❌ Missing | Error landing page for invalid/expired payment sessions. |

## 4. User-Facing Features
| Feature | Status | Notes |
|---|---|---|
| `/dashboard/report-abuse` | ❌ Missing | Public/User form to report QR codes for scams, fraud, etc. |
| `/account/support-tickets` | ⚠️ Partial | The current `/dashboard/support` might need to be verified if it fully supports the user-side conversation view. |

## 5. System & Installation
| Feature | Status | Notes |
|---|---|---|
| `/install/*` | ❌ Missing | The multi-step installation wizard (App Details, DB, SMTP, Superuser). |

## 6. API Services Gaps
| Service | Missing Methods |
|---|---|
| `qrService` | `exportBulkZip` (client-side trigger), `getTemplatesByCategory` |
| `billingService` | `getAccountCreditPrices`, `createCreditCheckoutSession` |
| `supportService` | `autoPollTickets` logic in UI components |
