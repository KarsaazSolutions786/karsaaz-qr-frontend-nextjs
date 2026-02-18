# Dashboard Modules Research Report

> Research of `qr-code-frontend/src/` vanilla JS modules for migration to Next.js

## API Architecture

All API calls go through `{APP_URL}/api/{route}`. The `QRCGApiConsumer` class wraps standard CRUD:

- **List**: `GET /api/{baseRoute}?keyword=...&page=...&{filters}`  
- **Get**: `GET /api/{baseRoute}/{id}`  
- **Create**: `POST /api/{baseRoute}` (body = form data)  
- **Update**: `PUT /api/{baseRoute}/{id}` (body = form data)  
- **Delete**: `DELETE /api/{baseRoute}/{id}`  
- **Search**: `GET /api/{baseRoute}?{searchParams}`

The `save()` function auto-detects POST vs PUT based on whether `data.id` exists.

Paginated responses return: `{ data: [...], current_page, last_page, per_page, total, ... }`

---

## 1. Users Module

**Source**: `src/users-module/`  
**Files**: `qrcg-user-router.js`, `qrcg-user-list.js`, `qrcg-user-form.js`, `qrcg-user-list.scss`, `qrcg-user-form-page.js`, `qrcg-user-list-page.js`, `qrcg-account-balance-input.js`, `qrcg-account-balance-modal.js`, `user-filter/modal.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users?keyword=...&page=...&paying=...` | List users (paginated, searchable) |
| GET | `/api/users/{id}` | Get single user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| POST | `/api/account/act-as/{id}` | Act as user (impersonate) |
| POST | `/api/users/{id}/reset-role` | Reset user role |
| POST | `/api/account/generate-magic-login-url/{id}` | Generate magic login URL |
| POST | `/api/users/{id}/reset-scans-limit` | Reset scan limits |
| POST | `/api/users/verify-email/{id}` | Verify user email |
| POST | `/api/users/{userId}/change-account-balance` | Change account balance |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `name` | Name | — |
| `email` | Email | — |
| `mobile_number` | Mobile | — |
| `roles[0].name` | Role | — |
| `qrcodes_count` | QRs | — |
| `scans` | Scans | — |
| `main_user` | Main User | — |
| `created_at` | Created at | — |
| `actions` | Actions | 17rem |

### Form Fields
- `name` (text) — Full name
- `email` (email)
- `mobile_number` (via QrcgMobileInput, conditional)
- `password` (password)
- `password_confirmation` (password)
- `role_id` (relation select → `/api/roles`)
- Account Balance (read-only + modal to change)
- Sub-users component

### Special Features
- **Filter by paying status**: `?paying=paying|non-paying`
- **User filter modal**: Filter by `number_of_qrcodes` (range)
- **Search**: By name or email
- **Row Actions**: Act as, Edit, Magic Login URL, Delete, Reset Role, Reset Scan Limits
- **Delete warning**: Deleting user removes QR codes, subscriptions, and transactions
- **Routes**: `/dashboard/users` (list), `/dashboard/users/new` (create), `/dashboard/users/edit/{id}` (edit)
- **Permission**: `user.list-all`, `user.store`

---

## 2. Plans (Subscription Plans) Module

