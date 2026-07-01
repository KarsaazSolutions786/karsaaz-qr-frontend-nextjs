#!/usr/bin/env node
/**
 * SSR verification audit for local Next.js dev server.
 * Usage: node scripts/ssr-verify.mjs [baseUrl]
 * Env: BASE_URL (default http://localhost:3000)
 */

const DEFAULT_BASE = process.env.BASE_URL || process.argv[2] || 'http://localhost:3000';

function pass(label, detail = '') {
  console.log(`PASS  ${label}${detail ? ` — ${detail}` : ''}`);
}
function fail(label, detail = '') {
  console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
}

function extractMetaContent(html, property) {
  const re = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    'i'
  );
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    'i'
  );
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

function countOccurrences(html, needle) {
  let count = 0;
  let idx = 0;
  while (true) {
    idx = html.indexOf(needle, idx);
    if (idx === -1) break;
    count += 1;
    idx += needle.length;
  }
  return count;
}

function isNextHtml(html) {
  return html.includes('__NEXT_DATA__') || html.includes('/_next/') || html.includes('id="pricing-ssr"');
}

async function resolveBaseUrl(preferred) {
  const candidates = [...new Set([preferred, 'http://127.0.0.1:3000', 'http://localhost:3000'])];
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/`, { headers: { Accept: 'text/html' } });
      const html = await res.text();
      if (isNextHtml(html)) {
        if (base !== preferred) {
          console.log(
            `NOTE  ${preferred} did not return Next.js HTML; using ${base} instead.\n`
          );
        }
        return base;
      }
    } catch {
      /* try next */
    }
  }
  console.log(
    `WARN  Could not detect Next.js on ${candidates.join(', ')}; continuing with ${preferred}.\n`
  );
  return preferred;
}

async function fetchHtml(base, path) {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'text/html' },
    redirect: 'follow',
  });
  const html = await res.text();
  return { res, html, url };
}

async function fetchNoRedirect(base, path) {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'text/html' },
    redirect: 'manual',
  });
  const html = res.status >= 300 && res.status < 400 ? '' : await res.text();
  return { res, html, url };
}

async function auditLogin(base) {
  console.log('\n=== /login ===');
  const { html } = await fetchHtml(base, '/login');

  const ogUrl = extractMetaContent(html, 'og:url');
  if (ogUrl && /\/login\/?$/.test(ogUrl)) pass('og:url', ogUrl);
  else fail('og:url', ogUrl || 'missing');

  const ogImage = extractMetaContent(html, 'og:image');
  if (ogImage) pass('og:image', ogImage);
  else fail('og:image', 'missing');

  if (html.includes('id="cookie-consent-banner"')) pass('cookie banner present');
  else fail('cookie banner present', 'id="cookie-consent-banner" not found');

  const hasEmail =
    /id=["']ssr-login-email["']/.test(html) &&
    /type=["']email["']/.test(html) &&
    /name=["']email["']/.test(html);
  const hasPassword =
    /id=["']ssr-login-password["']/.test(html) &&
    /type=["']password["']/.test(html) &&
    /name=["']password["']/.test(html);

  if (hasEmail) pass('login form email input in HTML');
  else fail('login form email input in HTML');

  if (hasPassword) pass('login form password input in HTML');
  else fail('login form password input in HTML');
}

async function auditGuestCreate(base) {
  console.log('\n=== /guest/create ===');
  const { html } = await fetchHtml(base, '/guest/create');

  const ogUrl = extractMetaContent(html, 'og:url');
  if (ogUrl && ogUrl.includes('/guest/create')) pass('og:url', ogUrl);
  else fail('og:url', ogUrl || 'missing');

  if (html.includes('id="cookie-consent-banner"')) pass('cookie banner present');
  else fail('cookie banner present');

  if (html.includes('id="guest-create-ssr"')) pass('guest-create-ssr content');
  else fail('guest-create-ssr content', 'id="guest-create-ssr" not found');
}

async function auditTerms(base) {
  console.log('\n=== /terms ===');
  const { html } = await fetchHtml(base, '/terms');

  const ogUrl = extractMetaContent(html, 'og:url');
  if (ogUrl && /\/terms\/?$/.test(ogUrl)) pass('og:url', ogUrl);
  else fail('og:url', ogUrl || 'missing');

  const hasPrivacyPolicy = /href=["']\/privacy-policy["']/.test(html);
  const hasBarePrivacy = /href=["']\/privacy["']/.test(html);
  if (hasPrivacyPolicy && !hasBarePrivacy) pass('privacy-policy link (not /privacy)');
  else if (hasBarePrivacy) fail('privacy-policy link', 'found href="/privacy"');
  else fail('privacy-policy link', 'href="/privacy-policy" not found');

  if (html.includes('id="terms-ssr"')) pass('terms-ssr content');
  else fail('terms-ssr content');
}

async function auditHome(base) {
  console.log('\n=== / (home) ===');
  const { html } = await fetchHtml(base, '/');

  const faqCount = countOccurrences(html, 'id="faq-ssr"');
  if (faqCount === 1) pass('faq sections count', '1');
  else fail('faq sections count', `expected 1, got ${faqCount}`);

  if (html.includes('id="pricing-ssr"')) pass('pricing-ssr present');
  else fail('pricing-ssr present');
}

async function auditQrcodesNewRedirect(base) {
  console.log('\n=== /qrcodes/new (unauthenticated redirect) ===');
  const { res } = await fetchNoRedirect(base, '/qrcodes/new');
  const status = res.status;
  const location = res.headers.get('location') || '';

  const okStatus = status === 302 || status === 307;
  if (okStatus) pass('redirect status', String(status));
  else fail('redirect status', `expected 302 or 307, got ${status}`);

  const okLocation =
    /\/login\?returnUrl=/.test(location) &&
    (location.includes('qrcodes') || location.includes('%2Fqrcodes'));
  if (okLocation) pass('redirect location', location);
  else fail('redirect location', location || 'missing');
}

async function main() {
  const preferred = DEFAULT_BASE.replace(/\/$/, '');
  console.log(`SSR verification — preferred base: ${preferred}`);
  const base = await resolveBaseUrl(preferred);
  console.log(`Active base URL: ${base}`);

  await auditLogin(base);
  await auditGuestCreate(base);
  await auditTerms(base);
  await auditHome(base);
  await auditQrcodesNewRedirect(base);

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
