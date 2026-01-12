import React from "react";
import { View, StyleSheet } from "react-native";
import { Journal } from "@/types/accounting";
import { Typography } from "../atoms/Typography";
import { Badge } from "../atoms/Badge";
import { PressableCard } from "../atoms/PressableCard"; // Import PressableCard
import { useRouter } from "expo-router";

interface TransactionItemProps {
  item: Journal;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
  const router = useRouter();

  const getCategoryDetails = (type: string) => {
    switch (type) {
      case "SALES":
        return { label: "Penjualan", color: "#34C759" };
      case "PURCHASE":
        return { label: "Pembelian", color: "#007AFF" };
      case "EXPENSE":
        return { label: "Biaya", color: "#FF3B30" };
      default:
        return { label: "Umum/Lainnya", color: "#8E8E93" };
    }
  };

  const { label, color } = getCategoryDetails(item.type);

  return (
    <PressableCard
      style={styles.container}
      onPress={() => router.push(`/(tabs)/transactions/${item.id}`)} // Navigasi ke detail
    >
      <View style={styles.left}>
        <Typography variant="body" style={styles.ref}>
          {item.reference}
        </Typography>
        <Typography variant="body" style={styles.date}>
          {new Date(item.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Typography>
        <Badge label={label} color={color} />
      </View>
      <View style={styles.right}>
        <Typography variant="body" style={styles.amount}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(item.totalAmount)}
        </Typography>
        <Typography
          variant="body"
          style={[
            styles.status,
            { color: item.status === "POSTED" ? "#34C759" : "#FF9500" },
          ]}
        >
          {item.status}
        </Typography>
      </View>
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 8,
  },
  left: { flex: 1 },
  right: { alignItems: "flex-end", justifyContent: "center" },
  ref: { fontWeight: "700", color: "#1C1C1E" },
  date: { fontSize: 12, color: "#8E8E93", marginBottom: 6 },
  amount: { fontWeight: "700", color: "#1C1C1E" },
  status: { fontSize: 10, fontWeight: "600", marginTop: 4 },
});