**Source**: `src/subscription-plan-module/`  
**Files**: `qrcg-subscription-plan-router.js`, `qrcg-subscription-plan-list.js`, `qrcg-subscription-plan-form.js`, `qrcg-subscription-plan-form-page.js`, `qrcg-subscription-plan-list-page.js`, `qrcg-subscription-plan-details.js`, `qrcg-subscription-plan-checkout-link.js`, `qrcg-subscription-plan-checkpoints.js`, `billing-mode.js`, `account-credit-manager.js`, `qrcg-credit-pricing-form.js`, `qrcg-credit-pricing-page.js`, `dynamic-type-limits/`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscription-plans?keyword=...&page=...` | List plans |
| GET | `/api/subscription-plans/{id}` | Get plan |
| POST | `/api/subscription-plans` | Create plan |
| PUT | `/api/subscription-plans/{id}` | Update plan |
| DELETE | `/api/subscription-plans/{id}` | Delete plan |
| POST | `/api/subscription-plans/{id}/duplicate` | Duplicate plan |

### Table Columns
| Key | Label |
|-----|-------|
| `name` | Name |
| `price` | Price |
| `frequency` | Frequency |
| `number_of_dynamic_qrcodes` | Allowed QRs |
| `number_of_scans` | Scans |
| `is_trial` | Trial (YES/NO badge) |
| `actions` | Actions (15rem) |

### Form Fields (Sections)

**Basic Details:**
- `name` (text) — with field translator
- `frequency` (balloon selector: monthly/yearly/life-time)
- `price` (number, min 0 — 0 = free)
- `sort_order` (number)
- `is_hidden` (checkbox)
- `is_trial` (checkbox)
- `trial_days` (number, shown if is_trial)

**Plan Configuration:**
- `number_of_dynamic_qrcodes` (number, -1 = unlimited)
- `number_of_scans` (number, -1 = unlimited)
- `number_of_custom_domains` (number, -1 = unlimited)
- `file_size_limit` (number, MB)
- `number_of_users` (number, -1 = unlimited, extended license)
- `number_of_restaurant_menu_items` (number, extended license)
- `number_of_product_catalogue_items` (number, extended license)
- `number_of_ai_generations` (number, extended license)
- `number_of_bulk_created_qrcodes` (number, extended license)

**Ads Settings:**
- `show_ads` (balloon: enabled/disabled)
- `ads_timeout` (number, default 15)
- `ads_code` (code input, HTML)

**Available Types:**
- `qr_types` (balloon selector, multiple, from QRCodeTypeManager)
- `unavailable_types_behaviour` (balloon: hidden/show_upgrade_message)

**Dynamic Type Limits** (sub-component)

**Other Features:**
- `features` (balloon selector, multiple)

**Checkpoints** (sub-component)

### Special Features
- **Duplicate plan** action
- **Warning notice**: Trial/free plan auto-onboarding behavior
- **Checkout link** component
- **Routes**: `/dashboard/subscription-plans`, `/dashboard/subscription-plans/new`, `/dashboard/subscription-plans/edit/{id}`, `/dashboard/subscription-plans/credit-pricing`
- **Permission**: `subscription-plan.list-all`, `subscription-plan.store`

---

## 3. Billing Module

**Source**: `src/billing/`  
**Files**: `router.js`, `dashboard/billing-page/billing-page.js`, `dashboard/billing-form/billing-form.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/configs?keys=...` | Fetch billing configs |
| POST | `/api/system/configs` | Save billing configs |

**Config keys saved:**
- `billing_collection_enabled` (enabled/disabled)
- `billing_private_form` (form builder JSON — customer fields)
- `billing_company_form` (form builder JSON — company fields)

### Form Fields
- `billing_collection_enabled` (balloon: Enabled/Disabled)
- `billing_private_form` (form builder — private customer details)
- `billing_company_form` (form builder — company details)

### Special Features
- Uses `QrcgSystemSettingsFormBase` — settings-style form (not CRUD list)
- Route: `/dashboard/billing`
- No list/table — single configuration page

---

## 4. Transactions Module

**Source**: `src/transaction-module/`  
**Files**: `qrcg-transaction-router.js`, `qrcg-transaction-list.js`, `qrcg-transaction-list-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions?keyword=...&page=...` | List transactions |
| POST | `/api/transactions/{id}/approve` | Approve transaction |
| POST | `/api/transactions/{id}/reject` | Reject transaction |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `formatted_amount` | Amount | — |
| `_user_` | User | — |
| `_description_` | Description | — |
| `source` | Source | — |
| `stripe_payment_intent_id` | Stripe Payment ID | 8rem |
| `status` | Status | — |
| `created_at` | Date | — |
| `actions` | Actions | 7rem |

### Special Features
- **List-only** module (no create/edit form)
- **Row Actions** (for `offline-payment` source only): Payment Proof link, Approve, Reject
- **Search**: "By anything"
- **Data relations**: `subscription.user.name`, `subscription.subscription_plan.name`
- **Route**: `/dashboard/transactions`
- **Permission**: `transaction.list-all`

---

## 5. Payment Processors Module

**Source**: `src/payment-processors/`  
**Files**: `qrcg-payment-processors-page.js`, `qrcg-payment-processors-router.js`, `forms/base.js`, `forms/stripe.js`, `forms/paypal.js`, `forms/offline-payments.js`, `forms/paddle.js`, `forms/paddle-billing.js`, `forms/payu-international.js`, `forms/razorpay.js`, `forms/mercadopago.js`, `forms/paytr.js`, `forms/payfast.js`, `forms/xendit.js`, `forms/mollie.js`, `forms/paystack.js`, `forms/alipay-china.js`, `forms/yookassa.js`, `forms/paykickstart.js`, `forms/orange-bf.js`, `forms/payu-latam.js`, `forms/2checkout.js`, `forms/dintero.js`, `forms/fib.js`, `forms/postfinance.js`, `forms/flutterwave.js`, `client/`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/configs?keys=payment_processors.{slug}.*` | Fetch processor config |
| POST | `/api/system/configs` | Save processor config |
| POST | `/api/payment-processors/{slug}/test-credentials` | Test credentials |
| POST | `/api/payment-processors/{slug}/register-webhook` | Register webhook |
| GET | `/api/subscription-plans` | List plans (for mapping) |

