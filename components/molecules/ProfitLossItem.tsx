import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";

interface PLItemProps {
  label: string;
  amount: number;
  isTotal?: boolean;
  color?: string;
}

export const PLItem: React.FC<PLItemProps> = ({
  label,
  amount,
  isTotal,
  color,
}) => (
  <View style={[styles.container, isTotal && styles.totalContainer]}>
    <Typography
      variant="body"
      style={[styles.label, isTotal && styles.totalText]}
    >
      {label}
    </Typography>
    <Typography
      variant="body"
      style={[
        styles.amount,
        isTotal && styles.totalText,
        color ? { color } : {},
      ]}
    >
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount)}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  totalContainer: {
    marginTop: 4,
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  label: { color: "#3A3A3C" },
  amount: { fontWeight: "600", color: "#1C1C1E" },
  totalText: { fontWeight: "800", fontSize: 16 },
});
