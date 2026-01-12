import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/atoms/Typography";
import { Loader } from "@/components/atoms/Loader";
import { HeroFormTemplate } from "@/components/organisms/HeroFormTemplate";

import { SalesForm } from "@/components/organisms/forms/SalesForm";
import { ExpenseForm } from "@/components/organisms/forms/ExpenseForm";
import { PurchaseForm } from "@/components/organisms/forms/PurchaseForm";
import { DebtReceivableForm } from "@/components/organisms/forms/DebtReceivableForm";

import api from "@/services/api";
import { Journal } from "@/types/accounting";

export default function EditTransactionScreen() {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DEBUG: Menerima transactionId =", transactionId);

    if (transactionId) {
      fetchJournal();
    } else {
      setLoading(false);
    }
  }, [transactionId]);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/journals/${transactionId}`);
      setJournal(response.data.data);
    } catch (error: any) {
      console.error(
        "Gagal mengambil data jurnal:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "Gagal mengambil data transaksi. Pastikan koneksi benar."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!transactionId) {
    return (
      <View style={styles.center}>
        <Typography variant="body">
          ID Transaksi tidak ditemukan di navigasi.
        </Typography>
      </View>
    );
  }

  if (!journal) {
    return (
      <View style={styles.center}>
        <Typography variant="body">Data tidak ditemukan di server.</Typography>
      </View>
    );
  }

  const getHeaderInfo = () => {
    switch (journal.type) {
      case "SALES":
        return { title: "Edit Penjualan", sub: "Perbarui data pemasukan" };
      case "PURCHASE":
        return { title: "Edit Pembelian", sub: "Perbarui data stok" };
      case "EXPENSE":
        return { title: "Edit Biaya", sub: "Perbarui pengeluaran" };
      default:
        return { title: "Edit Transaksi", sub: "Perbarui jurnal umum" };
    }
  };

  const header = getHeaderInfo();

  return (
    <HeroFormTemplate
      title={header.title}
      subtitle={header.sub}
      showTab={false}
    >
      <View style={styles.formContainer}>
        {journal.type === "SALES" && (
          <SalesForm editId={transactionId} initialData={journal} />
        )}
        {journal.type === "PURCHASE" && (
          <PurchaseForm editId={transactionId} initialData={journal} />
        )}
        {journal.type === "EXPENSE" && (
          <ExpenseForm editId={transactionId} initialData={journal} />
        )}
        {journal.type === "GENERAL" && (
          <DebtReceivableForm editId={transactionId} initialData={journal} />
        )}
      </View>
    </HeroFormTemplate>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: { paddingBottom: 50 },
});
