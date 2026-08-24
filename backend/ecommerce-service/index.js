import express from "express";
import cors from 'cors';
import db from "./src/config/db.js";
import categoryRoutes from './src/modules/categories/category.routes.js';
import productRoutes from './src/modules/products/product.routes.js';
import wishlistRoutes from './src/modules/wishlist/wishlist.routes.js';
import cartRoutes from "./src/modules/cart/cart.routes.js";
import errorHandler from "./src/middleware/error.middleware.js";
import addressRoutes from "./src/modules/address/address.routes.js";
import orderRoutes from "./src/modules/orders/order.routes.js";
import reviewRoutes from "./src/modules/reviews/review.routes.js";
import customerRoutes from "./src/modules/customers/customer.routes.js";
import dashboardRoutes from "./src/modules/dashboard/dashboard.routes.js";
import PaymentRoutes from "./src/modules/payment/payment.routes.js";
import shipmentRoutes from "./src/modules/shipment/shipment.routes.js";
import returnRoutes from "./src/modules/returns/return.routes.js";
import ticketRoutes from "./src/modules/tickets/ticket.routes.js";
import { checkTicketSlaService } from "./src/modules/tickets/ticket.service.js";

const app = express();

await db();

// Periodically check ticket SLA deadlines (every 15 minutes)
const SLA_CHECK_INTERVAL_MS = 15 * 60 * 1000;

const startSlaScheduler = () => {
  checkTicketSlaService().catch((err) =>
    console.error("SLA Startup Check Error:", err),
  );

  setInterval(() => {
    checkTicketSlaService().catch((err) =>
      console.error("SLA Interval Check Error:", err),
    );
  }, SLA_CHECK_INTERVAL_MS);
};

startSlaScheduler();

app.use(cors());
app.use(express.json());

app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/payment", PaymentRoutes);
app.use("/api/v1/shipment", shipmentRoutes);
app.use("/api/v1/return", returnRoutes);
app.use("/api/v1/ticket", ticketRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running successfully on ${PORT}`);
});
