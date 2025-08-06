import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobsRoutes from "./routes/jobs.js";
import profileRoutes from "./routes/profileRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import uploadRoutes from "./routes/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// 🛡️ Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://job-tracker-frontend-theta.vercel.app", // <-- Add your production frontend here
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight

// 🔧 Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api", profileRoutes);
app.use("/api", uploadRoutes);

// 🖼️ Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔁 Health check route
app.get("/", (req, res) => {
  res.send("Welcome to Job Tracker API");
});

// ❌ Global error handler
app.use(errorHandler);

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
