import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { FormField } from "./FormField";
import { Typography } from "../atoms/Typography";

// Definisikan tipe field yang diizinkan agar sinkron dengan ItemState
export type SaleItemField = "productName" | "quantity" | "price";

interface SaleItemRowProps {
  index: number;
  productName: string;
  quantity: string;
  price: string;
  // PERBAIKAN: Gunakan SaleItemField, bukan string
  onUpdate: (index: number, field: SaleItemField, value: string) => void;
  onRemove: (index: number) => void;
}

export const SaleItemRow: React.FC<SaleItemRowProps> = ({
  index,
  productName,
  quantity,
  price,
  onUpdate,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="body" style={styles.itemLabel}>
          Item #{index + 1}
        </Typography>
        {index > 0 && (
          <TouchableOpacity onPress={() => onRemove(index)}>
            <Trash2 color="#FF3B30" size={18} />
          </TouchableOpacity>
        )}
      </View>

      <FormField
        label="Nama Produk"
        placeholder="Nama Barang"
        value={productName}
        onChangeText={(val) => onUpdate(index, "productName", val)}
      />

      <View style={styles.row}>
        <View style={{ flex: 1.5, marginRight: 8 }}>
          <FormField
            label="Harga"
            type="number"
            placeholder="0"
            value={price}
            onChangeText={(val) => onUpdate(index, "price", val)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FormField
            label="Qty"
            type="number"
            placeholder="1"
            value={quantity}
            onChangeText={(val) => onUpdate(index, "quantity", val)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemLabel: { fontWeight: "700", color: "#8E8E93" },
  row: { flexDirection: "row" },
});
