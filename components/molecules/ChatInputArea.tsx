import React from "react";
import {
  View,
  TextInput,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Typography } from "../atoms/Typography";
import { Send } from "lucide-react-native";

interface ChatInputAreaProps {
  prompt: string;
  setPrompt: (text: string) => void;
  includeData: boolean;
  setIncludeData: (val: boolean) => void;
  loading: boolean;
  onSend: () => void;
}

export const ChatInputArea = ({
  prompt,
  setPrompt,
  includeData,
  setIncludeData,
  loading,
  onSend,
}: ChatInputAreaProps) => (
  <View style={styles.footer}>
    <View style={styles.optionsRow}>
      <Typography variant="body" style={styles.optionLabel}>
        Sertakan data keuangan bulan ini
      </Typography>
      <Switch
        value={includeData}
        onValueChange={setIncludeData}
        trackColor={{ false: "#D1D1D6", true: "#34C759" }}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
    </View>

    <View style={styles.inputRow}>
      <TextInput
        style={styles.textInput}
        placeholder="Tanya sesuatu..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={loading || prompt.trim().length === 0}
        style={[
          styles.sendBtn,
          (loading || prompt.trim().length === 0) && styles.disabledBtn,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Send size={20} color="#FFF" />
        )}
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    padding: 12,
    paddingBottom: 45,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  optionLabel: { fontSize: 12, color: "#8E8E93" },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  textInput: {
    flex: 1,
    backgroundColor: "#d9d8ee",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#A7D1FF" },
});
