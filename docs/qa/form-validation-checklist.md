# Form Validation Checklist — Karsaaz QR

> **Purpose:** Manual QA checklist for validating every form in the application.
> **Last Updated:** 2025-07-14

---

## 1. Authentication Forms

### 1.1 Login (`/login` — `app/(auth)/login/page.tsx`)

| Field    | Required | Validation Rules   | Error Message Expected       |
| -------- | -------- | ------------------ | ---------------------------- |
| Email    | ✅       | Valid email format | "Please enter a valid email" |
| Password | ✅       | Min 8 chars        | "Password is required"       |

**Test Cases:**

- [ ] Submit empty form → both fields show error
- [ ] Invalid email format (e.g., `user@`) → email error
- [ ] Correct email, wrong password → "Invalid credentials" toast
- [ ] Correct credentials → redirect to dashboard
- [ ] SQL injection attempt in email → sanitized, no error leak

### 1.2 Sign Up (`/signup` — `app/(auth)/signup/page.tsx`)

| Field            | Required | Validation Rules                   | Error Message Expected            |
| ---------------- | -------- | ---------------------------------- | --------------------------------- |
| Name             | ✅       | Min 2 chars, max 100               | "Name is required"                |
| Email            | ✅       | Valid email format                 | "Please enter a valid email"      |
| Password         | ✅       | Min 8 chars, 1 uppercase, 1 number | "Password must meet requirements" |
| Confirm Password | ✅       | Must match password                | "Passwords do not match"          |

**Test Cases:**

