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

test('Formulaire Ajouter le film présent', async ({ page }) => {
  await page.goto('/');
  // Bouton ajouter le film visible
  await expect(page.getByRole('button', { name: /Ajouter le film/i })).toBeVisible();
});


