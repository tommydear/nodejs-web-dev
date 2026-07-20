import express from "express";
import userRoutes from "./route/userRoute.js"
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser";
dotenv.config()
const app = express()

// Add middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB(process.env.MONGODB_URI_1);
        next();
    } catch (err) {
        console.error("Database connection failed:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.use(cors({
    origin: "https://react-dev8.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "DELETE"]
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api", userRoutes)

app.get("/", (req, res) => {
    res.send("Hello, welcome!")
})



if(process.env.NODE_ENV !== "production") {
    app.listen(3000, () => {
        console.log("server is running on port http://localhost:3000")
    })

}





export default app;