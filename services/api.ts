import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const api = axios.create({
  baseURL: "http://192.168.240.1:3000",
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    const businessId = await SecureStore.getItemAsync("businessId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (businessId) {
      config.headers["x-business-id"] = businessId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Jika sukses, langsung kembalikan response
  async (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 429) {
        Alert.alert(
          "Terlalu Banyak Permintaan",
          "Anda telah mencapai batas akses. Mohon tunggu beberapa saat sebelum mencoba lagi.",
          [{ text: "Mengerti" }]
        );
      }

      if (response.status === 401) {
        await SecureStore.deleteItemAsync("userToken");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
