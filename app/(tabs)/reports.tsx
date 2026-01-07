import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { ReportMenuCard } from "@/components/molecules/ReportMenuCard";
import { Loader } from "@/components/atoms/Loader";
import { Badge } from "@/components/atoms/Badge";
import { FinancialRatios } from "@/types/accounting";
import api from "@/services/api";
import { BarChart3, BookOpen, Download, PieChart } from "lucide-react-native";

export default function ReportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ratios, setRatios] = useState<FinancialRatios | null>(null);

  const fetchRatios = async () => {
    try {
      // Kita tetap gunakan loading agar user tahu data sedang diperbarui
      setLoading(true);
      const res = await api.get("/api/reports/ratios");
      setRatios(res.data.data);
    } catch (err) {
      console.error("Gagal ambil rasio:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRatios();

      // Opsional: Cleanup function jika diperlukan saat layar ditinggalkan
      return () => {
        // console.log("Meninggalkan layar laporan");
      };
    }, []) // Dependency array kosong agar tidak terjadi re-render berlebih
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRatios();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayoutTemplate onRefresh={handleRefresh}>
      <Typography variant="h1">Laporan</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Analisis mendalam performa keuangan bisnis Anda.
      </Typography>

      <View style={styles.statsContainer}>
        {loading && !refreshing ? (
          <Loader />
        ) : (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View>
                <Typography variant="body" style={styles.summaryLabel}>
                  Laba Bersih (YTD)
                </Typography>
                <Typography
                  variant="h2"
                  style={{
                    color:
                      (ratios?.netProfit || 0) >= 0 ? "#34C759" : "#FF3B30",
                  }}
                >
                  {formatCurrency(ratios?.netProfit || 0)}
                </Typography>
              </View>
              <Badge
                label={`ROI: ${ratios?.roi.toFixed(1) || 0}%`}
                color="#5856D6"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.bepBox}>
              <Typography variant="body" style={styles.bepLabel}>
                Break Even Point (BEP)
              </Typography>
              <Typography variant="body" style={styles.bepValue}>
                {formatCurrency(ratios?.bep || 0)}
              </Typography>
            </View>
          </View>
        )}
      </View>

      <Typography variant="h2" style={styles.sectionTitle}>
        Laporan Utama
      </Typography>

      <ReportMenuCard
        title="Laba Rugi"
        description="Pantau pendapatan dan beban operasional."
        icon={BarChart3}
        color="#007AFF"
        onPress={() => router.push("/reports/profit-loss")}
      />

      <ReportMenuCard
        title="Neraca (Balance Sheet)"
        description="Ringkasan aset, kewajiban, dan ekuitas."
        icon={PieChart}
        color="#34C759"
        onPress={() => router.push("/reports/balance-sheet")}
      />

      <ReportMenuCard
        title="Buku Besar"
        description="Detail mutasi per akun akuntansi."
        icon={BookOpen}
        color="#5856D6"
        onPress={() => router.push("/reports/ledger")}
      />

      <Typography variant="h2" style={styles.sectionTitle}>
        Ekspor & Dokumen
      </Typography>

      <ReportMenuCard
        title="Ekspor PDF/Excel"
        description="Download laporan untuk keperluan pajak atau arsip."
        icon={Download}
        color="#FF9500"
        onPress={() => router.push("/reports/export")}
      />
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: "#8E8E93", marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 16,
    fontWeight: "700",
  },
  statsContainer: { marginBottom: 24 },
  summaryCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLabel: { color: "#AEAEB2", fontSize: 13, marginBottom: 4 },
  divider: {
    height: 1,
    backgroundColor: "#38383A",
    marginVertical: 16,
  },
  bepBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bepLabel: { color: "#AEAEB2", fontSize: 13 },
  bepValue: { color: "#FFF", fontWeight: "600" },
});
