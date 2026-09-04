import {
  createTicketService,
  getMyTicketsService,
  getMyTicketDetailsService,
  getAllTicketsService,
  getMyAssignedTicketsService,
  getTicketDetailsService,
  assignTicketService,
  updateTicketPriorityService,
  escalateTicketService,
  updateTicketStatusService,
} from "./ticket.service.js";

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await createTicketService(req.user._id, req.body);

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully.",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await getMyTicketsService(req.user._id);

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTicketDetails = async (req, res, next) => {
  try {
    const ticket = await getMyTicketDetailsService(req.user._id, req.params.id);

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await getAllTicketsService(req.query);

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAssignedTickets = async (req, res, next) => {
  try {
    const tickets = await getMyAssignedTicketsService(req.user._id, req.query);

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketDetails = async (req, res, next) => {
  try {
    const ticket = await getTicketDetailsService(req.params.id);

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const assignTicket = async (req, res, next) => {
  try {
    const ticket = await assignTicketService(
      req.params.id,
      req.body.assignedTo,
    );
    return res.status(200).json({
      success: true,
      message: "Ticket assigned successfully.",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketPriority = async (req, res, next) => {
  try {
    const ticket = await updateTicketPriorityService(
      req.params.id,
      req.body.priority,
    );

    return res.status(200).json({
      success: true,
      message: "Ticket priority updated successfully.",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const escalateTicket = async (req, res, next) => {
  try {
    const ticket = await escalateTicketService(
      req.params.id,
      req.body.targetAdminId,
      req.user,
    );

    return res.status(200).json({
      success: true,
      message: "Ticket escalated successfully.",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await updateTicketStatusService(
      req.params.id,
      req.body.status,
      req.body.resolution,
      req.user,
    );

    return res.status(200).json({
      success: true,
      message: "Ticket status updated successfully.",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
