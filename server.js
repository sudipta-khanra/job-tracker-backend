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

// Load environment variables from .env
dotenv.config();

//Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
const allowedOrigins = ["https://job-tracker-frontend-theta.vercel.app"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api", profileRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Job Tracker API");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
