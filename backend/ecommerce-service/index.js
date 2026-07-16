import express from "express"
import dotenv from "dotenv";
import db from "./src/config/db.js"
import cors from 'cors'
import categoryRoutes from './src/modules/categories/category.routes.js'

dotenv.config();
const app=express();

await db();

app.use(cors())
app.use(express.json());

app.use("/api/v1/category", categoryRoutes);

app.get("/",(req,res)=>{
   res.send("API running")
  }); 

const PORT = process.env.PORT || 5001;
app.listen(PORT,()=>{
    console.log(`Server running successfully on ${PORT}`)
})
