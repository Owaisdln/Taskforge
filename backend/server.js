const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Core Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    app: "Task Forge",
    server: "Running",
    database: "Connected"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

const path = require("path");

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Set static folder with aggressive caching (1 year) since Vite hashes filenames
  app.use(express.static(path.join(__dirname, "../frontend/dist"), {
    maxAge: "1y",
    etag: true
  }));

  // Any route that is not an API route will be redirected to index.html
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  // Root Route (for dev)
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Task Forge API is running..."
    });
  });

  // 404 Handler for dev API routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found"
    });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Task Forge Server running on port ${PORT}`);
});