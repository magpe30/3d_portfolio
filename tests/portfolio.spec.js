import { test, expect } from 'playwright/test';

test.describe('responsive layout', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const width of [320, 390, 768, 1440, 1920]) {
    test(`content stays readable and within the viewport at ${width}px`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const layout = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('h1, h2, h3, h4, h5, p, .header-actions')];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          clipped: elements
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
            })
            .map((el) => el.textContent),
          bodySize: parseFloat(getComputedStyle(document.querySelector('.about-copy p')).fontSize),
          heroSize: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
        };
      });
      expect(layout.overflow).toBe(false);
      expect(layout.clipped).toEqual([]);
      expect(layout.bodySize).toBeGreaterThanOrEqual(16);
      expect(layout.heroSize).toBeGreaterThanOrEqual(39);
      await expect(page.locator('.challenge-notes')).not.toHaveAttribute('open');
      await expect(page.locator('#case-title')).toBeHidden();
      await expect(page.locator('.technical-notes')).not.toHaveAttribute('open');
      expect(errors).toEqual([]);
      // Load lazy media before capturing sections outside the initial viewport.
      for (const image of await page.locator('main img:visible').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
          .toBe(true);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: test.info().outputPath(`hero-${width}.png`) });
      await page.locator('.project-intro').scrollIntoViewIfNeeded();
      await page.screenshot({ path: test.info().outputPath(`work-${width}.png`) });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: test.info().outputPath(`portfolio-${width}.png`),
        fullPage: true,
      });
    });
  }
});

for (const reducedMotion of ['reduce', 'no-preference']) {
  test(`keyboard navigation moves focus to content with motion ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to selected work' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#projects')).toBeFocused();
    await expect(page).toHaveURL(/#projects$/);
    const workLink = page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true });
    await expect(workLink).toHaveAttribute('aria-current', 'location');
    await page.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
    await expect(page.locator('#experience')).toBeFocused();
    await expect(
      page.getByRole('link', { name: /BlackCloak Visit company website/ }),
    ).toHaveAttribute('href', 'https://blackcloak.io/');
  });
}

test('a live system preference change stops and restores ambient motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('h1')).toHaveAttribute('data-reveal', 'static');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
});

test('reduced motion defers video loading but allows explicit playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const video = page.locator('video');
  await page.locator('.project-media').scrollIntoViewIfNeeded();
  await expect(video).not.toHaveAttribute('src');
  await page.getByRole('button', { name: 'Play preview', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause preview', exact: true })).toBeVisible();
  await expect.poll(() => video.evaluate((element) => element.paused)).toBe(false);
  await page.getByRole('button', { name: 'Pause preview', exact: true }).click();
  await expect.poll(() => video.evaluate((element) => element.paused)).toBe(true);
});

test('a failed video preserves the screenshot and explains the fallback', async ({ page }) => {
  await page.route('**/videos/*.mp4', (route) => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play preview', exact: true }).click();
  await expect(
    page.getByText('Preview unavailable. The screenshot is shown instead.'),
  ).toBeVisible();
  await expect(page.locator('.media-image')).toBeVisible();
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View screenshot' })).toBeVisible();
});

test('both case study disclosures open independently with the keyboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const challenge = page.locator('.challenge-notes');
  await expect(challenge).not.toHaveAttribute('open');
  await expect(page.locator('#case-title')).toBeHidden();
  await page
    .locator('.case-study')
    .screenshot({ path: test.info().outputPath('case-study-closed.png') });
  await challenge.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(challenge).toHaveAttribute('open');
  await expect(page.getByRole('heading', { name: 'Compare the same journey.' })).toBeVisible();
  await expect(page.locator('.technical-notes')).not.toHaveAttribute('open');
  await page.keyboard.press('Enter');
  await expect(challenge).not.toHaveAttribute('open');
  await expect(page.locator('#case-title')).toBeHidden();
  const summary = page.locator('.technical-notes summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.technical-notes')).toHaveAttribute('open');
  await expect(page.getByRole('link', { name: 'Browse the tests' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('.technical-notes')).not.toHaveAttribute('open');
});

for (const viewport of [
  { width: 1430, height: 682 },
  { width: 1366, height: 600 },
  { width: 1920, height: 900 },
]) {
  test(`the entire block composition fits in the opening frame at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.hero-art')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.hero-bottom')).toBeInViewport({ ratio: 1 });
    const art = await page.locator('.hero-art').boundingBox();
    const title = await page.locator('h1').boundingBox();
    expect(art.y).toBeLessThan(title.y + title.height);
    expect(art.height).toBeGreaterThan(viewport.height * 0.45);
    // The overlapping artwork must not intercept the hero's navigation links.
    await page.getByRole('link', { name: 'View selected work', exact: true }).click();
    await expect(page.locator('#projects')).toBeFocused();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: test.info().outputPath('hero-fit.png') });
  });
}

