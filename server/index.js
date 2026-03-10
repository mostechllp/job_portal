import dotenv from "dotenv"
dotenv.config()
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

connectDB()

app.use("/api/auth", authRoutes)

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))