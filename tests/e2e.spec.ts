import { test, expect } from '@playwright/test';

test('Page charge, recherche et cartes visibles', async ({ page }) => {
  await page.goto('/');

  // Hero visible
  await expect(page.getByRole('heading', { name: /Films d'Horreur/i })).toBeVisible();

  // Champ de recherche et saisie
  const input = page.getByPlaceholder('Rechercher un film, réalisateur, genre...');
  await expect(input).toBeVisible();
  await input.fill('Alien');

  // Au moins une carte présente (titre Alien)
  await expect(page.getByText(/Alien/i).first()).toBeVisible();
});

test("add movie button is present and clickable", async ({ page }) => {
    await page.goto("/");
    const addButton = page.getByRole("button", { name: /ajouter le film/i });
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(page).toHaveURL(/\/add/i); // ou l’URL de ta page de création
});



