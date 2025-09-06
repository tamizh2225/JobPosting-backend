// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const DB_PATH = path.resolve(__dirname, "database.sqlite");
const SCHEMA_PATH = path.resolve(__dirname, "schema.sql");

// open DB (will create file if missing)
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to open SQLite DB:", err.message);
  } else {
    console.log("Connected to SQLite DB:", DB_PATH);
  }
});

// Initialize schema once (reads schema.sql and runs exec)
const init = () => {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.warn("Schema file not found:", SCHEMA_PATH);
    return;
  }
  const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
  db.exec(schema, (err) => {
    if (err) {
      console.error("Error initialising DB schema:", err.message);
    } else {
      console.log("SQLite schema applied (schema.sql)");
    }
  });
};
init();

// Promise-based helpers
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

module.exports = { run, all, get, db };
