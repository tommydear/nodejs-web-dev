import express from "express";
import userRoutes from "./route/userRoute.js"
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser";
dotenv.config()
const app = express()


connectDB(process.env.MONGODB_URI_1).then(() => console.log("Database connected")).catch((err) => console.log(err))
app.use(cors({
    origin: "http://localhost:5173",
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