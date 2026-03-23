const express = require("express");
const cors = require("cors");
const { getAllowedOrigins } = require("./config/env");

const app = express();
const allowedOrigins = getAllowedOrigins();

app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/victims", require("./routes/victimRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/medical", require("./routes/medicalRoutes"));
app.use("/api/distribution", require("./routes/distributionRoutes"));

module.exports = app;
