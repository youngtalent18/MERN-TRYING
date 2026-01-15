import express from 'express';
import cors from "cors";
import authRoute from "./routes/authRoute.js"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000

app.use("/api/auth", authRoute);


connectDB().then(()=>{
    app.listen(8000,()=>{
        console.log(`Server is running on port ${port}`);
    });
})