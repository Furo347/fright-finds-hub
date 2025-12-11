import { test, expect } from "@playwright/test";

test("Ajout d’un nouveau film via le formulaire admin", async ({ page, request }) => {
    const res = await request.post("/api/login", {
        data: { username: "admin", password: "password" },
    });
    const body = await res.json();
    const token = body.token;

    await page.goto("/");
    await page.evaluate((t) => localStorage.setItem("token", t), token);
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

    await expect(page.locator("text=Test Movie Admin")).toBeVisible({ timeout: 8000 });
});
