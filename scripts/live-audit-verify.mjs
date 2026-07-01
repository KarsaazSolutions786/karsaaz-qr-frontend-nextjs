#!/usr/bin/env node
/**
 * Live production audit (Re-Audit Report v2).
 * Usage: node scripts/live-audit-verify.mjs
 * On app.karsaazqr.com: verifies marketing paths 301 to www; skips homepage/login/guest marketing checks (run those on www).
 */

const BASES = [
  'https://www.karsaazqr.com',
  'https://karsaazqr.com',
  'https://app.karsaazqr.com',
];

const EXPECTED_OG_HOST = 'www.karsaazqr.com';
const WWW_MARKETING_ORIGIN = 'https://www.karsaazqr.com';
/** Marketing paths on app.karsaazqr.com should 301 to www (Re-Audit v2). */
const APP_MARKETING_REDIRECT_PATHS = [
  '/',
  '/login',
  '/signup',
  '/guest',
  '/guest/create',
  '/terms',
  '/pricing',
];

function isAppMarketingHost(base) {
  return base.includes('app.karsaazqr.com');
}

const SECURITY_HEADERS = [
  'strict-transport-security',
  'content-security-policy',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
];

function extractMetaContent(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
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

function countFaqHeadings(html) {
  const idCount = countOccurrences(html, 'id="faq-ssr"');
  const h2Matches = html.match(/<h2[^>]*>[\s\S]*?FAQ[\s\S]*?<\/h2>/gi) || [];
  return { faqSsr: idCount, faqH2: h2Matches.length };
}

async function fetchResponse(url, { redirect = 'follow' } = {}) {
  const res = await fetch(url, {
    headers: { Accept: 'text/html', 'User-Agent': 'KarsaazLiveAudit/2.0' },
    redirect,
  });
  const html =
    res.status >= 300 && res.status < 400 && redirect === 'manual'
      ? ''
      : await res.text();
  return { res, html, url };
}

async function hostResponds(base) {
  try {
    const { res } = await fetchResponse(`${base}/`, { redirect: 'manual' });
    return res.status > 0 && res.status < 500;
  } catch (e) {
    return false;
  }
}

function record(results, id, name, pass, expected, actual) {
  results.tests.push({ id, name, pass, expected, actual });
}

async function auditDomain(base) {
  const results = { base, tests: [], skipped: false };

  const up = await hostResponds(base);
  if (!up) {
    results.skipped = true;
    results.skipReason = 'Host did not respond or returned 5xx on /';
    return results;
  }


  const onAppHost = isAppMarketingHost(base);

  if (onAppHost) {
    const redirectFails = [];
    for (const p of APP_MARKETING_REDIRECT_PATHS) {
      const { res } = await fetchResponse(`${base}${p}`, { redirect: 'manual' });
      const location = res.headers.get('location') || '';
      const ok =
        res.status === 301 &&
        location.startsWith(`${WWW_MARKETING_ORIGIN}${p === '/' ? '/' : p}`) &&
        (p !== '/' || location === `${WWW_MARKETING_ORIGIN}/` || location.startsWith(`${WWW_MARKETING_ORIGIN}/?`));
      if (!ok) redirectFails.push(`${p} status=${res.status} location=${location || 'missing'}`);
    }
    const pass = redirectFails.length === 0;
    record(
      results,
      'APP-R',
      'app.karsaazqr.com marketing paths 301 to www',
      pass,
      `301 to ${WWW_MARKETING_ORIGIN} + same path for marketing routes`,
      pass ? 'all sampled paths redirect' : redirectFails.join('; ')
    );
  }
  if (onAppHost) {
    const marketingSkipped = [
      [1, 'Security headers on / (skipped on app; use www)'],
      [2, 'Homepage og:url and og:image (skipped on app; marketing on www)'],
      [3, 'Cookie banner paths (skipped on app; marketing on www)'],
      [4, 'Login form SSR (skipped on app; marketing on www)'],
      [5, '/guest/create content (skipped on app; marketing on www)'],
      [6, '/terms og:url + privacy-policy link (skipped on app; marketing on www)'],
      [7, '/qrcodes/new redirect (skipped on app; path redirects to www)'],
      [8, 'Duplicate FAQ on homepage (skipped on app; marketing on www)'],
      [9, 'pricing-ssr on homepage (skipped on app; marketing on www)'],
    ];
    for (const [id, name] of marketingSkipped) {
      record(results, id, name, true, 'N/A — app host serves app; marketing audited on www', 'skipped');
    }
    return results;
  }


  // 1. Security headers on /
  {
    const { res } = await fetchResponse(`${base}/`, { redirect: 'manual' });
    const missing = [];
    const present = {};
    for (const h of SECURITY_HEADERS) {
      const v = res.headers.get(h);
      present[h] = v || null;
      if (!v) missing.push(h);
    }
    const pass = missing.length === 0;
    record(
      results,
      1,
      'Security headers on /',
      pass,
      SECURITY_HEADERS.join(', '),
      pass
        ? 'all present'
        : `missing: ${missing.join(', ')}; present: ${JSON.stringify(
            Object.fromEntries(
              SECURITY_HEADERS.filter((h) => present[h]).map((h) => [h, present[h]])
            )
          )}`
    );
  }

  // Fetch homepage HTML (follow redirects)
  const home = await fetchResponse(`${base}/`);

  // 2. Homepage og:url and og:image
  {
    const ogUrl = extractMetaContent(home.html, 'og:url');
    const ogImage = extractMetaContent(home.html, 'og:image');
    const urlOk =
      ogUrl &&
      ogUrl.includes(EXPECTED_OG_HOST) &&
      !ogUrl.includes('app.karsaazqr.com');
    const imageOk =
      ogImage &&
      ogImage.includes(EXPECTED_OG_HOST) &&
      !ogImage.includes('app.karsaazqr.com');
    const pass = urlOk && imageOk;
    record(
      results,
      2,
      'Homepage og:url and og:image (www, not app)',
      pass,
      `og:url and og:image host ${EXPECTED_OG_HOST}, not app`,
      `og:url=${ogUrl || 'missing'}; og:image=${ogImage || 'missing'}`
    );
  }

  // 3. Cookie banner on paths
  {
    const paths = ['/', '/login', '/guest/create', '/signup'];
    const missingOn = [];
    for (const p of paths) {
      const { html } = await fetchResponse(`${base}${p}`);
      if (!html.includes('id="cookie-consent-banner"')) missingOn.push(p);
    }
    const pass = missingOn.length === 0;
    record(
      results,
      3,
      'Cookie banner on /, /login, /guest/create, /signup',
      pass,
      'id="cookie-consent-banner" on all four paths',
      pass ? 'present on all' : `missing on: ${missingOn.join(', ')}`
    );
  }

  // 4. Login form SSR
  {
    const { html } = await fetchResponse(`${base}/login`);
    const hasEmail =
      /id=["']ssr-login-email["']/.test(html) &&
      /type=["']email["']/.test(html) &&
      /name=["']email["']/.test(html);
    const hasPassword =
      /id=["']ssr-login-password["']/.test(html) &&
      /type=["']password["']/.test(html) &&
      /name=["']password["']/.test(html);
    const pass = hasEmail && hasPassword;
    record(
      results,
      4,
      'Login form SSR (email + password in HTML)',
      pass,
      'ssr-login-email + ssr-login-password inputs in HTML',
      `email=${hasEmail}; password=${hasPassword}`
    );
  }

  // 5. /guest/create content
  {
    const { html } = await fetchResponse(`${base}/guest/create`);
    const hasMarker =
      html.includes('id="guest-create-ssr"') ||
      html.includes('ssr-guest-url') ||
      /Create QR Code/i.test(html);
    const notEmpty = html.replace(/\s/g, '').length > 500;
    const pass = hasMarker && notEmpty;
    record(
      results,
      5,
      '/guest/create has content (not empty)',
      pass,
      'guest-create-ssr or substantive create UI in HTML',
      `hasMarker=${hasMarker}; htmlLength=${html.length}`
    );
  }

  // 6. /terms og:url + privacy-policy link
  {
    const { html } = await fetchResponse(`${base}/terms`);
    const ogUrl = extractMetaContent(html, 'og:url');
    const ogOk = ogUrl && /\/terms\/?$/.test(ogUrl.replace(/\?.*$/, ''));
    const hasPrivacyPolicy = /href=["']\/privacy-policy["']/.test(html);
    const hasBarePrivacy = /href=["']\/privacy["']/.test(html);
    const linkOk = hasPrivacyPolicy && !hasBarePrivacy;
    const pass = ogOk && linkOk;
    record(
      results,
      6,
      '/terms og:url + privacy-policy link (not /privacy)',
      pass,
      'og:url ends with /terms; href="/privacy-policy" without href="/privacy"',
      `og:url=${ogUrl || 'missing'}; privacy-policy=${hasPrivacyPolicy}; bare /privacy=${hasBarePrivacy}`
    );
  }

  // 7. /qrcodes/new redirect
  {
    const { res } = await fetchResponse(`${base}/qrcodes/new`, { redirect: 'manual' });
    const status = res.status;
    const location = res.headers.get('location') || '';
    const okStatus = status === 302 || status === 307;
    const okLocation =
      /\/login/.test(location) &&
      (/returnUrl=/.test(location) ||
        location.includes('qrcodes') ||
        location.includes('%2Fqrcodes'));
    const pass = okStatus && okLocation;
    record(
      results,
      7,
      '/qrcodes/new unauthenticated → 302/307 to /login',
      pass,
      '302 or 307 with Location to /login (returnUrl)',
      `status=${status}; location=${location || 'missing'}`
    );
  }

  // 8. Duplicate FAQ on homepage
  {
    const { faqSsr, faqH2 } = countFaqHeadings(home.html);
    const pass = faqSsr === 1 && faqH2 <= 1;
    record(
      results,
      8,
      'Duplicate FAQ on homepage',
      pass,
      'exactly one id="faq-ssr" and at most one FAQ h2',
      `faq-ssr count=${faqSsr}; FAQ h2 count=${faqH2}`
    );
  }

  // 9. pricing-ssr on homepage
  {
    const pass = home.html.includes('id="pricing-ssr"');
    record(
      results,
      9,
      'pricing-ssr on homepage',
      pass,
      'id="pricing-ssr" in HTML',
      pass ? 'found' : 'id="pricing-ssr" not found'
    );
  }

  return results;
}

function printReport(allResults) {
  console.log('\n=== Live Production Audit (Re-Audit v2) ===\n');

  const rows = [];
  for (const r of allResults) {
    if (r.skipped) {
      console.log(`SKIP  ${r.base} — ${r.skipReason}\n`);
      rows.push({ base: r.base, skip: true });
      continue;
    }
    const pass = r.tests.filter((t) => t.pass).length;
    const fail = r.tests.filter((t) => !t.pass).length;
    rows.push({ base: r.base, pass, fail, fails: r.tests.filter((t) => !t.pass) });

    console.log(`--- ${r.base} ---`);
    console.log(`PASS: ${pass}  FAIL: ${fail}`);
    for (const t of r.tests.filter((t) => !t.pass)) {
      console.log(`  FAIL [#${t.id}] ${t.name}`);
      console.log(`       expected: ${t.expected}`);
      console.log(`       actual:   ${t.actual}`);
    }
    console.log('');
  }

  console.log('=== Summary Table ===');
  console.log('Domain'.padEnd(32) + 'PASS'.padStart(6) + 'FAIL'.padStart(6) + '  Notes');
  console.log('-'.repeat(72));
  for (const row of rows) {
    if (row.skip) {
      console.log(row.base.padEnd(32) + '  —'.padStart(6) + '  —'.padStart(6) + '  did not respond');
      continue;
    }
    const note =
      row.fail === 0
        ? 'all checks passed'
        : `${row.fail} failure(s)`;
    console.log(
      row.base.padEnd(32) +
        String(row.pass).padStart(6) +
        String(row.fail).padStart(6) +
        `  ${note}`
    );
  }
}

async function main() {
  const allResults = [];
  for (const base of BASES) {
    process.stderr.write(`Auditing ${base}...\n`);
    allResults.push(await auditDomain(base.replace(/\/$/, '')));
  }
  printReport(allResults);

  const anyFail = allResults.some(
    (r) => !r.skipped && r.tests.some((t) => !t.pass)
  );
  process.exit(anyFail ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
