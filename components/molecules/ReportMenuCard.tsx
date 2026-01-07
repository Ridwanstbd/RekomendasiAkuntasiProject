import React from "react";
import { View, StyleSheet } from "react-native";
import { PressableCard } from "../atoms/PressableCard";
import { Typography } from "../atoms/Typography";
import { LucideIcon, ChevronRight } from "lucide-react-native";

interface ReportMenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onPress: () => void;
}

export const ReportMenuCard: React.FC<ReportMenuCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onPress,
}) => (
  <PressableCard onPress={onPress} style={styles.card}>
    <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
      <Icon size={22} color={color} />
    </View>
    <View style={styles.content}>
      <Typography variant="body" style={styles.title}>
        {title}
      </Typography>
      <Typography variant="body" style={styles.desc}>
        {description}
      </Typography>
    </View>
    <ChevronRight size={20} color="#C7C7CC" />
  </PressableCard>
);

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: { flex: 1 },
  title: { fontWeight: "700", color: "#1C1C1E" },
  desc: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
});
