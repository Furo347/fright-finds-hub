import { spawn } from "node:child_process";
import process from "node:process";

const PORT = process.env.SMOKE_PORT || "3100";
const BASE = `http://localhost:${PORT}`;

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function waitForHealth(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      if (r.ok) return;
    } catch {}
    await delay(500);
  }
  throw new Error("Timeout en attente de /api/health");
}

async function run() {
  console.log("[smoke] Démarrage du serveur en arrière-plan...");
  const child = spawn("node", ["server/index.js"], {
    env: { ...process.env, PORT, NODE_ENV: "test" },
    stdio: "inherit",
  });

  try {
    await waitForHealth();
    console.log("[smoke] /api/health OK");

    const payload = {
      title: "SMOKE_TEST_MOVIE",
      year: 1999,
      director: "Smoke Bot",
      rating: 6.6,
      genre: "Test",
      synopsis: "Smoke test entry",
      imageUrl: "https://storage.googleapis.com/fright-finds-hub-images/alien.jpg",
    };

    const createRes = await fetch(`${BASE}/api/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!createRes.ok) throw new Error(`POST /api/movies failed: ${createRes.status}`);
    const created = await createRes.json();
    console.log("[smoke] Créé:", created.id);

    const listRes = await fetch(`${BASE}/api/movies`);
    if (!listRes.ok) throw new Error("GET /api/movies failed");
    const list = await listRes.json();
    const found = list.find((m) => m.id === created.id);
    if (!found) throw new Error("Élément inséré introuvable dans la liste");
    console.log("[smoke] Présent dans la liste ✔");

    const delRes = await fetch(`${BASE}/api/movies/${created.id}`, { method: "DELETE" });
    if (delRes.status !== 204) throw new Error(`DELETE échoué: ${delRes.status}`);
    console.log("[smoke] Suppression OK ✔");

    console.log("[smoke] Succès ✅");
  } catch (e) {
    console.error("[smoke] Échec ❌", e);
    process.exitCode = 1;
  } finally {
    child.kill();
  }
}

run();


