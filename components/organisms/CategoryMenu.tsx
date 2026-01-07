import React from "react";
import { View } from "react-native";
import {
  ShoppingCart,
  Package,
  ReceiptText,
  WalletCards,
} from "lucide-react-native";
import { CategoryItem } from "../molecules/CategoryItem";

interface MenuOption {
  id: "penjualan" | "pembelian" | "biaya" | "utang_piutang";
  title: string;
  description: string;
  icon: any; // LucideIcon type
  color: string;
}

interface CategoryMenuProps {
  onSelect: (type: string) => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({ onSelect }) => {
  const menus: MenuOption[] = [
    {
      id: "penjualan",
      title: "Penjualan",
      description: "Catat pemasukan dari penjualan barang/jasa",
      icon: ShoppingCart,
      color: "#34C759", // Green
    },
    {
      id: "pembelian",
      title: "Pembelian Stok",
      description: "Catat pembelian stok barang dagangan",
      icon: Package,
      color: "#007AFF", // Blue
    },
    {
      id: "biaya",
      title: "Bayar Biaya",
      description: "Catat pengeluaran operasional & gaji",
      icon: ReceiptText,
      color: "#FF3B30", // Red
    },
    {
      id: "utang_piutang",
      title: "Utang Piutang",
      description: "Catat pinjaman atau tagihan pelanggan",
      icon: WalletCards,
      color: "#FF9500", // Orange
    },
  ];

  return (
    <View style={{ marginTop: 20 }}>
      {menus.map((item) => (
        <CategoryItem
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          color={item.color}
          onPress={() => onSelect(item.id)}
        />
      ))}
    </View>
  );
};
