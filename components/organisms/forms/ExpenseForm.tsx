import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FormField } from "../../molecules/FormField";
import { AccountSelector } from "../../molecules/AccountSelector";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";

export const ExpenseForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // State
  const [cashAccountId, setCashAccountId] = useState(""); // Kredit: Kas/Bank (ASSET)
  const [expenseAccountId, setExpenseAccountId] = useState(""); // Debit: Biaya (EXPENSE)
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!cashAccountId || !expenseAccountId || !amount || !description) {
      return Alert.alert("Error", "Mohon lengkapi semua data pengeluaran");
    }

    setLoading(true);
    try {
      setStatusMsg("Mencatat biaya...");

      const totalAmount = parseFloat(amount);
      const journalPayload = {
        date: new Date().toISOString(),
        type: "EXPENSE",
        reference: description,
        entries: [
          {
            debitAccountId: expenseAccountId,
            creditAccountId: null,
            description: `Beban: ${description}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: cashAccountId,
            description: `Pembayaran: ${description}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ],
      };

      // 1. Simpan Jurnal
      const res = await api.post("/api/journals", journalPayload);
      const journalId = res.data.data.id;

      // 2. Posting Jurnal agar saldo akun terupdate
      setStatusMsg("Memperbarui saldo...");
      await api.patch(`/api/journals/${journalId}/post`);

      Alert.alert("Sukses", "Biaya berhasil dicatat dan diposting.");
      router.replace("/(tabs)/transactions");
    } catch (err: any) {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  return (
    <View>
      <Typography variant="body" style={styles.sectionTitle}>
        Sumber Dana
      </Typography>
      <AccountSelector
        label="Bayar Menggunakan (Kas/Bank)"
        type="ASSET"
        selectedId={cashAccountId}
        onSelect={setCashAccountId}
      />

      <View style={styles.divider} />

      <Typography variant="body" style={styles.sectionTitle}>
        Kategori Biaya
      </Typography>
      <AccountSelector
        label="Pilih Jenis Biaya"
        type="EXPENSE"
        selectedId={expenseAccountId}
        onSelect={setExpenseAccountId}
      />

      <FormField
        label="Keterangan Biaya"
        placeholder="Contoh: Bayar Listrik Toko"
        value={description}
        onChangeText={setDescription}
      />

      <FormField
        label="Jumlah (Rp)"
        placeholder="0"
        type="number"
        value={amount}
        onChangeText={setAmount}
      />

      <Button
        title={loading ? statusMsg : "Bayar Sekarang"}
        onPress={handleSubmit}
        isLoading={loading}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontWeight: "700", marginBottom: 12, color: "#444" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 16 },
});
