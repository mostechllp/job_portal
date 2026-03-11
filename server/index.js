// index.js - THIS MUST BE THE VERY FIRST THING
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

// Verify env is loaded
console.log("Server starting with:");
console.log("- EMAIL_USER:", process.env.FROM_EMAIL ? "✅ Loaded" : "❌ Missing");
console.log("- SENDGRID KEY:", process.env.SENDGRID_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("- NODE_ENV:", process.env.NODE_ENV);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));