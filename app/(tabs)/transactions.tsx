import React, { useState, useCallback } from "react"; // Tambahkan useCallback
import { FlatList, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { CategoryFilter } from "@/components/organisms/CategoryFilter";
import { TransactionItem } from "@/components/molecules/TransactionItem";
import { Loader } from "@/components/atoms/Loader";
import { Journal } from "@/types/accounting";
import api from "@/services/api";

export default function TransactionsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [filter, setFilter] = useState("ALL");

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const url =
        filter === "ALL" ? "/api/journals" : `/api/journals?type=${filter}`;
      const res = await api.get(url);
      setJournals(res.data.data);
    } catch (err) {
      console.error("Gagal ambil jurnal:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mengganti useEffect dengan useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchJournals();

      // Optional: return cleanup function jika diperlukan
      // return () => { console.log('Screen loses focus'); };
    }, [filter]) // Akan dipanggil setiap kali layar fokus ATAU filter berubah
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJournals();
  };

  return (
    <MainLayoutTemplate onRefresh={handleRefresh}>
      <Typography variant="h1">Riwayat Transaksi</Typography>
      <Typography variant="body" style={{ color: "#8E8E93", marginBottom: 20 }}>
        Pantau semua arus kas masuk dan keluar.
      </Typography>

      <CategoryFilter selected={filter} onSelect={setFilter} />

      {loading && !refreshing ? (
        <Loader />
      ) : (
        <FlatList
          data={journals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Typography variant="body">
                Belum ada transaksi di kategori ini.
              </Typography>
            </View>
          }
        />
      )}
    </MainLayoutTemplate>
  );
}
