import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 22 Motion QA: slow, fast, reverse scrolling, refresh, history, reduced-motion, and live resize", { timeout: 90_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const errors = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Initial desktop check: 4 pin spacers
    assert.equal(await page.locator(".pin-spacer").count(), 4, "Desktop has 4 GSAP pin spacers");

    // -------------------------------------------------------------
    // 1. SLOW SCROLLING (Smooth increment scrub)
    // -------------------------------------------------------------
    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = 200;
    for (let pos = 0; pos <= Math.min(totalHeight, 3000); pos += step) {
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    }
    assert.equal(errors.length, 0, "No page errors during slow scrub");

    // -------------------------------------------------------------
    // 2. FAST SCROLLING & JUMP BEHAVIOR
    // -------------------------------------------------------------
    // Jump straight to work
    await page.evaluate(() => window.scrollTo(0, 4000));
    await page.waitForTimeout(100);
    assert.equal(errors.length, 0, "No errors on high-velocity scroll jump");

    // Jump straight to bottom (Contact)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(100);
    assert.equal(errors.length, 0, "No errors jumping to document end");

    // -------------------------------------------------------------
    // 3. REVERSE SCROLLING (Restoration of initial state)
    // -------------------------------------------------------------
    for (let pos = totalHeight; pos >= 0; pos -= 600) {
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    // Verify hero typography and scroll cue restored
    const heroTitleScale = await page.locator(".hero-name").evaluate((e) => {
      const transform = getComputedStyle(e).transform;
      return transform === "none" ? 1 : new DOMMatrix(transform).a;
    });
    assert.ok(heroTitleScale >= 0.9, "Hero typography restored upon reverse scroll to top");

    // -------------------------------------------------------------
    // 4. MOUSE WHEEL EMULATION
    // -------------------------------------------------------------
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(100);
    const scrolledY = await page.evaluate(() => window.scrollY);
    assert.ok(scrolledY > 0, "Mouse wheel events naturally advance document scroll");

    // -------------------------------------------------------------
    // 5. PAGE REFRESH AT MID-SCROLL
    // -------------------------------------------------------------
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(errors.length, 0, "Page refresh does not throw ScrollTrigger errors");
    assert.equal(await page.locator(".pin-spacer").count(), 4, "Pin spacers successfully reconstructed after reload");

    // -------------------------------------------------------------
    // 6. BROWSER BACK & FORWARD NAVIGATION
    // -------------------------------------------------------------
    await page.goto(`${baseURL}/work/studentsmate`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".pin-spacer").count(), 0, "Leaving homepage cleanly tears down all pins");

    await page.goBack({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator(".pin-spacer").count(), 4, "Navigating back cleanly restores homepage pins");

    await page.goForward({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".pin-spacer").count(), 0, "Navigating forward cleanly removes homepage pins");

    await page.goBack({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // -------------------------------------------------------------
    // 7. PREFERS-REDUCED-MOTION SUPPORT
    // -------------------------------------------------------------
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length === 0);
    assert.equal(await page.locator(".pin-spacer").count(), 0, "Reduced motion immediately destroys all pin spacers");
    assert.equal(errors.length, 0, "No errors toggling reduced motion");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() => document.querySelectorAll(".pin-spacer").length === 4);
    assert.equal(await page.locator(".pin-spacer").count(), 4, "Restoring motion preferences recreates pins");

    // -------------------------------------------------------------
    // 8. LIVE RESIZE & ORIENTATION CHANGES
    // -------------------------------------------------------------
    const testWidths = [1440, 1024, 768, 430, 375, 1280];
    for (const w of testWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(250);
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(hasOverflow, false, `No horizontal overflow after resizing to ${w}px`);
    }

    assert.equal(errors.length, 0, "Motion QA completed with zero unhandled errors");
  } finally {
    await browser.close();
  }
});
