// backend/routes/jobs.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper to normalize query params safely
const parseNumber = (v) => {
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

// GET /api/jobs  (filters: q, location, type, salary)
router.get("/", async (req, res) => {
  try {
    const { q = "", location = "", type = "", salary = "" } = req.query;

    let sql = `SELECT * FROM jobs WHERE 1=1`;
    const params = [];

    if (q) {
      sql += ` AND (title LIKE ? OR company LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }
    if (location) {
      sql += ` AND location LIKE ?`;
      params.push(`%${location}%`);
    }
    if (type) {
      sql += ` AND job_type = ?`;
      params.push(type);
    }
    if (salary) {
      const s = parseNumber(salary) || 0;
      sql += ` AND (max_salary IS NOT NULL AND max_salary >= ?)`;
      params.push(s);
    }

    sql += ` ORDER BY created_at DESC`;

    const rows = await db.all(sql, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const row = await db.get("SELECT * FROM jobs WHERE id = ?", [
      req.params.id,
    ]);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

// POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      job_type,
      min_salary,
      max_salary,
      description,
      deadline,
    } = req.body;

    if (!title || !company || !location || !job_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await db.run(
      `INSERT INTO jobs
       (title, company, location, job_type, min_salary, max_salary, description, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        company,
        location,
        job_type,
        min_salary ?? null,
        max_salary ?? null,
        description ?? null,
        deadline ?? null,
      ]
    );

    const newJob = await db.get("SELECT * FROM jobs WHERE id = ?", [
      result.lastID,
    ]);
    res.status(201).json(newJob);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create job" });
  }
});

module.exports = router;
