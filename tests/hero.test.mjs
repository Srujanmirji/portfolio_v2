import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 4 hero scroll beats, reversal, anchors and accessible fallbacks", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const opacity = (selector) => page.locator(selector).evaluate((e) => Number(getComputedStyle(e).opacity));
  const scale = (selector) => page.locator(selector).evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a);
  const scroll = async (y) => {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(100);
  };
  const active = async (label) => page.waitForFunction((name) => document.querySelector(".section-counter").textContent.includes(name), label);
  try {
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.waitForSelector(".pin-spacer:has(> .hero-stage)");
    const stage = page.locator(".hero-stage");
    assert.ok(await stage.evaluate((e) => e.getBoundingClientRect().bottom <= innerHeight + 1), "All pinned content fits the viewport");
    assert.equal(await page.locator(".hero-portrait img").evaluate((e) => e.complete && e.naturalWidth > 0), true);
    assert.ok(await opacity(".hero-portrait") < 0.01);
    const initialScale = await scale(".hero-first-name");
    await scroll(900 * 1.8 * 0.2);
    assert.ok(await scale(".hero-first-name") > initialScale);
    await scroll(900 * 1.8 * 0.4);
    assert.ok(await opacity(".hero-portrait") > 0.99);
    await scroll(900 * 1.8 * 0.6);
    assert.ok(await opacity(".hero-description") > 0.99);
    await active("Introduction");
    await scroll(900 * 1.8 * 0.8);
    assert.ok(await scale(".hero-name") < 0.8);
    await scroll(2500);
    await active("About");
    await scroll(0);
    await active("Introduction");
    assert.ok(await opacity(".hero-portrait") < 0.01, "Reverse scroll restores the opening beat");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".pin-spacer:has(> .hero-stage)").count(), 1, "Refresh does not duplicate pins");

    // Keyboard reaches both hero actions without scrubbing or an invisible focus stop.
    await page.locator(".hero-scroll").focus();
    assert.equal(await page.locator(":focus").evaluate((e) => getComputedStyle(e).outlineStyle), "solid");
    await page.keyboard.press("Tab");
    assert.match(await page.locator(":focus").innerText(), /view work/i);
    await page.keyboard.press("Enter");
    await active("Work");
    assert.equal(await page.locator(":focus").getAttribute("id"), "work");
    await page.goto(`${baseURL}/#about`, { waitUntil: "networkidle" });
    await active("About");
    await page.waitForFunction(() => Math.abs(document.querySelector("#about").getBoundingClientRect().top - document.querySelector(".site-header").getBoundingClientRect().bottom) < 40);
    await page.reload({ waitUntil: "networkidle" });
    await active("About");
    assert.ok(await page.locator("#about").evaluate((e) => Math.abs(e.getBoundingClientRect().top - document.querySelector(".site-header").getBoundingClientRect().bottom) < 40), "Direct hash survives hydration and pin setup");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await scroll(0);
    assert.equal(await page.locator(".pin-spacer:has(> .hero-stage)").count(), 0);
    assert.equal(await opacity(".hero-portrait"), 1);
    assert.equal(await opacity(".hero-description"), 1);
    assert.equal(await page.locator(".hero-name").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).isIdentity), true);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForSelector(".pin-spacer:has(> .hero-stage)");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForFunction(() => !document.querySelector(".pin-spacer:has(> .hero-stage)"));
    assert.equal(await opacity(".hero-portrait"), 1);
    assert.equal(await opacity(".hero-description"), 1);
    for (const width of [360, 375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No horizontal overflow at ${width}px`);
      assert.equal(await page.locator(".pin-spacer:has(> .hero-stage)").count(), width >= 1024 ? 1 : 0);
    }
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForFunction(() => !document.querySelector(".pin-spacer:has(> .hero-stage)"));
    assert.equal(await opacity(".hero-description"), 1, "Short viewports keep all content in normal flow");
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(baseURL);
    assert.equal(await noJS.locator(".hero-description").evaluate((e) => getComputedStyle(e).opacity), "1");
    await noJS.locator(".hero-scroll").click();
    assert.equal(new URL(noJS.url()).hash, "#about");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
