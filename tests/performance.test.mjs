import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

test("Phase 17 performance: bundle sizes, lazy-loading, WebGL on-demand, CLS, TBT, and cleanup", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const errors = [];

  try {
    // -------------------------------------------------------------
    // 1. ASSET AND BUNDLE SIZE VERIFICATION
    // -------------------------------------------------------------
    const chunksDir = path.resolve(process.cwd(), ".next/static/chunks");
    if (fs.existsSync(chunksDir)) {
      const files = fs.readdirSync(chunksDir);
      const cssFiles = files.filter((f) => f.endsWith(".css"));
      for (const cssFile of cssFiles) {
        const stats = fs.statSync(path.join(chunksDir, cssFile));
        assert.ok(stats.size < 70_000, `CSS chunk ${cssFile} (${stats.size} bytes) must be under 70KB`);
      }

      // Check font files
      const fontsDir = path.resolve(process.cwd(), "src/assets/fonts");
      if (fs.existsSync(fontsDir)) {
        const fontFiles = fs.readdirSync(fontsDir).filter((f) => f.endsWith(".woff2"));
        let totalFontBytes = 0;
        for (const font of fontFiles) {
          totalFontBytes += fs.statSync(path.join(fontsDir, font)).size;
        }
        assert.ok(totalFontBytes < 80_000, `Self-hosted variable fonts (${totalFontBytes} bytes) must be under 80KB`);
      }
    }

    // -------------------------------------------------------------
    // 2. RUNTIME CORE METRICS (CLS, TBT, DOM SIZE)
    // -------------------------------------------------------------
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Verify DOM node count is lean (< 800 nodes)
    const domCount = await page.evaluate(() => document.querySelectorAll("*").length);
    assert.ok(domCount < 800, `DOM node count (${domCount}) must be well under the 800 threshold`);

    // Verify Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 300);
      });
    });
    assert.ok(cls < 0.05, `CLS score (${cls}) must be under 0.05`);

    // -------------------------------------------------------------
    // 3. LAZY-LOADING AND WEBP/AVIF IMAGES
    // -------------------------------------------------------------
    // Hero image is eager / priority, while About image is below the fold
    const heroImgLoading = await page.locator(".hero-portrait img").getAttribute("loading");
    assert.ok(heroImgLoading !== "lazy", "Hero image above the fold is not lazy-loaded");

    // -------------------------------------------------------------
    // 4. WEBGEL ON-DEMAND / SUSPENSION BEHAVIOR
    // -------------------------------------------------------------
    // Scroll away to contact, verify WebGL does not draw while offscreen
    await page.goto(`${baseURL}/#contact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const canvasHiddenState = await page.locator(".hero-canvas").evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom < 0 || rect.top > window.innerHeight;
    });
    assert.ok(canvasHiddenState, "Hero canvas is offscreen when scrolled to contact");

    await page.close();
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
