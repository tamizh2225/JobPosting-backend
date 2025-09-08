// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-posting-frontend-sooty.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// routes
app.use("/api/jobs", require("./routes/jobs"));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
