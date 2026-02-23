# Cross-Browser Testing Checklist — Karsaaz QR

> **Purpose:** Ensure consistent behavior across all supported browsers.
> **Last Updated:** 2025-07-14

---

## Browser Testing Matrix

| Browser          | Version | OS              | Priority |
| ---------------- | ------- | --------------- | -------- |
| Chrome           | Latest  | Windows / macOS | 🔴 High  |
| Chrome           | Latest  | Android         | 🔴 High  |
| Firefox          | Latest  | Windows / macOS | 🟡 Med   |
| Safari           | Latest  | macOS           | 🔴 High  |
| Safari (Mobile)  | Latest  | iOS             | 🔴 High  |
| Edge             | Latest  | Windows         | 🟡 Med   |
| Samsung Internet | Latest  | Android         | 🟢 Low   |

---

## Critical Flows to Verify Per Browser

### Authentication

- [ ] Login with email/password
- [ ] Sign up with all fields
- [ ] Forgot password flow
- [ ] OAuth/social login (if applicable)
- [ ] Session persistence after browser restart
- [ ] Logout clears session

### QR Code Management

- [ ] Create QR code (all types: URL, SMS, Email, WhatsApp, vCard)
- [ ] Edit existing QR code
- [ ] QR code preview renders correctly
- [ ] QR code download (PNG/SVG)
- [ ] Bulk create from CSV
- [ ] QR code color customization

### Payment & Billing

- [ ] Stripe checkout form renders and accepts input
- [ ] PayPal button loads and is clickable
- [ ] Promo code application
- [ ] Subscription plan selection
- [ ] Payment success/failure redirects

### Navigation & Layout

- [ ] All routes load without errors
- [ ] Sidebar/hamburger menu opens and closes
- [ ] Responsive layout at all breakpoints
- [ ] Modal/dialog opening and closing
- [ ] Toast notifications appear correctly
- [ ] Scroll behavior (smooth scroll, back-to-top)

### Data Display

- [ ] Tables render with correct alignment
- [ ] Charts/graphs render (analytics pages)
- [ ] Pagination works
- [ ] Search/filter functionality
- [ ] Date formatting consistent

---

## CSS Compatibility Concerns

### Flexbox & Grid

- [ ] `display: flex` layouts render correctly in all browsers
- [ ] `display: grid` layouts render correctly
- [ ] `gap` property works (not supported in older Safari < 14.1)
- [ ] `aspect-ratio` property works

### Tailwind CSS Specific

- [ ] `backdrop-blur` renders (Safari may need `-webkit-` prefix)
- [ ] `scroll-snap` behavior consistent
- [ ] `@apply` generated styles render correctly
- [ ] Container queries (if used) — limited browser support

### Animations & Transitions

- [ ] CSS transitions smooth in all browsers
- [ ] `transform` animations render correctly
- [ ] `prefers-reduced-motion` media query respected
- [ ] No animation jank in Firefox

### Forms

- [ ] Custom styled `<select>` dropdowns render correctly
- [ ] Date/time inputs display native pickers
- [ ] `::placeholder` styling consistent
- [ ] `autofill` styling doesn't break custom styles (Chrome autofill background)
- [ ] File input styling works

### Typography

- [ ] Custom fonts load correctly
- [ ] Font rendering consistent (antialiasing differences expected)
- [ ] `text-overflow: ellipsis` works
- [ ] Line clamp (`-webkit-line-clamp`) works

---

## JavaScript API Compatibility

### APIs Used — Verify Support

| API                  | Chrome | Firefox | Safari | Edge | Notes                        |
| -------------------- | ------ | ------- | ------ | ---- | ---------------------------- |
| Fetch API            | ✅     | ✅      | ✅     | ✅   | Universal support            |
| IntersectionObserver | ✅     | ✅      | ✅     | ✅   | Used for lazy loading        |
| ResizeObserver       | ✅     | ✅      | ✅     | ✅   | Used for responsive charts   |
| Clipboard API        | ✅     | ✅      | ⚠️     | ✅   | Safari requires user gesture |
| Web Share API        | ✅     | ❌      | ✅     | ✅   | Firefox desktop unsupported  |
| LocalStorage         | ✅     | ✅      | ⚠️     | ✅   | Safari private mode limited  |
| CSS.supports()       | ✅     | ✅      | ✅     | ✅   | For feature detection        |
| structuredClone()    | ✅     | ✅      | ✅     | ✅   | Deep clone utility           |

### Potential Issues

- [ ] **Safari Private Browsing:** LocalStorage may throw — verify graceful fallback
- [ ] **Firefox:** `navigator.share()` not available — verify share button fallback
- [ ] **Safari:** Clipboard write requires user activation — verify copy button works
- [ ] **Edge:** Verify Stripe.js and PayPal SDK load correctly
- [ ] **iOS Safari:** Fixed positioning quirks in modals — verify modal behavior
- [ ] **Android WebView:** Verify QR scanning camera access (if applicable)

---

## Next.js / React Specific

- [ ] **Hydration:** No hydration mismatch errors in console (all browsers)
- [ ] **Dynamic imports:** Lazy-loaded components load correctly
- [ ] **Image optimization:** Next.js `<Image>` renders with correct format (WebP/AVIF)
- [ ] **Middleware:** Auth redirects work in all browsers
- [ ] **Cookies:** Authentication cookies set and read correctly

---

## Testing Tools

| Tool                 | Purpose                                   |
| -------------------- | ----------------------------------------- |
| BrowserStack         | Cross-browser cloud testing               |
| Playwright           | Automated E2E (Chromium, Firefox, WebKit) |
| Chrome DevTools      | Device emulation, network throttling      |
| Firefox DevTools     | CSS grid inspector, accessibility         |
| Safari Web Inspector | iOS debugging, WebKit-specific issues     |

---

## Reporting Issues

When logging a cross-browser bug, include:

1. **Browser & version** (e.g., Safari 17.2)
2. **OS & version** (e.g., macOS 14.3)
3. **Page/route** where issue occurs
4. **Steps to reproduce**
5. **Expected vs actual behavior**
6. **Screenshot or screen recording**
7. **Console errors** (if any)
