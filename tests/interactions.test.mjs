import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 14 micro-interactions: button, link, project, navigation, image, cursor, progress, and page transitions", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

  try {
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // 1. Navigation hover states & link transitions
    const brandMark = page.locator(".brand-mark");
    await brandMark.hover();
    await page.waitForFunction(() => {
      const color = getComputedStyle(document.querySelector(".brand-mark")).color;
      return color === "rgb(255, 90, 31)";
    });

    const workNav = page.locator('.desktop-navigation a[href="/#work"]');
    await workNav.hover();
    await page.waitForFunction(() => {
      const color = getComputedStyle(document.querySelector('.desktop-navigation a[href="/#work"]')).color;
      return color === "rgb(255, 90, 31)";
    });

    // 2. Custom cursor transitions & pressed state
    const cursor = page.locator(".custom-cursor");
    await page.mouse.move(900, 300);
    await page.waitForFunction(() => document.documentElement.dataset.customCursor === "true");
    await workNav.hover();
    await page.waitForFunction(() => document.querySelector(".custom-cursor")?.dataset?.interactive === "true");
    assert.equal(await cursor.getAttribute("data-interactive"), "true");

    // Test mouse press (pointerdown) down-scaling transition on neutral surface
    await page.mouse.move(500, 500);
    await page.mouse.down();
    await page.waitForFunction(() => document.querySelector(".custom-cursor")?.dataset?.pressed === "true");
    assert.equal(await cursor.getAttribute("data-pressed"), "true");
    await page.mouse.up();
    await page.waitForFunction(() => document.querySelector(".custom-cursor")?.dataset?.pressed === "false");
    assert.equal(await cursor.getAttribute("data-pressed"), "false");

    // 3. Hero action link hover states
    const heroWorkLink = page.locator('.hero-actions a[href="/#work"]');
    await heroWorkLink.hover();
    await page.waitForFunction(() => {
      const color = getComputedStyle(document.querySelector('.hero-actions a[href="/#work"]')).color;
      return color === "rgb(255, 90, 31)";
    });

    // 4. About link hover state & arrow shift
    await page.goto(`${baseURL}/#about`, { waitUntil: "networkidle" });
    const aboutLink = page.locator(".about-link");
    await aboutLink.hover();
    await page.waitForFunction(() => {
      const color = getComputedStyle(document.querySelector(".about-link")).color;
      return color === "rgb(255, 90, 31)";
    });

    // 5. Project card hover states & image zoom
    await page.goto(`${baseURL}/#work`, { waitUntil: "networkidle" });
    const projectCard = page.locator(".project-card").first();
    await projectCard.hover();
    await page.waitForFunction(() => {
      const media = document.querySelector(".project-card .project-media");
      return getComputedStyle(media).borderColor === "rgb(138, 138, 138)";
    });

    // Project action link hover
    const projectLink = projectCard.locator(".project-link");
    await projectLink.hover();
    await page.waitForFunction(() => {
      const link = document.querySelector(".project-card .project-link");
      return getComputedStyle(link).color === "rgb(255, 90, 31)";
    });

    // 6. Timeline milestone link hover
    await page.goto(`${baseURL}/#timeline`, { waitUntil: "networkidle" });
    const timelineLink = page.locator(".timeline-milestones a").first();
    if (await timelineLink.count() > 0) {
      await timelineLink.hover();
      await page.waitForFunction(() => {
        const link = document.querySelector(".timeline-milestones a");
        return getComputedStyle(link).color === "rgb(255, 90, 31)";
      });
    }

    // 7. Lab filter button hover
    await page.goto(`${baseURL}/#lab`, { waitUntil: "networkidle" });
    const labButton = page.locator(".lab-filter button").first();
    if (await labButton.isVisible()) {
      await labButton.hover();
      await page.waitForFunction(() => {
        const btn = document.querySelector(".lab-filter button");
        return getComputedStyle(btn).color === "rgb(255, 90, 31)";
      });
    }

    // 8. Contact Back-to-Top hover state
    await page.goto(`${baseURL}/#contact`, { waitUntil: "networkidle" });
    const contactTop = page.locator(".contact-top");
    await contactTop.hover();
    await page.waitForFunction(() => {
      const top = document.querySelector(".contact-top");
      return getComputedStyle(top).color === "rgb(255, 90, 31)";
    });

    // 9. Case study navigation & Back-to-projects transition
    await page.goto(`${baseURL}/work/studentsmate`, { waitUntil: "networkidle" });
    const caseBack = page.locator(".case-back").first();
    await caseBack.hover();
    await page.waitForFunction(() => {
      const back = document.querySelector(".case-back");
      return getComputedStyle(back).color === "rgb(255, 90, 31)";
    });
    // Check arrow shift on hover
    const arrowTransform = await caseBack.locator('span[aria-hidden="true"]').evaluate((span) => getComputedStyle(span).transform);
    assert.ok(arrowTransform !== "none", "Case back arrow shifts on hover");

    // Click back to projects
    await caseBack.click();
    await page.waitForURL("**/#work");
    assert.equal(new URL(page.url()).hash, "#work");

    // 10. Page arrival transition under normal motion vs reduced motion
    const transitionPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await transitionPage.goto(`${baseURL}/work/studentsmate`, { waitUntil: "networkidle" });
    const animName = await transitionPage.locator(".page-transition").evaluate((e) => getComputedStyle(e).animationName);
    assert.equal(animName, "page-arrival", "Page transition animation active under normal motion");
    await transitionPage.close();

    const reducedMotionPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    await reducedMotionPage.goto(`${baseURL}/work/studentsmate`, { waitUntil: "networkidle" });
    const reducedAnim = await reducedMotionPage.locator(".page-transition").evaluate((e) => getComputedStyle(e).animationName);
    assert.equal(reducedAnim, "none", "Page transition disabled under reduced motion");
    await reducedMotionPage.close();

    // 11. Mobile navigation hover and touch check
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobilePage.goto(baseURL, { waitUntil: "networkidle" });
    const menu = mobilePage.locator(".mobile-menu");
    const summary = menu.locator("summary");
    await summary.click();
    assert.equal(await menu.getAttribute("open"), "");
    const mobileLink = mobilePage.locator('.mobile-navigation a[href="/#about"]');
    assert.ok(await mobileLink.isVisible());
    await mobilePage.close();

    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
