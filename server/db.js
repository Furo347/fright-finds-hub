import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import pgPkg from "pg";

const { Pool } = pgPkg;

const POSTGRES_URL = process.env.DB_URL || process.env.DATABASE_URL;
const USE_PG = Boolean(POSTGRES_URL);

// --- Schema definition shared between engines ---
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    director TEXT NOT NULL,
    rating REAL NOT NULL,
    genre TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    imageUrl TEXT NOT NULL
  );
`;

// --- Postgres adapter ---
let pgPool = null;
async function initPostgres() {
  pgPool = new Pool({ connectionString: POSTGRES_URL, max: 5 });
  // ensure schema
  await pgPool.query(createTableSQL.replace("SERIAL", "SERIAL"));
}

// --- SQLite adapter (fallback) ---
let sqliteDb = null;
function initSqlite() {
  const dbFile = path.join(process.cwd(), "server", "data.sqlite");
  sqliteDb = new Database(dbFile);
  sqliteDb.exec(
    createTableSQL
      .replace("SERIAL PRIMARY KEY", "INTEGER PRIMARY KEY AUTOINCREMENT")
  );
  return sqliteDb;
}

// --- Public API (engine-agnostic) ---
export async function initDb() {
  if (USE_PG) {
    await initPostgres();
  } else {
    initSqlite();
  }
}

export async function seedIfEmpty() {
  const jsonPath = path.join(process.cwd(), "server", "movies.json");
  if (!fs.existsSync(jsonPath)) return;
  const items = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const count = await countMovies();
  if (count > 0) return;
  for (const row of items) {
    // simple sequential insert to keep code straightforward
    await queries.insert(row.title, row.year, row.director, row.rating, row.genre, row.synopsis, row.imageUrl);
  }
}

async function countMovies() {
  if (USE_PG) {
    const r = await pgPool.query("SELECT COUNT(1) AS c FROM movies");
    return Number(r.rows[0].c);
  } else {
    return sqliteDb.prepare("SELECT COUNT(1) as c FROM movies").get().c;
  }
}

export const queries = {
  list: async () => {
    if (USE_PG) {
      const r = await pgPool.query("SELECT * FROM movies ORDER BY id DESC");
      return r.rows;
    }
    return sqliteDb.prepare("SELECT * FROM movies ORDER BY id DESC").all();
  },
  get: async (id) => {
    if (USE_PG) {
      const r = await pgPool.query("SELECT * FROM movies WHERE id = $1", [id]);
      return r.rows[0] || null;
    }
    return sqliteDb.prepare("SELECT * FROM movies WHERE id = ?").get(id) || null;
  },
  insert: async (title, year, director, rating, genre, synopsis, imageUrl) => {
    if (USE_PG) {
      const r = await pgPool.query(
        `INSERT INTO movies (title, year, director, rating, genre, synopsis, imageUrl)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, year, director, rating, genre, synopsis, imageUrl]
      );
      return r.rows[0];
    }
    const info = sqliteDb
      .prepare(
        `INSERT INTO movies (title, year, director, rating, genre, synopsis, imageUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(title, year, director, rating, genre, synopsis, imageUrl);
    return sqliteDb.prepare("SELECT * FROM movies WHERE id = ?").get(info.lastInsertRowid);
  },
  delete: async (id) => {
    if (USE_PG) {
      await pgPool.query("DELETE FROM movies WHERE id = $1", [id]);
      return true;
    }
    sqliteDb.prepare("DELETE FROM movies WHERE id = ?").run(id);
    return true;
  },
};

export default {
  initDb,
  seedIfEmpty,
  queries,
};


