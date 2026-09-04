import Ticket from "./ticket.model.js";
import Order from "../orders/order.model.js";
import { sendNotification } from "../../services/notification.service.js";

const SLA_HOURS = {
  Low: 72,
  Medium: 48,
  High: 24,
  Critical: 4,
};

const calculateSlaDeadline = (priority) => {
  const hours = SLA_HOURS[priority] || SLA_HOURS.Medium;

  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

export const createTicketService = async (userId, payload) => {
  const {
    orderId,
    category,
    subject,
    description,
    priority = "Medium",
    attachments = [],
  } = payload;

  let order = null;

  if (orderId) {
    order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      const error = new Error("Order not found.");
      error.statusCode = 404;
      throw error;
    }
  }

  const slaDeadline = calculateSlaDeadline(priority);

  const ticket = await Ticket.create({
    user: userId,
    order: order ? order._id : null,
    category,
    subject,
    description,
    priority,
    attachments,
    status: "Open",
    isEscalated: false,
    slaDeadline,
    slaBreached: false,
  });

  return await Ticket.findById(ticket._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email");
};

export const getMyTicketsService = async (userId) => {
  return await Ticket.find({
    user: userId,
  })
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email")
    .sort({ createdAt: -1 });
};

export const getMyTicketDetailsService = async (userId, ticketId) => {
  const ticket = await Ticket.findOne({
    _id: ticketId,
    user: userId,
  })
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email");

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
  }

  return ticket;
};

export const getAllTicketsService = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.isEscalated !== undefined) {
    filter.isEscalated = query.isEscalated === "true";
  }

  return await Ticket.find(filter)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email")
    .sort({ createdAt: -1 });
};

export const getTicketDetailsService = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email");

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
  }

  return ticket;
};

export const assignTicketService = async (ticketId, assignedTo) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
  }

  const admin = await Ticket.db.model("User").findOne({
    _id: assignedTo,
    role: "ADMIN",
  });

  if (!admin) {
    const error = new Error("Assigned user must be an admin.");
    error.statusCode = 400;
    throw error;
  }

  ticket.assignedTo = assignedTo;

  if (ticket.status === "Open") {
    ticket.status = "In Progress";
  }

  await ticket.save();

  return await Ticket.findById(ticket._id)
    .populate("user", "fullName email phoneNumber")
    .populate("assignedTo", "fullName email");
};

export const updateTicketPriorityService = async (ticketId, priority) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
  }

  ticket.priority = priority;

  ticket.slaDeadline = calculateSlaDeadline(priority);
  ticket.slaBreached = false;

  await ticket.save();

  return ticket;
};

const isSuperOrFullAdmin = (user) => {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  if (user.role === "ADMIN") {
    if (!user.roleId || user.roleId?.name === "FULL_ADMIN") return true;
  }
  return false;
};

export const getMyAssignedTicketsService = async (adminId, query = {}) => {
  const filter = {
    assignedTo: adminId,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.isEscalated !== undefined) {
    filter.isEscalated = query.isEscalated === "true";
  }

  return await Ticket.find(filter)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email")
    .sort({ createdAt: -1 });
};

