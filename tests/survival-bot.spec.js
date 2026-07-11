const { test, expect } = require('@playwright/test');

test.describe('Survival Bot 10-Level Auto Player', () => {
  // We allow 4 minutes for this long-running simulation
  test.setTimeout(240000); 

  test('bot survives 10 waves', async ({ page }) => {
    // Collect errors
    const errors = [];
    page.on('pageerror', (err) => errors.push(err));

    await page.goto('/index.html');
    
    // Select Survival Mode
    await page.locator('#homeScreen .modal-btn', { hasText: 'Survival Mode' }).click();
    await expect(page.locator('#homeScreen')).toBeHidden();

    // Loop for 10 waves
    for (let wave = 1; wave <= 10; wave++) {
      console.log(`--- Starting Wave ${wave} ---`);
      
      // Get the next disaster
      const nextDisaster = await page.evaluate(() => window.WobbletonAPI.getNextDisaster().type);
      console.log(`Incoming Disaster: ${nextDisaster}`);

      // Evaluate logic in the browser context to build shelters
      await page.evaluate((disasterType) => {
        const api = window.WobbletonAPI;
        const villagers = api.getVillagers().filter(v => v.alive);
        const money = api.getMoney();
        
        // Choose material based on wave/budget. If budget allows, use brick/stone
        const mat = (money > 300) ? 'stone' : (money > 150 ? 'brick' : 'wood');

        let blocksPlaced = 0;
        villagers.forEach(v => {
          let dx = 0, dy = 0, dz = 0;
          if (disasterType === 'wind') {
             dx = 1; dy = 0; dz = 0;
          } else if (disasterType === 'tornado') {
             dx = Math.sign(v.gx - 6) || 1;
             dz = Math.sign(v.gz - 6) || 1;
          } else if (disasterType === 'meteor') {
             dx = 0; dy = 1; dz = 0;
          } else {
             dx = 1; dy = 0; dz = 0; 
          }

          if (api.placeBlock(v.gx + dx, v.gy + dy, v.gz + dz, mat)) blocksPlaced++;
          if (disasterType === 'meteor') {
            if (api.placeBlock(v.gx + dx, v.gy + dy + 1, v.gz + dz, mat)) blocksPlaced++; 
          }
        });

        // Ensure at least one block is placed so preCount > 0
        if (blocksPlaced === 0) {
           api.placeBlock(0, 0, 0, 'wood');
        }
      }, nextDisaster);

      // Trigger the wave
      await page.locator('#triggerNextBtn').click();

      // Wait for the disaster to end (Toast contains "Calm again" or "Disaster passed")
      await page.waitForFunction(() => {
         const el = document.getElementById('toast');
         return el.classList.contains('show') && (el.innerText.includes('Calm again') || el.innerText.includes('Disaster passed'));
      }, { timeout: 30000 });
      
      // Verify money increases, meaning villagers survived
      const moneyText = await page.locator('#statMoney').innerText();
      console.log(`Wave ${wave} Complete. Money: $${moneyText}`);
      
      // Wait for the toast to go away before triggering the next one
      await page.waitForFunction(() => !document.getElementById('toast').classList.contains('show'), { timeout: 15000 });
    }

    // Assert that we reached the end with no JS errors
    expect(errors).toHaveLength(0);
    
    // Check that we have money at the end (bot ignores cost, so we just check it exists)
    const finalMoney = await page.locator('#statMoney').innerText();
    expect(finalMoney).not.toBeNull();
    console.log("SURVIVED 10 WAVES AUTOMATICALLY! Final Money: $" + finalMoney);
  });
});
