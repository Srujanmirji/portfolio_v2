import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 7 horizontal projects, previews, input and responsive fallbacks", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const select = async (title) => {
    await page.getByRole("button", { name: `Show ${title}`, exact: true }).click();
    await page.waitForFunction((name) => document.querySelector('.project-card[data-active="true"] h3')?.textContent === name, title);
  };
  try {
    await page.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('.projects-stage').getAttribute('data-horizontal'), "true");
    assert.equal(await page.locator('.pin-spacer').count(), 4);
    for (const title of ["StudentsMate", "Tanvo", "LiveWall", "HackArena"]) {
      await select(title);
      assert.equal(await page.locator('.project-card[inert]').count(), 3);
      assert.ok(await page.locator('.project-card[data-active="true"]').evaluate((e) => {
        const r = e.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth;
      }));
      const y = await page.evaluate(() => scrollY);
      const preview = page.getByRole("button", { name: `Preview : ${title}`, exact: true });
      await preview.click();
      const dialog = page.getByRole("dialog", { name: title, exact: true });
      assert.equal(await dialog.isVisible(), true);
      assert.equal((await page.locator(":focus").innerText()).replace(/\s+/g, " "), "Close ×");
      assert.equal(await page.locator('.custom-cursor').evaluate((e) => getComputedStyle(e).display), "none");
      await page.keyboard.press("Tab");
      assert.equal(await dialog.evaluate((e) => e.contains(document.activeElement) || document.activeElement === document.body), true, "Native dialog never tabs into the background page");
      // Chrome may move the single-button dialog's next Tab into browser chrome.
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Escape");
      assert.equal(await dialog.isVisible(), false);
      assert.match(await page.locator(":focus").innerText(), /Preview/i);
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - y) < 2);
    }
    // A keyboard user can select a project then reach its only active CTA.
    await page.getByRole("button", { name: "Show HackArena", exact: true }).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    assert.match(await page.locator(":focus").innerText(), /HackArena/i);
    assert.equal(await page.locator(":focus").evaluate((e) => getComputedStyle(e).outlineStyle), "solid");
    await select("StudentsMate");
    await page.mouse.move(800, 500);
    await page.mouse.wheel(0, 1250);
    await page.waitForFunction(() => document.querySelector('.project-current').textContent.includes("Tanvo"));
    await page.mouse.wheel(0, -1250);
    await page.waitForFunction(() => document.querySelector('.project-current').textContent.includes("StudentsMate"));
    // Small wheel deltas exercise trackpad-like scrolling without claiming hardware coverage.
    for (let step = 0; step < 20; step++) await page.mouse.wheel(0, 40);
    await page.waitForFunction(() => document.querySelector('.project-current').textContent.includes("Tanvo"));
    // Resizing a card itself must recalculate the final horizontal distance.
    await page.addStyleTag({ content: '[data-horizontal] .project-card:first-child { flex-basis: 85% }' });
    await page.waitForTimeout(250);
    await select("HackArena");
    await page.waitForFunction(() => Math.abs(document.querySelector('#project-hackarena').getBoundingClientRect().right - document.querySelector('.projects-viewport').getBoundingClientRect().right) < 20);
    await page.locator('#timeline').evaluate((e) => e.scrollIntoView());
    await page.waitForFunction(() => document.querySelector('.section-counter').textContent.includes("Timeline"));
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('.pin-spacer').count(), 4);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => !document.querySelector('.pin-spacer'));
    assert.equal(await page.locator('.project-card[inert]').count(), 0);
    assert.equal(await page.locator('.project-track').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).isIdentity), true);
    await select("HackArena");
    assert.equal(await page.locator(':focus').getAttribute('id'), 'project-hackarena');
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (width < 1024) assert.equal(await page.locator('.project-card[inert]').count(), 0);
    }
    const touch = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    await touch.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    await touch.getByRole("button", { name: "Show LiveWall", exact: true }).tap();
    await touch.getByRole("button", { name: "Preview : LiveWall", exact: true }).tap();
    assert.equal(await touch.getByRole("dialog", { name: "LiveWall", exact: true }).isVisible(), true);
    await touch.getByRole("button", { name: "Close", exact: true }).tap();
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    await noJS.goto(`${baseURL}/#work`);
    assert.equal(await noJS.locator('.project-card').count(), 4);
    assert.equal(await noJS.locator('.project-preview:visible').count(), 0);
    assert.equal(await noJS.locator('.project-link').count(), 4);
    assert.equal(await noJS.locator('.project-card[inert]').count(), 0);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