### Processor Tabs (each is a settings form)
Stripe, PayPal, PayU International, Paddle (Classic), Paddle (Billing), Razorpay, Mercado Pago, PayTR, PayFast, Xendit, Mollie, PayStack, Alipay China, YooKassa, PayKickstart, Orange (Mobile Money), PayU Latam, 2Checkout, Dintero, FIB, Post Finance, Flutter Wave, Offline Payments

### Common Form Fields per Processor
- `payment_processors.{slug}.enabled` (ON/OFF)
- `payment_processors.{slug}.display_name` (text)
- Processor-specific keys (API keys, secrets, modes, etc.)
- Plan mapping fields: `payment_processors.{slug}.subscription_plan_{id}_{field}`

### Stripe-specific Fields
- `publisher_key`, `secret_key`
- `automatic_tax` (enabled/disabled)
- `tax_behavior` (inclusive/exclusive)

### Special Features
- **Tabbed settings page** — each processor is a tab
- **Test credentials** button
- **Webhook registration** button
- **Plan mapping** — map subscription plans to processor plan IDs
- **Route**: `/dashboard/payment-processors`
- **No permission listed** (admin-only implicitly)

---

## 6. Payment Gateways Module (Legacy)

**Source**: `src/payment-gateway-module/`  
**Files**: `qrcg-payment-gateway-router.js`, `qrcg-payment-gateway-list.js`, `qrcg-payment-gateway-form.js`, `qrcg-payment-gateway-list-page.js`, `qrcg-payment-gateway-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment-gateways` | List gateways |
| GET | `/api/payment-gateways/{id}` | Get gateway |
| PUT | `/api/payment-gateways/{id}` | Update gateway |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `name` | Name | — |
| `enabled` | Enabled (ON/OFF badge) | — |
| `actions` | Actions | 7rem |

### Form Fields
- `name` (text)
- `mode` (balloon: Sandbox/Live)
- `enabled` (balloon: ON/OFF)
- **Stripe fields** (if slug = stripe): `publisher_key`, `secret_key`
- **PayPal fields** (if slug = paypal): `client_id`, `client_secret`
- **Offline Payment fields** (if slug = offline-payment-gateway): `customer_instructions` (markdown)

### Special Features
- **No delete** — delete link is hidden
- **No create** — gateways are pre-seeded
- **Edit only** module
- **Route**: `/dashboard/payment-gateways`

---

## 7. Currencies Module

**Source**: `src/currency-module/`  
**Files**: `qrcg-currency-router.js`, `qrcg-currency-list.js`, `qrcg-currency-form.js`, `qrcg-currency-list-page.js`, `qrcg-currency-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/currencies?keyword=...&page=...` | List currencies |
| GET | `/api/currencies/{id}` | Get currency |
| POST | `/api/currencies` | Create currency |
| PUT | `/api/currencies/{id}` | Update currency |
| DELETE | `/api/currencies/{id}` | Delete currency |
| POST | `/api/currencies/{id}/enable` | Enable currency |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `name` | Name | — |
| `currency_code` | Currency code | — |
| `symbol` | Symbol | — |
| `is_enabled` | Enabled (Yes/No badge) | — |
| `actions` | Actions | 7rem |

### Form Fields
- `name` (text)
- `currency_code` (text)
- `symbol` (text)
- `thousands_separator` (text, placeholder `,`)
- `decimal_separator` (text, placeholder `.`)
- `decimal_separator_enabled` (balloon: Enabled/Disabled)
- `symbol_position` (balloon: Before Number/After Number)

### Special Features
- **Enable action** in row actions (separate from edit)
- **Row actions**: Enable, Edit, Delete
- **Route**: `/dashboard/currencies`, `/dashboard/currencies/new`, `/dashboard/currencies/edit/{id}`

---

## 8. Blog Posts Module

