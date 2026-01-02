import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Building2 } from "lucide-react-native";
import api from "@/services/api";

// Atomic Components
import { Typography } from "@/components/atoms/Typography";
import { Header } from "@/components/organisms/Header";
import { SelectField } from "@/components/organisms/SelectField";
import { Card } from "@/components/atoms/Card";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";

interface Business {
  id: string;
  name: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    try {
      const response = await api.get("/api/business/my-businesses");
      const data = response.data.data;

      // Cek apakah ada data bisnis
      if (data && data.length > 0) {
        setBusinesses(data);

        // Ambil ID yang tersimpan di SecureStore atau gunakan yang pertama
        const savedId = await SecureStore.getItemAsync("businessId");
        const initialId =
          data.find((b: Business) => b.id === savedId)?.id || data[0].id;

        await handleSwitchBusiness(initialId);
      } else {
        // Jika bisnis kosong, arahkan ke halaman setup
        router.replace("/company-setup");
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchBusiness = async (id: string) => {
    setSelectedId(id);
    // Simpan ID ke SecureStore agar Axios Interceptor bisa membacanya
    await SecureStore.setItemAsync("businessId", id);

    // Di sini kamu bisa memanggil API lain yang membutuhkan x-business-id
    // Contoh: fetchSummaryData(id);
    console.log("Business ID set to header:", id);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <MainLayoutTemplate onRefresh={() => {}}>
        <Header name="User" />
        <SelectField
          label="Bisnis Aktif"
          placeholder="Pilih Bisnis"
          modalTitle="Ganti Entitas Bisnis"
          icon={Building2}
          options={businesses.map((b) => ({ id: b.id, label: b.name }))}
          value={selectedId}
          onSelect={(option) => handleSwitchBusiness(option.id)}
        />
        <Card style={styles.summaryCard}>
          <Typography variant="h2">Total Saldo</Typography>
          <Typography variant="h1" style={{ marginTop: 10 }}>
            Rp 0
          </Typography>
        </Card>
      </MainLayoutTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  pagePadding: {
    paddingHorizontal: 20,
  },
  summaryCard: {
    marginTop: 10,
  },
});
