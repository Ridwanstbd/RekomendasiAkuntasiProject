import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Loader } from "@/components/atoms/Loader";
import api from "@/services/api";
import { Journal } from "@/types/accounting";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [id])
  );

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/journals/${id}`);
      setJournal(response.data.data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat detail transaksi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Hapus Jurnal",
      "Apakah Anda yakin? Saldo akun akan otomatis disesuaikan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/journals/${id}`);
              router.back();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Gagal menghapus"
              );
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loader />;

  if (!journal)
    return (
      <MainLayoutTemplate>
        <Typography variant="body">Data tidak ditemukan</Typography>;
      </MainLayoutTemplate>
    );

  return (
    <MainLayoutTemplate>
      {/* Header menggunakan variant h2 */}
      <Typography variant="h2">{journal.reference}</Typography>
      <Typography variant="caption" color="#8E8E93">
        {journal.journalNo}
      </Typography>

      <View style={styles.infoBox}>
        {/* Informasi status dan total menggunakan variant body */}
        <Typography variant="body">Status: {journal.status}</Typography>
        <Typography variant="h3" style={{ marginTop: 4 }}>
          Total: Rp {Number(journal.totalAmount).toLocaleString("id-ID")}
        </Typography>
      </View>

      {/* Sub-judul menggunakan variant h3 yang baru ditambahkan */}
      <Typography variant="h3" style={{ marginTop: 24, marginBottom: 8 }}>
        Rincian Akun:
      </Typography>

      {(journal.entries || []).map((entry: any, index: number) => (
        <View key={index} style={styles.entryRow}>
          <View style={{ flex: 1 }}>
            <Typography variant="body">
              {entry.debitAccount?.name || entry.creditAccount?.name}
            </Typography>
            <Typography variant="caption" color="#8E8E93">
              {entry.description}
            </Typography>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Typography
              variant="body"
              color={entry.debitAmount > 0 ? "#34C759" : "#FF3B30"}
            >
              {entry.debitAmount > 0
                ? `(D) Rp ${Number(entry.debitAmount).toLocaleString("id-ID")}`
                : `(K) Rp ${Number(entry.creditAmount).toLocaleString(
                    "id-ID"
                  )}`}
            </Typography>
          </View>
        </View>
      ))}

      <View style={styles.actions}>
        <Button
          title="Edit Jurnal"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/transactions/edit",
              params: { transactionId: id },
            })
          }
        />
        <Button
          title="Hapus Jurnal"
          variant="outline"
          onPress={handleDelete}
          style={{ marginTop: 12, borderColor: "#FF3B30" }}
        />
      </View>
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  actions: { marginTop: 32, marginBottom: 40 },
});