**Source**: `src/blog-post-module/`  
**Files**: `qrcg-blog-post-router.js`, `qrcg-blog-post-list.js`, `qrcg-blog-post-form.js`, `qrcg-blog-post-list-page.js`, `qrcg-blog-post-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog-posts?keyword=...&page=...` | List blog posts |
| GET | `/api/blog-posts/{id}` | Get blog post |
| POST | `/api/blog-posts` | Create blog post |
| PUT | `/api/blog-posts/{id}` | Update blog post |
| DELETE | `/api/blog-posts/{id}` | Delete blog post |
| POST | `/api/blog-posts/{id}/upload-featured-image` | Upload featured image |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `title` | Title | — |
| `translation.name` | Language | — |
| `published_at` | Published at | — |
| `actions` | Actions | 7rem |

### Form Fields
- `title` (text)
- `content` (markdown input)
- `excerpt` (textarea — optional)
- `meta_description` (textarea, maxLength 160)
- `featured_image_id` (file upload → POST `blog-posts/{id}/upload-featured-image`)
- `published_at` (date input)
- `translation_id` (relation select → `/api/translations?is_active=true&pagination=false`)

### Special Features
- **Search**: By title
- **Published badge**: Shows date or `---`
- **File upload** for featured image requires saving record first
- **Route**: `/dashboard/blog-posts`

---

## 9. Content Blocks Module

**Source**: `src/content-blocks-module/`  
**Files**: `qrcg-content-blocks-router.js`, `qrcg-content-blocks-list.js`, `qrcg-content-blocks-form.js`, `qrcg-content-blocks-list-page.js`, `qrcg-content-blocks-form-page.js`, `qrcg-copy-content-blocks-modal.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content-blocks?keyword=...&page=...&translation_id=...` | List content blocks |
| GET | `/api/content-blocks/{id}` | Get block |
| POST | `/api/content-blocks` | Create block |
| PUT | `/api/content-blocks/{id}` | Update block |
| DELETE | `/api/content-blocks/{id}` | Delete block |
| DELETE | `/api/content-blocks/of-translation/{translation_id}` | Delete all blocks of a language |
| POST | `/api/content-blocks/copy/from/{sourceId}/to/{destinationId}` | Copy blocks between languages |

### Table Columns
| Key | Label | Default |
|-----|-------|---------|
| `title` | Title | — |
| `position` | Position | — |
| `translation.name` | Language | English (default) |
| `sort_order` | Sort order | — |
| `created_at` | Created | — |
| `actions` | Actions | 7rem |

### Form Fields
- `title` (text)
- `position` (select — positions from `Config.get('content-manager.positions')`)
- `sort_order` (number, default 0)
- `content` (markdown input)
- `translation_id` (relation select → `/api/translations?is_active=true&pagination=false`)

### Special Features
- **Language filter**: Select language to filter content blocks
- **Delete all**: Delete all content blocks of selected language
- **Copy all**: Copy all blocks from source to destination language (modal)
- **Search**: By title or position
- **Copy Content Blocks Modal**: Source language → Destination language
- **Route**: `/dashboard/content-blocks`

---

## 10. Translations Module

**Source**: `src/translation-module/`  
**Files**: `qrcg-translation-router.js`, `qrcg-translation-list.js`, `qrcg-translation-form.js`, `qrcg-translation-list-page.js`, `qrcg-translation-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/translations?keyword=...&page=...` | List translations |
| GET | `/api/translations/{id}` | Get translation |
| POST | `/api/translations` | Create translation |
| PUT | `/api/translations/{id}` | Update translation |
| DELETE | `/api/translations/{id}` | Delete translation |
| POST | `/api/translations/{id}/set-main` | Set as main language |
| POST | `/api/translations/{id}/toggle-activate` | Toggle activate/deactivate |
| POST | `/api/translations/{id}/auto-translate` | Auto translate (Google API) |
| GET | `/api/translations/can-auto-translate` | Check if auto-translate is available |
| GET | `/api/translations?paginate=false` | Get all translations (no pagination) |
| POST | `/api/translations/{id}/upload` | Upload translation file |

### Table Columns
| Key | Label |
|-----|-------|
| `id` | ID (2rem) |
| `name` | Name |
| `locale` | Locale |
| `is_active` | Active (YES/NO badge) |
| `is_main` | Main Language (YES/NO badge) |
| `completeness` | Completeness (percentage) |
| `actions` | Actions (20rem) |

