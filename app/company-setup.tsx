import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "@/services/api";
import DEFAULT_ACCOUNTS from "@/services/constant";
import { SetupTemplate } from "@/components/templates/SetupTemplate";

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
      console.error("DEBUG ERROR 400:", err.response?.data);

      const serverMessage =
        err.response?.data?.message || "Terjadi kesalahan validasi data.";
      Alert.alert("Kesalahan Input", serverMessage);

      setCurrentStep(1);
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
    <SetupTemplate
      currentStep={currentStep}
      loading={loading}
      statusMessage={statusMessage}
      formState={{ name, description, businessStatus, initialCapital }}
      handlers={{
        setName,
        setDescription,
        setBusinessStatus: (opt) => setBusinessStatus(opt.id),
        setInitialCapital,
        handleSetup,
        handleSaveInitialCapital,
        onSkip: () => router.replace("/(tabs)/dashboard"),
      }}
    />
  );
}
