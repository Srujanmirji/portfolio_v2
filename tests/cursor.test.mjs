import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 3 cursor states, interpolation, idle work and native fallbacks", { timeout: 45_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const hitTest = document.elementFromPoint.bind(document);
    window.cursorHitTests = 0;
    document.elementFromPoint = (...args) => { window.cursorHitTests++; return hitTest(...args); };
  });
  try {
    await page.goto(baseURL, { waitUntil: "networkidle" });
    const cursor = page.locator(".custom-cursor");
    assert.equal(await cursor.getAttribute("aria-hidden"), "true");
    assert.equal(await cursor.evaluate((element) => getComputedStyle(element).opacity), "0");
    await page.mouse.move(1100, 450);
    await page.waitForFunction(() => document.documentElement.dataset.customCursor === "true");
    assert.equal(await cursor.getAttribute("data-interactive"), "false");
    assert.equal(await cursor.evaluate((element) => getComputedStyle(element).pointerEvents), "none");
    await page.mouse.move(900, 500);
    await page.waitForFunction(() => Math.abs(new DOMMatrix(getComputedStyle(document.querySelector(".custom-cursor")).transform).m41 - 900) < 1);
    for (const [id, text] of [["work", "VIEW"], ["contact", "OPEN"], ["lab", "EXPLORE"]]) {
      await page.locator(`.desktop-navigation a[href="/#${id}"]`).hover();
      await page.waitForFunction((label) => document.querySelector(".cursor-label").textContent === label, text);
      assert.equal(await cursor.getAttribute("data-interactive"), "true");
    }
    await page.waitForTimeout(250);
    await page.evaluate(() => { window.cursorHitTests = 0; });
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => window.cursorHitTests), 0, "Cursor performs no hit testing while idle (independent of the GSAP ticker)");
    await page.keyboard.press("Tab");
    assert.equal(await page.locator("html").getAttribute("data-custom-cursor"), null);
    await page.mouse.move(1100, 500);
    await page.waitForFunction(() => document.documentElement.dataset.customCursor === "true");
    await page.dispatchEvent("body", "pointerdown", { pointerType: "touch" });
    assert.equal(await page.locator("html").getAttribute("data-custom-cursor"), null);
    await page.mouse.move(900, 500);
    await page.waitForFunction(() => document.documentElement.dataset.customCursor === "true");
    await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    assert.equal(await page.locator("html").getAttribute("data-custom-cursor"), null);

    // A native editing surface must keep its text cursor, including future forms.
    await page.evaluate(() => {
      const input = document.createElement("input");
      input.id = "cursor-test-input";
      input.setAttribute("aria-label", "Cursor test");
      input.style.cssText = "position:fixed;bottom:20px;left:20px;width:240px;height:44px;z-index:90";
      document.body.append(input);
    });
    await page.locator("#cursor-test-input").hover();
    await page.waitForFunction(() => !document.documentElement.dataset.customCursor);
    assert.notEqual(await page.locator("#cursor-test-input").evaluate((element) => getComputedStyle(element).cursor), "none");
    await page.locator("#cursor-test-input").evaluate((element) => element.remove());
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.mouse.move(800, 400);
    assert.equal(await cursor.evaluate((element) => getComputedStyle(element).display), "none");
    assert.equal(await page.locator("html").getAttribute("data-custom-cursor"), null);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.mouse.move(200, 400);
    assert.equal(await cursor.evaluate((element) => getComputedStyle(element).display), "none");

    const touch = await browser.newPage({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    await touch.goto(baseURL);
    await touch.locator(".mobile-menu > summary").tap();
    assert.equal(await touch.locator(".mobile-menu").getAttribute("open"), "");
    assert.equal(await touch.locator(".custom-cursor").evaluate((element) => getComputedStyle(element).display), "none");
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    await noJS.goto(baseURL);
    assert.notEqual(await noJS.locator("body").evaluate((element) => getComputedStyle(element).cursor), "none");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
