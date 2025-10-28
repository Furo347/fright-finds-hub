import { test, expect, request } from "@playwright/test";

test("Ajout d’un nouveau film via le formulaire admin", async ({ page, request }) => {
    // 1️⃣ Récupérer un vrai token JWT depuis ton back
    const res = await request.post("/api/login", {
        data: { username: "admin", password: "password" },
    });
    const body = await res.json();
    const token = body.token;

    // 2️⃣ Sauvegarder ce token dans le localStorage du navigateur
    await page.goto("/");
    await page.evaluate((t) => localStorage.setItem("token", t), token);
    await page.reload();

    // 3️⃣ Vérifier que le formulaire est visible
    await expect(page.locator("input#title")).toBeVisible();

    // 4️⃣ Remplir le formulaire
    await page.fill("#title", "Test Movie Admin");
    await page.fill("#year", "2025");
    await page.fill("#director", "Playwright");
    await page.fill("#rating", "9.2");
    await page.fill("#genre", "Psychologique");
    await page.fill("#synopsis", "Un film généré par Playwright");
    await page.fill("#imageUrl", "https://storage.googleapis.com/fright-finds-hub-images/alien.jpg");

    // 5️⃣ Ajouter le film
    await page.getByRole("button", { name: /ajouter le film/i }).click();

    // 6️⃣ Vérifier qu’il apparaît
    await expect(page.locator("text=Test Movie Admin")).toBeVisible({ timeout: 8000 });
});
