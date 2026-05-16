require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const miscRoutes = require("./routes/misc");
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./utils/openapi');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Swagger 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many auth attempts, please try again later." },
});

app.use(limiter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// Routes
app.use("/", authRoutes); // /register, /login
app.use("/notes", notesRoutes);
app.use("/", miscRoutes); // /about, /openapi.json

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Docs: http://localhost:${PORT}/openapi.json`);
});

module.exports = app;
