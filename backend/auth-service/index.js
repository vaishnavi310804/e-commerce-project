import express from "express"
import db from "./src/config/db.js"
import cors from 'cors'
import authRoutes from "./src/modules/auth/auth.routes.js"
import notificationRoutes from "./src/modules/notification/notification.routes.js";
import roleRoutes from "./src/modules/roles/role.routes.js";
import { seedDefaultRoles } from "./src/config/seedRoles.js";
import errorHandler from "./src/middleware/error.middleware.js";

const app=express();

await db();
await seedDefaultRoles();

app.use(cors())
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/audit-logs", auditLogRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use(errorHandler);

app.get("/",(req,res)=>{
   res.send("API running")
  }); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
