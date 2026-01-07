import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { FormatSelector } from "@/components/molecules/FormatSelector";
import { PressableCard } from "@/components/atoms/PressableCard";
import { DateRangePicker } from "@/components/molecules/DateRangePicker"; // Import Komponen Baru
import { Download } from "lucide-react-native";
import api from "@/services/api";

export default function ExportScreen() {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"pdf" | "xlsx">("pdf");

  // State tanggal yang dinamis untuk filter ekspor
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const handleExport = async () => {
    try {
      setLoading(true);

      // Debugging: Cek isi modul FileSystem
      console.log("FileSystem Object:", FileSystem);

      // Gunakan Type Assertion untuk menghindari error TypeScript yang tidak sinkron
      const fs = FileSystem as any;
      const baseDir = fs.documentDirectory || fs.cacheDirectory;

      if (!baseDir) {
        // Jika masih null, kemungkinan besar native module belum ter-link
        throw new Error(
          "Native Module FileSystem tidak ditemukan. Coba jalankan 'npx expo run:android' atau restart Expo Go Anda."
        );
      }

      const fileName = `Laporan_${format.toUpperCase()}_${Date.now()}.${format}`;
      const fileUri = `${baseDir}${fileName}`;

      const downloadUrl = `/api/reports/export/profit-loss?format=${format}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;

      // Ambil header x-business-id dari konfigurasi axios
      const headers = {
        "x-business-id": api.defaults.headers.common["x-business-id"] as string,
        Authorization: api.defaults.headers.common["Authorization"] as string,
      };

      // Gunakan URL absolut dari baseURL + endpoint
      const fullUrl = `${api.defaults.baseURL}${downloadUrl}`;

      const downloadRes = await FileSystem.downloadAsync(fullUrl, fileUri, {
        headers,
      });

      if (downloadRes.status !== 200) {
        throw new Error(
          `Server merespon dengan status ${downloadRes.status}. Gagal mengunduh file.`
        );
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert(
          "Berhasil",
          "File disimpan di penyimpanan lokal perangkat."
        );
      }
    } catch (err: any) {
      console.error("Export Error Log:", err);
      Alert.alert("Gagal Ekspor", err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Ekspor Laporan</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Unduh dokumen keuangan resmi Anda.
      </Typography>

      <Typography variant="h2" style={styles.sectionTitle}>
        Pilih Format Dokumen
      </Typography>
      <FormatSelector selected={format} onSelect={setFormat} />

      <Typography variant="h2" style={styles.sectionTitle}>
        Tentukan Periode
      </Typography>
      {/* Integrasi DateRangePicker */}
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={(start, end) =>
          setDateRange({ startDate: start, endDate: end })
        }
      />

      <PressableCard
        onPress={handleExport}
        style={[styles.downloadBtn, loading && styles.disabledBtn]}
      >
        <View style={styles.btnContent}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Download size={20} color="#FFF" />
              <Typography variant="h2" style={styles.btnLabel}>
                Unduh Laporan {format.toUpperCase()}
              </Typography>
            </>
          )}
        </View>
      </PressableCard>
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: "#8E8E93", marginBottom: 24 },
  sectionTitle: { fontSize: 16, marginBottom: 12, fontWeight: "600" },
  downloadBtn: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    paddingVertical: 18,
    borderWidth: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 10,
  },
  disabledBtn: { backgroundColor: "#A7D1FF" },
  btnContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  btnLabel: { color: "#FFF", fontSize: 16, marginBottom: 0 },
});
