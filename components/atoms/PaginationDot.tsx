import React from "react";
import { View, StyleSheet } from "react-native";

interface PaginationDotProps {
  active: boolean;
}

export const PaginationDot: React.FC<PaginationDotProps> = ({ active }) => (
  <View style={[styles.dot, active && styles.activeDot]} />
);

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  activeDot: { width: 24, backgroundColor: "#007AFF" },
});
