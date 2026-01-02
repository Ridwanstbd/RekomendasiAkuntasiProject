import React from "react";
import { View, StyleSheet } from "react-native";
import { PaginationDot } from "../atoms/PaginationDot";

interface PaginationBarProps {
  total: number;
  currentIndex: number;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  total,
  currentIndex,
}) => (
  <View style={styles.pagination}>
    {Array.from({ length: total }).map((_, i) => (
      <PaginationDot key={i} active={currentIndex === i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
});
