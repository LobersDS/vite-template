import { test, expect } from '@playwright/test';

test.describe('smoke test — markdown rendering', () => {
  test('renders h1 heading from markdown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Smoke Test');
  });

  test('renders bold text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('strong')).toBeVisible();
  });

  test('renders list items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('li').first()).toBeVisible();
  });
});

test.describe('smoke test — Vue reactivity', () => {
  test('renders counter button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Count: 0' })).toBeVisible();
  });

  test('counter increments on click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Count: 0' }).click();
    await expect(page.getByRole('button', { name: 'Count: 1' })).toBeVisible();
  });
});
