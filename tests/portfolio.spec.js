import { test, expect } from 'playwright/test';

async function scrollSkills(page, progress) {
  await page.locator('.discipline-stack').evaluate((track, progress) => {
    const styles = getComputedStyle(track);
    window.scrollTo({
      top:
        track.getBoundingClientRect().top +
        scrollY -
        parseFloat(styles.getPropertyValue('--stack-top')) +
        parseFloat(styles.getPropertyValue('--scroll-travel')) * progress,
      behavior: 'instant',
    });
  }, progress);
}

test.describe('responsive portfolio', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1440, 1920]) {
    test(`the homepage is readable at ${width}px`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'static');
      await expect(page.locator('.hero-object-canvas')).toHaveCount(0);
      await expect(
        page.getByRole('heading', { name: 'See the same corner in three views.' }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Give each attempt a clear next step.' }),
      ).toBeVisible();
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        clipped: [...document.querySelectorAll('h1, h2, h3, h4, p, .header-actions')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
          })
          .map((el) => el.textContent),
        bodySize: parseFloat(getComputedStyle(document.querySelector('.about-copy p')).fontSize),
      }));
      expect(layout.overflow).toBe(false);
      expect(layout.clipped).toEqual([]);
      expect(layout.bodySize).toBeGreaterThanOrEqual(16);
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el) => el.decode());
      }
      await page.locator('#about').screenshot({
        path: test.info().outputPath(`about-${width}.png`),
        style: '.site-header, .reading-progress, .skip-link { visibility: hidden !important; }',
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: test.info().outputPath(`hero-${width}.png`) });
      await page.screenshot({
        path: test.info().outputPath(`portfolio-${width}.png`),
        fullPage: true,
      });
      expect(errors).toEqual([]);
    });
  }
  for (const slug of ['ride-sd', 'fluent']) {
    for (const width of [390, 1440]) {
      test(`${slug} case study works directly at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/work/${slug}`);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page).toHaveTitle(new RegExp(slug === 'fluent' ? 'Fluent' : 'RIDE SD'));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        for (const img of await page.locator('main img:visible').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate((el) => el.decode());
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: test.info().outputPath(`${slug}-${width}.png`),
          fullPage: true,
        });
        await page.getByRole('link', { name: 'All selected work' }).click();
        await expect(page).toHaveURL(/\/#projects$/);
        await expect(page.locator('#projects')).toBeInViewport();
      });
    }
  }
});

