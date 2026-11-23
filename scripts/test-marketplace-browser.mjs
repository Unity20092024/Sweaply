import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const development = process.env.MARKETPLACE_TEST_MODE === "development";
const origin =
  process.env.TEST_BASE_URL ??
  (development ? "http://localhost:3001" : "http://127.0.0.1:3000");
const directory = "docs/screenshots/phase-3";
fs.mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  args: ["--no-sandbox"],
});
const results = [];
const posts = [],
  providers = [],
  errors = [];
async function pageFor(width) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    isMobile: width < 768,
    hasTouch: width < 768,
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
    if (new URL(r.url()).hostname.endsWith("supabase.co"))
      providers.push(r.url());
  });
  return page;
}
async function shot(page, name) {
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  if (name.includes("modal") || name.includes("request-"))
    await page.locator("dialog").evaluate((el) => el.scrollTo({ top: 0 }));
  await page.screenshot({
    path: `${directory}/${name}.png`,
    fullPage: !name.includes("modal") && !name.includes("request-"),
    style: "nextjs-portal { display:none!important; }",
  });
}
async function fits(page, label) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    label,
  );
}
try {
  if (!development) {
    for (const width of [360, 375, 390, 430, 768, 1024, 1440]) {
      const page = await pageFor(width);
      for (const route of ["/", "/become-a-cleaner", "/cleaner/dashboard"]) {
        const r = await page.goto(origin + route, { waitUntil: "networkidle" });
        assert.equal(r.status(), 200);
        await fits(page, `${route} overflow at ${width}`);
        assert.equal(await page.locator(".cleaner-card").count(), 0);
        assert.equal(
          await page
            .getByText("DEVELOPMENT DEMO · NOT A REAL CLEANER ACCOUNT", {
              exact: true,
            })
            .count(),
          0,
        );
        if (route === "/") {
          assert.equal(await page.locator("#cleaners").count(), 1);
          await expect(
            page
              .getByRole("link", {
                name: "Become a Sweaply Cleaner",
                exact: true,
              })
              .first(),
          ).toHaveAttribute("href", "/become-a-cleaner");
        }
        if (route === "/cleaner/dashboard")
          await expect(
            page.getByRole("heading", {
              name: "Your workspace is on its way.",
            }),
          ).toBeVisible();
        if (width === 390 && route !== "/")
          await shot(
            page,
            route === "/become-a-cleaner"
              ? "application-390"
              : "cleaner-workspace-unavailable-390",
          );
        if (width === 1440 && route === "/become-a-cleaner")
          await shot(page, "application-1440");
        results.push({
          width,
          route,
          horizontalOverflow: false,
          realCleaners: 0,
        });
      }
      await page.close();
    }
    const page = await pageFor(390);
    for (const route of ["/dev/marketplace", "/dev/cleaner"]) {
      const r = await page.goto(origin + route);
      assert.equal(
        r.status(),
        404,
        "Development fixtures must be inaccessible in production",
      );
    }
    await page.goto(origin + "/become-a-cleaner", { waitUntil: "networkidle" });
    assert.equal(await page.locator("input[type=file]").count(), 0);
    await page
      .getByRole("button", { name: "Review application", exact: true })
      .click();
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: /Please check|Choose a cleaning service/ })
        .filter({ hasText: "Please check" }),
    ).toContainText("Please check");
    await page
      .getByLabel("Full name", { exact: true })
      .fill("UI test only · not an applicant");
    await page
      .getByLabel("Email address", { exact: true })
      .fill("ui-check@example.invalid");
    await page
      .getByLabel("Professional experience", { exact: true })
      .selectOption("1–3 years");
    await page.getByLabel("Move-Out Cleaning", { exact: true }).check();
    await page.getByLabel("Minneapolis", { exact: true }).check();
    await page.getByLabel("Monday", { exact: true }).check();
    await page
      .getByRole("button", { name: "Review application", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "No application, account, or cleaner profile has been created",
    );
    await expect(
      page.getByRole("button", { name: "Submit application · unavailable" }),
    ).toBeDisabled();
    await shot(page, "application-review-390");
  } else {
    for (const width of [360, 375, 390, 430, 768, 1024, 1440]) {
      const page = await pageFor(width);
      await page.goto(origin + "/dev/marketplace", {
        waitUntil: "networkidle",
      });
      await fits(page, `Marketplace overflow at ${width}`);
      await expect(
        page.getByText("DEVELOPMENT DEMO · NO REAL CLEANERS OR BOOKINGS", {
          exact: true,
        }),
      ).toBeVisible();
      assert.equal(await page.locator(".cleaner-card").count(), 3);
      assert.equal(await page.locator(".cleaner-card .rating").count(), 0);
      for (const img of await page.locator(".cleaner-portrait img").all())
        assert(
          await img.evaluate(
            (image) => image.complete && image.naturalWidth > 0,
          ),
        );
      const track = page.locator(".carousel-track");
      const scrollable = await track.evaluate(
        (el) => el.scrollWidth > el.clientWidth,
      );
      if (scrollable && width === 390) {
        await track.scrollIntoViewIfNeeded();
        await track.evaluate((el) =>
          el.scrollTo({ left: 0, behavior: "instant" }),
        );
        const box = await track.boundingBox();
        const client = await page.context().newCDPSession(page);
        const y = Math.min(700, box.y + 90);
        await client.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: 320, y }],
        });
        for (let x = 290; x >= 65; x -= 25)
          await client.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x, y }],
          });
        await client.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await expect
          .poll(() => track.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(10);
        await client.detach();
      }
      if (scrollable) {
        await page
          .getByRole("button", { name: "Next cleaner profiles" })
          .click();
        await expect
          .poll(() => track.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(0);
        await expect(
          page.getByRole("button", { name: "Previous cleaner profiles" }),
        ).toBeEnabled();
        await track.focus();
        await page.keyboard.press("ArrowLeft");
      }
      if (width === 390) await shot(page, "marketplace-demo-390");
      await page
        .getByRole("button", { name: "View Profile", exact: true })
        .first()
        .click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText("No verified reviews to share yet");
      await expect(dialog).toContainText(
        "No authorized before-and-after photos yet",
      );
      assert(
        await page.evaluate(() => document.body.style.overflow === "hidden"),
      );
      await page.keyboard.press("Tab");
      assert(
        await dialog.evaluate((el) => el.contains(document.activeElement)),
      );
      if (width === 390) await shot(page, "cleaner-profile-modal-390");
      await page
        .getByRole("button", { name: "Request This Cleaner", exact: true })
        .click();
      await expect(dialog).toContainText("Pending Cleaner Acceptance");
      await page
        .getByRole("button", { name: "Review request", exact: true })
        .click();
      await expect(dialog.getByRole("alert")).toContainText(
        "Choose a cleaning service",
      );
      await page
        .getByLabel("Cleaning service", { exact: true })
        .selectOption("Move-Out Cleaning");
      await page
        .getByLabel("Preferred date", { exact: true })
        .fill(new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
      await page
        .locator("#request-notes")
        .fill("Local UI check only. No customer details.");
      if (width === 390) await shot(page, "request-form-390");
      await page
        .getByRole("button", { name: "Review request", exact: true })
        .click();
      await expect(page.getByRole("status")).toContainText(
        "Nothing has been sent, saved, accepted, or confirmed",
      );
      await expect(
        page.getByRole("button", { name: "Submit request · unavailable" }),
      ).toBeDisabled();
      if (width === 390) await shot(page, "request-review-390");
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      assert.notEqual(
        await page.evaluate(() => document.body.style.overflow),
        "hidden",
      );
      await expect(
        page.getByRole("button", { name: "View Profile", exact: true }).first(),
      ).toBeFocused();
      results.push({
        width,
        route: "/dev/marketplace",
        modal: true,
        request: "not submitted",
        carousel: scrollable ? "controls and keyboard" : "all cards fit",
      });
      await page.goto(origin + "/dev/cleaner", { waitUntil: "networkidle" });
      await expect(
        page.getByText("DEVELOPMENT DEMO · NOT A REAL CLEANER ACCOUNT", {
          exact: true,
        }),
      ).toBeVisible();
      await fits(page, `Dashboard overflow at ${width}`);
      if (width === 390) await shot(page, "cleaner-dashboard-390");
      for (const tab of [
        "My Profile",
        "Incoming Requests",
        "My Jobs",
        "Availability",
        "Completion Checklist",
        "Before-and-After Gallery",
      ]) {
        await page.getByRole("button", { name: tab, exact: true }).click();
        await expect(
          page.getByRole("heading", { level: 1, name: tab, exact: true }),
        ).toBeVisible();
        await fits(page, `${tab} overflow at ${width}`);
      }
      results.push({
        width,
        route: "/dev/cleaner",
        sections: 6,
        horizontalOverflow: false,
      });
      await page.close();
    }
    const page = await pageFor(390);
    await page.goto(origin + "/dev/cleaner", { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Accept · demo", exact: true })
      .first()
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Nothing is confirmed, saved, or sent",
    );
    await expect(page.locator(".workspace-status").first()).toContainText(
      "Awaiting Confirmation",
    );
    await page
      .getByRole("button", { name: "Decline · demo", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "No real request has been changed",
    );
    await page.getByRole("button", { name: "My Jobs", exact: true }).click();
    await expect(page.locator(".workspace-status")).toContainText(
      "Awaiting Confirmation",
    );
    if (await page.getByText("Confirmed", { exact: true }).count())
      throw new Error("A demo decision must never confirm a job");
    await shot(page, "cleaner-jobs-390");
    await page
      .getByRole("button", { name: "Availability", exact: true })
      .click();
    await page.getByRole("button", { name: "Monday", exact: true }).click();
    await page
      .getByRole("button", { name: "Preview availability", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "No availability was saved or published",
    );
    await page
      .getByRole("button", { name: "Completion Checklist", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Preview completion", exact: true }),
    ).toBeDisabled();
    for (const input of await page.getByRole("checkbox").all())
      await input.check();
    await page
      .getByRole("button", { name: "Preview completion", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "No job was marked complete",
    );
    await shot(page, "cleaner-checklist-390");
    await page
      .getByRole("button", { name: "Before-and-After Gallery", exact: true })
      .click();
    await shot(page, "cleaner-gallery-empty-390");
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aTIQAAAAASUVORK5CYII=",
      "base64",
    );
    for (const label of ["Before image", "After image"])
      await page.getByLabel(label, { exact: true }).setInputFiles({
        name: "synthetic-test-pixel.png",
        mimeType: "image/png",
        buffer: png,
      });
    assert.equal(await page.locator(".local-gallery img").count(), 0);
    await page.getByRole("checkbox").check();
    await expect(page.locator(".local-gallery img")).toHaveCount(2);
    await page.reload({ waitUntil: "networkidle" });
    await expect(
      page.getByRole("button", { name: "Accept · demo", exact: true }),
    ).toHaveCount(2);
  }
  assert.deepEqual(posts, [], "Offline workflows must not POST");
  assert.deepEqual(providers, [], "No Supabase requests allowed");
  assert.deepEqual(errors, [], "No browser runtime errors");
  fs.writeFileSync(
    `${directory}/${development ? "development" : "production"}-results.json`,
    JSON.stringify(
      {
        mode: development
          ? "development fixtures only"
          : "production disconnected",
        checks: results,
        posts: 0,
        providerRequests: 0,
        browserErrors: 0,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `PASS: ${results.length} ${development ? "development" : "production"} responsive route checks and offline interactions. Zero POSTs, provider requests, or runtime errors.`,
  );
} finally {
  await browser.close();
}
