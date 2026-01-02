import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Check, X } from "lucide-react-native";
import { Typography } from "../atoms/Typography";

interface Option {
  id: string;
  label: string;
}

interface SelectModalProps {
  visible: boolean;
  onClose: () => void;
  options: Option[];
  selectedValue?: string;
  onSelect: (option: Option) => void;
  title?: string;
}

export const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title = "Pilih Opsi",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography variant="h2">{title}</Typography>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onSelect(item)}
              >
                <Typography variant="body">{item.label}</Typography>
                {selectedValue === item.id && (
                  <Check size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
});
