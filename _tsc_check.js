const { execSync } = require('child_process');
const targets = [
  'use-api.ts',
  'qrcodes\\page.tsx', 'qrcodes/page.tsx',
  'users\\page.tsx', 'users/page.tsx',
  'domains\\page.tsx', 'domains/page.tsx',
  'custom-codes\\page.tsx', 'custom-codes/page.tsx',
  'subscriptions\\page.tsx', 'subscriptions/page.tsx',
  'TeamManagement.tsx',
  'AbuseReportsTable.tsx',
  'BiolinkDesigner.tsx',
  'PortfolioBlock.tsx'
];
try {
  const out = execSync('npx tsc --noEmit 2>&1', {
    cwd: __dirname,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    timeout: 300000
  });
  filter(out);
} catch (e) {
  filter(e.stdout || e.stderr || e.message);
}
function filter(text) {
  const lines = text.split(/\r?\n/);
  const matches = lines.filter(l => targets.some(t => l.includes(t)));
  if (matches.length) {
    console.log(matches.join('\n'));
  } else {
    console.log('No errors in changed files');
  }
}
