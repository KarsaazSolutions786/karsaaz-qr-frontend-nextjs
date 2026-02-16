# Karsaaz QR - Complete Routes & Pages Documentation

> **Framework:** Lit Web Components + Vite
> **Router:** Custom `<qrcg-route>` and `<qrcg-protected-route>` web components (regex-based)
> **Source:** `qr-code-frontend/src/`
> **Total Routes:** ~75+ across 36 router files

---

## Table of Contents

1. [Authentication & Account](#1-authentication--account)
2. [Karsaaz Account Dashboard](#2-karsaaz-account-dashboard)
3. [QR Code Management](#3-qr-code-management)
4. [QR Code Statistics & Analytics](#4-qr-code-statistics--analytics)
5. [Bulk Operations](#5-bulk-operations)
6. [QR Code Templates](#6-qr-code-templates)
7. [Template Categories](#7-template-categories)
8. [Lead Forms](#8-lead-forms)
9. [Dynamic Biolink Blocks](#9-dynamic-biolink-blocks)
10. [Users Management](#10-users-management)
11. [Roles Management](#11-roles-management)
12. [System / Admin](#12-system--admin)
13. [Blog Posts](#13-blog-posts)
14. [Content Blocks](#14-content-blocks)
15. [Pages (CMS)](#15-pages-cms)
16. [Contacts](#16-contacts)
17. [Custom Code Injection](#17-custom-code-injection)
18. [Translations](#18-translations)
19. [Currencies](#19-currencies)
20. [Domains](#20-domains)
21. [Subscription Plans](#21-subscription-plans)
22. [Subscriptions](#22-subscriptions)
23. [Transactions](#23-transactions)
24. [Billing Configuration](#24-billing-configuration)
25. [Payment Gateways](#25-payment-gateways)
26. [Payment Processors](#26-payment-processors)
27. [Checkout & Pricing](#27-checkout--pricing)
28. [Payment Result Pages](#28-payment-result-pages)
29. [Account Credit Cart](#29-account-credit-cart)
30. [Cloud Storage & Backup](#30-cloud-storage--backup)
31. [Plugins](#31-plugins)
32. [Referral System](#32-referral-system)
33. [Support Tickets](#33-support-tickets)
34. [Auth Workflow (OAuth)](#34-auth-workflow-oauth)
35. [Install Wizard](#35-install-wizard)

---

## 1. Authentication & Account

### `/account/login` — Login Page
- **Component:** `<qrcg-login-type-selector>`
- **Auth:** Public
- **Router:** `src/account/qrcg-account-router.js`

**Functionality:**
A smart login router that checks backend configuration and renders the correct login form variant:
- **Traditional Login** (default): Email + Password form. Calls `POST login`. Pre-fills demo credentials in dev/demo mode.
- **Passwordless Email OTP**: Renders `EmailOtpLogin` when `passwordless-auth/status` returns enabled.
- **SMS OTP (Firebase)**: Renders `PasswordlessLogin` when `app.authentication_type === 'sms_otp'`.

**API:** `GET passwordless-auth/status`
**Redirect Logic:** Logged-in users are redirected to their home page. Supports `?redirect=` query param.
**Query Params:** `?dev=true` or `?traditional=true` forces traditional login.

---

### `/account/sign-up` — Registration Page
- **Component:** `<qrcg-sign-up>`
- **Auth:** Public

**Functionality:**
Registration form with the heading "Welcome to Karsaaz QR".

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Name | Text | Required |
| Email | Text | Required |
| Mobile Number | Text | Conditional (based on system config) |
| Password | Password | Required |
| Password Confirmation | Password | Required |
| Terms & Conditions | Checkbox | Required, links to ToU and Privacy Policy |

**Actions:**
- "Sign up" button -> `POST register`
- Google Sign Up button (`<qrcg-google-sign-up-button>`)
- "Login" link -> `/account/login`

**Business Logic:**
- If `app.new_user_registration === 'disabled'`, shows a disabled message instead of the form.
- On success with email verification enabled: redirects to `/account/verify-email` with toast "OTP will expire in 10 minutes".
- On success without verification: logs in directly via `TraditionalLogin.login()`.
- Plugin filter `FILTER_SIGNUP_DATA` allows plugins to modify registration data.

---

### `/account/verify-email` — OTP Verification
- **Component:** `<qrcg-verify-email>`
- **Auth:** Public

**Functionality:**
OTP verification screen shown after registration when email verification is enabled.

**Form Fields:** OTP input (autofocus, 5-digit)

**Actions:**
- "Submit" link -> manual OTP verification
- "Resend OTP" link
- "Go to sign up page" link

**API:**
- `POST account/verify-otp-code` with `{ otp, email }`
- `POST account/resend-otp-code` with `{ email }`

**Business Logic:** Auto-submits when OTP input reaches 5 characters. On success, calls `TraditionalLogin.login()`.

---

### `/account/email-verified` — Email Verified Confirmation
- **Component:** `<qrcg-email-verified>`
- **Auth:** Public

**Functionality:** Static confirmation page: "Your email has been verified". Single "Login" button redirects to `/account/login` via hard navigation.

---

### `/account/forgot-password` — Password Recovery
- **Component:** `<qrcg-forgot-password>`
- **Auth:** Public

**Form Fields:** Email Address (required)

**Actions:** "Send Reset Link" button -> `POST forgot-password` with `{ email }`

**Business Logic:** Success screen intentionally does not reveal whether the email exists (security best practice). Shows: "If we found your email address, we've sent you reset instructions."

---

### `/account/reset-password` — Password Reset
- **Component:** `<qrcg-reset-password>`
- **Auth:** Public

**Form Fields:**
| Field | Notes |
|---|---|
| New Password | With real-time strength indicator |
| Confirm Password | Must match |
| Email & Token | Hidden, read from URL query params |

**API:** `POST reset-password` with `{ email, password, password_confirmation, token }`

**Business Logic:**
- Real-time password strength checker: length >= 8, uppercase, lowercase, number, special character.
- Displays "weak / medium / strong" badge with color coding.
- Error mapping: `passwords.user` (not found), `passwords.token` (expired), `passwords.throttled` (rate limited).

---

### `/account/my-account` — My Account Page
- **Component:** `<qrcg-my-account-page>` wrapping `<qrcg-my-account>`
- **Auth:** Protected (login required)

**Functionality:**
Full account management dashboard with sections for profile editing, subscription management, sub-users, password management, and more.

**Sections:**
- Profile info (name, email, photo)
- Subscription status (plan name, remaining days, trial info)
- QR code count and scan count
- Sub-users management
- Password reset/create modals
- Login preference settings (when passwordless enabled)
- Stripe Customer Portal link
- Logout

**API:** Various account management endpoints via `get`, `post`, `put` helpers.

---

### `/account/upgrade` — Account Upgrade
- **Component:** `<qrcg-hosted-account-upgrade>`
- **Auth:** Protected

**Functionality:** Renders a custom code injection point: `<qrcg-custom-code-renderer position="Account Upgrade: Hosted Upgrade Page">`. The actual upgrade UI is injected via the admin panel's custom code feature.

---

### `/account/piecex-demo` — PieceX Demo Activation
- **Component:** `<qrcg-piecex-demo>`
- **Auth:** Public

**Functionality:** Full-screen "Redirecting you now" overlay with spinner. Sets `localStorage['is_piecex_demo'] = 'true'`, waits 1.5s, redirects to `/account/login`.

---

### `/account/privacy-policy` — Privacy Policy
- **Component:** `<qrcg-privacy-policy>`
- **Auth:** Public

**Functionality:** Static legal page with 11 sections. Covers GDPR/UK-GDPR compliance. Discloses QR scan data collection (IP, timestamp, user agent, referrer, approximate location). Contact: `privacy@karsaaz.com`.

---

### `/account/terms-of-use` — Terms of Use
- **Component:** `<qrcg-terms-of-use>`
- **Auth:** Public

**Functionality:** Static legal page with 13 sections. Governing law: United Kingdom. Contact: `legal@karsaaz.com`, `abuse@karsaaz.com`.

---

### `/account/customer-authenticator` — Customer Authenticator
- **Component:** `<qrcg-customer-authenticator>`
- **Auth:** Public

**Functionality:** Embeddable multi-step authentication widget for inline checkout flows.

**Steps:**
1. Email input
2. Password input
3. OTP input
4. Name input (for registration)

**Scenarios:** `SCENARIO_LOGIN` and `SCENARIO_REGISTER`. Fires `authorization-success` and `authorization-failed` custom events.

---

### `/account/dashboard` — Account Dashboard Redirect
- **Auth:** Public
- **Functionality:** Redirect to `homePage()`.

---

## 2. Karsaaz Account Dashboard

### `/account/subscriptions` — My Subscriptions
- **Component:** `<karsaaz-subscriptions-screen>`
- **Auth:** Protected

**Functionality:** Paginated table of user's subscriptions with search, sort, and status badges.

**Table Columns:** Subscription ID, Plan Name, Amount, Start Date, Expire Date, Status, Actions

**Actions:**
- Search by name/ID/status
- Sortable column headers (asc/desc)
- "Refresh" button
- "View Details" -> detail modal per subscription
- "Cancel Plan" -> cancel confirmation modal (active subscriptions only)
- Pagination (10 items/page)

**API:**
- `GET /api/subscriptions/user`
- `POST /api/subscriptions/{id}/cancel`

**Status Types:** active, canceled, expired, pending, pending_payment, trialing, past_due

---

### `/account/billing` — Billing & Invoices
- **Component:** `<karsaaz-billing-invoices-screen>`
- **Auth:** Protected

**Functionality:** Invoice table with summary stats and Stripe integration.

**Summary Cards:** Total Invoices, Paid, Pending, Overdue, Total Amount

**Table Columns:** Invoice ID, Description, Subscription Plans, Amount, Date, Due Date, Status, Actions

**Filters:** Text search, Status dropdown (All/Paid/Pending/Overdue), Column sorting

**Actions per row:**
- "View" -> opens Stripe-hosted invoice URL
- "Download" -> opens Stripe PDF in new tab

**API:** `GET /api/stripe/invoices/all`

**Business Logic:** Amounts from Stripe are in pence/cents, divided by 100 for display. Uses `Intl.NumberFormat` for currency formatting.

---

### `/account/payment-methods` — Payment Methods
- **Component:** `<karsaaz-payment-methods-screen>`
- **Auth:** Protected

**Functionality:** Grid of saved payment method cards with "Add New" card.

> **Note:** Currently uses hardcoded mock data. `savePaymentMethod()` and `updatePaymentMethod()` are empty stubs.

**Add Modal Fields:**
- Payment Type (Credit Card / PayPal)
- Credit Card: Card Number, Expiry Month/Year, CVC, Cardholder Name, Address, City, State, Postal Code, Country
- PayPal: PayPal Email

**Actions:** Add, Set as Default, Edit, Delete (all local state only, no API)

---

### `/account/account-details` — Account Details
- **Component:** `<karsaaz-account-details-screen>`
- **Auth:** Protected

**Functionality:** Two-column account management with four sections.

> **Note:** API calls are simulated with `setTimeout`. No real API is wired.

**Sections:**
1. **Profile Information:** First Name, Last Name, Email, Phone, Company, Job Title (editable via toggle)
2. **Account Settings:** Timezone, Language, Email notifications, Marketing emails
3. **Account Information:** Read-only (Member since, Account type, Last login, Account ID, 2FA status)
4. **Danger Zone:** Delete Account (requires typing "DELETE")

**Change Password Modal:** Current Password, New Password, Confirm (client-side validation: >= 8 chars, must match)

---

### `/account/promo-codes` — Promo Codes & Account Hub
- **Component:** `<qrcg-promo-code-page>`
- **Auth:** Protected

**Functionality:** Tabbed account dashboard container.

**Tabs:**
1. Promo Codes (default) -> `<qrcg-promo-code>`
2. Billing & Invoices -> `<karsaaz-billing-invoices-screen>`
3. Subscriptions -> `<karsaaz-subscriptions-screen>`
4. Referrals & Commissions -> `<karsaaz-referral-system-screen>`

---

## 3. QR Code Management

### `/dashboard/qrcodes` — QR Code List
- **Component:** `<qrcg-qrcode-list-page>`
- **Auth:** Permission `qrcode.list`
- **Router:** `src/qrcode-module/qrcg-qrcode-router.js`

**Functionality:** The main QR code dashboard listing page with two display modes.

**Display Modes:**
- **Detailed mode** (default): Full rows with all QR code metadata via `qrcg-qrcode-row`
- **Minimal mode**: Compact card layout via `qrcg-qrcode-minimal-card`

**Header Actions (Detailed mode):**
- "Create QR" button -> `/dashboard/qrcodes/new`
- "Select" button -> enables multi-select mode
- "Sort" dropdown: Name A-Z/Z-A, Type A-Z/Z-A, Most/Fewest Scans, Most Recent/Oldest
- "Filters" button -> opens filter modal
- Live search input

**Filter Modal Fields:**
- Keyword (name or slug)
- Number of Scans (range)
- Filter By Type (yes/no toggle)
- QR Code Type (multi-select)
- User search (superadmin only)

**Selection Toolbar (2+ items selected):**
- Archive / Restore (with confirmation)
- Delete (archived page only)
- Change Owner (superadmin only)
- Move To Folder
- Download PNG (trial: 512px; pro: size selection)
- Download SVG (pro/admin only)
- Backup to Cloud

**Pagination:** Mobile default 5, desktop default 10. Configurable via settings modal.

**API:**
- `GET qrcodes` (with params: page, page_size, search_archived, folder_id, sort, keyword, type, scans_count, user_id, path)
- `POST qrcodes/archive/{id}`
- `DELETE qrcodes/{id}`
- `POST qrcodes/{id}/change-user`
- `PUT qrcodes/{id}`

---

### `/dashboard/qrcodes/new` — Create QR Code
### `/dashboard/qrcodes/edit/:id` — Edit QR Code
- **Component:** `<qrcg-qrcode-form-page>` wrapping `<qrcg-new-qrcode-form-adapter>` and `<qrcg-qrcode-form>`
- **Auth:** Permission `qrcode.store`

**Functionality:** Multi-step QR code creation/editing wizard.

**Pre-Form Flow (New QR only):**
1. **Template Categories view** — if categories exist, shows a grid of category cards. "Start from scratch" link bypasses.
2. **Category Templates view** — templates filtered by selected category.
3. **Start Blank / Select Template** — if templates exist but no categories.
4. Falls through to the form directly on edit, small devices, or "Create Blank".

**Form Steps (Wizard):**
| Step | Component | Description |
|---|---|---|
| Type | `qrcg-qrcode-type-selector` | Choose QR code type |
| Data | Type-specific form | Content/data entry for the selected type |
| Select Color | `qrcg-qrcode-designer` (color mode) | Color customization |
| Look & Feel | `qrcg-qrcode-designer` (look-and-feel mode) | Shape/pattern customization |
| Sticker | `qrcg-qrcode-designer` (sticker mode) | Sticker/frame customization |
| Download | `qrcg-download-qrcode` | Download the final QR code |

**QR Code Types Supported (16 types):**
| Type | Description |
|---|---|
| VCardPlus | Virtual business card with rich fields |
| BusinessProfile | Company profile page with portfolio |
| BusinessReview | Business review collection with feedback |
| Base (URL) | Generic URL redirect (catch-all `*`) |
| GoogleReview | Redirect to Google review page |
| RestaurantMenu | Restaurant menu display |
| ProductCatalogue | Product catalogue display |
| BioLinks | Bio link page with extensive block system |
| Event | Event with date/time inputs |
| LeadForm | Lead capture form |
| Resume | Resume/CV display |
| FileUpload | File upload landing page |
| AppDownload | App store download redirect |
| WebsiteBuilder | Website builder |
| UPI (Static) | UPI payment QR (static) |
| UPI (Dynamic) | UPI payment QR (dynamic) |

**Header Actions (gear icon):**
- QR code link display
- Stats link
- "Use Template" button
- "Change Type" button
- "Save as Template" button

**API:**
- `GET qrcodes/{id}` (edit)
- `POST qrcodes` (create)
- `PUT qrcodes/{id}` (update)
- `GET template-categories?no-pagination=true`
- `GET qrcode-templates`

---

### `/dashboard/qrcodes/bulk-create` — Bulk Create (redirects to Bulk Operations)

Redirects to `/dashboard/bulk-operations`. See [Bulk Operations](#5-bulk-operations).

---

## 4. QR Code Statistics & Analytics

### `/dashboard/qrcodes/stats/:id` — QR Code Stats
- **Component:** `<qrcg-qrcode-stats-page>` wrapping `<qrcg-qrcode-stats>`
- **Auth:** Permission `qrcode.showStats`

**Functionality:** Analytics dashboard for a single QR code.

**Header:**
- QR code name with link to edit page
- Date range selector: "Last 15 days" (default), "Last 30 days", "Last 90 days", "Custom"
- Custom range opens date picker modal

**Reports Grid (8 charts, 2-column layout):**
| Report | Chart Type |
|---|---|
| Scans Per Day | Line chart |
| Scans Per Hour | Chart |
| Scans Per Operating System | Chart |
| Scans Per Device Brand | Chart |
| Scans Per Browser | Chart |
| Scans Per Language | Chart |
| Scans Per Country | Chart |
| Scans Per City | Chart |

Each report supports **CSV export** via `QrcgArrayToCsvConverter`.

**API (per report):**
- `GET qrcodes/{id}/reports/scans-per-day?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-hour?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-operating-system?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-device-brand?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-browser?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-language?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-country?from={date}&to={date}`
- `GET qrcodes/{id}/reports/scans-per-city?from={date}&to={date}`

---

## 5. Bulk Operations

### `/dashboard/bulk-operations` — Bulk Operations
- **Component:** `<qrcg-bulk-operations-page>`
- **Auth:** Permission `qrcode.store`

**Functionality:** Tab-based bulk operations manager. Currently one operation: **"Import QR Codes"**.

**Import QR Codes Form:**
- CSV file upload input (`.csv`)
- Instructions with available template variables: `QRCODE_SLUG`, `QRCODE_ID`, `RANDOM_PINCODE`
- Link to download sample CSV

**Past Instances List:**
- Instance ID, date, name (editable), progress indicator, status badge
- Per-instance actions:
  - **Re-Run** -> `POST bulk-operations/{id}/re-run` (with confirmation)
  - **Download PNG** -> fetches each QR code and downloads as PNG
  - **Export CSV** -> `/api/bulk-operations/export-csv/{id}`
  - **Delete Bulk Operation** -> `DELETE bulk-operations/{id}` (keeps QR codes)
  - **Delete All QR Codes** -> `DELETE bulk-operations/{id}/all-qrcodes`

**PNG export size:** Configurable via `bulk_operation.export-qrcode-size` (default 2024px).

**Note:** In demo mode or on small devices, shows a teaser/blocked content.

---

## 6. QR Code Templates

### `/dashboard/qrcode-templates` — Templates Page
- **Component:** `<qrcg-qrcode-templates-page>` wrapping `<qrcg-qrcode-templates-list>`
- **Auth:** Permission `qrcode-template.list`

**Functionality:** Browsable template gallery with two sections.

**Sections:**
- **My Templates** — `template_access_level == 'private'`
- **Public Templates** — `template_access_level == 'public'`

**Search/Filter:**
- Keyword search (500ms debounce, full-text match)
- Type filter modal (single type)
- Templates filtered by current subscription plan's allowed types

**Template Actions:**
- Click template card -> opens detail modal
- "Use Template" -> creates new QR code from template
- "Delete Template"

**API:** `GET qrcode-templates`

---

## 7. Template Categories

### `/dashboard/template-categories` — Template Categories List
- **Component:** `<qrcg-template-categories-page>`
- **Auth:** Permission `template-category.store`

**Table Columns:** ID, Name, Sort Order, Actions (Edit, Delete)

**API:** `GET template-categories`, `DELETE template-categories/{id}`

---

### `/dashboard/template-categories/new` | `/dashboard/template-categories/edit/:id` — Template Category Form
- **Component:** `<qrcg-template-category-form-page>`
- **Auth:** Permission `template-category.store`

**Form Fields:**
| Field | Type |
|---|---|
| Name | Text |
| Color | Color picker (`text_color`) |
| Image | File upload (`image_id`) |
| Sort Order | Number |

**API:** `GET/POST/PUT template-categories`

---

## 8. Lead Forms

### `/dashboard/lead-forms` — Lead Form Submissions
- **Component:** `<qrcg-lead-form-list-page>`
- **Auth:** Permission `lead-form.list`

**Functionality:** Read-only "submissions inbox" — a grouped view of all lead forms and their collected responses.

**Display:** Each lead form shows as a card with:
- Header: Linked QR code's name (or "Lead Form #{id} - QR Code Not Found")
- Body: All form submission responses via `qrcg-lead-form-responses`

**API:** `GET lead-forms` (paginated)

**Note:** No create/edit/delete actions. Lead forms are created via the QR code form (LeadFormType).

---

## 9. Dynamic Biolink Blocks

### `/dashboard/dynamic-biolink-blocks` — Dynamic Biolink Blocks List
- **Component:** `<qrcg-dynamic-biolink-block-list-page>`
- **Auth:** Permission `dynamic-biolink-block.list-all`

**Table Columns:** ID, Name, Actions (Edit, Delete)

**API:** `GET dynamic-biolink-blocks`, `DELETE dynamic-biolink-blocks/{id}`

---

### `/dashboard/dynamic-biolink-blocks/new` | `edit/:id` — Dynamic Biolink Block Form
- **Component:** `<qrcg-dynamic-biolink-block-form-page>`
- **Auth:** Permission `dynamic-biolink-block.update-any`

**Form Sections:**
1. **Block Details:** Name, Icon (file upload)
2. **Fields:** Custom field schema definition (what fields users fill when adding this block to a bio link)
3. **Custom Code:** Code editor for HTML/JS injected on every Bio Link page where this block is used

**API:** `GET/POST/PUT dynamic-biolink-blocks`, `POST dynamic-biolink-blocks/store-file`

**Business Logic:** Dynamic Biolink Blocks are reusable custom block types for Bio Link QR code pages. Admins define custom structured content blocks with their own field schema, icon, and optional custom code.

---

## 10. Users Management

### `/dashboard/users` — Users List
- **Component:** `<qrcg-user-list-page>`
- **Auth:** Permission `user.list-all`

**Table Columns:** ID, Name, Email, Mobile, Role, QR Count, Scans, Main User, Created at, Actions

**Search/Filter:** Text search by name/email. Advanced filter modal. URL param `paying` for paying users.

**Actions per row:**
| Action | API | Notes |
|---|---|---|
| Act As | `POST account/act-as/:id` | Impersonates user, receives token, redirects |
| Edit | Navigate | `/dashboard/users/:id/edit` |
| Magic Login URL | `POST account/generate-magic-login-url/:id` | Shows copyable URL, valid 24h |
| Delete | `DELETE users/:id` | Warns: deletes QR codes, subscriptions, transactions |
| Reset Role | `POST users/:id/reset-role` | With confirmation |
| Reset Scan Limits | `POST users/:id/reset-scans-limit` | With confirmation |

---

### `/dashboard/users/new` | `/dashboard/users/edit/:id` — User Form
- **Component:** `<qrcg-user-form-page>`
- **Auth:** Permission `user.store`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Name | Text | "Full name" |
| Email | Email | |
| Mobile Number | Text | Conditional (system config) |
| Password | Password | "Leave empty to keep unchanged" |
| Password Confirmation | Password | |
| Role | Relation select | From `GET roles` |
| Email Verification | Display/Button | "Verify Email" -> `POST users/verify-email/:id` |
| Account Balance | Balance editor | For account credit mode |
| Sub-users | Sub-users list | |

---

## 11. Roles Management

### `/dashboard/roles` — Roles List
- **Component:** `<qrcg-role-list-page>`
- **Auth:** Permission `role.list-all`

**Table Columns:** ID, Name, Permissions (count), Users (count), Created at, Actions

**Note:** Rows marked `read_only` have no action buttons.

---

### `/dashboard/roles/new` | `/dashboard/roles/edit/:id` — Role Form
- **Component:** `<qrcg-role-form-page>`
- **Auth:** Permission `role.store`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Name | Text | Role name |
| Home Page | Text | Landing page path after login (e.g., `/dashboard/qrcodes`) |
| Permissions | Multi-select | Permission picker via `qrcg-permissions-input` |

---

## 12. System / Admin

### `/dashboard/system` — System Redirect
- **Functionality:** Redirects to `/dashboard/system/status`

---

### `/dashboard/system/status` — System Status
- **Component:** `<qrcg-system-status>`
- **Auth:** Permission `system.status`

**Functionality:** System health check dashboard. Shows entries with title, status icon (green/orange), text summary, optional information, and instructions.

**Actions:** Refresh button, responds to `qrcg-system-status:request-refresh` events.

**API:**
- `GET system/status` -> `{ entries: [...] }`
- `GET system/check_database_update` -> `{ update_available: boolean }`

---

### `/dashboard/system/settings` — System Settings
- **Component:** `<qrcg-system-settings-form>`
- **Auth:** Permission `system.settings`

**Functionality:** Tabbed settings page with 10 tabs:

| Tab | Key Settings |
|---|---|
| **General** | App name, slogan, powered-by name, homepage meta, timezone, frontend URL, pricing URL |
| **Dashboard** | Dashboard area settings |
| **Authentication** | Email verification, logout action, registration toggle, mobile number, passwordless checkout, Firebase config |
| **Appearance** | Color pickers (primary, accent, sidebar, ribbon, checkout gradient), fonts, scrollbar, banner |
| **Logo & Favicon** | Logo and favicon uploads |
| **Menus** | Menu configuration |
| **QR Code Types** | QR code type settings |
| **Email (SMTP)** | SMTP host/username/password/encryption/port/from, "Send Test Email" |
| **Storage** | Storage type (Local/S3), S3 credentials, "Test Connection" |
| **Advanced** | Password rules, account lock, API keys (Google, MaxMind, reCaptcha), billing mode, cookie consent, many feature toggles, Auth0 config |

**API:** `GET/POST system/settings`, `POST system/test-storage`

---

### `/dashboard/system/notifications` — Notification Templates
- **Component:** `<qrcg-system-notifications-form>`
- **Auth:** Permission `system.notifications`

**Functionality:** 9 email/SMS notification templates:

| Template | Trigger |
|---|---|
| Trial Expired | When trial expires |
| Subscription Expiring Soon | Before subscription expires |
| Subscription Expired | When subscription expires |
| Dynamic QR Code Limit Reached | QR code quota hit |
| Scan Limit Reached | Scan quota hit |
| Invite User | User invitation sent |
| Bulk Operation Completed | Bulk operation finishes |
| Lead Form Response | Lead form submitted |
| Custom Form Response | Custom form submitted |

**Fields per template:** Enabled (ON/OFF), Email Subject, Email Body (markdown), SMS Body, Template Variables

---

### `/dashboard/system/sms` — SMS Portal Settings
- **Component:** `<qrcg-system-sms-form>`
- **Auth:** Permission `system.sms-portals`

**Fields:** API Key, Server URL (RBSoft SMS Portal integration)

---

### `/dashboard/system/logs` — System Logs
- **Component:** `<qrcg-system-logs-page>`
- **Auth:** Permission `system.logs`

**Functionality:** Read-only textarea showing last 500 lines of server log file.

**Actions:**
- "Download Log File" -> `POST system/log-file` (signed URL download)
- "Clear Logs" -> `DELETE system/log-file` (with confirmation)
- Refresh button

**API:** `GET system/logs` (base64-encoded), `POST system/log-file`, `DELETE system/log-file`

---

### `/dashboard/system/cache` — Cache Management
- **Component:** `<qrcg-system-cache-page>`
- **Auth:** Permission `system.cache`

**Cache Types:**
| Type | Description | Actions |
|---|---|---|
| Views Cache | Front-end view performance | Clear / Rebuild |
| Config Cache | Combined configuration file | Clear / Rebuild |

**API:** `POST system/clear-cache/{type}`, `POST system/rebuild-cache/{type}`

---

### `/dashboard/admin/abuse-reports` — Abuse Reports Admin
- **Component:** `<qrcg-abuse-reports>`
- **Auth:** Permission `system.status`

**Table Columns:** Date, Category (badge), Details (truncated), QR Code (link), Reporter IP, Status, Actions

**Status Badges:** Pending (yellow), Resolved (green), Dismissed (gray)

**Filter Buttons:** Pending (default), Resolved, Dismissed, All

**Actions per row:**
- "Resolve" -> modal with admin notes -> `PUT admin/abuse-reports/:id/status`
- "Dismiss" -> modal with admin notes -> `PUT admin/abuse-reports/:id/status`

**API:** `GET admin/abuse-reports?page=&status=`, `PUT admin/abuse-reports/:id/status`

---

### `/dashboard/report-abuse` — Submit Abuse Report (User)
- **Component:** `<qrcg-submit-abuse-report>`
- **Auth:** Protected (login required)

**Form Fields:**
- QR code search (live search dropdown, min 2 chars)
- Category grid (required): Scam, Fraud, Impersonation, Illegal Content, Copyright, Other
- Details textarea (optional)

**API:**
- `GET qrcodes?keyword=&page_size=10` (search)
- `POST abuse-reports` with `{ qrcode_id, qrcode_hash, category, details }`

---

## 13. Blog Posts

### `/dashboard/blog-posts` — Blog Posts List
- **Component:** `<qrcg-blog-post-list-page>`
- **Auth:** Protected

**Table Columns:** ID, Title, Language, Published at, Actions (Edit, Delete)

---

### `/dashboard/blog-posts/new` | `edit/:id` — Blog Post Form
- **Component:** `<qrcg-blog-post-form-page>`
- **Auth:** Protected

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Title | Text | |
| Content | Markdown editor | 10 rows |
| Excerpt | Textarea | Optional, shown on blog index |
| Meta Description | Textarea | Max 160 chars |
| Featured Image | File upload | Disabled until record saved |
| Published At | Date | Only past dates appear on frontend |
| Language | Relation select | From active translations |

**Actions:** "Preview" button (edit mode only) -> opens `<app_url>/blog/post/<slug>`

---

## 14. Content Blocks

### `/dashboard/content-blocks` — Content Blocks List
- **Component:** `<qrcg-content-blocks-list-page>`
- **Auth:** Protected

**Table Columns:** Title, Position, Language, Sort Order, Created, Actions

**Language Filter:** Relation select from translations. Syncs with URL query params.

**Actions:**
- "Delete all" (by language) -> `DELETE content-blocks/of-translation/:translation_id`
- "Copy all" -> Copy content blocks from one language to another

---

### `/dashboard/content-blocks/new` | `edit/:id` — Content Block Form
- **Component:** `<qrcg-content-blocks-form-page>`
- **Auth:** Protected

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Title | Text | Block title |
| Position | Select | Options from server config `content-manager.positions` |
| Sort Order | Number | Controls order within position |
| Content | Markdown editor | The actual block content |
| Language | Relation select | From active translations |

---

## 15. Pages (CMS)

### `/dashboard/pages` — Pages List
- **Component:** `<qrcg-page-list-page>`
- **Auth:** Permission `page.list-all`

**Table Columns:** ID, Title, Slug, Published (YES/NO badge), Actions

---

### `/dashboard/pages/new` | `edit/:id` — Page Form
- **Component:** `<qrcg-page-form-page>`
- **Auth:** Permission `page.update-any`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Title | Text | Auto-slugifies into slug field |
| Slug | Text | Live URL preview below: `<app_url>/<slug>` |
| HTML Content | Code editor | Full HTML editor |
| Meta Description | Textarea | Max 160 chars |
| Published | Checkbox | |

---

## 16. Contacts

### `/dashboard/contacts` — Contact Submissions List
- **Component:** `<qrcg-contact-list-page>`
- **Auth:** Protected

**Table Columns:** Name, Email, Subject, Actions

**Note:** No "Create" button. Records come from the public contact form.

---

### `/dashboard/contacts/edit/:id` — Contact View/Edit
- **Component:** `<qrcg-contact-form-page>`
- **Auth:** Protected

**Form Fields:** Name, Email, Subject, Message, Internal Notes (admin-only, not exposed to customer)

---

## 17. Custom Code Injection

### `/dashboard/custom-codes` — Custom Code List
- **Component:** `<qrcg-custom-code-list-page>`
- **Auth:** Permission `custom-code.list-all`

**Table Columns:** ID, Name, Language, Position, Sort Order, Actions

---

### `/dashboard/custom-codes/new` | `edit/:id` — Custom Code Form
- **Component:** `<qrcg-custom-code-form-page>`
- **Auth:** Permission `custom-code.update-any`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Name | Text | e.g., "Facebook Pixel" |
| Language | Select | JavaScript, HTML, CSS |
| Position | Searchable select | Options from `GET custom-codes/positions` |
| Sort Order | Number | Controls injection order |
| Code | Code editor | Syntax highlighting matches selected language |

**Business Logic:** Positions are server-defined (not hardcoded). Code editor language is reactive.

---

## 18. Translations

### `/dashboard/translations` — Translations List
- **Component:** `<qrcg-translation-list-page>`
- **Auth:** Permission `translation.list-all`

**Table Columns:** ID, Name, Locale, Active (badge), Main Language (badge), Completeness (%), Actions

**Actions per row:**
| Action | API | Notes |
|---|---|---|
| Edit | Navigate | |
| Delete | Standard | |
| Activate/Disable | `POST translations/{id}/toggle-activate` | With confirmation |
| Auto Translate | `POST translations/{id}/auto-translate` | Requires Google API key; fills only empty values |
| Set Main Language | `POST translations/{id}/set-main` | With confirmation |

**API:** `GET translations/can-auto-translate` checks Google API key availability.

---

### `/dashboard/translations/new` | `edit/:id` — Translation Form
- **Component:** `<qrcg-translation-form-page>`
- **Auth:** Permission `translation.store`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Name | Text | Disabled if default translation |
| Display Name | Text | Shown in language picker |
| Locale | Text | Locale code; disabled if default |
| Direction | Balloon selector | RTL or LTR |
| Flag Image | File upload | |
| Translation File | File upload | `.json` only; uploads to `translations/{id}/upload`; disabled until saved |

---

## 19. Currencies

### `/dashboard/currencies` — Currencies List
- **Component:** `<qrcg-currency-list-page>`
- **Auth:** Permission `currency.list-any`

**Table Columns:** ID, Name, Currency Code, Symbol, Enabled (badge), Actions

**Actions:** Enable (`POST currencies/{id}/enable` with confirmation), Edit, Delete

---

### `/dashboard/currencies/new` | `edit/:id` — Currency Form
- **Component:** `<qrcg-currency-form-page>`
- **Auth:** Permission `currency.update-any`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Name | Text | Currency name |
| Currency Code | Text | ISO code (e.g., USD) |
| Symbol | Text | e.g., $ |
| Thousands Separator | Text | e.g., `,` |
| Decimal Separator | Text | e.g., `.` |
| Decimal Separator Enabled | Balloon selector | Always show decimal (e.g., 10.00) |
| Symbol Position | Balloon selector | Before Number / After Number |

---

## 20. Domains

### `/dashboard/domains` — Domains List
- **Component:** `<qrcg-domain-list-page>`
- **Auth:** Permission `domain.list-all`

**Table Columns:** ID, Host, Availability (Public/Private), Status (badge), Default? (badge), Owner (linked), Actions

**Filters:** Status filter (balloon selector), Text search by host/owner. Filter state in URL query params.

---

### `/dashboard/domains/new` | `edit/:id` — Domain Form (Admin)
- **Component:** `<qrcg-domain-form-page>`
- **Auth:** Permission `domain.update-any`

**Form Fields:**
| Field | Type | Notes |
|---|---|---|
| Connectivity Status | Live checker | Auto-refreshes after save |
| Host | Text | e.g., `domain.com` |
| Protocol | Balloon selector | `http` or `https` |
| Sort Order | Number | Order in domain pickers |
| Is Default | Display + Button | "Set as default" -> `PUT domains/{id}/set-default` |
| Status | Display + Button | Opens change status modal |
| Availability | Display + Button | Opens change availability modal |
| Home Page QR Code | Relation select | From all QR codes |

---

### `/dashboard/domains/add` — Add Custom Domain (User)
- **Component:** `<qrcg-domain-add-page>`
- **Auth:** Permission `domain.add`

**Functionality:** User-facing flow for white-label custom domains.

**Form Fields:** Domain Name (e.g., `qr.your-website.com`), Connectivity Status checker, My Domains list with "Test Connection"

**Business Logic:** Shows DNS CNAME instructions. When connectivity check succeeds on a `draft` domain, status auto-promotes to `in-progress` via `PUT domains/{id}/update-status`.

---

## 21. Subscription Plans

### `/dashboard/subscription-plans` — Subscription Plans List
- **Component:** `<qrcg-subscription-plan-list-page>`
- **Auth:** Permission `subscription-plan.list-all`

**Table Columns:** Name, Price, Frequency, Allowed QRs, Scans, Trial (badge), Actions (Duplicate, Edit, Delete)

**API:** `POST subscription-plans/{id}/duplicate`

---

### `/dashboard/subscription-plans/new` | `edit/:id` — Subscription Plan Form
- **Component:** `<qrcg-subscription-plan-form-page>`
- **Auth:** Permission `subscription-plan.store`

**Form Sections:**

**Basic Details:**
| Field | Notes |
|---|---|
| Name | With i18n field translator |
| Frequency | Monthly / Yearly / Life Time |
| Price | 0 = free plan |
| Sort Order | Display order |
| Hidden | Hide from pricing page |
| Is Trial | Enables trial mode |
| Trial Days | Shown when Is Trial checked |

**Plan Configuration:**
| Field | Notes |
|---|---|
| Number of Dynamic QR Codes | -1 = unlimited |
| Number of Scans | -1 = unlimited |
| Number of Custom Domains | -1 = unlimited |
| Upload File Size Limit | In MB |
| Number of Users | Extended license only |
| Number of Menu Items | Extended license only |
| Number of Products | Extended license only |
| Number of AI Generations | Extended license only |
| Number of Bulk Created QR Codes | Extended license only |

**Other Sections:** Ads Settings, Available Types (multi-select), Dynamic Type Limits, Features, Checkpoints, Checkout Link

---

### `/dashboard/subscription-plans/credit-pricing` — Credit Pricing
- **Component:** `<qrcg-credit-pricing-page>`
- **Auth:** Permission `subscription-plan.list-all`

**Functionality:** Admin page for configuring per-QR-code credit prices.

**Fields:**
- Dynamic QR Code Price (number, min 1)
- Static QR Code Price (number, min 1)

**Note:** Only shown when billing mode is "Account Credit" (alternative to subscriptions).

---

## 22. Subscriptions

### `/dashboard/subscriptions` — Subscriptions List (Admin)
- **Component:** `<qrcg-subscription-list-page>`
- **Auth:** Permission `subscription.list-all`

**Table Columns:** ID, Name (linked to user), Email (linked to user), Plan (name + frequency), Status, Expires At, Started At, Actions

**Actions:**
- "Delete" button -> bulk deletes all pending subscriptions (`POST /subscriptions/delete-pending`)
- Per row: Edit, View Billing Details (modal)

---

### `/dashboard/subscriptions/new` | `edit/:id` — Subscription Form (Admin)
- **Component:** `<qrcg-subscription-form-page>`
- **Auth:** Permission `subscription.store`

**Form Fields:** User (searchable select), Subscription Plan (searchable select), Status (from `subscriptions/statuses`), Expires At (date)

---

## 23. Transactions

### `/dashboard/transactions` — Transactions List (Admin)
- **Component:** `<qrcg-transaction-list-page>`
- **Auth:** Permission `transaction.list-all`

**Table Columns:** ID, Amount, User, Description, Source, Stripe Payment ID, Status, Date, Actions

**Actions (offline-payment only):**
- "Payment Proof" -> opens attachment in new tab
- "Approve" -> `POST transactions/{id}/approve` (with confirmation)
- "Reject" -> `POST transactions/{id}/reject` (with confirmation)

---

## 24. Billing Configuration

### `/dashboard/billing` — Billing Settings (Admin)
- **Component:** `<qrcg-billing-page>`
- **Auth:** Protected

**Form Fields:**
| Field | Notes |
|---|---|
| Billing Collection | Enabled/Disabled (default: disabled) |
| Private Customer Details | Form builder for individual customer fields |
| Company Details | Form builder for company customer fields |

**Business Logic:** Forms defined here are rendered during checkout via `qrcg-billing-details-collector`.

---

## 25. Payment Gateways

### `/dashboard/payment-gateways` — Payment Gateways List
- **Component:** `<qrcg-payment-gateway-list-page>`
- **Auth:** Permission `payment-gateway.list-all`

**Table Columns:** ID, Name, Enabled (ON/OFF badge), Actions (Edit only, no delete)

---

### `/dashboard/payment-gateways/edit/:id` — Payment Gateway Form
- **Component:** `<qrcg-payment-gateway-form-page>`
- **Auth:** Permission `payment-gateway.update-any`

**Common Fields:** Name, Mode (Sandbox/Live), Enabled (ON/OFF)

**Stripe-specific:** Publisher Key, Secret Key
**PayPal-specific:** Client ID, Client Secret
**Offline Payment:** Instructions for Customers (markdown)

---

## 26. Payment Processors

### `/dashboard/payment-processors` — Payment Processors Configuration
- **Component:** `<qrcg-payment-processors-page>`
- **Auth:** Permission `payment-processors.manage`

**Functionality:** Tab-based configuration for 23 payment processors.

**Processors:**
Stripe, PayPal, PayU International, Paddle (Classic), Paddle (Billing), Razorpay, Mercado Pago, PayTR, PayFast, Xendit, Mollie, PayStack, Alipay China, YooKassa, PayKickstart, Orange (Mobile Money), PayU Latam, 2Checkout, Dintero, FIB, Post Finance, Flutter Wave, Offline Payments

**Common Fields per processor:**
| Field | Notes |
|---|---|
| Enabled | ON/OFF |
| Display Name | Shown to customers in checkout |
| Pay Button Text | Placeholder "Pay Now" |
| Sort Order | Controls tab order in checkout |

**Stripe-specific:** Publisher Key, Secret Key, Automatic Tax, Tax Behavior (Inclusive/Exclusive)

**API per processor:**
- `POST payment-processors/{slug}/test-credentials`
- `POST payment-processors/{slug}/register-webhook`

---

## 27. Checkout & Pricing

### `/checkout` — Checkout Page
- **Component:** `<qrcg-checkout>`
- **Auth:** Public (redirects to sign-up if not logged in)

**Functionality:** Subscription plan checkout with billing details and payment processor selection.

**Display:** Plan name, dynamic QR codes allowed, scans, frequency, subtotal, total price

**Flow:**
1. Plan loaded from URL `?plan-id=X` or localStorage
2. Payment processors fetched from `GET payment-processors`
3. Billing details collected (if enabled) via `qrcg-billing-details-collector`
4. Payment processor selected (tabs if multiple)
5. "Pay" button -> `POST payment-processors/{slug}/generate-pay-link/{planId}` -> redirects to payment page

**Special:** `?action=change-plan` changes title/button to "Change Plan"

---

### `/checkout-account-credit` — Account Credit Checkout
- **Component:** `<qrcg-account-credit-checkout>`
- **Auth:** Permission `qrcode.store`

**Functionality:** PayPal-only checkout for buying account credits.

**Amount Options:** $5, $10, $20, $30, $40, $50 (pre-set buttons) or custom amount (min $5)

**API:** `POST payment-processors/paypal/create-charge-link/{amount}` -> redirects to PayPal

---

### `/pricing` — Pricing Page
- **Component:** `<qrcg-pricing-page-dynamic>`
- **Auth:** Protected

**Functionality:** Public pricing page with animated plan cards and Monthly/Yearly toggle.

**Per card:** Plan name, user count, price, feature checklist (scans, QR codes, shapes, fonts, types, domains, file limit)

**CTA:** "Subscribe now" -> `/checkout?plan-id={id}` or "Sign up" for free plans

**API:** `GET subscription-plans?all=true` (filters out hidden and trial)

---

## 28. Payment Result Pages

### `/payment/success` — Payment Success
- **Component:** `<qrcg-payment-success>`
- **Auth:** Public

**States:** Loading ("Processing Payment..."), Success (green card, 3s redirect), Error (red card, 5s redirect)

**API:** `GET /api/payment/success?payment_gateway={gateway}&s_id={stripeSessionId}`

**Business Logic:** On success may clear storage, refresh user data, redirect. Reads `processor`, `payment_gateway`, `s_id` from URL params.

---

### `/payment/thankyou` — Payment Thank You
- **Component:** `<qrcg-payment-thankyou>`
- **Auth:** Public

**Functionality:** Green gradient "Thank You" card with bouncing emoji, custom message, PRO features list, and countdown redirect.

**API:** `GET /api/payment/thankyou`

---

### `/payment/canceled` — Payment Canceled
- **Component:** `<qrcg-payment-canceled>`
- **Auth:** Public

**Functionality:** Warning card with info box (no charges, subscription unchanged). Three buttons: "Try Again" -> `/pricing-plans`, "Back to Account" -> `/account/login`, "Auto Redirect (10s)" (opt-in countdown).

**API:** `GET /api/payment/canceled`

---

### `/payment/invalid` — Payment Invalid
- **Component:** `<qrcg-payment-invalid>`
- **Auth:** Public

**Functionality:** Red error card with possible causes list and support contact. 15s opt-in countdown.

**API:** `GET /api/payment/invalid`

---

## 29. Account Credit Cart

### `/account-credit-cart` — Account Credit Shopping Cart
- **Component:** `<qrcg-account-credit-cart-view>`
- **Auth:** Public (non-build mode only)

**Functionality:** Shopping cart for individual QR code credit purchases.

**Display:** Cart items with quantity controls, unit price, line subtotal, total, available credit, amount to pay

**Actions:** Increase/decrease quantity, remove item, "Pay With PayPal"

**API:** `POST payment-processors/paypal/create-charge-link/{amount}`

---

## 30. Cloud Storage & Backup

### `/dashboard/cloud-storage` — Cloud Storage
- **Component:** `<qrcg-cloud-storage-page>`
- **Auth:** Protected

**Two Tabs:**

**Tab 1: Connections**
- Connected cloud provider cards
- "Add Connection" -> OAuth provider selector modal
- "Start Backup" per connection

**Tab 2: Backup History**
- Table: Provider, Status, QR Codes count, Format, Size, Date, Cancel
- Status badges: completed (green), processing/pending (blue), failed (red), cancelled (yellow)

**Backup Modal Fields:**
| Field | Notes |
|---|---|
| Cloud Provider | From active non-expired connections |
| Export Format | JSON or ZIP |
| Include QR code designs | Default: checked |
| Include analytics data | Default: checked |
| Include QR code images | Default: unchecked |

**API:**
- `GET cloud-storage/connections`
- `POST cloud-storage/backup-jobs`
- `GET cloud-storage/backup-jobs`
- `POST cloud-storage/backup-jobs/{id}/cancel`

---

### `/cloud-storage/callback` — OAuth Callback
- **Component:** `<qrcg-cloud-oauth-callback>`
- **Auth:** Public

**Functionality:** OAuth popup handler for Google Drive, Dropbox, OneDrive. Posts auth code back to parent window via `postMessage`, then auto-closes (1.5s).

---

## 31. Plugins

### `/dashboard/plugins/available` — Available Plugins
- **Component:** `<qrcg-available-plugins-page>`
- **Auth:** Permission `plugins.manage`

**Functionality:** Marketing/discovery page with hardcoded plugin catalog.

**Plugins:**
| Plugin | Price |
|---|---|
| Affiliates & Coupons | $45 one-time |
| Pre Printed QR Codes | $300 one-time |
| Product Store | $300 one-time |

Each has a "Buy Now" button linking to the marketplace.

---

### `/dashboard/plugins/installed` — Installed Plugins
- **Component:** `<qrcg-installed-plugins-page>`
- **Auth:** Permission `plugins.manage`

**Functionality:** Card grid of installed plugins. Each card shows name, description, tags, and a "Settings" link.

**API:** `GET plugins/installed`

---

### `/dashboard/plugins/plugin/:slug` — Plugin Settings
- **Component:** `<qrcg-plugin-page>`
- **Auth:** Permission `plugins.manage`

**Functionality:** Plugin-specific configuration page. Renders plugin configs via the system settings form engine. Content is filterable via `FILTER_PLUGIN_SETTINGS_PAGE`.

**API:** `GET plugins/plugin/{slug}`

---

## 32. Referral System

### `/dashboard/referrals` — Referral & Commission System
- **Component:** `<karsaaz-referral-system-page>` wrapping `<karsaaz-referral-system-screen>`
- **Auth:** Protected

**Four Tabs:**

**Summary Tab:**
- Total Referrals, Active Referrals, Total Earned, Total Withdrawn, Available Balance, Promo Code
- Performance badge (bronze/silver/gold), Conversion Rate, Average Commission

**History Tab:** Withdrawal history with detail modals

**Withdraw Tab:** Withdrawal request form

**Referrals Tab:** Referral list with CRM transaction data modal

**API:**
- `GET /api/withdrawals/summary`
- CRM integration via `getCrmApiUrl()` and `getCrmToken()`

---

## 33. Support Tickets

### `/dashboard/support-tickets` | `/account/support-tickets` — Support Tickets
- **Component:** `<karsaaz-support-tickets-screen>`
- **Auth:** Public (both routes)

**Stats Cards:** Total Tickets, Open Tickets, Closed Tickets, In Progress

**Table Columns:** Ticket ID, Category, Subject, Date Created, Status, Action (View)

**Create Ticket Modal:**
| Field | Type | Notes |
|---|---|---|
| Category | Select | Technical Support, Billing, General Inquiry, Account Issues, Security, Feedback |
| Priority | Select | Low, Medium, High, Urgent |
| Subject | Text | Required |
| Body | Textarea | 5-5000 chars, required |

**Conversation Modal:** Reply input (5-5000 chars), "Send" button. Resolved tickets show read-only notice.

**API (via `supportAPI`):**
- `getUserTickets(email)`
- `createTicket(ticketData)`
- `getConversation(ticketId)`
- `addUserMessage(ticketId, email, message)`

**Business Logic:** Auto-polls every 30 seconds. Messages show "You" (purple) or "Support Team" (blue). Sections split into Open/Closed.

---

## 34. Auth Workflow (OAuth)

### `/dashboard/system/auth-workflow` — Auth Settings
- **Component:** `<qrcg-auth-settings-page>`
- **Auth:** Permission `system.settings`

**Functionality:** Configure social login OAuth credentials for three providers:

| Provider | Config Fields | Callback URL |
|---|---|---|
| Google | OAuth credentials | `/auth-workflow/google/callback` |
| Facebook | OAuth credentials | `/auth-workflow/facebook/callback` |
| Twitter | OAuth credentials | `/auth-workflow/twitter/callback` |

Each workflow renders its own callback URL for registering with the OAuth provider.

---

## 35. Install Wizard

All install steps share a common base class with Back/Next navigation, field validation, and `POST install/save` to persist env variables.

### `/install` — Welcome
- **Component:** `<qrcg-install-introduction>`
- **Auth:** Public

**Functionality:** Splash screen with pre-requisites: MySQL credentials, SMTP credentials, Linux system.

---

### `/install/purchase-code` — License Key
- **Component:** `<qrcg-install-purchase-code>`
- **Auth:** Public

**Field:** Purchase Code / License Key (`ENVATO_PURCHASE_CODE`)

**API:** `POST install/verify-purchase-code`

---

### `/install/app-details` — App Customization
- **Component:** `<qrcg-install-app-details>`
- **Auth:** Public

**Fields:** App Name (`APP_NAME`), App Slogan (`APP_SLOGAN`)

---

### `/install/database` — Database Configuration
- **Component:** `<qrcg-install-database>`
- **Auth:** Public

**Fields:** DB Host, Port, Name, Username, Password (optional)

**API:** `POST install/verify-database`

---

### `/install/super-user` — Admin Account
- **Component:** `<qrcg-install-super-user>`
- **Auth:** Public

**Fields:** Name (`SUPER_USER_NAME`), Email (`SUPER_USER_EMAIL`), Password (`SUPER_USER_PASSWORD`)

---

### `/install/mail` — SMTP Configuration (Final Step)
- **Component:** `<qrcg-install-mail>`
- **Auth:** Public

**Fields:** SMTP Host, Port, Username, Password, Encryption (None/TLS/SSL), From Address, From Name

**Actions:**
- "Complete Setup" -> `POST install/complete`
- "Skip Mail Configuration" -> skips with warning (password reset won't work)

**API:** `POST install/verify-mail` (sends test email), `POST install/complete`

**On completion:** Redirects to `/account/login?installed=true`. Wizard is locked out thereafter.

---

## Route Summary

| Category | Count | Auth Level |
|---|---|---|
| Public (unauthenticated) | ~15 | None |
| Protected (login required) | ~15 | Login |
| Permission-gated (RBAC) | ~40+ | Specific permission |
| Redirect rules | ~8 | — |
| Dynamic params (`:id`/`:slug`) | ~20 | — |
| **Total distinct URL patterns** | **~75+** | — |

---

## Key Architecture Notes

1. **No central router file** — routes are distributed across 36 feature-module router files, all bootstrapped from `src/index.js`.
2. **Route guards:** Two levels — `<qrcg-protected-route>` (requires login) and `permission` attribute (RBAC permission string).
3. **Dynamic params:** Captured via named regex groups like `(?<id>\\d+)` and `(?<slug>.*)`.
4. **Redirects:** `<qrcg-redirect from="..." to="...">` with optional `@will-redirect` event listeners.
5. **Billing mode branching:** Subscription plan routes conditionally render based on `BillingMode` (subscription vs account-credit).
6. **Plugin extensibility:** Many pages support plugin filters and actions for customization.
7. **Payment flow:** Generate-pay-link pattern — frontend never handles card data directly.
