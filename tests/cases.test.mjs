import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 8 case-study routes, recovery and project navigation", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const base = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  try {
    for (const [slug, title] of [["studentsmate", "StudentsMate"], ["tanvo", "Tanvo"], ["livewall", "LiveWall"], ["hackarena", "HackArena"]]) {
      const response = await page.goto(`${base}/work/${slug}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      assert.equal(await page.title(), `${title} — Srujan Mirji`);
      assert.equal(await page.locator("h1").textContent(), `${title}.`);
      assert.equal(await page.locator(".case-chapter").count(), 9);
      assert.equal(await page.locator(".pin-spacer").count(), 0);
      assert.equal(await page.locator('.desktop-navigation a[aria-current="location"]').textContent(), "work");
      assert.equal(await page.locator('.case-links a').count(), 0, "Unknown external URLs remain omitted");
      assert.equal(await page.locator('.case-features li').count(), slug === "studentsmate" ? 8 : 0);
      if (slug === "livewall") assert.equal(await page.locator('#case-technology').locator('..').locator('..').locator('.case-chapter-content').textContent(), "Swift");
      for (const width of [375, 768, 1280, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${base}/#work`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Show Tanvo", exact: true }).click();
    await page.getByRole("link", { name: "View project : Tanvo", exact: true }).click();
    await page.waitForURL("**/work/tanvo");
    assert.equal(await page.locator('.pin-spacer').count(), 0, "Leaving home cleans up every pin");
    await page.getByRole("link", { name: "Back to projects", exact: true }).first().click();
    await page.waitForURL("**/#work");
    await page.waitForFunction(() => document.querySelectorAll('.pin-spacer').length === 4 && document.querySelector('.section-counter').textContent.includes("Work"));
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, "/work/tanvo");
    assert.equal(await page.locator('.pin-spacer').count(), 0);
    await page.goForward({ waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelectorAll('.pin-spacer').length === 4);
    const unknown = await page.goto(`${base}/work/unknown-project`, { waitUntil: "networkidle" });
    assert.equal(unknown.status(), 404);
    assert.equal(await page.locator('h1').textContent(), 'Nothing here.');
    assert.equal(await page.getByRole('link', { name: /Back to projects/ }).isVisible(), true);
    // A fresh page exercises the whole keyboard flow with no pointer input.
    const keyboard = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await keyboard.goto(`${base}/work/studentsmate`, { waitUntil: "networkidle" });
    for (let stop = 0; stop < 8; stop++) {
      await keyboard.keyboard.press("Tab");
      assert.equal(await keyboard.locator(':focus').evaluate((e) => getComputedStyle(e).outlineStyle), "solid");
    }
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${base}/work/studentsmate`);
    assert.equal(await noJS.locator('.case-features li').count(), 8);
    await noJS.getByRole('link', { name: 'Back to projects', exact: true }).first().click();
    await noJS.locator('.project-link').first().click();
    assert.equal(new URL(noJS.url()).pathname, '/work/studentsmate');
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${base}/work/livewall`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('.page-transition').evaluate((e) => getComputedStyle(e).animationName), "none");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addStyleTag({ content: 'html { font-size: 200% }' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors.filter((error) => !error.includes('404 (Not Found)')), []);
  } finally { await browser.close(); }
});
