import express from "express"
import dotenv from "dotenv";
import db from "./src/config/db.js"
import cors from 'cors'
import authRoutes from "./src/modules/auth/auth.routes.js"
import errorHandler from "./src/middleware/error.middleware.js";

dotenv.config();
const app=express();

await db();

app.use(cors())
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);

app.get("/",(req,res)=>{
   res.send("API running")
  }); 

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running successfully on ${PORT}`)
})
