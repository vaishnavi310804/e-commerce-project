import express from "express";
import cors from 'cors';
import db from "./src/config/db.js";
import categoryRoutes from './src/modules/categories/category.routes.js';
import productRoutes from './src/modules/products/product.routes.js';
import wishlistRoutes from './src/modules/wishlist/wishlist.routes.js';
import cartRoutes from "./src/modules/cart/cart.routes.js";
import errorHandler from "./src/middleware/error.middleware.js";
import addressRoutes from "./src/modules/address/address.routes.js";
import orderRoutes from "./src/modules/orders/order.routes.js"
import reviewRoutes from "./src/modules/reviews/review.routes.js";

const app=express();

await db();

app.use(cors())
app.use(express.json());

app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes)
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/address", addressRoutes)
app.use("/api/v1/order", orderRoutes)
app.use("/api/v1/reviews", reviewRoutes);


app.get("/",(req,res)=>{
   res.send("API running")
  }); 

  app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`Server running successfully on ${PORT}`)
})
