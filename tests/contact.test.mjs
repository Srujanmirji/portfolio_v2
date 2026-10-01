import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

test('Phase 12 closing sequence, honest contacts, end-of-page and native return', { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const scale = (selector) => page.locator(selector).evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a);
  try {
    await page.goto(`${base}/#contact`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.pin-spacer:has(> .contact-stage)').count(), 1);
    assert.deepEqual(await page.locator('.contact-links li > span:first-child').allTextContents(), ['Email', 'LinkedIn', 'GitHub', 'Instagram']);
    assert.equal(await page.locator('.contact-pending').count(), 4);
    assert.equal(await page.locator('.contact-links a').count(), 0);
    assert.equal(await page.locator('.contact-title').getAttribute('aria-label'), "Let's build it.");
    assert.match(await page.locator('.contact-footer').textContent(), /Srujan Mirji.*© 2026/);
    const start = await page.locator('#contact').evaluate((e) => e.getBoundingClientRect().top + scrollY - document.querySelector('.site-header').getBoundingClientRect().bottom + 1);
    const beat = async (progress) => {
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), start + 900 * 1.8 * progress);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    };
    await beat(0);
    assert.ok(await scale('.contact-title') < 0.83);
    assert.ok(await scale('.contact-accent') < 0.01);
    await beat(0.7);
    assert.ok(await scale('.contact-title') > 0.99);
    assert.ok(await scale('.contact-accent') < 0.01, 'Orange punctuation appears last');
    await beat(1);
    assert.ok(await scale('.contact-accent') > 0.99);
    assert.equal(await page.locator('.contact-links').evaluate((e) => getComputedStyle(e).opacity), '1');
    assert.ok(await page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY) < 3), 'Sequence ends at the document bottom');
    assert.ok(await page.locator('.contact-footer').evaluate((e) => { const r=e.getBoundingClientRect(); return r.bottom <= innerHeight + 2 && r.top > document.querySelector('.site-header').getBoundingClientRect().bottom; }));
    await beat(0);
    assert.ok(await scale('.contact-title') < 0.83, 'Reverse scrolling restores the headline');
    // Direct hash arrival focuses the section; use only the keyboard from here.
    await page.keyboard.press('Tab');
    assert.match(await page.locator(':focus').textContent(), /Back to top/);
    assert.equal(await page.locator(':focus').evaluate((e) => getComputedStyle(e).outlineStyle), 'solid');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/#home');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'home');
    await page.waitForFunction(() => scrollY < 2);
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForURL('**/#contact');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.pin-spacer') && !document.querySelector('.projects-stage[data-horizontal]'));
    assert.equal(await scale('.contact-title'), 1);
    assert.equal(await scale('.contact-accent'), 1);
    assert.equal(await page.locator('.contact-links').evaluate((e) => getComputedStyle(e).opacity), '1');
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Viewport ${width}`);
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.locator('.pin-spacer:has(> .contact-stage)').count(), 0, 'Short viewports use normal flow');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addStyleTag({ content: 'html { font-size: 200% }' });
    // Timeline media cleanup and the header resize observer finish on the next frames.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const touch = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    await touch.goto(`${base}/#contact`, { waitUntil: 'networkidle' });
    assert.equal(await touch.locator('.pin-spacer:has(> .contact-stage)').count(), 0);
    await touch.getByRole('link', { name: 'Back to top', exact: true }).tap();
    await touch.waitForURL('**/#home');
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${base}/#contact`);
    assert.equal(await noJS.locator('.contact-links').evaluate((e) => getComputedStyle(e).opacity), '1');
    await noJS.getByRole('link', { name: 'Back to top', exact: true }).click();
    assert.equal(new URL(noJS.url()).hash, '#home');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
