require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const budgetTemplateRoutes = require("./routes/budgetTemplateRoutes");
const reportRoutes = require("./routes/reportRoutes");
const Session = require("./models/Session");
const User = require("./models/User");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Root route handler
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FinSavy API" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/budget-templates", budgetTemplateRoutes);
app.use("/api/reports", reportRoutes);

// Authentication middleware
const authenticate = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const session = await Session.findOne({
      session_id: sessionId,
      expires_at: { $gt: new Date() },
      is_revoked: false,
    }).populate("user_id");

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    req.user = { id: session.user_id._id };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Protected route example
app.get("/api/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "firstName lastName email createdAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});
