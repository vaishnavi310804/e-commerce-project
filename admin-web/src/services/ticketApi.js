import ecommerceApi from "./ecommerceApi";

export const getAllTickets = async (params = {}) => {
  const response = await ecommerceApi.get("/ticket", {
    params,
  });

  return response.data;
};

export const getTicketDetails = async (ticketId) => {
  const response = await ecommerceApi.get(`/ticket/admin/${ticketId}`);

  return response.data;
};

export const assignTicket = async (ticketId, assignedTo) => {
  const response = await ecommerceApi.patch(
    `/tickets/admin/${ticketId}/assign`,
    {
      assignedTo,
    },
  );

  return response.data;
};