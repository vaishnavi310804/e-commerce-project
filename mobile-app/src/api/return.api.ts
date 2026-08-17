import ecommerceClient from "./ecommerceClient";

export interface ReturnItem {
  product: string | {
    _id: string;
    name: string;
    price: number;
    productImage?: string;
    image?: string;
    brand?: string;
  };
  quantity: number;
  reason?: string;
}

export interface ReturnData {
  _id: string;

  order: string | {
    _id: string;
    orderNumber: string;
    orderStatus: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
  };

  user?: string | {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };

  items: ReturnItem[];

  reason: string;
  description?: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Picked Up"
    | "Completed";

  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnItem {
  product: string;
  quantity: number;
  reason?: string;
}

export interface CreateReturnPayload {
  orderId: string;
  items: CreateReturnItem[];
  reason: string;
  description?: string;
}

export interface ReturnResponse {
  success: boolean;
  data: ReturnData;
  message?: string;
}

export interface ReturnsResponse {
  success: boolean;
  data: ReturnData[];
  message?: string;
}

export const createReturn = async (
  payload: CreateReturnPayload,
): Promise<ReturnResponse> => {
  const response = await ecommerceClient.post("/return", payload);

  return response.data;
};

export const getMyReturns = async (): Promise<ReturnsResponse> => {
  const response = await ecommerceClient.get("/return/my");

  return response.data;
};

export const getReturnDetails = async (
  returnId: string,
): Promise<ReturnResponse> => {
  const response = await ecommerceClient.get(`/return/${returnId}`);

  return response.data;
};