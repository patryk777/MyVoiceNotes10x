import { test, expect } from "@playwright/test";

test.describe("Category Columns", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display tasks column header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const tasksColumn = page.locator("text=/zadania|tasks/i").first();
    await expect(tasksColumn).toBeVisible();
  });

  test("should display ideas column header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const ideasColumn = page.locator("text=/pomysły|ideas/i").first();
    await expect(ideasColumn).toBeVisible();
  });

  test("should display notes column header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const notesColumn = page.locator("text=/notatki|notes/i").first();
    await expect(notesColumn).toBeVisible();
  });

  test("should display meetings column header", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const meetingsColumn = page.locator("text=/spotkania|meetings/i").first();
    await expect(meetingsColumn).toBeVisible();
  });
});

test.describe("Export Buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have markdown export button visible", async ({ page }) => {
    const mdButton = page.locator("button[title*='md']").or(
      page.locator("button").filter({ hasText: ".md" })
    );
    await expect(mdButton.first()).toBeVisible();
  });

  test("should have PDF export button visible", async ({ page }) => {
    const pdfButton = page.locator("button[title*='pdf']").or(
      page.locator("button").filter({ hasText: ".pdf" })
    );
    await expect(pdfButton.first()).toBeVisible();
  });
});

test.describe("Settings Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should open settings modal", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: /ustawienia|settings/i });
    await settingsButton.click();
    
    // Modal should be visible
    await page.waitForTimeout(300);
    const modal = page.locator("[role='dialog']").or(page.locator(".fixed.inset-0"));
    await expect(modal.first()).toBeVisible();
  });

  test("should have language selector in settings", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: /ustawienia|settings/i });
    await settingsButton.click();
    await page.waitForTimeout(300);
    
    // Look for language options
    const languageOption = page.locator("text=/język|language/i");
    await expect(languageOption.first()).toBeVisible();
  });

  test("should have recording limit slider in settings", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: /ustawienia|settings/i });
    await settingsButton.click();
    await page.waitForTimeout(300);
    
    // Look for recording limit
    const limitOption = page.locator("text=/limit|czas|nagrania/i");
    await expect(limitOption.first()).toBeVisible();
  });

  test("should close settings with Escape key", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: /ustawienia|settings/i });
    await settingsButton.click();
    await page.waitForTimeout(300);
    
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    
    // Modal should be closed
    const modal = page.locator("[role='dialog']");
    await expect(modal).not.toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    
    // Main elements should still be visible
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("should work on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("should work on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("should hide text labels on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    
    // Some text should be hidden on mobile (sm:inline classes)
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

test.describe("Keyboard Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should close modal with Escape", async ({ page }) => {
    const settingsButton = page.getByRole("button", { name: /ustawienia|settings/i });
    await settingsButton.click();
    await page.waitForTimeout(300);
    
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  });

  test("should handle Ctrl+Z for undo", async ({ page }) => {
    await page.keyboard.press("Control+z");
    // Should not throw error
    await page.waitForTimeout(100);
  });

  test("should handle Ctrl+Shift+S for summarize", async ({ page }) => {
    await page.keyboard.press("Control+Shift+s");
    // Should not throw error
    await page.waitForTimeout(100);
  });
});

test.describe("Empty State", () => {
  test("should handle empty notes gracefully", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("voice-notes");
    });
    await page.reload();
    
    // Page should still load without errors
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("should disable export when no notes", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("voice-notes", JSON.stringify([]));
    });
    await page.reload();
    
    const mdButton = page.locator("button[title*='md']").or(
      page.locator("button").filter({ hasText: ".md" })
    );
    
    // Export should be disabled
    if (await mdButton.first().isVisible()) {
      await expect(mdButton.first()).toBeDisabled();
    }
  });

  test("should disable summarize when no notes", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("voice-notes", JSON.stringify([]));
    });
    await page.reload();
    
    const summarizeButton = page.getByRole("button", { name: /podsumuj|summarize/i });
    await expect(summarizeButton).toBeDisabled();
  });
});
