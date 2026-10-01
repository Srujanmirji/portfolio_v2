import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 24 Error QA: missing images, WebGL failure, no-JS mode, direct routes, and 404 handling", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const errors = [];

  try {
    // -------------------------------------------------------------
    // 1. MISSING PROJECT IMAGERY FALLBACK
    // -------------------------------------------------------------
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

    await page.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    const placeholders = await page.locator(".project-image-placeholder").count();
    assert.equal(placeholders, 4, "All 4 projects render clean editorial placeholders when images are null");
    assert.match(await page.locator(".project-image-placeholder").first().textContent(), /project imagery.*coming soon/i);

    // Verify modal preview also handles null imagery gracefully
    await page.getByRole("button", { name: "Show StudentsMate", exact: true }).click();
    await page.getByRole("button", { name: "Preview : StudentsMate", exact: true }).click();
    assert.equal(await page.locator("dialog.project-dialog").isVisible(), true);
    assert.match(await page.locator("dialog.project-dialog .project-image-placeholder").textContent(), /project imagery.*coming soon/i);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);

    // -------------------------------------------------------------
    // 2. FAILED WEBGL CONTEXT FALLBACK
    // -------------------------------------------------------------
    const webglFailPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const webglErrors = [];
    webglFailPage.on("pageerror", (err) => webglErrors.push(err.message));

    // Force getContext("webgl") and ("webgl2") to return null
    await webglFailPage.addInitScript(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type.includes("webgl")) return null;
        return origGetContext.apply(this, [type, ...args]);
      };
    });

    await webglFailPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    const canvasState = await webglFailPage.locator(".hero-canvas").getAttribute("data-state");
    assert.ok(canvasState === "unavailable" || canvasState === "fallback", "Hero canvas gracefully falls back when WebGL context fails");
    assert.equal(webglErrors.length, 0, "No uncaught exceptions thrown during WebGL failure");
    assert.equal(await webglFailPage.locator(".hero-portrait img").isVisible(), true, "Fallback portrait remains visible");
    await webglFailPage.close();

    // -------------------------------------------------------------
    // 3. NO-JAVASCRIPT ENVIRONMENT
    // -------------------------------------------------------------
    const noJsPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    const noJsResponse = await noJsPage.goto(`${baseURL}/`);
    assert.equal(noJsResponse?.status(), 200, "Homepage serves complete HTML with JS disabled");
    assert.equal(await noJsPage.locator("main#main-content").count(), 1);
    assert.equal(await noJsPage.locator(".story-section").count(), 7, "All 7 sections present in static HTML");
    assert.equal(await noJsPage.locator(".hero-portrait img").isVisible(), true);
    assert.equal(await noJsPage.locator(".project-card").count(), 4, "All 4 projects present without JS");

    // Test case study without JS
    const noJsCase = await noJsPage.goto(`${baseURL}/work/studentsmate`);
    assert.equal(noJsCase?.status(), 200);
    assert.equal(await noJsPage.locator(".case-chapter").count(), 9, "Case study chapters render completely without JS");
    await noJsPage.close();

    // -------------------------------------------------------------
    // 4. DIRECT URL AND 404 UNKNOWN ROUTE
    // -------------------------------------------------------------
    for (const slug of ["studentsmate", "tanvo", "livewall", "hackarena"]) {
      const directRes = await page.goto(`${baseURL}/work/${slug}`, { waitUntil: "networkidle" });
      assert.equal(directRes?.status(), 200, `Direct route /work/${slug} succeeds`);
    }

    // Unknown slug returns 404
    const unknownRes = await page.goto(`${baseURL}/work/non-existent-project`, { waitUntil: "networkidle" });
    assert.equal(unknownRes?.status(), 404, "Unknown route triggers HTTP 404");
    assert.match(await page.locator("h1").textContent(), /Nothing here/);
    assert.equal(await page.getByRole("link", { name: "Back to projects" }).isVisible(), true);

    const fatalErrors = errors.filter((e) => !e.includes("404") && !e.includes("status of 404"));
    assert.equal(fatalErrors.length, 0, `Error QA finished with zero unhandled errors: ${fatalErrors.join(", ")}`);
  } finally {
    await browser.close();
  }
});
