import client from "./authClient";
import ecommerceClient from "./ecommerceClient";

export type UserRole = "CUSTOMER" | "ADMIN";
export type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  phoneNumber?: string;
  gender?: "Male" | "Female" | "Other";
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  isProfileCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordData = {
  otp?: string;
};

export type VerifyResetOtpPayload = {
  email: string;
  otp: string;
};

export type VerifyResetOtpData = {
  resetToken: string;
};

export type ResetPasswordPayload = {
  resetToken: string;
  newPassword: string;
};

export type SendEmailChangeOtpPayload = {
  email: string;
};

export type VerifyEmailChangeOtpPayload = {
  email: string;
  otp: string;
};

export type AuthTokens = {
  accessToken: string;
};

export type AuthData = AuthTokens & {
  user: AuthUser;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  errors?: {
    msg: string;
    path?: string;
    param?: string;
  }[];
  data?: T;
};

export const setAuthToken = (accessToken?: string) => {
  if (accessToken) {
    const cleanToken = accessToken.replace(/^"|"$/g, "").trim();
    client.defaults.headers.common.Authorization = `Bearer ${cleanToken}`;
    ecommerceClient.defaults.headers.common.Authorization = `Bearer ${cleanToken}`;
    return;
  }
  delete client.defaults.headers.common.Authorization;
  delete ecommerceClient.defaults.headers.common.Authorization;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await client.post<ApiResponse<AuthData>>(
    "/register",
    payload
  );

  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await client.post<ApiResponse<AuthData>>("/login", payload);

  return data;
};

export const getCurrentUser = async (accessToken?: string) => {
  const { data } = await client.get<ApiResponse<AuthUser>>("/me", {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });
  return data;
};

export const logout = async (accessToken?: string) => {
  const { data } = await client.post<ApiResponse<undefined>>(
    "/logout",
    undefined,
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    }
  );

  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await client.post<ApiResponse<ForgotPasswordData>>(
    "/forgot-password",
    payload
  );

  return data;
};

export const verifyResetOtp = async (payload: VerifyResetOtpPayload) => {
  const { data } = await client.post<ApiResponse<VerifyResetOtpData>>(
    "/verify-reset-otp",
    payload
  );

  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload
) => {
  const { data } = await client.post<ApiResponse<undefined>>(
    "/reset-password",
    payload
  );
  return data;
};


export const sendEmailChangeOtp = async (payload: SendEmailChangeOtpPayload) => {
  const { data } = await client.post<ApiResponse<ForgotPasswordData>>(
    "/send-email-change-otp",
    {
      email: payload.email,
      newEmail: payload.email,
    }
  );

  return data;
};

export const verifyEmailChangeOtp = async (
  payload: VerifyEmailChangeOtpPayload
) => {
  const { data } = await client.post<ApiResponse<undefined>>(
    "/verify-email-change-otp",
    {
      email: payload.email,
      newEmail: payload.email,
      otp: payload.otp,
    }
  );

  return data;
};

export const updateProfile = async (formData: FormData) => {
  const response = await client.patch("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const authApi = {
  register,
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  sendEmailChangeOtp,
  verifyEmailChangeOtp,
  setAuthToken,
  updateProfile,
};

export default authApi;