- [ ] Submit empty form → all fields show errors
- [ ] Password mismatch → confirm password error
- [ ] Already registered email → "Email already in use" error
- [ ] Password too short → validation message
- [ ] Special characters in name (e.g., O'Brien) → accepted
- [ ] Very long name (>100 chars) → truncated or rejected

### 1.3 Forgot Password (`/forgot-password`)

| Field | Required | Validation Rules   | Error Message Expected       |
| ----- | -------- | ------------------ | ---------------------------- |
| Email | ✅       | Valid email format | "Please enter a valid email" |

**Test Cases:**

- [ ] Empty submission → error
- [ ] Non-registered email → generic "If account exists, email sent" message (no leak)
- [ ] Valid email → success message + email sent

### 1.4 Reset Password (`/reset-password`)

| Field            | Required | Validation Rules                   | Error Message Expected            |
| ---------------- | -------- | ---------------------------------- | --------------------------------- |
| New Password     | ✅       | Min 8 chars, 1 uppercase, 1 number | "Password must meet requirements" |
| Confirm Password | ✅       | Must match new password            | "Passwords do not match"          |

**Test Cases:**

- [ ] Expired token → "Link has expired" message
- [ ] Password mismatch → error
- [ ] Valid submission → success + redirect to login

---

## 2. QR Code Forms

### 2.1 Create QR Code (`/qrcodes/new` — `components/features/qrcodes/QRCodeForm.tsx`)

| Field       | Required | Validation Rules                  | Error Message Expected       |
| ----------- | -------- | --------------------------------- | ---------------------------- |
| QR Name     | ✅       | Min 1 char, max 255               | "Name is required"           |
| QR Type     | ✅       | Must select from dropdown         | "Please select a QR type"    |
| Content/URL | ✅       | Depends on type (valid URL, etc.) | "Please enter valid content" |
| Folder      | ❌       | Optional selection                | —                            |

**Type-specific sub-forms (in `components/features/qrcodes/forms/`):**

| QR Type  | Key Fields         | Validation                         |
| -------- | ------------------ | ---------------------------------- |
| URL      | URL                | Valid URL format, starts with http |
| SMS      | Phone, Message     | Valid phone format                 |
| Email    | To, Subject, Body  | Valid email format                 |
| WhatsApp | Phone, Message     | Valid phone with country code      |
| vCard    | Name, Phone, Email | Name required, valid formats       |

**Test Cases:**

- [ ] Submit without name → error
- [ ] Submit without selecting type → error
- [ ] URL type with invalid URL → validation error
- [ ] Very long URL (>2048 chars) → handled gracefully
- [ ] Special characters in name → accepted
- [ ] XSS attempt in content field → sanitized

### 2.2 Edit QR Code (`/qrcodes/[id]/edit`)

- [ ] Pre-populated fields match existing QR data
- [ ] Changing type resets type-specific fields
- [ ] Save without changes → no error
- [ ] Save with invalid data → validation errors

### 2.3 Bulk Create QR Codes (`/qrcodes/bulk-create`)

- [ ] Empty CSV upload → error message
- [ ] Malformed CSV → descriptive error
- [ ] CSV with too many rows → limit warning
- [ ] Valid CSV → success with count

---

## 3. Payment & Billing Forms

### 3.1 Stripe Checkout (`components/features/subscriptions/StripeCheckoutForm.tsx`)

| Field       | Required | Validation Rules              | Error Message Expected |
| ----------- | -------- | ----------------------------- | ---------------------- |
| Card Number | ✅       | Valid card (Stripe validates) | Stripe inline error    |
| Expiry      | ✅       | Future date                   | "Card has expired"     |
| CVC         | ✅       | 3-4 digits                    | "Invalid CVC"          |

**Test Cases:**

- [ ] Use Stripe test card `4242...` → success
- [ ] Use declined card `4000000000000002` → decline message
- [ ] Incomplete card number → inline error
- [ ] Expired card → error message

### 3.2 Billing Address (`components/features/payment/BillingAddressForm.tsx`)

| Field   | Required | Validation Rules | Error Message Expected    |
| ------- | -------- | ---------------- | ------------------------- |
| Address | ✅       | Min 5 chars      | "Address is required"     |
| City    | ✅       | Min 2 chars      | "City is required"        |
| State   | ❌       | Optional         | —                         |
| Zip     | ✅       | Format varies    | "Valid zip code required" |
| Country | ✅       | Must select      | "Country is required"     |

### 3.3 Promo Code (`components/features/subscriptions/PromoCodeInput.tsx`)

| Field      | Required | Validation Rules     | Error Message Expected |
| ---------- | -------- | -------------------- | ---------------------- |
| Promo Code | ✅       | Alphanumeric, max 50 | "Invalid promo code"   |

**Test Cases:**

- [ ] Empty code → error
- [ ] Invalid/expired code → "Code is invalid or expired"
- [ ] Valid code → discount applied, UI updated
- [ ] Already used code → appropriate error

---

## 4. Support Tickets

### 4.1 Create Ticket (`components/features/support/CreateTicketForm.tsx`)

| Field       | Required | Validation Rules          | Error Message Expected       |
| ----------- | -------- | ------------------------- | ---------------------------- |
| Subject     | ✅       | Min 5 chars, max 200      | "Subject is required"        |
| Category    | ✅       | Must select from dropdown | "Please select a category"   |
| Description | ✅       | Min 20 chars, max 5000    | "Description too short"      |
| Attachment  | ❌       | Max 5MB, image/pdf only   | "File too large" / "Invalid" |

**Test Cases:**

- [ ] Submit empty form → all required fields show errors
- [ ] Very short description → min length error
- [ ] File > 5MB → size error
- [ ] Invalid file type (.exe) → type error
- [ ] Valid submission → ticket created, redirect to list

---

## 5. Contact & Lead Forms

### 5.1 Contact Form (`components/common/ContactForm.tsx`)

| Field   | Required | Validation Rules   | Error Message Expected |
| ------- | -------- | ------------------ | ---------------------- |
| Name    | ✅       | Min 2 chars        | "Name is required"     |
| Email   | ✅       | Valid email format | "Valid email required" |
| Message | ✅       | Min 10 chars       | "Message is too short" |

### 5.2 Lead Form (`components/public/lead-form/FormDisplay.tsx`)

- [ ] Dynamic fields render correctly based on config
- [ ] Required fields enforce validation
- [ ] Successful submission shows confirmation

---

## 6. Profile & Settings

### 6.1 Profile Editor (`components/features/auth/ProfileEditor.tsx`)

| Field  | Required | Validation Rules            | Error Message Expected |
| ------ | -------- | --------------------------- | ---------------------- |
| Name   | ✅       | Min 2 chars, max 100        | "Name is required"     |
| Email  | ✅       | Valid email (may be locked) | "Valid email required" |
| Avatar | ❌       | Image only, max 2MB         | "Invalid image"        |

---

## General Test Cases (All Forms)

- [ ] **Empty submission:** Every form rejects empty required fields
- [ ] **Invalid data:** Type-specific validation fires (emails, URLs, phones)
- [ ] **Too long input:** Fields with max length show appropriate errors
- [ ] **Special characters:** `<script>`, `' OR 1=1 --`, `../../../etc/passwd` are sanitized
- [ ] **Network error during submit:** User sees friendly error, not raw stack trace
- [ ] **Double submit:** Button disabled during submission to prevent duplicates
- [ ] **Keyboard navigation:** Tab order is logical, Enter submits form
- [ ] **Screen reader:** Labels are associated with inputs, errors announced
