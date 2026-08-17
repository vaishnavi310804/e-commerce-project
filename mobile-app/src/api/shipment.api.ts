import ecommerceClient from "./ecommerceClient";

export interface ShipmentTimeline {
  status: string;
  message: string;
  location?: string;
  timestamp: string;
}

export interface ShipmentData {
  _id: string;
  order: string | {
    _id: string;
    orderNumber: string;
    orderStatus: string;
  };
  courier: string;
  trackingId: string;
  trackingUrl?: string;
  status: string;
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery?: string;
  timeline: ShipmentTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentResponse {
  success: boolean;
  data: ShipmentData;
  message?: string;
}

export const getShipmentByOrder = async (
  orderId: string,
): Promise<ShipmentResponse> => {
  const response = await ecommerceClient.get(`/shipment/order/${orderId}`);

  return response.data;
};