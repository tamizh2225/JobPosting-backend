const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS configuration for local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://job-posting-tamizh-project.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// API routes
app.use("/api/jobs", require("./routes/jobs"));

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on port ${port}`));
