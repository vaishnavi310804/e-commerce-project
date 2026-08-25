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

export const escalateTicketService = async (ticketId) => {
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

  ticket.isEscalated = true;
  ticket.escalatedAt = new Date();

  await ticket.save();

  console.log("TICKET ESCALATED IN DB");

  await sendNotification({
    userId: ticket.user,
    title: "Ticket Escalated",
    body: `Your support ticket ${ticket.ticketNumber} has been escalated.`,
    type: "TICKET_ESCALATED",
    data: {
      ticketId: ticket._id,
    },
  });

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
) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found.");
    error.statusCode = 404;
    throw error;
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
    await sendNotification({
      userId: ticket.user,
      title: "Ticket Resolved",
      body: `Your support ticket ${ticket.ticketNumber} has been resolved.`,
      type: "TICKET_RESOLVED",
      data: {
        ticketId: ticket._id,
      },
    });
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