for (const reducedMotion of ['reduce', 'no-preference']) {
  test(`keyboard navigation reaches work and experience with motion ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to selected work' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#projects')).toBeFocused();
    await expect(page).toHaveURL(/#projects$/);
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true }),
    ).toHaveAttribute('aria-current', 'location');
    await page.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
    await expect(page.locator('#experience')).toBeFocused();
    await expect(
      page.getByRole('link', { name: /BlackCloak Visit company website/ }),
    ).toHaveAttribute('href', 'https://blackcloak.io/');
  });
}

test('project links support navigation, reload, and browser back', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: 'Read the RIDESD case study' }).click();
  await expect(page).toHaveURL(/\/work\/ride-sd$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What happened at that corner?' })).toBeVisible();
  await page
    .locator('.case-next')
    .getByRole('link', { name: /Fluent/ })
    .click();
  await expect(page).toHaveURL(/\/work\/fluent$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/work\/ride-sd$/);
  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('#about')).toBeInViewport();
  await expect(page.locator('#about')).toBeFocused();
});

test('WebGL loads progressively and system motion preference persists across navigation', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl', {
    timeout: 20000,
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: test.info().outputPath('hero-webgl.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('.hero-object-canvas')).toHaveCount(0);
  await page.getByRole('link', { name: 'Read the RIDESD case study' }).click();
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off');
  await page.getByRole('link', { name: 'All selected work' }).click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'on');
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl', {
    timeout: 20000,
  });
  expect(errors).toEqual([]);
});

test('live system motion changes remove WebGL and keep the finished composition', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl', {
    timeout: 20000,
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('.hero-object-canvas')).toHaveCount(0);
  await expect(page.locator('h1')).toHaveAttribute('data-reveal', 'static');
  await expect(page.locator('.site-header button')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl', {
    timeout: 20000,
  });
});

test('WebGL context loss preserves the artwork and usable content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'webgl', {
    timeout: 20000,
  });
  await page
    .locator('.hero-object-canvas')
    .evaluate((canvas) =>
      canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext(),
    );
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'static');
  await expect(page.locator('.hero-object-fallback')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'View selected work' }).click();
  await expect(page.locator('#projects')).toBeFocused();
});

test('unavailable WebGL keeps the static composition and navigation', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith('webgl') ? null : original.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('.hero-objects')).toHaveAttribute('data-renderer', 'static');
  await page.getByRole('link', { name: 'View selected work' }).click();
  await expect(page.locator('#projects')).toBeFocused();
});

test('reduced motion defers video but allows explicit playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/ride-sd');
  const video = page.locator('video');
  await page.locator('.project-media').scrollIntoViewIfNeeded();
  await expect(video).not.toHaveAttribute('src');
  await page.getByRole('button', { name: 'Play preview', exact: true }).click();
  await expect.poll(() => video.evaluate((el) => el.paused)).toBe(false);
  await page.getByRole('button', { name: 'Pause preview', exact: true }).click();
  await expect.poll(() => video.evaluate((el) => el.paused)).toBe(true);
});

test('a failed video keeps the screenshot and explains the fallback', async ({ page }) => {
  await page.route('**/videos/*.mp4', (route) => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/ride-sd');
  await page.getByRole('button', { name: 'Play preview', exact: true }).click();
  await expect(
    page.getByText('Preview unavailable. The screenshot is shown instead.'),
  ).toBeVisible();
  await expect(page.locator('.media-image')).toBeVisible();
  await expect(page.locator('video')).toHaveCount(0);
});

test('engineering disclosure is keyboard accessible and reverses mid-animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/work/ride-sd');
  const panel = page.locator('.case-disclosure');
  const content = panel.locator('.case-disclosure-content');
  await panel.locator('summary').focus();
  await page.keyboard.press('Enter');
  const opening = await content.evaluate((el) => {
    const animation = el.getAnimations()[0];
    animation.pause();
    animation.currentTime = 100;
    return { height: el.getBoundingClientRect().height, full: el.scrollHeight };
  });
  expect(opening.height).toBeGreaterThan(0);
  expect(opening.height).toBeLessThan(opening.full);
  const reversal = await panel.evaluate((el) => {
    const content = el.querySelector('.case-disclosure-content');
    const before = content.getBoundingClientRect().height;
    el.querySelector('summary').click();
    const animation = content.getAnimations()[0];
    animation.pause();
    animation.currentTime = 0;
    return { before, after: content.getBoundingClientRect().height };
  });
  expect(Math.abs(reversal.before - reversal.after)).toBeLessThan(1);
  await content.evaluate((el) => el.getAnimations()[0].finish());
  await expect(panel).not.toHaveAttribute('open');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await panel.locator('summary').press('Enter');
  await expect(page.getByRole('link', { name: 'Browse the tests' })).toBeVisible();
  await panel.locator('summary').press('Enter');
  await expect(content).toBeHidden();
});

test('all three discipline drawings render and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const drawings = page.locator('.discipline-art canvas');
  await expect(drawings).toHaveCount(3);
  await expect(page.locator('.discipline-stack')).toHaveAttribute('data-stacking', 'on');
  for (let index = 0; index < 3; index++) {
    const drawing = drawings.nth(index);
    await scrollSkills(page, [0.1, 0.45, 0.85][index]);
    await expect
      .poll(() =>
        drawing.evaluate((canvas) => {
          const pixels = canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height).data;
          return pixels.some((value, index) => index % 4 === 3 && value > 0);
        }),
      )
      .toBe(true);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio')).toHaveAttribute('data-motion', 'off');
  // Allow the static redraw to settle before comparing all three canvases.
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const snapshots = await drawings.evaluateAll((canvases) =>
    canvases.map((canvas) => canvas.toDataURL()),
  );
  await page.waitForTimeout(300);
  expect(
    await drawings.evaluateAll((canvases) => canvases.map((canvas) => canvas.toDataURL())),
  ).toEqual(snapshots);
});

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

test('scrolling changes the project chapter color and reveals its content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const chapter = page.locator('.work-chapter--fluent');
  await expect(chapter).toHaveCSS('background-color', 'rgb(229, 238, 141)');
  await page.evaluate(() => {
    const top =
      document.querySelector('.work-chapter--fluent').getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top - 100, behavior: 'instant' });
  });
  await expect(chapter).toHaveCSS('background-color', 'rgb(234, 197, 228)');
  await expect(chapter.locator('.reveal')).toHaveCSS('opacity', '1');
  await chapter.locator('img').evaluate((el) => el.decode());
  await page.screenshot({ path: test.info().outputPath('fluent-chapter-motion.png') });
});

for (const width of [390, 1440]) {
  test(`skills replace one another in a pinned frame and release at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const track = page.locator('.discipline-stack');
    const stage = page.locator('.discipline-stage');
    const cards = page.locator('.discipline-card');
    await expect(track).toHaveAttribute('data-stacking', 'on');
    const stickyTop = await track.evaluate((node) =>
      parseFloat(getComputedStyle(node).getPropertyValue('--stack-top')),
    );
    for (const [index, progress] of [
      [0, 0.1],
      [1, 0.45],
      [2, 0.85],
      [1, 0.45],
      [0, 0.1],
    ]) {
      await scrollSkills(page, progress);
      await expect(cards.nth(index)).toHaveAttribute('data-active', 'true');
      await expect(page.locator('.discipline-card[data-active="true"]')).toHaveCount(1);
      await expect
        .poll(async () => Math.abs((await stage.boundingBox()).y - stickyTop))
        .toBeLessThan(2);
      await expect
        .poll(async () => Math.abs((await cards.nth(index).boundingBox()).y - stickyTop))
        .toBeLessThan(2);
      await expect(cards.nth(index).locator('.discipline-number')).toHaveText(`0${index + 1} / 03`);
      const box = await cards.nth(index).boundingBox();
      expect(box.y + box.height).toBeLessThan(900);
      for (let other = 0; other < 3; other++) {
        await expect(cards.nth(other)).toHaveCSS('opacity', other === index ? '1' : '0');
      }
      await page.screenshot({ path: test.info().outputPath(`stack-${index + 1}-${width}.png`) });
    }
    // The next panel slides over the first only during the transition interval.
    await scrollSkills(page, 0.3);
    await expect(page.locator('.discipline-card[data-active="true"]')).toHaveCount(2);
    expect((await cards.nth(1).boundingBox()).y).toBeGreaterThan(stickyTop + 50);
    await scrollSkills(page, 1.15);
    await expect.poll(async () => (await stage.boundingBox()).y).toBeLessThan(stickyTop - 100);
    await expect(cards.last()).toHaveAttribute('data-active', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(track).toHaveAttribute('data-stacking', 'off');
    await expect(stage).toHaveCSS('position', 'static');
    for (const card of await cards.all()) await expect(card).toHaveCSS('opacity', '1');
    expect((await cards.nth(1).boundingBox()).y).toBeGreaterThan(
      (await cards.first().boundingBox()).y + (await cards.first().boundingBox()).height,
    );
  });
}

