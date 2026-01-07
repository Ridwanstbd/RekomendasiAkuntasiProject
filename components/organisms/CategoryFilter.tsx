import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Typography } from "../atoms/Typography";

interface CategoryFilterProps {
  selected: string;
  onSelect: (type: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  const filters = [
    { id: "ALL", label: "Semua" },
    { id: "SALES", label: "Penjualan" },
    { id: "PURCHASE", label: "Pembelian" },
    { id: "EXPENSE", label: "Biaya" },
    { id: "GENERAL", label: "Umum" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {filters.map((f) => (
        <TouchableOpacity
          key={f.id}
          onPress={() => onSelect(f.id)}
          style={[styles.chip, selected === f.id && styles.activeChip]}
        >
          <Typography
            variant="body"
            style={[styles.text, selected === f.id && styles.activeText]}
          >
            {f.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, flexDirection: "row" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  activeChip: { backgroundColor: "#007AFF" },
  text: { fontSize: 13, color: "#8E8E93" },
  activeText: { color: "#FFF", fontWeight: "600" },
});
