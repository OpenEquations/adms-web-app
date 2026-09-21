import { test, expect } from "@playwright/test";

const EMAIL = "e2e-test@example.com";
const PASSWORD = "TestPass123!";
const API_URL = "http://localhost:8081/api";

async function authHeaders(page) {
  const token = await page.evaluate(() => localStorage.getItem("adms.authToken"));
  return { Authorization: `Bearer ${token}` };
}

test.describe("Tender deadline and conclude flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
  });

  test("blocks publishing without a deadline, and allows it once one is set", async ({ page }) => {
    await page.goto("/disposal-requests/new");

    await page.fill("#tender-title", "E2E Deadline Gate Tender");
    await page.fill("#tender-description", "Created by the tender-lifecycle e2e spec");
    await page.selectOption("#tender-type", "SELLING_TENDER");
    // Deliberately leave #tender-deadline blank.

    const [createResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().endsWith("/api/tenders") && res.request().method() === "POST",
      ),
      page.click('button[type="submit"]'),
    ]);
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    expect(created.deadline).toBeNull();

    await page.waitForURL(`**/disposal-requests/${created.id}`);

    // Try to publish without a deadline: blocked client-side, no request fires.
    await page.selectOption("#tender-status-select", "PUBLISHED");
    await page.click('form:has(#tender-status-select) button[type="submit"]');
    await expect(page.locator(".banner-error")).toContainText("Set a deadline");

    const stillNotPublished = await page.request.get(`${API_URL}/tenders/${created.id}`);
    expect((await stillNotPublished.json()).status).toBe("NOT_PUBLISHED");

    // Set a deadline.
    await page.fill("#tender-deadline-input", "2030-01-01T10:00");
    const [deadlineResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes(`/api/tenders/${created.id}/deadline`) && res.request().method() === "PATCH",
      ),
      page.click('form:has(#tender-deadline-input) button[type="submit"]'),
    ]);
    expect(deadlineResponse.status()).toBe(204);
    await expect(page.locator("body")).toContainText("Closes");

    // Publishing now succeeds.
    await page.selectOption("#tender-status-select", "PUBLISHED");
    const [statusResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes(`/api/tenders/${created.id}/status`) && res.request().method() === "PATCH",
      ),
      page.click('form:has(#tender-status-select) button[type="submit"]'),
    ]);
    expect(statusResponse.status()).toBe(204);
    await expect(page.locator("body")).toContainText("Published");

    await page.request.delete(`${API_URL}/tenders/${created.id}`, { headers: await authHeaders(page) });
  });

  test("conclude opens a prompt to pick the winning company before completing", async ({ page }) => {
    const headers = await authHeaders(page);

    const companyResponse = await page.request.post(`${API_URL}/companies`, {
      headers,
      data: { name: "E2E Winner Co", email: "e2e-winner-co@example.com" },
    });
    expect(companyResponse.status()).toBe(201);
    const company = await companyResponse.json();

    const tenderResponse = await page.request.post(`${API_URL}/tenders`, {
      headers,
      data: {
        title: "E2E Conclude Prompt Tender",
        description: "Created by the tender-lifecycle e2e spec",
        type: "SELLING_TENDER",
        deadline: null,
      },
    });
    expect(tenderResponse.status()).toBe(201);
    const tender = await tenderResponse.json();

    await page.goto(`/disposal-requests/${tender.id}`);

    await page.click('button:has-text("Conclude")');
    const modal = page.locator(".modal-card");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Conclude Disposal Request");

    // No company chosen yet: the confirm button stays disabled.
    const confirmButton = modal.locator('button[type="submit"]');
    await expect(confirmButton).toBeDisabled();

    await page.selectOption("#conclude-winner", String(company.id));
    await expect(confirmButton).toBeEnabled();

    const [concludeResponse] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes(`/api/tenders/${tender.id}/conclude`) && res.request().method() === "POST",
      ),
      confirmButton.click(),
    ]);
    expect(concludeResponse.status()).toBe(204);

    await expect(modal).toBeHidden();
    await expect(page.locator("body")).toContainText("Concluded");
    await expect(page.locator("body")).toContainText("E2E Winner Co");

    await page.request.delete(`${API_URL}/tenders/${tender.id}`, { headers });
    await page.request.delete(`${API_URL}/companies/${company.id}`, { headers });
  });
});
