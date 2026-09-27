import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('responsive layouts, images, reduced motion and accessibility', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Süße Momente.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.cursor')).toBeHidden();
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `test-results/site-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('mobile navigation and persistent language switch without reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { window.testPageIdentity = 'same-document'; });
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText('Sweet moments.Made withlove.');
  expect(await page.evaluate(() => window.testPageIdentity)).toBe('same-document');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('link', { name: 'Our café', exact: true }).click();
  await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole('button', { name: 'DE', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Süße Momente.');
});

test('menu, lightbox navigation, zoom, Escape and legal placeholders', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Süßes', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Getränke', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Milchshakes');
  await page.locator('[data-open-menu]').first().click();
  await expect(page.locator('#lightbox')).toBeVisible();
  await page.getByRole('button', { name: 'Bild vergrößern', exact: true }).click();
  await expect(page.locator('.lightbox-image-wrap')).toHaveClass(/zoomed/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toBeVisible();
  await expect(page.locator('[data-open-menu]').first()).toBeFocused();
  await page.locator('[data-gallery="0"]').click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#image-count')).toHaveText('2 / 5');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Impressum (Platzhalter)' }).click();
  await expect(page.locator('#legal-dialog')).toContainText('kein vollständiges Impressum');
  await page.keyboard.press('Escape');
});

test('WhatsApp flow validates fields and constructs correct message without sending', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { window.open = (url, target, features) => { window.capturedWhatsApp = { url, target, features }; }; });
  await page.getByRole('button', { name: 'Per WhatsApp senden' }).click();
  expect(await page.evaluate(() => window.capturedWhatsApp)).toBeUndefined();
  await page.getByLabel('Dein Name').fill('Léa & Max');
  await page.getByLabel('Deine Nachricht').fill('Hallo! Eine Frage zur Torte 🍰');
  await page.getByRole('button', { name: 'Per WhatsApp senden' }).click();
  const captured = await page.evaluate(() => window.capturedWhatsApp);
  const url = new URL(captured.url);
  expect(url.origin + url.pathname).toBe('https://wa.me/4915122224583');
  expect(url.searchParams.get('text')).toBe('Hallo Svetlana Cakes & Café, ich bin Léa & Max.\n\nHallo! Eine Frage zur Torte 🍰');
  expect(captured.features).toBe('noopener,noreferrer');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['svetlana-language']);
});
