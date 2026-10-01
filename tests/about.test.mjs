import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 5 About beats, two-pin navigation and readable fallbacks", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const matrix = (selector) => page.locator(selector).evaluate((e) => {
    const m = new DOMMatrix(getComputedStyle(e).transform);
    return { scale: m.a, x: m.m41, y: m.m42 };
  });
  const active = (label) => page.waitForFunction((text) => document.querySelector(".section-counter").textContent.includes(text), label);
  try {
    await page.goto(baseURL, { waitUntil: "networkidle" });
    for (let stop = 0; stop < 9; stop++) {
      await page.keyboard.press("Tab");
      assert.equal(await page.locator(":focus").evaluate((e) => getComputedStyle(e).outlineStyle), "solid");
    }
    assert.match(await page.locator(":focus").innerText(), /view projects/i);
    assert.ok(await page.locator(":focus").evaluate((e) => {
      const rect = e.getBoundingClientRect();
      return rect.top >= document.querySelector(".site-header").getBoundingClientRect().bottom && rect.bottom <= innerHeight;
    }), "Tab reaches the About CTA visibly through both pinned sections");
    await page.goto(`${baseURL}/#about`, { waitUntil: "networkidle" });
    await active("About");
    assert.equal(await page.locator(".pin-spacer:has(> .hero-stage), .pin-spacer:has(> .about-stage)").count(), 2);
    const start = await page.locator("#about").evaluate((e) => e.getBoundingClientRect().top + scrollY - document.querySelector(".site-header").getBoundingClientRect().bottom);
    const beat = async (progress) => {
      await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), start + 900 * 1.8 * progress);
      await page.waitForTimeout(100);
    };
    await beat(0);
    assert.ok((await matrix(".about-portrait")).scale < 0.81);
    assert.ok((await matrix(".about-line:first-child > span")).y > 0);
    await beat(0.3);
    assert.ok((await matrix(".about-portrait")).scale > 0.99);
    assert.ok(Math.abs((await matrix(".about-line:first-child > span")).y) < 1);
    assert.ok((await matrix(".about-line:last-child > span")).y > 0);
    await beat(0.83);
    assert.ok(Math.abs((await matrix(".about-line:last-child > span")).y) < 1);
    assert.equal(await page.locator(".about-keywords").evaluate((e) => getComputedStyle(e).opacity), "1");
    assert.equal(await page.locator(".about-keywords li").count(), 5);
    assert.equal(await page.locator(".about-portrait img").evaluate((e) => e.complete && e.naturalWidth > 0), true);
    await beat(1);
    assert.ok((await matrix(".about-portrait")).x > 0);
    await beat(0);
    assert.ok((await matrix(".about-portrait")).scale < 0.81, "Reverse scroll restores the composition");
    await page.locator(".about-link").focus();
    assert.equal(await page.locator(":focus").evaluate((e) => getComputedStyle(e).outlineStyle), "solid");
    await page.keyboard.press("Enter");
    await active("Work");
    assert.equal(await page.locator(":focus").getAttribute("id"), "work");
    await page.reload({ waitUntil: "networkidle" });
    await active("Work");
    assert.ok(await page.locator("#work").evaluate((e) => Math.abs(e.getBoundingClientRect().top - document.querySelector(".site-header").getBoundingClientRect().bottom) < 40));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => !document.querySelector(".pin-spacer") && new DOMMatrix(getComputedStyle(document.querySelector(".about-portrait")).transform).isIdentity && new DOMMatrix(getComputedStyle(document.querySelector(".about-line:last-child > span")).transform).isIdentity);
    assert.equal((await matrix(".about-portrait")).scale, 1);
    assert.equal((await matrix(".about-line:last-child > span")).y, 0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator(".pin-spacer:has(> .about-stage)").count(), width >= 1024 ? 1 : 0);
    }
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${baseURL}/#about`);
    assert.equal(await noJS.locator(".about-line:last-child > span").evaluate((e) => getComputedStyle(e).transform), "none");
    await noJS.locator(".about-link").click();
    assert.equal(new URL(noJS.url()).hash, "#work");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
