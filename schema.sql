-- run this in MySQL
CREATE DATABASE IF NOT EXISTS job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE job_portal;

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  company VARCHAR(120) NOT NULL,
  location VARCHAR(120) NOT NULL,
  job_type ENUM('Full-time','Part-time','Contract','Internship') NOT NULL,
  min_salary INT DEFAULT NULL,
  max_salary INT DEFAULT NULL,
  description TEXT,
  requirements TEXT,
  responsibilities TEXT,
  deadline DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
