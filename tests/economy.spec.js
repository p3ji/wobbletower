const { test, expect } = require('@playwright/test');

test.describe('Wobbleton Economy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8765');
    // Select Survival Mode
    await page.locator('#homeScreen .modal-btn', { hasText: 'Survival Mode' }).click();
    await expect(page.locator('#homeScreen')).toBeHidden();
  });

  test('UI placement and undo refunds', async ({ page }) => {
    await expect(page.locator('#statMoney')).toHaveText('100');
    
    // Select Straw (costs 5)
    await page.locator('.mat[data-mat="straw"]').click();

    // Move mouse over canvas center and click
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    await page.waitForTimeout(300);
    // Should be 95
    await expect(page.locator('#statMoney')).toHaveText('95');

    // Undo refunds half: Math.floor(5/2) = 2. 95 + 2 = 97
    await page.locator('#undoBtn').click();
    await page.waitForTimeout(300);
    // Should be 97
    await expect(page.locator('#statMoney')).toHaveText('97');
  });

  test('eraser refunds money', async ({ page }) => {
    // Select Wood (15)
    await page.locator('.mat[data-mat="wood"]').click();
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    
    await page.waitForTimeout(300);
    await expect(page.locator('#statMoney')).toHaveText('85');

    // Click eraser
    await page.locator('#eraser').click();
    // Click block to erase
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

    await page.waitForTimeout(300);
    // Erasing refunds half: Math.floor(15/2) = 7. 85 + 7 = 92
    await expect(page.locator('#statMoney')).toHaveText('92');
  });

  test('cannot place block without funds', async ({ page }) => {
    // We start with 100
    // Buy 1 Stone (80)
    await page.evaluate(() => window.WobbletonAPI.placeBlock(0,0,0,'stone'));
    // Buy 1 Glass (20)
    await page.evaluate(() => window.WobbletonAPI.placeBlock(1,0,0,'glass'));
    
    // Now money is 0
    await expect(page.locator('#statMoney')).toHaveText('0');
    
    // Try to buy Wood (15)
    await page.locator('.mat[data-mat="wood"]').click();
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    
    await page.waitForTimeout(300);
    // Should still be 0, and a toast should say "Not enough funds!"
    await expect(page.locator('#statMoney')).toHaveText('0');
    await expect(page.locator('#toast')).toContainText('Not enough funds!');
  });
});
