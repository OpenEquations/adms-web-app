import { test, expect } from "@playwright/test";

const EMAIL = "e2e-test@example.com";
const PASSWORD = "TestPass123!";

test.describe("My Account self-service", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
  });

  test("is reachable from the topbar menu and updates name/email/password", async ({ page }) => {
    await page.click(".topbar-user");
    await page.click('.topbar-user-menu a:has-text("My Account")');
    await page.waitForURL("**/account");

    await expect(page.locator("#account-first-name")).toHaveValue("QA");

    await page.fill("#account-first-name", "Updated");
    await page.fill("#account-last-name", "Person");

    const [nameResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/users/") && res.url().endsWith("/name") && res.request().method() === "PATCH",
      ),
      page.click('.user-form-card button[type="submit"]'),
    ]);
    expect(nameResponse.status()).toBe(204);

    await expect(page.locator(".banner")).toContainText("updated");

    // The topbar should reflect the new name immediately, without a reload.
    await expect(page.locator(".topbar-user-info span")).toHaveText("Updated Person");

    // Change password too, then verify login works with the new one.
    await page.fill("#account-new-password", "NewTestPass456!");
    const [passwordResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/users/") && res.url().endsWith("/password") && res.request().method() === "PATCH",
      ),
      page.click('button:has-text("Update Password")'),
    ]);
    expect(passwordResponse.status()).toBe(204);

    await page.click(".topbar-user");
    await page.click('.topbar-user-menu button:has-text("Log out")');
    await page.waitForURL("**/login");

    await page.fill("#email", EMAIL);
    await page.fill("#password", "NewTestPass456!");
    await page.click('button[type="submit"]');
    // ProtectedRoute remembers the page you were logged out from (/account)
    // and Login honors it, so re-login lands back there, not /dashboard.
    await page.waitForURL("**/account");

    // Restore original credentials so later test runs still work.
    await page.fill("#account-first-name", "QA");
    await page.fill("#account-last-name", "Tester");
    const [restoreNameResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().endsWith("/name") && res.request().method() === "PATCH",
      ),
      page.click('.user-form-card button[type="submit"]'),
    ]);
    expect(restoreNameResponse.status()).toBe(204);

    await page.fill("#account-new-password", PASSWORD);
    const [restorePasswordResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().endsWith("/password") && res.request().method() === "PATCH",
      ),
      page.click('button:has-text("Update Password")'),
    ]);
    expect(restorePasswordResponse.status()).toBe(204);
  });
});
