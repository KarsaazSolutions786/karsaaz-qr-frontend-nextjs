# Mobile Testing Checklist — Karsaaz QR

> **Purpose:** Manual QA checklist for mobile responsiveness and usability.
> **Last Updated:** 2025-07-14

---

## Device & Viewport Matrix

| Device Category | Viewport Width | Test Device / Emulation  |
| --------------- | -------------- | ------------------------ |
| Small phone     | 320px          | iPhone SE (1st gen)      |
| Standard phone  | 375px          | iPhone 12/13/14          |
| Large phone     | 414px          | iPhone 14 Plus / Pixel 7 |
| Small tablet    | 768px          | iPad Mini                |
| Tablet          | 1024px         | iPad Pro 11"             |

---

## Critical Pages to Test at 375px

### Public Pages

- [ ] **Home page (`/`)** — Hero section readable, CTA buttons visible
- [ ] **Login (`/login`)** — Form fits screen, no horizontal scroll
- [ ] **Sign Up (`/signup`)** — All fields accessible, keyboard doesn't obscure inputs
- [ ] **Pricing (`/pricing`)** — Plan cards stack vertically, comparison table scrollable
- [ ] **Checkout (`/checkout`)** — Payment form usable, Stripe elements responsive

### Dashboard Pages

- [ ] **QR Codes list (`/qrcodes`)** — Cards/list items stack, actions accessible
- [ ] **Create QR (`/qrcodes/new`)** — Type selector usable, form scrollable
- [ ] **QR Edit (`/qrcodes/[id]/edit`)** — All form sections accessible
- [ ] **Analytics (`/analytics`)** — Charts resize, data readable
- [ ] **Support Tickets (`/support-tickets`)** — List readable, create form usable
- [ ] **Billing (`/billing`)** — Plan info visible, payment methods accessible
- [ ] **Profile/Settings** — All fields editable on mobile

---

## Responsive Breakpoints

Verify layout transitions at Tailwind CSS breakpoints:

| Breakpoint | Width   | Expected Behavior                        |
| ---------- | ------- | ---------------------------------------- |
| Default    | < 640px | Single column, stacked layout            |
| `sm`       | 640px   | Minor layout adjustments                 |
| `md`       | 768px   | Two-column layouts begin                 |
| `lg`       | 1024px  | Full sidebar visible, multi-column grids |
| `xl`       | 1280px  | Wide layout, max-width containers        |

**Checks at each breakpoint:**

- [ ] No horizontal scrollbar appears
- [ ] Text doesn't overflow containers
- [ ] Images scale proportionally
- [ ] Tables are scrollable or reformatted
- [ ] Modals/dialogs fit within viewport

---

## Touch Targets

> Minimum touch target: **44×44px** (WCAG 2.5.8 / Apple HIG)

- [ ] **Navigation links** — Min 44px tap area
- [ ] **Buttons** — All buttons meet minimum size
- [ ] **Form inputs** — Adequate height for finger tapping
- [ ] **Dropdown selectors** — Easy to tap and select options
- [ ] **Close buttons (modals, toasts)** — Large enough to tap accurately
- [ ] **Icon buttons** — Padding provides adequate hit area
- [ ] **Links in text** — Sufficient spacing between adjacent links
- [ ] **Table row actions** — Action buttons not too close together
- [ ] **Checkbox/radio inputs** — Tap area includes label

---

## Navigation

### Hamburger Menu

- [ ] Menu icon visible at mobile breakpoints (< 768px)
- [ ] Tap opens full navigation panel
- [ ] Menu items are large enough to tap (44px+)
- [ ] Active page highlighted in menu
- [ ] Tap outside menu closes it
- [ ] Scroll is locked on body when menu is open
- [ ] Submenu items (if any) expand/collapse correctly
- [ ] All dashboard routes accessible from menu

### Bottom Navigation (if applicable)

- [ ] Fixed to bottom of viewport
- [ ] Icons + labels visible
- [ ] Active state clearly indicated
- [ ] Doesn't overlap page content

---

## Form Usability on Mobile

- [ ] **Virtual keyboard:** Doesn't permanently obscure active input
- [ ] **Input types:** `type="email"` shows email keyboard, `type="tel"` shows number pad
- [ ] **Auto-complete:** Browser autofill works for login/signup
- [ ] **Date pickers:** Native or custom pickers work on touch
- [ ] **File uploads:** Camera and file picker both available
- [ ] **Form scrolling:** Long forms scroll smoothly
- [ ] **Error messages:** Visible without scrolling back up
- [ ] **Submit button:** Always reachable (not hidden behind keyboard)
- [ ] **Multi-step forms:** Progress indicator visible, back/next usable

---

## QR Code Specific

- [ ] **QR preview:** QR code preview renders at readable size on mobile
- [ ] **QR scanning:** Camera-based scanning works (if applicable)
- [ ] **QR download:** Download button triggers mobile download/share
- [ ] **QR type selector:** Carousel or list of types is scrollable and tappable
- [ ] **Color picker:** Works with touch interaction

---

## Performance on Mobile

- [ ] **Initial load:** < 3 seconds on 4G connection
- [ ] **Interaction delay:** < 100ms response to taps
- [ ] **Scrolling:** Smooth 60fps scrolling, no jank
- [ ] **Images:** Properly sized (no loading 2000px images on 375px screen)
- [ ] **Lazy loading:** Below-fold content loads on scroll
- [ ] **Memory:** No excessive memory usage causing crashes

---

## Orientation

- [ ] **Portrait → Landscape:** Layout adjusts without breaking
- [ ] **Landscape → Portrait:** Content reflows correctly
- [ ] **Modals:** Visible and usable in both orientations
- [ ] **Forms:** Keyboard + form still usable in landscape

---

## Accessibility on Mobile

- [ ] **VoiceOver (iOS):** All interactive elements announced correctly
- [ ] **TalkBack (Android):** All interactive elements announced correctly
- [ ] **Zoom:** Page content readable at 200% zoom
- [ ] **High contrast:** Text readable in high contrast mode
- [ ] **Reduced motion:** Animations respect `prefers-reduced-motion`
