const pool = require("./db");

async function seed() {
  try {
    await pool.query(`
      INSERT INTO jobs (title, company, location, job_type, min_salary, max_salary, description, requirements, responsibilities, deadline)
      VALUES 
      ('Frontend Developer', 'TechCorp', 'Chennai', 'Full-time', 25000, 40000, 'Develop UI using React', 'HTML, CSS, React', 'Build responsive apps', '2025-10-30'),
      ('Backend Developer', 'Innovatech', 'Bangalore', 'Full-time', 30000, 50000, 'Build APIs using Node.js', 'Node.js, Express, MySQL', 'Develop backend services', '2025-11-15');
    `);

    console.log("✅ Seed data inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
