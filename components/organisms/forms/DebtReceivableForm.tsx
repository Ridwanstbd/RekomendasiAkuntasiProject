import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { FormField } from "../../molecules/FormField";
import { AccountSelector } from "../../molecules/AccountSelector";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";

type TransactionMode = "DEBT" | "RECEIVABLE";

export const DebtReceivableForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<TransactionMode>("DEBT");

  // State Input
  const [personName, setPersonName] = useState("");
  const [cashAccountId, setCashAccountId] = useState(""); // Akun Kas/Bank
  const [targetAccountId, setTargetAccountId] = useState(""); // Akun Utang (Liability) atau Piutang (Asset)
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!personName || !cashAccountId || !targetAccountId || !amount) {
      return Alert.alert("Error", "Mohon lengkapi semua data transaksi");
    }

    setLoading(true);
    try {
      const totalAmount = parseFloat(amount);
      const prefix = mode === "DEBT" ? "UTANG" : "PIUTANG";
      // Menyimpan nama orang di body reference
      const fullReference = `${prefix}: ${personName} - ${description}`;

      let entries = [];

      if (mode === "DEBT") {
        // UTANG: Kas Bertambah (Debit), Utang Bertambah (Kredit)
        entries = [
          {
            debitAccountId: cashAccountId,
            creditAccountId: null,
            description: `Terima dana utang dari ${personName}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: targetAccountId,
            description: `Kewajiban utang kepada ${personName}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ];
      } else {
        // PIUTANG: Piutang Bertambah (Debit), Kas Berkurang (Kredit)
        entries = [
          {
            debitAccountId: targetAccountId,
            creditAccountId: null,
            description: `Pemberian pinjaman kepada ${personName}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: cashAccountId,
            description: `Keluar kas untuk piutang ${personName}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ];
      }

      const journalRes = await api.post("/api/journals", {
        date: new Date().toISOString(),
        type: "GENERAL",
        reference: fullReference,
        entries,
      });

      const journalId = journalRes.data.data.id;
      await api.patch(`/api/journals/${journalId}/post`);

      Alert.alert("Sukses", `${prefix} berhasil dicatat dan diposting.`);
      router.replace("/(tabs)/transactions");
    } catch (err: any) {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Switcher Mode */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === "DEBT" && styles.activeTab]}
          onPress={() => {
            setMode("DEBT");
            setTargetAccountId("");
          }}
        >
          <Typography
            variant="body"
            style={mode === "DEBT" ? styles.activeTabText : {}}
          >
            Utang (Saya Meminjam)
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "RECEIVABLE" && styles.activeTab]}
          onPress={() => {
            setMode("RECEIVABLE");
            setTargetAccountId("");
          }}
        >
          <Typography
            variant="body"
            style={mode === "RECEIVABLE" ? styles.activeTabText : {}}
          >
            Piutang (Memberi Pinjaman)
          </Typography>
        </TouchableOpacity>
      </View>

      <FormField
        label={mode === "DEBT" ? "Nama Pemberi Pinjaman" : "Nama Peminjam"}
        placeholder="Contoh: Bpk. Slamet"
        value={personName}
        onChangeText={setPersonName}
      />

      <AccountSelector
        label="Pilih Kas/Bank"
        type="ASSET"
        selectedId={cashAccountId}
        onSelect={setCashAccountId}
      />

      <AccountSelector
        label={mode === "DEBT" ? "Pilih Akun Utang" : "Pilih Akun Piutang"}
        type={mode === "DEBT" ? "LIABILITY" : "ASSET"}
        selectedId={targetAccountId}
        onSelect={setTargetAccountId}
      />

      <FormField
        label="Jumlah (Rp)"
        placeholder="0"
        type="number"
        value={amount}
        onChangeText={setAmount}
      />

      <FormField
        label="Keterangan Tambahan"
        placeholder="Contoh: Jangka waktu 3 bulan"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title={loading ? "Memproses..." : "Simpan Transaksi"}
        onPress={handleSubmit}
        isLoading={loading}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  activeTab: {
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeTabText: { fontWeight: "700", color: "#007AFF" },
});
