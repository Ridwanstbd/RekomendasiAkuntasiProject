import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
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

  useEffect(() => {
    fetchJournals();
  }, [filter]);

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
          scrollEnabled={false} // Karena dibungkus ScrollView di Template
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
