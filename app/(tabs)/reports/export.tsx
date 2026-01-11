import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
// Gunakan API Modern SDK 54
import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as SecureStore from "expo-secure-store";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { FormatSelector } from "@/components/molecules/FormatSelector";
import { PressableCard } from "@/components/atoms/PressableCard";
import { DateRangePicker } from "@/components/molecules/DateRangePicker";
import { Download as DownloadIcon } from "lucide-react-native";
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

      // 1. Ambil Kredensial
      const token = await SecureStore.getItemAsync("userToken");
      const businessId = await SecureStore.getItemAsync("businessId");
      if (!token || !businessId)
        throw new Error("Sesi berakhir. Silakan login kembali.");

      // 2. Download File via API (Axios)
      const downloadUrl = `/api/reports/export/profit-loss?format=${format}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;

      const response = await api.get(downloadUrl, {
        responseType: "arraybuffer", // Sangat penting untuk file biner
        headers: {
          "x-business-id": businessId,
          Authorization: `Bearer ${token}`,
        },
      });

      // Konversi buffer ke Uint8Array (Format yang didukung API File baru)
      const fileData = new Uint8Array(response.data);
      const fileName = `Laporan_${format.toUpperCase()}_${Date.now()}.${format}`;
      const mimeType =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      // 3. Logika Penyimpanan
      if (Platform.OS === "android") {
        // Picker Modern SDK 54 untuk memilih folder penyimpanan
        const directory = await Directory.pickDirectoryAsync();

        if (directory) {
          // Buat file baru di direktori yang dipilih
          const newFile = directory.createFile(fileName, mimeType);
          await newFile.write(fileData);

          Alert.alert("Berhasil", `Laporan disimpan di: ${directory.uri}`);
        }
      } else {
        // Untuk iOS: Simpan ke cache sementara lalu buka Share Sheet (Save to Files)
        const tempFile = new File(Paths.cache, fileName);
        await tempFile.create();
        await tempFile.write(fileData);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(tempFile.uri);
        } else {
          Alert.alert("Error", "Fitur penyimpanan tidak tersedia.");
        }
      }
    } catch (err: any) {
      console.error("Export Error:", err.message);
      Alert.alert(
        "Gagal Ekspor",
        err.message || "Terjadi kesalahan saat mengunduh."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Ekspor Laporan</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Laporan akan diunduh dan disimpan langsung ke perangkat Anda.
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
              <DownloadIcon size={20} color="#FFF" />
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
