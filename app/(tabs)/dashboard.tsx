import React, { useEffect, useState } from "react";
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
import { Loader } from "@/components/atoms/Loader";

interface Business {
  id: string;
  name: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [userName, setUserName] = useState<string>("User");
  const [totalAsset, setTotalAsset] = useState<number>(0);

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    try {
      setLoading(true);

      try {
        const userRes = await api.get("/api/auth/me");
        if (userRes.data.success) {
          setUserName(userRes.data.data.name);
        }
      } catch (userErr) {
        console.error("Gagal mengambil profil:", userErr);
      }

      const response = await api.get("/api/business/my-businesses");
      const data = response.data.data;

      if (data && data.length > 0) {
        setBusinesses(data);

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

  const handleSwitchBusiness = async (id: string) => {
    setSelectedId(id);
    await SecureStore.setItemAsync("businessId", id);

    await fetchSummaryData(id);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MainLayoutTemplate onRefresh={() => {}}>
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
      </MainLayoutTemplate>
    </>
  );
}
