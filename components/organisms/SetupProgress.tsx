import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { Typography } from "../atoms/Typography";

interface SetupProgressProps {
  statusMessage: string;
}

const StepItem = ({ label, active }: { label: string; active: boolean }) => (
  <View style={styles.stepItem}>
    <CheckCircle2 size={20} color={active ? "#34C759" : "#D1D1D6"} />
    <Typography
      variant="body"
      style={[styles.stepText, { color: active ? "#1C1C1E" : "#8E8E93" }]}
    >
      {label}
    </Typography>
  </View>
);

export const SetupProgress: React.FC<SetupProgressProps> = ({
  statusMessage,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Typography variant="h2" style={styles.statusText}>
        {statusMessage}
      </Typography>
      <View style={styles.stepperWrapper}>
        <StepItem
          label="Entitas Bisnis"
          active={
            statusMessage.includes("akun") || statusMessage.includes("siap")
          }
        />
        <StepItem
          label="Bagan Akun (CoA)"
          active={statusMessage.includes("siap")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 40 },
  statusText: { marginTop: 20, textAlign: "center" },
  stepperWrapper: { marginTop: 40, width: "100%" },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F2F2F7",
    padding: 15,
    borderRadius: 12,
  },
  stepText: { marginLeft: 10 },
});
