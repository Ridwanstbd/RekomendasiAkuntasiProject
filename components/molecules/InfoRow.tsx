import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";

export const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Typography variant="body" style={styles.label}>
      {label}
    </Typography>
    <Typography variant="body" style={styles.value}>
      {value}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  label: { color: "#8E8E93" },
  value: { fontWeight: "600", color: "#1C1C1E" },
});
