import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as SecureStore from "expo-secure-store"; // Tambahkan ini
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { FormatSelector } from "@/components/molecules/FormatSelector";
import { PressableCard } from "@/components/atoms/PressableCard";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";
import { Download } from "lucide-react-native";
import api from "@/services/api";

export default function ExportScreen() {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<"pdf" | "xlsx">("pdf");

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const handleExport = async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("userToken");
      const businessId = await SecureStore.getItemAsync("businessId");

      if (!token || !businessId) {
        throw new Error("Sesi berakhir. Silakan login kembali.");
      }

      const fs = FileSystem as any;
      let rawDir =
        fs.documentDirectory ||
        fs.cacheDirectory ||
        (fs.Paths ? fs.Paths.document : null);

      let baseDir: string = "";
      if (typeof rawDir === "string") {
        baseDir = rawDir;
      } else if (rawDir && typeof rawDir === "object" && rawDir.uri) {
        baseDir = rawDir.uri;
      }

      if (!baseDir) {
        throw new Error("Sistem penyimpanan tidak valid.");
      }

      const safeBaseDir = baseDir.endsWith("/") ? baseDir : `${baseDir}/`;
      const fileName = `Laporan_${format.toUpperCase()}_${Date.now()}.${format}`;
      const fileUri = `${safeBaseDir}${fileName}`;

      const downloadUrl = `/api/reports/export/profit-loss?format=${format}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      const fullUrl = `${api.defaults.baseURL}${downloadUrl}`;

      // 2. Pastikan Header dikirim dengan format yang benar
      const headers = {
        "x-business-id": businessId,
        Authorization: `Bearer ${token}`, // Pastikan ada prefix 'Bearer '
      };

      const downloadRes = await FileSystem.downloadAsync(fullUrl, fileUri, {
        headers,
      });

      // Jika server masih membalas 401, berarti token di SecureStore sudah expired
      if (downloadRes.status === 401) {
        throw new Error("Sesi tidak sah (401). Silakan login ulang.");
      }

      if (downloadRes.status !== 200) {
        throw new Error(`Gagal mengunduh (Status: ${downloadRes.status}).`);
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert("Berhasil", "File disimpan di: " + downloadRes.uri);
      }
    } catch (err: any) {
      console.error("Export Auth Error:", err.message);
      Alert.alert("Gagal Ekspor", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Ekspor Laporan</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Laporan akan diunduh dan dapat dibagikan langsung.
      </Typography>

      <Typography variant="h2" style={styles.sectionTitle}>
        Pilih Format Dokumen
      </Typography>
      <FormatSelector selected={format} onSelect={setFormat} />

      <Typography variant="h2" style={styles.sectionTitle}>
        Tentukan Periode
      </Typography>
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
    marginTop: 10,
  },
  disabledBtn: { backgroundColor: "#A7D1FF" },
  btnContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  btnLabel: { color: "#FFF", fontSize: 16, marginBottom: 0 },
});
