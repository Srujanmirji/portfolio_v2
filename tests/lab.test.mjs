import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 10 Lab filters, native details, velocity movement and fallbacks", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await page.goto(`${base}/#lab`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.lab-card').count(), 6);
    assert.equal(await page.locator('.lab-card-meta span').allTextContents().then((labels) => labels.filter((label) => label === 'Example entry').length), 5);
    const filters = page.getByRole('group', { name: 'Experiment categories' });
    for (const [category, count] of [['AI / ML', 1], ['Web', 1], ['macOS', 2], ['3D / Creative', 2], ['Product Experiments', 1], ['All', 6]]) {
      await filters.getByRole('button', { name: category, exact: true }).click();
      assert.equal(await page.locator('.lab-card').count(), count);
      assert.equal(await filters.locator('[aria-pressed="true"]').count(), 1);
      assert.equal(await filters.locator('[aria-pressed="true"]').textContent(), category);
      assert.equal(await page.locator('.lab-count').textContent(), `${count} ${count === 1 ? 'entry' : 'entries'}`);
    }
    const example = page.locator('.lab-card').filter({ has: page.getByRole('heading', { name: 'AI Experiments', exact: true }) });
    await example.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await example.locator('details').getAttribute('open'), '');
    assert.match(await example.locator('.lab-detail-content').textContent(), /coming soon/);
    await page.keyboard.press('Space');
    assert.equal(await example.locator('details').getAttribute('open'), null);
    const livewall = page.locator('.lab-card').filter({ has: page.getByRole('heading', { name: 'LiveWall', exact: true }) });
    await livewall.locator('summary').click();
    assert.match(await livewall.locator('.lab-detail-content p').textContent(), /macOS live wallpaper/);
    await livewall.getByRole('link', { name: 'View project', exact: true }).click();
    await page.waitForURL('**/work/livewall');
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.lab-stage[data-ready]'));
    await page.locator('.lab-grid').evaluate((e) => scrollTo({ top: e.getBoundingClientRect().top + scrollY - 400, behavior: 'instant' }));
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 400);
    await page.waitForFunction(() => Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.lab-grid')).transform).m42) > 0.1);
    assert.ok(await page.locator('.lab-grid').evaluate((e) => Math.abs(new DOMMatrix(getComputedStyle(e).transform).m42) <= 8.1));
    await page.waitForFunction(() => Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.lab-grid')).transform).m42) < 0.1);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.pin-spacer') && !document.querySelector('.projects-stage[data-horizontal]') && new DOMMatrix(getComputedStyle(document.querySelector('.lab-grid')).transform).isIdentity);
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      // Allow resize observers and media cleanup to complete before measuring.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Viewport ${width}`);
    }
    const keyboard = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await keyboard.goto(`${base}/#lab`, { waitUntil: 'networkidle' });
    for (let stop = 0; stop < 12; stop++) {
      await keyboard.keyboard.press('Tab');
      assert.equal(await keyboard.locator(':focus').evaluate((e) => getComputedStyle(e).outlineStyle), 'solid');
      assert.ok(await keyboard.locator(':focus').evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= document.querySelector('.site-header').getBoundingClientRect().bottom && r.bottom <= innerHeight; }));
    }
    await keyboard.keyboard.press('Enter');
    await keyboard.keyboard.press('Tab');
    assert.match(await keyboard.locator(':focus').textContent(), /View project/);
    const touch = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    await touch.goto(`${base}/#lab`, { waitUntil: 'networkidle' });
    await touch.getByRole('button', { name: 'macOS', exact: true }).tap();
    await touch.getByText('Explore LiveWall', { exact: true }).tap();
    await touch.getByRole('link', { name: 'View project', exact: true }).tap();
    await touch.waitForURL('**/work/livewall');
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${base}/#lab`);
    assert.equal(await noJS.locator('.lab-card').count(), 6);
    assert.equal(await noJS.locator('.lab-filter').isVisible(), false);
    await noJS.getByText('Explore LiveWall', { exact: true }).click();
    await noJS.getByRole('link', { name: 'View project', exact: true }).click();
    assert.equal(new URL(noJS.url()).pathname, '/work/livewall');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addStyleTag({ content: 'html { font-size: 200% }' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
