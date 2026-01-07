import React from "react";
import { useLocalSearchParams } from "expo-router";
import { HeroFormTemplate } from "@/components/organisms/HeroFormTemplate";
import { SalesForm } from "@/components/organisms/forms/SalesForm";
import { PurchaseForm } from "@/components/organisms/forms/PurchaseForm";
import { ExpenseForm } from "@/components/organisms/forms/ExpenseForm";
import { DebtReceivableForm } from "@/components/organisms/forms/DebtReceivableForm"; // Import baru
import { Typography } from "@/components/atoms/Typography";

export default function DynamicFormScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const getHeaderInfo = () => {
    switch (type) {
      case "penjualan":
        return {
          title: "Catat Penjualan",
          sub: "Input pemasukan dari pelanggan",
        };
      case "pembelian":
        return { title: "Stok Masuk", sub: "Input pembelian barang/stok" };
      case "biaya":
        return { title: "Bayar Biaya", sub: "Catat pengeluaran operasional" };
      case "utang_piutang":
        return { title: "Utang Piutang", sub: "Manajemen pinjaman & tagihan" };
      default:
        return {
          title: "Tambah Catatan",
          sub: "Lengkapi formulir di bawah ini",
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <HeroFormTemplate
      title={header.title}
      subtitle={header.sub}
      showTab={false}
    >
      {type === "penjualan" && <SalesForm />}
      {type === "pembelian" && <PurchaseForm />}
      {type === "biaya" && <ExpenseForm />}
      {type === "utang_piutang" && <DebtReceivableForm />}

      {!["penjualan", "pembelian", "biaya", "utang_piutang"].includes(
        type || ""
      ) && (
        <Typography variant="body">Tipe transaksi tidak dikenali.</Typography>
      )}
    </HeroFormTemplate>
  );
}
