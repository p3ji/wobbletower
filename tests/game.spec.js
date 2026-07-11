const { test, expect } = require('@playwright/test');

test.describe('Wobbleton Game', () => {
  test('should load the home screen and handle errors', async ({ page }) => {
    // Collect any page errors during load or interaction
    const errors = [];
    page.on('pageerror', (err) => errors.push(err));

    await page.goto('/index.html');
    
    // Expect the Wobbleton title to be present
    await expect(page.locator('h1', { hasText: 'Wobbleton' }).first()).toBeVisible();
    
    // Verify home screen modal is visible
    const homeScreen = page.locator('#homeScreen');
    await expect(homeScreen).toBeVisible();

    // Select Creative Mode
    const creativeBtn = page.locator('#homeScreen .modal-btn', { hasText: 'Creative Mode' });
    await creativeBtn.click();

    // Verify home screen hides
    await expect(homeScreen).toBeHidden();

    // Check that there were no JS exceptions
    expect(errors).toHaveLength(0);
  });

  test('should toggle to Survival Mode properly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Select Survival Mode from home screen
    const survivalBtn = page.locator('#homeScreen .modal-btn', { hasText: 'Survival Mode' });
    await survivalBtn.click();
    
    // Verify money span becomes visible
    const moneySpan = page.locator('#moneySpan');
    await expect(moneySpan).toBeVisible();
    
    // Verify it says 100 initially
    const statMoney = page.locator('#statMoney');
    await expect(statMoney).toHaveText('100');

    // Verify next disaster box is visible
    const survivalDisaster = page.locator('#survivalDisaster');
    await expect(survivalDisaster).toBeVisible();
  });

  test('should open and close the Settings modal', async ({ page }) => {
    await page.goto('/index.html');
    
    // Skip home screen
    await page.locator('#homeScreen .modal-btn', { hasText: 'Creative Mode' }).click();

    // Click the gear icon
    const settingsBtn = page.locator('#settingsBtn');
    await settingsBtn.click();

    // Expect the settings modal to appear
    const settingsScreen = page.locator('#settingsScreen');
    await expect(settingsScreen).toBeVisible();

    // Close the settings modal
    const closeBtn = page.locator('#closeSettingsBtn');
    await closeBtn.click();
    await expect(settingsScreen).toBeHidden();
  });
});