### Form Fields
- `name` (text — disabled for default)
- `display_name` (text — for language picker)
- `locale` (text — disabled for default)
- `direction` (balloon: RTL/LTR)
- `flag_file_id` (file upload → `/api/files`)
- `translation_file_id` (file upload → `/api/translations/{id}/upload`, accept `.json`)

### Special Features
- **Row Actions**: Edit, Delete, Activate/Disable, Auto Translate, Set Main Language
- **Download default translation file** link in form
- **Help**: Links to blog and content blocks for translation
- **Default translation** cannot have inputs modified
- **Route**: `/dashboard/translations`

---

## 11. Custom Code Module

**Source**: `src/custom-code-module/`  
**Files**: `qrcg-custom-code-router.js`, `qrcg-custom-code-list.js`, `qrcg-custom-code-form.js`, `qrcg-custom-code-list-page.js`, `qrcg-custom-code-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/custom-codes?keyword=...&page=...` | List custom codes |
| GET | `/api/custom-codes/{id}` | Get custom code |
| POST | `/api/custom-codes` | Create custom code |
| PUT | `/api/custom-codes/{id}` | Update custom code |
| DELETE | `/api/custom-codes/{id}` | Delete custom code |
| GET | `/api/custom-codes/positions` | Get available positions |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `name` | Name | — |
| `language` | Language | — |
| `position` | Position | — |
| `sort_order` | Sort order | — |
| `actions` | Actions | 7rem |

### Form Fields
- `name` (text, e.g. "Facebook Pixel")
- `language` (select: JavaScript/HTML/CSS)
- `position` (searchable select — dynamic from `/api/custom-codes/positions`)
- `sort_order` (number)
- `code` (code input — language-aware)

### Special Features
- **Code editor** with syntax highlighting per language
- **Dynamic positions** fetched from API
- **Route**: `/dashboard/custom-codes`

---

## 12. Pages Module

**Source**: `src/page-module/`  
**Files**: `qrcg-page-router.js`, `qrcg-page-list.js`, `qrcg-page-form.js`, `qrcg-page-list-page.js`, `qrcg-page-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pages?keyword=...&page=...` | List pages |
| GET | `/api/pages/{id}` | Get page |
| POST | `/api/pages` | Create page |
| PUT | `/api/pages/{id}` | Update page |
| DELETE | `/api/pages/{id}` | Delete page |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `title` | Title | — |
| `slug` | Slug | — |
| `published` | Published (YES/NO badge) | — |
| `actions` | Actions | 7rem |

### Form Fields
- `title` (text) — auto-generates slug
- `slug` (text) — shows page URL preview
- `html_content` (code input, HTML)
- `meta_description` (textarea, maxlength 160)
- `published` (checkbox)

### Special Features
- **Auto-slug generation** from title
- **URL preview**: `{APP_URL}/{slug}`
- **HTML code editor** for page content
- **Route**: `/dashboard/pages`

---

## 13. Contact Module

**Source**: `src/contact-module/`  
**Files**: `qrcg-contact-router.js`, `qrcg-contact-list.js`, `qrcg-contact-module-form.js`, `qrcg-contact-list-page.js`, `qrcg-contact-form-page.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts?keyword=...&page=...` | List contacts |
| GET | `/api/contacts/{id}` | Get contact |
| POST | `/api/contacts` | Create contact |
| PUT | `/api/contacts/{id}` | Update contact |
| DELETE | `/api/contacts/{id}` | Delete contact |

### Table Columns
| Key | Label |
|-----|-------|
| `name` | Name |
| `email` | Email |
| `subject` | Subject |
| `actions` | Actions (7rem) |

### Form Fields
- `name` (text)
- `email` (text)
- `subject` (text)
- `message` (textarea)
- `notes` (textarea — internal notes, customer not notified)

### Special Features
- **Search**: "By anything"
- **Internal notes** field (admin only)
- **Route**: `/dashboard/contacts`

---

## 14. Plugins Module