export const escalateTicketService = async (ticketId, targetAdminId, user) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
  }

  if (ticket.status === "Closed") {
    const error = new Error("Closed tickets cannot be escalated.");
    error.statusCode = 400;
    throw error;
  }

  if (ticket.isEscalated) {
    const error = new Error("Ticket is already escalated.");
    error.statusCode = 400;
    throw error;
  }

  if (user && !isSuperOrFullAdmin(user)) {
    const assignedId = ticket.assignedTo?._id || ticket.assignedTo;
    if (!assignedId || assignedId.toString() !== user._id.toString()) {
      const error = new Error("Only the assigned admin can escalate, resolve, or close this ticket.");
      error.statusCode = 403;
      throw error;
    }
  }

  if (!targetAdminId) {
    const error = new Error("Target admin ID is required.");
    error.statusCode = 400;
    throw error;
  }

  if (user && user._id && String(targetAdminId) === String(user._id)) {
    const error = new Error("You cannot escalate a ticket to yourself.");
    error.statusCode = 400;
    throw error;
  }

  const targetAdmin = await Ticket.db
    .model("User")
    .findById(targetAdminId)
    .populate("roleId");

  if (!targetAdmin) {
    const error = new Error("Target admin not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!targetAdmin.isActive) {
    const error = new Error("Target admin account is inactive.");
    error.statusCode = 400;
    throw error;
  }

  if (targetAdmin.role !== "ADMIN" && targetAdmin.role !== "SUPER_ADMIN") {
    const error = new Error("Target user must be an admin.");
    error.statusCode = 400;
    throw error;
  }

  if (user && !isSuperOrFullAdmin(user)) {
    if (isSuperOrFullAdmin(targetAdmin)) {
      const error = new Error("Role-based admins can only escalate tickets to other role-based admins.");
      error.statusCode = 403;
      throw error;
    }
  }

  ticket.assignedTo = targetAdminId;
  ticket.isEscalated = true;
  ticket.escalatedAt = new Date();

  if (ticket.status === "Open") {
    ticket.status = "In Progress";
  }

  await ticket.save();

  console.log("TICKET ESCALATED AND REASSIGNED IN DB");

  try {
    await sendNotification({
      userId: ticket.user,
      title: "Ticket Escalated",
      body: `Your support ticket ${ticket.ticketNumber} has been escalated.`,
      type: "TICKET_ESCALATED",
      data: {
        ticketId: ticket._id,
      },
    });
  } catch (notifErr) {
    console.error("Customer notification error on escalation:", notifErr.message);
  }

  try {
    await sendNotification({
      userId: targetAdminId,
      title: "Ticket Escalated to You",
      body: `Support ticket ${ticket.ticketNumber} has been escalated and assigned to you.`,
      type: "TICKET_ESCALATED",
      data: {
        ticketId: ticket._id,
      },
    });
  } catch (adminNotifErr) {
    console.error("Admin notification error on escalation:", adminNotifErr.message);
  }

  return await Ticket.findById(ticket._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email");
};

export const updateTicketStatusService = async (
  ticketId,
  status,
  resolution = "",
  user = null,
) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user && !isSuperOrFullAdmin(user)) {
    const assignedId = ticket.assignedTo?._id || ticket.assignedTo;
    if (!assignedId || assignedId.toString() !== user._id.toString()) {
      const error = new Error("Only the assigned admin can escalate, resolve, or close this ticket.");
      error.statusCode = 403;
      throw error;
    }
  }

  if (ticket.status === "Closed") {
    const error = new Error("Closed tickets cannot be updated.");
    error.statusCode = 400;
    throw error;
  }

  const previousStatus = ticket.status;

  ticket.status = status;

  if (status === "Resolved") {
    ticket.resolution = resolution;
    ticket.resolvedAt = new Date();
  }

  if (status === "Closed") {
    ticket.closedAt = new Date();

    if (resolution) {
      ticket.resolution = resolution;
    }

    if (!ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }
  }

  await ticket.save();

  if (previousStatus !== "Resolved" && status === "Resolved") {
    console.log("========== TICKET RESOLVED NOTIFICATION ==========");
    console.log("TICKET RESOLVED");
    console.log("User ID:", ticket.user);
    console.log("Ticket ID:", ticket._id);
    console.log("Ticket Number:", ticket.ticketNumber);
    console.log("Notification Type:", "TICKET_RESOLVED");

    try {
      await sendNotification({
        userId: ticket.user,
        title: "Ticket Resolved",
        body: `Your support ticket ${ticket.ticketNumber} has been resolved.`,
        type: "TICKET_RESOLVED",
        data: {
          ticketId: ticket._id,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to send ticket resolved notification:",
        notificationError.message,
      );
    }

    console.log("TICKET RESOLVED NOTIFICATION REQUEST COMPLETED");
  }

  return await Ticket.findById(ticket._id)
    .populate("user", "fullName email phoneNumber")
    .populate(
      "order",
      "orderNumber orderStatus paymentMethod paymentStatus totalAmount",
    )
    .populate("assignedTo", "fullName email");
};

export const checkTicketSlaService = async () => {
  const now = new Date();

  const tickets = await Ticket.find({
    status: {
      $in: ["Open", "In Progress"],
    },
    slaDeadline: {
      $lt: now,
    },
    slaBreached: false,
  });

  if (!tickets.length) {
    return [];
  }

  const updatedTickets = [];

  for (const ticket of tickets) {
    ticket.slaBreached = true;

    if (!ticket.isEscalated) {
      ticket.isEscalated = true;
      ticket.escalatedAt = now;
    }

    await ticket.save();

    updatedTickets.push(ticket);
  }

  return updatedTickets;
};
