import React from "react";
import { Href, useRouter } from "expo-router";
import { Typography } from "@/components/atoms/Typography";
import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { CategoryMenu } from "@/components/organisms/CategoryMenu";

export default function CreateScreen() {
  const router = useRouter();

  const handleCategorySelect = (type: string) => {
    router.push({
      pathname: "/create/form",
      params: { type },
    } as any);
  };

  return (
    <MainLayoutTemplate onRefresh={() => {}}>
      <Typography variant="h1">Catat Transaksi</Typography>
      <Typography variant="body" style={{ color: "#8E8E93", marginTop: 4 }}>
        Pilih jenis aktivitas keuangan yang ingin dicatat
      </Typography>

      <CategoryMenu onSelect={handleCategorySelect} />
    </MainLayoutTemplate>
  );
}
