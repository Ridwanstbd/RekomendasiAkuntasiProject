import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { PressableCard } from "@/components/atoms/PressableCard";
import { Loader } from "@/components/atoms/Loader";
import { RecommendationItem } from "@/components/molecules/RecommendationItem";
import { AIRecommendation } from "@/types/accounting";
import {
  Sparkles,
  RefreshCcw,
  History,
  LayoutDashboard,
} from "lucide-react-native";
import api from "@/services/api";

export default function AIRecommendationScreen() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<AIRecommendation[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/recommendations");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  const handleGenerateOrUpdate = async (
    year?: number,
    month?: number,
    isUpdate = false
  ) => {
    try {
      setGenerating(true);
      const now = new Date();
      const targetYear = year || now.getFullYear();
      const targetMonth = month || now.getMonth() + 1;

      // Backend menggunakan POST /monthly yang melakukan upsert (create or update)
      // sesuai logic di recommendationBusinessService.js
      await api.post("/api/recommendations/monthly", {
        year: targetYear,
        month: targetMonth,
        force: true,
      });

      Alert.alert(
        isUpdate ? "Pembaruan Berhasil" : "Sukses",
        `Analisis AI untuk periode ${targetMonth}/${targetYear} telah diperbarui berdasarkan data terbaru.`
      );
      fetchHistory();
    } catch (err: any) {
      Alert.alert(
        "Gagal",
        err.response?.data?.message ||
          "Data transaksi belum cukup untuk dianalisis oleh AI."
      );
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <MainLayoutTemplate>
      <View style={styles.header}>
        <View>
          <Typography variant="h1">Wawasan AI</Typography>
          <Typography variant="body" style={styles.subtitle}>
            Analisis cerdas untuk performa bisnis Anda
          </Typography>
        </View>
        <LayoutDashboard size={28} color="#5856D6" />
      </View>

      {/* Main Action Card */}
      <PressableCard
        onPress={() => handleGenerateOrUpdate()}
        disabled={generating}
        style={[styles.heroCard, generating && { opacity: 0.8 }]}
      >
        <View style={styles.heroContent}>
          <View style={styles.iconContainer}>
            {generating ? (
              <RefreshCcw size={24} color="#FFF" style={styles.rotatingIcon} />
            ) : (
              <Sparkles size={24} color="#FFF" />
            )}
          </View>
          <View style={styles.heroTextContainer}>
            <Typography variant="h3" style={styles.heroTitle}>
              {generating ? "Menganalisis..." : "Generate Analisis Baru"}
            </Typography>
            <Typography variant="body" style={styles.heroSubtitle}>
              Klik untuk memperbarui wawasan bulan ini
            </Typography>
          </View>
        </View>
      </PressableCard>

      <View style={styles.sectionTitleRow}>
        <History size={18} color="#8E8E93" />
        <Typography variant="h2" style={styles.sectionTitle}>
          Riwayat Analisis
        </Typography>
      </View>

      {loading && !refreshing ? (
        <Loader />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5856D6"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <RecommendationItem item={item} />
              {/* Tombol Update Per Item */}
              <TouchableOpacity
                style={styles.updateBadge}
                onPress={() =>
                  handleGenerateOrUpdate(item.year, item.month, true)
                }
                disabled={generating}
              >
                <RefreshCcw size={12} color="#5856D6" />
                <Typography variant="body" style={styles.updateText}>
                  Perbarui
                </Typography>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography variant="body" style={styles.emptyText}>
                Belum ada data analisis. Silakan klik tombol di atas untuk
                memulai.
              </Typography>
            </View>
          }
        />
      )}
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "#8E8E93",
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: "#5856D6",
    padding: 20,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 4,
    shadowColor: "#5856D6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 24,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  heroTitle: {
    color: "#FFF",
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "700",
  },
  itemWrapper: {
    marginBottom: 12,
    position: "relative",
  },
  updateBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  updateText: {
    fontSize: 10,
    color: "#5856D6",
    fontWeight: "700",
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#8E8E93",
    lineHeight: 20,
  },
  rotatingIcon: {
    // Logic untuk rotasi bisa ditambahkan dengan Animated API jika diperlukan
  },
});