test('company row follows the pointer, stays within the viewport, and is clickable throughout', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await context.route('https://blackcloak.io/**', (route) =>
    route.fulfill({ body: 'Company destination' }),
  );
  await page.goto('/');
  const row = page.locator('.experience-row').first();
  const follower = page.locator('.company-cursor').first();
  await row.hover({ position: { x: 20, y: 30 } });
  await expect(follower).toHaveCSS('opacity', '1');
  const before = await follower.boundingBox();
  await row.hover({ position: { x: 180, y: 70 } });
  await expect.poll(async () => (await follower.boundingBox()).x).toBeGreaterThan(before.x + 100);
  const bounds = await row.boundingBox();
  await page.mouse.move(bounds.x + bounds.width - 4, bounds.y + 80);
  await expect
    .poll(async () => {
      const rect = await follower.boundingBox();
      return rect.x >= 0 && rect.x + rect.width <= 1440;
    })
    .toBe(true);
  await expect(follower).toHaveCSS('opacity', '1');
  await page.screenshot({ path: test.info().outputPath('experience-hover.png') });
  await page.mouse.move(10, 10);
  await expect(follower).toHaveCSS('opacity', '0');
  // The index area, well away from the text, is part of the same native link.
  const popupPromise = page.waitForEvent('popup');
  await row.click({ position: { x: 16, y: 24 } });
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe('https://blackcloak.io/');
  await popup.close();
});

test('company row keeps a stationary cue for keyboard and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const row = page.getByRole('link', { name: /BlackCloak Visit company website/ });
  await row.focus();
  await expect(row).toBeFocused();
  await expect(row.locator('.company-link')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await row.hover();
  await expect(row.locator('.company-link')).toHaveCSS('opacity', '1');
  await expect(page.locator('.company-cursor').first()).toHaveCSS('opacity', '0');
});

test('ASCII blocks keep living texture after landing and pause offscreen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const canvas = page.locator('.ascii-blocks');
  await expect
    .poll(() =>
      canvas.evaluate((el) => {
        const pixels = el.getContext('2d').getImageData(0, 0, el.width, el.height).data;
        return pixels.some((value, index) => index % 4 === 3 && value > 0);
      }),
    )
    .toBe(true);
  const initial = await canvas.evaluate((el) => el.toDataURL());
  await expect
    .poll(() => canvas.evaluate((el) => el.toDataURL()), { timeout: 3000 })
    .not.toBe(initial);
  await page.screenshot({ path: test.info().outputPath('blocks-falling.png') });
  // Falling finishes, but the face texture continues to move within the settled blocks.
  await page.waitForTimeout(7000);
  const settled = await canvas.evaluate((el) => el.toDataURL());
  await page.waitForTimeout(250);
  expect(await canvas.evaluate((el) => el.toDataURL())).not.toBe(settled);
  expect(settled).not.toBe(initial);
  await canvas.hover({ position: { x: 450, y: 350 } });
  await page.waitForTimeout(350);
  await page.screenshot({ path: test.info().outputPath('blocks-settled.png') });
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect(canvas).not.toBeInViewport();
  await page.waitForTimeout(150);
  const offscreen = await canvas.evaluate((el) => el.toDataURL());
  await page.waitForTimeout(300);
  expect(await canvas.evaluate((el) => el.toDataURL())).toBe(offscreen);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off');
  await page.evaluate(() => window.scrollTo(0, 0));
  const reduced = await canvas.evaluate((el) => el.toDataURL());
  await page.waitForTimeout(300);
  expect(await canvas.evaluate((el) => el.toDataURL())).toBe(reduced);
});

test('reduced motion shows the finished block composition immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const canvas = page.locator('.ascii-blocks');
  await expect
    .poll(() =>
      canvas.evaluate((el) => {
        const pixels = el.getContext('2d').getImageData(0, 0, el.width, el.height).data;
        return pixels.some((value, index) => index % 4 === 3 && value > 0);
      }),
    )
    .toBe(true);
  const still = await canvas.evaluate((el) => el.toDataURL());
  await page.waitForTimeout(500);
  expect(await canvas.evaluate((el) => el.toDataURL())).toBe(still);
});
