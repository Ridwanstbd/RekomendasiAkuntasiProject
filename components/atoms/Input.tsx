import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  secureTextEntry,
  containerStyle,
  ...props
}) => {
  // State untuk toggle show/hide password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Logika untuk menentukan apakah teks harus disembunyikan
  const shouldHideText = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.textInput}
          secureTextEntry={shouldHideText}
          placeholderTextColor="#999"
          {...props}
        />

        {/* Tampilkan ikon mata hanya jika secureTextEntry bernilai true */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  iconContainer: {
    padding: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
});
