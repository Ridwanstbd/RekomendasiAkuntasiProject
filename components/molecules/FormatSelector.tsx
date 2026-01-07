import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "../atoms/Typography";
import { FileText, Table } from "lucide-react-native";

interface FormatSelectorProps {
  selected: "pdf" | "xlsx";
  onSelect: (format: "pdf" | "xlsx") => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const options = [
    { id: "pdf", label: "Dokumen PDF", icon: FileText, color: "#FF3B30" },
    { id: "xlsx", label: "Excel Spreadsheet", icon: Table, color: "#34C759" },
  ] as const;

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[
            styles.option,
            selected === opt.id && {
              borderColor: opt.color,
              backgroundColor: `${opt.color}05`,
            },
          ]}
          onPress={() => onSelect(opt.id)}
        >
          <opt.icon
            size={24}
            color={selected === opt.id ? opt.color : "#8E8E93"}
          />
          <Typography
            variant="body"
            style={[
              styles.label,
              selected === opt.id && { color: opt.color, fontWeight: "700" },
            ]}
          >
            {opt.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 12, marginBottom: 24 },
  option: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F2F2F7",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  label: { marginTop: 8, fontSize: 12, color: "#8E8E93" },
});
