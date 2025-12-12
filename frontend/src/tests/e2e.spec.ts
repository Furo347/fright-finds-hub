import { test, expect } from '@playwright/test';

const mockMovies = [
  {
    id: 1,
    title: 'Alien',
    year: 1979,
    director: 'Ridley Scott',
    rating: 8.5,
    genre: 'Horreur',
    synopsis: 'Crew encounters a deadly alien.',
    imageUrl: '/assets/alien.jpg',
  },
  {
    id: 2,
    title: 'The Shining',
    year: 1980,
    director: 'Stanley Kubrick',
    rating: 8.4,
    genre: 'Horreur',
    synopsis: 'A man loses his mind in an empty hotel.',
    imageUrl: '/assets/shining.jpg',
  },
];

async function loginAsAdmin(page, request) {
  const loginUrl = process.env.BACKEND_URL || 'http://localhost:3000';
  const res = await request.post(`${loginUrl}/api/login`, { data: { username: 'admin', password: 'password' } });
  if (!res.ok()) throw new Error('Login failed');
  const body = await res.json();
  const token = body.token;
  await page.goto('/');
  await page.evaluate(t => localStorage.setItem('auth_token', t), token);
  await page.reload();
}

test('Page charge, recherche et cartes visibles', async ({ page }) => {
  // Mock the API movies response to make the test stable in CI
  await page.route('**/api/movies', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockMovies),
  }));

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Films d'Horreur/i })).toBeVisible({ timeout: 10000 });

  const input = page.getByPlaceholder('Rechercher un film, réalisateur, genre...');
  await expect(input).toBeVisible({ timeout: 5000 });
  await input.fill('Alien');

  // Wait for the mocked movie to appear
  await expect(page.getByText(/Alien/i).first()).toBeVisible({ timeout: 10000 });
});

test("add movie button is present and clickable", async ({ page, request }) => {
    // Mock movies for stability
    await page.route('**/api/movies', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMovies),
    }));

    await loginAsAdmin(page, request);
    const addButton = page.getByRole("button", { name: /ajouter le film/i });
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();

    // Instead of asserting a strict URL, check that a form field for adding a movie is visible
    const titleField = page.getByPlaceholder('Titre');
    await expect(titleField).toBeVisible({ timeout: 5000 });
});
