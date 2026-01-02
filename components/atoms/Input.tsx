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

type InputType = "text" | "number" | "password" | "textarea";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  type?: InputType; // Prop baru
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  secureTextEntry,
  containerStyle,
  type = "text",
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Password hanya aktif jika type="password" atau secureTextEntry={true}
  const isPassword = type === "password" || secureTextEntry;
  const shouldHideText = isPassword && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          type === "textarea" ? styles.textAreaContainer : null, // Penyesuaian tinggi textarea
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            type === "textarea" ? styles.textAreaInput : null, // Penyesuaian perataan teks
            style,
          ]}
          secureTextEntry={shouldHideText}
          placeholderTextColor="#999"
          // Logika variasi
          multiline={type === "textarea"}
          numberOfLines={type === "textarea" ? 4 : 1}
          keyboardType={type === "number" ? "numeric" : "default"}
          {...props}
        />

        {isPassword && (
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
  textAreaContainer: {
    alignItems: "flex-start", // Ikon/teks mulai dari atas
    minHeight: 100,
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
  textAreaInput: {
    paddingTop: 14,
    textAlignVertical: "top", // Penting untuk Android agar teks mulai dari atas
  },
  iconContainer: {
    padding: 4,
    marginTop: 10, // Menyesuaikan posisi jika textarea
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
});
