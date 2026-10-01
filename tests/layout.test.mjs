import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";

test("Phase 2 navigation, history, responsive layout and accessible fallbacks", { timeout: 90_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const active = async (label) => {
    await page.waitForFunction((name) => document.querySelector(".section-counter")?.textContent?.includes(name), label);
  };
  try {
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("main").count(), 1);
    assert.equal(await page.locator("section[data-section]").count(), 7);
    assert.equal(await page.locator("h1").count(), 1);
    assert.deepEqual(await page.locator(".project-card .project-title").allTextContents(), ["StudentsMate", "Tanvo", "LiveWall", "HackArena"]);
    await active("Introduction");
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").innerText(), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(":focus").getAttribute("id"), "main-content");
    await page.goto(baseURL);
    for (const name of ["Skip to content", "Srujan Mirji — introduction", "WORK", "ABOUT", "LAB", "CONTACT"]) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      assert.equal((await focused.getAttribute("aria-label")) || (await focused.innerText()), name);
      assert.equal(await focused.evaluate((element) => getComputedStyle(element).outlineStyle), "solid");
    }
    await page.keyboard.press("Enter");
    await active("Contact");
    assert.equal(await page.locator(":focus").getAttribute("id"), "contact");
    for (const [id, label] of [["work", "Work"], ["about", "About"], ["lab", "Lab"], ["contact", "Contact"]]) {
      await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: new RegExp(`^${id}$`, "i") }).click();
      await active(label);
      assert.equal(new URL(page.url()).hash, `#${id}`);
      assert.equal(await page.locator(`.desktop-navigation a[href="/#${id}"]`).getAttribute("aria-current"), "location");
      assert.ok(await page.locator(`#${id}`).evaluate((element) => element.getBoundingClientRect().top >= 79));
    }
    for (const [id, label] of [["timeline", "Timeline"], ["stack", "Tech stack"], ["home", "Introduction"]]) {
      await page.locator(`#${id}`).evaluate((element) => element.scrollIntoView());
      await active(label);
    }
    await page.goto(`${baseURL}/#work`);
    await active("Work");
    await page.reload();
    await active("Work");
    await page.locator('.desktop-navigation a[href="/#about"]').click();
    await active("About");
    await page.goBack();
    await active("Work");
    await page.goForward();
    await active("About");

    await page.setViewportSize({ width: 375, height: 812 });
    // Let the breakpoint's menu-close handler settle before keyboard interaction.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const menu = page.locator(".mobile-menu");
    const summary = menu.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    assert.equal(await menu.getAttribute("open"), "");
    for (const label of ["WORK", "ABOUT", "LAB", "CONTACT"]) {
      await page.keyboard.press("Tab");
      assert.equal(await page.locator(":focus").innerText(), label);
      assert.equal(await page.locator(":focus").evaluate((element) => getComputedStyle(element).outlineStyle), "solid");
    }
    await page.keyboard.press("Escape");
    assert.equal(await menu.getAttribute("open"), null);
    assert.equal(await page.locator(":focus").evaluate((element) => element.tagName), "SUMMARY");
    await summary.click();
    await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: /^lab$/i }).click();
    await active("Lab");
    assert.equal(await menu.getAttribute("open"), null);
    assert.equal(await page.locator(":focus").getAttribute("id"), "lab");
    await summary.click();
    await page.locator("#lab-title").click();
    assert.equal(await menu.getAttribute("open"), null);
    await summary.click();
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForFunction(() => !document.querySelector(".mobile-menu").open);

    for (const width of [360, 375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addStyleTag({ content: "html { font-size: 200% }" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await summary.click();
    await page.locator('.mobile-navigation a[href="/#contact"]').click();
    await active("Contact");
    assert.equal(await page.locator(".page-transition").evaluate((element) => getComputedStyle(element).animationName), "none");
    assert.equal(await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior), "auto");

    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
    await noJS.goto(baseURL);
    await noJS.locator(".mobile-menu > summary").click();
    await noJS.locator('.mobile-navigation a[href="/#work"]').click();
    assert.equal(new URL(noJS.url()).hash, "#work");
    assert.equal(await noJS.locator("section[data-section]").count(), 7);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
