import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('verify custom watermark functionality', async ({ page }) => {
    // Load the local file
    const filePath = 'file://' + path.resolve('dsaw_html');
    await page.goto(filePath);

    // 1. Verify UI elements exist
    await expect(page.locator('#watermark-input')).toBeVisible();
    await expect(page.locator('#watermark-opacity')).toBeVisible();
    await expect(page.locator('#view-custom-watermark')).toBeHidden(); // Hidden by default until upload

    // 2. Simulate Watermark Upload and Opacity Change
    await page.evaluate(() => {
        // Mocking the result of handleWatermarkUpload logic
        const output = document.getElementById('view-custom-watermark');
        const dummyBase64 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><circle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill='red' /></svg>";
        output.src = dummyBase64;
        output.style.display = 'block';

        // Change opacity via slider logic
        const slider = document.getElementById('watermark-opacity');
        slider.value = "0.4";
        // Directly call the update function
        (window as any).updateWatermarkOpacity("0.4");
    });

    // 3. Verify visual state
    const watermark = page.locator('#view-custom-watermark');
    await expect(watermark).toBeVisible();
    await expect(watermark).toHaveCSS('opacity', '0.4');

    // 4. Take screenshot for verification
    await page.screenshot({ path: 'verification_watermark.png', fullPage: true });
});
