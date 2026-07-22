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

export type RefreshTokenPayload = {
  refreshToken: string;
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

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
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
    client.defaults.headers.common.Authorization =
      `Bearer ${accessToken}`;

    ecommerceClient.defaults.headers.common.Authorization =
      `Bearer ${accessToken}`;

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

export const refreshAccessToken = async (payload: RefreshTokenPayload) => {
  const { data } = await client.post<ApiResponse<AuthTokens>>(
    "/refresh-token",
    payload
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

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await client.post<ApiResponse<undefined>>(
    "/reset-password",
    payload
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
  refreshAccessToken,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  setAuthToken,
  updateProfile
};

export default authApi;