**Source**: `src/plugins/`  
**Files**: `plugin-model.js`, `qrcg-available-plugins-page.js`, `qrcg-installed-plugins-page.js`, `qrcg-plugin-form.js`, `qrcg-plugin-page.js`, `qrcg-plugin-item.js`, `qrcg-available-plugin-item.js`, `qrcg-plugins-router.js`, `config/`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plugins/installed` | List installed plugins |
| GET | `/api/system/configs?keys=...` | Get plugin settings |
| POST | `/api/system/configs` | Save plugin settings |

### Available Plugins (Hardcoded)
- **Affiliates & Coupons** — slug: `affiliatescoupons`, $45 one-time
- **Pre Printed QR Codes** — slug: `preprintedqrcodes`, $300 one-time
- **Product Store** — slug: `productstore`, $300 one-time

### Installed Plugin View
- Grid of plugin cards
- Each plugin has a form for its configuration (extends system settings form base)
- Plugin configs are dynamic, defined by the plugin itself

### Special Features
- **Available plugins page**: Shows purchasable plugins
- **Installed plugins page**: Shows installed plugins with their config forms
- **Route**: `/dashboard/plugins/available`, `/dashboard/plugins/installed`

---

## 15. System Module

**Source**: `src/system-module/`  
**Files**: `qrcg-system-module-router.js`, `qrcg-system-status.js`, `qrcg-system-settings-form.js`, `qrcg-system-notifications-form.js`, `qrcg-system-sms-form.js`, `qrcg-system-logs-page.js`, `qrcg-system-cache-page.js`, `qrcg-act-as-notice.js`, `system-status-notice.js`, `qrcg-system-settings-form/` (sub-folder with tabs), `qrcg-system-notifications-form/` (sub-folder), `qrcg-system-sms-form/` (sub-folder)

### Sub-Pages & Routes

#### 15a. System Status
**Route**: `/dashboard/system/status` (Permission: `system.status`)

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/status` | Get system status entries |
| GET | `/api/system/check_database_update` | Check for database updates |

**Features**: List of status entries with success/fail/action-required indicators. Refresh button.

#### 15b. System Settings
**Route**: `/dashboard/system/settings` (Permission: `system.settings`)

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/configs?keys=...` | Fetch configs by keys |
| POST | `/api/system/configs` | Save configs |

**Tabs (10):**
1. **General** — `app.name`, `frontend.slogan`, `app.powered_by_name`, `homepage.meta_description`, `homepage.meta_keywords`, `app.timezone`, frontend settings (custom URL, login screen as home, pricing URL, frontend links)
2. **Dashboard** — dashboard area settings
3. **Authentication** — auth settings
4. **Appearance** — theme/appearance settings
5. **Logo & Favicon** — logo and favicon uploads
6. **Menus** — menu configuration
7. **QR Code Types** — QR code type settings
8. **Email (SMTP)** — SMTP configuration
9. **Storage** — storage settings
10. **Advanced** — Google API keys, etc.

#### 15c. Notifications
**Route**: `/dashboard/system/notifications` (Permission: `system.notifications`)

**Tabs (9):**
1. Trial Expired
2. Subscription Expiring Soon
3. Subscription Expired
4. Dynamic QR Codes Limit Reached
5. Scan Limit Reached
6. Invite User
7. Bulk Operation Completed
8. Lead Form Response
9. Custom Form Response

Each tab configures notification templates via `system/configs`.

#### 15d. SMS Portals
**Route**: `/dashboard/system/sms` (Permission: `system.sms-portals`)

**Tabs:**
- RB Soft SMS Payment Gateway

#### 15e. Logs
**Route**: `/dashboard/system/logs` (Permission: `system.logs`)

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/logs` | Get log content (base64 encoded) |
| POST | `/api/system/log-file` | Generate download link |
| DELETE | `/api/system/log-file` | Clear log file |

**Features**: Log viewer (textarea), Download button, Clear button, Refresh.

