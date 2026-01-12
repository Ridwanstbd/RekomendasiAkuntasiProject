import React, { useState, useCallback } from "react"; // Hapus useEffect
import { PressableCard } from "@/components/atoms/PressableCard";
import { Sparkles, ArrowRight, Send, Building2 } from "lucide-react-native";
import { useRouter, useFocusEffect } from "expo-router"; // useFocusEffect sudah di-import dari sini
import * as SecureStore from "expo-secure-store";
import api from "@/services/api";
import { Typography } from "@/components/atoms/Typography";
import { Header } from "@/components/organisms/Header";
import { SelectField } from "@/components/organisms/SelectField";
import { Card } from "@/components/atoms/Card";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Loader } from "@/components/atoms/Loader";
import { StyleSheet, View } from "react-native";

interface Business {
  id: string;
  name: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");
  const [totalAsset, setTotalAsset] = useState<number>(0);

  // Fungsi untuk mengambil data ringkasan saldo
  const fetchSummaryData = async (businessId: string) => {
    try {
      const response = await api.get(`/api/accounts?type=ASSET`);
      const accounts = response.data.data;

      const total = accounts.reduce((acc: number, curr: any) => {
        return acc + parseFloat(curr.balance || 0);
      }, 0);

      setTotalAsset(total);
    } catch (error) {
      console.error("Gagal mengambil saldo asset:", error);
      setTotalAsset(0);
    }
  };

  // Fungsi utama untuk inisialisasi dashboard
  const initDashboard = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      // 1. Ambil Profil User
      try {
        const userRes = await api.get("/api/auth/me");
        if (userRes.data.success) {
          setUserName(userRes.data.data.name);
        }
      } catch (userErr) {
        console.error("Gagal mengambil profil:", userErr);
      }

      // 2. Ambil Daftar Bisnis
      const response = await api.get("/api/business/my-businesses");
      const data = response.data.data;

      if (data && data.length > 0) {
        setBusinesses(data);

        // Cek ID yang tersimpan atau gunakan yang pertama
        const savedId = await SecureStore.getItemAsync("businessId");
        const initialId =
          data.find((b: Business) => b.id === savedId)?.id || data[0].id;

        setSelectedId(initialId);
        await SecureStore.setItemAsync("businessId", initialId);

        // 3. Ambil Summary Data setelah businessId didapat
        await fetchSummaryData(initialId);
      } else {
        router.replace("/company-setup");
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * PENGGANTI useEffect:
   * useFocusEffect akan berjalan setiap kali layar di-mount
   * ATAU ketika user kembali ke layar ini dari navigasi lain.
   */
  useFocusEffect(
    useCallback(() => {
      initDashboard();

      // Jika ada proses yang perlu dihentikan saat layar ditinggalkan,
      // tambahkan di return function ini.
      return () => {};
    }, [])
  );

  const handleSwitchBusiness = async (id: string) => {
    setSelectedId(id);
    await SecureStore.setItemAsync("businessId", id);
    await fetchSummaryData(id);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Jalankan init secara silent (tanpa loader utama) saat pull-to-refresh
    await initDashboard(true);
    setRefreshing(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayoutTemplate onRefresh={onRefresh} refreshing={refreshing}>
      <Header name={userName} />
      <SelectField
        label="Bisnis Aktif"
        placeholder="Pilih Bisnis"
        modalTitle="Ganti Entitas Bisnis"
        icon={Building2}
        options={businesses.map((b) => ({ id: b.id, label: b.name }))}
        value={selectedId}
        onSelect={(option) => handleSwitchBusiness(option.id)}
      />
      <Card>
        <Typography variant="body">Total Saldo Asset</Typography>
        <Typography variant="h1" style={{ marginTop: 2 }}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(totalAsset)}
        </Typography>
      </Card>
      <Typography variant="h2" style={{ marginTop: 24, marginBottom: 12 }}>
        Wawasan AI
      </Typography>
      <PressableCard
        onPress={() => router.push("/recommendations")}
        style={styles.aiCard}
      >
        <View style={styles.aiIconWrapper}>
          <Sparkles size={24} color="#5856D6" />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="body" style={{ fontWeight: "700" }}>
            Rekomendasi Strategi AI
          </Typography>
          <Typography variant="body" style={{ fontSize: 12, color: "#8E8E93" }}>
            Analisis otomatis berdasarkan arus kas bulan ini.
          </Typography>
        </View>
        <ArrowRight size={20} color="#C7C7CC" />
      </PressableCard>

      <PressableCard
        onPress={() => router.push("/custom-recommendations")}
        style={[
          styles.aiCard,
          { borderColor: "#5856D6", backgroundColor: "#F5F5FF" },
        ]}
      >
        <View style={[styles.aiIconWrapper, { backgroundColor: "#5856D6" }]}>
          <Send size={20} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Typography
            variant="body"
            style={{ fontWeight: "700", color: "#5856D6" }}
          >
            Konsultasi AI Kustom
          </Typography>
          <Typography
            variant="body"
            style={{ fontSize: 12, color: "#5856D6", opacity: 0.8 }}
          >
            Tanyakan pertanyaan spesifik ke asisten keuangan Anda.
          </Typography>
        </View>
      </PressableCard>
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  aiCard: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    padding: 16,
    marginBottom: 12, // Tambahan agar antar card tidak nempel
  },
  aiIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#5856D615",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
});
