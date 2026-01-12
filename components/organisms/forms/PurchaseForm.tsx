import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FormField } from "../../molecules/FormField";
import { AccountSelector } from "../../molecules/AccountSelector";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { Journal } from "@/types/accounting";

interface PurchaseFormProps {
  editId?: string;
  initialData?: Journal;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  editId,
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [cashAccountId, setCashAccountId] = useState("");
  const [inventoryAccountId, setInventoryAccountId] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (editId && initialData && initialData.entries) {
      const invEntry = initialData.entries.find((e) => e.debitAmount > 0);
      const cashEntry = initialData.entries.find((e) => e.creditAmount > 0);

      if (invEntry) {
        setInventoryAccountId(invEntry.debitAccountId || "");
        setAmount(invEntry.debitAmount.toString());
        setItemName(initialData.reference.replace("Pembelian: ", ""));
      }
      if (cashEntry) setCashAccountId(cashEntry.creditAccountId || "");
    }
  }, [editId, initialData]);

  const handleSubmit = async () => {
    if (!cashAccountId || !inventoryAccountId || !itemName || !amount) {
      return Alert.alert("Error", "Mohon lengkapi semua data");
    }

    setLoading(true);
    try {
      const totalAmount = parseFloat(amount);
      const payload = {
        date: new Date().toISOString(),
        type: "PURCHASE",
        reference: `Pembelian: ${itemName}`,
        entries: [
          {
            debitAccountId: inventoryAccountId,
            creditAccountId: null,
            description: `Beli stok ${itemName}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: cashAccountId,
            description: `Bayar stok ${itemName}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ],
      };

      if (editId) {
        setStatusMsg("Memperbarui pembelian...");
        await api.put(`/api/journals/${editId}`, payload);
        Alert.alert("Sukses", "Pembelian berhasil diperbarui.");
      } else {
        setStatusMsg("Menyusun jurnal...");
        const res = await api.post("/api/journals", payload);
        await api.patch(`/api/journals/${res.data.data.id}/post`);
        Alert.alert("Sukses", "Pembelian berhasil dicatat.");
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
        Metode Pembayaran
      </Typography>
      <AccountSelector
        label="Bayar Menggunakan (Kas/Bank)"
        type="ASSET"
        selectedId={cashAccountId}
        onSelect={setCashAccountId}
      />
      <View style={styles.divider} />
      <Typography variant="body" style={styles.sectionTitle}>
        Detail Stok
      </Typography>
      <AccountSelector
        label="Simpan ke Akun (Persediaan/Stok)"
        type="ASSET"
        selectedId={inventoryAccountId}
        onSelect={setInventoryAccountId}
      />
      <FormField
        label="Nama Barang"
        value={itemName}
        onChangeText={setItemName}
      />
      <FormField
        label="Total Nilai (Rp)"
        type="number"
        value={amount}
        onChangeText={setAmount}
      />
      <Button
        title={
          loading ? statusMsg : editId ? "Update Pembelian" : "Catat Pembelian"
        }
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
