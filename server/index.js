import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dbModule, { queries, seedIfEmpty, initDb, migrateImageUrlsToGcs } from "./db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirnameResolved = path.resolve();

app.use(cors());
app.use(express.json());

// Note: movies are managed in the database via queries; no file-based data anymore.

// Initialize DB and seed initial dataset (first run only), then migrate image URLs
await initDb();
await seedIfEmpty();
await migrateImageUrlsToGcs();

// --- Auth helpers ---
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "password";

function requireAdmin(req, res, next) {
  try {
    const header = req.headers["authorization"] || "";
    const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/movies", async (_req, res) => {
  const rows = await queries.list();
  res.json(rows);
});

app.post("/api/movies", requireAdmin, async (req, res) => {
  const toInt = (v) => (typeof v === "string" ? parseInt(v, 10) : v);
  const toFloat = (v) => (typeof v === "string" ? parseFloat(v) : v);
  const schema = z.object({
    title: z.string().min(1),
    year: z.preprocess(toInt, z.number().int().min(1888)),
    director: z.string().min(1),
    rating: z.preprocess(toFloat, z.number().min(0).max(10)),
    genre: z.string().min(1),
    synopsis: z.string().min(1),
    imageUrl: z.string().url().min(1),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid payload", details: parse.error.flatten() });
  }
  const { title, year, director, rating, genre, synopsis, imageUrl } = parse.data;
  const created = await queries.insert(title, year, director, rating, genre, synopsis, imageUrl);
  res.status(201).json(created);
});

app.delete("/api/movies/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  const existing = await queries.get(id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  await queries.delete(id);
  res.status(204).end();
});

// Serve built client in production
const distDir = path.join(__dirnameResolved, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


