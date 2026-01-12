import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { FormField } from "../../molecules/FormField";
import { AccountSelector } from "../../molecules/AccountSelector";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { Journal } from "@/types/accounting";

type TransactionMode = "DEBT" | "RECEIVABLE";

interface DebtReceivableFormProps {
  editId?: string;
  initialData?: Journal;
}

export const DebtReceivableForm: React.FC<DebtReceivableFormProps> = ({
  editId,
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<TransactionMode>("DEBT");

  // State Input
  const [personName, setPersonName] = useState("");
  const [cashAccountId, setCashAccountId] = useState("");
  const [targetAccountId, setTargetAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editId && initialData && initialData.entries) {
      const refParts = initialData.reference.split(": ");
      if (refParts.length > 1) {
        const isDebt = refParts[0] === "UTANG";
        setMode(isDebt ? "DEBT" : "RECEIVABLE");

        const details = refParts[1].split(" - ");
        setPersonName(details[0] || "");
        setDescription(details[1] || "");
      }

      if (initialData.type === "GENERAL") {
        const isDebt = initialData.reference.startsWith("UTANG");

        if (isDebt) {
          const cashEntry = initialData.entries.find((e) => e.debitAmount > 0);
          const debtEntry = initialData.entries.find((e) => e.creditAmount > 0);
          if (cashEntry) setCashAccountId(cashEntry.debitAccountId || "");
          if (debtEntry) {
            setTargetAccountId(debtEntry.creditAccountId || "");
            setAmount(debtEntry.creditAmount.toString());
          }
        } else {
          const receivableEntry = initialData.entries.find(
            (e) => e.debitAmount > 0
          );
          const cashEntry = initialData.entries.find((e) => e.creditAmount > 0);
          if (receivableEntry) {
            setTargetAccountId(receivableEntry.debitAccountId || "");
            setAmount(receivableEntry.debitAmount.toString());
          }
          if (cashEntry) setCashAccountId(cashEntry.creditAccountId || "");
        }
      }
    }
  }, [editId, initialData]);

  const handleSubmit = async () => {
    if (!personName || !cashAccountId || !targetAccountId || !amount) {
      return Alert.alert("Error", "Mohon lengkapi semua data transaksi");
    }

    setLoading(true);
    try {
      const totalAmount = parseFloat(amount);
      const prefix = mode === "DEBT" ? "UTANG" : "PIUTANG";
      const fullReference = `${prefix}: ${personName} - ${description}`;

      let entries = [];
      if (mode === "DEBT") {
        entries = [
          {
            debitAccountId: cashAccountId,
            creditAccountId: null,
            description: `Kas utang ${personName}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: targetAccountId,
            description: `Kewajiban utang ${personName}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ];
      } else {
        entries = [
          {
            debitAccountId: targetAccountId,
            creditAccountId: null,
            description: `Piutang ${personName}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: cashAccountId,
            description: `Keluar kas piutang ${personName}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ];
      }

      const payload = {
        date: new Date().toISOString(),
        type: "GENERAL",
        reference: fullReference,
        entries,
      };

      if (editId) {
        await api.put(`/api/journals/${editId}`, payload);
        Alert.alert("Sukses", "Transaksi utang/piutang berhasil diperbarui.");
      } else {
        const journalRes = await api.post("/api/journals", payload);
        await api.patch(`/api/journals/${journalRes.data.data.id}/post`);
        Alert.alert("Sukses", `${prefix} berhasil dicatat.`);
      }

      router.replace("/(tabs)/transactions");
    } catch (err: any) {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === "DEBT" && styles.activeTab]}
          onPress={() => {
            if (!editId) {
              setMode("DEBT");
              setTargetAccountId("");
            }
          }}
          disabled={!!editId}
        >
          <Typography
            variant="body"
            style={mode === "DEBT" ? styles.activeTabText : {}}
          >
            Utang (Pinjam)
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "RECEIVABLE" && styles.activeTab]}
          onPress={() => {
            if (!editId) {
              setMode("RECEIVABLE");
              setTargetAccountId("");
            }
          }}
          disabled={!!editId}
        >
          <Typography
            variant="body"
            style={mode === "RECEIVABLE" ? styles.activeTabText : {}}
          >
            Piutang (Pinjamkan)
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
        title={
          loading
            ? "Memproses..."
            : editId
            ? "Update Transaksi"
            : "Simpan Transaksi"
        }
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
