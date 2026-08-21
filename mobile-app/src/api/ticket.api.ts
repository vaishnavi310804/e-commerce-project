import ecommerceClient from "./ecommerceClient";

export interface CreateTicketPayload {
  orderId?: string;
  category:
    | "Shipment Delay"
    | "Delivery Issue"
    | "Refund Delay"
    | "Payment Issue"
    | "Return Issue"
    | "Order Issue"
    | "Product Issue"
    | "Cancellation Issue"
    | "Other";
  subject: string;
  description: string;
}

export interface TicketOrder {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
}

export interface TicketUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  user: TicketUser;
  order?: TicketOrder | null;
  category: string;
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo?: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  isEscalated: boolean;
  escalatedAt?: string | null;
  slaDeadline?: string | null;
  slaBreached: boolean;
  resolution?: string;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  success: boolean;
  message?: string;
  data: Ticket;
}

export interface TicketsResponse {
  success: boolean;
  data: Ticket[];
}

export const createTicket = async (
  payload: CreateTicketPayload,
): Promise<TicketResponse> => {
  const response = await ecommerceClient.post<TicketResponse>(
    "/ticket",
    payload,
  );

  return response.data;
};


export const getMyTickets = async (): Promise<TicketsResponse> => {
  const response = await ecommerceClient.get<TicketsResponse>(
    "/ticket/my",
  );

  return response.data;
};

export const getMyTicketDetails = async (
 ticketId: string,
): Promise<TicketResponse> => {
  const response = await ecommerceClient.get<TicketResponse>(
    `/ticket/my/${ticketId}`,
  );

  return response.data;
};