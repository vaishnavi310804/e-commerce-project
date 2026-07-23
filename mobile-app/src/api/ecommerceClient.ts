import axios from "axios";
import * as SecureStore from "expo-secure-store";
import client from "./authClient";

const ecommerceClient = axios.create({
  baseURL: "http://192.168.29.120:5001/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};

const setAuthorizationHeader = (headers: any, token: string) => {
  if (!headers) return;

  if (typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers["Authorization"] = `Bearer ${token}`;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found.");
  }

  const { data } = await client.post("/refresh-token", {
    refreshToken,
  });

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = data.data;

  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", newRefreshToken);

  ecommerceClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return accessToken;
};

ecommerceClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");

  if (token) {
    setAuthorizationHeader(config.headers, token);
  }

  return config;
});

ecommerceClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            setAuthorizationHeader(originalRequest.headers, token);
            return ecommerceClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        setAuthorizationHeader(
          originalRequest.headers,
          newAccessToken
        );

        processQueue(null, newAccessToken);

        return ecommerceClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        delete ecommerceClient.defaults.headers.common.Authorization;
        delete client.defaults.headers.common.Authorization;

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default ecommerceClient;