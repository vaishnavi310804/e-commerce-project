import express from "express";
import {
  createTicket,
  getMyTickets,
  getMyTicketDetails,
  getAllTickets,
  getTicketDetails,
  addTicketMessage,
  assignTicket,
  updateTicketPriority,
  escalateTicket,
  updateTicketStatus,
} from "./ticket.controller.js";
import {
  createTicketValidation,
  ticketIdValidation,
  addTicketMessageValidation,
  updateTicketStatusValidation,
  updateTicketPriorityValidation,
  escalateTicketValidation,
  assignTicketValidation,
  ticketQueryValidation,
} from "./ticket.validation.js";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("CUSTOMER"),
  createTicketValidation,
  createTicket,
);

router.get(
  "/my",
  protect,
  authorize("CUSTOMER"),
  getMyTickets,
);

router.get(
  "/my/:id",
  protect,
  authorize("CUSTOMER"),
  ticketIdValidation,
  getMyTicketDetails,
);

router.post(
  "/:id/messages",
  protect,
  authorize("CUSTOMER"),
  addTicketMessageValidation,
  addTicketMessage,
);

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  ticketQueryValidation,
  getAllTickets,
);

router.get(
  "/admin/:id",
  protect,
  authorize("ADMIN"),
  ticketIdValidation,
  getTicketDetails,
);

router.post(
  "/admin/:id/messages",
  protect,
  authorize("ADMIN"),
  addTicketMessageValidation,
  addTicketMessage,
);

router.patch(
  "/admin/:id/assign",
  protect,
  authorize("ADMIN"),
  assignTicketValidation,
  assignTicket,
);

router.patch(
  "/admin/:id/priority",
  protect,
  authorize("ADMIN"),
  updateTicketPriorityValidation,
  updateTicketPriority,
);

router.patch(
  "/admin/:id/escalate",
  protect,
  authorize("ADMIN"),
  escalateTicketValidation,
  escalateTicket,
);

router.patch(
  "/admin/:id/status",
  protect,
  authorize("ADMIN"),
  updateTicketStatusValidation,
  updateTicketStatus,
);

export default router;