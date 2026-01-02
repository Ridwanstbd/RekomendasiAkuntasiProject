import React, { useState } from "react";
import { View } from "react-native";
import { SelectButton } from "../atoms/SelectButton";
import { SelectModal } from "../molecules/SelectModal";
import { LucideIcon } from "lucide-react-native";

interface Option {
  id: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  options: Option[];
  onSelect: (option: Option) => void;
  value?: string;
  placeholder?: string;
  icon?: LucideIcon;
  modalTitle?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  onSelect,
  value,
  placeholder,
  icon,
  modalTitle,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Cari label berdasarkan ID yang dipilih
  const selectedLabel = options.find((opt) => opt.id === value)?.label;

  return (
    <View>
      <SelectButton
        label={label}
        value={selectedLabel}
        placeholder={placeholder}
        icon={icon}
        onPress={() => setIsVisible(true)}
      />
      <SelectModal
        visible={isVisible}
        title={modalTitle}
        options={options}
        selectedValue={value}
        onClose={() => setIsVisible(false)}
        onSelect={(opt) => {
          onSelect(opt);
          setIsVisible(false);
        }}
      />
    </View>
  );
};
