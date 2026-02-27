# Database Models

ORM: Sequelize (`backend/src/models/index.ts`)

## Table: `movies`
| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| id | INTEGER.UNSIGNED | PK, autoIncrement | Primary key |
| title | STRING | NOT NULL | Movie title |
| director | STRING | nullable | Director name |
| image_url | STRING | nullable | Poster URL |
| rating | FLOAT | nullable | Rating (0-10) |
| year | INTEGER | nullable | Release year |
| summary | TEXT | nullable | Synopsis |

## Table: `admin`
| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| id | INTEGER.UNSIGNED | PK, autoIncrement | Primary key |
| username | STRING | NOT NULL, UNIQUE | Admin username |
| password | STRING | NOT NULL | Hashed password |

## Dialect & Connection
- Default dialect: mysql
- SQLite mode: set `DB_DIALECT=sqlite` and `DB_STORAGE` (ex: `:memory:` for tests)

## Seeds / Init
- `backend/src/initDb.ts` creates tables (alter) and seeds admin + default movies if empty.
- `backend/src/createAdmin.ts` upserts admin from env vars.
