import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";
import { LedgerEntry } from "@/types/accounting";

interface LedgerRowProps {
  entry: LedgerEntry;
  targetAccountId: string;
}

export const LedgerRow: React.FC<LedgerRowProps> = ({ entry }) => {
  const formatCompact = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Typography variant="body" style={styles.date}>
          {new Date(entry.journal.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          })}
        </Typography>
        <Typography variant="body" style={styles.ref}>
          {entry.journal.reference}
        </Typography>
      </View>

      <View style={styles.right}>
        <Typography
          variant="body"
          style={[
            styles.amount,
            { color: entry.debitAmount > 0 ? "#34C759" : "#C7C7CC" },
          ]}
        >
          {entry.debitAmount > 0 ? formatCompact(entry.debitAmount) : "-"}
        </Typography>

        <Typography
          variant="body"
          style={[
            styles.amount,
            { color: entry.creditAmount > 0 ? "#FF3B30" : "#C7C7CC" },
          ]}
        >
          {entry.creditAmount > 0 ? formatCompact(entry.creditAmount) : "-"}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  left: { flex: 1 },
  right: {
    flexDirection: "row",
    width: 160,
    justifyContent: "space-between",
  },
  date: { fontSize: 10, color: "#8E8E93", textTransform: "uppercase" },
  ref: { fontWeight: "600", fontSize: 13, color: "#1C1C1E", marginTop: 2 },
  amount: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "right",
    width: 75,
  },
});
