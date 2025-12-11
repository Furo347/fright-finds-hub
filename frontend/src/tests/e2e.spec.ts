import { test, expect } from '@playwright/test';

test('Page charge, recherche et cartes visibles', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Films d'Horreur/i })).toBeVisible({ timeout: 10000 });

  const input = page.getByPlaceholder('Rechercher un film, réalisateur, genre...');
  await expect(input).toBeVisible({ timeout: 5000 });
  await input.fill('Alien');

  await expect(page.getByText(/Alien/i).first()).toBeVisible({ timeout: 10000 });
});

test("add movie button is present and clickable", async ({ page }) => {
    await page.goto("/");
    const addButton = page.getByRole("button", { name: /ajouter le film/i });
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();
    await expect(page).toHaveURL(/\/add/i, { timeout: 5000 }); // ou l’URL de ta page de création
});
