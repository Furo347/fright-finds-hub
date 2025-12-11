import { test, expect } from "@playwright/test";

test("Ajout d’un nouveau film via le formulaire admin", async ({ page, request }) => {
    // use backend direct URL for login to avoid proxy issues in CI
    const loginUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const res = await request.post(`${loginUrl}/api/login`, {
        data: { username: "admin", password: "password" },
    });

    if (!res.ok()) {
        const txt = await res.text();
        console.error('Login failed:', res.status(), txt);
        throw new Error(`Login failed: ${res.status()}`);
    }

    const body = await res.json();
    const token = body.token;

    await page.goto("/");
    // store token under the key the frontend expects
    await page.evaluate((t) => localStorage.setItem("auth_token", t), token);
    await page.reload();

    await expect(page.locator("input#title")).toBeVisible();

    await page.fill("#title", "Test Movie Admin");
    await page.fill("#year", "2025");
    await page.fill("#director", "Playwright");
    await page.fill("#rating", "9.2");
    await page.fill("#genre", "Psychologique");
    await page.fill("#synopsis", "Un film généré par Playwright");
    await page.fill("#imageUrl", "https://storage.googleapis.com/fright-finds-hub-images/alien.jpg");

    await page.getByRole("button", { name: /ajouter le film/i }).click();

    await expect(page.locator("text=Test Movie Admin")).toBeVisible({ timeout: 10000 });
});