#### 15f. Cache
**Route**: `/dashboard/system/cache` (Permission: `system.cache`)

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/system/clear-cache/{type}` | Clear cache (view/config) |
| POST | `/api/system/rebuild-cache/{type}` | Rebuild cache |

**Cache Types**: `view`, `config`

#### 15g. Abuse Reports
**Route**: `/dashboard/admin/abuse-reports` (Permission: `system.status`)

---

## 16. Cloud Storage Module

**Source**: `src/cloud-storage-module/`  
**Files**: `router.js`, `qrcg-cloud-storage-page.js`, `qrcg-cloud-connections-list.js`, `qrcg-cloud-connection-card.js`, `qrcg-cloud-provider-selector.js`, `qrcg-cloud-oauth-connector.js`, `qrcg-cloud-oauth-callback.js`, `qrcg-cloud-mega-connector.js`, `qrcg-cloud-backup-modal.js`, `qrcg-cloud-backup-history.js`, `qrcg-cloud-backup-progress.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cloud-storage/connections` | List connections |
| DELETE | `/api/cloud-storage/connections/{id}` | Delete connection |
| POST | `/api/cloud-storage/connections/{id}/test` | Test connection |
| POST | `/api/cloud-storage/{provider}/auth-url` | Get OAuth auth URL |
| POST | `/api/cloud-storage/{provider}/callback` | Handle OAuth callback |
| POST | `/api/cloud-storage/{provider}/refresh` | Refresh provider token |
| POST | `/api/cloud-storage/mega/connect` | Connect Mega (email/password) |
| POST | `/api/cloud-storage/mega/test` | Test Mega connection |
| POST | `/api/cloud-storage/backup` | Create backup job |
| GET | `/api/cloud-storage/backup-jobs` | List backup jobs |
| GET | `/api/cloud-storage/backup-jobs/{id}` | Get backup job status |
| DELETE | `/api/cloud-storage/backup-jobs/{id}` | Cancel backup job |

### Tabs
1. **Connections**: Grid of connection cards (Add Connection → provider selector modal → OAuth/Mega)
2. **Backup History**: Table of backup jobs

### Backup History Table Columns
| Column | Description |
|--------|-------------|
| Provider | Cloud provider name |
| Status | Badge (completed/processing/pending/failed/cancelled) |
| Total QR Codes | Count |
| Format | json |
| File Size | Formatted bytes |
| Created at | Date |
| Actions | Cancel button (if pending/processing) |

### Special Features
- **OAuth flow** for cloud providers (Google Drive, Dropbox, etc.)
- **Mega.nz** — email/password auth
- **Backup modal** — select connection, start backup
- **Progress tracking** for backup jobs
- **Route**: `/dashboard/cloud-storage`

---

## 17. Roles Module

**Source**: `src/roles-module/`  
**Files**: `router.js`, `list.js`, `list-page.js`, `form.js`, `form-page.js`, `permissions-input/permissions-input.js`, `permissions-input/permission-store.js`, `permissions-input/permission-group.js`, `role-name/role-name.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roles?keyword=...&page=...` | List roles |
| GET | `/api/roles/{id}` | Get role |
| POST | `/api/roles` | Create role |
| PUT | `/api/roles/{id}` | Update role |
| DELETE | `/api/roles/{id}` | Delete role |
| GET | `/api/permissions` | Get all permissions (for permission picker) |

### Table Columns
| Key | Label | Width |
|-----|-------|-------|
| `id` | ID | 2rem |
| `name` | Name | — |
| `permission_count` | Permissions | — |
| `user_count` | Users | — |
| `created_at` | Created at | — |
| `actions` | Actions | 17rem |

### Form Fields
- `name` (text)
- `home_page` (text, placeholder `/dashboard/qrcodes`)
- `permission_ids` (permissions input — grouped checkboxes)

### Special Features
- **Permissions input**: Fetches all permissions, groups them, shows group-level + individual checkboxes
- **Read-only rows** cannot be edited/deleted
- **Search**: "By name"
- **Route**: `/dashboard/roles`

---

## 18. Domains Module

**Source**: `src/domain-module/`  
**Files**: `qrcg-domain-router.js`, `qrcg-domain-list.js`, `qrcg-domain-form.js`, `qrcg-domain-list-page.js`, `qrcg-domain-form-page.js`, `qrcg-domain-add-page.js`, `qrcg-domain-add.js`, `qrcg-domain-select.js`, `qrcg-domain-status-badge.js`, `qrcg-domain-connectivity-status.js`, `qrcg-domain-change-availability-modal.js`, `qrcg-domain-change-status-modal.js`, `qrcg-my-domains-list.js`

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/domains?keyword=...&page=...&status=...` | List domains |
| GET | `/api/domains/{id}` | Get domain |
| POST | `/api/domains` | Create domain |
| PUT | `/api/domains/{id}` | Update domain |
| DELETE | `/api/domains/{id}` | Delete domain |
| PUT | `/api/domains/{id}/set-default` | Set as default domain |

### Table Columns
| Key | Label |
|-----|-------|
| `id` | ID (2rem) |
| `host` | Host |
| `availability` | Availability |
| `status` | Status (badge) |
| `is_default` | Default? (Yes/No badge) |
| `owner` | Owner (link to user) |
| `actions` | Actions (7rem) |

### Form Fields
- `host` (text, placeholder `domain.com`)
- `protocol` (balloon: http/https)
- `sort_order` (number)
- Status display + Change status modal
- Availability display + Change availability modal
- Set as default button
- Connectivity status component

