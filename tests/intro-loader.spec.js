import { test, expect } from 'playwright/test';

async function holdRequest(page, pattern) {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route(pattern, async (route) => {
    await gate;
    await route.continue();
  });
  return release;
}

for (const width of [390, 1440]) {
  test(`loader waits for the 3D scene at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const release = await holdRequest(page, '**/heroObjectScene-*.js');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const progress = page.getByRole('progressbar', { name: 'Preparing portfolio' });
    await expect(progress).toHaveAttribute('aria-valuenow', '25');
    await expect(page.locator('.portfolio-content')).toHaveAttribute('inert', '');
    await expect(page.locator('h1')).toHaveAttribute('data-reveal', 'waiting');
    await page.mouse.wheel(0, 500);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: test.info().outputPath(`loader-${width}.png`) });
    release();
    await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl');
    await expect(progress).toHaveAttribute('aria-valuenow', '100');
    await expect(page.locator('.intro-loader')).toHaveCount(0);
    await expect(page.locator('.portfolio-content')).not.toHaveAttribute('inert');
    await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('data-reveal', 'visible');
  });
}

test('rendering the scene does not finish loading before the font is ready', async ({ page }) => {
  const release = await holdRequest(page, '**/*.woff2');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  release();
  await expect(page.locator('.intro-loader')).toHaveCount(0);
});

test('keyboard users can skip a stalled scene without a late canvas appearing', async ({
  page,
}) => {
  const release = await holdRequest(page, '**/heroObjectScene-*.js');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Enter portfolio' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.intro-loader')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Skip to selected work' })).toBeFocused();
  release();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'static');
  await expect(page.locator('.hero-object-canvas')).toHaveCount(0);
});

test('a failed scene download reveals the fallback artwork', async ({ page }) => {
  await page.route('**/heroObjectScene-*.js', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.intro-loader')).toHaveCount(0);
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'static');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('a stalled request times out and leaves the portfolio accessible', async ({ page }) => {
  const release = await holdRequest(page, '**/heroObjectScene-*.js');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  await expect(page.locator('.intro-loader')).toHaveCount(0, { timeout: 12000 });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'static');
  release();
});

test('reduced motion uses a static loader and does not download the 3D scene', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const sceneRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('heroObjectScene-')) sceneRequests.push(request.url());
  });
  const release = await holdRequest(page, '**/*.woff2');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.intro-loader')).toHaveCSS('transition-duration', '0s');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  release();
  await expect(page.locator('.intro-loader')).toHaveCount(0);
  expect(sceneRequests).toEqual([]);
});

test('direct section links and case studies bypass the intro', async ({ page }) => {
  for (const path of ['/#projects', '/work/ride-sd', '/work/fluent']) {
    await page.goto(path);
    await expect(page.locator('.portfolio')).toHaveAttribute('data-loading', 'false');
    await expect(page.locator('.intro-loader')).toHaveCount(0);
  }
});
