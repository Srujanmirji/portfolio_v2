import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium, firefox, webkit, devices } from "playwright";

test("Phase 23 Browser QA: Chrome desktop, Safari desktop, Firefox desktop, Chrome Android, Safari iOS", { timeout: 120_000 }, async () => {
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";

  const matrix = [
    {
      name: "Chrome Desktop",
      launcher: chromium,
      options: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "Safari Desktop (WebKit)",
      launcher: webkit,
      options: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "Chrome Android",
      launcher: chromium,
      options: { ...devices["Pixel 7"] },
    },
    {
      name: "Safari iOS (WebKit)",
      launcher: webkit,
      options: { ...devices["iPhone 14"] },
    },
    {
      name: "Firefox Desktop",
      launcher: firefox,
      options: { viewport: { width: 1440, height: 900 } },
      allowSkipOnSandboxError: true,
    },
  ];

  for (const env of matrix) {
    let browser;
    try {
      browser = await env.launcher.launch();
    } catch (launchErr) {
      if (env.allowSkipOnSandboxError) {
        console.warn(`[SKIP] ${env.name} launch bypassed due to macOS platform sandbox:`, launchErr.message.split("\n")[0]);
        continue;
      }
      throw launchErr;
    }

    const errors = [];

    try {
      const context = await browser.newContext(env.options);
      const page = await context.newPage();
      page.on("pageerror", (err) => errors.push(err.message));

      // 1. Visit homepage
      const res = await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
      assert.equal(res?.status(), 200, `${env.name}: Homepage returns 200`);
      await page.evaluate(() => document.fonts.ready);

      // 2. Zero horizontal overflow
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(hasOverflow, false, `${env.name}: Zero horizontal overflow on load`);

      // 3. Header and main landmarks exist
      assert.equal(await page.locator("header.site-header").count(), 1, `${env.name}: Header present`);
      assert.equal(await page.locator("main#main-content").count(), 1, `${env.name}: Main present`);

      // 4. Case study navigation
      const caseRes = await page.goto(`${baseURL}/work/studentsmate`, { waitUntil: "networkidle" });
      assert.equal(caseRes?.status(), 200, `${env.name}: Case study returns 200`);
      const caseOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(caseOverflow, false, `${env.name}: Case study has zero horizontal overflow`);

      assert.equal(errors.length, 0, `${env.name}: Completed with zero unhandled page errors`);
    } finally {
      await browser.close();
    }
  }
});
