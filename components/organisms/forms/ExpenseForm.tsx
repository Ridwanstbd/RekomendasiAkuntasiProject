import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FormField } from "../../molecules/FormField";
import { AccountSelector } from "../../molecules/AccountSelector";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { Journal } from "@/types/accounting";

interface ExpenseFormProps {
  editId?: string;
  initialData?: Journal;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  editId,
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [cashAccountId, setCashAccountId] = useState("");
  const [expenseAccountId, setExpenseAccountId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (editId && initialData && initialData.entries) {
      const expenseEntry = initialData.entries.find((e) => e.debitAmount > 0);
      const cashEntry = initialData.entries.find((e) => e.creditAmount > 0);

      if (expenseEntry) {
        setExpenseAccountId(expenseEntry.debitAccountId || "");
        setAmount(expenseEntry.debitAmount.toString());
        setDescription(initialData.reference);
      }
      if (cashEntry) setCashAccountId(cashEntry.creditAccountId || "");
    }
  }, [editId, initialData]);

  const handleSubmit = async () => {
    if (!cashAccountId || !expenseAccountId || !amount || !description) {
      return Alert.alert("Error", "Mohon lengkapi semua data pengeluaran");
    }

    setLoading(true);
    try {
      const totalAmount = parseFloat(amount);
      const payload = {
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

      if (editId) {
        setStatusMsg("Memperbarui biaya...");
        await api.put(`/api/journals/${editId}`, payload);
        Alert.alert("Sukses", "Biaya berhasil diperbarui.");
      } else {
        setStatusMsg("Mencatat biaya...");
        const res = await api.post("/api/journals", payload);
        await api.patch(`/api/journals/${res.data.data.id}/post`);
        Alert.alert("Sukses", "Biaya berhasil dicatat.");
      }
      router.replace("/transactions");
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
        value={description}
        onChangeText={setDescription}
      />
      <FormField
        label="Jumlah (Rp)"
        type="number"
        value={amount}
        onChangeText={setAmount}
      />
      <Button
        title={loading ? statusMsg : editId ? "Update Biaya" : "Bayar Sekarang"}
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
