import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 15 responsive design: desktop, tablet, mobile, and ultra-wide layouts", { timeout: 90_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const errors = [];

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP VIEWPORTS (1440px, 1280px, 1024px, and Ultra-wide)
    // -------------------------------------------------------------
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    desktopPage.on("pageerror", (err) => errors.push(err.message));
    desktopPage.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

    await desktopPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await desktopPage.evaluate(() => document.fonts.ready);

    // 1440px checks
    assert.equal(await desktopPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "No overflow at 1440px");
    assert.equal(await desktopPage.locator(".desktop-navigation").isVisible(), true, "Desktop navigation visible at 1440px");
    assert.equal(await desktopPage.locator(".mobile-menu").isVisible(), false, "Mobile menu hidden at 1440px");
    assert.equal(await desktopPage.locator(".pin-spacer").count(), 4, "Four desktop pin spacers active at 1440px");
    assert.equal(await desktopPage.locator(".projects-stage").getAttribute("data-horizontal"), "true", "Horizontal projects enabled at 1440px");
    assert.equal(await desktopPage.locator(".hero-canvas").getAttribute("data-state"), "ready", "Hero WebGL ready at 1440px");

    // Test custom cursor on desktop
    await desktopPage.mouse.move(500, 300);
    await desktopPage.waitForFunction(() => document.querySelector(".custom-cursor")?.getAttribute("data-visible") === "true");
    const cursorInteractive = desktopPage.locator(".custom-cursor");
    await desktopPage.hover('a[href="/#work"]');
    assert.equal(await cursorInteractive.getAttribute("data-interactive"), "true");

    // Test horizontal scroll in Projects on 1440px
    await desktopPage.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    await desktopPage.getByRole("button", { name: "Show Tanvo", exact: true }).click();
    await desktopPage.waitForFunction(() => document.querySelector('.project-card[data-active="true"] h3')?.textContent === "Tanvo");
    assert.ok(await desktopPage.locator('.project-card[data-active="true"]').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= innerWidth;
    }));

    // 1280px checks
    await desktopPage.setViewportSize({ width: 1280, height: 900 });
    await desktopPage.waitForTimeout(200);
    assert.equal(await desktopPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "No overflow at 1280px");
    assert.equal(await desktopPage.locator(".desktop-navigation").isVisible(), true);
    assert.equal(await desktopPage.locator(".projects-stage").getAttribute("data-horizontal"), "true");

    // 1024px desktop checks (fine pointer, mouse)
    await desktopPage.setViewportSize({ width: 1024, height: 768 });
    await desktopPage.waitForTimeout(200);
    assert.equal(await desktopPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "No overflow at 1024px desktop");
    assert.equal(await desktopPage.locator(".desktop-navigation").isVisible(), true);
    assert.equal(await desktopPage.locator(".projects-stage").getAttribute("data-horizontal"), "true");

    // Ultra-wide display checks (1920px and 2560px)
    for (const width of [1920, 2560]) {
      await desktopPage.setViewportSize({ width, height: 1080 });
      await desktopPage.waitForTimeout(200);
      assert.equal(await desktopPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No overflow at ${width}px ultra-wide`);
      // Verify container constraint: max-width is capped at 1600px (100rem)
      const containerWidth = await desktopPage.locator(".page-container").first().evaluate((el) => el.clientWidth);
      assert.ok(containerWidth <= 1600, `Container width ${containerWidth}px correctly capped at 1600px on ${width}px screen`);
    }
    await desktopPage.close();

    // -------------------------------------------------------------
    // 2. TABLET VIEWPORTS (1024px Touch & 768px Tablet)
    // -------------------------------------------------------------
    // 1024px tablet with touch (e.g. iPad Pro portrait/landscape)
    const tablet1024 = await browser.newContext({
      viewport: { width: 1024, height: 1366 },
      hasTouch: true,
      isMobile: true,
    });
    const pageTablet1024 = await tablet1024.newPage();
    await pageTablet1024.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    assert.equal(await pageTablet1024.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    // Custom cursor disabled on touch tablet
    assert.equal(await pageTablet1024.locator(".custom-cursor").evaluate((el) => getComputedStyle(el).display), "none");
    // WebGL reduced/fallback on touch tablet (zero GPU complexity)
    assert.equal(await pageTablet1024.locator(".hero-canvas").getAttribute("data-state"), "fallback");

    // Horizontal sections test on 1024px tablet: touch swipe navigation
    await pageTablet1024.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    await pageTablet1024.getByRole("button", { name: "Show LiveWall", exact: true }).tap();
    await pageTablet1024.waitForFunction(() => document.querySelector('.project-card[data-active="true"] h3')?.textContent === "LiveWall");
    await tablet1024.close();

    // 768px tablet (e.g. iPad portrait 768x1024)
    const tablet768 = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      hasTouch: true,
      isMobile: true,
    });
    const pageTablet768 = await tablet768.newPage();
    await pageTablet768.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    assert.equal(await pageTablet768.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    // 768px uses vertical fallback flow for pins: 0 pin spacers
    assert.equal(await pageTablet768.locator(".pin-spacer").count(), 0, "768px reverts pins to natural vertical flow");
    assert.equal(await pageTablet768.locator(".projects-stage").getAttribute("data-horizontal"), null, "Projects in vertical flow at 768px");
    assert.equal(await pageTablet768.locator(".hero-canvas").getAttribute("data-state"), "fallback", "Hero WebGL reduced to DOM fallback at 768px");
    assert.equal(await pageTablet768.locator(".custom-cursor").evaluate((el) => getComputedStyle(el).display), "none", "Custom cursor disabled at 768px");

    // Typography & layout adjustments at 768px
    const heroNameWidth = await pageTablet768.locator(".hero-name").evaluate((el) => el.getBoundingClientRect().width);
    assert.ok(heroNameWidth < 768, "Hero title scales responsively without clipping");
    await tablet768.close();

    // -------------------------------------------------------------
    // 3. MOBILE VIEWPORTS (430px, 390px, 375px, 360px)
    // -------------------------------------------------------------
    for (const width of [430, 390, 375, 360]) {
      const mobileContext = await browser.newContext({
        viewport: { width, height: 800 },
        hasTouch: true,
        isMobile: true,
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(`${baseURL}/`, { waitUntil: "networkidle" });

      // No horizontal document overflow
      assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No overflow at ${width}px mobile`);

      // Parallax and pins reduced to 0
      assert.equal(await mobilePage.locator(".pin-spacer").count(), 0, `No pin spacers at ${width}px mobile`);

      // Awkward horizontal interactions replaced: Projects in vertical flow
      assert.equal(await mobilePage.locator(".projects-stage").getAttribute("data-horizontal"), null, `Projects vertical at ${width}px`);
      assert.equal(await mobilePage.locator(".project-card").count(), 4, `All 4 cards rendered vertically at ${width}px`);

      // Custom cursor disabled
      assert.equal(await mobilePage.locator(".custom-cursor").evaluate((el) => getComputedStyle(el).display), "none", `Custom cursor hidden at ${width}px`);

      // WebGL reduced: canvas in fallback state
      assert.equal(await mobilePage.locator(".hero-canvas").getAttribute("data-state"), "fallback", `WebGL in fallback at ${width}px`);

      // Mobile menu test
      assert.equal(await mobilePage.locator(".desktop-navigation").isVisible(), false, `Desktop nav hidden at ${width}px`);
      const menu = mobilePage.locator(".mobile-menu");
      assert.equal(await menu.isVisible(), true, `Mobile menu disclosure visible at ${width}px`);
      await menu.locator("summary").tap();
      assert.equal(await menu.getAttribute("open"), "", `Mobile menu opens on tap at ${width}px`);
      await mobilePage.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /^work$/i }).tap();
      assert.equal(await menu.getAttribute("open"), null, `Mobile menu closes after selection at ${width}px`);

      // Test all 4 project case-study pages at this mobile viewport
      for (const slug of ["studentsmate", "tanvo", "livewall", "hackarena"]) {
        await mobilePage.goto(`${baseURL}/work/${slug}`, { waitUntil: "networkidle" });
        assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No overflow on /work/${slug} at ${width}px`);
        assert.equal(await mobilePage.locator(".case-chapter").count(), 9, `All 9 chapters rendered on /work/${slug} at ${width}px`);
        assert.equal(await mobilePage.locator(".case-back").first().isVisible(), true, `Back to projects button visible on /work/${slug} at ${width}px`);
      }

      await mobileContext.close();
    }

    // -------------------------------------------------------------
    // 4. ACCESSIBLE ENLARGED TEXT ACROSS BREAKPOINTS (200% Font Size)
    // -------------------------------------------------------------
    for (const width of [360, 375, 768, 1024, 1280, 1440]) {
      const zoomPage = await browser.newPage({ viewport: { width, height: 800 } });
      await zoomPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
      await zoomPage.addStyleTag({ content: "html { font-size: 200%; }" });
      await zoomPage.waitForTimeout(250);
      assert.equal(await zoomPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No overflow at ${width}px with 200% font size`);
      await zoomPage.close();
    }

    // -------------------------------------------------------------
    // 5. NO-JAVASCRIPT RESPONSIVE FLOW
    // -------------------------------------------------------------
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(`${baseURL}/`);
    assert.equal(await noJS.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "No-JS 375px mobile has no overflow");
    assert.equal(await noJS.locator(".project-card").count(), 4, "No-JS renders all 4 projects vertically");
    assert.equal(await noJS.locator(".hero-portrait img").isVisible(), true, "DOM portrait visible without JS");
    await noJS.close();

    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
