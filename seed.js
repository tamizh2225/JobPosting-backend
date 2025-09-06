// backend/seed.js
const db = require("./db");

async function seed() {
  try {
    // clear old data
    await db.run("DELETE FROM jobs");
    await db.run("DELETE FROM sqlite_sequence WHERE name='jobs'");

    // insert sample jobs
    const jobs = [
      {
        title: "Frontend Developer",
        company: "TechSoft",
        location: "Chennai",
        job_type: "Full-Time",
        min_salary: 30000,
        max_salary: 60000,
        description: "Work on modern React-based web apps.",
        deadline: "2025-12-31",
      },
      {
        title: "Backend Developer",
        company: "DataWorks",
        location: "Bangalore",
        job_type: "Part-Time",
        min_salary: 25000,
        max_salary: 50000,
        description: "Develop secure APIs with Node.js & SQLite.",
        deadline: "2025-11-30",
      },
      {
        title: "UI/UX Designer",
        company: "CreativeHub",
        location: "Remote",
        job_type: "Contract",
        min_salary: 20000,
        max_salary: 40000,
        description: "Design beautiful interfaces for web apps.",
        deadline: "2025-10-15",
      },
      {
        title: "Intern Software Engineer",
        company: "NextGen Solutions",
        location: "Hyderabad",
        job_type: "Internship",
        min_salary: 10000,
        max_salary: 15000,
        description: "Assist in coding and testing software modules.",
        deadline: "2025-09-30",
      },
    ];

    for (const job of jobs) {
      await db.run(
        `INSERT INTO jobs 
         (title, company, location, job_type, min_salary, max_salary, description, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          job.title,
          job.company,
          job.location,
          job.job_type,
          job.min_salary,
          job.max_salary,
          job.description,
          job.deadline,
        ]
      );
    }

    console.log("✅ Database seeded with sample jobs!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
