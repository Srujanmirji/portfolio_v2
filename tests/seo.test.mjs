import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { projects } from "../src/data/projects.ts";

test("Phase 18 SEO: titles, descriptions, canonical URLs, OG/Twitter tags, sitemap, robots, and JSON-LD structured data", { timeout: 60_000 }, async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    // -------------------------------------------------------------
    // 1. HOMEPAGE METADATA & STRUCTURED DATA
    // -------------------------------------------------------------
    const homeResponse = await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    assert.equal(homeResponse?.status(), 200, "Homepage status must be 200");

    const pageTitle = await page.title();
    assert.match(pageTitle, /Srujan Mirji — AI Engineer & Product Builder/, "Title matches exact PRD headline");

    const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
    assert.ok(metaDescription && metaDescription.length > 30, "Meta description exists and has substantial content");
    assert.match(metaDescription, /Srujan Mirji/, "Meta description names Srujan Mirji");

    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
    assert.ok(
      canonicalHref === "https://www.srujanmirji.in" || canonicalHref === "https://www.srujanmirji.in/",
      `Canonical URL must point to production domain root, got: ${canonicalHref}`
    );

    const robotsContent = await page.locator('meta[name="robots"]').getAttribute("content");
    assert.ok(robotsContent?.includes("index") && robotsContent?.includes("follow"), "Robots meta must allow indexing");
    assert.ok(!robotsContent?.includes("noindex"), "Robots meta must not contain noindex");

    // Open Graph
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");

    assert.ok(ogTitle?.includes("Srujan Mirji"), "og:title contains author name");
    assert.ok(ogDesc && ogDesc.length > 20, "og:description is populated");
    assert.match(ogUrl || "", /https:\/\/www\.srujanmirji\.in/, "og:url points to canonical domain");
    assert.equal(ogType, "website", "og:type is website");
    assert.ok(ogImage && ogImage.includes("opengraph-image"), "og:image references generated preview image");

    // Twitter
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute("content");
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute("content");

    assert.equal(twitterCard, "summary_large_image", "twitter:card is summary_large_image");
    assert.ok(twitterTitle?.includes("Srujan Mirji"), "twitter:title is present");
    assert.ok(twitterImage && twitterImage.includes("twitter-image"), "twitter:image references card preview image");

    // Structured data (JSON-LD)
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    assert.ok(jsonLdScripts.length >= 1, "At least one JSON-LD structured data block on homepage");

    let foundPerson = false;
    let foundWebSite = false;

    for (const script of jsonLdScripts) {
      const raw = await script.textContent();
      if (!raw) continue;
      const data = JSON.parse(raw);
      const graph = data["@graph"] || [data];
      for (const item of graph) {
        if (item["@type"] === "Person" && item.name === "Srujan Mirji") foundPerson = true;
        if (item["@type"] === "WebSite" && item.name === "Srujan Mirji") foundWebSite = true;
      }
    }
    assert.ok(foundPerson, "JSON-LD includes valid Person schema");
    assert.ok(foundWebSite, "JSON-LD includes valid WebSite schema");

    // -------------------------------------------------------------
    // 2. ROBOTS.TXT ROUTE
    // -------------------------------------------------------------
    const robotsResponse = await page.request.get(`${baseURL}/robots.txt`);
    assert.equal(robotsResponse.status(), 200, "robots.txt must return 200");
    const robotsBody = await robotsResponse.text();
    assert.match(robotsBody, /User-Agent:\s*\*/i, "robots.txt targets all user agents");
    assert.match(robotsBody, /Allow:\s*\//i, "robots.txt allows root access");
    assert.match(robotsBody, /Sitemap:\s*https:\/\/www\.srujanmirji\.in\/sitemap\.xml/i, "robots.txt points to sitemap");

    // -------------------------------------------------------------
    // 3. SITEMAP.XML ROUTE
    // -------------------------------------------------------------
    const sitemapResponse = await page.request.get(`${baseURL}/sitemap.xml`);
    assert.equal(sitemapResponse.status(), 200, "sitemap.xml must return 200");
    const sitemapBody = await sitemapResponse.text();
    assert.match(sitemapBody, /<loc>https:\/\/www\.srujanmirji\.in\/<\/loc>/, "sitemap contains homepage");
    for (const project of projects) {
      const expectedUrl = `https://www.srujanmirji.in/work/${project.slug}`;
      assert.ok(sitemapBody.includes(expectedUrl), `sitemap includes project URL: ${expectedUrl}`);
    }

    // -------------------------------------------------------------
    // 4. OPEN GRAPH & TWITTER IMAGES GENERATION
    // -------------------------------------------------------------
    const ogImgResponse = await page.request.get(`${baseURL}/opengraph-image`);
    assert.equal(ogImgResponse.status(), 200, "opengraph-image endpoint returns 200");
    assert.match(ogImgResponse.headers()["content-type"] || "", /image\/png/, "opengraph-image returns image/png");

    const twImgResponse = await page.request.get(`${baseURL}/twitter-image`);
    assert.equal(twImgResponse.status(), 200, "twitter-image endpoint returns 200");
    assert.match(twImgResponse.headers()["content-type"] || "", /image\/png/, "twitter-image returns image/png");

    // -------------------------------------------------------------
    // 5. PROJECT CASE STUDY SPECIFIC METADATA
    // -------------------------------------------------------------
    for (const project of projects) {
      const projectRes = await page.goto(`${baseURL}/work/${project.slug}`, { waitUntil: "networkidle" });
      assert.equal(projectRes?.status(), 200, `Case study /work/${project.slug} must return 200`);

      const caseTitle = await page.title();
      assert.ok(caseTitle.includes(project.title), `Case study title includes "${project.title}"`);
      assert.ok(caseTitle.includes("Srujan Mirji"), "Case study title includes author");

      const caseDesc = await page.locator('meta[name="description"]').getAttribute("content");
      assert.equal(caseDesc, project.description, "Case study meta description matches project summary");

      const caseCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      assert.equal(
        caseCanonical,
        `https://www.srujanmirji.in/work/${project.slug}`,
        `Case study canonical link is exact`
      );

      const caseOgTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      assert.ok(caseOgTitle?.includes(project.title), "Case study og:title contains project title");

      // Check BreadcrumbList and SoftwareApplication JSON-LD
      const caseJsonLds = await page.locator('script[type="application/ld+json"]').all();
      let foundBreadcrumb = false;
      let foundApp = false;

      for (const script of caseJsonLds) {
        const raw = await script.textContent();
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (data["@type"] === "BreadcrumbList") {
          foundBreadcrumb = true;
          assert.equal(data.itemListElement.length, 2, "Breadcrumb has Home and Case Study items");
          assert.equal(data.itemListElement[1].name, project.title, "Breadcrumb item 2 is project title");
        }
        if (data["@type"] === "SoftwareApplication") {
          foundApp = true;
          assert.equal(data.name, project.title, "SoftwareApplication name matches project title");
        }
      }

      assert.ok(foundBreadcrumb, `Case study ${project.slug} has valid BreadcrumbList schema`);
      assert.ok(foundApp, `Case study ${project.slug} has valid SoftwareApplication schema`);
    }
  } finally {
    await browser.close();
  }
});
