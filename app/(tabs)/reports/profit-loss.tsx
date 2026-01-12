import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/atoms/Card";
import { Loader } from "@/components/atoms/Loader";
import { PLItem } from "@/components/molecules/ProfitLossItem";
import { ProfitLossData } from "@/types/accounting";
import api from "@/services/api";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";

export default function ProfitLossScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfitLossData | null>(null);

  // Default filter: Bulan ini
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchProfitLoss = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/reports/profit-loss", {
        params: filters,
      });
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil Laba Rugi:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfitLoss();
    }, [filters])
  );

  if (loading && !data) return <Loader />;

  // Logika penentuan status (Laba/Rugi)
  const isProfit = (data?.netProfit || 0) >= 0;
  const statusLabel = isProfit ? "LABA BERSIH" : "RUGI BERSIH";
  const statusColor = isProfit ? "#34C759" : "#FF3B30";

  return (
    <MainLayoutTemplate onRefresh={fetchProfitLoss}>
      <Typography variant="h1">Laba Rugi</Typography>

      <DateRangePicker
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChange={(start, end) =>
          setFilters({ startDate: start, endDate: end })
        }
      />

      {/* SEKSI PENDAPATAN */}
      <Typography variant="h2" style={styles.sectionTitle}>
        Pendapatan
      </Typography>
      <Card style={styles.reportCard}>
        {data?.details
          .filter((item) => item.type === "REVENUE")
          .map((item, idx) => (
            <PLItem key={idx} label={item.name} amount={item.balance} />
          ))}
        <PLItem
          label="TOTAL PENDAPATAN"
          amount={data?.totalRevenue || 0}
          isTotal
          color="#34C759"
        />
      </Card>

      {/* SEKSI BEBAN */}
      <Typography variant="h2" style={styles.sectionTitle}>
        Beban & Biaya
      </Typography>
      <Card style={styles.reportCard}>
        {data?.details
          .filter((item) => item.type === "EXPENSE")
          .map((item, idx) => (
            <PLItem key={idx} label={item.name} amount={item.balance} />
          ))}
        <PLItem
          label="TOTAL BEBAN"
          amount={data?.totalExpense || 0}
          isTotal
          color="#FF3B30"
        />
      </Card>

      {/* RINGKASAN AKHIR DENGAN INDIKATOR WARNA */}
      <Card style={[styles.netProfitCard, { backgroundColor: statusColor }]}>
        <Typography variant="body" style={styles.netProfitLabel}>
          {statusLabel}
        </Typography>
        <Typography variant="h1" style={styles.netProfitAmount}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(data?.netProfit || 0)}
        </Typography>
      </Card>
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#8E8E93",
    textTransform: "uppercase",
  },
  reportCard: { paddingHorizontal: 16, paddingVertical: 8, marginBottom: 16 },
  netProfitCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  netProfitLabel: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  netProfitAmount: { color: "#FFF", fontSize: 28, marginTop: 4 },
});
