import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";
import { Card } from "../atoms/Card";
import { PLItem } from "./ProfitLossItem";
import { BalanceSheetSection } from "@/types/accounting";

interface BalanceSectionProps {
  title: string;
  data: BalanceSheetSection;
  totalLabel: string;
  accentColor: string;
}

export const BalanceSection: React.FC<BalanceSectionProps> = ({
  title,
  data,
  totalLabel,
  accentColor,
}) => (
  <View style={styles.container}>
    <Typography variant="h2" style={styles.title}>
      {title}
    </Typography>
    <Card style={styles.card}>
      {data.items.length > 0 ? (
        data.items.map((item) => (
          <PLItem
            key={item.id}
            label={`${item.code} - ${item.name}`}
            amount={Number(item.balance)}
          />
        ))
      ) : (
        <Typography variant="body" style={styles.empty}>
          Tidak ada akun.
        </Typography>
      )}
      <PLItem
        label={totalLabel}
        amount={data.total}
        isTotal
        color={accentColor}
      />
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: {
    fontSize: 16,
    marginBottom: 8,
    color: "#8E8E93",
    textTransform: "uppercase",
  },
  card: { paddingHorizontal: 16, paddingVertical: 8 },
  empty: { color: "#C7C7CC", textAlign: "center", marginVertical: 10 },
});
