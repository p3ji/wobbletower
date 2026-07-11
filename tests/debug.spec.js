const { test, expect } = require('@playwright/test');

test('debug load', async ({ page }) => {
  await page.goto('/index.html');
  const html = await page.content();
  console.log("HTML:", html.substring(0, 1000));
  
  const buttons = await page.locator('#homeScreen .modal-btn').allTextContents();
  console.log("Buttons found:", buttons);
});
