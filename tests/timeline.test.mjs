import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 9 timeline progression, reversal, links and readable fallbacks", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const base = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const scale = () => page.locator('.timeline-progress').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).d);
  try {
    await page.goto(`${base}/#timeline`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.pin-spacer').count(), 4, 'Timeline stays in normal flow');
    assert.equal(await page.locator('.timeline-year').allTextContents().then((values) => values.join(',')), '2024,2025,2026');
    assert.equal(await page.locator('.timeline-milestones li').count(), 9);
    assert.match(await page.locator('.timeline-note').textContent(), /dates to confirm/);
    const bounds = await page.locator('.timeline-stage').evaluate((e) => ({ top: e.getBoundingClientRect().top + scrollY, height: e.offsetHeight }));
    const scroll = async (progress) => {
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), bounds.top - 450 + bounds.height * progress);
      await page.waitForTimeout(100);
    };
    await scroll(0);
    assert.ok(await scale() < 0.02);
    const groups = page.locator('.timeline-year-group');
    const cardX = async (index) => groups.nth(index).locator('.timeline-card').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
    assert.ok(await cardX(1) < 0, 'Desktop groups enter from alternating directions');
    assert.ok(await cardX(2) > 0);
    await scroll(0.5);
    assert.ok(Math.abs(await scale() - 0.5) < 0.02);
    assert.equal(await page.locator('.timeline-year-group[aria-current="step"] .timeline-year').textContent(), '2025');
    await scroll(1);
    assert.ok(await scale() > 0.98);
    assert.equal(await page.locator('.timeline-year-group[aria-current="step"] .timeline-year').textContent(), '2026');
    assert.ok(Math.abs(await cardX(2)) < 1);
    await scroll(0);
    assert.ok(await scale() < 0.02);
    assert.equal(await page.locator('.timeline-year-group[aria-current="step"] .timeline-year').textContent(), '2024');
    await page.locator('.timeline-milestones a').first().focus();
    assert.equal(await page.locator(':focus').evaluate((e) => getComputedStyle(e).outlineStyle), 'solid');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/work/tanvo');
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.timeline-stage[data-animated]'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.timeline-stage[data-animated]') && Array.from(document.querySelectorAll('.timeline-card')).every((e) => new DOMMatrix(getComputedStyle(e).transform).isIdentity));
    assert.equal(await page.locator('.timeline-year-group[aria-current]').count(), 0);
    assert.ok(await page.locator('.timeline-card').evaluateAll((cards) => cards.every((e) => new DOMMatrix(getComputedStyle(e).transform).isIdentity)));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    await mobile.goto(`${base}/#timeline`, { waitUntil: 'networkidle' });
    await mobile.getByRole('link', { name: 'HackArena 2K26', exact: true }).tap();
    await mobile.waitForURL('**/work/hackarena');
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${base}/#timeline`);
    assert.equal(await noJS.locator('.timeline-milestones li').count(), 9);
    assert.equal(await noJS.locator('.timeline-card').first().evaluate((e) => getComputedStyle(e).transform), 'none');
    await noJS.getByRole('link', { name: 'Tanvo', exact: true }).click();
    assert.equal(new URL(noJS.url()).pathname, '/work/tanvo');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForFunction(() => !document.querySelector('.projects-stage[data-horizontal]') && !document.querySelector('.pin-spacer'));
    await page.addStyleTag({ content: 'html { font-size: 200% }' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
