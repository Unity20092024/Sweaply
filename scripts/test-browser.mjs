import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const origin = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
fs.mkdirSync("docs/screenshots/phase-2", { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    headless: true,
    args: ["--no-sandbox"],
  });
  const checks = [];
  for (const width of [360, 375, 390, 430, 768, 1024, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 844 },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/account",
    ]) {
      const response = await page.goto(`${origin}${route}`, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
      assert(/no-store/.test(response.headers()["cache-control"]));
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} overflow at ${width}`,
      );
      const logo = page.locator('img[alt="Sweaply — Home Cleaning"]');
      assert.equal(await logo.count(), 1);
      await logo.evaluate((img) => img.decode());
      assert(
        await logo.evaluate(
          (img) =>
            Math.abs(
              img.getBoundingClientRect().width /
                img.getBoundingClientRect().height -
                3,
            ) < 0.01,
        ),
      );
      if (route === "/account") {
        assert(
          await page.getByText("Your account space is on its way.").isVisible(),
        );
        assert.equal(
          await page.getByRole("button", { name: "Sign Out" }).count(),
          0,
        );
        for (const name of [
          "My Quotes",
          "My Bookings",
          "My Cleaners",
          "Favorites",
          "Messages",
          "Payments & Receipts",
          "Account Settings",
        ])
          assert.equal(
            await page.getByRole("link", { name, exact: true }).count(),
            1,
          );
        assert.equal(
          await page.locator(".account-stat").count(),
          0,
          "No pretend customer metrics while unconfigured",
        );
      } else {
        assert(await page.locator("button[type=submit]").isDisabled());
        await page.locator("#email").fill("person@example.invalid");
        assert.equal(
          await page.locator("#email").evaluate((el) => el.checkValidity()),
          true,
        );
        await page.locator("#email").fill("invalid-email");
        assert.equal(
          await page.locator("#email").evaluate((el) => el.checkValidity()),
          false,
        );
        await page.locator("#email").fill("");
        if (route !== "/forgot-password") {
          await page.locator("#password").fill("test-password-only");
          await page.getByRole("button", { name: "Show password" }).click();
          assert.equal(
            await page.locator("#password").getAttribute("type"),
            "text",
          );
          await page.getByRole("button", { name: "Hide password" }).click();
          assert.equal(
            await page.locator("#password").getAttribute("type"),
            "password",
          );
          await page.locator("#password").fill("");
        }
      }
      await page.evaluate(() => document.activeElement?.blur());
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `docs/screenshots/phase-2/${route.slice(1)}-${width}.png`,
          fullPage: true,
        });
      checks.push({
        width,
        route,
        overflow: false,
        privateCache: true,
        logo: "official 3:1",
        state:
          route === "/account"
            ? "setup pending, no personal data"
            : "unconfigured form",
      });
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(origin + "/");
  await Promise.all([
    page.waitForURL("**/sign-in"),
    page.getByRole("link", { name: "Sign In", exact: true }).click(),
  ]);
  assert.equal(new URL(page.url()).pathname, "/sign-in");
  for (const route of [
    "/auth/callback?code=invalid&next=https://evil.invalid",
    "/auth/confirm?token_hash=invalid&type=recovery&next=https://evil.invalid",
  ]) {
    await page.goto(origin + route);
    assert.equal(new URL(page.url()).pathname, "/sign-in");
    assert.equal(new URL(page.url()).hostname, new URL(origin).hostname);
    assert(
      await page
        .getByRole("alert")
        .filter({ hasText: "This link has expired" })
        .isVisible(),
    );
  }
  await page.goto(origin + "/reset-password");
  assert.equal(new URL(page.url()).pathname, "/forgot-password");
  await page.context().addCookies([
    {
      name: "sb-forged-auth-token",
      value: "not-a-valid-session",
      url: origin,
    },
  ]);
  await page.goto(origin + "/account");
  assert.equal(await page.getByRole("button", { name: "Sign Out" }).count(), 0);
  fs.writeFileSync(
    "docs/screenshots/phase-2/results.json",
    JSON.stringify(
      {
        mode: "Unconfigured production build. Hosted authentication and signed-in account are not claimed as tested.",
        checks,
        additional: [
          "Home Sign In link",
          "Password visibility toggle",
          "Native email validation",
          "No-store headers",
          "Invalid token/code failure",
          "External redirect denied",
          "Unconfigured reset guarded",
          "Forged cookie exposes no account data",
        ],
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `PASS: ${checks.length} responsive route checks and auth-navigation/failure checks; screenshots saved.`,
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
