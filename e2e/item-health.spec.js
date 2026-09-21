import { test, expect } from "@playwright/test";

const EMAIL = "e2e-test@example.com";
const PASSWORD = "TestPass123!";

test.describe("Item health tracking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
  });

  test("creates an item, quick-updates its health, and logs the reading in history", async ({ page }) => {
    await page.goto("/items/new");

    await page.fill("#item-name", "E2E Health Spec Item");
    await page.fill("#item-description", "Created by the item-health e2e spec");
    await page.selectOption("#item-status", "IN_USE");
    await page.selectOption("#item-type", "ELECTRONICS");
    await page.fill("#item-health", "80");

    const [createResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().endsWith("/api/items") && res.request().method() === "POST",
      ),
      page.click('button[type="submit"]'),
    ]);
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();

    await page.waitForURL("**/items");

    // Quick-update health directly from the Items table, without the full edit form.
    const healthButton = page.locator(".item-health-button", { hasText: "80%" });
    await expect(healthButton).toBeVisible();
    await healthButton.click();

    const modal = page.locator(".modal-card");
    await expect(modal).toBeVisible();

    await page.fill(".update-health-number", "40");

    const [patchResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes(`/api/items/${created.id}/health`) && res.request().method() === "PATCH",
      ),
      page.click('.modal-card button[type="submit"]'),
    ]);
    expect(patchResponse.status()).toBe(204);

    await expect(modal).toBeHidden();
    await expect(page.locator(".item-health-button", { hasText: "40%" })).toBeVisible();

    // The health-history page should show both the initial reading and the update.
    await page.goto(`/items/${created.id}/health-history`);

    await expect(page.locator("body")).toContainText("40%");
    await expect(page.locator("body")).toContainText("80%");

    const historyResponse = await page.request.get(
      `http://localhost:8081/api/items/${created.id}/health-history`,
      { headers: { Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem("adms.authToken"))}` } },
    );
    const history = await historyResponse.json();
    expect(history.map((entry) => entry.health)).toEqual([80, 40]);

    // Cleanup: delete the item this test created so it doesn't linger in real data.
    await page.goto("/items");
    const row = page.locator("tr", { hasText: "E2E Health Spec Item" });
    await row.locator("[aria-label*='Actions']").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.click('button:has-text("Delete")');
    await expect(page.locator("tr", { hasText: "E2E Health Spec Item" })).toHaveCount(0);
  });
});
