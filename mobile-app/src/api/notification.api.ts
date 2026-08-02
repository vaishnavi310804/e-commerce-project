import authClient from "./authClient";

type ApiResponse = {
  success: boolean;
  message: string;
};

export const updateFcmToken = async (fcmToken: string) => {
  const { data } = await authClient.patch<ApiResponse>(
    "/auth/fcm-token",
    {
      fcmToken,
    }
  );
  return data;
};