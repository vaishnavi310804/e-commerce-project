import ecommerceClient from "./ecommerceClient";
import { Product } from "./product.api";

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: "COD" | "RAZORPAY";
}

export interface OrderItem {
  itemNumber: string;
  product: Product;
  quantity: number;
  price: number;
  itemStatus:
    | "Placed"
    | "Confirmed"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  returnStatus:
    | "Not Requested"
    | "Requested"
    | "Approved"
    | "Rejected"
    | "Picked Up"
    | "Refunded";
}

export type OrderStatus =
  | "Pending"
  | "Placed"
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";


  export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderData {
  _id: string;
  orderNumber: string;
  invoiceNumber: string;
  products: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
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
