import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/atoms/Card";
import { Loader } from "@/components/atoms/Loader";
import { AccountSelector } from "@/components/molecules/AccountSelector";
import { LedgerRow } from "@/components/molecules/LedgerRow";
import { LedgerEntry } from "@/types/accounting";
import api from "@/services/api";

export default function GeneralLedgerScreen() {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const fetchLedger = async (accountId: string) => {
    try {
      setLoading(true);
      const url = accountId
        ? `/api/reports/ledger?accountId=${accountId}`
        : "/api/reports/ledger";

      const res = await api.get(url);
      setEntries(res.data.data);
    } catch (err) {
      console.error("Gagal ambil Buku Besar:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLedger(selectedAccountId);
    }, [selectedAccountId])
  );

  const totalDebit = entries.reduce(
    (sum, e) => sum + Number(e.debitAmount || 0),
    0
  );

  const totalCredit = entries.reduce(
    (sum, e) => sum + Number(e.creditAmount || 0),
    0
  );

  return (
    <MainLayoutTemplate onRefresh={() => fetchLedger(selectedAccountId)}>
      <Typography variant="h1">Buku Besar</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Detail mutasi transaksi seluruh akun bisnis.
      </Typography>

      {/* Hilangkan properti type agar mengambil SEMUA kategori akun */}
      <AccountSelector
        label="Filter per Akun"
        selectedId={selectedAccountId}
        onSelect={setSelectedAccountId}
      />

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Typography variant="body" style={styles.summaryLabel}>
            Total Debit
          </Typography>
          <Typography variant="h2" style={{ color: "#34C759" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(totalDebit)}
          </Typography>
        </Card>
        <Card style={styles.summaryCard}>
          <Typography variant="body" style={styles.summaryLabel}>
            Total Kredit
          </Typography>
          <Typography variant="h2" style={{ color: "#FF3B30" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(totalCredit)}
          </Typography>
        </Card>
      </View>

      <Typography variant="h2" style={styles.sectionTitle}>
        {selectedAccountId ? "Mutasi Akun" : "Seluruh Mutasi Transaksi"}
      </Typography>

      <Card style={styles.listCard}>
        <View style={styles.tableHeader}>
          <Typography variant="body" style={styles.headerText}>
            TANGGAL & REF
          </Typography>
          <View style={styles.headerRight}>
            <Typography variant="body" style={styles.headerText}>
              DEBIT
            </Typography>
            <Typography variant="body" style={styles.headerText}>
              KREDIT
            </Typography>
          </View>
        </View>

        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <LedgerRow entry={item} targetAccountId={selectedAccountId} />
            )}
            ListEmptyComponent={
              <Typography variant="body" style={styles.emptyText}>
                Tidak ada riwayat transaksi.
              </Typography>
            }
          />
        )}
      </Card>
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: "#8E8E93", marginBottom: 20 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: { flex: 1, padding: 12, marginTop: 10 },
  summaryLabel: { fontSize: 12, color: "#8E8E93", marginBottom: 4 },
  sectionTitle: { fontSize: 16, marginTop: 12, marginBottom: 8 },
  listCard: { padding: 0, overflow: "hidden" },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerRight: {
    flexDirection: "row",
    width: 160,
    justifyContent: "space-between",
  },
  headerText: { fontSize: 10, fontWeight: "700", color: "#8E8E93" },
  emptyText: { textAlign: "center", padding: 40, color: "#8E8E93" },
});
