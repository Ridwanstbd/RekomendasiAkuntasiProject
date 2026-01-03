import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { router } from "expo-router";

const api = axios.create({
  baseURL: "http://192.168.240.1:3000",
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  const businessId = await SecureStore.getItemAsync("businessId");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (businessId) config.headers["x-business-id"] = businessId;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 429) {
        Alert.alert(
          "Batas Akses",
          "Terlalu banyak permintaan. Mohon tunggu sebentar."
        );
      }
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("businessId");
        router.replace("/(auth)/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
