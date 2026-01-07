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

  console.log("DEBUG: Mengambil Business ID dari Storage:", businessId);

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

// Log setiap Request yang keluar
api.interceptors.request.use((request) => {
  console.log("===== API REQUEST =====");
  console.log("URL:", request.url);
  console.log("Method:", request.method?.toUpperCase());
  console.log("Headers:", JSON.stringify(request.headers, null, 2));
  console.log("Body:", JSON.stringify(request.data, null, 2));
  console.log("=======================");
  return request;
});

// Log setiap Response yang masuk
api.interceptors.response.use(
  (response) => {
    console.log("===== API RESPONSE =====");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
    console.log("========================");
    return response;
  },
  (error) => {
    console.log("===== API ERROR =====");
    console.log("Status:", error.response?.status);
    console.log("Error Data:", JSON.stringify(error.response?.data, null, 2));
    console.log("=====================");
    return Promise.reject(error);
  }
);

export default api;
