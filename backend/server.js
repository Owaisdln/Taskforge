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
    
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.up.railway.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
// Ensure preflight OPTIONS requests are handled for all routes
app.options("/*path", cors());
const isDev = process.env.NODE_ENV !== "production";

app.use(helmet({
  contentSecurityPolicy: isDev
    ? false  // Disable CSP entirely in development — no cross-port blocking
    : {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "blob:"],
          fontSrc: ["'self'"],
          connectSrc: [
            "'self'",
            "http://localhost:5000",
            "https://*.up.railway.app",
            process.env.FRONTEND_URL
          ].filter(Boolean),
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"]
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
const fs = require("fs");

// Serve the built React frontend if it exists (works on Railway regardless of NODE_ENV)
const distIndexPath = path.resolve(__dirname, "../frontend/dist/index.html");
const isFrontendBuilt = fs.existsSync(distIndexPath);

if (isFrontendBuilt) {
  // Serve static assets with aggressive caching (Vite hashes filenames)
  app.use(express.static(path.join(__dirname, "../frontend/dist"), {
    maxAge: "1y",
    etag: true
  }));

  // SPA catch-all: any non-API route serves index.html so React Router handles it
  // This fixes page reloads on /login, /signup, /dashboard, etc.
  app.use((req, res) => {
    res.sendFile(distIndexPath);
  });
} else {
  // No built frontend (local dev without running npm run build)
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Task Forge API is running..."
    });
  });

  // 404 handler for unknown API routes in dev
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