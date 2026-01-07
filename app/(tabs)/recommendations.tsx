import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { PressableCard } from "@/components/atoms/PressableCard";
import { Loader } from "@/components/atoms/Loader";
import { RecommendationItem } from "@/components/molecules/RecommendationItem";
import { AIRecommendation } from "@/types/accounting";
import { Sparkles } from "lucide-react-native";
import api from "@/services/api";

export default function AIRecommendationScreen() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<AIRecommendation[]>([]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/recommendations");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateNew = async () => {
    try {
      setGenerating(true);
      const now = new Date();
      const res = await api.post("/api/recommendations/monthly", {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });

      Alert.alert("Sukses", "Rekomendasi AI baru telah dibuat.");
      fetchHistory(); // Refresh list
    } catch (err: any) {
      Alert.alert(
        "Gagal",
        err.response?.data?.message || "Data belum cukup untuk analisis AI."
      );
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <MainLayoutTemplate onRefresh={fetchHistory}>
      <Typography variant="h1">Rekomendasi AI</Typography>
      <Typography variant="body" style={{ color: "#8E8E93", marginBottom: 20 }}>
        Gunakan AI untuk menganalisis kesehatan keuangan bisnis Anda.
      </Typography>

      <PressableCard
        onPress={generateNew}
        style={[styles.generateBtn, generating && { opacity: 0.7 }]}
      >
        <Sparkles size={20} color="#FFF" />
        <Typography variant="body" style={styles.btnText}>
          {generating
            ? "Menganalisis Data..."
            : "Generate Rekomendasi Bulan Ini"}
        </Typography>
      </PressableCard>

      <Typography variant="h2" style={{ marginVertical: 16 }}>
        Riwayat Analisis
      </Typography>

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecommendationItem item={item} />}
          scrollEnabled={false}
          ListEmptyComponent={
            <Typography
              variant="body"
              style={{ textAlign: "center", marginTop: 20 }}
            >
              Belum ada rekomendasi yang dibuat.
            </Typography>
          }
        />
      )}
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  generateBtn: {
    backgroundColor: "#5856D6",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 0,
  },
  btnText: { color: "#FFF", fontWeight: "700", marginLeft: 8 },
});
