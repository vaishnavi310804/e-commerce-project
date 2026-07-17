import express from "express"
import cors from 'cors'
import db from "./src/config/db.js"
import categoryRoutes from './src/modules/categories/category.routes.js'
import productRoutes from './src/modules/products/product.routes.js'
import wishlistRoutes from './src/modules/wishlist/wishlist.routes.js'
import errorHandler from "./src/middleware/error.middleware.js";

const app=express();

await db();

app.use(cors())
app.use(express.json());

app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes)


app.get("/",(req,res)=>{
   res.send("API running")
  }); 

  app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`Server running successfully on ${PORT}`)
})
