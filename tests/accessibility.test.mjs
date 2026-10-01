import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 16 accessibility: landmarks, headings, alt text, keyboard navigation, focus outlines, contrast, and reduced motion", { timeout: 90_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const errors = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // -------------------------------------------------------------
    // 1. LANDMARKS AND ACCESSIBLE STRUCTURE
    // -------------------------------------------------------------
    assert.equal(await page.locator("header.site-header").count(), 1, "Exactly one header landmark");
    assert.equal(await page.locator("main#main-content").count(), 1, "Exactly one main landmark");
    assert.equal(await page.locator('nav[aria-label="Main navigation"]').count(), 1, "Main desktop nav has accessible label");
    assert.equal(await page.locator('nav[aria-label="Mobile navigation"]').count(), 1, "Mobile nav has accessible label");

    // All sections have valid aria-labelledby referencing their headings
    const sections = await page.locator("section[data-section]").all();
    assert.equal(sections.length, 7, "All seven sections have section elements");
    for (const section of sections) {
      const labelledBy = await section.getAttribute("aria-labelledby");
      assert.ok(labelledBy, "Section has aria-labelledby attribute");
      const heading = page.locator(`#${labelledBy}`);
      assert.equal(await heading.count(), 1, `Heading #${labelledBy} exists in document`);
    }

    // -------------------------------------------------------------
    // 2. SEMANTIC HEADINGS AND HIERARCHY
    // -------------------------------------------------------------
    const checkHeadingProgression = async (url) => {
      await page.goto(`${baseURL}${url}`, { waitUntil: "networkidle" });
      const headings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((el) => ({
          tag: el.tagName,
          level: parseInt(el.tagName[1]),
          text: el.textContent.trim(),
        }));
      });

      const h1s = headings.filter((h) => h.level === 1);
      assert.equal(h1s.length, 1, `Route ${url} must have exactly one H1`);

      let prevLevel = 0;
      for (const h of headings) {
        if (prevLevel > 0 && h.level > prevLevel + 1) {
          assert.fail(`Skipped heading level on ${url}: H${prevLevel} followed directly by H${h.level} (${h.text})`);
        }
        prevLevel = h.level;
      }
    };

    await checkHeadingProgression("/");
    for (const slug of ["studentsmate", "tanvo", "livewall", "hackarena"]) {
      await checkHeadingProgression(`/work/${slug}`);
    }

    // Return to homepage
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

    // -------------------------------------------------------------
    // 3. IMAGE ALT TEXT AND ARIA-HIDDEN DECORATIVE ELEMENTS
    // -------------------------------------------------------------
    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      assert.ok(alt !== null, "All images must have alt attribute");
      assert.ok(alt.length > 5, "Image alt text must be descriptive");
    }

    // Decorative icons and canvases are aria-hidden
    assert.equal(await page.locator(".hero-canvas").getAttribute("aria-hidden"), "true");
    assert.equal(await page.locator(".custom-cursor").getAttribute("aria-hidden"), "true");
    assert.equal(await page.locator(".timeline-rail").getAttribute("aria-hidden"), "true");

    // -------------------------------------------------------------
    // 4. ACCESSIBLE CONTROLS AND LIVE REGIONS
    // -------------------------------------------------------------
    // Lab filter buttons use aria-pressed
    const filterButtons = await page.locator(".lab-filter button").all();
    for (const btn of filterButtons) {
      const pressed = await btn.getAttribute("aria-pressed");
      assert.ok(pressed === "true" || pressed === "false", "Filter button has valid aria-pressed");
    }

    // Lab live region
    assert.equal(await page.locator(".lab-count").getAttribute("role"), "status");
    assert.equal(await page.locator(".lab-count").getAttribute("aria-live"), "polite");

    // Project step buttons use aria-current
    const stepButtons = await page.locator(".project-steps button").all();
    assert.equal(stepButtons.length, 4);
    assert.equal(await stepButtons[0].getAttribute("aria-current"), "true");

    // Project live counter
    assert.equal(await page.locator(".project-current").getAttribute("aria-live"), "polite");

    // -------------------------------------------------------------
    // 5. KEYBOARD NAVIGATION, FOCUS STATES, AND TAB ORDER
    // -------------------------------------------------------------
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

    // Skip to content test
    await page.keyboard.press("Tab");
    const firstFocused = page.locator(":focus");
    assert.equal(await firstFocused.innerText(), "Skip to content");
    assert.equal(await firstFocused.evaluate((el) => getComputedStyle(el).outlineStyle), "solid");
    assert.equal(await firstFocused.evaluate((el) => getComputedStyle(el).outlineColor), "rgb(216, 255, 62)"); // Lime focus color

    // Activating Skip link moves focus to main-content
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(":focus").getAttribute("id"), "main-content");

    // Tab through interactive elements and verify focus outlines
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      const outlineStyle = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
      const outlineColor = await focused.evaluate((el) => getComputedStyle(el).outlineColor);
      assert.equal(outlineStyle, "solid", "Focused element must have solid outline");
      assert.equal(outlineColor, "rgb(216, 255, 62)", "Focus outline must use token lime focus color");
    }

    // Native dialog trap focus & Escape restoration
    await page.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    const previewBtn = page.getByRole("button", { name: "Preview : StudentsMate", exact: true });
    await previewBtn.click();
    const dialog = page.getByRole("dialog", { name: "StudentsMate", exact: true });
    assert.equal(await dialog.isVisible(), true);
    // Dialog close button is focused
    assert.equal((await page.locator(":focus").innerText()).replace(/\s+/g, " "), "Close ×");
    await page.keyboard.press("Escape");
    assert.equal(await dialog.isVisible(), false);
    // Focus returned to preview button
    assert.match(await page.locator(":focus").innerText(), /Preview/i);

    // -------------------------------------------------------------
    // 6. REDUCED MOTION PREFERENCE
    // -------------------------------------------------------------
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "networkidle" });

    // In reduced motion, pins are reverted
    assert.equal(await page.locator(".pin-spacer").count(), 0, "No pin spacers when reduced motion is preferred");
    // Custom cursor disabled
    assert.equal(await page.locator(".custom-cursor").evaluate((el) => getComputedStyle(el).display), "none");
    // WebGL disabled
    assert.equal(await page.locator(".hero-canvas").getAttribute("data-state"), "fallback");
    // Transitions have 0 or negligible duration
    const transitionDuration = await page.locator(".brand-mark").evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    assert.ok(transitionDuration <= 0.001, "Transitions eliminated under reduced motion");

    // -------------------------------------------------------------
    // 7. COLOR CONTRAST RATIOS
    // -------------------------------------------------------------
    // Compute contrast for key typography tokens against the dark background
    function luminance(r, g, b) {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    function contrast(rgb1, rgb2) {
      const l1 = luminance(...rgb1);
      const l2 = luminance(...rgb2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    const bgRgb = [5, 5, 5]; // #050505
    const fgRgb = [243, 241, 236]; // #F3F1EC
    const mutedRgb = [138, 138, 138]; // #8A8A8A
    const accentRgb = [255, 90, 31]; // #FF5A1F
    const limeRgb = [216, 255, 62]; // #D8FF3E

    assert.ok(contrast(fgRgb, bgRgb) >= 7.0, "Primary text contrast must exceed WCAG AAA (7:1)");
    assert.ok(contrast(mutedRgb, bgRgb) >= 4.5, "Muted text contrast must exceed WCAG AA (4.5:1)");
    assert.ok(contrast(accentRgb, bgRgb) >= 4.5, "Accent orange contrast must exceed WCAG AA (4.5:1)");
    assert.ok(contrast(limeRgb, bgRgb) >= 3.0, "Focus lime outline must exceed UI contrast requirement (3:1)");
    assert.ok(contrast(bgRgb, limeRgb) >= 7.0, "Dark text on lime skip link must exceed WCAG AAA (7:1)");

    assert.deepEqual(errors, []);
    await page.close();
  } finally {
    await browser.close();
  }
});
