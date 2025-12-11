import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Fright Finds Hub/i, { timeout: 10000 });
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Films d'horreur")).toBeVisible({ timeout: 10000 });
});

test("movie cards are visible", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".movie-card"); // adapte le sélecteur à ton JSX
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
});
