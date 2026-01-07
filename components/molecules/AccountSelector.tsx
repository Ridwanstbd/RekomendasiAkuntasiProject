import React, { useState, useEffect } from "react";
import { Wallet } from "lucide-react-native";
import { SelectField } from "../organisms/SelectField";
import api from "@/services/api";

interface Account {
  id: string;
  name: string;
  code: string;
}

interface AccountSelectorProps {
  label: string;
  type: "ASSET" | "REVENUE" | "EXPENSE" | "EQUITY" | "LIABILITY";
  selectedId: string;
  onSelect: (id: string) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  label,
  type,
  selectedId,
  onSelect,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get(`/api/accounts?type=${type}`);
        setAccounts(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil akun:", err);
      }
    };
    fetchAccounts();
  }, [type]);

  return (
    <SelectField
      label={label}
      placeholder={`Pilih Akun ${type === "ASSET" ? "Penerima" : "Pendapatan"}`}
      options={accounts.map((a) => ({
        id: a.id,
        label: `${a.code} - ${a.name}`,
      }))}
      value={selectedId}
      onSelect={(opt) => onSelect(opt.id)}
      icon={Wallet}
    />
  );
};
