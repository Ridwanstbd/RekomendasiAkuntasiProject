import React, { useState, useCallback } from "react"; // Tambahkan useCallback
import { View, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Tambahkan import ini
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { Loader } from "@/components/atoms/Loader";
import { Badge } from "@/components/atoms/Badge";
import { BalanceSection } from "@/components/molecules/BalanceSection";
import { BalanceSheetData } from "@/types/accounting";
import api from "@/services/api";

export default function BalanceSheetScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BalanceSheetData | null>(null);

  const fetchBalanceSheet = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/reports/balance-sheet");
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil Neraca:", err);
      Alert.alert("Error", "Gagal mengambil data neraca terbaru.");
    } finally {
      setLoading(false);
    }
  };

  // Menggantikan useEffect dengan useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchBalanceSheet();

      // Optional: return cleanup function jika diperlukan
      // return () => { console.log('Screen unfocused') };
    }, [])
  );

  if (loading && !data) return <Loader />;

  return (
    <MainLayoutTemplate onRefresh={fetchBalanceSheet}>
      <View style={styles.headerRow}>
        <View>
          <Typography variant="h1">Neraca</Typography>
          <Typography variant="body" style={styles.subtitle}>
            Posisi Keuangan Saat Ini
          </Typography>
        </View>
        {data && (
          <Badge
            label={data.isBalanced ? "Seimbang" : "Tidak Seimbang"}
            color={data.isBalanced ? "#34C759" : "#FF3B30"}
          />
        )}
      </View>

      <BalanceSection
        title="Aset"
        data={data!.assets}
        totalLabel="TOTAL ASET"
        accentColor="#007AFF"
      />

      <BalanceSection
        title="Kewajiban"
        data={data!.liabilities}
        totalLabel="TOTAL KEWAJIBAN"
        accentColor="#FF9500"
      />

      <BalanceSection
        title="Ekuitas"
        data={data!.equity}
        totalLabel="TOTAL EKUITAS"
        accentColor="#5856D6"
      />

      {/* Footer Check */}
      <View style={styles.footer}>
        <View style={styles.checkRow}>
          <Typography variant="body">Total Kewajiban + Modal</Typography>
          <Typography variant="body" style={styles.totalValue}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(data!.liabilities.total + data!.equity.total)}
          </Typography>
        </View>
        {!data?.isBalanced && (
          <Typography variant="body" style={styles.warningText}>
            * Terjadi selisih pada pencatatan akuntansi Anda.
          </Typography>
        )}
      </View>
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  subtitle: { color: "#8E8E93" },
  footer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    marginBottom: 40,
  },
  checkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalValue: { fontWeight: "700", color: "#1C1C1E" },
  warningText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});
