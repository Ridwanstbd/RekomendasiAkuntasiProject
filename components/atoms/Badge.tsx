import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "./Typography";

interface BadgeProps {
  label: string;
  color: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
      <Typography variant="body" style={[styles.text, { color: color }]}>
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
