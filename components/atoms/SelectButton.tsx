import React from "react";
import { TouchableOpacity, StyleSheet, View, ViewStyle } from "react-native";
import { ChevronDown, LucideIcon } from "lucide-react-native";
import { Typography } from "./Typography";

interface SelectButtonProps {
  label?: string;
  value?: string;
  placeholder?: string;
  icon?: LucideIcon;
  onPress: () => void;
  style?: ViewStyle;
}

export const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  value,
  placeholder = "Pilih opsi...",
  icon: Icon,
  onPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography variant="caption" style={styles.label}>
          {label}
        </Typography>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          {Icon && <Icon size={18} color="#007AFF" style={styles.icon} />}
          <Typography
            variant="body"
            style={value ? styles.textActive : styles.textPlaceholder}
          >
            {value || placeholder}
          </Typography>
        </View>
        <ChevronDown size={20} color="#8E8E93" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: "600" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  leftSection: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 8 },
  textActive: { color: "#1C1C1E", fontWeight: "500" },
  textPlaceholder: { color: "#999" },
});
