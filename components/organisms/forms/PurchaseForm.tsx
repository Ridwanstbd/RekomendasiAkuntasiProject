import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FormField } from "../../molecules/FormField";
import { AccountSelector } from "../../molecules/AccountSelector";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";

export const PurchaseForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // State
  const [cashAccountId, setCashAccountId] = useState(""); // Akun Kas (Kredit)
  const [inventoryAccountId, setInventoryAccountId] = useState(""); // Akun Persediaan (Debit)
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!cashAccountId || !inventoryAccountId || !itemName || !amount) {
      return Alert.alert("Error", "Mohon lengkapi semua data");
    }

    setLoading(true);
    try {
      setStatusMsg("Menyusun jurnal...");

      const totalAmount = parseFloat(amount);
      const journalPayload = {
        date: new Date().toISOString(),
        type: "PURCHASE",
        reference: `Pembelian: ${itemName}`,
        entries: [
          {
            debitAccountId: inventoryAccountId,
            creditAccountId: null,
            description: `Pembelian stok ${itemName}`,
            debitAmount: totalAmount,
            creditAmount: 0,
          },
          {
            debitAccountId: null,
            creditAccountId: cashAccountId,
            description: `Pembayaran stok ${itemName}`,
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ],
      };

      // 1. Create Journal
      const res = await api.post("/api/journals", journalPayload);
      const journalId = res.data.data.id;

      // 2. Post Journal
      setStatusMsg("Memposting saldo...");
      await api.patch(`/api/journals/${journalId}/post`);

      Alert.alert("Sukses", "Pembelian stok berhasil dicatat.");
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
        placeholder="Contoh: Stok Bahan Baku"
        value={itemName}
        onChangeText={setItemName}
      />

      <FormField
        label="Total Nilai Pembelian (Rp)"
        placeholder="0"
        type="number"
        value={amount}
        onChangeText={setAmount}
      />

      <Button
        title={loading ? statusMsg : "Catat Pembelian"}
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
