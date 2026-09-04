import express from "express";
import {
  createTicket,
  getMyTickets,
  getMyTicketDetails,
  getAllTickets,
  getMyAssignedTickets,
  getEscalationTargets,
  getTicketDetails,
  assignTicket,
  updateTicketPriority,
  escalateTicket,
  updateTicketStatus,
} from "./ticket.controller.js";
import {
  createTicketValidation,
  ticketIdValidation,
  updateTicketStatusValidation,
  updateTicketPriorityValidation,
  escalateTicketValidation,
  assignTicketValidation,
  ticketQueryValidation,
} from "./ticket.validation.js";
import { protect } from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.js";
import { authorize } from "../../middleware/role.middleware.js";
import { authorizePermission } from "../../middleware/permission.middleware.js";

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


router.get(
  "/",
  protect,
  authorizePermission("TICKETS", "VIEW"),
  ticketQueryValidation,
  getAllTickets,
);

router.get(
  "/admin/my-assigned",
  protect,
  authorizePermission("TICKETS", "VIEW"),
  ticketQueryValidation,
  getMyAssignedTickets,
);

router.get(
  "/admin/escalation-targets",
  protect,
  authorizePermission("TICKETS", "VIEW"),
  getEscalationTargets,
);

router.get(
  "/admin/:id",
  protect,
  authorizePermission("TICKETS", "VIEW"),
  ticketIdValidation,
  getTicketDetails,
);

router.patch(
  "/admin/:id/assign",
  protect,
  authorizePermission("TICKETS", "EDIT"),
  assignTicketValidation,
  assignTicket,
);

router.patch(
  "/admin/:id/priority",
  protect,
  authorizePermission("TICKETS", "EDIT"),
  updateTicketPriorityValidation,
  updateTicketPriority,
);

router.patch(
  "/admin/:id/escalate",
  protect,
  authorizePermission("TICKETS", "EDIT"),
  escalateTicketValidation,
  escalateTicket,
);

router.patch(
  "/admin/:id/status",
  protect,
  authorizePermission("TICKETS", "EDIT"),
  updateTicketStatusValidation,
  updateTicketStatus,
);

export default router;