test('skills return to reading flow when a full card cannot fit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const track = page.locator('.discipline-stack');
  await expect(track).toHaveAttribute('data-stacking', 'on');
  await page.setViewportSize({ width: 390, height: 500 });
  await expect(track).toHaveAttribute('data-stacking', 'off');
  const cards = page.locator('.discipline-card');
  for (const card of await cards.all()) await expect(card).toHaveCSS('opacity', '1');
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(track).toHaveAttribute('data-stacking', 'on');
});

test('mobile navigation reaches the merged skills and experience sections', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const nav = page.getByRole('navigation');
  for (const link of await nav.getByRole('link').all()) {
    const bounds = await link.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  }
  await nav.getByRole('link', { name: 'About' }).click();
  await expect(page.locator('#about')).toBeFocused();
  await expect(page.locator('.discipline-card')).toHaveCount(3);
  for (const name of ['Engineering', 'Design', 'AI']) {
    await expect(page.locator('#about').getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await expect(page.locator('#about img')).toHaveCount(0);
  await page.locator('.discipline-card').last().scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('mobile-disciplines.png') });
  await nav.getByRole('link', { name: 'Experience' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#experience')).toBeFocused();
});

for (const width of [390, 1440]) {
  test(`background transitions continue to the page bottom at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const sections = [
      ['about', 'rgb(234, 197, 228)', 'rgb(191, 208, 237)'],
      ['experience', 'rgb(191, 208, 237)', 'rgb(222, 222, 216)'],
      ['contact', 'rgb(222, 222, 216)', 'rgb(229, 238, 141)'],
    ];
    const scrollThrough = async (id, progress) => {
      await page.evaluate(
        ({ id, progress }) => {
          const bounds = document.getElementById(id).getBoundingClientRect();
          window.scrollTo({
            top: scrollY + bounds.top - innerHeight + bounds.height * progress,
            behavior: 'instant',
          });
        },
        { id, progress },
      );
    };
    for (const [id, from, to] of sections) {
      const section = page.locator(`#${id}`);
      await expect(section).toHaveCSS('background-color', from);
      await scrollThrough(id, 0.5);
      await expect(section).not.toHaveCSS('background-color', from);
      await expect(section).not.toHaveCSS('background-color', to);
      await scrollThrough(id, 1);
      await expect(section).toHaveCSS('background-color', to);
    }
    expect(
      await page.evaluate(() =>
        Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY),
      ),
    ).toBeLessThan(2);
    await page.screenshot({ path: test.info().outputPath(`footer-transition-${width}.png`) });
    await scrollThrough('contact', 0.5);
    await expect(page.locator('#contact')).not.toHaveCSS('background-color', sections[2][2]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [id, , to] of sections)
      await expect(page.locator(`#${id}`)).toHaveCSS('background-color', to);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    for (const [id, , to] of sections)
      await expect(page.locator(`#${id}`)).toHaveCSS('background-color', to);
  });
}

