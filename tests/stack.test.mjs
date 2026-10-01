import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const expected = ['TypeScript', 'React', 'Next.js', 'Node.js', 'Git', 'GSAP', 'WebGL'];
test('Phase 11 categorized stack, honest empty state and responsive fallbacks', { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await page.goto(`${base}/#stack`, { waitUntil: 'networkidle' });
    const stack = page.locator('#stack');
    assert.deepEqual(await stack.locator('h3').allTextContents(), ['AI / ML', 'Development', 'Infrastructure', 'Creative Technology']);
    assert.deepEqual(await stack.locator('li').allTextContents(), expected);
    assert.match(await stack.locator('.stack-note').textContent(), /used in this portfolio/);
    assert.equal(await stack.locator('.stack-pending').textContent(), 'Technologies coming soon.');
    assert.equal(await stack.locator('img, button, a, [tabindex]').count(), 0);
    await page.waitForFunction(() => document.querySelector('.section-counter')?.textContent?.includes('06'));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const group = stack.locator('.stack-group').nth(1);
    await group.hover();
    await page.waitForFunction(() => getComputedStyle(document.querySelectorAll('.stack-group')[1]).borderTopColor === 'rgb(255, 90, 31)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.pin-spacer') && !document.querySelector('.projects-stage[data-horizontal]'));
    assert.ok(await group.evaluate((e) => parseFloat(getComputedStyle(e).transitionDuration) < 0.001));
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Viewport ${width}`);
      assert.deepEqual(await stack.locator('li').allTextContents(), expected);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addStyleTag({ content: 'html { font-size: 200% }' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const keyboard = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    await keyboard.goto(base, { waitUntil: 'networkidle' });
    for (let stop = 0; stop < 6; stop++) {
      await keyboard.keyboard.press('Tab');
      const focused = keyboard.locator(':focus');
      assert.equal(await focused.evaluate((e) => getComputedStyle(e).outlineStyle), 'solid');
      await page.waitForTimeout(50);
      assert.ok(await focused.evaluate((e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }));
    }
    assert.equal(await keyboard.locator(':focus').textContent(), 'contact');
    await keyboard.keyboard.press('Enter');
    await keyboard.waitForURL('**/#contact');
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${base}/#stack`);
    assert.deepEqual(await noJS.locator('#stack li').allTextContents(), expected);
    assert.equal(await noJS.locator('#stack').isVisible(), true);
    assert.equal(await noJS.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    await mobile.goto(`${base}/#stack`, { waitUntil: 'networkidle' });
    assert.ok(await mobile.locator('#stack').evaluate((e) => Math.abs(e.getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom - 16) < 2), 'Mobile direct anchor accounts for hydrated Lab controls');
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
