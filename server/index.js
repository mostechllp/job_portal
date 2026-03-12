import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env immediately
dotenv.config({ path: path.join(__dirname, '.env') });

// Now import everything else
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? "https://jobportal-brown-delta.vercel.app" 
    : "http://localhost:5173",
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin/jobs", jobRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  
  // Use error status code if set, otherwise 500
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
