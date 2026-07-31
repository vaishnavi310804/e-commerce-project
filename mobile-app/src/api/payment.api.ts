import ecommerceClient from "./ecommerceClient";

export interface CreateRazorpayOrderResponse {
  success: boolean;
  message: string;
  data: {
    key: string;
    orderId: string;
    amount: number;
    currency: string;
  };
}
export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: any;
}
export const createRazorpayOrder = async (orderId: string) => {
  const response = await ecommerceClient.post<CreateRazorpayOrderResponse>(
    "/payment/create-order",
    {
      orderId,
    },
  );
  return response.data;
};
export const verifyPayment = async (payload: VerifyPaymentPayload) => {
  const response = await ecommerceClient.post<VerifyPaymentResponse>(
    "/payment/verify",
    payload,
  );
  return response.data;
};
