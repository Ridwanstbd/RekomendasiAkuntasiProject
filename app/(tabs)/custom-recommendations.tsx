import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/atoms/Card";
import { PressableCard } from "@/components/atoms/PressableCard";
import { Loader } from "@/components/atoms/Loader";
import { RecommendationItem } from "@/components/molecules/RecommendationItem";
import { AIRecommendation } from "@/types/accounting";
import { Send, Info } from "lucide-react-native";
import api from "@/services/api";

export default function CustomAIRecommendationScreen() {
  const [prompt, setPrompt] = useState("");
  const [includeData, setIncludeData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendation | null>(null);

  const handleAskAI = async () => {
    if (prompt.length < 10) {
      Alert.alert(
        "Input Terlalu Pendek",
        "Berikan instruksi minimal 10 karakter agar AI dapat menganalisis dengan baik."
      );
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const res = await api.post("/api/recommendations/custom", {
        prompt,
        includeFinancialData: includeData,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });

      setResult(res.data.data.recommendation);
      setPrompt(""); // Reset input setelah berhasil
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan saat menghubungi AI."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Tanya Asisten AI</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Ajukan pertanyaan spesifik mengenai strategi keuangan bisnis Anda.
      </Typography>

      <Card style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          placeholder="Contoh: Berikan saran untuk meningkatkan margin laba saya..."
          placeholderTextColor="#8E8E93"
          multiline
          numberOfLines={4}
          value={prompt}
          onChangeText={setPrompt}
          textAlignVertical="top"
        />

        <View style={styles.optionsRow}>
          <View style={styles.optionLabelGroup}>
            <Typography variant="body" style={styles.optionLabel}>
              Sertakan Data Keuangan
            </Typography>
            <Typography variant="body" style={styles.optionDesc}>
              AI akan membaca arus kas bulan ini
            </Typography>
          </View>
          <Switch
            value={includeData}
            onValueChange={setIncludeData}
            trackColor={{ false: "#D1D1D6", true: "#34C759" }}
          />
        </View>

        <PressableCard
          onPress={handleAskAI}
          style={[styles.sendBtn, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <Send size={18} color="#FFF" />
              <Typography variant="body" style={styles.btnText}>
                Kirim Pertanyaan
              </Typography>
            </>
          )}
        </PressableCard>
      </Card>

      {result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Info size={16} color="#5856D6" />
            <Typography variant="body" style={styles.resultTitle}>
              Jawaban Asisten AI
            </Typography>
          </View>
          <RecommendationItem item={result} />
        </View>
      )}
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: "#8E8E93", marginBottom: 20 },
  inputCard: { padding: 16, marginBottom: 24 },
  textInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#1C1C1E",
    minHeight: 100,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  optionLabelGroup: { flex: 1 },
  optionLabel: { fontWeight: "600", fontSize: 14 },
  optionDesc: { fontSize: 12, color: "#8E8E93" },
  sendBtn: {
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 0,
    marginBottom: 0,
  },
  btnText: { color: "#FFF", fontWeight: "700", marginLeft: 8 },
  resultContainer: { marginTop: 10 },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: { fontWeight: "700", color: "#5856D6" },
});
