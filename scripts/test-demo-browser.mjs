import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const origin = process.env.TEST_BASE_URL ?? "http://localhost:3001";
const directory = "docs/screenshots/phase-2/offline";
fs.mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  args: ["--no-sandbox"],
});
const checks = [];
try {
  for (const width of [360, 390, 430, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const posts = [],
      providerCalls = [],
      errors = [];
    page.on("request", (r) => {
      if (r.method() === "POST") posts.push(r.url());
      if (new URL(r.url()).hostname.endsWith("supabase.co"))
        providerCalls.push(r.url());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    for (const section of [
      "overview",
      "quotes",
      "bookings",
      "cleaners",
      "favorites",
      "messages",
      "payments",
      "settings",
    ]) {
      await page.goto(`${origin}/dev/account?section=${section}`, {
        waitUntil: "networkidle",
      });
      assert(
        await page
          .getByText("DEVELOPMENT DEMO · NOT A REAL ACCOUNT", { exact: true })
          .isVisible(),
      );
      assert.equal(
        await page.getByRole("button", { name: "Sign Out" }).count(),
        0,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${section} overflow at ${width}`,
      );
      if (section === "settings")
        assert(
          await page
            .getByRole("button", {
              name: "Save Details · unavailable in preview",
            })
            .isDisabled(),
        );
      await page.evaluate(() => {
        document.activeElement?.blur();
        window.scrollTo(0, 0);
      });
      if (width === 390 && section === "overview")
        await page.screenshot({
          path: `${directory}/demo-account-390.png`,
          fullPage: true,
          style: "nextjs-portal { display: none !important; }",
        });
      checks.push({
        width,
        section,
        state: "Labeled UI-only demonstration, no identity/session",
      });
    }
    await page.goto(
      `${origin}/dev/account?section=bookings&scenario=completed`,
      { waitUntil: "networkidle" },
    );
    assert(
      await page
        .getByText("FICTIONAL JOB FIXTURE", { exact: true })
        .isVisible(),
    );
    await page
      .getByText("Request Same Cleaner · UI preview", { exact: true })
      .click();
    await page.locator("#demo-preferred-date").fill("2030-01-15");
    await page
      .getByRole("button", { name: "Preview request behavior" })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Preview only — no request was sent or saved." })
      .waitFor({ state: "visible" });
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo(0, 0);
    });
    if (width === 390)
      await page.screenshot({
        path: `${directory}/demo-repeat-cleaner-390.png`,
        fullPage: true,
        style: "nextjs-portal { display: none !important; }",
      });
    await Promise.all([
      page.waitForURL((url) => url.searchParams.get("section") === "quotes"),
      page.getByRole("link", { name: "My Quotes", exact: true }).click(),
    ]);
    assert(new URL(page.url()).pathname === "/dev/account");
    assert(new URL(page.url()).searchParams.get("scenario") === "completed");
    assert.equal(
      (await page.context().cookies()).filter((c) => c.name.startsWith("sb-"))
        .length,
      0,
    );
    assert.deepEqual(posts, []);
    assert.deepEqual(providerCalls, []);
    assert.deepEqual(errors, []);
    await page.close();
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  const posts = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  for (const route of ["sign-in", "sign-up", "forgot-password"]) {
    await page.goto(`${origin}/${route}`, { waitUntil: "networkidle" });
    assert(
      await page
        .getByText("DEVELOPMENT DEMO · VALIDATION ONLY", { exact: true })
        .isVisible(),
    );
    assert(await page.locator("button[type=submit]").isDisabled());
    await page.getByRole("button", { name: "Check form · demo only" }).click();
    assert(
      await page
        .getByRole("alert")
        .filter({ hasText: "Please check the highlighted fields." })
        .isVisible(),
    );
    await page.locator("#email").fill("ui-check@example.invalid");
    if (route === "sign-up")
      await page.locator("#name").fill("UI fixture · not a customer");
    if (route !== "forgot-password")
      await page.locator("#password").fill("local-ui-validation-only");
    if (route === "sign-up")
      await page.locator("#confirmPassword").fill("local-ui-validation-only");
    await page.getByRole("button", { name: "Check form · demo only" }).click();
    assert(
      await page
        .getByRole("status")
        .filter({
          hasText: "Nothing was submitted; no account or session was created.",
        })
        .isVisible(),
    );
    assert(await page.locator("button[type=submit]").isDisabled());
    // Capture the initial labeled state rather than retaining typed test input.
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: `${directory}/demo-${route}-390.png`,
      fullPage: true,
      style: "nextjs-portal { display: none !important; }",
    });
  }
  assert.deepEqual(posts, []);
  assert.equal(
    (await page.context().cookies()).filter((c) => c.name.startsWith("sb-"))
      .length,
    0,
  );
  fs.writeFileSync(
    `${directory}/results.json`,
    JSON.stringify(
      {
        mode: "Development UI only. Supabase disabled. No real authentication or submissions.",
        checks,
        mutatingRequests: 0,
        providerRequests: 0,
        authSessionCookies: 0,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `PASS: ${checks.length} offline dashboard viewport/section checks; local-only auth validation and repeat-request demonstration; zero POSTs, provider requests, or auth-session cookies.`,
  );
} finally {
  await browser.close();
}
