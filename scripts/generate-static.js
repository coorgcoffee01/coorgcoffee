import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const basePublicDir = path.join(rootDir, '.output', 'public');
const storePublicDir = path.join(rootDir, '.output', 'public-store');
const adminPublicDir = path.join(rootDir, '.output', 'public-admin');
const ssrEntryPath = path.join(rootDir, '.output', 'server', '_ssr', 'ssr.mjs');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function renderRoutes(ssr, routes, targetDir, label) {
  console.log(`Rendering static HTML pages for ${label}...`);
  let count = 0;
  for (const route of routes) {
    try {
      const req = new Request('http://localhost' + route);
      const res = await ssr.default.fetch(req, {}, {});
      if (res.status === 200) {
        const html = await res.text();
        const outFilePath =
          route === '/'
            ? path.join(targetDir, 'index.html')
            : path.join(targetDir, route.replace(/^\//, ''), 'index.html');

        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
        fs.writeFileSync(outFilePath, html, 'utf-8');
        count++;
        console.log(`  ✓ [${label}] ${route} -> ${path.relative(rootDir, outFilePath)}`);
      } else {
        console.warn(`  ⚠ [${label}] ${route} returned status ${res.status}`);
      }
    } catch (err) {
      console.error(`  ✗ [${label}] Error rendering ${route}:`, err.message);
    }
  }
  return count;
}

async function generateStatic() {
  if (!fs.existsSync(ssrEntryPath)) {
    console.error('SSR entry not found at:', ssrEntryPath);
    process.exit(1);
  }

  const ssr = await import(ssrEntryPath);

  // 1. Prepare Storefront directory
  console.log('Preparing Storefront (.output/public-store)...');
  fs.rmSync(storePublicDir, { recursive: true, force: true });
  copyDirSync(basePublicDir, storePublicDir);

  // Ensure NO admin files exist in store
  fs.rmSync(path.join(storePublicDir, 'admin'), { recursive: true, force: true });

  const storeRoutes = [
    '/',
    '/shop',
    '/about',
    '/contact',
    '/cart',
    '/checkout',
    '/account',
    '/privacy-policy',
    '/terms',
    '/shipping-policy',
    '/security-policy',
    '/product/aa-grade-arabica-coffee-beans',
    '/product/aa-grade-robusta-coffee-beans',
    '/product/blend-roasted-coffee-beans',
    '/product/arabica-coffee-powder',
    '/product/robusta-coffee-powder',
    '/product/arabica-filter-coffee',
    '/product/robusta-filter-coffee',
    '/product/coorg-mist-blend-filter-coffee',
    '/product/espresso-coffee-powder',
    '/product/moka-pot-coffee-powder',
  ];

  const storeCount = await renderRoutes(ssr, storeRoutes, storePublicDir, 'Storefront');

  // 2. Prepare Dedicated Admin directory
  console.log('Preparing Admin Console (.output/public-admin)...');
  fs.rmSync(adminPublicDir, { recursive: true, force: true });
  copyDirSync(basePublicDir, adminPublicDir);

  const adminRoutes = [
    '/admin',
    '/admin/login',
    '/admin/products',
    '/admin/orders',
    '/admin/shipping',
    '/admin/customers',
    '/admin/coupons',
    '/admin/banners',
    '/admin/reviews',
    '/admin/security',
    '/admin/analytics',
    '/admin/settings',
    '/admin/admin-users',
    '/admin/notifications',
    '/admin/payments',
    '/admin/reports',
    '/admin/categories',
    '/admin/subscribers',
  ];

  const adminCount = await renderRoutes(ssr, adminRoutes, adminPublicDir, 'Admin Console');

  // For Admin root index.html: make it load admin login by default
  const adminLoginHtmlPath = path.join(adminPublicDir, 'admin', 'login', 'index.html');
  if (fs.existsSync(adminLoginHtmlPath)) {
    fs.copyFileSync(adminLoginHtmlPath, path.join(adminPublicDir, 'index.html'));
  }

  console.log(`Successfully generated ${storeCount} storefront routes and ${adminCount} admin routes.`);
}

generateStatic().catch((err) => {
  console.error('Fatal static generation error:', err);
  process.exit(1);
});
