import React, { useState, useMemo } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Plus } from "lucide-react-native";
import { CustomerSelector } from "../../molecules/CustomerSelector";
import { AccountSelector } from "../../molecules/AccountSelector";
import { SaleItemRow } from "../../molecules/SaleItemRow";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import api from "@/services/api";
import { useRouter } from "expo-router";

interface ItemState {
  productName: string;
  quantity: string;
  price: string;
}

export const SalesForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const [customerId, setCustomerId] = useState<string>("");
  const [cashAccountId, setCashAccountId] = useState<string>("");
  const [salesAccountId, setSalesAccountId] = useState<string>("");
  const [items, setItems] = useState<ItemState[]>([
    { productName: "", quantity: "1", price: "" },
  ]);

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
    // Validasi UUID (Pastikan tidak string kosong)
    if (!customerId || !cashAccountId || !salesAccountId) {
      return Alert.alert(
        "Validation Error",
        "Customer dan Akun harus dipilih."
      );
    }

    // Transformasi data sesuai createSaleSchema
    const processedItems = items.map((item) => ({
      productName: item.productName.trim(),
      quantity: Number(item.quantity), // Harus Number
      price: Number(item.price), // Harus Number
    }));

    // Validasi Item sebelum kirim (mencegah quantity <= 0)
    if (
      processedItems.some(
        (i) => i.productName === "" || i.quantity <= 0 || i.price < 0
      )
    ) {
      return Alert.alert(
        "Validation Error",
        "Pastikan nama produk terisi, qty > 0, dan harga >= 0."
      );
    }

    setLoading(true);
    try {
      setStatusMsg("Mendaftarkan penjualan...");

      // Request 1: Create Sale
      const saleRes = await api.post("/api/sales", {
        customerId,
        date: new Date().toISOString(),
        tax: 0, // Sesuai schema: default 0
        items: processedItems,
      });

      const saleId = saleRes.data.data.id;

      // Request 2: Create Sales Journal
      setStatusMsg("Menyusun jurnal...");
      const journalRes = await api.post("/api/journals/sales", {
        saleId,
        cashAccountId,
        salesAccountId,
        taxAccountId: null, // Diberikan null agar valid UUID/null
      });

      // Request 3: Post Journal
      setStatusMsg("Finalisasi saldo...");
      await api.patch(`/api/journals/${journalRes.data.data.id}/post`);

      setStatusMsg("Memperbarui status transaksi...");
      await api.patch(`/api/sales/${saleId}/status`, {
        status: "COMPLETED",
      });

      Alert.alert("Sukses", "Transaksi berhasil disimpan dan diposting.");
      router.replace("/transactions");
    } catch (err: any) {
      // Menampilkan pesan error spesifik dari Joi Backend
      const serverMessage = err.response?.data?.message || "Terjadi kesalahan";
      console.error("Detail Error:", err.response?.data);
      Alert.alert("Gagal Simpan", serverMessage);
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
          label="Pilih Persediaan Barang"
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
            productName={item.productName}
            quantity={item.quantity}
            price={item.price}
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
        title={loading ? statusMsg : "Simpan & Posting"}
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
