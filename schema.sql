-- backend/schema.sql  (SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL, -- values: 'Full-time','Part-time','Contract','Internship'
  min_salary INTEGER,
  max_salary INTEGER,
  description TEXT,
  deadline TEXT,            -- store date as 'YYYY-MM-DD'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
