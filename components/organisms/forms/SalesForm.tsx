import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Plus } from "lucide-react-native";
import { CustomerSelector } from "../../molecules/CustomerSelector";
import { AccountSelector } from "../../molecules/AccountSelector";
import { SaleItemRow } from "../../molecules/SaleItemRow";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { Journal } from "@/types/accounting";

interface ItemState {
  productName: string;
  quantity: string;
  price: string;
}

interface SalesFormProps {
  editId?: string;
  initialData?: Journal;
}

export const SalesForm: React.FC<SalesFormProps> = ({
  editId,
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [customerId, setCustomerId] = useState<string>("");
  const [cashAccountId, setCashAccountId] = useState<string>("");
  const [salesAccountId, setSalesAccountId] = useState<string>("");
  const [items, setItems] = useState<ItemState[]>([
    { productName: "", quantity: "1", price: "" },
  ]);

  useEffect(() => {
    if (editId && initialData) {
      const cashEntry = initialData.entries?.find((e) => e.debitAmount > 0);
      const salesEntry = initialData.entries?.find((e) => e.creditAmount > 0);

      if (cashEntry) setCashAccountId(cashEntry.debitAccountId || "");
      if (salesEntry) setSalesAccountId(salesEntry.creditAccountId || "");

      setItems([
        {
          productName: initialData.reference,
          quantity: "1",
          price: initialData.totalAmount.toString(),
        },
      ]);
    }
  }, [editId, initialData]);

  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = parseFloat(item.quantity || "0");
      const p = parseFloat(item.price || "0");
      return sum + q * p;
    }, 0);
  }, [items]);

  const addItem = () =>
    setItems([...items, { productName: "", quantity: "1", price: "" }]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof ItemState, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (!customerId || !cashAccountId || !salesAccountId) {
      return Alert.alert(
        "Validation Error",
        "Customer dan Akun harus dipilih."
      );
    }

    const processedItems = items.map((item) => ({
      productName: item.productName.trim(),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    setLoading(true);
    try {
      if (editId) {
        setStatusMsg("Memperbarui transaksi...");
        await api.put(`/api/journals/${editId}`, {
          date: new Date().toISOString(),
          type: "SALES",
          reference: initialData?.reference,
          entries: [
            {
              debitAccountId: cashAccountId,
              creditAccountId: null,
              description: `Update: ${initialData?.reference}`,
              debitAmount: grandTotal,
              creditAmount: 0,
            },
            {
              debitAccountId: null,
              creditAccountId: salesAccountId,
              description: `Update: Penjualan`,
              debitAmount: 0,
              creditAmount: grandTotal,
            },
          ],
        });
        Alert.alert("Sukses", "Transaksi berhasil diperbarui.");
      } else {
        // Logika CREATE baru seperti sebelumnya
        setStatusMsg("Mendaftarkan penjualan...");
        const saleRes = await api.post("/api/sales", {
          customerId,
          date: new Date().toISOString(),
          tax: 0,
          items: processedItems,
        });
        const saleId = saleRes.data.data.id;
        const journalRes = await api.post("/api/journals/sales", {
          saleId,
          cashAccountId,
          salesAccountId,
          taxAccountId: null,
        });
        await api.patch(`/api/journals/${journalRes.data.data.id}/post`);
        await api.patch(`/api/sales/${saleId}/status`, { status: "COMPLETED" });
        Alert.alert("Sukses", "Transaksi berhasil disimpan.");
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CustomerSelector selectedId={customerId} onSelect={setCustomerId} />
      <View style={styles.section}>
        <Typography variant="body" style={styles.sectionTitle}>
          Pengaturan Akun
        </Typography>
        <AccountSelector
          label="Pilih Akun Kas/Bank"
          type="ASSET"
          selectedId={cashAccountId}
          onSelect={setCashAccountId}
        />
        <AccountSelector
          label="Pilih Akun Pendapatan"
          type="REVENUE"
          selectedId={salesAccountId}
          onSelect={setSalesAccountId}
        />
      </View>
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Typography variant="body" style={styles.sectionTitle}>
            Daftar Produk
          </Typography>
          <Button
            title="Tambah Item"
            variant="outline"
            icon={Plus}
            onPress={addItem}
            style={styles.btnAdd}
          />
        </View>
        {items.map((item, index) => (
          <SaleItemRow
            key={index}
            index={index}
            {...item}
            onUpdate={updateItem}
            onRemove={removeItem}
          />
        ))}
        <View style={styles.totalContainer}>
          <Typography variant="body">Total Nominal</Typography>
          <Typography variant="h1" style={styles.totalText}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(grandTotal)}
          </Typography>
        </View>
      </View>
      <Button
        title={
          loading
            ? statusMsg
            : editId
            ? "Perbarui Transaksi"
            : "Simpan & Posting"
        }
        onPress={handleSubmit}
        isLoading={loading}
        style={styles.btnSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 16,
  },
  sectionTitle: { fontWeight: "700", marginBottom: 12 },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  btnAdd: { height: 32, paddingHorizontal: 12 },
  totalContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#007AFF10",
    borderRadius: 12,
    alignItems: "flex-end",
  },
  totalText: { color: "#007AFF", marginTop: 4 },
  btnSubmit: { marginTop: 24, marginBottom: 50 },
});
