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
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    console.log(`[CORS Check] Request Origin: ${origin}`);
    
    // In development mode, allow any origin to avoid local environment blocks
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    
    // In production, strictly check the allowed origins list
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connectSrc": [
        "'self'",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:5173",
        "http://localhost:3000",
        process.env.FRONTEND_URL
      ].filter(Boolean),
    },
  },
}));
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