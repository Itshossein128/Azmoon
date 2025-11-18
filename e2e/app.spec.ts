import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:5173/');
  await expect(page.locator('text=Test User')).toBeVisible();

  await page.click('text=مشاهده آزمون‌ها');
  await page.waitForURL('http://localhost:5173/exams');

  await page.click('text=آزمون جامع زبان انگلیسی');
  await page.waitForURL('http://localhost:5173/exams/1');

  await page.click('text=شروع آزمون');
  await page.waitForURL('http://localhost:5173/exam-take/1');

  for (let i = 0; i < 5; i++) {
    await page.click(`button:has-text("${i + 1}")`);
    await page.click('button:has-text("سوال بعد")');
  }

  await page.click('button:has-text("ثبت نهایی")');
  await page.click('button:has-text("بله، ثبت نهایی")');

  await page.waitForURL('http://localhost:5173/results/1');
  await expect(page.locator('text=85%')).toBeVisible();
});