### Special Features
- **Status filter** (balloon selector)
- **Search**: By host or owner name
- **Connectivity checker**
- **Change status modal** and **Change availability modal**
- **Route**: `/dashboard/domains`, `/dashboard/domains/add`
- **Permission**: `domain.list-all`, `domain.update-any`, `domain.add`

---

## 19. Auth Workflow Module

**Source**: `src/auth-workflow/`  
**Files**: `auth-router.js`, `auth-settings-form.js`, `auth-settings-page.js`, `auth-button.js`, `auth-callback.js`, `auth-manager.js`, `workflows/`

### API Endpoints
Uses `system/configs` pattern for each auth workflow's configuration.

### Special Features
- **Tabbed settings page** for each OAuth workflow (Google, Facebook, etc.)
- **Callback URL** display with copy functionality
- **Route**: `/dashboard/system/auth-workflow` (likely inside system settings)
- Extends `QrcgSystemSettingsFormBase`

---

## 20. Connections Module

**No standalone "connections" module exists.** Cloud "connections" are part of the **Cloud Storage Module** (see #16 above). If there's a sidebar link for "Connections," it routes to the cloud storage connections tab.

---

## Summary: API Routes Quick Reference

| Module | baseRoute | List Route | Form Route |
|--------|-----------|-----------|------------|
| Users | `users` | `/dashboard/users` | `/dashboard/users/new`, `/dashboard/users/edit/{id}` |
| Plans | `subscription-plans` | `/dashboard/subscription-plans` | `/dashboard/subscription-plans/new`, `.../edit/{id}` |
| Billing | `system/configs` | `/dashboard/billing` | (single form) |
| Transactions | `transactions` | `/dashboard/transactions` | (list only) |
| Payment Processors | `system/configs` | `/dashboard/payment-processors` | (tabbed settings) |
| Payment Gateways | `payment-gateways` | `/dashboard/payment-gateways` | `.../edit/{id}` |
| Currencies | `currencies` | `/dashboard/currencies` | `.../new`, `.../edit/{id}` |
| Blog Posts | `blog-posts` | `/dashboard/blog-posts` | `.../new`, `.../edit/{id}` |
| Content Blocks | `content-blocks` | `/dashboard/content-blocks` | `.../new`, `.../edit/{id}` |
| Translations | `translations` | `/dashboard/translations` | `.../new`, `.../edit/{id}` |
| Custom Codes | `custom-codes` | `/dashboard/custom-codes` | `.../new`, `.../edit/{id}` |
| Pages | `pages` | `/dashboard/pages` | `.../new`, `.../edit/{id}` |
| Contacts | `contacts` | `/dashboard/contacts` | `.../new`, `.../edit/{id}` |
| Plugins | `plugins/installed` | `/dashboard/plugins/installed` | (per-plugin config) |
| System Status | `system` | `/dashboard/system/status` | — |
| System Settings | `system/configs` | `/dashboard/system/settings` | (tabbed settings) |
| System Logs | `system` | `/dashboard/system/logs` | — |
| System Cache | `system` | `/dashboard/system/cache` | — |
| System Notifications | `system/configs` | `/dashboard/system/notifications` | (tabbed settings) |
| SMS Portals | `system/configs` | `/dashboard/system/sms` | (tabbed settings) |
| Cloud Storage | `cloud-storage` | `/dashboard/cloud-storage` | (tabbed page) |
| Roles | `roles` | `/dashboard/roles` | `.../new`, `.../edit/{id}` |
| Domains | `domains` | `/dashboard/domains` | `.../new`, `.../edit/{id}` |
| Auth Workflow | `system/configs` | `/dashboard/auth-workflow` | (tabbed settings) |

## Common Patterns

### CRUD List Pattern
All list modules extend `QRCGDashboardList` which provides:
- Paginated table with configurable columns
- Search input with debounce
- Create/Edit/Delete with confirmation modals
- URL-based pagination (`?page=1&keyword=search`)
- Breadcrumb navigation

### Form Pattern
All form modules extend `QrcgDashboardForm` which provides:
- Auto-detect create vs edit (by URL param `id`)
- Auto-fetch record on edit
- Auto-redirect to edit URL after create
- Toast notification on success
- Validation error display

### Settings Pattern
Settings modules (Billing, Payment Processors, System Settings, Notifications) extend `QrcgSystemSettingsFormBase`:
- Fetch all config keys on load
- Sync input values from config objects
- Save all via `POST /api/system/configs`
- Config keys are the `name` attributes of inputs
