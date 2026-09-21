import { test, expect } from "@playwright/test";

const EMAIL = "e2e-test@example.com";
const PASSWORD = "TestPass123!";

test.describe("Authentication", () => {
  test("logs in with valid credentials and reaches the dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard");
    await expect(page.locator("body")).toContainText("QA");

    const token = await page.evaluate(() => localStorage.getItem("adms.authToken"));
    expect(token).toBeTruthy();
  });

  test("rejects an incorrect password and stays on the login page", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", EMAIL);
    await page.fill("#password", "wrong-password");
    await page.click('button[type="submit"]');

    await expect(page.locator(".banner-error, [role='alert']")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);

    const token = await page.evaluate(() => localStorage.getItem("adms.authToken"));
    expect(token).toBeFalsy();
  });

  test("logs out and blocks access to protected pages", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    await page.click(".sidebar-user, [aria-label='User menu'], .user-menu-trigger");
    await page.click('button:has-text("Log out"), button:has-text("Logout")');

    await page.waitForURL("**/login");

    await page.goto("/dashboard");
    await page.waitForURL("**/login");
  });
});