for (const width of [390, 1440]) {
  test(`glass code symbols fall, shatter, and reassemble at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const artwork = page.locator('.hero-objects');
    await expect(artwork).toHaveAttribute('data-renderer', 'webgl', { timeout: 20000 });
    await expect(artwork).toHaveAttribute('data-phase', 'intact');
    await page.screenshot({ path: test.info().outputPath(`glass-intact-${width}.png`) });
    const scrollToPhase = (phase) =>
      page.evaluate((phase) => {
        const hero = document.getElementById('home');
        window.scrollTo({
          top: hero.getBoundingClientRect().top + scrollY + hero.offsetHeight * 0.6 * phase,
          behavior: 'instant',
        });
      }, phase);
    await scrollToPhase(0.35);
    await expect(artwork).toHaveAttribute('data-phase', 'falling');
    await scrollToPhase(0.8);
    await expect(artwork).toHaveAttribute('data-phase', 'shattered');
    await page.screenshot({ path: test.info().outputPath(`glass-shattered-${width}.png`) });
    await scrollToPhase(1);
    await expect(artwork).toHaveAttribute('data-phase', 'settled');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(artwork).toHaveAttribute('data-phase', 'intact');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.hero-object-canvas')).toHaveCount(0);
    await expect(artwork).toHaveAttribute('data-renderer', 'static');
  });
}
