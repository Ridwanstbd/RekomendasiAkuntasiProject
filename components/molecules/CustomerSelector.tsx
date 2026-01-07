import React, { useState, useEffect } from "react";
import { View, Modal, StyleSheet } from "react-native";
import { UserPlus, Users } from "lucide-react-native";
import { SelectField } from "../organisms/SelectField";
import { FormField } from "./FormField";
import { Button } from "../atoms/Button";
import api from "@/services/api";
import { Customer } from "@/types/accounting";

interface CustomerSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async () => {
    if (!newCustName) return;
    setLoading(true);
    try {
      const res = await api.post("/api/customers", { name: newCustName });
      const created = res.data.data;
      setCustomers((prev) => [created, ...prev]);
      onSelect(created.id);
      setIsModalOpen(false);
      setNewCustName("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SelectField
        label="Pilih Customer"
        placeholder="Cari Customer..."
        options={customers.map((c) => ({ id: c.id, label: c.name }))}
        value={selectedId}
        onSelect={(opt) => onSelect(opt.id)}
        icon={Users}
      />
      <Button
        title="Customer Baru"
        variant="outline"
        icon={UserPlus}
        onPress={() => setIsModalOpen(true)}
        style={styles.btnSmall}
      />

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FormField
              label="Nama Customer Baru"
              value={newCustName}
              onChangeText={setNewCustName}
              placeholder="Masukkan nama..."
            />
            <View style={styles.row}>
              <Button
                title="Batal"
                variant="outline"
                onPress={() => setIsModalOpen(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Simpan"
                isLoading={loading}
                onPress={handleCreateCustomer}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  btnSmall: { marginTop: -10, alignSelf: "flex-end", height: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#FFF", borderRadius: 20, padding: 20 },
  row: { flexDirection: "row", marginTop: 15 },
});
