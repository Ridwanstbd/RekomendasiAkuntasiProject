import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { CheckCircle2, Wallet, ArrowRight } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { FormField } from "../components/molecules/FormField";
import { Button } from "../components/atoms/Button";
import { Typography } from "../components/atoms/Typography";
import { HeroFormTemplate } from "@/components/organisms/HeroFormTemplate";
import { SelectField } from "@/components/organisms/SelectField";
import api from "@/services/api";
import DEFAULT_ACCOUNTS from "@/services/constant";

export default function CompanySetupScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessStatus, setBusinessStatus] = useState("NEW");
  const [initialCapital, setInitialCapital] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSetup = async () => {
    if (!name) return;
    setLoading(true);
    setCurrentStep(2);

    try {
      setStatusMessage("Mendaftarkan entitas bisnis...");

      const bizResponse = await api.post("/api/business", {
        name,
        description,
        code:
          name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 100),
      });

      const businessId = bizResponse.data.data.id;
      await SecureStore.setItemAsync("businessId", businessId);

      setStatusMessage("Menyiapkan Bagan Akun standar...");
      for (const account of DEFAULT_ACCOUNTS) {
        try {
          await api.post("/api/accounts", account, {
            headers: { "x-business-id": businessId },
          });
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (accErr) {
          console.error(`Gagal membuat akun ${account.name}:`, accErr);
        }
      }

      setStatusMessage("Sistem akuntansi siap!");

      setTimeout(() => {
        if (businessStatus === "NEW") {
          setCurrentStep(3);
        } else {
          router.replace("/(tabs)/dashboard");
        }
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setCurrentStep(1);
      alert("Terjadi kesalahan saat konfigurasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInitialCapital = async () => {
    if (!initialCapital) {
      router.replace("/(tabs)/dashboard");
      return;
    }

    setLoading(true);
    try {
      const accountRes = await api.get("/api/accounts");
      const allAccounts = accountRes.data.data;

      const kasAccount = allAccounts.find((a: any) => a.code === "1000");
      const modalAccount = allAccounts.find((a: any) => a.code === "3000");

      if (!kasAccount || !modalAccount) {
        throw new Error("Akun Kas atau Modal tidak ditemukan");
      }
      const amount = parseFloat(initialCapital);

      const journalPayload = {
        date: new Date().toISOString(),
        type: "GENERAL",
        reference: "SETORAN_AWAL",
        entries: [
          {
            debitAccountId: kasAccount.id,
            creditAccountId: null,
            description: "Setoran Modal Awal (Kas)",
            debitAmount: amount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: modalAccount.id,
            description: "Setoran Modal Awal (Modal)",
            debitAmount: 0,
            creditAmount: amount,
          },
        ],
      };

      await api.post("/api/journals", journalPayload);
      Alert.alert("Sukses", "Modal awal berhasil dicatat!");
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      console.error("Detail Error Jurnal:", err.response?.data);
      Alert.alert(
        "Gagal mencatat jurnal",
        "Saldo modal tidak bisa disimpan secara otomatis karena ketidakseimbangan atau akun tidak ditemukan.",
        [
          {
            text: "Atur Manual di Dashboard",
            onPress: () => router.replace("/(tabs)/dashboard"),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroFormTemplate
      title={
        currentStep === 1
          ? "Siapkan Bisnis"
          : currentStep === 2
          ? "Mohon Tunggu"
          : "Modal Awal"
      }
      subtitle={
        currentStep === 1
          ? "Langkah awal menuju manajemen keuangan profesional."
          : currentStep === 2
          ? "Kami sedang menyiapkan lingkungan akuntansi Anda."
          : "Masukkan saldo kas awal untuk memulai pembukuan."
      }
      showTab={false}
    >
      {currentStep === 1 && (
        <View>
          <FormField
            label="Nama Bisnis"
            placeholder="Contoh: PT. Berkah Jaya Abadi"
            value={name}
            onChangeText={setName}
          />

          <SelectField
            label="Status Usaha"
            placeholder="Pilih Status"
            options={[
              { id: "NEW", label: "Usaha Baru (Mulai dari Nol)" },
              { id: "EXISTING", label: "Usaha Sudah Berjalan" },
            ]}
            value={businessStatus}
            onSelect={(opt) => setBusinessStatus(opt.id)}
            icon={Wallet}
          />

          <FormField
            label="Deskripsi"
            placeholder="Jelaskan bidang usaha Anda..."
            type="textarea"
            value={description}
            onChangeText={setDescription}
            style={{ height: 80 }}
          />

          <Button
            title="Lanjutkan"
            onPress={handleSetup}
            isLoading={loading}
            style={{ marginTop: 20 }}
          />
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Typography variant="h2" style={styles.statusText}>
            {statusMessage}
          </Typography>
          <View style={styles.stepperWrapper}>
            <StepItem
              label="Entitas Bisnis"
              active={
                statusMessage.includes("akun") || statusMessage.includes("siap")
              }
            />
            <StepItem
              label="Bagan Akun (CoA)"
              active={statusMessage.includes("siap")}
            />
          </View>
        </View>
      )}

      {currentStep === 3 && (
        <View>
          <Typography variant="body" style={{ marginBottom: 20 }}>
            Berapa saldo kas tunai yang Anda miliki saat ini untuk memulai
            usaha?
          </Typography>

          <FormField
            label="Jumlah Modal (Kas)"
            placeholder="Contoh: 5000000"
            type="number"
            value={initialCapital}
            onChangeText={setInitialCapital}
          />

          <Button
            title="Simpan & Selesai"
            icon={ArrowRight}
            onPress={handleSaveInitialCapital}
            isLoading={loading}
            style={{ marginTop: 12 }}
          />

          <Button
            title="Lewati, Atur Nanti"
            variant="outline"
            onPress={() => router.replace("/(tabs)/dashboard")}
            disabled={loading}
          />
        </View>
      )}
    </HeroFormTemplate>
  );
}

const StepItem = ({ label, active }: { label: string; active: boolean }) => (
  <View style={styles.stepItem}>
    <CheckCircle2 size={20} color={active ? "#34C759" : "#D1D1D6"} />
    <Typography
      variant="body"
      style={{ marginLeft: 10, color: active ? "#1C1C1E" : "#8E8E93" }}
    >
      {label}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: { alignItems: "center", paddingVertical: 40 },
  statusText: { marginTop: 20, textAlign: "center" },
  stepperWrapper: { marginTop: 40, width: "100%" },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F2F2F7",
    padding: 15,
    borderRadius: 12,
  },
});
