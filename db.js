const Database = require('better-sqlite3');
const db = new Database('porto.db');

// Buat tabel kalau belum ada
db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    tech TEXT,
    image TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();
module.exports = db;
