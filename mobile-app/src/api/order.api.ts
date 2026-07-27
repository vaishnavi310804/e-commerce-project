import ecommerceClient from "./ecommerceClient";

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: "COD" | "ONLINE" | "Card" | "UPI";
}

export interface OrderItem {
  product: any;
  quantity: number;
  price: number;
}
export type OrderStatus =
  | "Placed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderData {
  _id: string;
  orderNumber: string;
  user: any;
  products: OrderItem[];
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  shippingAddress: any;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await ecommerceClient.post<ApiResponse<OrderData>>(
    "/order",
    payload
  );
  return data;
};

export const getMyOrders = async () => {
  const { data } = await ecommerceClient.get<ApiResponse<OrderData[]>>(
    "/order/my-orders"
  );
  return data;
};

export const getMyOrderDetails = async (orderId: string) => {
  const { data } = await ecommerceClient.get<ApiResponse<OrderData>>(
    `/order/my-orders/${orderId}`
  );
  return data;
};

export const getOrderById = async (orderId: string) => {
  const response = await ecommerceClient.get(`/order/my-orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const { data } = await ecommerceClient.patch(
    `/order/${orderId}/cancel`
  );
  return data;
};
