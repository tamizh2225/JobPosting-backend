const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/jobs  (with simple filters)
router.get("/", async (req, res) => {
  try {
    const { q = "", location = "", type = "", min = "", max = "" } = req.query;

    let sql = `SELECT * FROM jobs WHERE 1=1`;
    const params = {};
    if (q) {
      sql += ` AND (title LIKE :q OR company LIKE :q)`;
      params.q = `%${q}%`;
    }
    if (location) {
      sql += ` AND location = :location`;
      params.location = location;
    }
    if (type) {
      sql += ` AND job_type = :type`;
      params.type = type;
    }
    if (min) {
      sql += ` AND (min_salary IS NULL OR min_salary >= :min)`;
      params.min = Number(min);
    }
    if (max) {
      sql += ` AND (max_salary IS NULL OR max_salary <= :max)`;
      params.max = Number(max);
    }
    sql += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query({ sql, namedPlaceholders: true }, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (e) {
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
      requirements,
      responsibilities,
      deadline,
    } = req.body;

    if (!title || !company || !location || !job_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO jobs 
       (title, company, location, job_type, min_salary, max_salary, description, requirements, responsibilities, deadline)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        title,
        company,
        location,
        job_type,
        min_salary || null,
        max_salary || null,
        description || null,
        requirements || null,
        responsibilities || null,
        deadline || null,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create job" });
  }
});

module.exports = router;
