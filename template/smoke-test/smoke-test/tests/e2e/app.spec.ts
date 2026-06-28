import { test, expect } from '@playwright/test';

test.describe('smoke test — Button component', () => {
  test('renders primary button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Primary button' })).toBeVisible();
  });

  test('renders secondary button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Secondary button' })).toBeVisible();
  });

  test('renders ghost button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Ghost button' })).toBeVisible();
  });

  test('disabled button is disabled', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Disabled button' })).toBeDisabled();
  });
});
